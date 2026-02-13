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

const categoryIcons = {
    "historical": `<path fill="currentColor" d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm19-12h-2V7h-3v3h-2V7h-3v3H9V7H6v3H4V7H2l10-5 10 5v3z"/>`,
    "natural": `<path fill="currentColor" d="M10 21v-4.83l-7 5.96L4.82 20 12 14l7.18 6L21 22.13l-7-5.96V21h-4zm2-19L2 12h5v2h10v-2h5L12 2z"/>`,
    "cultural": `<path fill="currentColor" d="M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>`,
    "coastal": `<path fill="currentColor" d="M12 6c4.42 0 8 3.58 8 8h-2c0-3.31-2.69-6-6-6s-6 2.69-6 6H4c0-4.42 3.58-8 8-8z M11 14v6h2v-6h-2z"/>`,
    "gastronomy": `<path fill="currentColor" d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>`,
    "adventure": `<path fill="currentColor" d="M14 6l-4.22 5.63 1.25 1.67L14 9.33 19 16h-8.46l-4.01-5.37L1 18h22L14 6zM5 16l1.52-2.03L8.04 16H5z"/>`,
    "default": `<path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5-2.5 2.5z"/>`
};

export function createCategoryFilters(categories, filterCallback) {
    const filtersContainer = document.getElementById('category-filters');
    filtersContainer.innerHTML = '<h4>Filter by Category:</h4>'; // Reset and add header
    const filtersList = document.createElement('div');
    filtersList.className = 'filters-list';

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
}

export function updateSearchResults(map, features, highlightMarker, unhighlightMarker) {
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
        const title = document.createElement('div');
        title.className = 'result-title';
        title.textContent = name;
        headerDiv.appendChild(title);

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
                openDetailPanel(feature);

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
    document.getElementById('search-input').addEventListener('input', debounce(filterCallback, 250));
}

export function addClearFiltersListener(filterCallback) {
    document.getElementById('clear-filters').addEventListener('click', () => {
        document.getElementById('search-input').value = '';
        const chips = document.querySelectorAll('.filter-chip');
        chips.forEach(chip => {
            chip.classList.remove('active');
        });

        // Clear collections too
        const collectionChips = document.querySelectorAll('.collection-chip');
        collectionChips.forEach(chip => chip.classList.remove('active'));

        // Clear price filters
        document.querySelectorAll('.price-btn').forEach(btn => btn.classList.remove('active'));

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

export function openDetailPanel(feature) {
    const panel = document.getElementById('site-detail-panel');
    if (!panel) return;

    const { name, category, description, image_url, price_level, best_time, rating, duration, tags, local_tip, website } = feature.properties;

    // Populate Data
    const titleEl = document.getElementById('detail-title');
    if (titleEl) titleEl.textContent = name;

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

    // Directions
    const dirBtn = document.getElementById('detail-directions');
    if (dirBtn) {
        const [lng, lat] = feature.geometry.coordinates;
        dirBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
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

    if (features.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 40px; margin-bottom: 16px;">🗺️</div>
                <p style="margin:0; font-weight:600; color:var(--text-primary);">Your trip is empty</p>
                <p style="margin-top:8px;">Start exploring the map and click the heart icon to add places to your itinerary.</p>
            </div>
        `;
        if (durationEl) durationEl.textContent = '0h';
        return;
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
        durationEl.textContent = displayTime;
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
             const firstFeature = allFeatures.find(f => f.properties.name === favorites[0]);
             if (firstFeature) {
                 const [lng, lat] = firstFeature.geometry.coordinates;
                 window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
             }
        });
    }
}
