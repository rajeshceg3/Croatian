import re

with open('ui-module.js', 'r') as f:
    content = f.read()

# Replace the entirely bad cultural path with a simpler, working one or just fix the formatting.
search = """    "cultural": `<path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8 -8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>`,"""

# A clean, standard SVG path for a globe/culture icon
replace = """    "cultural": `<path fill="currentColor" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2ZM11 19.93A8 8 0 0 1 4.07 13H11ZM11 11H4.07A8 8 0 0 1 11 4.07ZM13 4.07A8 8 0 0 1 19.93 11H13ZM13 13H19.93A8 8 0 0 1 13 19.93Z"/>`,"""

if search in content:
    with open('ui-module.js', 'w') as f:
        f.write(content.replace(search, replace))
    print("Replaced in ui-module.js")
else:
    print("Not found in ui-module.js")
