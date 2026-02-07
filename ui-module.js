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
        // Capitalize first letter
        chip.textContent = category.charAt(0).toUpperCase() + category.slice(1);

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

    features.forEach((feature, index) => {
        const { name, category, description, image_url } = feature.properties;
        const [lng, lat] = feature.geometry.coordinates;

        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item animate-in';
        resultItem.style.animationDelay = `${index * 0.05}s`;

        // Thumbnail
        const thumbnailDiv = document.createElement('div');
        thumbnailDiv.className = 'result-thumbnail';

        if (image_url) {
            const img = document.createElement('img');
            img.src = image_url;
            img.alt = name;
            img.loading = "lazy";
            img.onerror = () => {
                img.style.display = 'none';
                thumbnailDiv.style.background = '#e6ebf1'; // Fallback color
                thumbnailDiv.innerHTML = `<span style="display:flex;justify-content:center;align-items:center;height:100%;color:#8792a2;font-weight:600;">${name.charAt(0)}</span>`;
            };
            thumbnailDiv.appendChild(img);
        } else {
             thumbnailDiv.style.background = '#e6ebf1';
             thumbnailDiv.innerHTML = `<span style="display:flex;justify-content:center;align-items:center;height:100%;color:#8792a2;font-weight:600;">${name.charAt(0)}</span>`;
        }
        resultItem.appendChild(thumbnailDiv);

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
                map.flyTo([lat, lng], 16, {
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

        // Hover effect on map marker could be added here if we had a reference to the markers

        fragment.appendChild(resultItem);
    });

    searchResultsContainer.appendChild(fragment);
}

export function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

export function addSearchListener(filterCallback) {
    document.getElementById('search-input').addEventListener('input', debounce(filterCallback, 250));
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
    let rafId = null;

    // Helper to get current transform Y value
    const getTranslateY = (element) => {
        const style = window.getComputedStyle(element);
        const matrix = new WebKitCSSMatrix(style.transform);
        return matrix.m42;
    };

    handle.addEventListener('click', (e) => {
        // Simple toggle if not dragging (logic handled by touch events mostly,
        // but this catches mouse clicks or quick taps if touch logic misses)
        // We rely on touch end for taps usually, but let's keep this as fallback/desktop
        if (!isDragging) {
             // Logic to determine if it was a drag is handled in touchend
        }
    });

    handle.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        isDragging = true;
        sidebar.classList.add('dragging'); // Removes transition
        startTransform = getTranslateY(sidebar);

        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }, { passive: true });

    handle.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;

        // Calculate new position
        let newTranslateY = startTransform + deltaY;

        // Resistance logic
        // If pulling up past 0 (expanded limit)
        if (newTranslateY < 0) {
             // Apply log resistance or square root resistance
             newTranslateY = -1 * Math.sqrt(Math.abs(newTranslateY) * 5);
        }

        rafId = requestAnimationFrame(() => {
            sidebar.style.transform = `translateY(${newTranslateY}px)`;
        });
    }, { passive: true });

    handle.addEventListener('touchend', (e) => {
        isDragging = false;
        if (rafId) cancelAnimationFrame(rafId);

        sidebar.classList.remove('dragging'); // Restores transition

        const endY = e.changedTouches[0].clientY;
        const deltaY = endY - startY;
        const threshold = 50; // pixels to snap

        // Determine if it was a tap (minimal movement)
        if (Math.abs(deltaY) < 5) {
            sidebar.classList.toggle('expanded');
        } else {
            // It was a drag
            // Directional snap
            if (deltaY < -threshold) {
                // Dragged up
                sidebar.classList.add('expanded');
            } else if (deltaY > threshold) {
                // Dragged down
                sidebar.classList.remove('expanded');
            } else {
                // Snap to nearest
                 const currentTransform = getTranslateY(sidebar);
                 const windowHeight = window.innerHeight;
                 // Expanded is 0, Collapsed is ~ windowHeight - 150
                 const collapsedTransform = windowHeight - 150;

                 if (currentTransform < collapsedTransform / 2) {
                     sidebar.classList.add('expanded');
                 } else {
                     sidebar.classList.remove('expanded');
                 }
            }
        }

        // Clear inline style to let CSS class take over
        // Since we removed .dragging, the transition is back.
        // Changing from inline pixel value to CSS class value will trigger the transition.
        sidebar.style.transform = '';
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

export function setupScrollEffects() {
    const sidebarContent = document.querySelector('.sidebar-content');
    if (sidebarContent) {
        sidebarContent.addEventListener('scroll', () => {
            if (sidebarContent.scrollTop > 10) {
                sidebarContent.classList.add('scrolled');
            } else {
                sidebarContent.classList.remove('scrolled');
            }
        });
    }
}
