// This module will handle UI-related functionalities.

export function getFavorites() {
    try {
        const favorites = localStorage.getItem('croatia_favorites');
        return favorites ? JSON.parse(favorites) : [];
    } catch (e) {
        console.error("Error reading favorites", e);
        return [];
    }
}

export function toggleFavorite(name, callback) {
    const favorites = getFavorites();
    const index = favorites.indexOf(name);
    if (index === -1) {
        favorites.push(name);
    } else {
        favorites.splice(index, 1);
    }
    localStorage.setItem('croatia_favorites', JSON.stringify(favorites));
    if (callback) callback();
}

export function getVisited() {
    try {
        const visited = localStorage.getItem('croatia_visited');
        return visited ? JSON.parse(visited) : [];
    } catch (e) {
        console.error("Error reading visited", e);
        return [];
    }
}

export function toggleVisited(name, callback) {
    const visited = getVisited();
    const index = visited.indexOf(name);
    if (index === -1) {
        visited.push(name);
    } else {
        visited.splice(index, 1);
    }
    localStorage.setItem('croatia_visited', JSON.stringify(visited));
    if (callback) callback();
}

const categoryIcons = {
    // Cleaner, more geometric icons (Stripe-inspired simplicity)
    "historical": `<path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5 9.5 9.75 12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>`,
    "natural": `<path fill="currentColor" d="M17 8C8 10 5.9 16.17 3.82 21.34 3.32 22.58 4.75 23.5 6 23.5c4 0 9.17-2.17 11.17-4.17S21 14 21 14s-3.17 1.83-4 6C16 11 15 8 15 8s-3-3-2-5c1 2 4 5 4 5zM8 12c-1 0-1-2 0-2 1 0 1 2 0 2z"/>`,
    "cultural": `<path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>`,
    "coastal": `<path fill="currentColor" d="M21 15.61a12.65 12.65 0 0 1-5.14-1.17c-.45-.19-1.29-.19-1.8 0a12.65 12.65 0 0 0-4.12 1.17 12.65 12.65 0 0 1-4.12 1.17c-1.32 0-2.55-.38-3.82-1.17v-8a12.65 12.65 0 0 1 3.82 1.17c.45.19 1.29.19 1.8 0a12.65 12.65 0 0 0 4.12-1.17 12.65 12.65 0 0 1 4.12-1.17c.45-.19 1.29-.19 1.8 0a12.65 12.65 0 0 0 3.34 1.17V15.61zM12 2a3 3 0 0 0-3 3v2h6V5a3 3 0 0 0-3-3z"/>`,
    "gastronomy": `<path fill="currentColor" d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V22.99zM7.5 12c1.93 0 3.5-1.57 3.5-3.5V2H4v6.5C4 10.43 5.57 12 7.5 12zm0-8.5h1v4h-1v-4zm-2.5 0h1v4H5v-4zM11 20H4v2h7v-2zm.48-5.32l.74 7.32h1.63l-.74-7.32c-.08-.82-.77-1.46-1.63-1.46z"/>`,
    "adventure": `<path fill="currentColor" d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V12h2V8.9z"/>`,
    "default": `<path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5-2.5 2.5z"/>`
};

export function createCategoryFilters(categories, filterCallback) {
    const filtersContainer = document.getElementById('category-filters');
    filtersContainer.innerHTML = '<h4>Filter by Category:</h4>'; // Reset and add header
    const filtersList = document.createElement('div');
    filtersList.className = 'filters-list';

    // Context Filters (Season & Duration) - Added at the top for visibility or bottom?
    // Let's add them AFTER categories to keep the flow

    // Favorites Filter
    const favChip = document.createElement('button');
    favChip.className = 'filter-chip favorites-filter';
    favChip.type = 'button';
    favChip.dataset.value = 'favorites';
    favChip.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="color: inherit;">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        Favorites
    `;
    favChip.addEventListener('click', () => {
        favChip.classList.toggle('active');
        filterCallback();
    });
    filtersList.appendChild(favChip);

    // Visited Filter
    const visitedChip = document.createElement('button');
    visitedChip.className = 'filter-chip visited-filter';
    visitedChip.type = 'button';
    visitedChip.dataset.value = 'visited';
    visitedChip.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="color: inherit;">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Visited
    `;
    visitedChip.addEventListener('click', () => {
        visitedChip.classList.toggle('active');
        filterCallback();
    });
    filtersList.appendChild(visitedChip);

    categories.forEach(category => {
        const chip = document.createElement('button');
        chip.className = 'filter-chip';
        chip.type = 'button';
        chip.dataset.value = category.toLowerCase();

        const catKey = category.toLowerCase();
        const iconPath = categoryIcons[catKey] || categoryIcons['default'];

        // Capitalize first letter and add icon
        chip.innerHTML = `
            <svg class="category-icon" viewBox="0 0 24 24">
                ${iconPath}
            </svg>
            ${category.charAt(0).toUpperCase() + category.slice(1)}
        `;

        chip.addEventListener('click', () => {
            chip.classList.toggle('active');
            filterCallback();
        });

        filtersList.appendChild(chip);
    });
    filtersContainer.appendChild(filtersList);

    // Add Context Filters (Season/Duration)
    const contextHeader = document.createElement('h4');
    contextHeader.style.marginTop = '16px';
    contextHeader.textContent = 'Plan Your Visit:';
    filtersContainer.appendChild(contextHeader);

    const contextGrid = document.createElement('div');
    contextGrid.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;';

    contextGrid.innerHTML = `
        <div class="select-wrapper" style="width:100%;">
            <select id="season-filter" style="width:100%;">
                <option value="">Any Season</option>
                <option value="spring">Spring</option>
                <option value="summer">Summer</option>
                <option value="autumn">Autumn</option>
                <option value="winter">Winter</option>
            </select>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="right:8px;"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
        <div class="select-wrapper" style="width:100%;">
            <select id="duration-filter" style="width:100%;">
                <option value="">Any Duration</option>
                <option value="quick">Quick (< 2h)</option>
                <option value="half">Half Day (2-5h)</option>
                <option value="full">Full Day (+5h)</option>
            </select>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="right:8px;"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
    `;
    filtersContainer.appendChild(contextGrid);

    // Bind events
    const sFilter = document.getElementById('season-filter');
    const dFilter = document.getElementById('duration-filter');
    if (sFilter) sFilter.addEventListener('change', filterCallback);
    if (dFilter) dFilter.addEventListener('change', filterCallback);
}

