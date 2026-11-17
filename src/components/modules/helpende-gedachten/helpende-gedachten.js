// src/components/modules/helpende-gedachten/helpende-gedachten.js

function loadCSS() {
    const cssUrl = new URL('./helpende-gedachten.css', import.meta.url).href;
    if (!document.querySelector(`link[href="${cssUrl}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssUrl;
        document.head.appendChild(link);
    }
}

// --- FUNCTIE VOOR CONFETTI ANIMATIE ---
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

export function renderHelpendeGedachtenModule(containerElement, onComplete) {
    loadCSS();
    window.scrollTo(0, 0);

    const container = containerElement || document.getElementById('app-content');
    if (!container) return;

    let isExtraRisicoOpen = false;

    const actiefTraject = localStorage.getItem('actieveVerslaving') || 'alcohol';
    const storageKey = `arminius_module_helpende_gedachten_data_${actiefTraject}`;
    const savedDataStr = localStorage.getItem(storageKey);
    
    let savedRisicogedachten = [];
    let gekoppeldeGedachten = {}; 

    if (savedDataStr) {
        try {
            const savedData = JSON.parse(savedDataStr);
            savedRisicogedachten = savedData.risicogedachten || [];
            gekoppeldeGedachten = savedData.gekoppeldeGedachten || {};
        } catch(e) {}
    }

    const standaardRisico = [
        { text: "Ik heb vandaag zo hard gewerkt, dit heb ik nu wel verdiend", icon: "🏆" },
        { text: "Morgen stop ik echt definitief, vandaag maakt niet meer uit", icon: "📅" },
        { text: "Ik ben al even gestopt, dus af en toe eentje moet nu wel kunnen", icon: "⚖️" },
        { text: "Iedereen doet gezellig mee, ik val zo buiten de boot als ik weiger", icon: "🍻" },
        { text: "De trek is nu zo sterk, ik kan me er toch niet tegen verzetten", icon: "🌊" }
    ];

    const extraRisico = [
        { text: "Ik voel me zo rot, dit is de enige manier om de pijn even niet te voelen", icon: "🌧️" },
        { text: "Het heeft toch geen zin meer, ik heb het nu toch al verpest", icon: "📉" },
        { text: "Ik ben veel vlotter en praat veel makkelijker als ik iets op heb", icon: "💬" },
        { text: "Ik kan het prima onder controle houden, ik bepaal zelf wel wat ik doe", icon: "👑" },
        { text: "Zonder dit voelt het leven gewoon veel te zwaar en lastig", icon: "🧱" },
        { text: "Niemand anders komt erachter als ik het stiekem doe", icon: "🕵️" },
        { text: "Ik heb nou eenmaal de middelen of het geld ervoor, dus waarom niet?", icon: "💰" },
        { text: "Ik presteer of focus gewoon een stuk beter met een beetje hulp", icon: "⚡" }
    ];

    const standaardHelpend = [
        "Trek is als een golf, het ebt vanzelf weer weg",
        "Als ik nu toegeef, begint de ellende weer van voor af aan",
        "Mijn lange termijn doel is veel belangrijker dan deze korte termijn drang",
        "Ik ben sterker dan deze tijdelijke gedachte",
        "Ik hoef me niet schuldig of ongezellig te voelen om 'nee' te zeggen",
        "Toegeven levert me uiteindelijk alleen maar meer stress op",
        "Elke keer dat ik nu niet toegeef, word ik sterker voor de volgende keer",
        "Het is oké om me even rot of gestrest te voelen, dat mag er zijn"
    ];

    const allPredefinedRisico = [...standaardRisico, ...extraRisico].map(i => i.text);

    function escapeHtml(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    container.innerHTML = `
        <div style="padding: 20px;">
            <div class="progress-bar-container" style="background: #e2e8f0; height: 6px; border-radius: 3px; margin-bottom: 24px; overflow: hidden; max-width: 700px; margin-left: auto; margin-right: auto;">
                <div class="progress-bar" id="helpend-progress-bar" style="width: 33%; background: #2563eb; height: 100%; transition: width 0.4s ease-out;"></div>
            </div>

            <div class="module-container helpend-container" style="max-width: 700px; margin: 0 auto;">
                
                <!-- STAP 0: INTRODUCTIE -->
                <section class="wizard-step active" id="help-step-intro" style="display: block;">
                    <div style="margin-bottom: 32px;">
                        <span style="font-size: 14px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Module Introductie</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Helpende Gedachten</h2>
                    </div>

                    <div class="stagger-1 info-block info-block-border-blue">
                        <span style="font-size: 24px; display: block; margin-bottom: 8px;">😈</span>
                        <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                            Tijdens een moeilijk moment probeert je brein je vaak met allerlei <strong>smoesjes</strong> of <strong>risicogedachten</strong> over te halen om toch toe te geven. ("Ach, eentje kan wel" of "Ik heb het nu wel verdiend").
                        </p>
                    </div>

                    <div class="stagger-2 info-block info-block-border-blue">
                        <span style="font-size: 24px; display: block; margin-bottom: 8px;">🛡️</span>
                        <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                            In deze module schrijven we jouw meest hardnekkige valkuilen op, en koppelen we daar direct een nuchter <strong>tegengif</strong> (een helpende gedachte) aan. Zo train je je brein om direct een gezond antwoord klaar te hebben.
                        </p>
                    </div>

                    <div class="stagger-3 button-group" style="display: flex; justify-content: flex-end;">
                        <button type="button" class="btn-primary next-step" data-next="help-step-1" style="background-color: #2563eb; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 15px;">Doorgaan naar module &rarr;</button>
                    </div>
                </section>

                <!-- STAP 1: RISICOGEDACHTEN SELECTEREN -->
                <section class="wizard-step" id="help-step-1" style="display: none;">
                    <div class="stagger-1" style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 14px; font-weight: 600; color: #ef4444; text-transform: uppercase; letter-spacing: 0.5px;">Stap 1 van 2</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Mijn Valkuilen & Smoesjes</h2>
                        <p style="font-size: 15px; color: #475569; margin-top: 6px;">Welke risicogedachten of smoesjes gebruikt jouw brein het vaakst om je over te halen?</p>
                    </div>

                    <div class="stagger-2 info-block info-block-border-red">
                        <h3 style="font-size: 16px; color: #dc2626; margin-top: 0; margin-bottom: 16px;">⚠️ Veelvoorkomende Risicogedachten</h3>
                        
                        <div class="helpend-chip-group" id="risico-standaard-lijst">
                            <!-- Dynamisch ingevuld via JS -->
                        </div>

                        <div class="helpend-chip-group" id="extra-risico-box" style="display: none;">
                            <!-- Dynamisch ingevuld via JS -->
                        </div>
                        
                        <button type="button" class="btn-toggle-extra" id="toggle-extra-risico">+ Meer voorbeelden...</button>

                        <div class="helpend-chip-group" id="risico-custom-lijst">
                            <!-- Dynamisch ingevuld via JS -->
                        </div>

                        <div class="custom-input-wrapper">
                            <input type="text" id="custom-risico-input" class="custom-risico-input" placeholder="+ Voeg eigen risicogedachte toe..." />
                            <button type="button" id="add-custom-risico-btn" class="btn-add-custom">Toevoegen</button>
                        </div>
                    </div>

                    <div class="stagger-3 button-group" style="display: flex; justify-content: space-between;">
                        <button type="button" class="btn-secondary prev-step" data-prev="help-step-intro" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                        <button type="button" class="btn-primary" id="btn-to-step2" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">Volgende: Het Tegengif &rarr;</button>
                    </div>
                </section>

                <!-- STAP 2: KOPPELEN AAN TEGENGIF -->
                <section class="wizard-step" id="help-step-2" style="display: none;">
                    <div class="stagger-1" style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 14px; font-weight: 600; color: #10b981; text-transform: uppercase; letter-spacing: 0.5px;">Stap 2 van 2</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Het Tegengif Koppel-schema</h2>
                        <p style="font-size: 15px; color: #475569; margin-top: 6px;">Selecteer of bedenk voor elke valkuil direct een krachtige, helpende tegenreactie.</p>
                    </div>

                    <div class="stagger-2" id="koppel-lijst">
                        <!-- Dynamisch ingevuld via JS op basis van selecties in stap 1 -->
                    </div>

                    <div class="stagger-3 button-group" style="display: flex; justify-content: space-between; margin-top: 24px;">
                        <button type="button" class="btn-secondary prev-step" data-prev="help-step-1" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                        <button type="button" class="btn-primary" id="finish-module-btn" style="background-color: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; transition: opacity 0.2s;" disabled>Opslaan & Afronden 🎉</button>
                    </div>
                </section>

                <!-- STAP 3: AFRONDING -->
                <section class="wizard-step" id="help-step-3" style="display: none;">
                    <div style="max-width: 600px; margin: 40px auto; padding: 32px; text-align: center; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                        <div class="stagger-1">
                            <div style="font-size: 64px; margin-bottom: 16px;">🛡️</div>
                            <h2 style="font-size: 24px; color: #1e293b; margin-bottom: 12px;">Module Afgerond!</h2>
                            <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 32px;">
                                Goed gedaan! Jouw koppelingen zijn opgeslagen. Als je straks in een risicosituatie belandt, of de Noodkit opent, heb je nu direct een op maat gemaakt tegengif klaarstaan voor de smoesjes van je eigen brein.
                            </p>
                        </div>
                        <div class="stagger-2">
                            <button type="button" id="btn-back-dashboard-final" style="background-color: #2563eb; color: white; border: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 15px; transition: background 0.2s;">
                                Terug naar overzicht
                            </button>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    `;

    const pageContainer = container.querySelector('.helpend-container');

    // --- RENDERING VAN LIJSTEN ---
    function renderRisicoLijsten() {
        const customRisicoItems = savedRisicogedachten.filter(item => !allPredefinedRisico.includes(item));

        // Alle GESELECTEERDE items (uit standaard én extra)
        const selectedPredefined = [
            ...standaardRisico.filter(item => savedRisicogedachten.includes(item.text)),
            ...extraRisico.filter(item => savedRisicogedachten.includes(item.text))
        ];

        // Alle NIET-geselecteerde items uit de standaard lijst
        const unselectedStandaard = standaardRisico.filter(item => !savedRisicogedachten.includes(item.text));

        // Alle NIET-geselecteerde items uit de extra lijst
        const unselectedExtra = extraRisico.filter(item => !savedRisicogedachten.includes(item.text));

        // De altijd zichtbare lijst: Geselecteerde items (uit beide lijsten) + de overgebleven standaard items
        const visibleList = [...selectedPredefined, ...unselectedStandaard];
        
        // De verborgen lijst (Minder/Meer voorbeelden): Alleen de ongeselecteerde extra items
        const extraList = unselectedExtra;

        // Render Standaard / Zichtbare Lijst
        const standaardLijstEl = pageContainer.querySelector('#risico-standaard-lijst');
        if (standaardLijstEl) {
            standaardLijstEl.innerHTML = visibleList.map(item => {
                const isSelected = savedRisicogedachten.includes(item.text);
                return `
                    <button type="button" class="helpend-pill-btn predef-pill ${isSelected ? 'selected' : ''}" data-item="${item.text}">
                        <div class="helpend-btn-icon-wrapper">
                            <span>${item.icon}</span>
                            <span>${item.text}</span>
                        </div>
                        ${isSelected ? '<span class="helpend-checkmark">✓</span>' : ''}
                    </button>
                `;
            }).join('');
        }

        // Render Extra / Verborgen Lijst
        const extraLijstEl = pageContainer.querySelector('#extra-risico-box');
        if (extraLijstEl) {
            extraLijstEl.innerHTML = extraList.map(item => {
                const isSelected = savedRisicogedachten.includes(item.text);
                return `
                    <button type="button" class="helpend-pill-btn predef-pill ${isSelected ? 'selected' : ''}" data-item="${item.text}">
                        <div class="helpend-btn-icon-wrapper">
                            <span>${item.icon}</span>
                            <span>${item.text}</span>
                        </div>
                        ${isSelected ? '<span class="helpend-checkmark">✓</span>' : ''}
                    </button>
                `;
            }).join('');
        }

        // Als er geen extra ongeselecteerde items meer over zijn, verberg de toggle knop
        const toggleBtn = pageContainer.querySelector('#toggle-extra-risico');
        if (toggleBtn) {
            toggleBtn.style.display = extraList.length === 0 ? 'none' : 'inline-block';
        }

        // Render Custom Lijst
        const customLijstEl = pageContainer.querySelector('#risico-custom-lijst');
        if (customLijstEl) {
            customLijstEl.innerHTML = customRisicoItems.map(item => `
                <button type="button" class="helpend-pill-btn custom-pill selected" data-item="${item}" title="Klik om te verwijderen">
                    <div class="helpend-btn-icon-wrapper">
                        <span>✏️</span>
                        <span>${escapeHtml(item)}</span>
                    </div>
                    <span class="helpend-checkmark">&times;</span>
                </button>
            `).join('');
        }
    }

    function renderKoppelLijst() {
        const koppelEl = pageContainer.querySelector('#koppel-lijst');
        if (!koppelEl) return;

        let koppelHtml = '';
        savedRisicogedachten.forEach(risico => {
            const currentHelpend = gekoppeldeGedachten[risico] || '';
            koppelHtml += `
                <div class="koppel-card">
                    <div class="risico-banner">
                        <span>⚠️</span>
                        <span>${escapeHtml(risico)}</span>
                    </div>

                    <div class="tegen-sectie">
                        <label class="tegen-label">Jouw helpende gedachte:</label>
                        
                        <select class="helpend-template-picker" data-risico="${escapeHtml(risico)}">
                            <option value="">💡 Kies een voorbeeld ter inspiratie...</option>
                            ${standaardHelpend.map(h => `<option value="${escapeHtml(h)}">${escapeHtml(h)}</option>`).join('')}
                        </select>

                        <div class="custom-helpend-wrapper" data-risico="${escapeHtml(risico)}">
                            <textarea class="custom-helpend-input" data-risico="${escapeHtml(risico)}" placeholder="Typ of kies hierboven jouw nuchtere, helpende gedachte...">${currentHelpend}</textarea>
                            
                            <div class="save-controls">
                                <span class="save-status" data-risico="${escapeHtml(risico)}">✓ Opgeslagen</span>
                                <button type="button" class="btn-save-custom" data-risico="${escapeHtml(risico)}">Bevestigen</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        koppelEl.innerHTML = koppelHtml;
        validateKoppelingen();
    }

    function validateKoppelingen() {
        const isValid = savedRisicogedachten.length > 0 && savedRisicogedachten.every(r => gekoppeldeGedachten[r] && gekoppeldeGedachten[r].trim() !== "");
        const finishBtn = pageContainer.querySelector('#finish-module-btn');
        if (finishBtn) {
            finishBtn.disabled = !isValid;
            finishBtn.style.opacity = isValid ? '1' : '0.5';
            finishBtn.style.cursor = isValid ? 'pointer' : 'not-allowed';
        }
    }

    // Initial render van de lijsten
    renderRisicoLijsten();

    // --- EVENT DELEGATION LOGICA ---
    if (pageContainer) {
        pageContainer.addEventListener('click', (e) => {
            // Navigatie
            const nextBtn = e.target.closest('.next-step');
            if (nextBtn) {
                showStep(nextBtn.getAttribute('data-next'));
                return;
            }
            const prevBtn = e.target.closest('.prev-step');
            if (prevBtn) {
                showStep(prevBtn.getAttribute('data-prev'));
                return;
            }

            // Stap 1: Extra voorbeelden tonen/verbergen
            const toggleExtraBtn = e.target.closest('#toggle-extra-risico');
            if (toggleExtraBtn) {
                isExtraRisicoOpen = !isExtraRisicoOpen;
                const extraBox = pageContainer.querySelector('#extra-risico-box');
                if (extraBox) {
                    extraBox.style.display = isExtraRisicoOpen ? 'flex' : 'none';
                }
                toggleExtraBtn.textContent = isExtraRisicoOpen ? '- Minder voorbeelden...' : '+ Meer voorbeelden...';
                return;
            }

            // Stap 1: Risico chip klikken (pre-defined en custom)
            const risicoChip = e.target.closest('.helpend-pill-btn');
            if (risicoChip) {
                const item = risicoChip.getAttribute('data-item');
                const idx = savedRisicogedachten.indexOf(item);
                if (idx > -1) {
                    savedRisicogedachten.splice(idx, 1);
                    delete gekoppeldeGedachten[item]; 
                } else {
                    savedRisicogedachten.push(item);
                }
                renderRisicoLijsten();
                return;
            }

            // Stap 1: Custom risico toevoegen
            const addCustomBtn = e.target.closest('#add-custom-risico-btn');
            if (addCustomBtn) {
                const inputEl = pageContainer.querySelector('#custom-risico-input');
                const val = inputEl.value.trim();
                if (val && !savedRisicogedachten.includes(val)) {
                    savedRisicogedachten.push(val);
                    inputEl.value = '';
                    renderRisicoLijsten();
                }
                return;
            }

            // Validatie & Transitie naar Stap 2
            const btnToStep2 = e.target.closest('#btn-to-step2');
            if (btnToStep2) {
                if (savedRisicogedachten.length === 0) {
                    alert("Selecteer eerst minimaal één risicogedachte om uit te dagen.");
                    return;
                }
                renderKoppelLijst();
                showStep('help-step-2');
                return;
            }

            // Stap 2: Handmatig opslaan knop
            const saveCustomBtn = e.target.closest('.btn-save-custom');
            if (saveCustomBtn) {
                const risico = saveCustomBtn.getAttribute('data-risico');
                const textarea = pageContainer.querySelector(`.custom-helpend-input[data-risico="${risico}"]`);
                const statusText = pageContainer.querySelector(`.save-status[data-risico="${risico}"]`);
                
                gekoppeldeGedachten[risico] = textarea.value.trim();
                validateKoppelingen();

                statusText.style.opacity = '1';
                setTimeout(() => {
                    statusText.style.opacity = '0';
                }, 2000);
                return;
            }

            // Afronden
            const finishBtn = e.target.closest('#finish-module-btn');
            if (finishBtn && !finishBtn.disabled) {
                // Schone koppelingen maken voor het opslaan
                const schoneKoppelingen = {};
                savedRisicogedachten.forEach(r => {
                    if (gekoppeldeGedachten[r]) {
                        schoneKoppelingen[r] = gekoppeldeGedachten[r];
                    }
                });

                const dataToSave = {
                    risicogedachten: savedRisicogedachten,
                    gekoppeldeGedachten: schoneKoppelingen
                };
                localStorage.setItem(storageKey, JSON.stringify(dataToSave));
                
                triggerConfetti();
                showStep('help-step-3');
                return;
            }

            // Terug naar Dashboard
            const dashBtn = e.target.closest('#btn-back-dashboard-final');
            if (dashBtn) {
                if (typeof onComplete === 'function') onComplete();
                return;
            }
        });

        // Event listener voor de dropdown
        pageContainer.addEventListener('change', (e) => {
            if (e.target.classList.contains('helpend-template-picker')) {
                const risico = e.target.getAttribute('data-risico');
                const val = e.target.value;
                const textarea = pageContainer.querySelector(`.custom-helpend-input[data-risico="${risico}"]`);

                if (val !== "") {
                    textarea.value = val; 
                    gekoppeldeGedachten[risico] = val;
                    validateKoppelingen();
                    e.target.value = ""; 
                }
            }
        });

        // Event listener voor tekst typen in de koppel-vakken
        pageContainer.addEventListener('input', (e) => {
            if (e.target.classList.contains('custom-helpend-input')) {
                const risico = e.target.getAttribute('data-risico');
                gekoppeldeGedachten[risico] = e.target.value.trim();
                validateKoppelingen();
            }
        });
    }

    function showStep(stepId) {
        window.scrollTo(0, 0);
        
        const steps = container.querySelectorAll('.wizard-step');
        steps.forEach(step => {
            step.style.display = 'none';
            step.classList.remove('active');
        });
        
        const targetStep = container.querySelector(`#${stepId}`);
        if (targetStep) {
            targetStep.style.display = 'block';
            targetStep.classList.add('active');
        }

        // Progress bar updaten
        const progressBarContainer = container.querySelector('.progress-bar-container');
        const progressBar = container.querySelector('#helpend-progress-bar');
        
        if (stepId === 'help-step-3') {
            if (progressBarContainer) progressBarContainer.style.display = 'none';
        } else {
            if (progressBarContainer) progressBarContainer.style.display = 'block';
            if (progressBar) {
                if (stepId === 'help-step-intro') progressBar.style.width = '33%';
                else if (stepId === 'help-step-1') progressBar.style.width = '66%';
                else if (stepId === 'help-step-2') progressBar.style.width = '100%';
            }
        }
    }
}