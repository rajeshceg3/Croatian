import re

with open('index.html', 'r') as f:
    content = f.read()

search = """            <div class="search-container">"""

replace = """            <div id="dynamic-greeting-container"></div>
            <div class="search-container">"""

if search in content:
    with open('index.html', 'w') as f:
        f.write(content.replace(search, replace))
    print("Replaced!")
else:
    print("Search block not found")
