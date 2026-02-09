import { initializeMap, updateMarkers, highlightMarker, unhighlightMarker, openMarkerPopup } from './map-module.js';
import { createCategoryFilters, updateSearchResults, addSearchListener, addClearFiltersListener, setupMobileInteractions, setupScrollEffects, getFavorites, setupSurpriseMe } from './ui-module.js';
import { fetchData } from './api-module.js';

const map = initializeMap();
let allFeatures = [];
let currentFilteredFeatures = [];

function filterSites() {
    const searchText = document.getElementById('search-input').value.toLowerCase();

    // Updated to query active chips
    const activeChips = Array.from(document.querySelectorAll('.filter-chip.active'));
    const showFavoritesOnly = activeChips.some(chip => chip.dataset.value === 'favorites');

    // Filter out 'favorites' from category list
    const selectedCategories = activeChips
        .map(chip => chip.dataset.value)
        .filter(val => val !== 'favorites');

    let features = allFeatures;

    if (showFavoritesOnly) {
        const favorites = getFavorites();
        features = features.filter(feature => favorites.includes(feature.properties.name));
    }

    if (selectedCategories.length > 0) {
        features = features.filter(feature => {
            const category = feature.properties.category.toLowerCase();
            return selectedCategories.includes(category);
        });
    }

    if (searchText) {
        features = features.filter(feature => {
            const name = feature.properties.name.toLowerCase();
            return name.includes(searchText);
        });
    }

    currentFilteredFeatures = features;
    updateMarkers(map, currentFilteredFeatures);
    updateSearchResults(map, currentFilteredFeatures, highlightMarker, unhighlightMarker);
}

// Listen for favorites updates
document.addEventListener('favoritesUpdated', () => {
    filterSites();
});

// Show loading
const loader = document.getElementById('loading-overlay');

fetchData()
    .then(data => {
        allFeatures = data.features;
        const categories = [...new Set(allFeatures.map(feature => feature.properties.category))];
        createCategoryFilters(categories, filterSites);
        addSearchListener(filterSites);
        addClearFiltersListener(filterSites);
        setupMobileInteractions();
        setupScrollEffects();
        setupSurpriseMe(map, () => currentFilteredFeatures, openMarkerPopup);
        filterSites(); // Populate map and results on initial load

        // Deep Linking: Check URL params
        const urlParams = new URLSearchParams(window.location.search);
        const siteParam = urlParams.get('site');
        if (siteParam) {
            const feature = allFeatures.find(f => f.properties.name === siteParam);
            if (feature) {
                const [lng, lat] = feature.geometry.coordinates;
                map.flyTo([lat, lng], 16, { animate: true, duration: 2 });
                // Use a timeout to allow cluster/map to settle slightly, though zoomToShowLayer handles it mostly
                setTimeout(() => {
                    openMarkerPopup(siteParam);
                }, 500);
            }
        }

        // Update URL on interaction
        map.on('popupopen', (e) => {
            const marker = e.popup._source;
            if (marker && marker.featureName) {
                const url = new URL(window.location);
                url.searchParams.set('site', marker.featureName);
                window.history.pushState({}, '', url);
            }
        });

        map.on('popupclose', () => {
            const url = new URL(window.location);
            url.searchParams.delete('site');
            window.history.pushState({}, '', url);
        });

        // Hide loading
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300);

        console.log("Map initialized and data loaded.");
    })
    .catch(error => {
        console.error('Failed to load site data.', error);
        loader.innerHTML = '<div style="text-align:center; padding: 20px;">Failed to load data.<br>Please try refreshing the page.</div>';
    });
