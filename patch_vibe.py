import re

with open('vibe-matcher.js', 'r') as f:
    content = f.read()

search = """        if (currentStep >= questions.length) {
            // Finish
            const result = calculateVibeResult(scores);
            container.innerHTML = `
                <div style="font-size:40px; margin-bottom:16px;">${result.icon}</div>
                <h4 style="font-size:20px; margin:0 0 8px;">You're a ${result.title}!</h4>
                <p style="color:var(--text-secondary); margin-bottom:24px;">${result.desc}</p>
                <button id="apply-vibe-btn" class="website-btn">Show My Matches</button>
            `;

            modal.querySelector('#apply-vibe-btn').onclick = () => {
                applyVibeFilters(result.filterTags, filterCallback);
                modal.classList.remove('visible');
                setTimeout(() => modal.classList.add('hidden'), 300);
            };
            return;
        }"""

replace = """        if (currentStep >= questions.length) {
            // Finish
            const result = calculateVibeResult(scores);

            // Generate a Top Match (mock logic based on vibe)
            const topMatchName = getTopMatchName(result.filterTags);

            container.innerHTML = `
                <div style="font-size:40px; margin-bottom:16px;">${result.icon}</div>
                <h4 style="font-size:20px; margin:0 0 8px;">You're a ${result.title}!</h4>
                <p style="color:var(--text-secondary); margin-bottom:16px;">${result.desc}</p>

                ${topMatchName ? `
                <div class="top-match-card">
                    <div class="top-match-header">🌟 Top Match For You</div>
                    <div class="top-match-title">${topMatchName}</div>
                    <div class="top-match-desc">Based on your answers, we think you'll love this spot.</div>
                </div>
                ` : ''}

                <button id="apply-vibe-btn" class="website-btn" style="margin-top:24px;">Show All Matches</button>
            `;

            modal.querySelector('#apply-vibe-btn').onclick = () => {
                applyVibeFilters(result.filterTags, filterCallback);
                modal.classList.remove('visible');
                setTimeout(() => modal.classList.add('hidden'), 300);

                if (topMatchName) {
                    setTimeout(() => {
                        // We need access to allFeatures or we can dispatch an event to map.js
                        document.dispatchEvent(new CustomEvent('vibeMatchFound', { detail: { name: topMatchName } }));
                    }, 500);
                }
            };
            return;
        }"""

if search in content:
    with open('vibe-matcher.js', 'w') as f:
        f.write(content.replace(search, replace))
    print("Replaced!")
else:
    print("Search block not found")
