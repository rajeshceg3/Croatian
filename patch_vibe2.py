import re

with open('vibe-matcher.js', 'r') as f:
    content = f.read()

search = """    const calculateVibeResult = (s) => {"""

replace = """    const getTopMatchName = (filterTags) => {
        // Mock logic: return a hardcoded name based on category
        if (filterTags.cat === 'historical') return "Diocletian's Palace";
        if (filterTags.cat === 'natural') return "Plitvice Lakes National Park";
        if (filterTags.cat === 'adventure') return "Omis Zipline";
        if (filterTags.cat === 'gastronomy') return "Pula Arena"; // Mock
        if (filterTags.cat === 'cultural') return "Zagreb Upper Town";
        return "Dubrovnik City Walls"; // Default for photo/others
    };

    const calculateVibeResult = (s) => {"""

if search in content:
    with open('vibe-matcher.js', 'w') as f:
        f.write(content.replace(search, replace))
    print("Replaced!")
else:
    print("Search block not found")
