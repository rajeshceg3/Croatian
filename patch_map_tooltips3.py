import re

with open('map-module.js', 'r') as f:
    content = f.read()

search = """export function openMarkerPopup(name) {
    const marker = markerLookup[name];
    if (marker) {
        markers.zoomToShowLayer(marker, () => {
             marker.openPopup();
        });
    }
}"""

replace = """export function openMarkerPopup(name) {
    const marker = markerLookup[name];
    if (marker) {
        markers.zoomToShowLayer(marker, () => {
             marker.openPopup();
        });
    }
}

// Listen for Fun Fact Tooltips
document.addEventListener('showFunFactTooltip', (e) => {
    const name = e.detail.name;
    const marker = markerLookup[name];
    if (marker && marker.hasFunFact && !marker.isPopupOpen()) {
        const visibleParent = markers.getVisibleParent(marker);
        if (visibleParent && visibleParent === marker) {
            marker.openTooltip();
            // Auto close after 5s
            setTimeout(() => {
                if (marker.isTooltipOpen()) marker.closeTooltip();
            }, 5000);
        }
    }
});"""

if search in content:
    with open('map-module.js', 'w') as f:
        f.write(content.replace(search, replace))
    print("Replaced map-module.js tooltips 3!")
else:
    print("Search block not found in map-module.js")
