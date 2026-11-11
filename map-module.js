import {sketchPaths,sketch} from './croatia-icons.js';
import { getFavorites, toggleFavorite, visualCaption } from './ui-module.js';

let currentTileLayer = null;
let currentMap = null;
let currentRouteLayer = null;

export function toggleMapTheme(theme) {
    if (!currentMap) return;

    if (currentTileLayer) {
        currentMap.removeLayer(currentTileLayer);
    }

    // Keep cartographic colours unchanged in both UI themes.
    const url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
    currentTileLayer = L.tileLayer(url, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | <a href="https://opentopomap.org/about">OpenTopoMap</a> <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA</a>',
        subdomains: 'abc', maxZoom: 17
    }).addTo(currentMap);
}

// This module will be responsible for map initialization and management.
export function initializeMap() {
    // Center on Croatia
    const map = L.map('map', {
        maxZoom:17, zoomAnimation:false, markerZoomAnimation:false, fadeAnimation:false, inertia:false, zoomControl: false // We will add it manually to position it better if needed, or style the default one
    }).setView([44.45, 16.3], 6);

    currentMap = map;

    // Add Zoom control to top-right
    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    // Add Legend Control
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'info legend');
        const categories = [
            { name: 'Historical', color: '#5e72e4' },
            { name: 'Natural', color: '#2dce89' },
            { name: 'Cultural', color: '#fb6340' },
            { name: 'Coastal', color: '#11cdef' },
            { name: 'Gastronomy', color: '#f5365c' },
            { name: 'Adventure', color: '#ff9f43' }
        ];

        div.innerHTML = '<h4>Map Legend</h4>';
        categories.forEach(cat => {
            div.innerHTML += `
                <div class="legend-item">
                    <span class="legend-dot" style="background:${cat.color}"></span>
                    ${cat.name}
                </div>
            `;
        });

        // Add Cluster info
        div.innerHTML += `
            <div class="legend-item" style="margin-top:8px; border-top:1px solid rgba(0,0,0,0.1); padding-top:4px;">
                <span class="legend-dot" style="background:var(--accent-color); border:2px solid white;"></span>
                Cluster
            </div>
        `;

        return div;
    };

    legend.addTo(map);

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
const iconPaths = sketchPaths;

export function updateMarkers(map, features, onViewDetails) {
    markers.clearLayers();
    markerLookup = {}; // Clear lookup

    const newMarkers = [];

    // ⚡ Bolt Optimization: Hoisted getFavorites() out of loop and converted to Set for O(1) lookups
    const favoritesSet = new Set(getFavorites());

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

        // Setup Fun Fact Tooltip
        const funFact = feature.properties.fun_fact;
        if (funFact) {
            marker.bindTooltip(`
                <div class="tooltip-header">💡 Did you know?</div>
                <div>${funFact}</div>
            `, {
                className: 'fun-fact-tooltip',
                direction: 'top',
                offset: [0, -40]
            });
            marker.hasFunFact = true;
        }

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
        const isFav = favoritesSet.has(name);

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
        desc.textContent = visualCaption(description);

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
        newMarkers.push(marker);
    });
    markers.addLayers(newMarkers);
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

// Listen for Fun Fact Tooltips
document.addEventListener('showFunFactTooltip', (e) => {
    const name = e.detail.name;
    const marker = markerLookup[name];
    if (marker && marker.hasFunFact && !marker.isPopupOpen()) {
        const visibleParent = markers.getVisibleParent(marker);
        if (visibleParent && visibleParent === marker) {
            marker.openTooltip();
            // Auto close after 5s
            setTimeout(() => {
                if (marker.isTooltipOpen()) marker.closeTooltip();
            }, 5000);
        }
    }
});


let routeMarkerGroup = null;

export function drawRoute(features) {
    if (!currentMap) return;
    clearRoute();

    if (!features || features.length < 2) return;

    const latlngs = features.map(f => {
        const [lng, lat] = f.geometry.coordinates;
        return [lat, lng];
    });

    // Create a dashed polyline
    currentRouteLayer = L.polyline(latlngs, {
        color: '#635bff', // Accent color
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10',
        lineCap: 'round',
        className: 'route-line-anim'
    }).addTo(currentMap);

    // Numbered Markers
    routeMarkerGroup = L.featureGroup();
    features.forEach((f, idx) => {
        const [lng, lat] = f.geometry.coordinates;
        const numberIcon = L.divIcon({
            className: 'route-number-marker',
            html: `<div style="background:var(--accent-color); color:white; width:24px; height:24px; border-radius:50%; display:flex; justify-content:center; align-items:center; font-weight:700; font-size:12px; border:2px solid white; box-shadow:0 2px 5px rgba(0,0,0,0.3); position:absolute; top:-12px; left:-12px;">${idx + 1}</div>`,
            iconSize: [0, 0] // the html handles the visual size and offset
        });

        L.marker([lat, lng], {icon: numberIcon}).addTo(routeMarkerGroup);
    });
    routeMarkerGroup.addTo(currentMap);

    // Fit bounds with padding
    currentMap.fitBounds(currentRouteLayer.getBounds(), {
        padding: [50, 50],
        maxZoom: 14,
        animate: false
    });
}

export function clearRoute() {
    if (currentRouteLayer && currentMap) {
        currentMap.removeLayer(currentRouteLayer);
        currentRouteLayer = null;
    }
    if (routeMarkerGroup && currentMap) {
        currentMap.removeLayer(routeMarkerGroup);
        routeMarkerGroup = null;
    }
}

export function resetMap() { if(currentMap) { currentMap.stop(); currentMap.closePopup(); currentMap.setView([44.45,16.3],6,{animate:false,reset:true}); } }
export function getMap() {return currentMap;}
