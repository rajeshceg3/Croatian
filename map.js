import { initializeMap, updateMarkers } from './map-module.js';
import { createCategoryFilters, updateSearchResults, addSearchListener, addClearFiltersListener, setupMobileInteractions } from './ui-module.js';
import { fetchData } from './api-module.js';

const map = initializeMap();
let allFeatures = [];

function filterSites() {
    const searchText = document.getElementById('search-input').value.toLowerCase();
    // Updated to query active chips
    const selectedCategories = Array.from(document.querySelectorAll('.filter-chip.active')).map(chip => chip.dataset.value);

    let filteredFeatures = allFeatures;

    if (selectedCategories.length > 0) {
        filteredFeatures = filteredFeatures.filter(feature => {
            const category = feature.properties.category.toLowerCase();
            return selectedCategories.includes(category);
        });
    }

    if (searchText) {
        filteredFeatures = filteredFeatures.filter(feature => {
            const name = feature.properties.name.toLowerCase();
            return name.includes(searchText);
        });
    }

    updateMarkers(map, filteredFeatures);
    updateSearchResults(map, filteredFeatures);
}

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
        filterSites(); // Populate map and results on initial load

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