export function updateSearchResults(map, features, highlightMarker, unhighlightMarker, allFeatures = []) {
    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.innerHTML = ''; // Clear previous results

    if (features.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <div style="font-size:24px; margin-bottom:8px;">🧐</div>
            <div style="margin-bottom:12px; font-weight:600;">We couldn't find any sites matching your search.</div>
            <div style="font-size:13px; color:var(--text-tertiary); margin-bottom:16px;">Try adjusting your filters or search terms.</div>

            <button id="no-results-clear" class="action-btn" style="border:1px solid var(--border-color); background:white;">
                Clear All Filters
            </button>

            <div style="font-size:12px; color:var(--text-tertiary); margin-top:20px; font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">Or explore:</div>
            <div style="display:flex; justify-content:center; gap:8px; margin-top:12px; flex-wrap:wrap;">
                <button class="filter-chip no-result-chip" data-cat="natural">Natural</button>
                <button class="filter-chip no-result-chip" data-cat="historical">Historical</button>
                <button class="filter-chip no-result-chip" data-cat="coastal">Coastal</button>
            </div>
        `;

        searchResultsContainer.appendChild(noResults);

        // Add listener for clear button
        const clearBtn = noResults.querySelector('#no-results-clear');
        if(clearBtn) {
            clearBtn.addEventListener('click', () => {
                document.getElementById('clear-filters').click();
            });
        }

        // Add listeners
        noResults.querySelectorAll('.no-result-chip').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const cat = btn.dataset.cat;
                // Clear search
                const searchInput = document.getElementById('search-input');
                if (searchInput) searchInput.value = '';

                // Clear current filters
                document.querySelectorAll('#category-filters .filter-chip').forEach(c => c.classList.remove('active'));

                // Activate selected
                const targetChip = document.querySelector(`#category-filters .filter-chip[data-value="${cat}"]`);
                if (targetChip) targetChip.click();
            });
        });
        return;
    }

    const favorites = getFavorites();
    const visited = getVisited();
    const fragment = document.createDocumentFragment();

    features.forEach((feature, index) => {
        const { name, category, description, image_url, price_level, best_time, rating, duration, tags, local_tip } = feature.properties;
        const [lng, lat] = feature.geometry.coordinates;

        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item animate-in';
        resultItem.style.animationDelay = `${index * 0.05}s`;

        // Highlight map marker on hover
        resultItem.addEventListener('mouseenter', () => {
            if (highlightMarker) highlightMarker(name);
        });
        resultItem.addEventListener('mouseleave', () => {
            if (unhighlightMarker) unhighlightMarker(name);
        });

        // Must Visit Badge
        if (rating && rating >= 4.8) {
            const mustVisit = document.createElement('span');
            mustVisit.className = 'must-visit-badge';
            mustVisit.textContent = 'Must Visit';
            resultItem.appendChild(mustVisit);
        }

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

        // Header (Title + Favorite)
        const headerDiv = document.createElement('div');
        headerDiv.style.display = 'flex';
        headerDiv.style.justifyContent = 'space-between';
        headerDiv.style.alignItems = 'flex-start';

        // Add content
        const titleWrapper = document.createElement('div');
        titleWrapper.style.display = 'flex';
        titleWrapper.style.alignItems = 'center';
        titleWrapper.style.gap = '6px';
        titleWrapper.style.flex = '1';

        const title = document.createElement('div');
        title.className = 'result-title';
        title.textContent = name;
        titleWrapper.appendChild(title);

        if (visited.includes(name)) {
            const visitedBadge = document.createElement('span');
            visitedBadge.className = 'visited-indicator';
            visitedBadge.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            visitedBadge.title = "Visited";
            titleWrapper.appendChild(visitedBadge);
        }
        headerDiv.appendChild(titleWrapper);

        // Favorite Button
        const isFav = favorites.includes(name);
        const favBtn = document.createElement('button');
        favBtn.className = `favorite-btn ${isFav ? 'active' : ''}`;
        favBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
        favBtn.title = isFav ? "Remove from Favorites" : "Add to Favorites";
        favBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click
            toggleFavorite(name, () => {
                const newFavs = getFavorites();
                const nowFav = newFavs.includes(name);
                favBtn.classList.toggle('active', nowFav);
                favBtn.querySelector('svg').setAttribute('fill', nowFav ? 'currentColor' : 'none');

                // Dispatch event so map.js or main controller can listen and refresh if needed
                document.dispatchEvent(new CustomEvent('favoritesUpdated'));
            });
        });
        headerDiv.appendChild(favBtn);

        contentDiv.appendChild(headerDiv);

        const meta = document.createElement('div');
        meta.className = 'result-meta';
        meta.textContent = category;
        contentDiv.appendChild(meta);

        // Badge Container
        const badgeContainer = document.createElement('div');
        badgeContainer.style.display = 'flex';
        badgeContainer.style.gap = '8px';
        badgeContainer.style.marginBottom = '6px';
        badgeContainer.style.flexWrap = 'wrap'; // Allow wrapping

        if (price_level) {
            const priceBadge = document.createElement('span');
            priceBadge.className = 'info-badge price-badge';
            priceBadge.textContent = '$'.repeat(price_level);
            badgeContainer.appendChild(priceBadge);
        }

        if (best_time) {
            const timeBadge = document.createElement('span');
            timeBadge.className = 'info-badge time-badge';
            timeBadge.textContent = best_time;
            badgeContainer.appendChild(timeBadge);
        }

        // Duration Badge
        if (duration) {
            const durationBadge = document.createElement('span');
            durationBadge.className = 'duration-badge';
            durationBadge.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ${duration}`;
            badgeContainer.appendChild(durationBadge);
        }

        contentDiv.appendChild(badgeContainer);

        // Description
        if (description) {
            const desc = document.createElement('div');
            desc.className = 'result-desc';
            desc.textContent = description;
            contentDiv.appendChild(desc);
        }

        // Local Tip
        if (local_tip) {
            const tipDiv = document.createElement('div');
            tipDiv.className = 'result-tip';
            tipDiv.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="min-width:12px;"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M12 2v1"></path><path d="M12 7v5"></path><path d="M12 13v.01"></path><path d="M18.36 6.64a9 9 0 0 1 1.63 7.64"></path><path d="M4.01 7.64a9 9 0 0 1 1.63-1"></path></svg> <span>${local_tip}</span>`;
            contentDiv.appendChild(tipDiv);
        }

        // Tags
        if (tags && tags.length > 0) {
            const tagsDiv = document.createElement('div');
            tagsDiv.className = 'result-tags';
            tags.slice(0, 3).forEach(tag => { // Limit to 3 tags
                const tagSpan = document.createElement('span');
                tagSpan.className = 'tag-chip';
                tagSpan.textContent = tag;
                tagsDiv.appendChild(tagSpan);
            });
            contentDiv.appendChild(tagsDiv);
        }

        resultItem.appendChild(contentDiv);

        resultItem.addEventListener('click', () => {
            if (!isNaN(lat) && !isNaN(lng)) {
                map.flyTo([lat, lng], 16, {
                    animate: true,
                    duration: 1.5
                });

                // Open Detail Panel
                openDetailPanel(feature, allFeatures);

                // Ensure sidebar is expanded on mobile to show the panel
                if (window.innerWidth <= 768) {
                    const sidebar = document.getElementById('sidebar');
                    sidebar.classList.add('expanded');
                }
            }
        });

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
    const input = document.getElementById('search-input');
    const clearBtn = document.getElementById('search-clear');

    const debouncedFilter = debounce(filterCallback, 250);

    input.addEventListener('input', (e) => {
        if (clearBtn) {
            if (e.target.value.length > 0) {
                clearBtn.classList.remove('hidden');
            } else {
                clearBtn.classList.add('hidden');
            }
        }
        debouncedFilter();
    });

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            input.value = '';
            clearBtn.classList.add('hidden');
            filterCallback();
            input.focus();
        });
    }
}

