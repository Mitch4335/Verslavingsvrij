// src/components/modules/watisverslaving/watisverslaving.js

function loadCSS() {
    const cssUrl = new URL('./watisverslaving.css', import.meta.url).href;
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

export function renderWatIsVerslavingModule(containerElement, onComplete) {
    loadCSS();
    window.scrollTo(0, 0);
    
    const container = containerElement || document.getElementById('app-content');
    if (!container) return;

    const actiefTraject = localStorage.getItem('actieveVerslaving') || 'alcohol';
    const lsKey = `arminius_module_watisverslaving_data_${actiefTraject}`;
    
    let savedData = { herkendeKenmerken: [] };
    const storedStr = localStorage.getItem(lsKey);
    if (storedStr) {
        try {
            const parsed = JSON.parse(storedStr);
            if (parsed) savedData = { ...savedData, ...parsed };
        } catch (e) {}
    }

    const tekstMap = {
        'alcohol': { middel: 'alcohol', handeling: 'drinken' },
        'cannabis': { middel: 'wiet of hasj', handeling: 'blowen' },
        'cocaine': { middel: 'cocaïne', handeling: 'gebruiken' },
        'gokken': { middel: 'gokken', handeling: 'spelen' }
    };
    const tData = tekstMap[actiefTraject] || tekstMap['alcohol'];

    const htmlContent = `
        <div class="module-container watisverslaving-container">
            <style>
                @keyframes slideUpFade { 0% { opacity: 0; transform: translateY(15px); } 100% { opacity: 1; transform: translateY(0); } }
                .stagger-1 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.1s; }
                .stagger-2 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.2s; }
                .stagger-3 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.3s; }
                .stagger-4 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.4s; }
                .stagger-5 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.5s; }
                
                .info-block { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                .info-block-border-blue { border-left: 4px solid #3b82f6; }
                .info-block-border-orange { border-left: 4px solid #f59e0b; }
                .info-block-border-green { border-left: 4px solid #10b981; }
            </style>

            <div class="progress-bar-container" style="background: #e2e8f0; height: 6px; border-radius: 3px; margin-bottom: 24px; overflow: hidden;">
                <div class="progress-bar" id="wat-progress-bar" style="width: 16%; background: #2563eb; height: 100%; transition: width 0.3s ease;"></div>
            </div>

            <!-- STAP 0: INTRODUCTIE -->
            <section class="wizard-step active" id="wat-step-intro" style="display: block;">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 32px;">
                        <span style="font-size: 12px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Psycho-educatie</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Wat is verslaving eigenlijk?</h2>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">
                        <div class="stagger-1 info-block info-block-border-blue">
                            <span style="font-size: 24px; display: block; margin-bottom: 8px;">🧠</span>
                            <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                                <strong>Het is geen gebrek aan wilskracht.</strong> Verslaving is niet iets waar je op een dag bewust voor kiest, en het is ook geen teken van zwakte. Het is een complex samenspel in je brein.
                            </p>
                        </div>
                        <div class="stagger-2 info-block info-block-border-orange">
                            <span style="font-size: 24px; display: block; margin-bottom: 8px;">🔍</span>
                            <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                                <strong>Begrip is de eerste stap.</strong> Om je eigen patronen te kunnen doorbreken, helpt het enorm om te begrijpen hoe verslaving werkt en waar jouw kwetsbaarheid vandaan komt.
                            </p>
                        </div>
                        <div class="stagger-3 info-block info-block-border-green">
                            <span style="font-size: 24px; display: block; margin-bottom: 8px;">🧩</span>
                            <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                                In deze korte module kijken we naar de kenmerken van afhankelijkheid, ontrafelen we de dominostenen van verslaving, en kijken we hoe het fungeert als overlevingsmechanisme.
                            </p>
                        </div>
                    </div>

                    <div class="stagger-4 button-group" style="display: flex; justify-content: flex-end;">
                        <button type="button" class="btn-primary next-step" data-next="wat-step-1" style="background-color: #2563eb; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 15px;">Start de uitleg &rarr;</button>
                    </div>
                </div>
            </section>

            <!-- STAP 1: KENMERKEN -->
            <section class="wizard-step" id="wat-step-1" style="display: none;">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 12px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Stap 1 van 5</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">De grens bepalen</h2>
                        <p style="font-size: 15px; color: #475569;">Wanneer is iets een gewoonte, en wanneer is het een verslaving? Klik op de kenmerken die je bij jezelf herkent.</p>
                    </div>

                    <div class="stagger-1" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px;">
                        <div class="check-card ${savedData.herkendeKenmerken.includes('tijd') ? 'active' : ''}" data-id="tijd">
                            <div class="check-box"></div>
                            <div>
                                <h3 style="margin: 0 0 4px 0; font-size: 16px; color: #1e293b;">Tijd, geld en energie</h3>
                                <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.5;">Je bent in je hoofd veel bezig met ${tData.middel}, het kost veel geld, of de handeling en het herstel nemen veel tijd in beslag.</p>
                            </div>
                        </div>

                        <div class="check-card ${savedData.herkendeKenmerken.includes('nadelen') ? 'active' : ''}" data-id="nadelen">
                            <div class="check-box"></div>
                            <div>
                                <h3 style="margin: 0 0 4px 0; font-size: 16px; color: #1e293b;">Nadelen ervaren</h3>
                                <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.5;">Het ${tData.handeling} levert duidelijke problemen op. Bijvoorbeeld in je gezondheid, je emoties, op je werk of in je relaties met anderen.</p>
                            </div>
                        </div>

                        <div class="check-card ${savedData.herkendeKenmerken.includes('controleverlies') ? 'active' : ''}" data-id="controleverlies">
                            <div class="check-box"></div>
                            <div>
                                <h3 style="margin: 0 0 4px 0; font-size: 16px; color: #1e293b;">Controleverlies</h3>
                                <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.5;">Ondanks de negatieve gevolgen lukt het je niet goed om structureel te minderen of om helemaal te stoppen.</p>
                            </div>
                        </div>
                    </div>

                    <div class="stagger-2" style="background: #f8fafc; border: 1px dashed #cbd5e1; padding: 16px; border-radius: 8px; margin-bottom: 24px; text-align: center;">
                        <p style="margin: 0; font-size: 14px; color: #475569; font-style: italic;">Als je (een van) deze drie punten herkent, spreken we in de psychologie al van een afhankelijkheid. Je bent hierin niet alleen.</p>
                    </div>

                    <div class="stagger-3 button-group" style="display: flex; justify-content: space-between;">
                        <button class="btn-secondary prev-step" data-prev="wat-step-intro" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                        <button class="btn-primary next-step" data-next="wat-step-2" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">Volgende &rarr;</button>
                    </div>
                </div>
            </section>

            <!-- STAP 2: WAAR GING HET MIS? -->
            <section class="wizard-step" id="wat-step-2" style="display: none;">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 12px; font-weight: 600; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.5px;">Stap 2 van 5</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Waar is het precies misgegaan?</h2>
                    </div>

                    <div class="stagger-1" style="margin-bottom: 24px;">
                        <p style="font-size: 15px; color: #334155; line-height: 1.6;">
                            Mensen willen vaak weten wanneer het precies is misgegaan. Ze zoeken naar één moment dat de verslaving heeft veroorzaakt. 
                        </p>
                        <p style="font-size: 15px; color: #334155; line-height: 1.6;">
                            Soms is er inderdaad een duidelijk breekpunt. Je ziet bijvoorbeeld dat iemands gebruik escaleert na een ingrijpende gebeurtenis, zoals een echtscheiding, baanverlies, of een traumatische ervaring.
                        </p>
                    </div>

                    <div class="stagger-2 info-block" style="border-left-color: #ef4444; background: #fef2f2; border-color: #fecaca; padding: 20px; margin-bottom: 32px; box-shadow: none;">
                        <h4 style="margin: 0 0 8px 0; color: #991b1b; font-size: 16px;">Maar let op de paradox...</h4>
                        <p style="margin: 0; font-size: 14px; color: #7f1d1d; line-height: 1.6;">
                            Er zijn ook miljoenen mensen die een scheiding of trauma meemaken, en daar <strong>geen</strong> verslaving aan overhouden. Waarom de één wel, en de ander niet?
                        </p>
                    </div>

                    <div class="stagger-3" style="margin-bottom: 32px;">
                        <p style="font-size: 15px; color: #334155; line-height: 1.6;">
                            Het antwoord ligt in het verschil tussen <strong>kwetsbaarheid</strong> en <strong>uitlokking</strong>. Bijna niemand raakt verslaafd door één enkele gebeurtenis. Het is een optelsom van je genen (Nature), je omgeving (Nurture) en de keuzes en connecties in je leven.
                        </p>
                    </div>

                    <div class="stagger-4 button-group" style="display: flex; justify-content: space-between;">
                        <button class="btn-secondary prev-step" data-prev="wat-step-1" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                        <button class="btn-primary next-step" data-next="wat-step-3" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">Jouw Kwetsbaarheid &rarr;</button>
                    </div>
                </div>
            </section>

            <!-- STAP 3: KWETSBAARHEID (Accordeon) -->
            <section class="wizard-step" id="wat-step-3" style="display: none;">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 12px; font-weight: 600; color: #8b5cf6; text-transform: uppercase; letter-spacing: 0.5px;">Stap 3 van 5</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">De onzichtbare kwetsbaarheid</h2>
                        <p style="font-size: 15px; color: #475569; margin-bottom: 24px;">Klik op de onderdelen om te ontdekken hoe de bodem voor verslaving onbewust al lang gelegd kan zijn.</p>
                    </div>

                    <div style="margin-bottom: 32px;">
                        <div class="stagger-1 accordion-card open">
                            <div class="accordion-header">
                                <div class="accordion-title-area">
                                    <span style="font-size: 26px;">🧬</span>
                                    <h4 style="margin: 0; color: #1e293b; font-size: 16px;">Genetica & Familie</h4>
                                </div>
                                <span class="chevron">▼</span>
                            </div>
                            <div class="accordion-content">
                                <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.6; padding-top: 16px;">Het kan zijn dat verslaving of verhoogd middelengebruik voorkomt in de familie. Ook genetische gevoeligheid voor emotionele klachten (zoals aanleg voor angst of depressiviteit) vergroot de kwetsbaarheid enorm.</p>
                            </div>
                        </div>

                        <div class="stagger-2 accordion-card">
                            <div class="accordion-header">
                                <div class="accordion-title-area">
                                    <span style="font-size: 26px;">🏡</span>
                                    <h4 style="margin: 0; color: #1e293b; font-size: 16px;">Opvoeding & Normalisatie</h4>
                                </div>
                                <span class="chevron">▼</span>
                            </div>
                            <div class="accordion-content">
                                <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.6; padding-top: 16px;">Als je opgroeit in een huis waar een middel genormaliseerd is, leer je onbewust dat het erbij hoort. Helemaal als je ziet dat ouders het middel inzetten als manier om met stress of emoties om te gaan (coping).</p>
                            </div>
                        </div>

                        <div class="stagger-3 accordion-card">
                            <div class="accordion-header">
                                <div class="accordion-title-area">
                                    <span style="font-size: 26px;">⚡</span>
                                    <h4 style="margin: 0; color: #1e293b; font-size: 16px;">Het Brein (Dopamine)</h4>
                                </div>
                                <span class="chevron">▼</span>
                            </div>
                            <div class="accordion-content">
                                <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.6; padding-top: 16px;">Sommige mensen hebben van nature een iets lagere dopaminespiegel. Daardoor zoeken zij (vaak onbewust) meer externe prikkeling om zich 'normaal' of voldaan te voelen.</p>
                            </div>
                        </div>

                        <div class="stagger-4 accordion-card">
                            <div class="accordion-header">
                                <div class="accordion-title-area">
                                    <span style="font-size: 26px;">👥</span>
                                    <h4 style="margin: 0; color: #1e293b; font-size: 16px;">De Sociale Omgeving</h4>
                                </div>
                                <span class="chevron">▼</span>
                            </div>
                            <div class="accordion-content">
                                <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.6; padding-top: 16px;">Je kiest bewust of onbewust je omgeving uit. Mensen die ${tData.handeling} trekken vaak naar elkaar toe, waardoor het gedrag genormaliseerd en aangemoedigd wordt. Eenmaal in zo'n groep is stoppen extra lastig: het wordt verwacht, aangeboden, en anderen zien ${tData.handeling} wakkert direct de verleiding aan.</p>
                            </div>
                        </div>
                    </div>

                    <div class="stagger-5 button-group" style="display: flex; justify-content: space-between;">
                        <button class="btn-secondary prev-step" data-prev="wat-step-2" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                        <button class="btn-primary next-step" data-next="wat-step-4" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">De Domino Valt &rarr;</button>
                    </div>
                </div>
            </section>

            <!-- STAP 4: DOMINO EFFECT -->
            <section class="wizard-step" id="wat-step-4" style="display: none;">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 12px; font-weight: 600; color: #10b981; text-transform: uppercase; letter-spacing: 0.5px;">Stap 4 van 5</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Het Domino-effect</h2>
                    </div>

                    <div class="stagger-1" style="background: #ffffff; border-radius: 16px; padding: 32px 20px; text-align: center; border: 1px solid #e2e8f0; margin-bottom: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                        <div style="font-size: 64px; margin-bottom: 16px; letter-spacing: -5px;">🁣🁤🁥</div>
                        
                        <p style="font-size: 16px; color: #334155; line-height: 1.6; max-width: 500px; margin: 0 auto 24px auto;">
                            De mix van je genen, je opvoeding, de chemie in je brein en de omgeving die je opzocht, zorgde ervoor dat de <strong>dominostenen</strong> al in een rijtje stonden opgesteld. De kwetsbaarheid was er al.
                        </p>

                        <p style="font-size: 16px; color: #334155; line-height: 1.6; max-width: 500px; margin: 0 auto;">
                            Het is dan simpelweg wachten op de <strong>uitlokkende factor</strong>. Een stressvolle gebeurtenis, een intense periode, of simpelweg een overbelast zenuwstelsel. Dat is het kleine tikje dat de eerste dominosteen omver gooit, waarna de verslaving zich in gang zet.
                        </p>
                    </div>

                    <div class="stagger-2 info-block" style="border-left-color: #10b981; background: #f0fdf4; border-color: #bbf7d0; padding: 20px; margin-bottom: 32px; box-shadow: none;">
                        <h4 style="margin: 0 0 8px 0; color: #166534; font-size: 15px;">Wat betekent dit voor jou?</h4>
                        <p style="margin: 0; font-size: 14px; color: #15803d; line-height: 1.5;">
                            Je hebt je aanleg of de uitlokkende momenten uit je verleden niet zelf gekozen. Wat je <strong>wél</strong> kiest, is het inzicht dat je nu opdoet om de overgebleven dominostenen tegen te houden. Je brein is veranderbaar, en nieuwe gezonde patronen zijn aan te leren.
                        </p>
                    </div>

                    <div class="stagger-3 button-group" style="display: flex; justify-content: space-between;">
                        <button class="btn-secondary prev-step" data-prev="wat-step-3" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                        <button class="btn-primary next-step" data-next="wat-step-5" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">Coping & Overleven &rarr;</button>
                    </div>
                </div>
            </section>

            <!-- STAP 5: COPING MECHANISMEN -->
            <section class="wizard-step" id="wat-step-5" style="display: none;">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 12px; font-weight: 600; color: #ec4899; text-transform: uppercase; letter-spacing: 0.5px;">Stap 5 van 5</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Verslaving als overlevingsmechanisme</h2>
                        <p style="font-size: 15px; color: #475569;">Verslaving is in de basis een ongezond copingmechanisme. Hoe ga jij om met problemen?</p>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px;">
                        <div class="stagger-1" style="background: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 20px; display: flex; gap: 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                            <span style="font-size: 28px; flex-shrink: 0;">⚔️</span>
                            <div>
                                <h4 style="margin: 0 0 6px 0; color: #1e293b; font-size: 16px;">Vechten</h4>
                                <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.5;">Dit is niet per se letterlijk vechten. Het betekent: de schouders eronder zetten, plannen maken en het probleem actief aanpakken. Dit doe je als je denkt het probleem op te kunnen lossen.</p>
                            </div>
                        </div>

                        <div class="stagger-2" style="background: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid #10b981; border-radius: 8px; padding: 20px; display: flex; gap: 16px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                            <span style="font-size: 28px; flex-shrink: 0;">🏃‍♂️</span>
                            <div>
                                <h4 style="margin: 0 0 6px 0; color: #1e293b; font-size: 16px;">Vluchten</h4>
                                <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.5;">Letterlijk vluchten bij gevaar, maar ook: verhuizen, een ongezonde relatie beëindigen, of van werkplek veranderen. Biedt oplossingen wanneer een probleem onoplosbaar lijkt en er wél alternatieven zijn.</p>
                            </div>
                        </div>

                        <div class="stagger-3" style="background: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 20px; display: flex; gap: 16px; box-shadow: 0 2px 4px rgba(59,130,246,0.1);">
                            <span style="font-size: 28px; flex-shrink: 0;">🧊</span>
                            <div>
                                <h4 style="margin: 0 0 6px 0; color: #1e40af; font-size: 16px;">Bevriezen</h4>
                                <p style="margin: 0; font-size: 14px; color: #1e3a8a; line-height: 1.5;">Je laat het probleem passief aan je voorbij gaan. Je opent de post niet meer of blijft in bed liggen. Dit kies je (onbewust) als een probleem onoplosbaar lijkt én er geen alternatieven zijn.</p>
                            </div>
                        </div>
                    </div>

                    <div class="stagger-4" style="background: #1e293b; color: #f8fafc; padding: 24px; border-radius: 12px; margin-bottom: 32px; text-align: center;">
                        <p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.6;">
                            <strong>Verslaving is bij uitstek een vorm van bevriezen.</strong> Je trekt je terug in een bubbel met ${tData.middel} en vermijdt het nadenken over de problemen.
                        </p>
                        <div style="background: #3b82f6; padding: 12px; border-radius: 8px; display: inline-block;">
                            <span style="font-weight: 700; font-size: 15px;">Het doel van herstel:</span>
                            <span style="display: block; font-size: 14px; margin-top: 4px;">Problemen weer oplossen door middel van <em>vechten</em> of <em>vluchten</em> in plaats van bevriezen. Keuzes maken en de confrontatie aangaan!</span>
                        </div>
                    </div>

                    <div class="stagger-5 button-group" style="display: flex; justify-content: space-between;">
                        <button class="btn-secondary prev-step" data-prev="wat-step-4" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                        <button class="btn-primary" id="btn-finish-wat" style="background-color: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">Module Afronden 🎉</button>
                    </div>
                </div>
            </section>

            <!-- STAP 6: AFRONDING -->
            <section class="wizard-step" id="wat-step-6" style="display: none;">
                <div style="max-width: 600px; margin: 40px auto; padding: 32px; font-family: inherit; text-align: center; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                    <div class="stagger-1">
                        <div style="font-size: 64px; margin-bottom: 16px;">🧠</div>
                        <h2 style="font-size: 24px; color: #1e293b; margin-bottom: 16px;">Kennis is Kracht</h2>
                        <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 32px; max-width: 450px; margin-left: auto; margin-right: auto;">
                            Je snapt nu beter hoe de dominostenen van afhankelijkheid werken en dat verslaving in de kern een overlevingsstrategie is. Met deze wetenschap ben je bewapend om straks weer zelf de regie te pakken en de confrontatie aan te gaan!
                        </p>
                    </div>
                    <div class="stagger-2">
                        <button type="button" id="btn-back-dashboard" style="background-color: #2563eb; color: white; border: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 15px; transition: background 0.2s;">
                            Terug naar overzicht
                        </button>
                    </div>
                </div>
            </section>
        </div>
    `;

    container.innerHTML = htmlContent;

    // --- EVENT LISTENERS (Event Delegation) ---
    const containerEl = document.querySelector('.watisverslaving-container');
    if (containerEl) {
        containerEl.addEventListener('click', (e) => {
            // Navigatie Knoppen
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
            
            // Afronden
            const finishBtn = e.target.closest('#btn-finish-wat');
            if (finishBtn) {
                triggerConfetti();
                showStep('wat-step-6');
                return;
            }
            const backDashBtn = e.target.closest('#btn-back-dashboard');
            if (backDashBtn) {
                if (typeof onComplete === 'function') onComplete();
                return;
            }

            // Checkbox Interactie (Stap 1)
            const checkCard = e.target.closest('.check-card');
            if (checkCard) {
                const id = checkCard.getAttribute('data-id');
                if (savedData.herkendeKenmerken.includes(id)) {
                    savedData.herkendeKenmerken = savedData.herkendeKenmerken.filter(k => k !== id);
                    checkCard.classList.remove('active');
                } else {
                    savedData.herkendeKenmerken.push(id);
                    checkCard.classList.add('active');
                }
                localStorage.setItem(lsKey, JSON.stringify(savedData));
                return;
            }

            // Accordeon Interactie (Stap 3)
            const accordionHeader = e.target.closest('.accordion-header');
            if (accordionHeader) {
                const card = accordionHeader.parentElement;
                containerEl.querySelectorAll('.accordion-card').forEach(c => {
                    if (c !== card) c.classList.remove('open');
                });
                card.classList.toggle('open');
                return;
            }
        });
    }

    function showStep(stepId) {
        window.scrollTo(0, 0);
        
        const steps = containerEl.querySelectorAll('.wizard-step');
        steps.forEach(step => {
            step.style.display = 'none';
            step.classList.remove('active');
        });
        
        const targetStep = containerEl.querySelector(`#${stepId}`);
        if (targetStep) {
            targetStep.style.display = 'block';
            targetStep.classList.add('active');
        }

        // Voortgangsbalk updaten
        const progressBarContainer = containerEl.querySelector('.progress-bar-container');
        const progressBar = containerEl.querySelector('#wat-progress-bar');
        
        if (stepId === 'wat-step-6') {
            if (progressBarContainer) progressBarContainer.style.display = 'none';
        } else {
            if (progressBarContainer) progressBarContainer.style.display = 'block';
            if (progressBar) {
                if (stepId === 'wat-step-intro') progressBar.style.width = '16%';
                else if (stepId === 'wat-step-1') progressBar.style.width = '32%';
                else if (stepId === 'wat-step-2') progressBar.style.width = '48%';
                else if (stepId === 'wat-step-3') progressBar.style.width = '64%';
                else if (stepId === 'wat-step-4') progressBar.style.width = '80%';
                else if (stepId === 'wat-step-5') progressBar.style.width = '100%';
            }
        }
    }
}