import re

with open('map.js', 'r') as f:
    content = f.read()

search = """// Listen for flyToSite event from My Trip list"""

replace = """// Listen for Show Route Event
        document.addEventListener('showTripRoute', (e) => {
            const features = e.detail.features;
            if (features && features.length > 1) {
                drawRoute(features);

                // On mobile, optionally collapse the modal slightly or close it
                // so they can see the map. For now, let's keep it simple.
                if (window.innerWidth <= 768) {
                    const modal = document.getElementById('my-trip-modal');
                    if (modal) modal.querySelector('.modal-close').click();
                }
            } else {
                clearRoute();
            }
        });

        // Listen for Hide Route Event
        document.addEventListener('hideTripRoute', () => {
            clearRoute();
        });

        // Listen for flyToSite event from My Trip list"""

if search in content:
    with open('map.js', 'w') as f:
        f.write(content.replace(search, replace))
    print("Replaced map.js!")
else:
    print("Search block not found in map.js")