export function addClearFiltersListener(filterCallback) {
    document.getElementById('clear-filters').addEventListener('click', () => {
        document.getElementById('search-input').value = '';
        const clearBtn = document.getElementById('search-clear');
        if (clearBtn) clearBtn.classList.add('hidden');

        const chips = document.querySelectorAll('.filter-chip');
        chips.forEach(chip => {
            chip.classList.remove('active');
        });

        // Clear collections too
        const collectionChips = document.querySelectorAll('.collection-chip');
        collectionChips.forEach(chip => chip.classList.remove('active'));

        // Clear price filters
        document.querySelectorAll('.price-btn').forEach(btn => btn.classList.remove('active'));

        // Clear quick filters
        document.querySelectorAll('.quick-filter-chip').forEach(btn => btn.classList.remove('active'));

        // Clear context filters
        const sFilter = document.getElementById('season-filter');
        const dFilter = document.getElementById('duration-filter');
        if (sFilter) sFilter.value = '';
        if (dFilter) dFilter.value = '';

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

export function setupSurpriseMe(map, getFilteredFeatures, openPopupCallback) {
    const btn = document.getElementById('surprise-me');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const features = getFilteredFeatures();
        if (!features || features.length === 0) return;

        const randomFeature = features[Math.floor(Math.random() * features.length)];
        const { name } = randomFeature.properties;
        const [lng, lat] = randomFeature.geometry.coordinates;

        map.flyTo([lat, lng], 16, {
            animate: true,
            duration: 1.5
        });

        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.remove('expanded');
            sidebar.style.transform = '';
        }

        // Open popup after flight
        if (openPopupCallback) {
            openPopupCallback(name);
        }
    });
}

