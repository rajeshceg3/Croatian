// Initialize the map
const map = L.map('map').setView([45.1, 15.2], 7); // Centered on Croatia

// Add a tile layer (Stamen Watercolor)
L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg', {
    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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

let allFeatures = []; // To store all GeoJSON features

// Fetch GeoJSON data
fetch('data.geojson')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        allFeatures = data.features; // Store features
        const categories = [...new Set(allFeatures.map(feature => feature.properties.category))];
        createCategoryFilters(categories);
        updateMarkers(allFeatures); // Initial display of all markers
        console.log("Markers with custom icons added to map.");
    })
    .catch(error => {
        console.error('Error fetching or processing GeoJSON data:', error);
    });

function createCategoryFilters(categories) {
    const filtersContainer = document.getElementById('category-filters');
    categories.forEach(category => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = category.toLowerCase();
        checkbox.value = category.toLowerCase();
        checkbox.checked = true;
        checkbox.addEventListener('change', filterSites);

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.appendChild(document.createTextNode(category));

        const br = document.createElement('br');

        filtersContainer.appendChild(checkbox);
        filtersContainer.appendChild(label);
        filtersContainer.appendChild(br);
    });
}

document.getElementById('search-input').addEventListener('input', filterSites);

function filterSites() {
    const searchText = document.getElementById('search-input').value.toLowerCase();
    const selectedCategories = Array.from(document.querySelectorAll('#category-filters input:checked')).map(cb => cb.value);

    const filteredFeatures = allFeatures.filter(feature => {
        const name = feature.properties.name.toLowerCase();
        const category = feature.properties.category.toLowerCase();
        return name.includes(searchText) && selectedCategories.includes(category);
    });

    updateMarkers(filteredFeatures);
    updateSearchResults(filteredFeatures);
}

function updateMarkers(features) {
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
            <div class="popup-content">
                <h3>${name}</h3>
                <img src="${image_url}" alt="${name}" style="width:100%;height:auto;">
                <p>${description}</p>
                <p><strong>Rating:</strong> ${rating} / 5</p>
                <a href="${website}" target="_blank">Visit Website</a>
            </div>
        `;
        marker.bindPopup(popupContent);
        markers.addLayer(marker);
    });
    map.addLayer(markers);
}

function updateSearchResults(features) {
    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.innerHTML = '';
    features.forEach(feature => {
        const { name } = feature.properties;
        const [lng, lat] = feature.geometry.coordinates;
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.textContent = name;
        resultItem.addEventListener('click', () => {
            map.flyTo([lat, lng], 14);
        });
        searchResultsContainer.appendChild(resultItem);
    });
}

console.log("Map initialized and data loading initiated with custom icons logic.");

document.getElementById('toggle-btn').addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('hidden');
});
