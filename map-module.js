// This module will be responsible for map initialization and management.
export function initializeMap() {
    // Center on Croatia
    const map = L.map('map', {
        zoomControl: false // We will add it manually to position it better if needed, or style the default one
    }).setView([45.1, 15.2], 7);

    // Add Zoom control to top-right
    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    // CartoDB Positron - Clean, high-contrast, "Stripe-like" map style
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    return map;
}

export const markers = L.markerClusterGroup({
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    spiderfyOnMaxZoom: true,
    removeOutsideVisibleBounds: true,
    // Customizing the cluster icon could be a next step, but default is okay for now.
    // We can use CSS to style .marker-cluster-small etc.
});

// SVG Paths for icons (extracted from previous SVG files, stripped of transforms)
// We assume a standard viewBox="0 0 24 24" for these paths.
const iconPaths = {
    "historical": `<path fill="currentColor" d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm19-12h-2V7h-3v3h-2V7h-3v3H9V7H6v3H4V7H2l10-5 10 5v3z"/>`,
    "natural": `<path fill="currentColor" d="M10 21v-4.83l-7 5.96L4.82 20 12 14l7.18 6L21 22.13l-7-5.96V21h-4zm2-19L2 12h5v2h10v-2h5L12 2z"/>`,
    "cultural": `<path fill="currentColor" d="M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>`,
    "coastal": `<path fill="currentColor" d="M12 6c4.42 0 8 3.58 8 8h-2c0-3.31-2.69-6-6-6s-6 2.69-6 6H4c0-4.42 3.58-8 8-8z M11 14v6h2v-6h-2z"/>`,
    "default": `<path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>`
};

export function updateMarkers(map, features) {
    markers.clearLayers();
    features.forEach(feature => {
        const { name, category, description, rating, image_url, website } = feature.properties;
        const [lng, lat] = feature.geometry.coordinates;

        const catKey = category.toLowerCase();
        const svgPath = iconPaths[catKey] || iconPaths['default'];

        // Use DivIcon for CSS styling
        const customIcon = L.divIcon({
            className: 'custom-marker-icon', // Defined in CSS
            html: `
                <div class="marker-pin ${catKey}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        ${svgPath}
                    </svg>
                </div>
            `,
            iconSize: [36, 36], // Size of the .marker-pin
            iconAnchor: [18, 42], // Tip of the arrow (36px height + 6px arrow extension)
            popupAnchor: [0, -42]
        });

        const marker = L.marker([lat, lng], { icon: customIcon });

        // Add class to elevate z-index on hover
        marker.on('mouseover', function (e) {
            this.setZIndexOffset(1000);
        });
        marker.on('mouseout', function (e) {
            this.setZIndexOffset(0);
        });

        const popupContent = document.createElement('div');
        popupContent.className = 'custom-popup';

        const imageContainer = document.createElement('div');
        imageContainer.className = 'popup-image';

        // Add a placeholder or loading state for image
        const img = document.createElement('img');
        img.src = image_url;
        img.alt = name;
        img.loading = "lazy";

        img.onerror = () => {
            img.onerror = null;
            // Use a nice placeholder gradient or pattern
            img.style.display = 'none';
            imageContainer.style.background = `linear-gradient(135deg, var(--accent-color), #8792a2)`;
            imageContainer.style.display = 'flex';
            imageContainer.style.alignItems = 'center';
            imageContainer.style.justifyContent = 'center';
            imageContainer.innerHTML = `<span style="color:white; font-weight:600; font-size:24px;">${name.charAt(0)}</span>`;
        };
        imageContainer.appendChild(img);

        const infoContainer = document.createElement('div');
        infoContainer.className = 'popup-info';

        const catSpan = document.createElement('span');
        catSpan.className = 'popup-category';
        catSpan.textContent = category;

        const title = document.createElement('h4');
        title.textContent = name;

        const desc = document.createElement('p');
        // Truncate description for popup
        desc.textContent = description.length > 120 ? description.substring(0, 117) + '...' : description;

        const footer = document.createElement('div');
        footer.className = 'popup-footer';

        const ratingSpan = document.createElement('span');
        ratingSpan.className = 'rating-badge';
        ratingSpan.textContent = `★ ${rating}`;

        const websiteLink = document.createElement('a');
        websiteLink.className = 'visit-link';
        websiteLink.href = website;
        websiteLink.target = '_blank';
        websiteLink.textContent = 'Visit Website →';

        infoContainer.appendChild(catSpan);
        infoContainer.appendChild(title);
        infoContainer.appendChild(desc);

        footer.appendChild(ratingSpan);
        footer.appendChild(websiteLink);
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
