// This module will handle UI-related functionalities.
export function createCategoryFilters(categories, filterCallback) {
    const filtersContainer = document.getElementById('category-filters');
    filtersContainer.innerHTML = '<h4>Filter by Category:</h4>'; // Reset and add header
    const filtersList = document.createElement('div');
    filtersList.className = 'filters-list';

    categories.forEach(category => {
        const chip = document.createElement('button');
        chip.className = 'filter-chip';
        chip.type = 'button';
        chip.dataset.value = category.toLowerCase();
        chip.textContent = category;

        chip.addEventListener('click', () => {
            chip.classList.toggle('active');
            filterCallback();
        });

        filtersList.appendChild(chip);
    });
    filtersContainer.appendChild(filtersList);
}

export function updateSearchResults(map, features) {
    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.innerHTML = ''; // Clear previous results

    if (features.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = 'No sites found.';
        searchResultsContainer.appendChild(noResults);
        return;
    }

    const fragment = document.createDocumentFragment();

    features.forEach(feature => {
        const { name, category, description } = feature.properties;
        const [lng, lat] = feature.geometry.coordinates;

        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';

        // Add content
        const title = document.createElement('div');
        title.className = 'result-title';
        title.textContent = name;

        const meta = document.createElement('div');
        meta.className = 'result-meta';
        meta.textContent = category;

        resultItem.appendChild(title);
        resultItem.appendChild(meta);

        resultItem.addEventListener('click', () => {
            if (!isNaN(lat) && !isNaN(lng)) {
                map.flyTo([lat, lng], 14);
                // Collapse sidebar on mobile to show the map
                if (window.innerWidth <= 768) {
                    document.getElementById('sidebar').classList.remove('expanded');
                }
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
        const chips = document.querySelectorAll('.filter-chip');
        chips.forEach(chip => {
            chip.classList.remove('active');
        });
        filterCallback();
    });
}

export function setupMobileInteractions() {
    const sidebar = document.getElementById('sidebar');
    const handle = document.getElementById('mobile-handle-container');
    const searchInput = document.getElementById('search-input');

    if (handle) {
        handle.addEventListener('click', () => {
            sidebar.classList.toggle('expanded');
        });
    }

    if (searchInput) {
        searchInput.addEventListener('focus', () => {
            // Auto expand when searching on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.add('expanded');
            }
        });
    }
}
