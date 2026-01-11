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

// Define category to icon mapping
const iconMap = {
    "historical": "icons/historical.svg",
    "natural": "icons/natural.svg",
    "cultural": "icons/cultural.svg",
    "coastal": "icons/coastal.svg"
};

const defaultIconPath = 'icons/default.svg';

export function updateMarkers(map, features) {
    markers.clearLayers();
    features.forEach(feature => {
        const { name, category, description, rating, image_url, website } = feature.properties;
        const [lng, lat] = feature.geometry.coordinates;

        const iconUrl = iconMap[category.toLowerCase()] || defaultIconPath;

        // Slightly larger icons for better touch targets
        const customIcon = L.icon({
            iconUrl: iconUrl,
            iconSize: [36, 36],
            iconAnchor: [18, 36],
            popupAnchor: [0, -34]
        });

        const marker = L.marker([lat, lng], { icon: customIcon });

        marker.on('mouseover', function (e) {
            // CSS transition handles the hover effect
            this.getElement().classList.add('marker-hover');
        });
        marker.on('mouseout', function (e) {
            this.getElement().classList.remove('marker-hover');
        });

        const popupContent = document.createElement('div');
        popupContent.className = 'custom-popup';

        const imageContainer = document.createElement('div');
        imageContainer.className = 'popup-image';

        // Add a placeholder or loading state for image
        const img = document.createElement('img');
        img.src = image_url;
        img.alt = name;
        img.loading = "lazy"; // Native lazy loading

        img.onerror = () => {
            img.onerror = null;
            img.src = 'icons/default.svg'; // Fallback
            img.style.objectFit = "contain";
            img.style.padding = "20px";
            img.style.backgroundColor = "#f0f2f5";
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
            maxWidth: 300,
            minWidth: 300,
            className: 'polished-popup' // We can target this class if needed
        });
        markers.addLayer(marker);
    });
    map.addLayer(markers);
}
