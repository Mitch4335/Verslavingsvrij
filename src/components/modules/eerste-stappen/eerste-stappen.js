// src/components/modules/eerste-stappen/eerste-stappen.js

const optiesPerTraject = {
    alcohol: {
        vermijdingTitel: "Plaatsen & Situaties",
        vermijdingSubtitel: "Selecteer welke situaties of personen je de komende periode beter even kunt mijden of waarin je extra waakzaam moet zijn.",
        standaardVermijding: [
            { text: "Feestjes waar alcohol gedronken wordt", icon: "🎉" },
            { text: "In je eentje boodschappen doen", icon: "🛒" },
            { text: "Café / terras / kroeg", icon: "🍺" },
            { text: "Alleen thuis zijn", icon: "🛋️" }
        ],
        extraVermijding: [
            { text: "Werk- / studieborrels", icon: "💼" },
            { text: "Slijter / alcoholschap in de supermarkt", icon: "🏬" },
            { text: "Festivals / feesten", icon: "🎪" }
        ],
        standaardHandelingen: [
            { text: "Iets anders te drinken pakken: water / frisdrank / thee", icon: "🥤" },
            { text: "Weggaan uit de situatie", icon: "🚪" },
            { text: "Afleiding zoeken", icon: "🧩" },
            { text: "Er met iemand over praten", icon: "💬" }
        ],
        extraHandelingen: [
            { text: "Tegen mezelf zeggen dat het gevoel weggaat", icon: "🧠" },
            { text: "Een ademhalingsoefening", icon: "🫁" },
            { text: "Tot 10 tellen", icon: "🔢" }
        ],
        standaardAfleiding: [
            { text: "Wandelen", icon: "🚶‍♂️" },
            { text: "Sporten", icon: "💪" },
            { text: "Telefoongebruik", icon: "📱" },
            { text: "Muziek", icon: "🎧" }
        ],
        extraAfleiding: [
            { text: "Iemand bellen / spreken / opzoeken", icon: "📞" },
            { text: "Tv kijken", icon: "📺" },
            { text: "Gamen", icon: "🎮" },
            { text: "Opruimen", icon: "🧹" }
        ]
    },
    cannabis: {
        vermijdingTitel: "Plaatsen & Situaties",
        vermijdingSubtitel: "Selecteer welke situaties of personen je de komende periode beter even kunt mijden of waarin je extra waakzaam moet zijn.",
        standaardVermijding: [
            { text: "De coffeeshop (of erlangs gaan)", icon: "🏪" },
            { text: "Alleen thuis zijn", icon: "🛋️" },
            { text: "Geen afspraken hebben / verveling", icon: "⏳" },
            { text: "Feestjes waar geblowd wordt", icon: "🎉" }
        ],
        extraVermijding: [
            { text: "Plaatsen waar mensen vaak blowen", icon: "📍" },
            { text: "'s Avonds op de bank / voor het slapengaan", icon: "🌙" },
            { text: "Gamen of series kijken op vaste blowmomenten", icon: "🎮" },
            { text: "Stressvolle of onrustige momenten", icon: "⚡" }
        ],
        standaardHandelingen: [
            { text: "Even naar buiten voor frisse lucht", icon: "🌬️" },
            { text: "Weggaan uit de situatie", icon: "🚪" },
            { text: "Afleiding zoeken", icon: "🧩" },
            { text: "Er met iemand over praten", icon: "💬" }
        ],
        extraHandelingen: [
            { text: "Iets met mijn handen doen / tandenpoetsen", icon: "🪥" },
            { text: "Tegen mezelf zeggen dat het gevoel weggaat", icon: "🧠" },
            { text: "Een ademhalingsoefening", icon: "🫁" },
            { text: "Tot 10 tellen", icon: "🔢" }
        ],
        standaardAfleiding: [
            { text: "Wandelen", icon: "🚶‍♂️" },
            { text: "Sporten", icon: "💪" },
            { text: "Koken / iets klaarmaken", icon: "🍳" },
            { text: "Muziek", icon: "🎧" }
        ],
        extraAfleiding: [
            { text: "Iemand bellen / spreken / opzoeken", icon: "📞" },
            { text: "Fietsen", icon: "🚴" },
            { text: "Opruimen", icon: "🧹" },
            { text: "Tv kijken / gamen", icon: "📺" }
        ]
    },
    cocaine: {
        vermijdingTitel: "Plaatsen & Situaties",
        vermijdingSubtitel: "Selecteer welke situaties of personen je de komende periode beter even kunt mijden of waarin je extra waakzaam moet zijn.",
        standaardVermijding: [
            { text: "Uitgaan / kroeg / club / festival", icon: "🪩" },
            { text: "Feestjes waar gebruikt wordt", icon: "🎉" },
            { text: "Alcohol drinken (verlaagt de drempel)", icon: "🍺" },
            { text: "Alleen thuis zijn", icon: "🛋️" }
        ],
        extraVermijding: [
            { text: "Plaatsen waar mensen vaak gebruiken", icon: "📍" },
            { text: "Afterparty's / laat in de nacht doorgaan", icon: "🌙" },
            { text: "Salarisdag / contant geld op zak hebben", icon: "💶" },
            { text: "Verveling of stress na werk", icon: "💼" }
        ],
        standaardHandelingen: [
            { text: "Geen alcohol drinken op dit moment", icon: "🚫" },
            { text: "Weggaan uit de situatie", icon: "🚪" },
            { text: "Afleiding zoeken", icon: "🧩" },
            { text: "Er met iemand over praten", icon: "💬" }
        ],
        extraHandelingen: [
            { text: "Direct naar huis gaan voordat het laat wordt", icon: "🏠" },
            { text: "Tegen mezelf zeggen dat het gevoel weggaat", icon: "🧠" },
            { text: "Een ademhalingsoefening", icon: "🫁" },
            { text: "Tot 10 tellen", icon: "🔢" }
        ],
        standaardAfleiding: [
            { text: "Wandelen", icon: "🚶‍♂️" },
            { text: "Sporten", icon: "💪" },
            { text: "Douchen / koud water", icon: "🚿" },
            { text: "Muziek", icon: "🎧" }
        ],
        extraAfleiding: [
            { text: "Iemand bellen / spreken / opzoeken", icon: "📞" },
            { text: "Koken / iets klaarmaken", icon: "🍳" },
            { text: "Tv kijken / gamen", icon: "🎮" },
            { text: "Opruimen", icon: "🧹" }
        ]
    },
    gokken: {
        vermijdingTitel: "Plaatsen, situaties & blokkades",
        vermijdingSubtitel: "Selecteer welke situaties of personen je de komende periode beter even kunt mijden of waarin je extra waakzaam moet zijn.",
        standaardVermijding: [
            { text: "CRUKS (of andere gokblokkering) inschakelen", icon: "🔒" },
            { text: "Gokwebsites en gokapps vermijden", icon: "🌐" },
            { text: "Casino / gokautomaten / krasloten", icon: "🎰" },
            { text: "Alleen thuis zijn", icon: "🛋️" }
        ],
        extraVermijding: [
            { text: "Gokreclames in de mail blokkeren / uitschrijven", icon: "📧" },
            { text: "Nieuws over beleggingen, aandelen of crypto", icon: "📈" },
            { text: "Live sportwedstrijden kijken", icon: "⚽" },
            { text: "Salarisdag / veel geld op de betaalrekening", icon: "💳" },
            { text: "Verveling of geen plannen hebben", icon: "⏳" }
        ],
        standaardHandelingen: [
            { text: "Telefoon of laptop direct wegleggen", icon: "📵" },
            { text: "Weggaan uit de situatie", icon: "🚪" },
            { text: "Afleiding zoeken", icon: "🧩" },
            { text: "Er met iemand over praten", icon: "💬" }
        ],
        extraHandelingen: [
            { text: "Website of app meteen sluiten", icon: "❌" },
            { text: "Tegen mezelf zeggen dat het gevoel weggaat", icon: "🧠" },
            { text: "Een ademhalingsoefening", icon: "🫁" },
            { text: "Tot 10 tellen", icon: "🔢" }
        ],
        standaardAfleiding: [
            { text: "Wandelen", icon: "🚶‍♂️" },
            { text: "Sporten", icon: "💪" },
            { text: "Koken / iets klaarmaken", icon: "🍳" },
            { text: "Muziek", icon: "🎧" }
        ],
        extraAfleiding: [
            { text: "Iemand bellen / spreken / opzoeken", icon: "📞" },
            { text: "Douchen / koud water", icon: "🚿" },
            { text: "Tv kijken", icon: "📺" },
            { text: "Opruimen", icon: "🧹" }
        ]
    }
};

