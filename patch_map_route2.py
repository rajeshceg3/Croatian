import re

with open('map-module.js', 'r') as f:
    content = f.read()

search = """export function drawRoute(features) {
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
        className: 'route-line-anim' // We'll animate this in CSS
    }).addTo(currentMap);

    // Fit bounds with padding
    currentMap.fitBounds(currentRouteLayer.getBounds(), {
        padding: [50, 50],
        maxZoom: 14,
        animate: true,
        duration: 1.5
    });
}"""

replace = """export function drawRoute(features) {
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
        className: 'route-line-anim' // We'll animate this in CSS
    }).addTo(currentMap);

    // Optional: Add numbered markers
    features.forEach((f, idx) => {
        const [lng, lat] = f.geometry.coordinates;
        const numberIcon = L.divIcon({
            className: 'route-number-marker',
            html: `<div style="background:var(--accent-color); color:white; width:24px; height:24px; border-radius:50%; display:flex; justify-content:center; align-items:center; font-weight:700; font-size:12px; border:2px solid white; box-shadow:0 2px 5px rgba(0,0,0,0.3); transform:translate(-12px, -12px);">${idx + 1}</div>`,
            iconSize: [24, 24]
        });

        // We'll attach these to the route layer group or add them and clear them
        // For simplicity, let's keep track of them in an array or featureGroup
    });

    // Fit bounds with padding
    currentMap.fitBounds(currentRouteLayer.getBounds(), {
        padding: [50, 50],
        maxZoom: 14,
        animate: true,
        duration: 1.5
    });
}"""

if search in content:
    with open('map-module.js', 'w') as f:
        f.write(content.replace(search, replace))
    print("Replaced map-module.js!")
else:
    print("Search block not found in map-module.js")
