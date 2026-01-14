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
        noResults.textContent = 'No sites found matching your criteria.';
        searchResultsContainer.appendChild(noResults);
        return;
    }

    const fragment = document.createDocumentFragment();

    features.forEach(feature => {
        const { name, category, description, image_url } = feature.properties;
        const [lng, lat] = feature.geometry.coordinates;

        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';

        // Thumbnail
        if (image_url) {
            const thumbnailDiv = document.createElement('div');
            thumbnailDiv.className = 'result-thumbnail';
            const img = document.createElement('img');
            img.src = image_url;
            img.alt = name;
            img.loading = "lazy";
            thumbnailDiv.appendChild(img);
            resultItem.appendChild(thumbnailDiv);
        }

        // Content Wrapper
        const contentDiv = document.createElement('div');
        contentDiv.className = 'result-content';

        // Add content
        const title = document.createElement('div');
        title.className = 'result-title';
        title.textContent = name;

        const meta = document.createElement('div');
        meta.className = 'result-meta';
        meta.textContent = category;

        contentDiv.appendChild(title);
        contentDiv.appendChild(meta);

        if (description) {
            const desc = document.createElement('div');
            desc.className = 'result-desc';
            desc.textContent = description;
            contentDiv.appendChild(desc);
        }

        resultItem.appendChild(contentDiv);

        resultItem.addEventListener('click', () => {
            if (!isNaN(lat) && !isNaN(lng)) {
                map.flyTo([lat, lng], 14, {
                    animate: true,
                    duration: 1.5
                });

                // Collapse sidebar on mobile to show the map
                if (window.innerWidth <= 768) {
                    const sidebar = document.getElementById('sidebar');
                    sidebar.classList.remove('expanded');
                    sidebar.style.transform = ''; // Clear any inline styles
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

    if (!handle) return;

    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    let startTransform = 0;

    // Helper to get current transform Y value
    const getTranslateY = (element) => {
        const style = window.getComputedStyle(element);
        const matrix = new WebKitCSSMatrix(style.transform);
        return matrix.m42;
    };

    handle.addEventListener('click', () => {
        if (!isDragging) {
            sidebar.classList.toggle('expanded');
            sidebar.style.transform = ''; // Clear inline style to let CSS take over
        }
    });

    handle.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        isDragging = true;
        sidebar.classList.add('dragging');
        startTransform = getTranslateY(sidebar);
    }, { passive: true });

    handle.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;

        // Calculate new position
        // If we are starting from expanded (0), deltaY > 0 means dragging down (positive)
        // If we are starting from collapsed (large positive), deltaY < 0 means dragging up (negative)

        let newTranslateY = startTransform + deltaY;

        // Constraint: Don't drag above 0 (fully expanded)
        if (newTranslateY < 0) newTranslateY = 0;

        sidebar.style.transform = `translateY(${newTranslateY}px)`;
    }, { passive: true });

    handle.addEventListener('touchend', (e) => {
        isDragging = false;
        sidebar.classList.remove('dragging');

        const endY = e.changedTouches[0].clientY;
        const deltaY = endY - startY;
        const threshold = 50; // pixels to snap

        // If dragged significantly
        if (Math.abs(deltaY) > threshold) {
            if (deltaY > 0) {
                // Dragged down -> Collapse
                sidebar.classList.remove('expanded');
            } else {
                // Dragged up -> Expand
                sidebar.classList.add('expanded');
            }
        } else {
            // Revert to closest state based on current class
            // (The removal of 'dragging' class restores the transition)
        }

        sidebar.style.transform = ''; // Clear inline styles so CSS classes take over
    });

    if (searchInput) {
        searchInput.addEventListener('focus', () => {
            // Auto expand when searching on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.add('expanded');
            }
        });
    }
}
