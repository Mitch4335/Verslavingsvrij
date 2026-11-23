// src/components/modules/dopamine/dopamine.js
import { getActiveData } from '../../../data/contentManager.js';

function loadCSS() {
    const cssUrl = new URL('./dopamine.css', import.meta.url).href;
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

export function renderDopamineModule(onComplete) {
    window.scrollTo(0, 0);
    
    loadCSS();
    const currentData = getActiveData();
    const term = currentData.terminologie;

    const htmlContent = `
        <div class="module-container dopamine-container">
            <style>
                @keyframes slideUpFade { 0% { opacity: 0; transform: translateY(15px); } 100% { opacity: 1; transform: translateY(0); } }
                .stagger-1 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.1s; }
                .stagger-2 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.2s; }
                .stagger-3 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.3s; }
                .stagger-4 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.4s; }
                
                .dopamine-container {
                    box-sizing: border-box;
                    max-width: 100%;
                    overflow-x: hidden;
                }

                .info-block, .g-schema-container, .dopamine-chart {
                    box-sizing: border-box;
                    max-width: 100%;
                }

                .info-block { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); overflow-x: hidden; }
                .info-block-border-blue { border-left: 4px solid #3b82f6; }
                .info-block-border-orange { border-left: 4px solid #f59e0b; }
                .info-block-border-green { border-left: 4px solid #10b981; }
                .info-block-border-red { border-left: 4px solid #ef4444; }
                .info-block-border-purple { border-left: 4px solid #8b5cf6; }

                .dopa-list {
                    margin: 0 0 16px 20px;
                    padding: 0;
                    color: #334155;
                    font-size: 15px;
                    line-height: 1.6;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                @media (max-width: 600px) {
                    .dopa-list {
                        font-size: var(--mobiel-tekstformaat, 16.5px);
                        line-height: 1.55;
                        color: #1e293b;
                    }
                }

                /* Standaard (mobiel): verticaal onder elkaar */
                .g-schema-container {
                    padding: 16px 12px !important;
                }
                .g-schema-flow {
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                    gap: 8px !important;
                }
                .schema-node {
                    width: 100% !important;
                    max-width: 240px !important;
                    box-sizing: border-box !important;
                    text-align: center !important;
                }
                .schema-arrow {
                    transform: rotate(90deg) !important;
                    margin: 2px 0 !important;
                }
                .schema-feedback .feedback-line {
                    display: none !important;
                }
                .schema-feedback .feedback-text {
                    white-space: normal !important;
                    text-align: center !important;
                    margin-top: 12px !important;
                    font-size: 14px !important;
                }

                /* Laptop / desktop (vanaf 768px): horizontaal naast elkaar */
                @media (min-width: 768px) {
                    .info-block {
                        padding: 24px;
                    }
                    .g-schema-flow {
                        flex-direction: row !important;
                        justify-content: center !important;
                        gap: 12px !important;
                    }
                    .schema-node {
                        width: auto !important;
                        max-width: none !important;
                    }
                    .schema-arrow {
                        transform: none !important;
                        margin: 0 !important;
                    }
                    .schema-feedback .feedback-line {
                        display: block !important;
                    }
                }
            </style>

            <div class="progress-bar-container">
                <div class="progress-bar" id="dopamine-progress-bar" style="width: 20%; transition: width 0.3s ease;"></div>
            </div>

            <!-- STAP 0: INTRODUCTIE -->
            <section class="wizard-step active" id="dopa-step-intro" style="display: block;">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 32px;">
                        <span style="font-size: 14px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Module Introductie</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Je brein en dopamine</h2>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">
                        <div class="stagger-1 info-block info-block-border-blue" style="margin-bottom: 0;">
                            <span style="font-size: 24px; display: block; margin-bottom: 8px;">🧠</span>
                            <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                                <strong>De biologische motor.</strong> Veranderen heeft alles te maken met hoe ons brein werkt. In deze module leggen we je uit wat er precies in je hoofd gebeurt wanneer je de neiging voelt om te ${term.werkwoord}.
                            </p>
                        </div>
                        <div class="stagger-2 info-block info-block-border-orange" style="margin-bottom: 0;">
                            <span style="font-size: 24px; display: block; margin-bottom: 8px;">🔄</span>
                            <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                                <strong>Logische reactie.</strong> We kijken hierbij specifiek naar <strong>dopamine</strong>: de stof in onze hersenen die ons motiveert en gedrag stuurt.
                            </p>
                        </div>
                        <div class="stagger-3 info-block info-block-border-green" style="margin-bottom: 0;">
                            <span style="font-size: 24px; display: block; margin-bottom: 8px;">💡</span>
                            <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                                <strong>Geen zwakte.</strong> Door dit te begrijpen, zul je ontdekken dat trek en sterke gewoontes geen tekenen van zwakte zijn, maar een logisch fysiologisch proces.
                            </p>
                        </div>
                    </div>

                    <div class="stagger-4 button-group" style="display: flex; justify-content: flex-end;">
                        <button type="button" class="btn-primary next-step" data-next="dopa-step-1" style="background-color: #2563eb; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 15px;">Start de uitleg &rarr;</button>
                    </div>
                </div>
            </section>

            <!-- STAP 1: DE MOTIVATOR EN EVOLUTIE -->
            <section class="wizard-step" id="dopa-step-1" style="display: none;">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 14px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Stap 1 van 4</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">De motor van ons gedrag</h2>
                    </div>

                    <div class="info-block info-block-border-blue stagger-1">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                            <span style="font-size: 22px;">🔋</span>
                            <h4 style="font-size: 18px; margin: 0; color: #1e293b;">Dopamine is een motivator</h4>
                        </div>
                        <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0 0 10px 0;"><strong>Dopamine is een stof in je hersenen die zorgt voor een gevoel van beloning en plezier.</strong></p>
                        <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0;">Daarom noemen we het vaak een 'beloningsstofje'. De belangrijkste functie is echter <strong>motivatie</strong>: het spoort je aan om gedrag dat goed voelt, nog eens te herhalen.</p>
                    </div>

                    <div class="info-block info-block-border-green stagger-2">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                            <span style="font-size: 22px;">🍽️</span>
                            <h4 style="font-size: 18px; margin: 0; color: #1e293b;">Een voorbeeld uit het dagelijks leven</h4>
                        </div>
                        <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0 0 10px 0;">Stel, je gaat naar een restaurant met vrienden. Je kletst, eet lekker en hebt een fijne avond.</p>
                        <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0;">Je brein maakt dopamine aan en slaat dat op in je geheugen. Daardoor raak je gemotiveerd om dit in de toekomst vaker te doen.</p>
                    </div>

                    <div class="info-block stagger-3" style="background: #f8fafc; border-left: 4px solid #64748b;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <span style="font-size: 22px;">🧬</span>
                            <h4 style="font-size: 17px; margin: 0; color: #1e293b;">Slim overlevingsmechanisme</h4>
                        </div>
                        <p style="margin: 0; font-size: 15px; color: #475569; line-height: 1.6;">Evolutionair gezien is dit heel belangrijk: ons brein beloont gedrag dat gezond is voor onszelf en ons voortbestaan — zoals eten, drinken, beweging, sociaal contact en seksualiteit.</p>
                    </div>

                    <div class="stagger-4 button-group" style="display: flex; justify-content: space-between; margin-top: 24px;">
                        <button type="button" class="btn-secondary prev-step" data-prev="dopa-step-intro" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Terug</button>
                        <button type="button" class="btn-primary next-step" data-next="dopa-step-2" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">Hoe werkt dit bij verslaving? &rarr;</button>
                    </div>
                </div>
            </section>

            <!-- STAP 2: DE KOPPELING EN DE TSUNAMI -->
            <section class="wizard-step" id="dopa-step-2" style="display: none;">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 14px; font-weight: 600; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.5px;">Stap 2 van 4</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Een ijzersterke koppeling</h2>
                    </div>

                    <div class="info-block info-block-border-orange stagger-1">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                            <span style="font-size: 22px;">🔄</span>
                            <h4 style="font-size: 18px; margin: 0; color: #1e293b;">Leren en herhalen</h4>
                        </div>
                        <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0 0 20px 0;">
                            Dit leerproces werkt als een kettingreactie: een <strong>situatie</strong> leidt tot <strong>gedrag</strong>, wat zorgt voor een belonend <strong>gevolg</strong>. Je geheugen slaat die koppeling direct op.
                        </p>

                        <div class="g-schema-container">
                            <div class="g-schema-flow">
                                <div class="schema-node node-situatie">
                                    <span class="node-title">Situatie</span>
                                    <span class="node-sub">(bijv. stress of<br>gezelligheid)</span>
                                </div>
                                <div class="schema-arrow">➔</div>
                                <div class="schema-node node-gedrag">
                                    <span class="node-title">Gedrag</span>
                                    <span class="node-sub">(${term.werkwoord})</span>
                                </div>
                                <div class="schema-arrow">➔</div>
                                <div class="schema-node node-gevolg">
                                    <span class="node-title">Gevolg</span>
                                    <span class="node-sub">(dopamine-piek)</span>
                                </div>
                            </div>
                            <div class="schema-feedback">
                                <div class="feedback-line"></div>
                                <div class="feedback-text">🧠 Geheugen slaat de koppeling op ↩️</div>
                            </div>
                        </div>
                    </div>

                    <div class="info-block info-block-border-orange stagger-2">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                            <span style="font-size: 22px;">⚡</span>
                            <h4 style="font-size: 18px; margin: 0; color: #1e293b;">Hoe middelen dit systeem kapen</h4>
                        </div>
                        <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0 0 12px 0;">Middelen (of gokken) maken een veel diepere indruk dan natuurlijk gedrag, omdat ze op drie manieren heftiger werken:</p>
                        <ul class="dopa-list">
                            <li><strong>Sterker:</strong> een onnatuurlijk grote explosie van dopamine.</li>
                            <li><strong>Sneller:</strong> het belonende effect is vrijwel direct merkbaar.</li>
                            <li><strong>Gemakkelijker:</strong> je hoeft er nauwelijks moeite voor te doen (je pakt het simpelweg, zonder eerst te hoeven sporten).</li>
                        </ul>

                        <div class="dopamine-chart">
                            <div class="bar-row">
                                <span class="bar-label">Normaal (sporten/eten)</span>
                                <div class="bar-track"><div class="bar-fill bar-normal"></div></div>
                            </div>
                            <div class="bar-row">
                                <span class="bar-label" style="text-transform: capitalize;">${term.werkwoord}</span>
                                <div class="bar-track"><div class="bar-fill bar-spike"></div></div>
                            </div>
                        </div>
                    </div>

                    <div class="info-block info-block-border-red stagger-3" style="background: #fef2f2; border-color: #fca5a5; border-left-color: #ef4444;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <span style="font-size: 22px;">🛡️</span>
                            <h4 style="font-size: 17px; margin: 0; color: #991b1b;">Waarom alles tijdelijk vlak voelt</h4>
                        </div>
                        <p style="margin: 0 0 10px 0; font-size: 15px; color: #991b1b; line-height: 1.6;">Om zichzelf te beschermen tegen deze enorme dopamine-explosie, schakelt je brein tijdelijk een deel van zijn eigen dopamine-ontvangers uit.</p>
                        <p style="margin: 0; font-size: 15px; color: #991b1b; line-height: 1.6;">Alledaagse dingen leveren daardoor opeens te weinig dopamine op. <strong>Alles voelt tijdelijk saai of vlak.</strong></p>
                    </div>

                    <div class="stagger-4 button-group" style="display: flex; justify-content: space-between; margin-top: 24px;">
                        <button type="button" class="btn-secondary prev-step" data-prev="dopa-step-1" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                        <button type="button" class="btn-primary next-step" data-next="dopa-step-3" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">Volgende &rarr;</button>
                    </div>
                </div>
            </section>

            <!-- STAP 3: HET SNOEPWINKEL EFFECT (TREK) -->
            <section class="wizard-step" id="dopa-step-3" style="display: none;">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 14px; font-weight: 600; color: #8b5cf6; text-transform: uppercase; letter-spacing: 0.5px;">Stap 3 van 4</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Het 'Snoepwinkel-effect'</h2>
                    </div>

                    <div class="info-block info-block-border-purple stagger-1">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                            <span style="font-size: 22px;">🎬</span>
                            <h4 style="font-size: 18px; margin: 0; color: #1e293b;">Het filmpje begint te spelen</h4>
                        </div>
                        <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0 0 12px 0;">Door die hoge pieken wordt het ${term.werkwoord} na verloop van tijd een automatische gewoonte. Het speelt zich af als een filmpje in je hoofd, dat vaak al ruim vóór het daadwerkelijke gebruik start.</p>
                        <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0 0 8px 0;">Een specifieke situatie wekt de trek op. Die trigger kan twee vormen hebben:</p>
                        <ul class="dopa-list" style="margin-bottom: 0;">
                            <li><strong>Intern:</strong> een emotie of lichamelijk gevoel.</li>
                            <li><strong>Extern:</strong> een bepaalde tijd, plaats of persoon.</li>
                        </ul>
                    </div>

                    <div class="info-block info-block-border-purple stagger-2">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                            <span style="font-size: 22px;">🍬</span>
                            <h4 style="font-size: 18px; margin: 0; color: #1e293b;">Het 'kind in een snoepwinkel'-effect</h4>
                        </div>
                        <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0 0 10px 0;">Al direct na die situatie begint de dopamine te stijgen. Alleen de <strong>verwachting en voorpret</strong> zorgen al voor hevige trekgedachten en een sterke drang om te ${term.werkwoord}.</p>
                        <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0;">Vaak is die voorpret in je brein zelfs sterker dan de werkelijke beloning, waardoor het uiteindelijke effect weleens tegenvalt.</p>
                    </div>

                    <div class="info-block info-block-border-purple stagger-3">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                            <span style="font-size: 22px;">📈</span>
                            <h4 style="font-size: 18px; margin: 0; color: #1e293b;">De piek en de daling</h4>
                        </div>
                        <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0 0 20px 0;">Zodra je daadwerkelijk gaat ${term.werkwoord}, stijgt de dopamine nog even door tot een piek — waarna deze weer snel terugvalt naar het basisniveau.</p>

                        <div class="svg-graph-container">
                            <svg viewBox="0 0 400 220" width="100%" height="100%" style="overflow: visible;">
                                <line x1="40" y1="10" x2="40" y2="170" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
                                <line x1="40" y1="170" x2="380" y2="170" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>

                                <text x="-120" y="25" transform="rotate(-90)" fill="#64748b" font-size="14" font-weight="700" font-family="inherit" letter-spacing="1">Dopamine</text>

                                <line x1="120" y1="165" x2="120" y2="175" stroke="#94a3b8" stroke-width="3" />
                                <text x="120" y="195" fill="#475569" font-size="14" font-weight="700" font-family="inherit" text-anchor="middle">Situatie</text>

                                <line x1="240" y1="165" x2="240" y2="175" stroke="#94a3b8" stroke-width="3" />
                                <text x="240" y="195" fill="#475569" font-size="14" font-weight="700" font-family="inherit" text-anchor="middle">Gedrag</text>
                                <text x="240" y="212" fill="#64748b" font-size="12" font-weight="600" font-family="inherit" text-anchor="middle">(gebruik)</text>

                                <path d="M 40,140 L 120,140 L 240,80 L 280,20 L 320,140 L 380,140" fill="none" stroke="#ef4444" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="dopamine-animated-line" />

                                <circle cx="120" cy="140" r="5" fill="#ef4444" class="svg-data-point point-1" />
                                <circle cx="240" cy="80" r="5" fill="#ef4444" class="svg-data-point point-2" />
                                <circle cx="280" cy="20" r="5" fill="#ef4444" class="svg-data-point point-3" />
                                <circle cx="320" cy="140" r="5" fill="#ef4444" class="svg-data-point point-4" />
                            </svg>
                        </div>
                    </div>

                    <div class="stagger-4 button-group" style="display: flex; justify-content: space-between; margin-top: 24px;">
                        <button type="button" class="btn-secondary prev-step" data-prev="dopa-step-2" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                        <button type="button" class="btn-primary next-step" data-next="dopa-step-4" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">Hoe stopt dit? &rarr;</button>
                    </div>
                </div>
            </section>

            <!-- STAP 4: HERSTEL (NEUROPLASTICITEIT) -->
            <section class="wizard-step" id="dopa-step-4" style="display: none;">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 14px; font-weight: 600; color: #10b981; text-transform: uppercase; letter-spacing: 0.5px;">Stap 4 van 4</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Je brein is kneedbaar</h2>
                    </div>

                    <div class="info-block info-block-border-green stagger-1">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                            <span style="font-size: 22px;">🌱</span>
                            <h4 style="font-size: 18px; margin: 0; color: #1e293b;">Neuroplasticiteit: je brein herstelt</h4>
                        </div>
                        <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0 0 10px 0;">Het prachtige van ons brein is <strong>neuroplasticiteit</strong>: het brein past zich aan. Stop of minder je een tijdje met ${term.werkwoord}, dan merkt je brein dat de enorme dopamine-explosies wegblijven.</p>
                        <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0;">Langzaam zet het de dopamine-ontvangers weer aan. Het vlakke gevoel verdwijnt en je haalt weer oprecht plezier uit een simpele wandeling of hobby.</p>
                    </div>

                    <div class="info-block info-block-border-green stagger-2" style="background: #f0fdf4; border-color: #bbf7d0; border-left-color: #10b981;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <span style="font-size: 22px;">⏸️</span>
                            <h4 style="font-size: 17px; margin: 0; color: #166534;">Jouw wapen: het filmpje pauzeren</h4>
                        </div>
                        <p style="margin: 0 0 10px 0; font-size: 15px; color: #166534; line-height: 1.6;">Door in <strong>Registraties</strong> je situaties bij te houden, leer je precies welke interne en externe factoren jouw gewoonte opstarten.</p>
                        <p style="margin: 0; font-size: 15px; color: #166534; line-height: 1.6;">Herken je de voortekenen? Dan kun jij het 'filmpje' bewust op pauze zetten voordat je bij de piek uitkomt.</p>
                    </div>

                    <div class="stagger-3 button-group" style="display: flex; justify-content: space-between; margin-top: 24px;">
                        <button type="button" class="btn-secondary prev-step" data-prev="dopa-step-3" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                        <button type="button" class="btn-primary" id="btn-finish-dopamine" style="background-color: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">Module Afronden 🎉</button>
                    </div>
                </div>
            </section>

            <!-- STAP 5: AFRONDING & SUCCES -->
            <section class="wizard-step" id="dopa-step-5" style="display: none;">
                <div style="max-width: 600px; margin: 40px auto; padding: 32px; text-align: center; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                    <div style="font-size: 64px; margin-bottom: 16px; display: inline-block;">🧠</div>
                    <h2 style="font-size: 24px; color: #1e293b; margin-bottom: 12px;">Module Afgerond!</h2>
                    <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 32px;">
                        Geweldig! Je weet nu precies hoe jouw brein werkt en waarom trek een logische reactie is. Gebruik deze kennis om je gedrag in de praktijk te sturen. Veel succes!
                    </p>
                    <button type="button" id="btn-back-dashboard" style="background-color: #2563eb; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 15px; transition: background 0.2s;">
                        Terug naar overzicht
                    </button>
                </div>
            </section>
        </div>
    `;

    const appContainer = document.getElementById('app-content') || document.getElementById('app');
    if (appContainer) {
        appContainer.innerHTML = htmlContent;
    }

    const containerEl = document.querySelector('.dopamine-container');
    if (containerEl) {
        containerEl.addEventListener('click', (e) => {
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
            
            const finishBtn = e.target.closest('#btn-finish-dopamine');
            if (finishBtn) {
                triggerConfetti();
                showStep('dopa-step-5');
                return;
            }
            
            const backDashBtn = e.target.closest('#btn-back-dashboard');
            if (backDashBtn) {
                if (typeof onComplete === 'function') {
                    onComplete();
                }
            }
        });
    }
}

function showStep(stepId) {
    window.scrollTo(0, 0);

    const container = document.querySelector('.dopamine-container');
    if (!container) return;

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

    const progressBarContainer = container.querySelector('.progress-bar-container');
    const progressBar = container.querySelector('#dopamine-progress-bar');
    
    if (stepId === 'dopa-step-5') {
        if (progressBarContainer) progressBarContainer.style.display = 'none';
    } else {
        if (progressBarContainer) progressBarContainer.style.display = 'block';
        if (progressBar) {
            if (stepId === 'dopa-step-intro') progressBar.style.width = '20%';
            else if (stepId === 'dopa-step-1') progressBar.style.width = '40%';
            else if (stepId === 'dopa-step-2') progressBar.style.width = '60%';
            else if (stepId === 'dopa-step-3') progressBar.style.width = '80%';
            else if (stepId === 'dopa-step-4') progressBar.style.width = '100%';
        }
    }
}