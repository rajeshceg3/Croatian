import { initializeMap, updateMarkers, highlightMarker, unhighlightMarker, openMarkerPopup, toggleMapTheme, drawRoute, clearRoute } from './map-module.js';
import { createCategoryFilters, updateSearchResults, addSearchListener, addClearFiltersListener, setupMobileInteractions, setupScrollEffects, getFavorites, getVisited, setupSurpriseMe, renderCollections, setupTravelTips, openDetailPanel, setupShareTrip, setupMyTripModal, setupSuggestedRoutes, setupOnboarding, setupThemeToggle, setupBadges, setupQuestSystem, getActiveQuestTargets, setupVibeMatcher } from './ui-module.js';
import { fetchData } from './api-module.js';

const map = initializeMap();

// Near Me Feature
const nearMeBtn = document.getElementById('near-me-btn');
if (nearMeBtn) {
    nearMeBtn.addEventListener('click', () => {
        const svg = nearMeBtn.querySelector('svg');
        if (svg) svg.style.animation = 'spin 1s infinite linear';
        map.locate({setView: true, maxZoom: 10});
    });
}

map.on('locationfound', (e) => {
    const svg = nearMeBtn ? nearMeBtn.querySelector('svg') : null;
    if (svg) svg.style.animation = '';

    if (window.userLocationMarker) map.removeLayer(window.userLocationMarker);
    if (window.userLocationCircle) map.removeLayer(window.userLocationCircle);

    window.userLocationMarker = L.marker(e.latlng, {
        icon: L.divIcon({
            className: 'custom-marker-icon',
            html: '<div class="user-location-marker"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        })
    }).addTo(map)
      .bindPopup("You are here")
      .openPopup();

    window.userLocationCircle = L.circle(e.latlng, e.accuracy).addTo(map);
});

map.on('locationerror', (e) => {
    const svg = nearMeBtn ? nearMeBtn.querySelector('svg') : null;
    if (svg) svg.style.animation = '';
    // Use a simpler alert for now
    console.warn("Location error:", e.message);
    alert("Unable to find your location. Please check your browser permissions.");
});

let allFeatures = [];
let currentFilteredFeatures = [];

function filterSites() {
    const searchText = document.getElementById('search-input').value.toLowerCase();

    // Updated to query active chips
    const activeChips = Array.from(document.querySelectorAll('.filter-chip.active'));
    const showFavoritesOnly = activeChips.some(chip => chip.dataset.value === 'favorites');
    const showVisitedOnly = activeChips.some(chip => chip.dataset.value === 'visited');

    // Filter out 'favorites' and 'visited' from category list
    const selectedCategories = activeChips
        .map(chip => chip.dataset.value)
        .filter(val => val !== 'favorites' && val !== 'visited');

    // Check for active collection
    const activeCollection = document.querySelector('.collection-chip.active');
    const activeCollectionTag = activeCollection ? activeCollection.dataset.collection : null;

    // Check for active price filters
    const activePriceBtns = document.querySelectorAll('.price-btn.active');
    const activePrices = Array.from(activePriceBtns).map(btn => parseInt(btn.dataset.price));

    // Check for active quick filters
    const activeQuickFilters = Array.from(document.querySelectorAll('.quick-filter-chip.active')).map(c => c.dataset.filter);

    // Context Filters
    const seasonFilter = document.getElementById('season-filter') ? document.getElementById('season-filter').value : '';
    const durationFilter = document.getElementById('duration-filter') ? document.getElementById('duration-filter').value : '';

    // Check for active quest
    const activeQuestTargets = getActiveQuestTargets();

    let features = allFeatures;

    if (activeQuestTargets) {
        features = features.filter(feature => activeQuestTargets.includes(feature.properties.name));
    }

    if (showFavoritesOnly) {
        const favorites = getFavorites();
        features = features.filter(feature => favorites.includes(feature.properties.name));
    }

    if (showVisitedOnly) {
        const visited = getVisited();
        features = features.filter(feature => visited.includes(feature.properties.name));
    }

    if (activeCollectionTag) {
        features = features.filter(feature => {
            if (activeCollectionTag === 'Photography') {
                return (feature.properties.tags && feature.properties.tags.includes('Photography')) ||
                       feature.properties.photospot;
            }
            return feature.properties.tags && feature.properties.tags.includes(activeCollectionTag);
        });
    }

    if (activePrices.length > 0) {
        features = features.filter(feature => {
            return activePrices.includes(feature.properties.price_level);
        });
    }

    if (activeQuickFilters.length > 0) {
        features = features.filter(feature => {
            let match = true;
            if (activeQuickFilters.includes('must_visit')) {
                if (!feature.properties.rating || feature.properties.rating < 4.8) match = false;
            }
            if (activeQuickFilters.includes('beach')) {
                const isBeach = feature.properties.category === 'coastal' || (feature.properties.tags && feature.properties.tags.includes('Beach'));
                if (!isBeach) match = false;
            }
            if (activeQuickFilters.includes('hidden_gem')) {
                const isHidden = feature.properties.tags && (feature.properties.tags.includes('Hidden Gem') || feature.properties.tags.includes('Unique'));
                if (!isHidden) match = false;
            }
            return match;
        });
    }

    if (seasonFilter) {
        features = features.filter(feature => {
            const bt = (feature.properties.best_time || "").toLowerCase();
            if (bt.includes('year')) return true;

            if (seasonFilter === 'spring') {
                return bt.includes('spring') || bt.includes('may') || bt.includes('apr') || bt.includes('mar');
            }
            if (seasonFilter === 'summer') {
                return bt.includes('summer') || bt.includes('jun') || bt.includes('jul') || bt.includes('aug') || bt.includes('sep');
            }
            if (seasonFilter === 'autumn') {
                return bt.includes('autumn') || bt.includes('sep') || bt.includes('oct') || bt.includes('nov');
            }
            if (seasonFilter === 'winter') {
                return bt.includes('winter') || bt.includes('dec') || bt.includes('jan') || bt.includes('feb');
            }
            return true;
        });
    }

    if (durationFilter) {
        features = features.filter(feature => {
            const d = (feature.properties.duration || "").toLowerCase();
            if (durationFilter === 'quick') {
                return d.includes('min') || d === '1 hour' || d === '1-2 hours';
            }
            if (durationFilter === 'half') {
                return d.includes('2') || d.includes('3') || d.includes('4');
            }
            if (durationFilter === 'full') {
                return d.includes('5') || d.includes('6') || d.includes('full') || d.includes('day');
            }
            return true;
        });
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

    // Sort Logic
    const sortValue = document.getElementById('sort-select').value;
    features.sort((a, b) => {
        const propsA = a.properties;
        const propsB = b.properties;

        if (sortValue === 'rating_desc') {
            return (propsB.rating || 0) - (propsA.rating || 0);
        } else if (sortValue === 'price_asc') {
            return (propsA.price_level || 0) - (propsB.price_level || 0);
        } else if (sortValue === 'price_desc') {
            return (propsB.price_level || 0) - (propsA.price_level || 0);
        } else {
            // Default: Recommended (Keep original order or specific logic)
            return 0;
        }
    });

    currentFilteredFeatures = features;
    updateMarkers(map, currentFilteredFeatures, (feature) => openDetailPanel(feature, allFeatures));
    updateSearchResults(map, currentFilteredFeatures, highlightMarker, unhighlightMarker, allFeatures);

    // Route Drawing Logic
    if (showFavoritesOnly && features.length > 1) {
        drawRoute(features);
    } else {
        clearRoute();
    }
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

        // Setup Collections
        const collections = [
            { name: "UNESCO Gems", tag: "UNESCO", icon: "🏛️" },
            { name: "Game of Thrones", tag: "Game of Thrones", icon: "🐉" },
            { name: "Best Sunsets", tag: "Sunset", icon: "🌅" },
            { name: "Hidden Gems", tag: "Hidden Gem", icon: "💎" },
            { name: "Photography", tag: "Photography", icon: "📸" },
            { name: "Food & Wine", tag: "Food", icon: "🍷" },
            { name: "Islands", tag: "Islands", icon: "🏝️" },
            { name: "Family Friendly", tag: "Family Friendly", icon: "👨‍👩‍👧‍👦" }
        ];
        renderCollections(collections, filterSites);
        setupTravelTips();
        setupMyTripModal(allFeatures);
        setupSuggestedRoutes(allFeatures);
        setupShareTrip();
        setupBadges(allFeatures);
        setupQuestSystem(allFeatures, filterSites);

        document.getElementById('sort-select').addEventListener('change', filterSites);
        addSearchListener(filterSites);
        addClearFiltersListener(filterSites);

        // Setup Price Filter Listeners
        document.querySelectorAll('.price-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                filterSites();
            });
        });

        // Setup Quick Filter Listeners
        document.querySelectorAll('.quick-filter-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                filterSites();
            });
        });

        setupMobileInteractions();
        setupScrollEffects();
        setupSurpriseMe(map, () => currentFilteredFeatures, openMarkerPopup);
        setupThemeToggle(toggleMapTheme);
        setupOnboarding();
        setupVibeMatcher(filterSites);
        filterSites(); // Populate map and results on initial load

        // Deep Linking: Check URL params
        const urlParams = new URLSearchParams(window.location.search);
        const siteParam = urlParams.get('site');
        const tripParam = urlParams.get('trip');

        if (tripParam) {
            const sharedFavs = tripParam.split(',');
            const localFavs = getFavorites();
            const merged = [...new Set([...localFavs, ...sharedFavs])];
            localStorage.setItem('croatia_favorites', JSON.stringify(merged));

            // Notify app of changes
            document.dispatchEvent(new CustomEvent('favoritesUpdated'));

            // Auto-activate favorites filter
            const favChip = document.querySelector('.filter-chip[data-value="favorites"]');
            if (favChip) {
                favChip.classList.add('active');
                filterSites(); // Refresh view
            }

            // Provide visual feedback
            const myTripBtn = document.getElementById('my-trip-btn');
            if (myTripBtn) {
                myTripBtn.click(); // Open the modal so they see the trip immediately
            }
        }

        // Listen for flyToSite event from My Trip list
        document.addEventListener('flyToSite', (e) => {
            const { lat, lng, name } = e.detail;
            map.flyTo([lat, lng], 16, { animate: true, duration: 1.5 });

            // Find feature and open detail panel
            const feature = allFeatures.find(f => f.properties.name === name);
            if (feature) {
                // Wait slightly for flyTo to start
                setTimeout(() => {
                    openDetailPanel(feature, allFeatures);
                    // Ensure sidebar is expanded on mobile
                    if (window.innerWidth <= 768) {
                        const sidebar = document.getElementById('sidebar');
                        if (sidebar) sidebar.classList.add('expanded');
                    }
                }, 500);
            }
        });

        if (siteParam) {
            const feature = allFeatures.find(f => f.properties.name === siteParam);
            if (feature) {
                const [lng, lat] = feature.geometry.coordinates;
                map.flyTo([lat, lng], 16, { animate: true, duration: 2 });
                setTimeout(() => {
                    // Open the detail panel instead of just the popup
                    openDetailPanel(feature, allFeatures);
                    // Also zoom to it (handled by flyTo), but ensure we show it in sidebar
                    if (window.innerWidth <= 768) {
                        const sidebar = document.getElementById('sidebar');
                        sidebar.classList.add('expanded');
                    }
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
