import re

with open('map.js', 'r') as f:
    content = f.read()

search = """// Show loading"""

replace = """// Did You Know? Tooltips Logic
let lastTooltipTime = 0;
map.on('moveend', () => {
    const now = Date.now();
    // Only show a tooltip every 30 seconds at most to avoid annoyance
    if (now - lastTooltipTime < 30000) return;

    // Must be zoomed in enough
    if (map.getZoom() < 12) return;

    const bounds = map.getBounds();
    const visibleFeatures = currentFilteredFeatures.filter(f => {
        const [lng, lat] = f.geometry.coordinates;
        return bounds.contains(L.latLng(lat, lng));
    });

    // Find markers in view that have a fun fact
    const factMarkers = visibleFeatures.filter(f => f.properties.fun_fact);

    if (factMarkers.length > 0) {
        // Pick a random one
        const target = factMarkers[Math.floor(Math.random() * factMarkers.length)];

        // Find the Leaflet marker
        // Since markerLookup is in map-module.js, we need to expose a way to open it,
        // or just use our openMarkerTooltip function.
        // Let's create an event or just let map-module handle it if we imported markerLookup.
        // Actually, we can dispatch an event to map-module.
        document.dispatchEvent(new CustomEvent('showFunFactTooltip', { detail: { name: target.properties.name } }));
        lastTooltipTime = now;
    }
});

// Show loading"""

if search in content:
    with open('map.js', 'w') as f:
        f.write(content.replace(search, replace))
    print("Replaced map.js tooltips!")
else:
    print("Search block not found in map.js")
