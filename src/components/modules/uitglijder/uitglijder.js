// src/components/modules/uitglijder/uitglijder.js

function loadCSS() {
    const cssUrl = new URL('./uitglijder.css', import.meta.url).href;
    if (!document.querySelector(`link[href="${cssUrl}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssUrl;
        document.head.appendChild(link);
    }
}

// Hulpfunctie om HTML-injecties te voorkomen
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
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

const standaardGedachten = [
    { text: "Een uitglijder is een leermoment, geen falen.", icon: "🧠" },
    { text: "Dit is gebeurd en dat is niet de bedoeling, maar we gaan er weer tegenaan.", icon: "💪" },
    { text: "Mijn vooruitgang is niet plotseling verdwenen. Alle dagen of weken dat het wél lukte, tellen nog steeds.", icon: "📈" },
    { text: "Ik was goed bezig, laat ik dat weer direct oppakken.", icon: "🔄" },
    { text: "Ik ben menselijk en herstel verloopt in golfbewegingen.", icon: "🌊" },
    { text: "Deze fout definieert mij niet. Ik ben iemand die hard werkt, en vandaag kies ik weer voor mijn gezondheid.", icon: "🌱" },
    { text: "Eén uitglijder betekent absoluut niet dat alles voor niets is geweest.", icon: "📉" },
    { text: "Ik ben sterker dan dit ene moment van zwakte.", icon: "🛡️" },
    { text: "Morgen is een nieuwe dag, ik veroordeel mezelf niet, maar herpak me wel.", icon: "🌅" }
];

const standaardMaatregelen = [
    { text: "Tijdelijk niet alleen zelfstandig boodschappen doen.", icon: "🛒" },
    { text: "Risicovolle feestjes of vrienden de komende week even vermijden.", icon: "🚫" },
    { text: "Eventuele restanten in huis nu direct weggooien door de gootsteen of in de prullenbak.", icon: "🗑️" },
    { text: "Structuur met rust en beweging.", icon: "📅" },
    { text: "Niet alleen thuis zijn.", icon: "🏠" },
    { text: "Afspreken met steunende contacten.", icon: "💬" },
    { text: "Signaleringsplan doorlezen, registraties bijhouden.", icon: "🚦" },
    { text: "Mijn pinpas of geld tijdelijk aan mijn partner/huisgenoot geven.", icon: "💳" },
    { text: "Een extra rondje wandelen, sporten of de natuur in om mijn hoofd leeg te maken.", icon: "👟" }
];

export function renderUitglijderModule(containerElement, onComplete) {
    loadCSS();
    window.scrollTo(0, 0);

    const container = containerElement || document.getElementById('app-content');
    if (!container) return;

    const actiefTraject = localStorage.getItem('actieveVerslaving') || 'alcohol';
    const lsKey = `arminius_module_uitglijder_data_${actiefTraject}`;
    
    let werkwoord = 'gebruiken';
    if (actiefTraject === 'alcohol') werkwoord = 'drinken';
    if (actiefTraject === 'cannabis') werkwoord = 'blowen';
    if (actiefTraject === 'gokken') werkwoord = 'gokken';

    let savedData = { gedachten: [], maatregelen: [], hulplijnen: [""] };
    let currentStepIndex = 0; 
    let isEditing = false;
    let expandedSteps = { gedachten: false, maatregelen: false };

    // Initialiseer data
    const storedStr = localStorage.getItem(lsKey);
    if (storedStr) {
        try {
            const parsed = JSON.parse(storedStr);
            if (parsed && (parsed.gedachten?.length > 0 || parsed.maatregelen?.length > 0)) {
                savedData = parsed;
                if (!savedData.hulplijnen) savedData.hulplijnen = [];
                if (savedData.hulplijn && typeof savedData.hulplijn === 'string') {
                    if (savedData.hulplijn.trim() !== "") savedData.hulplijnen.push(savedData.hulplijn);
                    delete savedData.hulplijn;
                }
                currentStepIndex = -1; // -1 = Dashboard weergave
            }
        } catch (e) {}
    }

    container.innerHTML = `
        <div style="padding: 20px;">
            <div class="progress-bar-container" style="background: #e2e8f0; height: 6px; border-radius: 3px; margin-bottom: 24px; overflow: hidden; max-width: 700px; margin-left: auto; margin-right: auto;">
                <div class="progress-bar" id="ug-progress-bar" style="width: 25%; background: #2563eb; height: 100%; transition: width 0.4s ease-out;"></div>
            </div>
            
            <div class="module-container ug-container" style="max-width: 700px; margin: 0 auto;">
                <div style="margin-bottom: 32px;" id="ug-main-header">
                    <span style="font-size: 14px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Actieplan</span>
                    <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;" id="ug-header-title">Herstel na een uitglijder</h2>
                </div>

                <div id="ug-page-content"></div>
            </div>
        </div>
    `;

    const pageContent = container.querySelector('#ug-page-content');
    const progressBar = container.querySelector('#ug-progress-bar');
    const headerTitle = container.querySelector('#ug-header-title');
    const headerWrapper = container.querySelector('#ug-main-header');
    const progressWrapper = container.querySelector('.progress-bar-container');

    function saveHulplijnen() {
        if (currentStepIndex === 3) {
            const inputs = pageContent.querySelectorAll('.hulplijn-input');
            savedData.hulplijnen = Array.from(inputs).map(inp => inp.value);
        }
    }

    function renderSelectionStep(stepKey, title, subtitle, items, colorClass, borderClass) {
        const limit = 4;
        const isExpanded = expandedSteps[stepKey];
        const stateArr = savedData[stepKey] || [];
        
        const allPredefined = items.map(i => i.text);
        const customItems = stateArr.filter(i => !allPredefined.includes(i));
        
        const selectedPredefined = items.filter(i => stateArr.includes(i.text));
        const unselectedPredefined = items.filter(i => !stateArr.includes(i.text));
        
        const visibleList = [
            ...selectedPredefined,
            ...unselectedPredefined.slice(0, Math.max(0, limit - selectedPredefined.length))
        ];
        
        const hiddenList = unselectedPredefined.slice(Math.max(0, limit - selectedPredefined.length));

        let html = `
            <div class="stagger-1 info-block ${borderClass}">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                    <h3 style="font-size: 18px; color: #1e293b; margin: 0; font-weight: 800;">${title}</h3>
                </div>
                <p style="font-size: 14px; color: #64748b; margin-bottom: 16px; margin-top: 0;">${subtitle}</p>
                
                <div class="chip-group">
        `;

        visibleList.forEach(item => {
            const isSelected = stateArr.includes(item.text);
            html += `
                <button type="button" class="ug-chip ${isSelected ? colorClass : ''}" data-step="${stepKey}" data-val="${escapeHtml(item.text)}" style="width: 100%;">
                    <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                        <span style="font-size: 18px;">${item.icon}</span>
                        <span>${escapeHtml(item.text)}</span>
                    </div>
                    ${isSelected ? `<span style="font-weight: bold;">✓</span>` : ''}
                </button>
            `;
        });

        if (hiddenList.length > 0) {
            html += `<div style="display: ${isExpanded ? 'contents' : 'none'}; width: 100%;">`;
            hiddenList.forEach(item => {
                const isSelected = stateArr.includes(item.text);
                html += `
                    <button type="button" class="ug-chip ${isSelected ? colorClass : ''}" data-step="${stepKey}" data-val="${escapeHtml(item.text)}" style="width: 100%;">
                        <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                            <span style="font-size: 18px;">${item.icon}</span>
                            <span>${escapeHtml(item.text)}</span>
                        </div>
                        ${isSelected ? `<span style="font-weight: bold;">✓</span>` : ''}
                    </button>
                `;
            });
            html += `</div>`;
        }

        customItems.forEach(item => {
            html += `
                <button type="button" class="ug-chip ${colorClass}" data-step="${stepKey}" data-val="${escapeHtml(item)}" style="width: 100%;" title="Klik om te verwijderen">
                    <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                        <span style="font-size: 18px;">✏️</span>
                        <span>${escapeHtml(item)}</span>
                    </div>
                    <span style="font-weight: bold;">&times;</span>
                </button>
            `;
        });

        html += `</div>`;

        if (hiddenList.length > 0) {
            html += `
                <button type="button" class="toggle-hidden-btn" data-step="${stepKey}">
                    ${isExpanded ? '- Minder opties bekijken' : `+ ${hiddenList.length} andere opties bekijken...`}
                </button>
            `;
        }

        html += `
                <div class="custom-input-wrapper">
                    <input type="text" class="custom-ug-input input-custom-${stepKey}" placeholder="Voeg een eigen optie toe...">
                    <button type="button" class="btn-add-custom" data-step="${stepKey}">Toevoegen</button>
                </div>
            </div>
        `;

        return html;
    }

    function renderStep(preserveScroll = false) {
        const scrollY = window.scrollY;

        // Bepaal zichtbaarheid header en progressie
        headerWrapper.style.display = (currentStepIndex === -1 || currentStepIndex === 4) ? 'none' : 'block';
        if (progressWrapper) {
            progressWrapper.style.display = (currentStepIndex === -1 || currentStepIndex === 4) ? 'none' : 'block';
        }

        if (progressBar) {
            if (currentStepIndex === 0) progressBar.style.width = '25%';
            else if (currentStepIndex === 1) progressBar.style.width = '50%';
            else if (currentStepIndex === 2) progressBar.style.width = '75%';
            else if (currentStepIndex === 3) progressBar.style.width = '100%';
        }

        let html = '';

        if (currentStepIndex === -1) {
            // DASHBOARD OVERZICHT
            const validHulplijnen = (savedData.hulplijnen || []).filter(h => h.trim() !== "");

            html = `
                <div class="stagger-1" style="text-align: center; margin-bottom: 32px;">
                    <div style="font-size: 48px; margin-bottom: 8px;">🔄</div>
                    <h2 style="font-size: 26px; color: #1e293b; margin-top: 4px; font-weight: 800;">Mijn Herstelplan</h2>
                    <p style="font-size: 15px; color: #64748b; margin-top: 6px;">Voor als het toch even mis is gegaan.</p>
                </div>

                <div class="dashboard-block stagger-2">
                    <div class="dashboard-header"><span>🧠</span> 1. Wat ik tegen mezelf zeg</div>
                    <div style="padding: 20px; display: flex; flex-direction: column; gap: 12px;">
                        ${savedData.gedachten.map(g => `
                            <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 12px 16px; border-radius: 4px; color: #065f46; font-weight: 600; font-size: 14px;">
                                "${escapeHtml(g)}"
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="dashboard-block stagger-3">
                    <div class="dashboard-header"><span>🚧</span> 2. Wat ik nu direct doe</div>
                    <div style="padding: 20px; display: flex; flex-direction: column; gap: 12px;">
                        ${savedData.maatregelen.map(m => `
                            <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 4px; color: #92400e; font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 10px;">
                                <span>➤</span> <span>${escapeHtml(m)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                ${validHulplijnen.length > 0 ? `
                <div class="dashboard-block stagger-4">
                    <div class="dashboard-header"><span>📞</span> 3. Mijn hulptroepen</div>
                    <div style="padding: 20px; display: flex; flex-direction: column; gap: 10px;">
                        ${validHulplijnen.map(h => `
                            <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 16px; border-radius: 8px; color: #1e40af; font-weight: 700; font-size: 15px; text-align: center;">
                                ${escapeHtml(h)}
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <div class="stagger-4 button-group" style="display: flex; justify-content: space-between; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
                    <button type="button" id="btn-close-module" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        &larr; Terug
                    </button>
                    <button type="button" id="btn-wijzigen" style="background-color: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        Plan Wijzigen ✏️
                    </button>
                </div>
            `;
        }
        else if (currentStepIndex === 0) {
            // INTRODUCTIE
            headerTitle.textContent = "Herstel na een uitglijder";
            html = `
                <div class="intro-grid" style="margin-bottom: 24px;">
                    <div class="stagger-1 info-block info-block-border-blue" style="margin-bottom: 0;">
                        <h3 style="color: #0f172a; font-size: 18px; margin: 0 0 12px 0;">Wat is een uitglijder?</h3>
                        <p style="font-size: 15px; color: #334155; margin-bottom: 0; line-height: 1.6;">
                            Helaas maken mensen weleens een misstap en ${werkwoord} ze toch meer dan ze van plan waren. Dat noemen we een uitglijder: niet de bedoeling, maar ook niet het einde van de wereld.
                        </p>
                    </div>
                    <div class="stagger-2 info-block info-block-border-green" style="margin-bottom: 0;">
                        <h3 style="color: #0f172a; font-size: 18px; margin: 0 0 12px 0;">De draad oppakken</h3>
                        <p style="font-size: 15px; color: #334155; margin-bottom: 0; line-height: 1.6;">
                            Het belangrijkste is dat je jezelf daarna direct herpakt, zodat deze misstap geen volledige terugval wordt. In deze module maken we daar een preventief noodplan voor.
                        </p>
                    </div>
                </div>

                <div class="stagger-3 button-group" style="display: flex; justify-content: space-between; margin-top: 24px;">
                    ${isEditing ? `
                        <button type="button" id="btn-annuleren" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                            Annuleren
                        </button>
                    ` : '<div></div>'}
                    <button type="button" id="btn-volgende" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        Stel plan op &rarr;
                    </button>
                </div>
            `;
        }
        else if (currentStepIndex === 1) {
            // GEDACHTEN (Stap 1)
            headerTitle.textContent = "Wat vertel je jezelf?";
            html = `
                <div class="stagger-1" style="margin-bottom: 24px;">
                    <span style="font-size: 14px; font-weight: 600; color: #10b981; text-transform: uppercase; letter-spacing: 0.5px;">Stap 1 van 3</span>
                </div>
                ${renderSelectionStep(
                    "gedachten", 
                    "De Reset-knop (Cognitief)", 
                    "Welke gedachten helpen jou om direct na een uitglijder het schuldgevoel te doorbreken?", 
                    standaardGedachten, 
                    "selected-green", 
                    "info-block-border-green"
                )}
                <div class="stagger-2 button-group" style="display: flex; justify-content: space-between; margin-top: 24px;">
                    <button type="button" id="btn-vorige" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                    <button type="button" id="btn-volgende" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">Volgende &rarr;</button>
                </div>
            `;
        }
        else if (currentStepIndex === 2) {
            // MAATREGELEN (Stap 2)
            headerTitle.textContent = "Wat ga je doen?";
            html = `
                <div class="stagger-1" style="margin-bottom: 24px;">
                    <span style="font-size: 14px; font-weight: 600; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.5px;">Stap 2 van 3</span>
                </div>
                ${renderSelectionStep(
                    "maatregelen", 
                    "De Noodrem (Gedrag)", 
                    "Welke extra strakke beschermingsmaatregelen tref je voor de 48 uur na een uitglijder?", 
                    standaardMaatregelen, 
                    "selected-orange", 
                    "info-block-border-orange"
                )}
                <div class="stagger-2 button-group" style="display: flex; justify-content: space-between; margin-top: 24px;">
                    <button type="button" id="btn-vorige" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                    <button type="button" id="btn-volgende" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">Volgende &rarr;</button>
                </div>
            `;
        }
        else if (currentStepIndex === 3) {
            // HULPLIJNEN (Stap 3)
            headerTitle.textContent = "Wie ga je bellen?";
            if (!savedData.hulplijnen || savedData.hulplijnen.length === 0) savedData.hulplijnen = [""];

            html = `
                <div class="stagger-1" style="margin-bottom: 24px;">
                    <span style="font-size: 14px; font-weight: 600; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.5px;">Stap 3 van 3</span>
                </div>
                
                <div class="stagger-2 info-block info-block-border-blue">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                        <h3 style="font-size: 18px; color: #1e293b; margin: 0; font-weight: 800;">De Hulptroepen (Sociaal)</h3>
                    </div>
                    <p style="font-size: 14px; color: #64748b; margin-bottom: 20px; margin-top: 0;">Uitglijders in het geheim houden voedt schaamte en vergroot de kans op terugval. Wie kun je direct een appje sturen of bellen voor een oordeelvrije peptalk?</p>
                    
                    <div id="hulplijnen-container" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px;">
                        ${savedData.hulplijnen.map((h, index) => `
                            <div class="hulplijn-row">
                                <input type="text" class="hulplijn-input" data-index="${index}" value="${escapeHtml(h)}" placeholder="Bijv. partner, vriend, broer..." />
                                ${savedData.hulplijnen.length > 1 ? `
                                    <button type="button" class="remove-hulplijn-btn" data-index="${index}" title="Verwijder persoon">✖</button>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>

                    <button type="button" id="add-hulplijn-btn" style="background: none; border: none; color: #2563eb; font-weight: 700; cursor: pointer; text-align: left; padding: 8px 0 0 0; font-size: 14px;">
                        + Extra persoon toevoegen
                    </button>
                </div>

                <div class="stagger-3 button-group" style="display: flex; justify-content: space-between; margin-top: 24px;">
                    <button type="button" id="btn-vorige" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                    <button type="button" id="btn-opslaan" style="background-color: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">Plan Opslaan 🎉</button>
                </div>
            `;
        }
        else if (currentStepIndex === 4) {
            // SUCCES PAGINA
            html = `
                <div class="stagger-1" style="max-width: 600px; margin: 40px auto; padding: 32px; text-align: center; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                    <div style="font-size: 64px; margin-bottom: 16px; display: inline-block;">🔄</div>
                    <h2 style="font-size: 24px; color: #1e293b; margin-bottom: 12px;">Herstelplan Opgeslagen!</h2>
                    <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 32px;">
                        Heel goed. Je hebt zojuist een krachtig, compassievol vangnet voor jezelf gecreëerd. Mocht het ooit nodig zijn, dan staat dit plan altijd klaar om je te helpen herpakken.
                    </p>
                    <div class="button-group" style="justify-content: center; gap: 16px;">
                        <button type="button" id="btn-bekijk-plan" style="background-color: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; padding: 12px 28px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                            Bekijk Plan
                        </button>
                        <button type="button" id="btn-close-module" style="background-color: #2563eb; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                            Terug naar overzicht
                        </button>
                    </div>
                </div>
            `;
        }

        pageContent.innerHTML = html;

        if (preserveScroll) window.scrollTo(0, scrollY);
        else window.scrollTo(0, 0);
    }

    // --- EVENT DELEGATION VOOR DE HELE MODULE ---
    if (pageContent) {
        pageContent.addEventListener('click', (e) => {
            // --- Navigatie Knoppen ---
            if (e.target.closest('#btn-start')) {
                currentStepIndex = 1;
                renderStep();
                return;
            }
            if (e.target.closest('#btn-annuleren')) {
                currentStepIndex = -1;
                isEditing = false;
                renderStep();
                return;
            }
            if (e.target.closest('#btn-vorige')) {
                saveHulplijnen();
                currentStepIndex--;
                renderStep();
                return;
            }
            if (e.target.closest('#btn-volgende')) {
                if (currentStepIndex === 1 && savedData.gedachten.length === 0) {
                    alert("Selecteer minimaal één helpende gedachte.");
                    return;
                }
                if (currentStepIndex === 2 && savedData.maatregelen.length === 0) {
                    alert("Selecteer minimaal één actieve maatregel.");
                    return;
                }
                currentStepIndex++;
                renderStep();
                return;
            }
            if (e.target.closest('#btn-wijzigen')) {
                currentStepIndex = 0;
                isEditing = true;
                expandedSteps = { gedachten: false, maatregelen: false };
                renderStep();
                return;
            }
            if (e.target.closest('#btn-bekijk-plan')) {
                currentStepIndex = -1;
                isEditing = false;
                renderStep();
                return;
            }
            if (e.target.closest('#btn-close-module')) {
                if (onComplete) onComplete();
                return;
            }

            // --- Selectie Chips (Gedachten & Maatregelen) ---
            const chip = e.target.closest('.ug-chip');
            if (chip) {
                const stepKey = chip.getAttribute('data-step');
                const val = chip.getAttribute('data-val');
                const colorClass = stepKey === 'gedachten' ? 'selected-green' : 'selected-orange';

                if (!savedData[stepKey]) savedData[stepKey] = [];
                const idx = savedData[stepKey].indexOf(val);
                const isNowSelected = idx === -1;

                if (isNowSelected) savedData[stepKey].push(val);
                else savedData[stepKey].splice(idx, 1);

                if (chip.title === 'Klik om te verwijderen') {
                    chip.remove();
                } else {
                    chip.classList.toggle(colorClass, isNowSelected);
                    const existingCheck = chip.querySelector(':scope > span');
                    if (isNowSelected && !existingCheck) {
                        const check = document.createElement('span');
                        check.style.fontWeight = 'bold';
                        check.textContent = '✓';
                        chip.appendChild(check);
                    } else if (!isNowSelected && existingCheck) {
                        existingCheck.remove();
                    }
                }
                return;
            }

            // --- Toggle 'Meer voorbeelden' ---
            const toggleBtn = e.target.closest('.toggle-hidden-btn');
            if (toggleBtn) {
                const stepKey = toggleBtn.getAttribute('data-step');
                expandedSteps[stepKey] = !expandedSteps[stepKey];

                const chipGroup = toggleBtn.closest('.info-block').querySelector('.chip-group');
                const hiddenBox = chipGroup ? chipGroup.querySelector(':scope > div') : null;

                if (hiddenBox) {
                    if (expandedSteps[stepKey]) {
                        hiddenBox.style.display = 'contents';
                        toggleBtn.textContent = '- Minder opties bekijken';
                    } else {
                        hiddenBox.querySelectorAll('.ug-chip.selected-green, .ug-chip.selected-orange').forEach(selChip => {
                            chipGroup.insertBefore(selChip, hiddenBox);
                        });
                        hiddenBox.style.display = 'none';
                        const remaining = hiddenBox.querySelectorAll('.ug-chip').length;
                        if (remaining === 0) {
                            toggleBtn.style.display = 'none';
                        } else {
                            toggleBtn.textContent = `+ ${remaining} andere opties bekijken...`;
                        }
                    }
                }
                return;
            }

            // --- Custom input toevoegen ---
            const addBtn = e.target.closest('.btn-add-custom');
            if (addBtn) {
                const stepKey = addBtn.getAttribute('data-step');
                const inputEl = pageContent.querySelector(`.input-custom-${stepKey}`);
                if (inputEl) {
                    const val = inputEl.value.trim();
                    if (!savedData[stepKey]) savedData[stepKey] = [];
                    if (val && !savedData[stepKey].includes(val)) {
                        savedData[stepKey].push(val);
                        inputEl.value = '';

                        const chipGroup = addBtn.closest('.info-block').querySelector('.chip-group');
                        if (chipGroup) {
                            const colorClass = stepKey === 'gedachten' ? 'selected-green' : 'selected-orange';
                            const newChip = document.createElement('button');
                            newChip.type = 'button';
                            newChip.className = `ug-chip ${colorClass}`;
                            newChip.setAttribute('data-step', stepKey);
                            newChip.setAttribute('data-val', val);
                            newChip.style.width = '100%';
                            newChip.title = 'Klik om te verwijderen';
                            newChip.innerHTML = `
                                <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                                    <span style="font-size: 18px;">✏️</span>
                                    <span>${escapeHtml(val)}</span>
                                </div>
                                <span style="font-weight: bold;">&times;</span>
                            `;
                            chipGroup.appendChild(newChip);
                        }
                    }
                }
                return;
            }

            // --- Hulplijnen Beheer ---
            if (e.target.closest('#add-hulplijn-btn')) {
                saveHulplijnen();
                savedData.hulplijnen.push("");
                renderStep(true);
                return;
            }

            const removeHulpBtn = e.target.closest('.remove-hulplijn-btn');
            if (removeHulpBtn) {
                saveHulplijnen();
                const idx = parseInt(removeHulpBtn.getAttribute('data-index'));
                savedData.hulplijnen.splice(idx, 1);
                renderStep(true);
                return;
            }

            // --- OPSLAAN (Stap 3 naar Succes) ---
            if (e.target.closest('#btn-opslaan')) {
                saveHulplijnen();
                savedData.hulplijnen = savedData.hulplijnen.filter(h => h.trim() !== "");
                localStorage.setItem(lsKey, JSON.stringify(savedData));
                
                currentStepIndex = 4;
                isEditing = false;
                triggerConfetti();
                renderStep();
                return;
            }
        });

        // Enter toets voor custom fields
        pageContent.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('custom-ug-input')) {
                const addBtn = e.target.nextElementSibling;
                if (addBtn) addBtn.click();
            }
        });
    }

    // Start eerste render
    renderStep();
}