// This module will handle UI-related functionalities.
export function createCategoryFilters(categories, filterCallback) {
    const filtersContainer = document.getElementById('category-filters');
    categories.forEach(category => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = category.toLowerCase();
        checkbox.value = category.toLowerCase();
        checkbox.checked = false;
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
    searchResultsContainer.innerHTML = ''; // Clear previous results
    const fragment = document.createDocumentFragment();

    features.forEach(feature => {
        const { name } = feature.properties;
        const [lng, lat] = feature.geometry.coordinates;

        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.textContent = name; // Use textContent to prevent XSS
        resultItem.dataset.lat = lat;
        resultItem.dataset.lng = lng;

        resultItem.addEventListener('click', () => {
            if (!isNaN(lat) && !isNaN(lng)) {
                map.flyTo([lat, lng], 14);
            }
        });

        fragment.appendChild(resultItem);
    });

    searchResultsContainer.appendChild(fragment);
}

export function addSearchListener(filterCallback) {
    document.getElementById('search-input').addEventListener('input', filterCallback);
}

export function addClearFiltersListener(filterCallback) {
    document.getElementById('clear-filters').addEventListener('click', () => {
        document.getElementById('search-input').value = '';
        const checkboxes = document.querySelectorAll('#category-filters input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        filterCallback();
    });
}