export function renderEersteStappen(container, onComplete) {
    let currentPage = 1;

    const actiefTraject = localStorage.getItem('actieveVerslaving') || 'alcohol';
    const config = optiesPerTraject[actiefTraject] || optiesPerTraject.alcohol;

    const keys = {
        vermijding: `arminius_vermijding_items_${actiefTraject}`,
        personen: `arminius_vermijd_personen_${actiefTraject}`,
        handelingen: `arminius_handelingen_items_${actiefTraject}`,
        afleiding: `arminius_afleiding_items_${actiefTraject}`
    };

    function loadArray(key, legacyAlcoholKey) {
        try {
            const raw = localStorage.getItem(key);
            if (raw !== null) return JSON.parse(raw);
            if (actiefTraject === 'alcohol' && legacyAlcoholKey) {
                const legacy = localStorage.getItem(legacyAlcoholKey);
                if (legacy !== null) return JSON.parse(legacy);
            }
        } catch (e) {}
        return [];
    }

    let isExtraVermijdingOpen = false;
    let isExtraHandelingenOpen = false;
    let isExtraAfleidingOpen = false;

    let savedVermijding = loadArray(keys.vermijding, 'arminius_vermijding_items');
    let savedPersonen = loadArray(keys.personen, 'arminius_vermijd_personen');
    let savedHandelingen = loadArray(keys.handelingen, 'arminius_handelingen_items');
    let savedAfleiding = loadArray(keys.afleiding, 'arminius_afleiding_items');

    const {
        vermijdingTitel,
        vermijdingSubtitel,
        standaardVermijding,
        extraVermijding,
        standaardHandelingen,
        extraHandelingen,
        standaardAfleiding,
        extraAfleiding
    } = config;

    // --- DE VASTE SCHIL MET PROGRESSIEBALK ---
    container.innerHTML = `
        <div style="padding: 20px;">
            <div id="es-progress-wrapper" style="background: #e2e8f0; height: 6px; border-radius: 3px; margin-bottom: 24px; overflow: hidden; max-width: 700px; margin-left: auto; margin-right: auto;">
                <div id="es-progress-bar" style="width: 0%; background: #2563eb; height: 100%; transition: width 0.5s ease-out;"></div>
            </div>
            <div id="es-page-content"></div>
        </div>
    `;

    const pageContainer = container.querySelector('#es-page-content');
    const progressWrapper = container.querySelector('#es-progress-wrapper');
    const progressBar = container.querySelector('#es-progress-bar');

    function updateProgress(percentage) {
        if (percentage > 100) {
            progressWrapper.style.display = 'none';
        } else {
            progressWrapper.style.display = 'block';
            setTimeout(() => {
                progressBar.style.width = percentage + '%';
            }, 50);
        }
    }

    function fitMultilineChips() {
        pageContainer.querySelectorAll('.es-chip').forEach(chip => {
            const textSpan = chip.querySelector('span:last-child');
            if (!textSpan || chip.offsetParent === null) return;
            textSpan.style.width = '';
            const range = document.createRange();
            range.selectNodeContents(textSpan);
            const lines = [];
            Array.from(range.getClientRects()).forEach(r => {
                const line = lines.find(l => Math.abs(l.top - r.top) < 5);
                if (line) {
                    line.left = Math.min(line.left, r.left);
                    line.right = Math.max(line.right, r.right);
                } else {
                    lines.push({ top: r.top, left: r.left, right: r.right });
                }
            });
            if (lines.length > 1) {
                const maxWidth = Math.max(...lines.map(l => l.right - l.left));
                textSpan.style.width = `${Math.ceil(maxWidth) + 2}px`;
            }
        });
    }

    pageContainer.addEventListener('click', (e) => {
        if (e.target.closest('.es-chip, .es-btn-more')) {
            requestAnimationFrame(fitMultilineChips);
        }
    });

    function render(preserveScroll = false) {
        const scrollY = window.scrollY;

        if (currentPage === 1) {
            updateProgress(33);
            renderIntroPage();
        } else if (currentPage === 2) {
            updateProgress(66);
            renderPage1();
        } else if (currentPage === 3) {
            updateProgress(100);
            renderPage2();
        } else {
            updateProgress(999);
            renderCompletionPage();
        }

        requestAnimationFrame(fitMultilineChips);

        if (preserveScroll) {
            window.scrollTo(0, scrollY);
        } else {
            window.scrollTo(0, 0);
        }
    }

    function triggerConfetti(onFinish) {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '99999';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const pieces = [];
        const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

        for (let i = 0; i < 140; i++) {
            pieces.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                size: Math.random() * 9 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: Math.random() * 5 + 5,
                speedX: Math.random() * 6 - 3,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 12 - 6
            });
        }

        let animationFrame;
        function update() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let activePieces = 0;

            pieces.forEach(p => {
                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += p.rotationSpeed;

                if (p.y < canvas.height) activePieces++;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                ctx.restore();
            });

            if (activePieces > 0) {
                animationFrame = requestAnimationFrame(update);
            } else {
                cancelAnimationFrame(animationFrame);
                if (document.body.contains(canvas)) document.body.removeChild(canvas);
                if (onFinish) onFinish();
            }
        }
        update();
    }

    function renderIntroPage() {
        pageContainer.innerHTML = `
            <style>
                @keyframes slideUpFade { 0% { opacity: 0; transform: translateY(15px); } 100% { opacity: 1; transform: translateY(0); } }
                .stagger-1 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.1s; }
                .stagger-2 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.2s; }
                .stagger-3 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.3s; }
                .stagger-4 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.4s; }
                .info-block { background: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid #3b82f6; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
            </style>
            
            <div class="eerste-stappen-container" style="max-width: 700px; margin: 0 auto; font-family: inherit;">
                <div style="margin-bottom: 32px;">
                    <span style="font-size: 14px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Module Introductie</span>
                    <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Eerste stappen naar verandering</h2>
                </div>

                <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">
                    <div class="stagger-1 info-block" style="border-left-color: #3b82f6; margin-bottom: 0;">
                        <span style="font-size: 24px; display: block; margin-bottom: 8px;">🚧</span>
                        <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                            <strong>Moeilijke situaties vermijden.</strong> In het begin is het enorm helpend om plekken te vermijden die zware trek bij je oproepen. Dit hoeft niet permanent te zijn, maar wél zolang jij je nog niet sterk genoeg voelt.
                        </p>
                    </div>
                    <div class="stagger-2 info-block" style="border-left-color: #f59e0b; margin-bottom: 0;">
                        <span style="font-size: 24px; display: block; margin-bottom: 8px;">🛡️</span>
                        <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                            <strong>Een actieplan.</strong> Je kunt natuurlijk niet élke situatie blijven vermijden. Daarom schrijven we ook concrete acties en vormen van afleiding op voor als je wél in de verleiding komt.
                        </p>
                    </div>
                    <div class="stagger-3 info-block" style="border-left-color: #10b981; margin-bottom: 0;">
                        <span style="font-size: 24px; display: block; margin-bottom: 8px;">💪</span>
                        <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                            <strong>Direct toepasbaar.</strong> Met dit concrete plan op zak sta je veel sterker in je schoenen tijdens deze cruciale eerste fase van je verandering.
                        </p>
                    </div>
                </div>

                <div class="stagger-4 button-group" style="display: flex; justify-content: flex-end;">
                    <button type="button" id="start-module-btn" style="background-color: #2563eb; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 15px;">
                        Doorgaan naar module &rarr;
                    </button>
                </div>
            </div>
        `;

        pageContainer.querySelector('#start-module-btn').addEventListener('click', () => {
            currentPage = 2;
            render();
        });
    }

    function renderPage1() {
        const allPredefinedVermijding = [...standaardVermijding, ...extraVermijding].map(i => i.text);
        const customVermijdingItems = savedVermijding.filter(item => !allPredefinedVermijding.includes(item));

        const visibleVermijding = [
            ...standaardVermijding,
            ...extraVermijding.filter(item => savedVermijding.includes(item.text))
        ];
        const hiddenVermijding = extraVermijding.filter(item => !savedVermijding.includes(item.text));

        pageContainer.innerHTML = `
            <style>
                @keyframes slideUpFade { 0% { opacity: 0; transform: translateY(15px); } 100% { opacity: 1; transform: translateY(0); } }
                .stagger-1 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.1s; }
                .stagger-2 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.2s; }
                .stagger-3 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.3s; }
                .info-block { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                
                .es-chip-group { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 16px; }
                .es-chip {
                    display: inline-flex; align-items: flex-start; gap: 8px; padding: 10px 14px; border-radius: 20px;
                    font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s;
                    border: 1px solid #cbd5e1; background: #ffffff; color: #334155; font-family: inherit;
                    text-align: left; line-height: 1.4; max-width: 100%; box-sizing: border-box;
                }
                .es-chip span:first-child { flex-shrink: 0; }
                
                .es-chip.selected-red { border: 1px solid #ef4444; background: #fef2f2; color: #b91c1c; font-weight: 600; box-shadow: 0 2px 4px rgba(239,68,68,0.1); }

                .custom-input-wrapper { display: flex; gap: 10px; align-items: center; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px 6px 6px 16px; }
                .custom-input-wrapper input { flex: 1; min-width: 0; border: none; background: transparent; outline: none; font-size: 14px; color: #334155; font-family: inherit; }
                .custom-input-wrapper .es-btn-add { background: #1e293b; color: white; border: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; transition: background 0.2s; flex-shrink: 0; }
                .custom-input-wrapper .es-btn-add:hover { background: #334155; }
                
                .es-btn-more { background: none; border: none; color: #2563eb; font-weight: 600; cursor: pointer; padding: 0; font-size: 14px; margin-bottom: 20px; }
            </style>
            
            <div class="eerste-stappen-container" style="max-width: 700px; margin: 0 auto; font-family: inherit;">
                <div style="margin-bottom: 24px;">
                    <span class="step-indicator" style="font-size: 14px; font-weight: 600; color: #ef4444; text-transform: uppercase; letter-spacing: 0.5px;">Stap 1 van 2</span>
                    <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Risico's en valkuilen</h2>
                    <p style="font-size: 15px; color: #64748b; margin-top: 6px;">${escapeHtml(vermijdingSubtitel)}</p>
                </div>

                <div class="info-block stagger-1" style="border-left-color: #ef4444;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                        <span style="font-size: 24px;">🛑</span>
                        <h3 style="font-size: 18px; color: #1e293b; margin: 0;">${escapeHtml(vermijdingTitel)}</h3>
                    </div>
                    
                    <div class="es-chip-group">
                        ${visibleVermijding.map(item => {
                            const isSelected = savedVermijding.includes(item.text);
                            return `
                                <button type="button" class="es-chip pill-btn ${isSelected ? 'selected-red' : ''}" data-item="${escapeHtml(item.text)}">
                                    <span>${item.icon}</span>
                                    <span>${escapeHtml(item.text)}</span>
                                </button>
                            `;
                        }).join('')}
                    </div>

                    ${hiddenVermijding.length > 0 ? `
                        <div id="extra-vermijding-box" class="es-chip-group" style="display: ${isExtraVermijdingOpen ? 'flex' : 'none'};">
                            ${hiddenVermijding.map(item => {
                                const isSelected = savedVermijding.includes(item.text);
                                return `
                                    <button type="button" class="es-chip pill-btn ${isSelected ? 'selected-red' : ''}" data-item="${escapeHtml(item.text)}">
                                        <span>${item.icon}</span>
                                        <span>${escapeHtml(item.text)}</span>
                                    </button>
                                `;
                            }).join('')}
                        </div>
                        <button type="button" id="toggle-extra-vermijding" class="es-btn-more">
                            <span class="text-meer" style="display: ${isExtraVermijdingOpen ? 'none' : 'inline'};">+ Meer voorbeelden...</span>
                            <span class="text-minder" style="display: ${isExtraVermijdingOpen ? 'inline' : 'none'};">- Minder voorbeelden...</span>
                        </button>
                    ` : ''}

                    ${customVermijdingItems.length > 0 ? `
                        <div class="es-chip-group custom-vermijding-group">
                            ${customVermijdingItems.map(item => `
                                <button type="button" class="es-chip custom-pill selected-red" data-item="${escapeHtml(item)}" title="Klik om te verwijderen">
                                    <span>✏️</span>
                                    <span>${escapeHtml(item)}</span>
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}

                    <div class="custom-input-wrapper">
                        <input type="text" id="custom-vermijding-input" placeholder="+ Voeg eigen situatie toe..." />
                        <button type="button" class="es-btn-add" id="add-custom-vermijding-btn">Toevoegen</button>
                    </div>
                </div>

                <div class="info-block stagger-2" style="border-left-color: #f59e0b;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                        <span style="font-size: 24px;">👤</span>
                        <h3 style="font-size: 18px; color: #1e293b; margin: 0;">Te vermijden personen</h3>
                    </div>
                    <p style="font-size: 14px; color: #64748b; margin-bottom: 16px;">Welke personen (bijv. oude vrienden of collega's) vormen voor jou op dit moment nog een te groot risico?</p>

                    ${savedPersonen.length > 0 ? `
                        <div class="es-chip-group custom-personen-group">
                            ${savedPersonen.map(persoon => `
                                <button type="button" class="es-chip pill-persoon-btn selected-red" data-persoon="${escapeHtml(persoon)}" title="Klik om te verwijderen">
                                    <span>👤</span>
                                    <span>${escapeHtml(persoon)}</span>
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}

                    <div class="custom-input-wrapper">
                        <input type="text" id="custom-persoon-input" placeholder="+ Naam van persoon..." />
                        <button type="button" class="es-btn-add" id="add-persoon-btn">Toevoegen</button>
                    </div>
                </div>

                <div class="stagger-3 button-group" style="display: flex; justify-content: space-between; margin-top: 24px;">
                    <button type="button" id="prev-intro-btn" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        &larr; Terug
                    </button>
                    <button type="button" id="next-page-btn" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        Volgende: Handelingen &rarr;
                    </button>
                </div>
            </div>
        `;

        setupPage1Listeners();
    }

    function setupPage1Listeners() {
        const toggleBtn = pageContainer.querySelector('#toggle-extra-vermijding');
        if (toggleBtn) {
            const extraBox = pageContainer.querySelector('#extra-vermijding-box');
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                isExtraVermijdingOpen = !isExtraVermijdingOpen;
                extraBox.style.display = isExtraVermijdingOpen ? 'flex' : 'none';
                toggleBtn.querySelector('.text-meer').style.display = isExtraVermijdingOpen ? 'none' : 'inline';
                toggleBtn.querySelector('.text-minder').style.display = isExtraVermijdingOpen ? 'inline' : 'none';
            });
        }

        pageContainer.querySelectorAll('.pill-btn:not(.custom-pill)').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.getAttribute('data-item');
                const idx = savedVermijding.indexOf(item);
                if (idx > -1) {
                    savedVermijding.splice(idx, 1);
                } else {
                    savedVermijding.push(item);
                }
                localStorage.setItem(keys.vermijding, JSON.stringify(savedVermijding));
                btn.classList.toggle('selected-red');
            });
        });

        pageContainer.querySelectorAll('.custom-pill').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.getAttribute('data-item');
                savedVermijding = savedVermijding.filter(i => i !== item);
                localStorage.setItem(keys.vermijding, JSON.stringify(savedVermijding));
                btn.remove();
            });
        });

        const customInput = pageContainer.querySelector('#custom-vermijding-input');
        const addBtn = pageContainer.querySelector('#add-custom-vermijding-btn');
        const handleAddSituatie = () => {
            const val = customInput.value.trim();
            if (val && !savedVermijding.includes(val)) {
                savedVermijding.push(val);
                localStorage.setItem(keys.vermijding, JSON.stringify(savedVermijding));

                const infoBlock = addBtn.closest('.info-block');
                const wrapper = infoBlock.querySelector('.custom-input-wrapper');
                let customGroup = infoBlock.querySelector('.custom-vermijding-group');
                if (!customGroup) {
                    customGroup = document.createElement('div');
                    customGroup.className = 'es-chip-group custom-vermijding-group';
                    infoBlock.insertBefore(customGroup, wrapper);
                }

                const newBtn = document.createElement('button');
                newBtn.type = 'button';
                newBtn.className = 'es-chip custom-pill selected-red';
                newBtn.setAttribute('data-item', val);
                newBtn.title = 'Klik om te verwijderen';
                newBtn.innerHTML = `<span>✏️</span><span>${escapeHtml(val)}</span>`;
                newBtn.addEventListener('click', () => {
                    savedVermijding = savedVermijding.filter(i => i !== val);
                    localStorage.setItem(keys.vermijding, JSON.stringify(savedVermijding));
                    newBtn.remove();
                });
                customGroup.appendChild(newBtn);
                customInput.value = '';
                requestAnimationFrame(fitMultilineChips);
            }
        };
        addBtn.addEventListener('click', handleAddSituatie);
        customInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleAddSituatie();
        });

        pageContainer.querySelectorAll('.pill-persoon-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const persoon = btn.getAttribute('data-persoon');
                savedPersonen = savedPersonen.filter(p => p !== persoon);
                localStorage.setItem(keys.personen, JSON.stringify(savedPersonen));
                btn.remove();
            });
        });

        const persoonInput = pageContainer.querySelector('#custom-persoon-input');
        const addPersoonBtn = pageContainer.querySelector('#add-persoon-btn');
        const handleAddPersoon = () => {
            const val = persoonInput.value.trim();
            if (val && !savedPersonen.includes(val)) {
                savedPersonen.push(val);
                localStorage.setItem(keys.personen, JSON.stringify(savedPersonen));

                const infoBlock = addPersoonBtn.closest('.info-block');
                const wrapper = infoBlock.querySelector('.custom-input-wrapper');
                let customGroup = infoBlock.querySelector('.custom-personen-group');
                if (!customGroup) {
                    customGroup = document.createElement('div');
                    customGroup.className = 'es-chip-group custom-personen-group';
                    infoBlock.insertBefore(customGroup, wrapper);
                }

                const newBtn = document.createElement('button');
                newBtn.type = 'button';
                newBtn.className = 'es-chip pill-persoon-btn selected-red';
                newBtn.setAttribute('data-persoon', val);
                newBtn.title = 'Klik om te verwijderen';
                newBtn.innerHTML = `<span>👤</span><span>${escapeHtml(val)}</span>`;
                newBtn.addEventListener('click', () => {
                    savedPersonen = savedPersonen.filter(p => p !== val);
                    localStorage.setItem(keys.personen, JSON.stringify(savedPersonen));
                    newBtn.remove();
                });
                customGroup.appendChild(newBtn);
                persoonInput.value = '';
                requestAnimationFrame(fitMultilineChips);
            }
        };
        addPersoonBtn.addEventListener('click', handleAddPersoon);
        persoonInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleAddPersoon();
        });

        pageContainer.querySelector('#prev-intro-btn').addEventListener('click', () => {
            currentPage = 1;
            render();
        });

        pageContainer.querySelector('#next-page-btn').addEventListener('click', () => {
            currentPage = 3;
            render();
        });
    }

    function renderPage2() {
        const allPredefinedHandelingen = [...standaardHandelingen, ...extraHandelingen].map(i => i.text);
        const customHandelingItems = savedHandelingen.filter(item => !allPredefinedHandelingen.includes(item));

        const allPredefinedAfleiding = [...standaardAfleiding, ...extraAfleiding].map(i => i.text);
        const customAfleidingItems = savedAfleiding.filter(item => !allPredefinedAfleiding.includes(item));

        const visibleHandelingen = [
            ...standaardHandelingen,
            ...extraHandelingen.filter(item => savedHandelingen.includes(item.text))
        ];
        const hiddenHandelingen = extraHandelingen.filter(item => !savedHandelingen.includes(item.text));

        const visibleAfleiding = [
            ...standaardAfleiding,
            ...extraAfleiding.filter(item => savedAfleiding.includes(item.text))
        ];
        const hiddenAfleiding = extraAfleiding.filter(item => !savedAfleiding.includes(item.text));

        pageContainer.innerHTML = `
            <style>
                @keyframes slideUpFade { 0% { opacity: 0; transform: translateY(15px); } 100% { opacity: 1; transform: translateY(0); } }
                .stagger-1 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.1s; }
                .stagger-2 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.2s; }
                .stagger-3 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.3s; }
                .info-block { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                
                .es-chip-group { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 16px; }
                .es-chip {
                    display: inline-flex; align-items: flex-start; gap: 8px; padding: 10px 14px; border-radius: 20px;
                    font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s;
                    border: 1px solid #cbd5e1; background: #ffffff; color: #334155; font-family: inherit;
                    text-align: left; line-height: 1.4; max-width: 100%; box-sizing: border-box;
                }
                .es-chip span:first-child { flex-shrink: 0; }
                
                .es-chip.selected-green { border: 1px solid #10b981; background: #f0fdf4; color: #047857; font-weight: 600; box-shadow: 0 2px 4px rgba(16,185,129,0.1); }
                .es-chip.selected-purple { border: 1px solid #8b5cf6; background: #f5f3ff; color: #6d28d9; font-weight: 600; box-shadow: 0 2px 4px rgba(139,92,246,0.1); }

                .custom-input-wrapper { display: flex; gap: 10px; align-items: center; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px 6px 6px 16px; }
                .custom-input-wrapper input { flex: 1; min-width: 0; border: none; background: transparent; outline: none; font-size: 14px; color: #334155; font-family: inherit; }
                .custom-input-wrapper .es-btn-add { background: #1e293b; color: white; border: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; transition: background 0.2s; flex-shrink: 0; }
                .custom-input-wrapper .es-btn-add:hover { background: #334155; }
                
                .es-btn-more { background: none; border: none; color: #2563eb; font-weight: 600; cursor: pointer; padding: 0; font-size: 14px; margin-bottom: 20px; }
            </style>
            
            <div class="eerste-stappen-container" style="max-width: 700px; margin: 0 auto; font-family: inherit;">
                <div style="margin-bottom: 24px;">
                    <span class="step-indicator" style="font-size: 14px; font-weight: 600; color: #10b981; text-transform: uppercase; letter-spacing: 0.5px;">Stap 2 van 2</span>
                    <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Handelingen in risicosituaties</h2>
                    <p style="font-size: 15px; color: #64748b; margin-top: 6px;">Wat ga je concreet doen op een moeilijk moment als je onverwacht in de verleiding komt?</p>
                </div>

                <div class="info-block stagger-1" style="border-left-color: #10b981;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                        <span style="font-size: 24px;">🛡️</span>
                        <h3 style="font-size: 18px; color: #1e293b; margin: 0;">Acties op het moment zelf</h3>
                    </div>
                    
                    <div class="es-chip-group">
                        ${visibleHandelingen.map(item => {
                            const isSelected = savedHandelingen.includes(item.text);
                            return `
                                <button type="button" class="es-chip pill-handeling-btn ${isSelected ? 'selected-green' : ''}" data-item="${escapeHtml(item.text)}">
                                    <span>${item.icon}</span>
                                    <span>${escapeHtml(item.text)}</span>
                                </button>
                            `;
                        }).join('')}
                    </div>

                    ${hiddenHandelingen.length > 0 ? `
                        <div id="extra-handelingen-box" class="es-chip-group" style="display: ${isExtraHandelingenOpen ? 'flex' : 'none'};">
                            ${hiddenHandelingen.map(item => {
                                const isSelected = savedHandelingen.includes(item.text);
                                return `
                                    <button type="button" class="es-chip pill-handeling-btn ${isSelected ? 'selected-green' : ''}" data-item="${escapeHtml(item.text)}">
                                        <span>${item.icon}</span>
                                        <span>${escapeHtml(item.text)}</span>
                                    </button>
                                `;
                            }).join('')}
                        </div>
                        <button type="button" id="toggle-extra-handelingen" class="es-btn-more">
                            <span class="text-meer" style="display: ${isExtraHandelingenOpen ? 'none' : 'inline'};">+ Meer voorbeelden...</span>
                            <span class="text-minder" style="display: ${isExtraHandelingenOpen ? 'inline' : 'none'};">- Minder voorbeelden...</span>
                        </button>
                    ` : ''}

                    ${customHandelingItems.length > 0 ? `
                        <div class="es-chip-group custom-handelingen-group">
                            ${customHandelingItems.map(item => `
                                <button type="button" class="es-chip custom-pill-handeling selected-green" data-item="${escapeHtml(item)}" title="Klik om te verwijderen">
                                    <span>✏️</span>
                                    <span>${escapeHtml(item)}</span>
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}

                    <div class="custom-input-wrapper">
                        <input type="text" id="custom-handeling-input" placeholder="+ Voeg eigen handeling toe..." />
                        <button type="button" class="es-btn-add" id="add-custom-handeling-btn">Toevoegen</button>
                    </div>
                </div>

                <div class="info-block stagger-2" style="border-left-color: #8b5cf6;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                        <span style="font-size: 24px;">🧩</span>
                        <h3 style="font-size: 18px; color: #1e293b; margin: 0;">Vormen van afleiding</h3>
                    </div>
                    <p style="font-size: 14px; color: #64748b; margin-bottom: 16px;">Welke vormen van afleiding werken het beste voor jou om de gedachten te verzetten?</p>

                    <div class="es-chip-group">
                        ${visibleAfleiding.map(item => {
                            const isSelected = savedAfleiding.includes(item.text);
                            return `
                                <button type="button" class="es-chip pill-afleiding-btn ${isSelected ? 'selected-purple' : ''}" data-item="${escapeHtml(item.text)}">
                                    <span>${item.icon}</span>
                                    <span>${escapeHtml(item.text)}</span>
                                </button>
                            `;
                        }).join('')}
                    </div>

                    ${hiddenAfleiding.length > 0 ? `
                        <div id="extra-afleiding-box" class="es-chip-group" style="display: ${isExtraAfleidingOpen ? 'flex' : 'none'};">
                            ${hiddenAfleiding.map(item => {
                                const isSelected = savedAfleiding.includes(item.text);
                                return `
                                    <button type="button" class="es-chip pill-afleiding-btn ${isSelected ? 'selected-purple' : ''}" data-item="${escapeHtml(item.text)}">
                                        <span>${item.icon}</span>
                                        <span>${escapeHtml(item.text)}</span>
                                    </button>
                                `;
                            }).join('')}
                        </div>
                        <button type="button" id="toggle-extra-afleiding" class="es-btn-more">
                            <span class="text-meer" style="display: ${isExtraAfleidingOpen ? 'none' : 'inline'};">+ Meer voorbeelden...</span>
                            <span class="text-minder" style="display: ${isExtraAfleidingOpen ? 'inline' : 'none'};">- Minder voorbeelden...</span>
                        </button>
                    ` : ''}

                    ${customAfleidingItems.length > 0 ? `
                        <div class="es-chip-group custom-afleiding-group">
                            ${customAfleidingItems.map(item => `
                                <button type="button" class="es-chip custom-pill-afleiding selected-purple" data-item="${escapeHtml(item)}" title="Klik om te verwijderen">
                                    <span>✏️</span>
                                    <span>${escapeHtml(item)}</span>
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}

                    <div class="custom-input-wrapper">
                        <input type="text" id="custom-afleiding-input" placeholder="+ Voeg eigen afleiding toe..." />
                        <button type="button" class="es-btn-add" id="add-custom-afleiding-btn">Toevoegen</button>
                    </div>
                </div>

                <div class="stagger-3 button-group" style="display: flex; justify-content: space-between; margin-top: 24px;">
                    <button type="button" id="prev-page-btn" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        &larr; Vorige
                    </button>
                    <button type="button" id="finish-module-btn" style="background-color: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        Opslaan & Afronden 🎉
                    </button>
                </div>
            </div>
        `;

        setupPage2Listeners();
    }

    function setupPage2Listeners() {
        const toggleHandelingenBtn = pageContainer.querySelector('#toggle-extra-handelingen');
        if (toggleHandelingenBtn) {
            const extraHandelingenBox = pageContainer.querySelector('#extra-handelingen-box');
            toggleHandelingenBtn.addEventListener('click', (e) => {
                e.preventDefault();
                isExtraHandelingenOpen = !isExtraHandelingenOpen;
                extraHandelingenBox.style.display = isExtraHandelingenOpen ? 'flex' : 'none';
                toggleHandelingenBtn.querySelector('.text-meer').style.display = isExtraHandelingenOpen ? 'none' : 'inline';
                toggleHandelingenBtn.querySelector('.text-minder').style.display = isExtraHandelingenOpen ? 'inline' : 'none';
            });
        }

        pageContainer.querySelectorAll('.pill-handeling-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.getAttribute('data-item');
                const idx = savedHandelingen.indexOf(item);
                if (idx > -1) {
                    savedHandelingen.splice(idx, 1);
                } else {
                    savedHandelingen.push(item);
                }
                localStorage.setItem(keys.handelingen, JSON.stringify(savedHandelingen));
                btn.classList.toggle('selected-green');
            });
        });

        pageContainer.querySelectorAll('.custom-pill-handeling').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.getAttribute('data-item');
                savedHandelingen = savedHandelingen.filter(i => i !== item);
                localStorage.setItem(keys.handelingen, JSON.stringify(savedHandelingen));
                btn.remove();
            });
        });

        const customHandelingInput = pageContainer.querySelector('#custom-handeling-input');
        const addHandelingBtn = pageContainer.querySelector('#add-custom-handeling-btn');

        const handleAddHandeling = () => {
            const val = customHandelingInput.value.trim();
            if (val && !savedHandelingen.includes(val)) {
                savedHandelingen.push(val);
                localStorage.setItem(keys.handelingen, JSON.stringify(savedHandelingen));

                const infoBlock = addHandelingBtn.closest('.info-block');
                const wrapper = infoBlock.querySelector('.custom-input-wrapper');
                let customGroup = infoBlock.querySelector('.custom-handelingen-group');
                if (!customGroup) {
                    customGroup = document.createElement('div');
                    customGroup.className = 'es-chip-group custom-handelingen-group';
                    infoBlock.insertBefore(customGroup, wrapper);
                }

                const newBtn = document.createElement('button');
                newBtn.type = 'button';
                newBtn.className = 'es-chip custom-pill-handeling selected-green';
                newBtn.setAttribute('data-item', val);
                newBtn.title = 'Klik om te verwijderen';
                newBtn.innerHTML = `<span>✏️</span><span>${escapeHtml(val)}</span>`;
                newBtn.addEventListener('click', () => {
                    savedHandelingen = savedHandelingen.filter(i => i !== val);
                    localStorage.setItem(keys.handelingen, JSON.stringify(savedHandelingen));
                    newBtn.remove();
                });
                customGroup.appendChild(newBtn);
                customHandelingInput.value = '';
                requestAnimationFrame(fitMultilineChips);
            }
        };

        addHandelingBtn.addEventListener('click', handleAddHandeling);
        customHandelingInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleAddHandeling();
        });

        const toggleAfleidingBtn = pageContainer.querySelector('#toggle-extra-afleiding');
        if (toggleAfleidingBtn) {
            const extraAfleidingBox = pageContainer.querySelector('#extra-afleiding-box');
            toggleAfleidingBtn.addEventListener('click', (e) => {
                e.preventDefault();
                isExtraAfleidingOpen = !isExtraAfleidingOpen;
                extraAfleidingBox.style.display = isExtraAfleidingOpen ? 'flex' : 'none';
                toggleAfleidingBtn.querySelector('.text-meer').style.display = isExtraAfleidingOpen ? 'none' : 'inline';
                toggleAfleidingBtn.querySelector('.text-minder').style.display = isExtraAfleidingOpen ? 'inline' : 'none';
            });
        }

        pageContainer.querySelectorAll('.pill-afleiding-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.getAttribute('data-item');
                const idx = savedAfleiding.indexOf(item);
                if (idx > -1) {
                    savedAfleiding.splice(idx, 1);
                } else {
                    savedAfleiding.push(item);
                }
                localStorage.setItem(keys.afleiding, JSON.stringify(savedAfleiding));
                btn.classList.toggle('selected-purple');
            });
        });

        pageContainer.querySelectorAll('.custom-pill-afleiding').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.getAttribute('data-item');
                savedAfleiding = savedAfleiding.filter(i => i !== item);
                localStorage.setItem(keys.afleiding, JSON.stringify(savedAfleiding));
                btn.remove();
            });
        });

        const customAfleidingInput = pageContainer.querySelector('#custom-afleiding-input');
        const addAfleidingBtn = pageContainer.querySelector('#add-custom-afleiding-btn');

        const handleAddAfleiding = () => {
            const val = customAfleidingInput.value.trim();
            if (val && !savedAfleiding.includes(val)) {
                savedAfleiding.push(val);
                localStorage.setItem(keys.afleiding, JSON.stringify(savedAfleiding));

                const infoBlock = addAfleidingBtn.closest('.info-block');
                const wrapper = infoBlock.querySelector('.custom-input-wrapper');
                let customGroup = infoBlock.querySelector('.custom-afleiding-group');
                if (!customGroup) {
                    customGroup = document.createElement('div');
                    customGroup.className = 'es-chip-group custom-afleiding-group';
                    infoBlock.insertBefore(customGroup, wrapper);
                }

                const newBtn = document.createElement('button');
                newBtn.type = 'button';
                newBtn.className = 'es-chip custom-pill-afleiding selected-purple';
                newBtn.setAttribute('data-item', val);
                newBtn.title = 'Klik om te verwijderen';
                newBtn.innerHTML = `<span>✏️</span><span>${escapeHtml(val)}</span>`;
                newBtn.addEventListener('click', () => {
                    savedAfleiding = savedAfleiding.filter(i => i !== val);
                    localStorage.setItem(keys.afleiding, JSON.stringify(savedAfleiding));
                    newBtn.remove();
                });
                customGroup.appendChild(newBtn);
                customAfleidingInput.value = '';
                requestAnimationFrame(fitMultilineChips);
            }
        };

        addAfleidingBtn.addEventListener('click', handleAddAfleiding);
        customAfleidingInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleAddAfleiding();
        });

        pageContainer.querySelector('#prev-page-btn').addEventListener('click', () => {
            currentPage = 2;
            render();
        });

        pageContainer.querySelector('#finish-module-btn').addEventListener('click', () => {
            triggerConfetti();
            currentPage = 4;
            render();
        });
    }

    function renderCompletionPage() {
        pageContainer.innerHTML = `
            <div class="eerste-stappen-container" style="max-width: 600px; margin: 40px auto; padding: 32px; font-family: inherit; text-align: center; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                <div style="font-size: 64px; margin-bottom: 16px; display: inline-block;">🎛️</div>
                <h2 style="font-size: 24px; color: #1e293b; margin-bottom: 12px;">Module Afgerond!</h2>
                <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 32px;">
                    Je hebt nu een eerste plan om mee aan de slag te gaan. Goed gedaan en veel succes!
                </p>
                <button type="button" id="back-to-dashboard-btn" style="background-color: #2563eb; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; transition: background 0.2s;">
                    Terug naar overzicht
                </button>
            </div>
        `;

        pageContainer.querySelector('#back-to-dashboard-btn').addEventListener('click', () => {
            if (onComplete) {
                onComplete({
                    vermijding: savedVermijding,
                    personen: savedPersonen,
                    handelingen: savedHandelingen,
                    afleiding: savedAfleiding
                });
            }
        });
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>'"]/g,
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    render();
}