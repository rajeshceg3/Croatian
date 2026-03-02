export function setupVibeMatcher(filterCallback) {
    const btn = document.getElementById('vibe-matcher-btn');
    if (!btn) return;

    let modal = document.getElementById('vibe-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'vibe-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-header">
                    <h3 style="font-size:24px;">✨ Find Your Vibe</h3>
                    <p style="color:var(--text-secondary);">Answer 3 quick questions to find your perfect spots.</p>
                </div>
                <div class="modal-body" id="vibe-quiz-body">
                    <!-- Questions injected here -->
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.modal-close').onclick = () => {
            modal.classList.remove('visible');
            setTimeout(() => modal.classList.add('hidden'), 300);
        };
    }

    const questions = [
        {
            id: 'q1',
            text: "What's your ideal morning?",
            options: [
                { text: "🥾 Hiking a mountain trail", value: "active" },
                { text: "☕ Coffee in a historic square", value: "chill" },
                { text: "🏛️ Exploring ancient ruins", value: "history" }
            ]
        },
        {
            id: 'q2',
            text: "Pick a dinner vibe:",
            options: [
                { text: "🌅 Sunset picnic by the sea", value: "nature" },
                { text: "🍷 Fine dining with local wine", value: "luxury" },
                { text: "🍢 Street food and bustling crowds", value: "culture" }
            ]
        },
        {
            id: 'q3',
            text: "Your camera roll is full of:",
            options: [
                { text: "📸 Selfies & OOTD", value: "photo" },
                { text: "🌄 Landscapes & Sunsets", value: "scenic" },
                { text: "🧱 Details of old buildings", value: "arch" }
            ]
        }
    ];

    let currentStep = 0;
    let scores = { active: 0, chill: 0, history: 0, nature: 0, luxury: 0, culture: 0, photo: 0 };

    const renderQuestion = () => {
        const q = questions[currentStep];
        const container = modal.querySelector('#vibe-quiz-body');

        if (currentStep >= questions.length) {
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
        }

        let html = `<h4 style="margin:0 0 24px; font-size:18px;">${q.text}</h4><div style="display:flex; flex-direction:column; gap:12px;">`;

        q.options.forEach(opt => {
            html += `<button class="vibe-option-btn" data-val="${opt.value}">${opt.text}</button>`;
        });
        html += `</div>`;
        html += `<div style="margin-top:24px; display:flex; justify-content:center; gap:4px;">
            ${questions.map((_, i) => `<div style="width:8px; height:8px; border-radius:50%; background:${i === currentStep ? 'var(--accent-color)' : '#e2e8f0'};"></div>`).join('')}
        </div>
        <div style="text-align:center; font-size:12px; font-weight:600; color:var(--text-tertiary); margin-top: 12px;">Question ${currentStep + 1} of ${questions.length}</div>`;

        container.innerHTML = html;

        container.querySelectorAll('.vibe-option-btn').forEach(b => {
            b.onclick = () => {
                // Score logic
                const val = b.dataset.val;
                if(val === 'active') { scores.active += 2; scores.nature += 1; }
                if(val === 'chill') { scores.chill += 2; scores.culture += 1; }
                if(val === 'history') { scores.history += 2; scores.culture += 1; }
                if(val === 'nature') { scores.nature += 2; scores.chill += 1; }
                if(val === 'luxury') { scores.luxury += 2; scores.culture += 1; }
                if(val === 'culture') { scores.culture += 2; scores.history += 1; }
                if(val === 'photo') { scores.photo += 2; scores.luxury += 1; }
                if(val === 'scenic') { scores.nature += 2; scores.photo += 1; }
                if(val === 'arch') { scores.history += 2; scores.photo += 1; }

                currentStep++;
                renderQuestion();
            };
        });
    };

    const getTopMatchName = (filterTags) => {
        // Mock logic: return a hardcoded name based on category
        if (filterTags.cat === 'historical') return "Diocletian's Palace";
        if (filterTags.cat === 'natural') return "Plitvice Lakes National Park";
        if (filterTags.cat === 'adventure') return "Omis Zipline";
        if (filterTags.cat === 'gastronomy') return "Pula Arena"; // Mock
        if (filterTags.cat === 'cultural') return "Zagreb Upper Town";
        return "Dubrovnik City Walls"; // Default for photo/others
    };

    const calculateVibeResult = (s) => {
        // Simple heuristic
        if (s.history >= 3) return { title: "History Buff", icon: "🏛️", desc: "You love stories of the past and ancient stones.", filterTags: { cat: 'historical', tags: ['History', 'UNESCO'] } };
        if (s.nature >= 3) return { title: "Nature Lover", icon: "🌿", desc: "Fresh air and green landscapes are your fuel.", filterTags: { cat: 'natural', tags: ['Nature', 'Hiking'] } };
        if (s.active >= 2) return { title: "Adventurer", icon: "⚡", desc: "You can't sit still—bring on the action!", filterTags: { cat: 'adventure', tags: ['Hiking', 'Water Sports'] } };
        if (s.luxury >= 2) return { title: "Bon Vivant", icon: "🍷", desc: "You appreciate the finer things in life.", filterTags: { cat: 'gastronomy', tags: ['Wine', 'Luxury', 'Fine Dining'] } };
        if (s.photo >= 2) return { title: "Influencer", icon: "📸", desc: "Doing it for the 'gram (and the memories).", filterTags: { tags: ['Photography', 'Views', 'Sunset'] } };

        return { title: "Cultural Explorer", icon: "🌍", desc: "You want to soak up the local way of life.", filterTags: { cat: 'cultural', tags: ['Museum', 'Art'] } };
    };

    const applyVibeFilters = (criteria, cb) => {
        // Clear existing
        document.getElementById('clear-filters').click();

        // Apply new
        // 1. Category (Case-insensitive)
        if (criteria.cat) {
            const chips = document.querySelectorAll('.filter-chip');
            chips.forEach(chip => {
                if (chip.dataset.value && chip.dataset.value.toLowerCase() === criteria.cat.toLowerCase()) {
                    chip.classList.add('active');
                }
            });
        }

        // 2. Collection if matches (simplified)
        if (criteria.tags && criteria.tags.includes('Photography')) {
            const col = document.querySelector('.collection-chip[data-collection="Photography"]');
            if (col) col.classList.add('active');
        }

        // Trigger filter
        cb();
    };

    btn.addEventListener('click', () => {
        currentStep = 0;
        scores = { active: 0, chill: 0, history: 0, nature: 0, luxury: 0, culture: 0, photo: 0 };
        renderQuestion();
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.add('visible'), 10);
    });
}
