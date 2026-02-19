import { getFavorites, toggleFavorite } from './ui-module.js';

let currentTileLayer = null;
let currentMap = null;

export function toggleMapTheme(theme) {
    if (!currentMap) return;

    if (currentTileLayer) {
        currentMap.removeLayer(currentTileLayer);
    }

    const url = theme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    currentTileLayer = L.tileLayer(url, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(currentMap);
}

// This module will be responsible for map initialization and management.
export function initializeMap() {
    // Center on Croatia
    const map = L.map('map', {
        zoomControl: false // We will add it manually to position it better if needed, or style the default one
    }).setView([45.1, 15.2], 7);

    currentMap = map;

    // Add Zoom control to top-right
    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    // Initialize with light theme by default
    toggleMapTheme('light');

    return map;
}

export const markers = L.markerClusterGroup({
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    spiderfyOnMaxZoom: true,
    removeOutsideVisibleBounds: true,
    iconCreateFunction: function (cluster) {
        var childCount = cluster.getChildCount();
        var c = ' marker-cluster-';
        if (childCount < 10) {
            c += 'small';
        } else if (childCount < 100) {
            c += 'medium';
        } else {
            c += 'large';
        }

        return new L.DivIcon({
            html: '<div><span>' + childCount + '</span></div>',
            className: 'marker-cluster' + c + ' marker-cluster-custom',
            iconSize: new L.Point(40, 40)
        });
    }
});

// Marker lookup for highlighting
let markerLookup = {};

// SVG Paths for icons (extracted from previous SVG files, stripped of transforms)
// We assume a standard viewBox="0 0 24 24" for these paths.
const iconPaths = {
    "historical": `<path fill="currentColor" d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm19-12h-2V7h-3v3h-2V7h-3v3H9V7H6v3H4V7H2l10-5 10 5v3z"/>`,
    "natural": `<path fill="currentColor" d="M10 21v-4.83l-7 5.96L4.82 20 12 14l7.18 6L21 22.13l-7-5.96V21h-4zm2-19L2 12h5v2h10v-2h5L12 2z"/>`,
    "cultural": `<path fill="currentColor" d="M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>`,
    "coastal": `<path fill="currentColor" d="M12 6c4.42 0 8 3.58 8 8h-2c0-3.31-2.69-6-6-6s-6 2.69-6 6H4c0-4.42 3.58-8 8-8z M11 14v6h2v-6h-2z"/>`,
    "gastronomy": `<path fill="currentColor" d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>`,
    "adventure": `<path fill="currentColor" d="M14 6l-4.22 5.63 1.25 1.67L14 9.33 19 16h-8.46l-4.01-5.37L1 18h22L14 6zM5 16l1.52-2.03L8.04 16H5z"/>`,
    "default": `<path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5-2.5 2.5z"/>`
};

export function updateMarkers(map, features, onViewDetails) {
    markers.clearLayers();
    markerLookup = {}; // Clear lookup

    features.forEach(feature => {
        const { name, category, description, rating, image_url, website, price_level, best_time, local_tip, tags } = feature.properties;
        const [lng, lat] = feature.geometry.coordinates;

        const catKey = category.toLowerCase();
        const svgPath = iconPaths[catKey] || iconPaths['default'];
        const isHiddenGem = tags && tags.includes('Hidden Gem');

        // Use DivIcon for CSS styling
        const customIcon = L.divIcon({
            className: 'custom-marker-icon', // Defined in CSS
            html: `
                <div class="marker-pin ${catKey} ${isHiddenGem ? 'hidden-gem' : ''}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        ${svgPath}
                    </svg>
                </div>
            `,
            iconSize: [40, 40], // Match CSS width/height
            iconAnchor: [20, 48], // Center (20) and Bottom Tip (40 height + 8 arrow)
            popupAnchor: [0, -48]
        });

        const marker = L.marker([lat, lng], { icon: customIcon });
        marker.featureName = name; // Attach name for easy access

        // Add to lookup
        markerLookup[name] = marker;

        // Add class to elevate z-index on hover
        marker.on('mouseover', function (e) {
            this.setZIndexOffset(1000);
            const el = this.getElement();
            if (el) {
                const pin = el.querySelector('.marker-pin');
                if (pin) pin.classList.add('active');
            }
        });
        marker.on('mouseout', function (e) {
            this.setZIndexOffset(0);
            const el = this.getElement();
            if (el) {
                const pin = el.querySelector('.marker-pin');
                if (pin) pin.classList.remove('active');
            }
        });

        // Also toggle active state on popup open/close
        marker.on('popupopen', function() {
            const el = this.getElement();
            if (el) {
                const pin = el.querySelector('.marker-pin');
                if (pin) pin.classList.add('active');
            }
        });

        marker.on('popupclose', function() {
            const el = this.getElement();
            if (el) {
                const pin = el.querySelector('.marker-pin');
                if (pin) pin.classList.remove('active');
            }
        });


        const popupContent = document.createElement('div');
        popupContent.className = 'custom-popup';

        const imageContainer = document.createElement('div');
        imageContainer.className = 'popup-image';

        // Add Favorites button to Image Container
        const favorites = getFavorites();
        const isFav = favorites.includes(name);

        const favBtn = document.createElement('button');
        favBtn.className = `popup-fav-btn ${isFav ? 'active' : ''}`;
        favBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
        favBtn.onclick = (e) => {
             e.stopPropagation();
             toggleFavorite(name, () => {
                 const newFavs = getFavorites();
                 const nowFav = newFavs.includes(name);
                 favBtn.classList.toggle('active', nowFav);
                 favBtn.querySelector('svg').setAttribute('fill', nowFav ? 'currentColor' : 'none');
                 document.dispatchEvent(new CustomEvent('favoritesUpdated'));
             });
        };
        imageContainer.appendChild(favBtn);

        // Share Button
        const shareBtn = document.createElement('button');
        shareBtn.className = 'popup-share-btn';
        shareBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`;
        shareBtn.onclick = (e) => {
            e.stopPropagation();
            const url = new URL(window.location.origin + window.location.pathname);
            url.searchParams.set('site', name);
            navigator.clipboard.writeText(url.toString()).then(() => {
                const original = shareBtn.innerHTML;
                shareBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                setTimeout(() => {
                    shareBtn.innerHTML = original;
                }, 2000);
            });
        };
        imageContainer.appendChild(shareBtn);

        const img = document.createElement('img');
        img.src = image_url;
        img.alt = name;
        img.loading = "lazy";

        img.onerror = () => {
            img.style.display = 'none';
            imageContainer.style.background = `linear-gradient(135deg, var(--accent-color), #8792a2)`;
            imageContainer.style.display = 'flex';
            imageContainer.style.alignItems = 'center';
            imageContainer.style.justifyContent = 'center';
            // Append fallback text instead of replacing content (which kills buttons)
            const fallback = document.createElement('span');
            fallback.style.cssText = "color:white; font-weight:600; font-size:32px;";
            fallback.textContent = name.charAt(0);
            imageContainer.appendChild(fallback);
        };
        imageContainer.appendChild(img);

        const infoContainer = document.createElement('div');
        infoContainer.className = 'popup-info';

        const catSpan = document.createElement('span');
        catSpan.className = 'popup-category';
        catSpan.textContent = category;

        const title = document.createElement('h4');
        title.textContent = name;

        // Add Badges
        const badgeContainer = document.createElement('div');
        badgeContainer.className = 'popup-badges';
        badgeContainer.style.display = 'flex';
        badgeContainer.style.gap = '8px';
        badgeContainer.style.marginBottom = '12px';

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
        infoContainer.appendChild(badgeContainer);

        // Local Tip
        if (local_tip) {
            const tipDiv = document.createElement('div');
            tipDiv.className = 'popup-tip';
            tipDiv.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M12 2v1"></path><path d="M12 7v5"></path><path d="M12 13v.01"></path><path d="M18.36 6.64a9 9 0 0 1 1.63 7.64"></path><path d="M4.01 7.64a9 9 0 0 1 1.63-1"></path></svg><span>${local_tip}</span>`;
            infoContainer.appendChild(tipDiv);
        }

        const desc = document.createElement('p');
        // Truncate description for popup
        desc.textContent = description.length > 120 ? description.substring(0, 117) + '...' : description;

        const footer = document.createElement('div');
        footer.className = 'popup-footer';

        const ratingSpan = document.createElement('span');
        ratingSpan.className = 'rating-badge';
        ratingSpan.textContent = `★ ${rating}`;

        const directionsBtn = document.createElement('a');
        directionsBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        directionsBtn.target = "_blank";
        directionsBtn.title = "Get Directions";
        directionsBtn.className = "popup-directions-btn";
        directionsBtn.style.cssText = "color: var(--text-tertiary); margin-left: 8px; margin-right: auto; display: flex; align-items: center; transition: color 0.2s;";
        directionsBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>`;
        directionsBtn.onclick = (e) => e.stopPropagation();
        directionsBtn.onmouseover = () => directionsBtn.style.color = "var(--accent-color)";
        directionsBtn.onmouseout = () => directionsBtn.style.color = "var(--text-tertiary)";

        const detailsBtn = document.createElement('button');
        detailsBtn.className = 'visit-link';
        detailsBtn.style.border = 'none';
        detailsBtn.style.cursor = 'pointer';
        detailsBtn.style.fontFamily = 'inherit';
        detailsBtn.style.fontSize = '12px';
        detailsBtn.textContent = 'More Info →';

        detailsBtn.onclick = (e) => {
            e.stopPropagation();
            if (onViewDetails) {
                onViewDetails(feature);

                // On mobile, close popup so it doesn't obstruct (though sidebar covers it mostly)
                if (window.innerWidth <= 768) {
                    marker.closePopup();
                }
            }
        };

        infoContainer.appendChild(catSpan);
        infoContainer.appendChild(title);
        infoContainer.appendChild(desc);

        footer.appendChild(ratingSpan);
        footer.appendChild(directionsBtn);
        footer.appendChild(detailsBtn);
        infoContainer.appendChild(footer);

        popupContent.appendChild(imageContainer);
        popupContent.appendChild(infoContainer);

        marker.bindPopup(popupContent, {
            maxWidth: 320,
            minWidth: 320,
            className: 'polished-popup'
        });
        markers.addLayer(marker);
    });
    map.addLayer(markers);
}

export function highlightMarker(name) {
    const marker = markerLookup[name];
    if (marker) {
        // Check if marker is in a cluster or visible on the map
        const visibleParent = markers.getVisibleParent(marker);

        if (visibleParent && visibleParent === marker) {
             // It's visible and not clustered
             const el = marker.getElement();
             if (el) {
                 const pin = el.querySelector('.marker-pin');
                 if (pin) pin.classList.add('highlighted');
             }
             marker.setZIndexOffset(10000);
        }
    }
}

export function unhighlightMarker(name) {
    const marker = markerLookup[name];
    if (marker) {
         const visibleParent = markers.getVisibleParent(marker);
         if (visibleParent && visibleParent === marker) {
             const el = marker.getElement();
             if (el) {
                 const pin = el.querySelector('.marker-pin');
                 if (pin) pin.classList.remove('highlighted');
             }
             marker.setZIndexOffset(0);
         }
    }
}

export function openMarkerPopup(name) {
    const marker = markerLookup[name];
    if (marker) {
        markers.zoomToShowLayer(marker, () => {
             marker.openPopup();
        });
    }
}
