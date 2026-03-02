import re

with open('ui-module.js', 'r') as f:
    content = f.read()

search = """    const startBtn = document.getElementById('trip-start-action');
    const shareBtn = document.getElementById('trip-share-action');

    if (!btn || !modal) return;"""

replace = """    const startBtn = document.getElementById('trip-start-action');
    const shareBtn = document.getElementById('trip-share-action');

    if (!btn || !modal) return;

    // Add Show Route Toggle
    const footer = modal.querySelector('.modal-footer');
    let routeToggleContainer = modal.querySelector('.trip-actions-extended');
    if (!routeToggleContainer) {
        routeToggleContainer = document.createElement('div');
        routeToggleContainer.className = 'trip-actions-extended';
        routeToggleContainer.innerHTML = `
            <label class="show-route-toggle">
                <input type="checkbox" id="show-trip-route-cb" style="display:none;">
                <div class="toggle-switch"></div>
                <span>Show Route on Map</span>
            </label>
        `;
        footer.insertBefore(routeToggleContainer, footer.firstChild);

        const cb = document.getElementById('show-trip-route-cb');
        cb.addEventListener('change', (e) => {
            if (e.target.checked) {
                const favorites = getFavorites();
                const tripFeatures = favorites.map(name => allFeatures.find(f => f.properties.name === name)).filter(f => f);
                document.dispatchEvent(new CustomEvent('showTripRoute', { detail: { features: tripFeatures } }));
            } else {
                document.dispatchEvent(new CustomEvent('hideTripRoute'));
            }
        });
    }"""

search_close = """    const closeModal = () => {
        modal.classList.remove('visible');
        setTimeout(() => modal.classList.add('hidden'), 300);
    };"""

replace_close = """    const closeModal = () => {
        modal.classList.remove('visible');
        setTimeout(() => modal.classList.add('hidden'), 300);
        // Uncheck the toggle if they close
        const cb = document.getElementById('show-trip-route-cb');
        if (cb && cb.checked && window.innerWidth > 768) { // Keep route on mobile when closing modal
             // Wait, if they check it on mobile they want to see the map.
             // Maybe don't uncheck it automatically on desktop either until they clear filters.
        }
    };"""

if search in content:
    content = content.replace(search, replace)
    content = content.replace(search_close, replace_close)
    with open('ui-module.js', 'w') as f:
        f.write(content)
    print("Replaced ui-module.js!")
else:
    print("Search block not found in ui-module.js")
