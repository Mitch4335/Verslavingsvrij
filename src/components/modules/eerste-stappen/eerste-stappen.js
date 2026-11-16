// src/components/modules/eerste-stappen/eerste-stappen.js

export function renderEersteStappen(container, onComplete) {
    let currentPage = 1; 
    
    let isExtraVermijdingOpen = false;
    let isExtraHandelingenOpen = false;
    let isExtraAfleidingOpen = false;
    
    let savedVermijding = JSON.parse(localStorage.getItem('arminius_vermijding_items')) || [
        "Feestjes waar alcohol gedronken wordt",
        "In je eentje boodschappen doen",
        "Café / terras / kroeg",
        "Alleen thuis zijn"
    ];

    let savedPersonen = JSON.parse(localStorage.getItem('arminius_vermijd_personen')) || [];

    let savedHandelingen = JSON.parse(localStorage.getItem('arminius_handelingen_items')) || [
        "Weggaan uit de situatie",
        "Afleiding zoeken"
    ];

    let savedAfleiding = JSON.parse(localStorage.getItem('arminius_afleiding_items')) || [
        "Wandelen",
        "Sporten"
    ];

    const standaardVermijding = [
        { text: "Feestjes waar alcohol gedronken wordt", icon: "🎉" },
        { text: "In je eentje boodschappen doen", icon: "🛒" },
        { text: "Café / terras / kroeg", icon: "🍺" },
        { text: "Alleen thuis zijn", icon: "🛋" }
    ];

    const extraVermijding = [
        { text: "Werk-/studieborrels", icon: "💼" },
        { text: "Slijter / alcoholschrap in de supermarkt", icon: "🏬" },
        { text: "Festivals / feesten", icon: "🎪" }
    ];

    const standaardHandelingen = [
        { text: "Iets anders te drinken pakken: water / frisdrank / thee", icon: "🥤" },
        { text: "Weggaan uit de situatie", icon: "🚪" },
        { text: "Afleiding zoeken", icon: "🧩" },
        { text: "Er met iemand over praten", icon: "💬" }
    ];

    const extraHandelingen = [
        { text: "Tegen mezelf zeggen dat het gevoel weggaat", icon: "🧠" },
        { text: "Een ademhalingsoefening", icon: "🫁" },
        { text: "Tot 10 tellen", icon: "🔢" }
    ];

    const standaardAfleiding = [
        { text: "Wandelen", icon: "🚶‍♂️" },
        { text: "Sporten", icon: "💪" },
        { text: "Telefoongebruik", icon: "📱" },
        { text: "Muziek", icon: "🎧" }
    ];

    const extraAfleiding = [
        { text: "Iemand bellen / spreken / opzoeken", icon: "📞" },
        { text: "Tv kijken", icon: "📺" },
        { text: "Gamen", icon: "🎮" },
        { text: "Opruimen", icon: "🧹" }
    ];

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
            // setTimeout zorgt ervoor dat de browser de transitie vloeiend animeert
            setTimeout(() => {
                progressBar.style.width = percentage + '%';
            }, 50);
        }
    }

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
            updateProgress(999); // Verbergt de balk
            renderCompletionPage();
        }

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
                    <span style="font-size: 12px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Module Introductie</span>
                    <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Eerste stappen naar verandering</h2>
                </div>

                <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">
                    <div class="stagger-1 info-block" style="border-left-color: #3b82f6;">
                        <span style="font-size: 24px; display: block; margin-bottom: 8px;">🚧</span>
                        <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                            <strong>Moeilijke situaties vermijden.</strong> In het begin is het enorm helpend om plekken te vermijden die zware trek bij je oproepen. Dit hoeft niet permanent te zijn, maar wél zolang jij je nog niet sterk genoeg voelt.
                        </p>
                    </div>
                    <div class="stagger-2 info-block" style="border-left-color: #f59e0b;">
                        <span style="font-size: 24px; display: block; margin-bottom: 8px;">🛡️</span>
                        <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                            <strong>Een actieplan.</strong> Je kunt natuurlijk niet élke situatie blijven vermijden. Daarom schrijven we ook concrete acties en vormen van afleiding op voor als je wél in de verleiding komt.
                        </p>
                    </div>
                    <div class="stagger-3 info-block" style="border-left-color: #10b981;">
                        <span style="font-size: 24px; display: block; margin-bottom: 8px;">💪</span>
                        <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                            <strong>Direct toepasbaar.</strong> Met dit concrete plan op zak sta je veel sterker in je schoenen tijdens deze cruciale eerste fase van je verandering.
                        </p>
                    </div>
                </div>

                <div class="stagger-4" style="display: flex; justify-content: flex-end;">
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
                    display: inline-flex; align-items: center; gap: 6px; padding: 10px 16px; border-radius: 9999px;
                    font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s;
                    border: 1px solid #cbd5e1; background: #ffffff; color: #334155; font-family: inherit;
                }
                .es-chip:hover { background: #f8fafc; transform: translateY(-1px); box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
                
                .es-chip.selected-red { border: 1px solid #ef4444; background: #fef2f2; color: #b91c1c; font-weight: 600; box-shadow: 0 2px 4px rgba(239,68,68,0.1); }

                .custom-input-wrapper { display: flex; gap: 10px; align-items: center; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px 6px 6px 16px; }
                .custom-input-wrapper input { flex: 1; border: none; background: transparent; outline: none; font-size: 14px; color: #334155; font-family: inherit; }
                .custom-input-wrapper .es-btn-add { background: #1e293b; color: white; border: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; transition: background 0.2s; }
                .custom-input-wrapper .es-btn-add:hover { background: #334155; }
                
                .es-btn-more { background: none; border: none; color: #2563eb; font-weight: 600; cursor: pointer; padding: 0; font-size: 14px; margin-bottom: 20px; }
            </style>
            
            <div class="eerste-stappen-container" style="max-width: 700px; margin: 0 auto; font-family: inherit;">
                <div style="margin-bottom: 24px;">
                    <span class="step-indicator" style="font-size: 12px; font-weight: 600; color: #ef4444; text-transform: uppercase; letter-spacing: 0.5px;">Stap 1 van 2</span>
                    <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Te vermijden risico's</h2>
                    <p style="font-size: 14px; color: #64748b; margin-top: 6px;">Selecteer welke situaties of personen je de komende periode beter even kunt mijden.</p>
                </div>

                <div class="info-block stagger-1" style="border-left-color: #ef4444;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                        <span style="font-size: 24px;">🛑</span>
                        <h3 style="font-size: 18px; color: #1e293b; margin: 0;">Plaatsen & Situaties</h3>
                    </div>
                    
                    <div class="es-chip-group">
                        ${visibleVermijding.map(item => {
                            const isSelected = savedVermijding.includes(item.text);
                            return `
                                <button type="button" class="es-chip pill-btn ${isSelected ? 'selected-red' : ''}" data-item="${item.text}">
                                    <span>${item.icon}</span>
                                    <span>${item.text}</span>
                                </button>
                            `;
                        }).join('')}
                    </div>

                    ${hiddenVermijding.length > 0 ? `
                        <div id="extra-vermijding-box" class="es-chip-group" style="display: ${isExtraVermijdingOpen ? 'flex' : 'none'};">
                            ${hiddenVermijding.map(item => {
                                const isSelected = savedVermijding.includes(item.text);
                                return `
                                    <button type="button" class="es-chip pill-btn ${isSelected ? 'selected-red' : ''}" data-item="${item.text}">
                                        <span>${item.icon}</span>
                                        <span>${item.text}</span>
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
                        <div class="es-chip-group">
                            ${customVermijdingItems.map(item => `
                                <button type="button" class="es-chip custom-pill selected-red" data-item="${item}" title="Klik om te verwijderen">
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
                        <div class="es-chip-group">
                            ${savedPersonen.map(persoon => `
                                <button type="button" class="es-chip pill-persoon-btn selected-red" data-persoon="${persoon}" title="Klik om te verwijderen">
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

                <div class="stagger-3" style="display: flex; justify-content: space-between; margin-top: 24px;">
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
                localStorage.setItem('arminius_vermijding_items', JSON.stringify(savedVermijding));
                render(true);
            });
        });

        pageContainer.querySelectorAll('.custom-pill').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.getAttribute('data-item');
                savedVermijding = savedVermijding.filter(i => i !== item);
                localStorage.setItem('arminius_vermijding_items', JSON.stringify(savedVermijding));
                render(true);
            });
        });

        const customInput = pageContainer.querySelector('#custom-vermijding-input');
        const addBtn = pageContainer.querySelector('#add-custom-vermijding-btn');
        const handleAddSituatie = () => {
            const val = customInput.value.trim();
            if (val && !savedVermijding.includes(val)) {
                savedVermijding.push(val);
                localStorage.setItem('arminius_vermijding_items', JSON.stringify(savedVermijding));
                render(true);
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
                localStorage.setItem('arminius_vermijd_personen', JSON.stringify(savedPersonen));
                render(true);
            });
        });

        const persoonInput = pageContainer.querySelector('#custom-persoon-input');
        const addPersoonBtn = pageContainer.querySelector('#add-persoon-btn');
        const handleAddPersoon = () => {
            const val = persoonInput.value.trim();
            if (val && !savedPersonen.includes(val)) {
                savedPersonen.push(val);
                localStorage.setItem('arminius_vermijd_personen', JSON.stringify(savedPersonen));
                render(true);
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
                    display: inline-flex; align-items: center; gap: 6px; padding: 10px 16px; border-radius: 9999px;
                    font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s;
                    border: 1px solid #cbd5e1; background: #ffffff; color: #334155; font-family: inherit;
                }
                .es-chip:hover { background: #f8fafc; transform: translateY(-1px); box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
                
                .es-chip.selected-green { border: 1px solid #10b981; background: #f0fdf4; color: #047857; font-weight: 600; box-shadow: 0 2px 4px rgba(16,185,129,0.1); }
                .es-chip.selected-purple { border: 1px solid #8b5cf6; background: #f5f3ff; color: #6d28d9; font-weight: 600; box-shadow: 0 2px 4px rgba(139,92,246,0.1); }

                .custom-input-wrapper { display: flex; gap: 10px; align-items: center; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px 6px 6px 16px; }
                .custom-input-wrapper input { flex: 1; border: none; background: transparent; outline: none; font-size: 14px; color: #334155; font-family: inherit; }
                .custom-input-wrapper .es-btn-add { background: #1e293b; color: white; border: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; transition: background 0.2s; }
                .custom-input-wrapper .es-btn-add:hover { background: #334155; }
                
                .es-btn-more { background: none; border: none; color: #2563eb; font-weight: 600; cursor: pointer; padding: 0; font-size: 14px; margin-bottom: 20px; }
            </style>
            
            <div class="eerste-stappen-container" style="max-width: 700px; margin: 0 auto; font-family: inherit;">
                <div style="margin-bottom: 24px;">
                    <span class="step-indicator" style="font-size: 12px; font-weight: 600; color: #10b981; text-transform: uppercase; letter-spacing: 0.5px;">Stap 2 van 2</span>
                    <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Handelingen in risicosituaties</h2>
                    <p style="font-size: 14px; color: #64748b; margin-top: 6px;">Wat ga je concreet doen op een moeilijk moment als je onverwacht in de verleiding komt?</p>
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
                                <button type="button" class="es-chip pill-handeling-btn ${isSelected ? 'selected-green' : ''}" data-item="${item.text}">
                                    <span>${item.icon}</span>
                                    <span>${item.text}</span>
                                </button>
                            `;
                        }).join('')}
                    </div>

                    ${hiddenHandelingen.length > 0 ? `
                        <div id="extra-handelingen-box" class="es-chip-group" style="display: ${isExtraHandelingenOpen ? 'flex' : 'none'};">
                            ${hiddenHandelingen.map(item => {
                                const isSelected = savedHandelingen.includes(item.text);
                                return `
                                    <button type="button" class="es-chip pill-handeling-btn ${isSelected ? 'selected-green' : ''}" data-item="${item.text}">
                                        <span>${item.icon}</span>
                                        <span>${item.text}</span>
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
                        <div class="es-chip-group">
                            ${customHandelingItems.map(item => `
                                <button type="button" class="es-chip custom-pill-handeling selected-green" data-item="${item}" title="Klik om te verwijderen">
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
                                <button type="button" class="es-chip pill-afleiding-btn ${isSelected ? 'selected-purple' : ''}" data-item="${item.text}">
                                    <span>${item.icon}</span>
                                    <span>${item.text}</span>
                                </button>
                            `;
                        }).join('')}
                    </div>

                    ${hiddenAfleiding.length > 0 ? `
                        <div id="extra-afleiding-box" class="es-chip-group" style="display: ${isExtraAfleidingOpen ? 'flex' : 'none'};">
                            ${hiddenAfleiding.map(item => {
                                const isSelected = savedAfleiding.includes(item.text);
                                return `
                                    <button type="button" class="es-chip pill-afleiding-btn ${isSelected ? 'selected-purple' : ''}" data-item="${item.text}">
                                        <span>${item.icon}</span>
                                        <span>${item.text}</span>
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
                        <div class="es-chip-group">
                            ${customAfleidingItems.map(item => `
                                <button type="button" class="es-chip custom-pill-afleiding selected-purple" data-item="${item}" title="Klik om te verwijderen">
                                    <span>✏</span>
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

                <div class="stagger-3" style="display: flex; justify-content: space-between; margin-top: 24px;">
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
                localStorage.setItem('arminius_handelingen_items', JSON.stringify(savedHandelingen));
                render(true);
            });
        });

        pageContainer.querySelectorAll('.custom-pill-handeling').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.getAttribute('data-item');
                savedHandelingen = savedHandelingen.filter(i => i !== item);
                localStorage.setItem('arminius_handelingen_items', JSON.stringify(savedHandelingen));
                render(true);
            });
        });

        const customHandelingInput = pageContainer.querySelector('#custom-handeling-input');
        const addHandelingBtn = pageContainer.querySelector('#add-custom-handeling-btn');

        const handleAddHandeling = () => {
            const val = customHandelingInput.value.trim();
            if (val && !savedHandelingen.includes(val)) {
                savedHandelingen.push(val);
                localStorage.setItem('arminius_handelingen_items', JSON.stringify(savedHandelingen));
                render(true);
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
                localStorage.setItem('arminius_afleiding_items', JSON.stringify(savedAfleiding));
                render(true);
            });
        });

        pageContainer.querySelectorAll('.custom-pill-afleiding').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.getAttribute('data-item');
                savedAfleiding = savedAfleiding.filter(i => i !== item);
                localStorage.setItem('arminius_afleiding_items', JSON.stringify(savedAfleiding));
                render(true);
            });
        });

        const customAfleidingInput = pageContainer.querySelector('#custom-afleiding-input');
        const addAfleidingBtn = pageContainer.querySelector('#add-custom-afleiding-btn');

        const handleAddAfleiding = () => {
            const val = customAfleidingInput.value.trim();
            if (val && !savedAfleiding.includes(val)) {
                savedAfleiding.push(val);
                localStorage.setItem('arminius_afleiding_items', JSON.stringify(savedAfleiding));
                render(true);
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
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    render();
}