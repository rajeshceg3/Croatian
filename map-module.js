// This module will be responsible for map initialization and management.
export function initializeMap() {
    const map = L.map('map').setView([45.1, 15.2], 7); // Centered on Croatia
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    return map;
}

export const markers = L.markerClusterGroup();

// Define category to icon mapping
const iconMap = {
    "historical": "icons/historical.svg",
    "natural": "icons/natural.svg",
    "cultural": "icons/cultural.svg",
    "coastal": "icons/coastal.svg"
    // Add more categories and their icons if needed
};

// Default icon if a category is not in iconMap or is undefined
const defaultIconPath = 'icons/default.svg'; // Assuming you might add a default.svg later

export function updateMarkers(map, features) {
    markers.clearLayers();
    features.forEach(feature => {
        const { name, category, description, rating, image_url, website } = feature.properties;
        const [lng, lat] = feature.geometry.coordinates;

        const iconUrl = iconMap[category.toLowerCase()] || defaultIconPath;
        const customIcon = L.icon({
            iconUrl: iconUrl,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });

        const marker = L.marker([lat, lng], { icon: customIcon });

        marker.on('mouseover', function (e) {
            this.setOpacity(0.7);
        });
        marker.on('mouseout', function (e) {
            this.setOpacity(1.0);
        });

        let popupContent = `
            <div class="custom-popup">
                <div class="popup-image">
                    <img src="${image_url}" alt="${name}">
                </div>
                <div class="popup-info">
                    <h4>${name}</h4>
                    <p>${description}</p>
                    <div class="popup-footer">
                        <span>Rating: ${rating} / 5</span>
                        <a href="${website}" target="_blank">Website</a>
                    </div>
                </div>
            </div>
        `;
        marker.bindPopup(popupContent);
        markers.addLayer(marker);
    });
    map.addLayer(markers);
}
