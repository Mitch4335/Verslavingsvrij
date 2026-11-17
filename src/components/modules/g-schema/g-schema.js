// src/components/modules/g-schema/g-schema.js

function loadCSS() {
    const cssUrl = new URL('./g-schema.css', import.meta.url).href;
    if (!document.querySelector(`link[href="${cssUrl}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssUrl;
        document.head.appendChild(link);
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

export function renderGSchemaModule(onComplete) {
    loadCSS();
    window.scrollTo(0, 0);

    const container = document.getElementById('app-content') || document.getElementById('app');
    if (!container) return;

    const actiefTraject = localStorage.getItem('actieveVerslaving') || 'alcohol';
    const risicosData = JSON.parse(localStorage.getItem(`arminius_risicosituaties_data_${actiefTraject}`)) || { top3: [] };
    
    let actieWerkwoord = 'gebruiken';
    if (actiefTraject === 'alcohol') actieWerkwoord = 'drinken';
    else if (actiefTraject === 'cannabis') actieWerkwoord = 'blowen';
    else if (actiefTraject === 'gokken') actieWerkwoord = 'gokken';

    const storageKey = `arminius_gschema_data_${actiefTraject}`;
    let formData = JSON.parse(localStorage.getItem(storageKey)) || {
        gebeurtenis: '',
        gedachte: '',
        gevoel: '',
        gedrag: '',
        gevolg: '',
        alternatief: '',
        altGevoel: '',
        altGedrag: '',
        altGevolg: ''
    };

    const top3Situaties = risicosData.top3.map(t => t.situatie);

    const demoData = {
        1: [
            { badge: 'G1', title: 'GEBEURTENIS', text: 'Je wordt \'s nachts wakker van een geluid beneden.', neutral: true },
            { badge: 'G2', title: 'GEDACHTE', text: '“Er is een inbreker in huis!”', neutral: false },
            { badge: 'G3', title: 'GEVOEL', text: 'Extreme angst, hartkloppingen, paniek.', neutral: false },
            { badge: 'G4', title: 'GEDRAG', text: 'Meteen de politie bellen, doodstil onder de deken liggen.', neutral: false },
            { badge: 'G5', title: 'GEVOLG', text: 'Adrenaline giert door je lijf, je komt de hele nacht niet meer in slaap.', neutral: false }
        ],
        2: [
            { badge: 'G1', title: 'GEBEURTENIS', text: 'Je wordt \'s nachts wakker van een geluid beneden.', neutral: true },
            { badge: 'G2', title: 'GEDACHTE', text: '“Oh, de kat zal wel weer met een speeltje rommelen.”', neutral: false },
            { badge: 'G3', title: 'GEVOEL', text: 'Lichte irritatie, maar al snel geruststelling.', neutral: false },
            { badge: 'G4', title: 'GEDRAG', text: 'Zucht eens diep, draait je om en slaapt direct verder.', neutral: false },
            { badge: 'G5', title: 'GEVOLG', text: 'Je behoudt je rust en slaapt de nacht lekker uit.', neutral: false }
        ]
    };

    let renderTimeout = null;
    let hasViewedScenario2 = false;

    container.innerHTML = `
        <div style="padding: 20px;">
            <div class="progress-bar-container" style="background: #e2e8f0; height: 6px; border-radius: 3px; margin-bottom: 24px; overflow: hidden; max-width: 700px; margin-left: auto; margin-right: auto;">
                <div class="progress-bar" id="gs-progress-bar" style="width: 12%; background: #2563eb; height: 100%; transition: width 0.4s ease-out;"></div>
            </div>
            
            <div class="module-container gschema-container" style="max-width: 700px; margin: 0 auto;">
                
                <!-- STAP 0: MODULE INTRODUCTIE -->
                <section class="wizard-step active" id="gs-step-0" style="display: block;">
                    <div style="margin-bottom: 32px;">
                        <span style="font-size: 14px; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Psycho-educatie</span>
                        <h2 style="font-size: 28px; font-weight: 800; color: #1e293b; margin-top: 4px; margin-bottom: 16px;">Het G-schema</h2>
                    </div>

                    <div class="stagger-1 info-block info-block-border-blue">
                        <span style="font-size: 24px; display: block; margin-bottom: 8px;">💭</span>
                        <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                            Niet de gebeurtenis zelf bepaalt hoe je je voelt en handelt, maar de <strong>gedachte</strong> die je daarbij hebt.
                        </p>
                    </div>

                    <div class="stagger-2 info-block info-block-border-green">
                        <span style="font-size: 24px; display: block; margin-bottom: 8px;">🔍</span>
                        <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                            In deze module leer je hoe je een specifieke risicosituatie kunt ontleden in de 5 G's. Zo ontdek je je eigen denkfouten en krijg je grip op je automatische reacties en trek.
                        </p>
                    </div>

                    <div class="stagger-3" style="display: flex; justify-content: flex-end; margin-top: 24px;">
                        <button type="button" class="btn-primary next-step" data-next="gs-step-demo" style="background-color: #2563eb; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 15px;">Doorgaan naar module &rarr;</button>
                    </div>
                </section>

                <!-- STAP DEMO: VOORBEELD -->
                <section class="wizard-step" id="gs-step-demo" style="display: none;">
                    <div class="stagger-1" style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 14px; font-weight: 600; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.5px;">Voorbeeld uit de praktijk</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Hoe gedachten sturen</h2>
                    </div>

                    <div class="stagger-2 info-block info-block-border-orange">
                        <p style="font-size: 15px; font-weight: 600; color: #1e293b; line-height: 1.6; margin-top: 0; margin-bottom: 16px;">
                            Stel je voor: het is diep in de nacht en je wordt wakker van een vreemd geluid beneden. Dezelfde gebeurtenis kan door een andere gedachte compleet anders uitpakken:
                        </p>

                        <div class="demo-toggle-group">
                            <button type="button" class="demo-btn active" id="btn-scenario-1" data-scenario="1">A: De Inbreker</button>
                            <button type="button" class="demo-btn" id="btn-scenario-2" data-scenario="2">B: De Kat</button>
                        </div>

                        <div class="chain-box theme-red" id="demo-chain-box">
                            <!-- Dynamisch gevuld -->
                        </div>
                    </div>

                    <div class="stagger-3" style="display: flex; justify-content: space-between; margin-top: 32px;">
                        <button type="button" class="btn-secondary prev-step" data-prev="gs-step-0" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Terug</button>
                        <button type="button" class="btn-primary next-step" id="btn-start-eigen-schema" data-next="gs-step-1" disabled style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: not-allowed; font-size: 14px; opacity: 0.5; transition: all 0.2s;">Start je eigen schema &rarr;</button>
                    </div>
                </section>

                <!-- STAP 1: G1 -->
                <section class="wizard-step" id="gs-step-1" style="display: none;">
                    <div class="stagger-1" style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 14px; font-weight: 600; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.5px;">Stap 1 van 6</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">De Gebeurtenis (G1)</h2>
                    </div>

                    <div class="stagger-2 info-block info-block-border-blue">
                        <p class="form-hint" style="margin-top: 0;">
                            Beschrijf een concreet moment waarop de risicogedachten het wonnen van je gezonde verstand (waarbij je de neiging had, of toegaf, om te gaan ${actieWerkwoord}). 
                            <br><br>
                            Beschrijf dit objectief — alsof je naar een scène in een film kijkt. <strong>Waar was je, met wie, en wat deed je?</strong>
                        </p>
                        
                        ${top3Situaties.length > 0 ? `
                            <div style="margin-bottom: 16px; padding: 12px; background: #f8fafc; border-radius: 8px;">
                                <label style="font-size: 15px; font-weight: 600; color: #64748b;">Je Top 3 Risicosituaties (ter inspiratie):</label>
                                <div class="chip-grid">
                                    ${top3Situaties.map(sit => `<div class="gschema-chip">${sit}</div>`).join('')}
                                </div>
                            </div>
                        ` : ''}

                        <div class="form-group" style="margin-bottom: 0;">
                            <textarea class="gschema-textarea" id="gs-input-gebeurtenis" placeholder="Bijv. Ik zat 's avonds om 20:00 uur alleen op de bank...">${formData.gebeurtenis}</textarea>
                        </div>
                    </div>

                    <div class="stagger-3" style="display: flex; justify-content: space-between;">
                        <button type="button" class="btn-secondary prev-step" data-prev="gs-step-demo" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                        <button type="button" class="btn-primary next-step" id="btn-next-1" data-next="gs-step-2" ${!formData.gebeurtenis.trim() ? 'disabled' : ''} style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; transition: opacity 0.2s;">Volgende: Gedachte &rarr;</button>
                    </div>
                </section>

                <!-- STAP 2: G2 -->
                <section class="wizard-step" id="gs-step-2" style="display: none;">
                    <div class="stagger-1" style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 14px; font-weight: 600; color: #8b5cf6; text-transform: uppercase; letter-spacing: 0.5px;">Stap 2 van 6</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">De Gedachte (G2)</h2>
                    </div>

                    <div class="stagger-2 info-block info-block-border-purple">
                        <p class="form-hint" style="margin-top: 0;">Welke automatische gedachte schoot er direct door je hoofd? Wat vertelde je brein je op dat moment?</p>
                        <div class="form-group" style="margin-bottom: 0;">
                            <textarea class="gschema-textarea" id="gs-input-gedachte" placeholder="Bijv. Ik heb het na zo'n zware dag echt verdiend, één keer kan geen kwaad...">${formData.gedachte}</textarea>
                        </div>
                    </div>

                    <div class="stagger-3" style="display: flex; justify-content: space-between;">
                        <button type="button" class="btn-secondary prev-step" data-prev="gs-step-1" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                        <button type="button" class="btn-primary next-step" id="btn-next-2" data-next="gs-step-3" ${!formData.gedachte.trim() ? 'disabled' : ''} style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; transition: opacity 0.2s;">Volgende: Gevoel &rarr;</button>
                    </div>
                </section>

                <!-- STAP 3: G3 -->
                <section class="wizard-step" id="gs-step-3" style="display: none;">
                    <div class="stagger-1" style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 14px; font-weight: 600; color: #ec4899; text-transform: uppercase; letter-spacing: 0.5px;">Stap 3 van 6</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Het Gevoel (G3)</h2>
                    </div>

                    <div class="stagger-2 info-block" style="border-left-color: #ec4899;">
                        <p class="form-hint" style="margin-top: 0;">Welke emotie voelde je (bijv. spanning, somberheid, onrust)? En merkte je ook iets in je lichaam (bijv. een brok in de keel, trek)?</p>
                        <div class="form-group" style="margin-bottom: 0;">
                            <textarea class="gschema-textarea" id="gs-input-gevoel" placeholder="Bijv. Een gevoel van onrust in mijn borst en directe trek om toe te geven...">${formData.gevoel}</textarea>
                        </div>
                    </div>

                    <div class="stagger-3" style="display: flex; justify-content: space-between;">
                        <button type="button" class="btn-secondary prev-step" data-prev="gs-step-2" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                        <button type="button" class="btn-primary next-step" id="btn-next-3" data-next="gs-step-4" ${!formData.gevoel.trim() ? 'disabled' : ''} style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; transition: opacity 0.2s;">Volgende: Gedrag &rarr;</button>
                    </div>
                </section>

                <!-- STAP 4: G4 -->
                <section class="wizard-step" id="gs-step-4" style="display: none;">
                    <div class="stagger-1" style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 14px; font-weight: 600; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.5px;">Stap 4 van 6</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Het Gedrag (G4)</h2>
                    </div>

                    <div class="stagger-2 info-block info-block-border-orange">
                        <p class="form-hint" style="margin-top: 0;">Wat deed je naar aanleiding van dit gevoel? Welke actie ondernam je (of wilde je ondernemen)?</p>
                        <div class="form-group" style="margin-bottom: 0;">
                            <textarea class="gschema-textarea" id="gs-input-gedrag" placeholder="Bijv. Naar de winkel lopen / toegeven aan de drang...">${formData.gedrag}</textarea>
                        </div>
                    </div>

                    <div class="stagger-3" style="display: flex; justify-content: space-between;">
                        <button type="button" class="btn-secondary prev-step" data-prev="gs-step-3" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                        <button type="button" class="btn-primary next-step" id="btn-next-4" data-next="gs-step-5" ${!formData.gedrag.trim() ? 'disabled' : ''} style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; transition: opacity 0.2s;">Volgende: Gevolg &rarr;</button>
                    </div>
                </section>

                <!-- STAP 5: G5 -->
                <section class="wizard-step" id="gs-step-5" style="display: none;">
                    <div class="stagger-1" style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 14px; font-weight: 600; color: #ef4444; text-transform: uppercase; letter-spacing: 0.5px;">Stap 5 van 6</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Het Gevolg (G5)</h2>
                    </div>

                    <div class="stagger-2 info-block info-block-border-red">
                        <p class="form-hint" style="margin-top: 0;">Wat leverde dit op de korte termijn op? En wat was het nadeel op de lange termijn?</p>
                        <div class="form-group" style="margin-bottom: 0;">
                            <textarea class="gschema-textarea" id="gs-input-gevolg" placeholder="Bijv. Korte termijn: ontspanning. Lange termijn: schuldgevoel de volgende dag...">${formData.gevolg}</textarea>
                        </div>
                    </div>

                    <div class="stagger-3" style="display: flex; justify-content: space-between;">
                        <button type="button" class="btn-secondary prev-step" data-prev="gs-step-4" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                        <button type="button" class="btn-primary next-step" id="btn-next-5" data-next="gs-step-6" ${!formData.gevolg.trim() ? 'disabled' : ''} style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; transition: opacity 0.2s;">Volgende: Ombuigen &rarr;</button>
                    </div>
                </section>

                <!-- STAP 6: ALTERNATIEF -->
                <section class="wizard-step" id="gs-step-6" style="display: none;">
                    <div class="stagger-1" style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 14px; font-weight: 600; color: #10b981; text-transform: uppercase; letter-spacing: 0.5px;">Stap 6 van 6</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Uitdagen & Nieuw Perspectief</h2>
                    </div>

                    <div class="stagger-2 info-block info-block-border-green">
                        <p class="form-hint" style="margin-top: 0;">Beantwoord deze hulpvragen. Je hoeft niet overal 'nee' op te antwoorden, maar het helpt je kritisch te kijken naar je automatische gedachte.</p>
                        
                        <div id="gs-display-gedachte-container" style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #2563eb; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; display: none;">
                            <span style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">Jouw automatische gedachte (G2):</span>
                            <p id="gs-display-gedachte-text" style="margin: 0; font-size: 15px; font-weight: 700; color: #1e293b; font-style: italic;"></p>
                        </div>

                        <div class="socratic-check-box">
                            <div class="socratic-question">
                                <p>1. Is de gedachte absoluut waar (een onbetwistbaar feit)?</p>
                                <div class="socratic-btns">
                                    <button type="button" class="soc-btn" data-soc-q="1" data-val="ja">Ja</button>
                                    <button type="button" class="soc-btn" data-soc-q="1" data-val="nee">Nee</button>
                                </div>
                            </div>
                            <div class="socratic-question">
                                <p>2. Helpt deze gedachte je om je langetermijndoel te bereiken?</p>
                                <div class="socratic-btns">
                                    <button type="button" class="soc-btn" data-soc-q="2" data-val="ja">Ja</button>
                                    <button type="button" class="soc-btn" data-soc-q="2" data-val="nee">Nee</button>
                                </div>
                            </div>
                            <div class="socratic-question">
                                <p>3. Zou je een goede vriend aanraden hetzelfde te denken?</p>
                                <div class="socratic-btns">
                                    <button type="button" class="soc-btn" data-soc-q="3" data-val="ja">Ja</button>
                                    <button type="button" class="soc-btn" data-soc-q="3" data-val="nee">Nee</button>
                                </div>
                            </div>
                        </div>

                        <div class="form-group" style="margin-top: 24px;">
                            <label style="font-size: 14px; font-weight: 700; color: #1e293b; display: block; margin-bottom: 8px;">Formuleer een helpende, realistische gedachte:</label>
                            <textarea class="gschema-textarea" id="gs-input-alternatief" placeholder="Bijv. Ik voel nu wel trek, maar toegeven brengt me verder van mijn doel. Ik kan ook ontspannen zonder middel.">${formData.alternatief}</textarea>
                        </div>

                        <h4 style="font-size: 16px; color: #1e293b; margin-top: 32px; margin-bottom: 8px;">De winst van het omdenken (Nieuwe G's):</h4>
                        <p class="form-hint">Wat gebeurt er als je deze nieuwe gedachte kiest?</p>

                        <div class="form-group" style="margin-bottom: 12px;">
                            <label style="font-size: 15px; color: #475569; display: block; margin-bottom: 4px;">Nieuw Gevoel (G3):</label>
                            <input type="text" class="gschema-textarea" style="min-height: 45px; padding: 8px 12px;" id="gs-input-alt-gevoel" placeholder="Bijv. Trots, rustiger gevoel..." value="${formData.altGevoel || ''}">
                        </div>
                        <div class="form-group" style="margin-bottom: 12px;">
                            <label style="font-size: 15px; color: #475569; display: block; margin-bottom: 4px;">Nieuw Gedrag (G4):</label>
                            <input type="text" class="gschema-textarea" style="min-height: 45px; padding: 8px 12px;" id="gs-input-alt-gedrag" placeholder="Bijv. Een glas water pakken..." value="${formData.altGedrag || ''}">
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label style="font-size: 15px; color: #475569; display: block; margin-bottom: 4px;">Nieuw Gevolg (G5):</label>
                            <input type="text" class="gschema-textarea" style="min-height: 45px; padding: 8px 12px;" id="gs-input-alt-gevolg" placeholder="Bijv. Morgen trots wakker worden..." value="${formData.altGevolg || ''}">
                        </div>
                    </div>

                    <div class="stagger-3" style="display: flex; justify-content: space-between;">
                        <button type="button" class="btn-secondary prev-step" data-prev="gs-step-5" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                        <button type="button" class="btn-primary" id="btn-finish-schema" ${!formData.alternatief.trim() ? 'disabled' : ''} style="background-color: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; transition: opacity 0.2s;">Schema Opslaan & Afronden 🎉</button>
                    </div>
                </section>

                <!-- STAP 7: SUCCES -->
                <section class="wizard-step" id="gs-step-7" style="display: none;">
                    <div style="max-width: 600px; margin: 40px auto; padding: 32px; text-align: center; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                        <div class="stagger-1">
                            <div style="font-size: 64px; margin-bottom: 16px;">💭</div>
                            <h2 style="font-size: 24px; color: #1e293b; margin-bottom: 12px;">G-schema Voltooid!</h2>
                            <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 32px;">
                                Mooi werk! Je hebt inzicht gekregen in hoe jouw gedachten je gevoel en gedrag sturen en hoe je dit succesvol kunt ombuigen.
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

    const pageContainer = container.querySelector('.gschema-container');

    function playDemoScenario(scenarioNum) {
        const btn1 = pageContainer.querySelector('#btn-scenario-1');
        const btn2 = pageContainer.querySelector('#btn-scenario-2');
        const box = pageContainer.querySelector('#demo-chain-box');

        if (!btn1 || !btn2 || !box) return;

        if (scenarioNum === 1) {
            btn1.classList.add('active');
            btn2.classList.remove('active');
            box.classList.remove('theme-green');
            box.classList.add('theme-red');
        } else {
            btn2.classList.add('active');
            btn1.classList.remove('active');
            box.classList.remove('theme-red');
            box.classList.add('theme-green');
            
            // Schakel de knop in zodra scenario 2 is bekeken
            hasViewedScenario2 = true;
            const startBtn = pageContainer.querySelector('#btn-start-eigen-schema');
            if (startBtn) {
                startBtn.disabled = false;
                startBtn.style.opacity = '1';
                startBtn.style.cursor = 'pointer';
            }
        }

        if (renderTimeout) clearTimeout(renderTimeout);
        
        box.innerHTML = '';
        const items = demoData[scenarioNum];
        let currentIndex = 0;

        function appendNextItem() {
            if (currentIndex < items.length) {
                const item = items[currentIndex];
                const row = document.createElement('div');
                row.className = `chain-row ${item.neutral ? 'is-neutral' : ''}`;
                row.innerHTML = `
                    <div class="chain-badge">${item.badge}</div>
                    <div class="chain-content">
                        <h5>${item.title}</h5>
                        <p>${item.text}</p>
                    </div>
                `;
                box.appendChild(row);
                currentIndex++;
                
                renderTimeout = setTimeout(appendNextItem, 1200);
            }
        }
        appendNextItem();
    }

    if (pageContainer) {
        pageContainer.addEventListener('input', (e) => {
            const checkEmpty = (inputId, btnId) => {
                if (e.target.id === inputId) {
                    const btn = pageContainer.querySelector(`#${btnId}`);
                    if (btn) {
                        btn.disabled = !e.target.value.trim();
                        btn.style.opacity = btn.disabled ? '0.5' : '1';
                    }
                }
            };
            checkEmpty('gs-input-gebeurtenis', 'btn-next-1');
            checkEmpty('gs-input-gedachte', 'btn-next-2');
            checkEmpty('gs-input-gevoel', 'btn-next-3');
            checkEmpty('gs-input-gedrag', 'btn-next-4');
            checkEmpty('gs-input-gevolg', 'btn-next-5');
            checkEmpty('gs-input-alternatief', 'btn-finish-schema');
        });

        pageContainer.addEventListener('click', (e) => {
            const nextBtn = e.target.closest('.next-step');
            if (nextBtn && !nextBtn.disabled) {
                showStep(nextBtn.getAttribute('data-next'));
                return;
            }
            const prevBtn = e.target.closest('.prev-step');
            if (prevBtn) {
                showStep(prevBtn.getAttribute('data-prev'));
                return;
            }

            const demoBtn = e.target.closest('.demo-btn');
            if (demoBtn) {
                playDemoScenario(parseInt(demoBtn.getAttribute('data-scenario')));
                return;
            }

            const socBtn = e.target.closest('.soc-btn');
            if (socBtn) {
                const qDiv = socBtn.closest('.socratic-question');
                qDiv.querySelectorAll('.soc-btn').forEach(b => b.classList.remove('active-ja', 'active-nee'));
                const val = socBtn.getAttribute('data-val');
                socBtn.classList.add(val === 'ja' ? 'active-ja' : 'active-nee');
                return;
            }

            const finishBtn = e.target.closest('#btn-finish-schema');
            if (finishBtn && !finishBtn.disabled) {
                formData = {
                    gebeurtenis: document.getElementById('gs-input-gebeurtenis').value,
                    gedachte: document.getElementById('gs-input-gedachte').value,
                    gevoel: document.getElementById('gs-input-gevoel').value,
                    gedrag: document.getElementById('gs-input-gedrag').value,
                    gevolg: document.getElementById('gs-input-gevolg').value,
                    alternatief: document.getElementById('gs-input-alternatief').value,
                    altGevoel: document.getElementById('gs-input-alt-gevoel').value,
                    altGedrag: document.getElementById('gs-input-alt-gedrag').value,
                    altGevolg: document.getElementById('gs-input-alt-gevolg').value
                };
                localStorage.setItem(storageKey, JSON.stringify(formData));
                
                triggerConfetti();
                showStep('gs-step-7');
                return;
            }

            const dashBtn = e.target.closest('#btn-back-dashboard-final');
            if (dashBtn) {
                if (onComplete) onComplete();
                return;
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

            if (stepId === 'gs-step-demo') {
                const activeBtn = targetStep.querySelector('.demo-btn.active');
                playDemoScenario(activeBtn ? parseInt(activeBtn.getAttribute('data-scenario')) : 1);
            } else {
                if (renderTimeout) clearTimeout(renderTimeout);
            }

            if (stepId === 'gs-step-6') {
                const gedachteVal = document.getElementById('gs-input-gedachte').value;
                const displayEl = document.getElementById('gs-display-gedachte-text');
                const containerEl = document.getElementById('gs-display-gedachte-container');
                if (displayEl && containerEl) {
                    if (gedachteVal.trim()) {
                        displayEl.textContent = `“${gedachteVal}”`;
                        containerEl.style.display = 'block';
                    } else {
                        containerEl.style.display = 'none';
                    }
                }
            }
        }

        const progressBarContainer = container.querySelector('.progress-bar-container');
        const progressBar = container.querySelector('#gs-progress-bar');
        
        if (stepId === 'gs-step-7') {
            if (progressBarContainer) progressBarContainer.style.display = 'none';
        } else {
            if (progressBarContainer) progressBarContainer.style.display = 'block';
            if (progressBar) {
                if (stepId === 'gs-step-0') progressBar.style.width = '12%';
                else if (stepId === 'gs-step-demo') progressBar.style.width = '25%';
                else if (stepId === 'gs-step-1') progressBar.style.width = '37%';
                else if (stepId === 'gs-step-2') progressBar.style.width = '50%';
                else if (stepId === 'gs-step-3') progressBar.style.width = '62%';
                else if (stepId === 'gs-step-4') progressBar.style.width = '75%';
                else if (stepId === 'gs-step-5') progressBar.style.width = '87%';
                else if (stepId === 'gs-step-6') progressBar.style.width = '100%';
            }
        }
    }
}