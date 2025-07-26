import { initializeMap, updateMarkers } from './map-module.js';
import { createCategoryFilters, updateSearchResults, addSearchListener, addClearFiltersListener } from './ui-module.js';
import { fetchData } from './api-module.js';

const map = initializeMap();
let allFeatures = [];

function filterSites() {
    const searchText = document.getElementById('search-input').value.toLowerCase();
    const selectedCategories = Array.from(document.querySelectorAll('#category-filters input:checked')).map(cb => cb.value);

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

fetchData()
    .then(data => {
        allFeatures = data.features;
        const categories = [...new Set(allFeatures.map(feature => feature.properties.category))];
        createCategoryFilters(categories, filterSites);
        addSearchListener(filterSites);
        addClearFiltersListener(filterSites);
        filterSites(); // Populate map and results on initial load
        console.log("Map initialized and data loading initiated with custom icons logic.");
    })
    .catch(error => {
        console.error('Error fetching or processing GeoJSON data:', error);
    });
