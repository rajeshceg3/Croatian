// Initialize the map
const map = L.map('map').setView([45.1, 15.2], 7); // Centered on Croatia

// Add a tile layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Create a marker cluster group
const markers = L.markerClusterGroup();

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

// Fetch GeoJSON data
fetch('data.geojson')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        data.features.forEach(feature => {
            const { name, category, description, rating, image_url, website } = feature.properties;
            const [lng, lat] = feature.geometry.coordinates; // GeoJSON coordinates are [lng, lat]

            // Determine icon URL
            const iconUrl = iconMap[category.toLowerCase()] || defaultIconPath;

            // Create custom icon
            const customIcon = L.icon({
                iconUrl: iconUrl,
                iconSize: [32, 32], // Size of the icon
                iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
                popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
            });

            // Create a marker with the custom icon
            const marker = L.marker([lat, lng], { icon: customIcon }); // Leaflet coordinates are [lat, lng]

            // Add a simple popup with the site name
            marker.bindPopup(`<b>${name}</b>`);

            // Add marker to the cluster group
            markers.addLayer(marker);
        });

        // Add the marker cluster group to the map
        map.addLayer(markers);
        console.log("Markers with custom icons added to map.");
    })
    .catch(error => {
        console.error('Error fetching or processing GeoJSON data:', error);
    });

console.log("Map initialized and data loading initiated with custom icons logic.");
