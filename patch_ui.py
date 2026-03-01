import re

with open('ui-module.js', 'r') as f:
    content = f.read()

search = """    // Phrase of the Moment
    const phraseBox = document.createElement('div');
    phraseBox.className = 'phrase-box dynamic-extra-section';
    phraseBox.style.marginTop = '24px';

    const phrases = [
        { hr: "Hvala", en: "Thank you" },
        { hr: "Molim", en: "Please" },
        { hr: "Bok", en: "Hi / Bye" },
        { hr: "Pivo", en: "Beer" },
        { hr: "Dobar dan", en: "Good day" },
        { hr: "Koliko košta?", en: "How much?" },
        { hr: "Živjeli", en: "Cheers" },
        { hr: "Oprostite", en: "Excuse me" }
    ];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

    phraseBox.innerHTML = `
        <div style="font-size:11px; font-weight:700; color:var(--text-tertiary); text-transform:uppercase; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
            <span>🇭🇷 Phrase of the Moment</span>
            <button class="audio-play-btn" style="width:20px; height:20px;" title="Listen">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
            </button>
        </div>
        <div style="background:var(--bg-color); padding:12px; border-radius:8px; display:flex; flex-direction:column; align-items:center; text-align:center;">
            <span style="font-size:16px; font-weight:700; color:var(--text-primary); margin-bottom:2px;">${randomPhrase.hr}</span>
            <span style="font-size:13px; color:var(--text-secondary);">${randomPhrase.en}</span>
        </div>
    `;

    // Audio Logic for Phrase
    const pBtn = phraseBox.querySelector('.audio-play-btn');
    pBtn.onclick = () => {
        const u = new SpeechSynthesisUtterance(randomPhrase.hr);
        u.lang = 'hr-HR';
        window.speechSynthesis.speak(u);
    };"""

replace = """    // Local Lingo
    const phraseBox = document.createElement('div');
    phraseBox.className = 'phrase-box dynamic-extra-section local-lingo-box';
    phraseBox.style.marginTop = '24px';

    const lingoByCategory = {
        'gastronomy': [
            { hr: "Mogu li dobiti jelovnik?", en: "Can I have the menu?" },
            { hr: "Račun, molim", en: "The bill, please" },
            { hr: "Jako ukusno", en: "Very tasty" }
        ],
        'historical': [
            { hr: "Jednu kartu, molim", en: "One ticket, please" },
            { hr: "Gdje je muzej?", en: "Where is the museum?" },
            { hr: "Smijem li slikati?", en: "May I take photos?" }
        ],
        'cultural': [
            { hr: "Jednu kartu, molim", en: "One ticket, please" },
            { hr: "Gdje je muzej?", en: "Where is the museum?" },
            { hr: "Smijem li slikati?", en: "May I take photos?" }
        ],
        'coastal': [
            { hr: "Gdje je plaža?", en: "Where is the beach?" },
            { hr: "Trebam brod", en: "I need a boat" },
            { hr: "Predivno", en: "Beautiful" }
        ],
        'natural': [
            { hr: "Gdje je staza?", en: "Where is the trail?" },
            { hr: "Predivno", en: "Beautiful" },
            { hr: "Idemo!", en: "Let's go!" }
        ],
        'adventure': [
            { hr: "Je li sigurno?", en: "Is it safe?" },
            { hr: "Trebam pomoć", en: "I need help" },
            { hr: "Idemo!", en: "Let's go!" }
        ],
        'default': [
            { hr: "Hvala", en: "Thank you" },
            { hr: "Koliko košta?", en: "How much?" },
            { hr: "Dobar dan", en: "Good day" }
        ]
    };

    const catKey = category ? category.toLowerCase() : 'default';
    const phrases = lingoByCategory[catKey] || lingoByCategory['default'];

    let phraseHtml = '';
    phrases.forEach((p, i) => {
        phraseHtml += `
            <div class="lingo-item" style="display:flex; justify-content:space-between; align-items:center; padding:8px; border-bottom: ${i < phrases.length - 1 ? '1px solid var(--border-color)' : 'none'};">
                <div style="display:flex; flex-direction:column;">
                    <span style="font-size:14px; font-weight:600; color:var(--text-primary);">${p.hr}</span>
                    <span style="font-size:12px; color:var(--text-secondary);">${p.en}</span>
                </div>
                <button class="audio-play-btn lingo-audio-btn" data-phrase="${p.hr}" style="width:28px; height:28px;" title="Listen">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                </button>
            </div>
        `;
    });

    phraseBox.innerHTML = `
        <div style="font-size:11px; font-weight:700; color:var(--text-tertiary); text-transform:uppercase; margin-bottom:8px; display:flex; align-items:center;">
            <span>🇭🇷 Local Lingo</span>
        </div>
        <div style="background:var(--surface-color); border:1px solid var(--border-color); border-radius:var(--radius-md); display:flex; flex-direction:column;">
            ${phraseHtml}
        </div>
    `;

    // Audio Logic for Phrases
    phraseBox.querySelectorAll('.lingo-audio-btn').forEach(btn => {
        btn.onclick = (e) => {
            const hrText = e.currentTarget.getAttribute('data-phrase');
            const u = new SpeechSynthesisUtterance(hrText);
            u.lang = 'hr-HR';
            window.speechSynthesis.speak(u);
        };
    });"""

if search in content:
    with open('ui-module.js', 'w') as f:
        f.write(content.replace(search, replace))
    print("Replaced!")
else:
    print("Search block not found")