export function openDetailPanel(feature, allFeatures = []) {
    const panel = document.getElementById('site-detail-panel');
    if (!panel) return;

    const { name, category, description, image_url, price_level, best_time, rating, duration, tags, local_tip, website, accessibility, fun_fact, transit_option, photospot } = feature.properties;

    // Populate Data
    const titleEl = document.getElementById('detail-title');
    if (titleEl) {
        titleEl.textContent = name;
        // Make sure we don't duplicate play buttons if re-opening
        const existingAudioBtn = titleEl.querySelector('.audio-guide-btn');
        if (existingAudioBtn) existingAudioBtn.remove();

        // Add Audio Guide Button
        const audioBtn = document.createElement('button');
        audioBtn.className = 'audio-guide-btn';
        audioBtn.title = 'Listen to description';
        audioBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;

        // Audio Logic
        let utterance = null;

        const stopAudio = () => {
             window.speechSynthesis.cancel();
             audioBtn.classList.remove('playing');
             audioBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
        };

        audioBtn.onclick = (e) => {
            e.stopPropagation();
            if (window.speechSynthesis.speaking && audioBtn.classList.contains('playing')) {
                stopAudio();
            } else {
                // Stop any current
                window.speechSynthesis.cancel();

                utterance = new SpeechSynthesisUtterance(description);
                utterance.lang = 'en-US';
                utterance.onend = stopAudio;

                window.speechSynthesis.speak(utterance);
                audioBtn.classList.add('playing');
                audioBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
            }
        };

        titleEl.style.display = 'flex';
        titleEl.style.alignItems = 'center';
        titleEl.style.justifyContent = 'space-between';
        titleEl.appendChild(audioBtn);
    }

    const catEl = document.getElementById('detail-category');
    if (catEl) catEl.textContent = category;

    const rateEl = document.getElementById('detail-rating');
    if (rateEl) rateEl.textContent = rating ? `★ ${rating}` : '';

    const descEl = document.getElementById('detail-desc');
    if (descEl) descEl.textContent = description;

    const imgEl = document.getElementById('detail-image');
    if (imgEl) {
        imgEl.src = image_url || '';
        imgEl.onerror = () => { imgEl.src = ''; imgEl.style.backgroundColor = '#e6ebf1'; };
    }

    // Badges
    const badgeContainer = document.getElementById('detail-badges');
    if (badgeContainer) {
        badgeContainer.innerHTML = '';
        if (price_level) {
            const b = document.createElement('span');
            b.className = 'info-badge price-badge';
            b.textContent = '$'.repeat(price_level);
            badgeContainer.appendChild(b);
        }
        if (best_time) {
            const b = document.createElement('span');
            b.className = 'info-badge time-badge';
            b.textContent = best_time;
            badgeContainer.appendChild(b);
        }
        if (duration) {
            const b = document.createElement('span');
            b.className = 'duration-badge';
            b.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:12px;height:12px;margin-right:4px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ${duration}`;
            badgeContainer.appendChild(b);
        }
        if (accessibility) {
            const b = document.createElement('span');
            b.className = 'access-badge';
            b.title = 'Accessibility Information';
            b.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> ${accessibility}`;
            badgeContainer.appendChild(b);
        }
        if (transit_option) {
            const t = document.createElement('span');
            t.className = 'transit-badge';
            t.title = 'Getting There';
            let icon = '🚗';
            if (transit_option === 'Boat') icon = '🚤';
            if (transit_option === 'Walk') icon = '🚶';
            if (transit_option === 'Hike') icon = '🥾';
            t.innerHTML = `<span>${icon}</span> ${transit_option}`;
            badgeContainer.appendChild(t);
        }
    }

    // Weather Widget (Mock Data)
    const weatherWidget = document.getElementById('detail-weather-widget');
    if (weatherWidget) {
        const isCoastal = category === 'coastal' || (tags && (tags.includes('Beach') || tags.includes('Island')));
        const weatherIcon = isCoastal ? '☀️' : '⛅';
        const weatherTemp = isCoastal ? '26°C' : '22°C';
        const weatherDesc = isCoastal ? 'Sunny' : 'Partly Cloudy';

        weatherWidget.style.display = 'flex';
        weatherWidget.innerHTML = `
            <div class="weather-icon">${weatherIcon}</div>
            <div class="weather-info">
                <h4>${weatherDesc} • ${weatherTemp}</h4>
                <p>Best visit: ${best_time || 'Year-round'}</p>
            </div>
        `;
    }

    // === New Content Injection ===
    const contentContainer = document.querySelector('.panel-content');

    // Remove old dynamic sections if any
    const existingExtras = contentContainer.querySelectorAll('.dynamic-extra-section');
    existingExtras.forEach(el => el.remove());

    const insertAfter = (newNode, referenceNode) => {
        if (referenceNode && referenceNode.parentNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }
    };

    // Fun Fact
    if (fun_fact) {
        const ffBox = document.createElement('div');
        ffBox.className = 'fun-fact-box dynamic-extra-section';
        ffBox.innerHTML = `
            <div class="fun-fact-header">
                <span style="font-size:14px;">💡</span> Did You Know?
            </div>
            <div class="fun-fact-content">${fun_fact}</div>
        `;
        const badgeContainer = document.getElementById('detail-badges');
        if (badgeContainer) insertAfter(ffBox, badgeContainer);
    }

    // Photospot
    if (photospot) {
        const psBox = document.createElement('div');
        psBox.className = 'photospot-box dynamic-extra-section';
        psBox.innerHTML = `
             <div class="photospot-header">
                <span style="font-size:14px;">📸</span> Best Photo Spot
            </div>
            <div class="photospot-content">${photospot}</div>
        `;
        const target = contentContainer.querySelector('.fun-fact-box') || document.getElementById('detail-badges');
        if (target) insertAfter(psBox, target);
    }

    // Best Time Visualizer (Mock logic for demo)
    if (best_time) {
        const btBox = document.createElement('div');
        btBox.className = 'best-time-container dynamic-extra-section';

        const months = ['J','F','M','A','M','J','J','A','S','O','N','D'];
        let active = [];
        const low = best_time.toLowerCase();

        if (low.includes('year')) active = [0,1,2,3,4,5,6,7,8,9,10,11];
        else if (low.includes('jun') || low.includes('summer')) active = [5,6,7,8];
        else if (low.includes('may') || low.includes('oct')) active = [4,5,6,7,8,9];
        else active = [4,5,6,7,8]; // Default summer-ish

        let bars = months.map((m, i) =>
            `<div class="month-bar ${active.includes(i) ? 'active' : ''}" data-month="${m}"></div>`
        ).join('');

        btBox.innerHTML = `
            <div class="best-time-header">
                <span>Popularity by Month</span>
                <span style="color:var(--accent-color);">${best_time}</span>
            </div>
            <div class="month-viz">${bars}</div>
        `;

        const target = contentContainer.querySelector('.fun-fact-box') || document.getElementById('detail-weather-widget');
        if (target) insertAfter(btBox, target);
    }

    // Crowd Forecast (New)
    const crowdData = getCrowdData(category);
    if (crowdData) {
        const crowdBox = document.createElement('div');
        crowdBox.className = 'crowd-box dynamic-extra-section';

        let bars = crowdData.map((val, i) => {
            const h = (i + 8); // Start at 8 AM
            const label = h > 12 ? (h-12)+'PM' : h+'AM';
            const height = val + '%';
            // Simplified rendering: just bars
            return `<div class="crowd-bar" style="height:${height}" title="${label}: ${val}% capacity"></div>`;
        }).join('');

        crowdBox.innerHTML = `
            <div class="crowd-header">
                <span>Typical Daily Crowds</span>
            </div>
            <div class="crowd-viz">
                ${bars}
            </div>
            <div class="crowd-labels">
                <span>8 AM</span>
                <span>8 PM</span>
            </div>
        `;

        const target = contentContainer.querySelector('.best-time-container') || contentContainer.querySelector('.fun-fact-box') || document.getElementById('detail-weather-widget');
        if (target) insertAfter(crowdBox, target);
    }

    // Instagrammability Score (New)
    const instaScore = calculateInstaScore(feature.properties);
    if (instaScore > 0) {
        const instaBox = document.createElement('div');
        instaBox.className = 'insta-box dynamic-extra-section';

        let color = '#2dce89'; // Green
        if (instaScore < 50) color = '#fb6340'; // Orange
        if (instaScore >= 80) color = '#e1306c'; // Insta Pink

        instaBox.innerHTML = `
            <div class="insta-header">
                <span>📸 Instagrammability</span>
                <span style="color:${color}; font-weight:700;">${instaScore}/100</span>
            </div>
            <div class="insta-bar-bg">
                <div class="insta-bar-fill" style="width:${instaScore}%; background:${color};"></div>
            </div>
            <p style="margin:4px 0 0; font-size:11px; color:var(--text-tertiary);">Based on views, uniqueness, and popularity.</p>
        `;

        const target = contentContainer.querySelector('.crowd-box') || contentContainer.querySelector('.best-time-container') || document.getElementById('detail-weather-widget');
        if (target) insertAfter(instaBox, target);
    }

    // Packing List
    const packingItems = getPackingList(category);
    if (packingItems.length > 0) {
        const packBox = document.createElement('div');
        packBox.className = 'packing-box dynamic-extra-section';
        packBox.style.marginBottom = '24px';
        packBox.innerHTML = `
            <div style="font-size:12px; font-weight:700; color:var(--text-tertiary); text-transform:uppercase; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                What to Pack
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:8px;">
                ${packingItems.map(item => `<span style="background:var(--bg-color); border:1px solid var(--border-color); padding:4px 8px; border-radius:4px; font-size:12px; color:var(--text-secondary);">${item}</span>`).join('')}
            </div>
        `;
        // Insert after Best Time or Fun Fact
        const target = contentContainer.querySelector('.best-time-container') || contentContainer.querySelector('.fun-fact-box') || document.getElementById('detail-weather-widget');
        if (target) insertAfter(packBox, target);
    }

    // Nearby Gems
    if (allFeatures && allFeatures.length > 0) {
        const [cLng, cLat] = feature.geometry.coordinates;

        const others = allFeatures
            .filter(f => f.properties.name !== name)
            .map(f => {
                const [lng, lat] = f.geometry.coordinates;
                const d = getDistanceFromLatLonInKm(cLat, cLng, lat, lng);
                return { ...f, dist: d };
            })
            .sort((a, b) => a.dist - b.dist)
            .slice(0, 3);

        if (others.length > 0) {
            const nearby = document.createElement('div');
            nearby.className = 'nearby-section dynamic-extra-section';
            nearby.style.marginTop = '24px';
            nearby.innerHTML = `<h3>Nearby Gems</h3>`;

            const grid = document.createElement('div');
            grid.className = 'nearby-grid';

            others.forEach(o => {
                const card = document.createElement('div');
                card.className = 'nearby-card';
                card.innerHTML = `
                    <div class="nearby-thumb"><img src="${o.properties.image_url}" onerror="this.style.display='none'"></div>
                    <div class="nearby-info">
                        <div class="nearby-title">${o.properties.name}</div>
                        <div class="nearby-dist">${o.dist.toFixed(1)} km</div>
                    </div>
                `;
                card.onclick = () => {
                   const [lng, lat] = o.geometry.coordinates;
                   const event = new CustomEvent('flyToSite', { detail: { lat, lng, name: o.properties.name } });
                   document.dispatchEvent(event);
                };
                grid.appendChild(card);
            });

            nearby.appendChild(grid);

            const footer = document.querySelector('.detail-footer-actions');
            if (footer) footer.parentNode.insertBefore(nearby, footer);
        }

        // Similar Vibe
        const similar = findSimilarSites(feature, allFeatures);
        if (similar.length > 0) {
            const similarDiv = document.createElement('div');
            similarDiv.className = 'similar-section dynamic-extra-section';
            similarDiv.style.marginTop = '24px';
            similarDiv.innerHTML = `<h3>You Might Also Like</h3>`;

            const grid = document.createElement('div');
            grid.className = 'nearby-grid'; // Reuse styles

            similar.forEach(s => {
                const card = document.createElement('div');
                card.className = 'nearby-card';
                card.innerHTML = `
                    <div class="nearby-thumb"><img src="${s.properties.image_url}" onerror="this.style.display='none'"></div>
                    <div class="nearby-info">
                        <div class="nearby-title">${s.properties.name}</div>
                        <div class="nearby-dist" style="color:var(--accent-color); font-weight:600;">${s.properties.category}</div>
                    </div>
                `;
                card.onclick = () => {
                   const [lng, lat] = s.geometry.coordinates;
                   const event = new CustomEvent('flyToSite', { detail: { lat, lng, name: s.properties.name } });
                   document.dispatchEvent(event);
                };
                grid.appendChild(card);
            });

            similarDiv.appendChild(grid);
            const footer = document.querySelector('.detail-footer-actions');
            if (footer) footer.parentNode.insertBefore(similarDiv, footer);
        }
    }

    // Tip
    const tipBox = document.getElementById('detail-tip-box');
    const tipText = document.getElementById('detail-tip');
    if (tipBox && tipText) {
        if (local_tip) {
            tipBox.style.display = 'block';
            tipText.textContent = local_tip;
        } else {
            tipBox.style.display = 'none';
        }
    }

    // Tags
    const tagsContainer = document.getElementById('detail-tags');
    if (tagsContainer) {
        tagsContainer.innerHTML = '';
        if (tags) {
            tags.forEach(tag => {
                const t = document.createElement('span');
                t.className = 'tag-chip';
                t.textContent = tag;
                tagsContainer.appendChild(t);
            });
        }
    }

    // Website
    const webBtn = document.getElementById('detail-website');
    if (webBtn) {
        if (website) {
            webBtn.href = website;
            webBtn.style.display = 'flex';
        } else {
            webBtn.style.display = 'none';
        }
    }

    // Directions & Street View
    const dirBtn = document.getElementById('detail-directions');
    if (dirBtn) {
        const [lng, lat] = feature.geometry.coordinates;
        dirBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

        // Add Street View Button if not exists
        const footerActions = document.querySelector('.detail-footer-actions');
        const existingSv = document.getElementById('detail-streetview');
        if (existingSv) existingSv.remove();

        const svBtn = document.createElement('a');
        svBtn.id = 'detail-streetview';
        svBtn.className = 'website-btn secondary-btn'; // Reusing secondary style
        svBtn.target = '_blank';
        svBtn.href = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
        svBtn.innerHTML = `
            Street View
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
        `;

        // Insert between directions and website
        const websiteButton = document.getElementById('detail-website');
        if (footerActions && websiteButton) {
            footerActions.insertBefore(svBtn, websiteButton);
        }
    }

    // Phrase of the Moment
    const phraseBox = document.createElement('div');
    phraseBox.className = 'phrase-box dynamic-extra-section';
    phraseBox.style.marginTop = '24px';

    const phrases = [
        { hr: "Hvala", en: "Thank you" },
        { hr: "Molim", en: "Please" },
        { hr: "Bok", en: "Hi / Bye" },
        { hr: "Pivo", en: "Beer" },
        { hr: "Dobar dan", en: "Good day" },
        { hr: "Koliko košta?", en: "How much?" },
        { hr: "Živjeli", en: "Cheers" },
        { hr: "Oprostite", en: "Excuse me" }
    ];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

    phraseBox.innerHTML = `
        <div style="font-size:11px; font-weight:700; color:var(--text-tertiary); text-transform:uppercase; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
            <span>🇭🇷 Phrase of the Moment</span>
            <button class="audio-play-btn" style="width:20px; height:20px;" title="Listen">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
            </button>
        </div>
        <div style="background:var(--bg-color); padding:12px; border-radius:8px; display:flex; flex-direction:column; align-items:center; text-align:center;">
            <span style="font-size:16px; font-weight:700; color:var(--text-primary); margin-bottom:2px;">${randomPhrase.hr}</span>
            <span style="font-size:13px; color:var(--text-secondary);">${randomPhrase.en}</span>
        </div>
    `;

    // Audio Logic for Phrase
    const pBtn = phraseBox.querySelector('.audio-play-btn');
    pBtn.onclick = () => {
        const u = new SpeechSynthesisUtterance(randomPhrase.hr);
        u.lang = 'hr-HR';
        window.speechSynthesis.speak(u);
    };

    // Insert near bottom
    const similarSection = contentContainer.querySelector('.similar-section');
    if (similarSection) insertAfter(phraseBox, similarSection);
    else {
        // Fallback
        const footer = document.querySelector('.detail-footer-actions');
        if (footer) footer.parentNode.insertBefore(phraseBox, footer);
    }

    // Favorites State
    const favBtn = document.getElementById('detail-fav-btn');
    if (favBtn) {
        const updateFavState = () => {
            const favorites = getFavorites();
            const isFav = favorites.includes(name);
            favBtn.classList.toggle('active', isFav);
            favBtn.querySelector('svg').setAttribute('fill', isFav ? 'currentColor' : 'none');
        };
        updateFavState();

        favBtn.onclick = () => {
            toggleFavorite(name, () => {
                updateFavState();
                document.dispatchEvent(new CustomEvent('favoritesUpdated'));
            });
        };
    }

    // Visited State (New Button injection)
    // Remove old one if exists
    const existingVisitBtn = document.getElementById('detail-visit-btn');
    if (existingVisitBtn) existingVisitBtn.remove();

    // Create Visit Button in Action Panel
    const actionPanel = document.querySelector('.panel-actions');
    if (actionPanel) {
        const visitBtn = document.createElement('button');
        visitBtn.id = 'detail-visit-btn';
        visitBtn.className = 'action-icon-btn';
        visitBtn.title = 'Mark as Visited';
        visitBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

        const updateVisitState = () => {
             const visited = getVisited();
             const isVisited = visited.includes(name);
             visitBtn.classList.toggle('active', isVisited);
             // Maybe different style for visited
             if (isVisited) {
                 visitBtn.style.background = 'var(--accent-color)';
                 visitBtn.style.color = 'white';
             } else {
                 visitBtn.style.background = '';
                 visitBtn.style.color = '';
             }
        };
        updateVisitState();

        visitBtn.onclick = () => {
            toggleVisited(name, () => {
                updateVisitState();
                document.dispatchEvent(new CustomEvent('favoritesUpdated')); // Reuse this event to trigger re-renders
            });
        };

        // Insert before share button
        const shareBtn = document.getElementById('detail-share-btn');
        if (shareBtn) actionPanel.insertBefore(visitBtn, shareBtn);
    }

    // Share Btn
    const shareBtn = document.getElementById('detail-share-btn');
    if (shareBtn) {
        shareBtn.onclick = () => {
             const url = new URL(window.location.origin + window.location.pathname);
             url.searchParams.set('site', name);
             navigator.clipboard.writeText(url.toString());

             // Simple visual feedback
             const originalColor = shareBtn.style.color;
             shareBtn.style.color = 'var(--accent-color)';
             setTimeout(() => shareBtn.style.color = originalColor, 500);
        };
    }

    // Show Panel
    panel.classList.remove('hidden');

    // Handle Back
    const backBtn = document.getElementById('detail-back-btn');
    if (backBtn) {
        backBtn.onclick = () => {
            closeDetailPanel();
            window.speechSynthesis.cancel(); // Stop audio on close
        };
    }
}

