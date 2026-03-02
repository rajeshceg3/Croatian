import re

with open('map.js', 'r') as f:
    content = f.read()

search = """        // Listen for flyToSite event from My Trip list"""

replace = """        // Listen for Vibe Match event
        document.addEventListener('vibeMatchFound', (e) => {
            const name = e.detail.name;
            const feature = allFeatures.find(f => f.properties.name === name);
            if (feature) {
                const [lng, lat] = feature.geometry.coordinates;
                map.flyTo([lat, lng], 16, { animate: true, duration: 1.5 });
                setTimeout(() => openDetailPanel(feature, allFeatures), 1500);
            }
        });

        // Listen for flyToSite event from My Trip list"""

if search in content:
    with open('map.js', 'w') as f:
        f.write(content.replace(search, replace))
    print("Replaced!")
else:
    print("Search block not found")
