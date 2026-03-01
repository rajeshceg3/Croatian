import re

with open('ui-module.js', 'r') as f:
    content = f.read()

search = """export function setupOnboarding() {"""

replace = """export function setupDynamicGreeting(filterCallback) {
    const container = document.getElementById('dynamic-greeting-container');
    if (!container) return;

    const hour = new Date().getHours();
    let greeting = "";
    let suggestion = "";
    let suggestionTag = "";

    if (hour >= 5 && hour < 12) {
        greeting = "Dobro jutro ☀️"; // Good morning
        suggestion = "Coffee Spots";
        suggestionTag = "chill"; // Needs a map to a filter
    } else if (hour >= 12 && hour < 18) {
        greeting = "Dobar dan 🌤️"; // Good afternoon
        suggestion = "Find Lunch";
        suggestionTag = "gastronomy";
    } else {
        greeting = "Dobra večer 🌙"; // Good evening
        suggestion = "Sunset Views";
        suggestionTag = "Sunset"; // Collection tag
    }

    container.innerHTML = `
        <div class="dynamic-greeting">
            <span class="greeting-text">${greeting}</span>
            <button class="greeting-suggestion" data-tag="${suggestionTag}">${suggestion}</button>
        </div>
    `;

    const btn = container.querySelector('.greeting-suggestion');
    btn.onclick = () => {
        // Clear existing filters
        document.getElementById('clear-filters').click();

        const tag = btn.dataset.tag;

        // Try to find category first
        const catChip = document.querySelector(`.filter-chip[data-value="${tag.toLowerCase()}"]`);
        if (catChip) {
            catChip.click();
            return;
        }

        // Try to find collection
        const colChip = document.querySelector(`.collection-chip[data-collection="${tag}"]`);
        if (colChip) {
            colChip.click();
            return;
        }

        // If 'chill' isn't mapped, default to coastal/nature or search
        if (tag === 'chill') {
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.value = 'coffee';
                const inputEvent = new Event('input', { bubbles: true });
                searchInput.dispatchEvent(inputEvent);
            }
        }
    };
}

export function setupOnboarding() {"""

if search in content:
    with open('ui-module.js', 'w') as f:
        f.write(content.replace(search, replace))
    print("Replaced!")
else:
    print("Search block not found")
