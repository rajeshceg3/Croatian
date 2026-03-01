import re

with open('ui-module.js', 'r') as f:
    content = f.read()

search = """    "cultural": `<path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8 -8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>`,"""

replace = """    "cultural": `<path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8 -8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>`,"""

if search in content:
    with open('ui-module.js', 'w') as f:
        f.write(content.replace(search, replace))
    print("Replaced in ui-module.js")
else:
    print("Not found in ui-module.js")
