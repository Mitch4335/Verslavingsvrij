// src/components/modules/bespreekbaar/bespreekbaar.js

function loadCSS() {
    const cssUrl = new URL('./bespreekbaar.css', import.meta.url).href;
    if (!document.querySelector(`link[href="${cssUrl}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssUrl;
        document.head.appendChild(link);
    }
}

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

export function renderBespreekbaarModule(containerElement, onComplete) {
    loadCSS();
    window.scrollTo(0, 0);

    const container = containerElement || document.getElementById('app-content');
    if (!container) return;

    const actiefTraject = localStorage.getItem('actieveVerslaving') || 'alcohol';
    const lsKey = `arminius_module_bespreekbaar_data_${actiefTraject}`;
    const cirkelsKey = `arminius_module_cirkels_data_${actiefTraject}`;
    
    let plannen = [];
    let huidigPlan = {
        persoon: '',
        doel: '', 
        moment: '',
        locatie: '',
        openingszin: '',
        voltooid: false
    };
    
    let currentStepIndex = 0; 
    let chatTimeouts = [];
    let laatstVoltooideDoel = ''; 

    // Initialiseer data
    const storedStr = localStorage.getItem(lsKey);
    if (storedStr) {
        try {
            const parsed = JSON.parse(storedStr);
            if (Array.isArray(parsed)) {
                plannen = parsed;
            } else if (parsed && parsed.gekozenPersoon) {
                plannen = [{
                    persoon: parsed.gekozenPersoon,
                    doel: parsed.gekozenDoel,
                    moment: parsed.moment,
                    locatie: parsed.locatie,
                    openingszin: parsed.openingszin,
                    voltooid: false
                }];
            }
        } catch (e) {}
    }

    // Netwerknamen ophalen uit de Cirkels module
    let netwerkNamen = [];
    try {
        const cirkelDataStr = localStorage.getItem(cirkelsKey);
        if (cirkelDataStr) {
            const parsed = JSON.parse(cirkelDataStr);
            const extract = (val) => {
                if (Array.isArray(val)) return val.map(v => typeof v === 'string' ? v : (v.naam || '')).filter(Boolean);
                if (typeof val === 'string') return val.split(/[\n,]+/).map(v => v.trim()).filter(Boolean);
                return [];
            };
            const b = extract(parsed.binnen || parsed.cirkel1 || parsed.binnensteCirkel);
            const m = extract(parsed.midden || parsed.cirkel2 || parsed.middelsteCirkel);
            netwerkNamen = [...b, ...m];
            
            if (netwerkNamen.length === 0) {
                Object.values(parsed).forEach(val => { netwerkNamen.push(...extract(val)); });
            }
        }
    } catch (e) {}
    netwerkNamen = [...new Set(netwerkNamen)].filter(n => n.length > 0);

    const tekstMap = {
        'alcohol': { actie: 'te stoppen met het drinken van alcohol', middel: 'alcohol', werkwoord: 'drinken' },
        'cannabis': { actie: 'te stoppen met blowen', middel: 'wiet of hasj', werkwoord: 'blowen' },
        'cocaine': { actie: 'te stoppen met het gebruiken van cocaïne', middel: 'cocaïne', werkwoord: 'gebruiken' },
        'gokken': { actie: 'te stoppen met gokken', middel: 'gokken', werkwoord: 'gokken' }
    };
    const tData = tekstMap[actiefTraject] || tekstMap['alcohol'];

    function savePlannen() {
        localStorage.setItem(lsKey, JSON.stringify(plannen));
    }

    container.innerHTML = `
        <div style="padding: 20px;">
            <div class="progress-bar-container" style="background: #e2e8f0; height: 6px; border-radius: 3px; margin-bottom: 24px; overflow: hidden; max-width: 700px; margin-left: auto; margin-right: auto;">
                <div class="progress-bar" id="be-progress-bar" style="width: 25%; background: #2563eb; height: 100%; transition: width 0.4s ease-out;"></div>
            </div>
            
            <div class="module-container bespreekbaar-container" style="max-width: 700px; margin: 0 auto;">
                <div style="margin-bottom: 32px;" id="be-main-header">
                    <span style="font-size: 14px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Omgeving & Steun</span>
                    <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;" id="be-header-title">Bespreekbaar maken</h2>
                </div>

                <div id="be-page-content"></div>
            </div>
        </div>
    `;

    const pageContent = container.querySelector('#be-page-content');
    const progressBar = container.querySelector('#be-progress-bar');
    const headerTitle = container.querySelector('#be-header-title');
    const headerWrapper = container.querySelector('#be-main-header');
    const progressWrapper = container.querySelector('.progress-bar-container');

    function renderStep(preserveScroll = false) {
        chatTimeouts.forEach(clearTimeout);
        chatTimeouts = [];
        const scrollY = window.scrollY;

        // Bepaal zichtbaarheid header en progressie
        const isAppPage = (currentStepIndex === 0 || currentStepIndex === 5 || currentStepIndex === 6 || currentStepIndex === 7);
        headerWrapper.style.display = isAppPage ? 'none' : 'block';
        if (progressWrapper) progressWrapper.style.display = isAppPage ? 'none' : 'block';

        if (progressBar) {
            if (currentStepIndex === 1) progressBar.style.width = '25%';
            else if (currentStepIndex === 2) progressBar.style.width = '50%';
            else if (currentStepIndex === 3) progressBar.style.width = '75%';
            else if (currentStepIndex === 4) progressBar.style.width = '100%';
        }

        let html = '';

        if (currentStepIndex === 0) {
            // DASHBOARD / OVERZICHT
            let openPlannenHtml = '';
            let voltooidePlannenHtml = '';
            
            if (plannen.length > 0) {
                plannen.forEach((plan, index) => {
                    let doelText = "Je wilt het gesprek aangaan.";
                    if (plan.doel === 'opluchting') doelText = "Je doel is om je emotionele last te delen en eerlijk te zijn.";
                    if (plan.doel === 'steun') doelText = "Je doel is om steun te vragen voor lastige momenten.";
                    if (plan.doel === 'grenzen') doelText = "Je doel is om grenzen te stellen rondom jullie contact.";
                    
                    const isVoltooid = plan.voltooid === true;
                    
                    const cardHtml = `
                    <div style="background: ${isVoltooid ? '#ecfdf5' : '#f8fafc'}; border: 1px solid ${isVoltooid ? '#a7f3d0' : '#cbd5e1'}; border-radius: 12px; padding: 20px; position: relative; margin-bottom: 16px;">
                        <button type="button" class="delete-plan-btn" data-index="${index}" style="position: absolute; top: 16px; right: 16px; background: none; border: none; color: #ef4444; font-size: 18px; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'" title="Verwijder dit plan">🗑️</button>
                        
                        ${isVoltooid ? `<div style="display: inline-block; background: #10b981; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 700; margin-bottom: 12px; letter-spacing: 0.5px;">✅ GESPREK GEVOERD</div>` : ''}
                        
                        <p style="margin: 0 0 8px 0; font-size: 15px; color: #334155;"><strong>👥 Met wie:</strong> ${escapeHtml(plan.persoon)}</p>
                        <p style="margin: 0 0 8px 0; font-size: 15px; color: #334155;"><strong>🎯 Waarom:</strong> ${doelText}</p>
                        ${plan.moment ? `<p style="margin: 0 0 8px 0; font-size: 15px; color: #334155;"><strong>🕒 Wanneer:</strong> ${escapeHtml(plan.moment)}</p>` : ''}
                        ${plan.locatie ? `<p style="margin: 0 0 8px 0; font-size: 15px; color: #334155;"><strong>📍 Waar:</strong> ${escapeHtml(plan.locatie)}</p>` : ''}
                        
                        <div style="margin-top: 16px; background: #ffffff; padding: 12px; border-radius: 8px; border-left: 3px solid ${isVoltooid ? '#10b981' : '#3b82f6'};">
                            <span style="font-size: 14px; color: #64748b; font-weight: 700; text-transform: uppercase;">Openingszin:</span><br>
                            <span style="font-size: 15px; color: #1e293b; font-style: italic;">"${escapeHtml(plan.openingszin)}"</span>
                        </div>
                        
                        ${!isVoltooid ? `
                        <div style="margin-top: 16px; text-align: center;">
                            <button type="button" class="voltooi-plan-btn" data-index="${index}" style="background-color: #10b981; color: white; border: none; padding: 12px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 14px; width: 100%; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#059669'" onmouseout="this.style.backgroundColor='#10b981'">
                                ✅ Ik heb dit gesprek gevoerd
                            </button>
                        </div>
                        ` : ''}
                    </div>
                    `;

                    if (isVoltooid) voltooidePlannenHtml += cardHtml;
                    else openPlannenHtml += cardHtml;
                });
            }

            html = `
                <div class="stagger-1" style="text-align: center; margin-bottom: 32px;">
                    <div style="font-size: 48px; margin-bottom: 8px;">🗣️</div>
                    <h2 style="font-size: 26px; color: #1e293b; margin-top: 4px; font-weight: 800;">Bespreekbaar maken</h2>
                </div>

                ${plannen.length === 0 ? `
                <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">
                    <div class="stagger-2 info-block info-block-border-blue" style="margin-bottom: 0;">
                        <h3 style="color: #0f172a; font-size: 18px; margin: 0 0 12px 0;">Geen geheim meer</h3>
                        <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0;">
                            Verslaving gedijt bij geheimhouding. Openheid geven aan de mensen om je heen is vaak de sleutel tot het doorbreken van patronen.
                        </p>
                    </div>

                    <div class="stagger-3 info-block info-block-border-orange" style="margin-bottom: 0;">
                        <h3 style="color: #0f172a; font-size: 18px; margin: 0 0 12px 0;">Gesprekken voorbereiden</h3>
                        <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0;">
                            We weten het: dit is ontzettend spannend. Wat zullen ze denken? In deze module nemen we die druk weg door concrete gespreksplannen te maken.
                        </p>
                    </div>
                </div>
                ` : ''}

                ${openPlannenHtml ? `
                <div class="stagger-3" style="margin-bottom: 32px;">
                    <h3 style="font-size: 18px; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px;">Jouw geplande gesprekken</h3>
                    ${openPlannenHtml}
                </div>
                ` : ''}

                ${voltooidePlannenHtml ? `
                <div class="stagger-4" style="margin-bottom: 32px;">
                    <h3 style="font-size: 18px; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px;">Afgeronde gesprekken</h3>
                    ${voltooidePlannenHtml}
                </div>
                ` : ''}

                <div class="stagger-4 button-group" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 24px;">
                    <button type="button" id="back-route-btn" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        &larr; Routekaart
                    </button>
                    <button type="button" id="nieuw-plan-btn" style="background-color: #2563eb; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 15px;">
                        ${plannen.length > 0 ? '+ Nieuw gesprek voorbereiden' : 'Start module &rarr;'}
                    </button>
                </div>
                
                ${plannen.length === 0 ? `
                <div class="stagger-4" style="text-align: center; margin-top: 24px;">
                    <button type="button" id="alternatief-btn-start" style="background: none; border: none; color: #64748b; text-decoration: underline; cursor: pointer; font-size: 14px;">
                        Ik voel me hier nog niet klaar voor / Ik heb nu niemand.
                    </button>
                </div>
                ` : ''}
            `;
        }
        else if (currentStepIndex === 1) {
            // STAP 1: WIE
            headerTitle.textContent = "Met wie wil je praten?";
            
            let suggestieHtml = '';
            if (netwerkNamen.length > 0) {
                suggestieHtml = `
                    <p style="font-size: 14px; color: #475569; margin-bottom: 8px; font-weight: 600;">Eerder ingevuld in je Cirkels:</p>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
                        ${netwerkNamen.map(naam => `
                            <button type="button" class="naam-chip ${huidigPlan.persoon === naam ? 'selected' : ''}" data-naam="${escapeHtml(naam)}">
                                ${escapeHtml(naam)}
                            </button>
                        `).join('')}
                    </div>
                `;
            }

            html = `
                <div class="stagger-1" style="margin-bottom: 24px;">
                    <span style="font-size: 14px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Stap 1 van 4</span>
                </div>

                <div class="stagger-2 info-block info-block-border-blue" style="margin-bottom: 32px;">
                    ${suggestieHtml}
                    
                    <label style="display: block; font-size: 14px; font-weight: 600; color: #475569; margin-bottom: 8px;">Of typ zelf een naam in:</label>
                    <input type="text" id="persoon-input" class="form-input" value="${escapeHtml(huidigPlan.persoon)}" placeholder="Bijv. mijn partner, Thomas, ...">
                </div>

                <div class="stagger-3 button-group" style="display: flex; justify-content: space-between;">
                    <button type="button" id="btn-vorige" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        &larr; Vorige
                    </button>
                    <button type="button" id="btn-volgende" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        Volgende &rarr;
                    </button>
                </div>
            `;
        }
        else if (currentStepIndex === 2) {
            // STAP 2: DOEL
            headerTitle.textContent = "Wat is het doel van dit gesprek?";
            html = `
                <div class="stagger-1" style="margin-bottom: 24px;">
                    <span style="font-size: 14px; font-weight: 600; color: #10b981; text-transform: uppercase; letter-spacing: 0.5px;">Stap 2 van 4</span>
                    <p style="font-size: 15px; color: #475569; margin-top: 6px;">Waarom wil je praten met ${escapeHtml(huidigPlan.persoon)}? Kies de belangrijkste reden.</p>
                </div>

                <div class="stagger-2" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px;">
                    <div class="keuze-card ${huidigPlan.doel === 'opluchting' ? 'active' : ''}" data-doel="opluchting">
                        <span style="font-size: 28px;">🌬️</span>
                        <div>
                            <h3 style="margin: 0 0 4px 0; font-size: 16px; color: #1e293b;">Opluchting en openheid</h3>
                            <p style="margin: 0; font-size: 15px; color: #64748b;">Ik wil mijn geheime emotionele last delen en eerlijk zijn over mijn gebruik.</p>
                        </div>
                    </div>

                    <div class="keuze-card ${huidigPlan.doel === 'steun' ? 'active' : ''}" data-doel="steun">
                        <span style="font-size: 28px;">🤝</span>
                        <div>
                            <h3 style="margin: 0 0 4px 0; font-size: 16px; color: #1e293b;">Steun vragen</h3>
                            <p style="margin: 0; font-size: 15px; color: #64748b;">Ik wil de ander kunnen inschakelen als hulplijn voor lastige momenten.</p>
                        </div>
                    </div>

                    <div class="keuze-card ${huidigPlan.doel === 'grenzen' ? 'active' : ''}" data-doel="grenzen">
                        <span style="font-size: 28px;">🛑</span>
                        <div>
                            <h3 style="margin: 0 0 4px 0; font-size: 16px; color: #1e293b;">Grenzen stellen</h3>
                            <p style="margin: 0; font-size: 15px; color: #64748b;">Ik wil het contact pauzeren of verbreken.</p>
                        </div>
                    </div>
                </div>

                <div class="stagger-3 button-group" style="display: flex; justify-content: space-between;">
                    <button type="button" id="btn-vorige" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        &larr; Vorige
                    </button>
                    <button type="button" id="btn-volgende" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        Volgende &rarr;
                    </button>
                </div>
            `;
        }
        else if (currentStepIndex === 3) {
            // STAP 3: WAAR EN WANNEER
            headerTitle.textContent = "De Randvoorwaarden";
            html = `
                <div class="stagger-1" style="margin-bottom: 24px;">
                    <span style="font-size: 14px; font-weight: 600; color: #ec4899; text-transform: uppercase; letter-spacing: 0.5px;">Stap 3 van 4</span>
                    <p style="font-size: 15px; color: #475569; margin-top: 6px;">Een goede voorbereiding bepaalt vaak de sfeer van het gesprek.</p>
                </div>

                <div class="stagger-2 info-block info-block-border-blue" style="margin-bottom: 16px;">
                    <p style="font-size: 14px; color: #3b82f6; font-weight: 700; margin: 0 0 8px 0;">🕒 Kies het juiste moment</p>
                    <p style="font-size: 15px; color: #64748b; margin: 0 0 12px 0;">Kies een moment wanneer er de tijd is om met elkaar te praten en jullie allebei ontspannen zijn.</p>
                    <label style="display: block; font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 6px;">Wanneer wil je dit gesprek voeren?</label>
                    <input type="text" id="moment-input" class="form-input" value="${escapeHtml(huidigPlan.moment)}" placeholder="Bijv. zondagmiddag na de lunch">
                </div>

                <div class="stagger-3 info-block info-block-border-green" style="margin-bottom: 32px;">
                    <p style="font-size: 14px; color: #10b981; font-weight: 700; margin: 0 0 8px 0;">📍 Kies een goede plek</p>
                    <p style="font-size: 15px; color: #64748b; margin: 0 0 12px 0;">Strak tegenover elkaar zitten kan als een confrontatie voelen. Samen een wandeling maken of in de auto zitten praat vaak veel makkelijker.</p>
                    <label style="display: block; font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 6px;">Waar wil je afspreken?</label>
                    <input type="text" id="locatie-input" class="form-input" value="${escapeHtml(huidigPlan.locatie)}" placeholder="Bijv. tijdens een wandeling in het bos">
                </div>

                <div class="stagger-4 button-group" style="display: flex; justify-content: space-between;">
                    <button type="button" id="btn-vorige" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        &larr; Vorige
                    </button>
                    <button type="button" id="btn-volgende" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        Volgende &rarr;
                    </button>
                </div>
            `;
        }
        else if (currentStepIndex === 4) {
            // STAP 4: WAT ZEG JE (Chat simulatie + Openingszin)
            headerTitle.textContent = "Wat ga je zeggen?";
            let firstMessage = `Hé ${escapeHtml(huidigPlan.persoon) || 'daar'}, ik heb besloten ${tData.actie}. Ik wilde er eerlijk over zijn tegen je in plaats van het geheim te houden.`;
            
            if (huidigPlan.doel === 'grenzen') {
                firstMessage = `Hé ${escapeHtml(huidigPlan.persoon) || 'daar'}, ik heb besloten ${tData.actie}. Daarom is het beter als we elkaar voorlopig even niet zien.`;
            }

            let chatScenario = [];
            if (huidigPlan.doel === 'grenzen') {
                chatScenario = [
                    { sender: 'user', text: firstMessage },
                    { sender: 'other', text: 'Oh wauw, oké. Dat is wel onverwacht. Waarom wil je me niet zien dan?' },
                    { sender: 'user', text: `Omdat wij altijd samen ${tData.werkwoord} en het bij mij nu te veel trek oproept om met je af te spreken.` }
                ];
            } else {
                chatScenario.push({ sender: 'user', text: firstMessage });
                chatScenario.push({ sender: 'other', text: 'O, wat goed van je. Kan ik je op een bepaalde manier helpen?' });
                
                if (huidigPlan.doel === 'opluchting') {
                    chatScenario.push({ sender: 'user', text: 'Ik vind het vooral fijn dat ik er met je over kan praten. Dat is voldoende. Dank je wel.' });
                } else if (huidigPlan.doel === 'steun') {
                    const steunZin = actiefTraject === 'gokken' 
                        ? `Het zou mij enorm helpen als je me niet meer vraagt om mee te gokken.`
                        : `Het zou mij enorm helpen als je me vanaf nu geen ${tData.middel} meer aanbiedt.`;
                    chatScenario.push({ sender: 'user', text: steunZin });
                }
            }

            html = `
                <div class="stagger-1" style="margin-bottom: 24px;">
                    <span style="font-size: 14px; font-weight: 600; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.5px;">Stap 4 van 4</span>
                    <p style="font-size: 15px; color: #475569; margin-top: 6px;">De eerste zin is het moeilijkst. Als die eruit is, volgt de rest vaak vanzelf.</p>
                </div>

                <div class="stagger-2 info-block" style="background: #f1f5f9; border-color: #cbd5e1; min-height: 220px; display: flex; flex-direction: column;">
                    <div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; text-align: center; margin-bottom: 16px;">Voorbeeld van zo'n gesprek</div>
                    <div id="chat-box" style="display: flex; flex-direction: column; gap: 12px; flex-grow: 1;">
                    </div>
                </div>

                <div class="stagger-3 info-block info-block-border-blue" style="margin-bottom: 32px;">
                    <label style="display: block; font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 8px;">Jouw openingszin</label>
                    <p style="font-size: 15px; color: #64748b; margin-top: 0; margin-bottom: 16px;">Typ je eigen zin, of gebruik ons voorbeeld en pas het aan.</p>
                    <textarea id="openingszin-input" class="form-input">${escapeHtml(huidigPlan.openingszin || firstMessage)}</textarea>
                    
                    <div style="margin-top: 16px; padding: 12px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; font-size: 15px; color: #92400e;">
                        <strong>Tip:</strong> Gebruik altijd de 'Ik-boodschap'. Bijvoorbeeld "Ik heb besloten..." of "Ik merk dat ik...". Vermijd verwijten met 'Jij'.
                    </div>
                </div>

                <div class="stagger-4 button-group" style="display: flex; justify-content: space-between;">
                    <button type="button" id="btn-vorige" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        &larr; Vorige
                    </button>
                    <button type="button" id="btn-opslaan" style="background-color: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        Plan Opslaan 🎉
                    </button>
                </div>
            `;

            // Setup chat animation na render
            const initTimeout = setTimeout(() => {
                const chatBox = pageContent.querySelector('#chat-box');
                if (!chatBox) return;
                chatBox.innerHTML = '';
                chatScenario.forEach((msg, index) => {
                    const timeoutId = setTimeout(() => {
                        if (!chatBox.isConnected) return;
                        const cssClass = msg.sender === 'user' ? 'chat-user' : 'chat-other';
                        const titleStr = msg.sender === 'user' ? '<strong>Jij:</strong><br>' : `<strong>${escapeHtml(huidigPlan.persoon) || 'De ander'}:</strong><br>`;
                        const bubble = document.createElement('div');
                        bubble.className = `chat-bubble ${cssClass}`;
                        bubble.innerHTML = `${titleStr}${msg.text}`;
                        chatBox.appendChild(bubble);
                    }, index * 1800 + 500); 
                    chatTimeouts.push(timeoutId);
                });
            }, 0);
            chatTimeouts.push(initTimeout);
        }
        else if (currentStepIndex === 5) {
            // ALTERNATIEF PAD
            html = `
                <div class="stagger-1" style="margin-bottom: 24px;">
                    <span style="font-size: 14px; font-weight: 600; color: #ef4444; text-transform: uppercase; letter-spacing: 0.5px;">Andere wegen zoeken</span>
                    <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Je hoeft het niet alleen te doen</h2>
                </div>

                <div class="stagger-2 info-block info-block-border-red" style="background: #fef2f2;">
                    <h4 style="margin: 0 0 8px 0; color: #b91c1c; font-size: 16px;">Het is volkomen oké.</h4>
                    <p style="margin: 0; font-size: 14px; color: #991b1b; line-height: 1.6;">
                        Dat je nu niemand hebt om dit mee te bespreken, of je je daar nog niet veilig genoeg voor voelt, is helemaal niet gek. Schaamte of angst voor een oordeel horen vaak bij dit proces. Neem je tijd.
                    </p>
                </div>

                <div class="stagger-3" style="margin-bottom: 32px;">
                    <p style="font-size: 15px; color: #334155; margin-bottom: 16px;">
                        Toch is het te zwaar om alles zelf te dragen. In de volgende stappen op de routekaart gaan we daarom bouwen aan andere, externe vormen van steun:
                    </p>

                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <div style="display: flex; align-items: flex-start; gap: 16px; background: #ffffff; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; box-shadow: 0 1px 2px rgba(0,0,0,0.02);">
                            <div style="background: #f1f5f9; padding: 12px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <span style="font-size: 20px;">👥</span>
                            </div>
                            <div>
                                <strong style="color: #1e293b; display: block; font-size: 16px; margin-bottom: 4px;">Lotgenotencontact</strong>
                                <span style="color: #475569; font-size: 14px; line-height: 1.5; display: block;">Mensen die precies hetzelfde meemaken begrijpen je vaak het best. We kijken later naar anonieme meetings en online netwerken.</span>
                            </div>
                        </div>

                        <div style="display: flex; align-items: flex-start; gap: 16px; background: #ffffff; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; box-shadow: 0 1px 2px rgba(0,0,0,0.02);">
                            <div style="background: #f1f5f9; padding: 12px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <span style="font-size: 20px;">🤝</span>
                            </div>
                            <div>
                                <strong style="color: #1e293b; display: block; font-size: 16px; margin-bottom: 4px;">Hulp inschakelen</strong>
                                <span style="color: #475569; font-size: 14px; line-height: 1.5; display: block;">Professionele en anonieme lijnen, of een gesprek met je huisarts, zonder dat je eigen omgeving er meteen iets van weet.</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="stagger-4 button-group" style="display: flex; justify-content: space-between;">
                    <button type="button" id="btn-vorige-alt" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        &larr; Vorige
                    </button>
                    <button type="button" id="btn-afronden-alt" style="background-color: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        Afronden 🎉
                    </button>
                </div>
            `;
        }
        else if (currentStepIndex === 6) {
            // COMPLETION
            const plan = plannen[plannen.length - 1];
            let doelText = "Je wilt het gesprek aangaan.";
            if (plan.doel === 'opluchting') doelText = "Je doel is om je emotionele last te delen en eerlijk te zijn.";
            if (plan.doel === 'steun') doelText = "Je doel is om steun te vragen voor lastige momenten.";
            if (plan.doel === 'grenzen') doelText = "Je doel is om grenzen te stellen rondom jullie contact.";

            html = `
                <div class="stagger-1" style="max-width: 600px; margin: 40px auto; padding: 32px; text-align: center; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                    <div style="font-size: 56px; margin-bottom: 16px;">💬</div>
                    <h2 style="font-size: 24px; color: #1e293b; margin-bottom: 24px;">Klaar voor de volgende stap</h2>
                    
                    <div style="background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: left; margin-bottom: 32px;">
                        <h3 style="margin: 0 0 16px 0; color: #1e293b; font-size: 18px; border-bottom: 2px solid #cbd5e1; padding-bottom: 8px;">Nieuw Gespreksplan Toegevoegd</h3>
                        
                        <p style="margin: 0 0 8px 0; font-size: 15px; color: #334155;"><strong>👥 Met wie:</strong> ${escapeHtml(plan.persoon)}</p>
                        <p style="margin: 0 0 8px 0; font-size: 15px; color: #334155;"><strong>🎯 Waarom:</strong> ${doelText}</p>
                        ${plan.moment ? `<p style="margin: 0 0 8px 0; font-size: 15px; color: #334155;"><strong>🕒 Wanneer:</strong> ${escapeHtml(plan.moment)}</p>` : ''}
                        ${plan.locatie ? `<p style="margin: 0 0 8px 0; font-size: 15px; color: #334155;"><strong>📍 Waar:</strong> ${escapeHtml(plan.locatie)}</p>` : ''}
                        
                        <div style="margin-top: 16px; background: #ffffff; padding: 12px; border-radius: 8px; border-left: 3px solid #3b82f6;">
                            <span style="font-size: 14px; color: #64748b; font-weight: 700; text-transform: uppercase;">Jouw openingszin:</span><br>
                            <span style="font-size: 15px; color: #1e293b; font-style: italic;">"${escapeHtml(plan.openingszin)}"</span>
                        </div>
                    </div>

                    <div class="button-group" style="justify-content: center; gap: 16px;">
                        <button type="button" id="btn-overzicht" style="background-color: #64748b; color: white; border: none; padding: 14px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 14px;">
                            Mijn plannen bekijken
                        </button>
                        <button type="button" id="btn-route" style="background-color: #2563eb; color: white; border: none; padding: 14px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 14px;">
                            Afronden &rarr;
                        </button>
                    </div>
                </div>
            `;
        }
        else if (currentStepIndex === 7) {
            // COMPLIMENT (Na afvinken)
            let dynamischeTekst = "<strong>jij hebt voor jezelf gekozen</strong>";
            if (laatstVoltooideDoel === 'opluchting') dynamischeTekst = "<strong>je hebt eerlijkheid verkozen boven geheimhouding</strong>";
            else if (laatstVoltooideDoel === 'steun') dynamischeTekst = "<strong>je hebt actief om steun gevraagd</strong> in plaats van het alleen te dragen";
            else if (laatstVoltooideDoel === 'grenzen') dynamischeTekst = "<strong>jij hebt je grens aangegeven</strong> en voor jezelf gekozen";

            html = `
                <div class="stagger-1" style="max-width: 600px; margin: 40px auto; padding: 32px; text-align: center; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                    <div style="font-size: 56px; margin-bottom: 16px;">🏆</div>
                    <h2 style="font-size: 24px; color: #1e293b; margin-bottom: 16px;">Wat ontzettend moedig van je!</h2>
                    <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 32px; max-width: 450px; margin-left: auto; margin-right: auto;">
                        Het aangaan van dit gesprek is een enorme stap. Ongeacht de reactie van de ander: ${dynamischeTekst}. Dat is iets om ontzettend trots op te zijn.
                    </p>
                    <button type="button" id="btn-overzicht-comp" style="background-color: #2563eb; color: white; border: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 15px;">
                        Terug naar overzicht
                    </button>
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
            // -- Globale Navigatie --
            if (e.target.closest('#back-route-btn') || e.target.closest('#btn-route') || e.target.closest('#btn-afronden-alt')) {
                chatTimeouts.forEach(clearTimeout);
                chatTimeouts = [];
                if (onComplete) onComplete();
                return;
            }

            if (e.target.closest('#btn-overzicht') || e.target.closest('#btn-overzicht-comp')) {
                currentStepIndex = 0;
                renderStep();
                return;
            }

            if (e.target.closest('#nieuw-plan-btn')) {
                huidigPlan = { persoon: '', doel: '', moment: '', locatie: '', openingszin: '', voltooid: false };
                currentStepIndex = 1;
                renderStep();
                return;
            }

            if (e.target.closest('#alternatief-btn-start')) {
                currentStepIndex = 5;
                renderStep();
                return;
            }

            // -- Knoppen (Vorige / Volgende) --
            if (e.target.closest('#btn-vorige') || e.target.closest('#btn-vorige-alt')) {
                if (currentStepIndex === 1 || currentStepIndex === 5) {
                    currentStepIndex = 0;
                } else if (currentStepIndex === 4) {
                    const opInp = pageContent.querySelector('#openingszin-input');
                    if (opInp) huidigPlan.openingszin = opInp.value;
                    currentStepIndex--;
                } else if (currentStepIndex === 3) {
                    const momInp = pageContent.querySelector('#moment-input');
                    const locInp = pageContent.querySelector('#locatie-input');
                    if (momInp) huidigPlan.moment = momInp.value;
                    if (locInp) huidigPlan.locatie = locInp.value;
                    currentStepIndex--;
                } else {
                    currentStepIndex--;
                }
                renderStep();
                return;
            }

            if (e.target.closest('#btn-volgende')) {
                if (currentStepIndex === 1) {
                    const inp = pageContent.querySelector('#persoon-input');
                    if (inp && inp.value.trim() === '') {
                        alert("Vul een naam in om door te gaan.");
                        return;
                    }
                    huidigPlan.persoon = inp.value.trim();
                }
                else if (currentStepIndex === 2) {
                    if (!huidigPlan.doel) {
                        alert("Kies eerst een doel voor het gesprek.");
                        return;
                    }
                }
                else if (currentStepIndex === 3) {
                    const momInp = pageContent.querySelector('#moment-input');
                    const locInp = pageContent.querySelector('#locatie-input');
                    if (momInp) huidigPlan.moment = momInp.value;
                    if (locInp) huidigPlan.locatie = locInp.value;
                }
                currentStepIndex++;
                renderStep();
                return;
            }

            // -- Opslaan in stap 4 --
            if (e.target.closest('#btn-opslaan')) {
                const opInp = pageContent.querySelector('#openingszin-input');
                if (opInp) huidigPlan.openingszin = opInp.value;
                plannen.push({...huidigPlan});
                savePlannen();
                
                currentStepIndex = 6;
                triggerConfetti();
                renderStep();
                return;
            }

            // -- Specifieke Acties Binnen Stappen --
            const naamChip = e.target.closest('.naam-chip');
            if (naamChip) {
                const naam = naamChip.getAttribute('data-naam');
                huidigPlan.persoon = naam;
                const inputEl = pageContent.querySelector('#persoon-input');
                if (inputEl) inputEl.value = naam;
                
                pageContent.querySelectorAll('.naam-chip').forEach(c => c.classList.remove('selected'));
                naamChip.classList.add('selected');
                return;
            }

            const keuzeCard = e.target.closest('.keuze-card');
            if (keuzeCard) {
                pageContent.querySelectorAll('.keuze-card').forEach(c => c.classList.remove('active'));
                keuzeCard.classList.add('active');
                huidigPlan.doel = keuzeCard.getAttribute('data-doel');
                return;
            }

            // -- Dashboard Acties --
            const deleteBtn = e.target.closest('.delete-plan-btn');
            if (deleteBtn) {
                if (confirm("Weet je zeker dat je dit plan wilt verwijderen?")) {
                    const idx = parseInt(deleteBtn.getAttribute('data-index'));
                    plannen.splice(idx, 1);
                    savePlannen();
                    renderStep();
                }
                return;
            }

            const voltooiBtn = e.target.closest('.voltooi-plan-btn');
            if (voltooiBtn) {
                const idx = parseInt(voltooiBtn.getAttribute('data-index'));
                plannen[idx].voltooid = true;
                laatstVoltooideDoel = plannen[idx].doel;
                savePlannen();
                
                currentStepIndex = 7;
                triggerConfetti();
                renderStep();
                return;
            }
        });
    }

    // Start eerste render
    renderStep();
}