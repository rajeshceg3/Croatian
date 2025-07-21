// This module will handle UI-related functionalities.
export function createCategoryFilters(categories, filterCallback) {
    const filtersContainer = document.getElementById('category-filters');
    categories.forEach(category => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = category.toLowerCase();
        checkbox.value = category.toLowerCase();
        checkbox.checked = true;
        checkbox.addEventListener('change', filterCallback);

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.appendChild(document.createTextNode(category));

        const br = document.createElement('br');

        filtersContainer.appendChild(checkbox);
        filtersContainer.appendChild(label);
        filtersContainer.appendChild(br);
    });
}

let displayedFeatures = [];

export function updateSearchResults(map, features) {
    const searchResultsContainer = document.getElementById('search-results');
    const newFeatureNames = new Set(features.map(f => f.properties.name));
    const oldFeatureNames = new Set(displayedFeatures.map(f => f.properties.name));

    // Remove old results that are not in the new list
    displayedFeatures.forEach(feature => {
        if (!newFeatureNames.has(feature.properties.name)) {
            const elementToRemove = document.getElementById(`result-${feature.properties.name.replace(/\s+/g, '-')}`);
            if (elementToRemove) {
                searchResultsContainer.removeChild(elementToRemove);
            }
        }
    });

    // Add new results that are not in the old list
    features.forEach(feature => {
        if (!oldFeatureNames.has(feature.properties.name)) {
            const { name } = feature.properties;
            const [lng, lat] = feature.geometry.coordinates;
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.textContent = name;
            resultItem.id = `result-${name.replace(/\s+/g, '-')}`;
            resultItem.addEventListener('click', () => {
                map.flyTo([lat, lng], 14);
            });
            searchResultsContainer.appendChild(resultItem);
        }
    });

    displayedFeatures = features;
}

export function addSearchListener(filterCallback) {
    document.getElementById('search-input').addEventListener('input', filterCallback);
}

export function addClearFiltersListener(filterCallback, clearCallback) {
    document.getElementById('clear-filters').addEventListener('click', () => {
        document.getElementById('search-input').value = '';
        const checkboxes = document.querySelectorAll('#category-filters input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        filterCallback();
        if (clearCallback) {
            clearCallback();
        }
    });
}
