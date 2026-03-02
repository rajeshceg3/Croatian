import re

with open('map-module.js', 'r') as f:
    content = f.read()

search = """        // Add to lookup
        markerLookup[name] = marker;"""

replace = """        // Add to lookup
        markerLookup[name] = marker;

        // Setup Fun Fact Tooltip
        const funFact = feature.properties.fun_fact;
        if (funFact) {
            marker.bindTooltip(`
                <div class="tooltip-header">💡 Did you know?</div>
                <div>${funFact}</div>
            `, {
                className: 'fun-fact-tooltip',
                direction: 'top',
                offset: [0, -40]
            });
            marker.hasFunFact = true;
        }"""

if search in content:
    with open('map-module.js', 'w') as f:
        f.write(content.replace(search, replace))
    print("Replaced map-module.js tooltips!")
else:
    print("Search block not found in map-module.js")
