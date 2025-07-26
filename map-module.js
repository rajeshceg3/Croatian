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
            this.getElement().classList.add('marker-hover');
        });
        marker.on('mouseout', function (e) {
            this.getElement().classList.remove('marker-hover');
        });

        const popupContent = document.createElement('div');
        popupContent.className = 'custom-popup';

        const imageContainer = document.createElement('div');
        imageContainer.className = 'popup-image';
        const img = document.createElement('img');
        img.src = image_url;
        img.alt = name;
        img.onerror = () => { img.src = 'icons/default.svg'; };
        imageContainer.appendChild(img);

        const infoContainer = document.createElement('div');
        infoContainer.className = 'popup-info';

        const title = document.createElement('h4');
        title.textContent = name;

        const desc = document.createElement('p');
        desc.textContent = description;

        const footer = document.createElement('div');
        footer.className = 'popup-footer';

        const ratingSpan = document.createElement('span');
        ratingSpan.textContent = `Rating: ${rating} / 5`;

        const websiteLink = document.createElement('a');
        websiteLink.href = website;
        websiteLink.target = '_blank';
        websiteLink.textContent = 'Website';

        footer.appendChild(ratingSpan);
        footer.appendChild(websiteLink);

        infoContainer.appendChild(title);
        infoContainer.appendChild(desc);
        infoContainer.appendChild(footer);

        popupContent.appendChild(imageContainer);
        popupContent.appendChild(infoContainer);

        marker.bindPopup(popupContent);
        markers.addLayer(marker);
    });
    map.addLayer(markers);
}
