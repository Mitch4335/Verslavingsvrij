// src/components/modules/cirkels/cirkels.js

function loadCSS() {
    const cssUrl = new URL('./cirkels.css', import.meta.url).href;
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
    const colors = ['#10b981', '#3b82f6', '#64748b', '#22c55e', '#0ea5e9'];

    for (let i = 0; i < 150; i++) {
        pieces.push({
            x: canvas.width / 2, 
            y: canvas.height / 2 + 50, 
            size: Math.random() * 8 + 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: (Math.random() * -18) - 5,
            speedX: (Math.random() * 24) - 12, 
            gravity: 0.6, 
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 12 - 6
        });
    }

    let animationFrame;
    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let activePieces = 0;

        pieces.forEach(p => {
            p.speedY += p.gravity; 
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
            if (canvas.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }
            if (onFinish) onFinish();
        }
    }
    update();
}

export function renderCirkelsModule(containerElement, onComplete) {
    loadCSS();
    window.scrollTo(0, 0);

    const container = containerElement || document.getElementById('app-content');
    if (!container) return;

    const actiefTraject = localStorage.getItem('actieveVerslaving') || 'alcohol';
    const lsKey = `arminius_module_cirkels_data_${actiefTraject}`;
    
    let savedData = { binnen: [], midden: [], buiten: [] };
    let currentStepIndex = 0; 
    let isEditing = false;

    const storedStr = localStorage.getItem(lsKey);
    if (storedStr) {
        try {
            const parsed = JSON.parse(storedStr);
            if (parsed && (parsed.binnen?.length > 0 || parsed.midden?.length > 0 || parsed.buiten?.length > 0)) {
                savedData = parsed;
                currentStepIndex = -1; // -1 = Dashboard
            }
        } catch (e) {}
    }

    container.innerHTML = `
        <div style="padding: 20px;">
            <div class="progress-bar-container" style="background: #e2e8f0; height: 6px; border-radius: 3px; margin-bottom: 24px; overflow: hidden; max-width: 700px; margin-left: auto; margin-right: auto;">
                <div class="progress-bar" id="ci-progress-bar" style="width: 25%; background: #2563eb; height: 100%; transition: width 0.4s ease-out;"></div>
            </div>
            
            <div class="module-container cirkels-container" style="max-width: 700px; margin: 0 auto;">
                <div style="margin-bottom: 32px;" id="ci-main-header">
                    <span style="font-size: 14px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Omgeving & Steun</span>
                    <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;" id="ci-header-title">Cirkels van nabijheid</h2>
                </div>

                <div id="ci-page-content"></div>
            </div>
        </div>
    `;

    const pageContent = container.querySelector('#ci-page-content');
    const progressBar = container.querySelector('#ci-progress-bar');
    const headerTitle = container.querySelector('#ci-header-title');
    const headerWrapper = container.querySelector('#ci-main-header');
    const progressWrapper = container.querySelector('.progress-bar-container');

    function saveInputs(dataKey) {
        const inputs = container.querySelectorAll('.cirkel-input');
        savedData[dataKey] = Array.from(inputs).map(inp => inp.value);
    }

    function renderCircleStep(stepNum, dataKey, color, icon, title, subtitle, borderClass, placeholder, nextButtonText, colorSuffix) {
        if (!savedData[dataKey]) savedData[dataKey] = [];
        if (savedData[dataKey].length === 0) savedData[dataKey] = [""];

        let html = `
            <div class="stagger-1" style="margin-bottom: 24px;">
                <span style="font-size: 14px; font-weight: 600; color: ${color}; text-transform: uppercase; letter-spacing: 0.5px;">Stap ${stepNum} van 3</span>
            </div>

            <div class="stagger-2 info-block ${borderClass}">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                    <h3 style="font-size: 18px; color: #1e293b; margin: 0; font-weight: 800;">${icon} ${title}</h3>
                </div>
                <p style="font-size: 14px; color: #64748b; margin-bottom: 20px; margin-top: 0; line-height: 1.5;">${subtitle}</p>
                
                <label style="display: block; font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 16px;">Wie horen er in deze cirkel?</label>
                
                <div id="cirkel-inputs-container" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 12px;">
                    ${savedData[dataKey].map((person, index) => `
                        <div class="hulplijn-row">
                            <input type="text" class="cirkel-input input-${colorSuffix}" data-index="${index}" value="${escapeHtml(person)}" placeholder="${placeholder}" />
                            <button type="button" class="remove-person-btn" data-index="${index}" title="Verwijder persoon">✖</button>
                        </div>
                    `).join('')}
                </div>

                <button type="button" class="add-person-btn" data-step="${dataKey}" style="background: none; border: none; color: ${color}; font-weight: 700; cursor: pointer; text-align: left; padding: 8px 0 0 0; font-size: 15px;">
                    + Persoon toevoegen
                </button>
            </div>

            <div class="stagger-3 button-group" style="display: flex; justify-content: space-between;">
                <button type="button" id="btn-vorige" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                    &larr; Vorige
                </button>
                <button type="button" id="${stepNum === 3 ? 'btn-opslaan' : 'btn-volgende'}" style="background-color: ${stepNum === 3 ? '#10b981' : color}; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                    ${nextButtonText}
                </button>
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
            html = `
                <div class="stagger-1" style="text-align: center; margin-bottom: 32px;">
                    <div style="font-size: 48px; margin-bottom: 8px;">⭕</div>
                    <h2 style="font-size: 26px; color: #1e293b; margin-top: 4px; font-weight: 800;">Mijn Netwerk</h2>
                    <p style="font-size: 15px; color: #64748b; margin-top: 6px;">Mijn omgeving, ingedeeld op mate van openheid.</p>
                </div>

                <div class="stagger-2" style="background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px 20px; margin-bottom: 32px;">
                    <div class="cirkel-diagram">
                        <!-- Buitenste Cirkel 3 (Grijs) -->
                        <div style="position: absolute; width: 100%; height: 100%; border: 3px solid #64748b; border-radius: 50%; opacity: 0.6;"></div>
                        <div style="position: absolute; bottom: 4%; color: #475569; font-weight: bold; font-size: 14px;">3</div>
                        
                        <!-- Middelste Cirkel 2 (Blauw) -->
                        <div style="position: absolute; width: 75%; height: 75%; border: 3px solid #3b82f6; border-radius: 50%; opacity: 0.8;"></div>
                        <div style="position: absolute; bottom: 16%; color: #1d4ed8; font-weight: bold; font-size: 14px;">2</div>

                        <!-- Binnenste Cirkel 1 (Groen) -->
                        <div style="position: absolute; width: 50%; height: 50%; border: 3px solid #10b981; border-radius: 50%; background: rgba(16, 185, 129, 0.1);"></div>
                        <div style="position: absolute; bottom: 28%; color: #047857; font-weight: bold; font-size: 14px;">1</div>

                        <!-- Ik Cirkel (Wit/Klein) -->
                        <div style="position: absolute; width: 22%; height: 22%; background: #ffffff; border: 2px solid #cbd5e1; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                            <span style="color: #475569; font-weight: 800; font-size: 14px;">Ik</span>
                        </div>
                    </div>
                </div>

                <div class="dashboard-block stagger-3" style="border-color: #10b981;">
                    <div class="dashboard-header" style="background: #ecfdf5; border-color: #a7f3d0; color: #047857;">
                        <span style="font-size: 20px; margin-right: 8px;">🎯</span> 1. Binnenste Cirkel
                    </div>
                    <div style="padding: 20px;">
                        ${savedData.binnen.filter(p => p.trim() !== '').length > 0 ? `
                            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                ${savedData.binnen.filter(p => p.trim() !== '').map(p => `<span style="background: #10b981; color: white; padding: 6px 14px; border-radius: 20px; font-size: 14px; font-weight: 600;">${escapeHtml(p)}</span>`).join('')}
                            </div>
                        ` : `<span style="color: #94a3b8; font-size: 14px; font-style: italic;">Niemand ingevuld</span>`}
                    </div>
                </div>

                <div class="dashboard-block stagger-3" style="border-color: #3b82f6;">
                    <div class="dashboard-header" style="background: #eff6ff; border-color: #bfdbfe; color: #1e40af;">
                        <span style="font-size: 20px; margin-right: 8px;">👥</span> 2. Middelste Cirkel
                    </div>
                    <div style="padding: 20px;">
                        ${savedData.midden.filter(p => p.trim() !== '').length > 0 ? `
                            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                ${savedData.midden.filter(p => p.trim() !== '').map(p => `<span style="background: #3b82f6; color: white; padding: 6px 14px; border-radius: 20px; font-size: 14px; font-weight: 600;">${escapeHtml(p)}</span>`).join('')}
                            </div>
                        ` : `<span style="color: #94a3b8; font-size: 14px; font-style: italic;">Niemand ingevuld</span>`}
                    </div>
                </div>

                <div class="dashboard-block stagger-3" style="border-color: #64748b;">
                    <div class="dashboard-header" style="background: #f8fafc; border-color: #e2e8f0; color: #334155;">
                        <span style="font-size: 20px; margin-right: 8px;">👋</span> 3. Buitenste Cirkel
                    </div>
                    <div style="padding: 20px;">
                        ${savedData.buiten.filter(p => p.trim() !== '').length > 0 ? `
                            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                ${savedData.buiten.filter(p => p.trim() !== '').map(p => `<span style="background: #64748b; color: white; padding: 6px 14px; border-radius: 20px; font-size: 14px; font-weight: 600;">${escapeHtml(p)}</span>`).join('')}
                            </div>
                        ` : `<span style="color: #94a3b8; font-size: 14px; font-style: italic;">Niemand ingevuld</span>`}
                    </div>
                </div>

                <div class="stagger-4" style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 16px 20px; border-radius: 12px; margin-bottom: 12px;">
                    <p style="font-size: 14px; color: #1e40af; margin: 0; line-height: 1.5;">
                        <strong>💡 Tip:</strong> Bedenk voor jezelf of je contacten nu op de plek staan zoals je dat graag zou willen. Misschien is er iemand met wie je in de toekomst juist <em>meer</em> zou willen delen, of iemand waarmee je voor je eigen rust beter <em>minder</em> kunt bespreken.
                    </p>
                </div>

                <div class="stagger-4 button-group" style="display: flex; justify-content: space-between; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
                    <button type="button" id="btn-close-module" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        &larr; Terug
                    </button>
                    <button type="button" id="btn-wijzigen" style="background-color: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        Netwerk Wijzigen ✏️
                    </button>
                </div>
            `;
        }
        else if (currentStepIndex === 0) {
            // INTRODUCTIE
            headerTitle.textContent = "Cirkels van openheid";
            html = `
                <div class="intro-grid" style="margin-bottom: 24px;">
                    <div class="stagger-1 info-block info-block-border-blue" style="margin-bottom: 0;">
                        <h3 style="color: #0f172a; font-size: 18px; margin: 0 0 12px 0;">Verschillende lagen</h3>
                        <p style="font-size: 15px; color: #334155; margin-bottom: 0; line-height: 1.6;">
                            Het is niet altijd makkelijk om te praten over verslaving. Bij de ene persoon kun je op meer steun en begrip rekenen dan bij de andere.
                        </p>
                    </div>
                    <div class="stagger-2 info-block info-block-border-green" style="margin-bottom: 0;">
                        <h3 style="color: #0f172a; font-size: 18px; margin: 0 0 12px 0;">Jouw omgeving</h3>
                        <p style="font-size: 15px; color: #334155; margin-bottom: 0; line-height: 1.6;">
                            Het kan daarom helpend zijn om voor jezelf op een rij te zetten bij wie jij je het meest veilig voelt. We delen je netwerk daarvoor op in 3 cirkels.
                        </p>
                    </div>
                </div>

                <div class="stagger-3 button-group" style="display: flex; justify-content: space-between; margin-top: 24px;">
                    ${isEditing ? `
                        <button type="button" id="btn-annuleren" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                            Annuleren
                        </button>
                    ` : '<div></div>'}
                    <button type="button" id="btn-start" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        Start met invullen &rarr;
                    </button>
                </div>
            `;
        }
        else if (currentStepIndex === 1) {
            // BINNENSTE CIRKEL
            headerTitle.textContent = "De Binnenste Cirkel";
            html = renderCircleStep(
                1, "binnen", "#10b981", "🎯", "De Binnenste Cirkel", 
                "Mensen met wie jij alles durft te bespreken, die je zullen steunen en je niet zullen afwijzen.", 
                "info-block-border-green", "Naam toevoegen...", "Middelste Cirkel &rarr;", "groen"
            );
        }
        else if (currentStepIndex === 2) {
            // MIDDELSTE CIRKEL
            headerTitle.textContent = "De Middelste Cirkel";
            html = renderCircleStep(
                2, "midden", "#3b82f6", "👥", "De Middelste Cirkel", 
                "Mensen waarmee je oppervlakkig bespreekt wat je bezighoudt, maar ook dingen verzwijgt omdat je je daar (nog) niet comfortabel bij voelt.", 
                "info-block-border-blue", "Naam toevoegen...", "Buitenste Cirkel &rarr;", "blauw"
            );
        }
        else if (currentStepIndex === 3) {
            // BUITENSTE CIRKEL
            headerTitle.textContent = "De Buitenste Cirkel";
            html = renderCircleStep(
                3, "buiten", "#64748b", "👋", "De Buitenste Cirkel", 
                "Mensen met wie je geen persoonlijke informatie deelt, maar alleen praat over alledaagse onderwerpen (werk, het weer, verjaardagen).", 
                "info-block-border-gray", "Naam toevoegen...", "Netwerk Opslaan 🎉", "grijs"
            );
        }
        else if (currentStepIndex === 4) {
            // SUCCES PAGINA
            html = `
                <div class="stagger-1" style="max-width: 600px; margin: 40px auto; padding: 32px; text-align: center; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                    <div style="font-size: 64px; margin-bottom: 16px; display: inline-block;">⭕</div>
                    <h2 style="font-size: 24px; color: #1e293b; margin-bottom: 12px;">Netwerk Opgeslagen!</h2>
                    <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 32px;">
                        Goed gedaan. Je hebt nu inzichtelijk wie zich in jouw omgeving bevinden. In de volgende modules gaan we kijken met wie je in gesprek kunt gaan en hoe je dat het beste aanpakt.
                    </p>
                    <div class="button-group" style="justify-content: center; gap: 16px;">
                        <button type="button" id="btn-bekijk-plan" style="background-color: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; padding: 12px 28px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                            Bekijk Netwerk
                        </button>
                        <button type="button" id="btn-close-module" style="background-color: #2563eb; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                            Terug naar routekaart
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
    if (container) {
        container.addEventListener('click', (e) => {
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
                if (currentStepIndex === 1) saveInputs("binnen");
                if (currentStepIndex === 2) saveInputs("midden");
                if (currentStepIndex === 3) saveInputs("buiten");
                currentStepIndex--;
                renderStep();
                return;
            }
            if (e.target.closest('#btn-volgende')) {
                if (currentStepIndex === 1) saveInputs("binnen");
                if (currentStepIndex === 2) saveInputs("midden");
                currentStepIndex++;
                renderStep();
                return;
            }
            if (e.target.closest('#btn-wijzigen')) {
                currentStepIndex = 0;
                isEditing = true;
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

            // --- Formulier Beheer (Personen Toevoegen / Verwijderen) ---
            const addBtn = e.target.closest('.add-person-btn');
            if (addBtn) {
                const stepKey = addBtn.getAttribute('data-step');
                saveInputs(stepKey);
                savedData[stepKey].push("");
                renderStep(true);
                setTimeout(() => {
                    const inputs = container.querySelectorAll('.cirkel-input');
                    if (inputs.length > 0) inputs[inputs.length - 1].focus();
                }, 50);
                return;
            }

            const removeBtn = e.target.closest('.remove-person-btn');
            if (removeBtn) {
                let stepKey = "binnen";
                if (currentStepIndex === 2) stepKey = "midden";
                if (currentStepIndex === 3) stepKey = "buiten";
                
                saveInputs(stepKey);
                const idx = parseInt(removeBtn.getAttribute('data-index'));
                savedData[stepKey].splice(idx, 1);
                if (savedData[stepKey].length === 0) savedData[stepKey].push("");
                renderStep(true);
                return;
            }

            // --- OPSLAAN (Stap 3 naar Succes) ---
            if (e.target.closest('#btn-opslaan')) {
                saveInputs("buiten");
                
                // Schoon lege regels op
                savedData.binnen = savedData.binnen.filter(p => p.trim() !== "");
                savedData.midden = savedData.midden.filter(p => p.trim() !== "");
                savedData.buiten = savedData.buiten.filter(p => p.trim() !== "");

                localStorage.setItem(lsKey, JSON.stringify(savedData));
                
                currentStepIndex = 4;
                isEditing = false;
                triggerConfetti();
                renderStep();
                return;
            }
        });

        // Enter toets voor invoervelden
        container.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('cirkel-input')) {
                e.preventDefault();
                if (e.target.value.trim() !== '') {
                    const addBtn = container.querySelector('.add-person-btn');
                    if(addBtn) addBtn.click();
                } else {
                    e.target.blur();
                }
            }
        });
    }

    // Start eerste render
    renderStep();
}