export function closeDetailPanel() {
    const panel = document.getElementById('site-detail-panel');
    if (panel) panel.classList.add('hidden');
}

export function setupShareTrip() {
    const btn = document.getElementById('share-trip-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const favorites = getFavorites();
        if (favorites.length === 0) {
            alert("Add some sites to your favorites (My Trip) first!");
            return;
        }

        const url = new URL(window.location.origin + window.location.pathname);
        url.searchParams.set('trip', favorites.join(','));

        navigator.clipboard.writeText(url.toString()).then(() => {
            const originalText = btn.innerHTML;
            btn.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Copied!
            `;
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        });
    });
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

export function renderCollections(collections, filterCallback) {
    const container = document.getElementById('collections-container');
    if (!container) return;

    container.innerHTML = '';

    const scrollContainer = document.createElement('div');
    scrollContainer.className = 'collections-scroll';

    collections.forEach(col => {
        const btn = document.createElement('button');
        btn.className = 'collection-chip';
        btn.dataset.collection = col.tag;
        // Clean, minimal structure
        btn.innerHTML = `
            <span class="collection-icon">${col.icon}</span>
            <span class="collection-name">${col.name}</span>
        `;

        btn.addEventListener('click', () => {
            const wasActive = btn.classList.contains('active');

            // Deactivate all others
            container.querySelectorAll('.collection-chip').forEach(c => c.classList.remove('active'));

            if (!wasActive) {
                btn.classList.add('active');
            }

            filterCallback();
        });

        scrollContainer.appendChild(btn);
    });

    container.appendChild(scrollContainer);
}

export function setupTravelTips() {
    const btn = document.getElementById('travel-tips-btn');
    const modal = document.getElementById('travel-tips-modal');
    const closeBtn = modal ? modal.querySelector('.modal-close') : null;

    if (!btn || !modal) return;

    btn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        // Small delay to allow transition
        setTimeout(() => {
            modal.classList.add('visible');
        }, 10);
    });

    const closeModal = () => {
        modal.classList.remove('visible');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('visible')) {
            closeModal();
        }
    });

    // --- Dynamic Phrases with Audio ---
    const phraseGrid = modal.querySelector('.phrase-grid');
    if (phraseGrid) {
        phraseGrid.innerHTML = ''; // Clear static content
        const phrases = [
            { hr: "Hvala", en: "Thank you" },
            { hr: "Molim", en: "Please" },
            { hr: "Bok", en: "Hi / Bye" },
            { hr: "Pivo", en: "Beer" },
            { hr: "Dobar dan", en: "Good day" },
            { hr: "Koliko košta?", en: "How much?" }
        ];

        // Add Play All Button
        const container = phraseGrid.parentElement;
        const header = container.querySelector('h4');
        if (header && !header.querySelector('.play-all-btn')) {
             const playAllBtn = document.createElement('button');
             playAllBtn.className = 'action-btn play-all-btn';
             playAllBtn.style.cssText = 'font-size: 11px; margin-left: 8px; padding: 2px 8px; border: 1px solid var(--accent-color); border-radius: 12px;';
             playAllBtn.innerHTML = '▶ Play All';

             let isPlaying = false;

             playAllBtn.onclick = () => {
                 if (isPlaying) {
                     window.speechSynthesis.cancel();
                     isPlaying = false;
                     playAllBtn.innerHTML = '▶ Play All';
                     return;
                 }

                 // Cancel any ongoing speech
                 window.speechSynthesis.cancel();
                 isPlaying = true;
                 playAllBtn.innerHTML = '⏹ Stop';

                 let currentIndex = 0;

                 const playNext = () => {
                     if (!isPlaying || currentIndex >= phrases.length) {
                         isPlaying = false;
                         playAllBtn.innerHTML = '▶ Play All';
                         return;
                     }

                     const p = phrases[currentIndex];
                     const u = new SpeechSynthesisUtterance(p.hr);
                     u.lang = 'hr-HR';

                     u.onend = () => {
                         currentIndex++;
                         // Small pause between words
                         setTimeout(playNext, 500);
                     };

                     u.onerror = () => {
                         console.error('Speech synthesis error');
                         isPlaying = false;
                         playAllBtn.innerHTML = '▶ Play All';
                     };

                     window.speechSynthesis.speak(u);
                 };

                 playNext();
             };

             header.style.display = 'flex';
             header.style.alignItems = 'center';
             header.appendChild(playAllBtn);
        }

        phrases.forEach(p => {
            const item = document.createElement('div');
            item.className = 'phrase-item';

            const btn = document.createElement('button');
            btn.className = 'audio-play-btn';
            btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
            btn.title = "Listen";
            btn.onclick = () => {
                const u = new SpeechSynthesisUtterance(p.hr);
                u.lang = 'hr-HR'; // Ideally Croatian, falls back if not available
                window.speechSynthesis.speak(u);
            };

            const textSpan = document.createElement('span');
            textSpan.textContent = p.hr;
            textSpan.style.fontWeight = '600';
            textSpan.style.marginRight = '4px';

            const transSpan = document.createElement('span');
            transSpan.className = 'trans';
            transSpan.textContent = p.en;

            item.appendChild(btn);
            item.appendChild(textSpan);
            item.appendChild(transSpan);
            phraseGrid.appendChild(item);
        });
    }
}

// --- My Trip / Itinerary Feature ---

function parseDuration(durationStr) {
    if (!durationStr) return 0;
    const str = durationStr.toLowerCase();
    let hours = 0;

    if (str.includes('day')) {
        if (str.includes('half')) hours = 4;
        else if (str.includes('full')) hours = 8;
        else {
             const days = parseInt(str) || 1;
             hours = days * 8; // Assume 8h touring day
        }
    } else if (str.includes('hour')) {
        // "2-3 hours" -> take avg 2.5
        const matches = str.match(/(\d+)/g);
        if (matches) {
            if (matches.length > 1) {
                hours = (parseInt(matches[0]) + parseInt(matches[1])) / 2;
            } else {
                hours = parseInt(matches[0]);
            }
        }
    } else if (str.includes('min')) {
        const matches = str.match(/(\d+)/g);
        if (matches) {
            hours = parseInt(matches[0]) / 60;
        }
    }
    return hours;
}

function renderMyTripList(features, container, durationEl) {
    container.innerHTML = '';
    let totalHours = 0;
    const categoryCounts = {};

    if (features.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 40px; margin-bottom: 16px;">🗺️</div>
                <p style="margin:0; font-weight:600; color:var(--text-primary);">Your trip is empty</p>
                <p style="margin-top:8px;">Start exploring the map and click the heart icon to add places to your itinerary.</p>
                <button class="empty-state-action" style="margin-top:16px;">Start Exploring</button>
            </div>
        `;

        const exploreBtn = container.querySelector('.empty-state-action');
        if (exploreBtn) {
            exploreBtn.onclick = () => {
                const modal = document.getElementById('my-trip-modal');
                if (modal) {
                     const close = modal.querySelector('.modal-close');
                     if (close) close.click();
                }
                const search = document.getElementById('search-input');
                if (search) search.focus();
            };
        }

        if (durationEl) durationEl.textContent = '0h';
        return;
    }

    // Calculate breakdown
    features.forEach(f => {
        const cat = f.properties.category || 'other';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    // Render Breakdown Bar
    if (features.length > 0) {
        const breakdownDiv = document.createElement('div');
        breakdownDiv.style.cssText = 'padding: 16px 24px; border-bottom: 1px solid var(--divider-color); display: flex; gap: 8px; overflow-x: auto; background: var(--bg-color);';

        Object.entries(categoryCounts).forEach(([cat, count]) => {
            const chip = document.createElement('div');
            chip.style.cssText = 'font-size: 11px; padding: 4px 8px; background: var(--surface-color); border-radius: 12px; border: 1px solid var(--border-color); white-space: nowrap; color: var(--text-secondary); display: flex; align-items: center; gap: 4px;';
            chip.innerHTML = `<span style="width: 6px; height: 6px; border-radius: 50%; background: var(--accent-color);"></span> <strong>${count}</strong> ${cat.charAt(0).toUpperCase() + cat.slice(1)}`;
            breakdownDiv.appendChild(chip);
        });
        container.appendChild(breakdownDiv);
    }

    let totalDistance = 0;
    if (features.length > 1) {
        for (let i = 0; i < features.length - 1; i++) {
            const [lng1, lat1] = features[i].geometry.coordinates;
            const [lng2, lat2] = features[i + 1].geometry.coordinates;
            totalDistance += getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2);
        }
    }

    features.forEach(feature => {
        const { name, category, duration, image_url } = feature.properties;
        totalHours += parseDuration(duration);

        const item = document.createElement('div');
        item.className = 'trip-item';

        // Thumb
        const thumb = document.createElement('img');
        thumb.className = 'trip-item-thumb';
        thumb.src = image_url || '';
        thumb.onerror = () => { thumb.src = ''; thumb.style.background = '#e6ebf1'; };
        item.appendChild(thumb);

        // Info
        const info = document.createElement('div');
        info.className = 'trip-item-info';

        const title = document.createElement('div');
        title.className = 'trip-item-title';
        title.textContent = name;
        info.appendChild(title);

        const meta = document.createElement('div');
        meta.className = 'trip-item-meta';
        meta.innerHTML = `<span style="color:var(--accent-color); font-weight:600; text-transform:uppercase; font-size:10px;">${category}</span> • ${duration || 'N/A'}`;
        info.appendChild(meta);

        item.appendChild(info);

        // Remove Btn
        const removeBtn = document.createElement('button');
        removeBtn.className = 'trip-remove-btn';
        removeBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
        removeBtn.title = "Remove from Trip";
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(name, () => {
                // Re-render
                // We need access to allFeatures again or just remove this element and update total
                // Better to dispatch event or callback.
                // For simplicity, let's remove the element and update the total text
                item.remove();
                totalHours -= parseDuration(duration);
                durationEl.textContent = totalHours > 0 ? (totalHours % 1 === 0 ? totalHours : totalHours.toFixed(1)) + 'h' : '0h';

                if (container.children.length === 0) {
                     renderMyTripList([], container, durationEl);
                }
                document.dispatchEvent(new CustomEvent('favoritesUpdated'));
            });
        });
        item.appendChild(removeBtn);

        // Click to fly to
        item.addEventListener('click', (e) => {
             // We need access to map... but this module doesn't have it easily unless passed.
             // Maybe we can dispatch an event 'flyToSite'
             if (e.target !== removeBtn && !removeBtn.contains(e.target)) {
                 const [lng, lat] = feature.geometry.coordinates;
                 // Dispatch custom event
                 const event = new CustomEvent('flyToSite', { detail: { lat, lng, name } });
                 document.dispatchEvent(event);

                 // Close modal
                 document.querySelector('#my-trip-modal .modal-close').click();
             }
        });

        container.appendChild(item);
    });

    if (durationEl) {
        // Format nicely
        let displayTime = totalHours + 'h';
        if (totalHours > 8) {
             const days = (totalHours / 8).toFixed(1);
             displayTime = `${days} days (${totalHours}h)`;
        }

        let distanceText = "";
        if (totalDistance > 0) {
            distanceText = ` • ~${Math.round(totalDistance)} km`;
        }

        durationEl.textContent = displayTime + distanceText;
    }
}

export function setupMyTripModal(allFeatures) {
    const btn = document.getElementById('my-trip-btn');
    const modal = document.getElementById('my-trip-modal');
    const closeBtn = modal ? modal.querySelector('.modal-close') : null;
    const listContainer = document.getElementById('my-trip-list');
    const durationEl = document.getElementById('trip-duration');
    const startBtn = document.getElementById('trip-start-action');
    const shareBtn = document.getElementById('trip-share-action');

    if (!btn || !modal) return;

    const openModal = () => {
        const favorites = getFavorites();
        const favFeatures = allFeatures.filter(f => favorites.includes(f.properties.name));
        renderMyTripList(favFeatures, listContainer, durationEl);
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.add('visible'), 10);
    };

    const closeModal = () => {
        modal.classList.remove('visible');
        setTimeout(() => modal.classList.add('hidden'), 300);
    };

    btn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Print Action
    const printBtn = document.getElementById('trip-print-action');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // Share Action
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
             const favorites = getFavorites();
             if (favorites.length === 0) return;
             const url = new URL(window.location.origin + window.location.pathname);
             url.searchParams.set('trip', favorites.join(','));
             navigator.clipboard.writeText(url.toString()).then(() => {
                const original = shareBtn.textContent;
                shareBtn.textContent = 'Copied!';
                setTimeout(() => shareBtn.textContent = original, 2000);
             });
        });
    }

    // Start Route Action (Get directions to first item)
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            const favorites = getFavorites();
             if (favorites.length === 0) return;

             // Get features in order
             const tripFeatures = favorites.map(name => allFeatures.find(f => f.properties.name === name)).filter(f => f);

             if (tripFeatures.length > 0) {
                 const last = tripFeatures[tripFeatures.length - 1];
                 const [destLng, destLat] = last.geometry.coordinates;

                 let url = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`;

                 if (tripFeatures.length > 1) {
                     const waypoints = tripFeatures.slice(0, tripFeatures.length - 1)
                        .map(f => {
                            const [lng, lat] = f.geometry.coordinates;
                            return `${lat},${lng}`;
                        })
                        .join('|');
                     url += `&waypoints=${waypoints}`;
                 }

                 window.open(url, '_blank');
             }
        });
    }
}

export function setupSuggestedRoutes(allFeatures) {
    const btn = document.getElementById('routes-btn');
    const modal = document.getElementById('routes-modal');
    const closeBtn = modal ? modal.querySelector('.modal-close') : null;
    const container = document.getElementById('routes-container');

    if (!btn || !modal) return;

    // Define Routes
    const routes = [
        {
            name: "Game of Thrones Tour",
            sites: ["Dubrovnik City Walls", "Lovrijenac Fortress", "Diocletian's Palace", "Klis Fortress", "Trsteno Arboretum"],
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Dubrovnik_-_Lovrijenac.jpg/800px-Dubrovnik_-_Lovrijenac.jpg",
            desc: "Walk in the footsteps of your favorite characters in Dubrovnik (King's Landing) and Split."
        },
        {
            name: "Istrian Gastronomy",
            sites: ["Rovinj Old Town", "Truffle Hunting (Motovun)", "Hum", "Pula Arena", "Euphrasian Basilica"],
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Motovun_Istria_Croatia.jpg/800px-Motovun_Istria_Croatia.jpg",
            desc: "A culinary journey through Istria's truffles, wines, and ancient Roman history."
        },
        {
            name: "Dalmatian Highlights",
            sites: ["Zadar Sea Organ", "Krka National Park", "Trogir Old Town", "Split Diocletian's Palace"],
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Sea_organ_Zadar.jpg/800px-Sea_organ_Zadar.jpg",
            desc: "The essential coastal route from Zadar to Split, featuring waterfalls and UNESCO sites."
        },
        {
            name: "Slavonia & Danube",
            sites: ["Osijek Tvr\u0111a", "Kopa\u010dki Rit", "Vu\u010dedol Culture Museum"],
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Osijek_Tvrdja.jpg/800px-Osijek_Tvrdja.jpg",
            desc: "Discover the hidden gems of Eastern Croatia, from baroque fortresses to wetlands."
        }
    ];

    const openModal = () => {
        container.innerHTML = '';
        routes.forEach(route => {
            // Check availability of sites in current data
            const availableSites = route.sites.filter(name => allFeatures.some(f => f.properties.name === name));
            const count = availableSites.length;

            const card = document.createElement('div');
            card.className = 'route-card';
            card.innerHTML = `
                <div class="route-card-image">
                    <img src="${route.image}" alt="${route.name}" loading="lazy">
                </div>
                <div class="route-info">
                    <h4>${route.name}</h4>
                    <p>${route.desc}</p>
                    <div class="route-meta">
                        <span>${count} Stops</span>
                        <span class="route-count">Load Route</span>
                    </div>
                </div>
            `;

            card.addEventListener('click', () => {
                if (count === 0) {
                    alert("Sites for this route not found in current data.");
                    return;
                }

                // Confirm replacement
                if (getFavorites().length > 0) {
                     if (!confirm("This will replace your current trip. Continue?")) return;
                }

                localStorage.setItem('croatia_favorites', JSON.stringify(availableSites));
                document.dispatchEvent(new CustomEvent('favoritesUpdated'));

                closeModal();

                // Open My Trip to show result
                setTimeout(() => {
                    const myTripBtn = document.getElementById('my-trip-btn');
                    if (myTripBtn) myTripBtn.click();
                }, 300);
            });

            container.appendChild(card);
        });

        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.add('visible'), 10);
    };

    const closeModal = () => {
        modal.classList.remove('visible');
        setTimeout(() => modal.classList.add('hidden'), 300);
    };

    btn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// === New Enhancements: Helpers & Onboarding ===

export function getPackingList(category) {
    const common = ["Comfortable shoes", "Water bottle", "Camera/Phone"];
    const specifics = {
        "coastal": ["Swimsuit & Towel", "Sunscreen & Hat", "Sunglasses", "Sandals"],
        "natural": ["Hiking boots", "Insect repellent", "Light jacket", "Backpack"],
        "adventure": ["Sportswear", "GoPro/Action Cam", "Energy snacks", "Change of clothes"],
        "historical": ["Walking shoes", "Hat for sun", "Power bank", "Guidebook"],
        "cultural": ["Modest clothing (churches)", "Small change", "Notebook", "Curiosity"],
        "gastronomy": ["Appetite!", "Smart casual outfit", "Cash for tips", "Water"],
        "default": ["Map/Navigation", "ID/Passport", "Power bank"]
    };

    const catKey = category ? category.toLowerCase() : 'default';
    const items = specifics[catKey] || specifics['default'];
    return [...new Set([...common, ...items])]; // Unique items
}

// Mock Crowd Data (8am to 8pm)
export function getCrowdData(category) {
    if (!category) return null;
    const cat = category.toLowerCase();

    // 13 points (8am - 8pm)
    if (cat === 'historical' || cat === 'cultural') {
        // Peak mid-day
        return [10, 30, 60, 80, 90, 85, 80, 70, 60, 40, 30, 20, 10];
    } else if (cat === 'coastal') {
        // Peak afternoon
        return [5, 15, 40, 70, 90, 95, 95, 85, 60, 40, 30, 20, 10];
    } else if (cat === 'gastronomy') {
        // Lunch and Dinner peaks
        return [0, 5, 10, 20, 80, 90, 50, 20, 40, 80, 95, 80, 40];
    } else if (cat === 'adventure') {
        // Morning peak
        return [20, 60, 80, 90, 70, 60, 50, 40, 30, 20, 10, 5, 0];
    }

    // Default
    return [10, 20, 40, 60, 70, 70, 60, 50, 40, 30, 20, 10, 5];
}

export function calculateInstaScore(properties) {
    if (!properties) return 0;

    let score = 30; // Base score

    const { photospot, tags, rating, best_time } = properties;

    if (photospot) score += 20;
    if (rating && rating >= 4.7) score += 15;

    if (tags) {
        if (tags.includes('Views') || tags.includes('Sunset')) score += 15;
        if (tags.includes('Hidden Gem')) score += 10;
        if (tags.includes('UNESCO')) score += 10;
        if (tags.includes('Nature') || tags.includes('Beach')) score += 5;
    }

    if (best_time && best_time.toLowerCase().includes('sunset')) score += 10;

    return Math.min(score, 100);
}

export function findSimilarSites(currentFeature, allFeatures) {
    if (!currentFeature || !allFeatures) return [];

    const { name, tags, category } = currentFeature.properties;
    const currentTags = tags || [];

    return allFeatures
        .filter(f => f.properties.name !== name) // Exclude self
        .map(f => {
            const fTags = f.properties.tags || [];
            let score = 0;

            // Same category points
            if (f.properties.category === category) score += 2;

            // Tag overlap points
            const overlap = fTags.filter(t => currentTags.includes(t));
            score += overlap.length * 3;

            return { feature: f, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3) // Top 3
        .map(item => item.feature);
}


export function setupThemeToggle(updateMapTheme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    const setTheme = (theme) => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem('theme', theme);
        updateMapTheme(theme);

        // Update Icon
        if (theme === 'dark') {
            btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
        } else {
            btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
        }
    };

    // Init
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    btn.addEventListener('click', () => {
        const current = document.documentElement.dataset.theme;
        const next = current === 'dark' ? 'light' : 'dark';
        setTheme(next);
    });
}

export function setupOnboarding() {
    // Check if seen
    if (localStorage.getItem('seen_onboarding')) return;

    // Create Toast
    const toast = document.createElement('div');
    toast.className = 'onboarding-toast';
    toast.innerHTML = `
        <div class="toast-icon">👋</div>
        <div class="toast-content">
            <h4>Welcome to Croatia Guide!</h4>
            <p>Start by clicking a marker on the map or use the search bar to find your next adventure.</p>
        </div>
        <button class="toast-close">Got it</button>
    `;

    document.body.appendChild(toast);

    // Animate In
    requestAnimationFrame(() => {
        toast.classList.add('visible');
    });

    // Dismiss Logic
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.classList.remove('visible');
        localStorage.setItem('seen_onboarding', 'true');
        setTimeout(() => toast.remove(), 500);
    });

    // Auto dismiss after 8 seconds
    setTimeout(() => {
        if (document.body.contains(toast)) {
            toast.classList.remove('visible');
            localStorage.setItem('seen_onboarding', 'true');
            setTimeout(() => toast.remove(), 500);
        }
    }, 8000);
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
