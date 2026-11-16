// src/components/modules/anatomie-van-trek/anatomie-van-trek.js

function loadCSS() {
    const cssUrl = new URL('./anatomie-van-trek.css', import.meta.url).href;
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

export function renderAnatomieVanTrek(containerElement, onComplete) {
    loadCSS();
    window.scrollTo(0, 0);

    const container = containerElement || document.getElementById('app-content');
    if (!container) return;

    const savedCheck = localStorage.getItem('arminius_trek_begrepen') === 'true';
    const actiefTraject = localStorage.getItem('actieveVerslaving') || 'alcohol';
    
    let actieWerkwoord = 'gebruiken';
    let actieWerkwoordJe = 'gebruikt'; 
    let middelNaam = 'middelen';
    
    if (actiefTraject === 'alcohol') {
        actieWerkwoord = 'drinken';
        actieWerkwoordJe = 'drinkt';
        middelNaam = 'alcohol';
    } else if (actiefTraject === 'cannabis') {
        actieWerkwoord = 'blowen';
        actieWerkwoordJe = 'blowt';
        middelNaam = 'wiet';
    } else if (actiefTraject === 'cocaine') {
        actieWerkwoord = 'gebruiken';
        actieWerkwoordJe = 'gebruikt';
        middelNaam = 'cocaïne';
    } else if (actiefTraject === 'gokken') {
        actieWerkwoord = 'gokken';
        actieWerkwoordJe = 'gokt';
        middelNaam = 'gokspellen';
    }

    const htmlContent = `
        <div class="module-container anatomie-container">
            <style>
                @keyframes slideUpFade { 0% { opacity: 0; transform: translateY(15px); } 100% { opacity: 1; transform: translateY(0); } }
                .stagger-1 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.1s; }
                .stagger-2 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.2s; }
                .stagger-3 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.3s; }
                .stagger-4 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.4s; }
                
                .info-block { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                .info-block-border-blue { border-left: 4px solid #3b82f6; }
                .info-block-border-orange { border-left: 4px solid #f59e0b; }
                .info-block-border-red { border-left: 4px solid #ef4444; }
                .info-block-border-purple { border-left: 4px solid #8b5cf6; }
            </style>

            <div class="progress-bar-container" style="background: #e2e8f0; height: 6px; border-radius: 3px; margin-bottom: 24px; overflow: hidden; max-width: 700px; margin-left: auto; margin-right: auto;">
                <div class="progress-bar" id="trek-progress-bar" style="width: 25%; background: #2563eb; height: 100%; transition: width 0.4s ease-out;"></div>
            </div>

            <!-- STAP 0: INTRODUCTIE -->
            <section class="wizard-step active" id="trek-step-intro" style="display: block;">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 32px;">
                        <span style="font-size: 12px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Psycho-educatie</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">De anatomie van trek</h2>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">
                        <div class="stagger-1 info-block info-block-border-blue">
                            <span style="font-size: 24px; display: block; margin-bottom: 8px;">🧠</span>
                            <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                                <strong>Een oncontroleerbare drang.</strong> Trek (ook wel 'zucht' genoemd) kan je plotseling overvallen en voelt vaak overweldigend. Het lijkt alsof je lichaam het overneemt.
                            </p>
                        </div>
                        <div class="stagger-2 info-block info-block-border-orange">
                            <span style="font-size: 24px; display: block; margin-bottom: 8px;">💡</span>
                            <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                                <strong>Voorspelbaar mechanisme.</strong> Hoe willekeurig het ook voelt, trek ontstaat via een zeer logisch en voorspelbaar patroon in je hersenen.
                            </p>
                        </div>
                        <div class="stagger-3 info-block info-block-border-purple">
                            <span style="font-size: 24px; display: block; margin-bottom: 8px;">🏄‍♂️</span>
                            <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                                In deze module ontleden we de reflex van trek, en leren we je de theorie van 'Urge Surfing' (het uitzitten van de golf).
                            </p>
                        </div>
                    </div>

                    <div class="stagger-4 button-group" style="display: flex; justify-content: flex-end;">
                        <button type="button" class="btn-primary next-step" data-next="trek-step-1" style="background-color: #2563eb; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 15px;">Start de uitleg &rarr;</button>
                    </div>
                </div>
            </section>

            <!-- STAP 1: DE REFLEX -->
            <section class="wizard-step" id="trek-step-1" style="display: none;">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 12px; font-weight: 600; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.5px;">Stap 1 van 3</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Een aangeleerde reflex</h2>
                    </div>

                    <div class="info-block info-block-border-blue stagger-1">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                            <span style="font-size: 24px;">🔗</span>
                            <h4 style="font-size: 18px; margin: 0; color: #1e293b;">De associatie in je brein</h4>
                        </div>
                        <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 12px;">Misschien heb je wel eens gehoord van het experiment met de hond van Pavlov. Bij dit experiment liet dr. Pavlov een belletje rinkelen telkens wanneer de hond eten kreeg. Na verloop van tijd was het geluid van het belletje alleen al genoeg om de hond te laten kwijlen, zelfs als er géén eten was.</p>
                        <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 12px;">Jouw brein werkt precies hetzelfde. Als jij bijvoorbeeld vaak na een drukke dag bent gaan ${actieWerkwoord} om te ontspannen, koppelt je brein de drukke dag en het ${actieWerkwoord} aan elkaar. Zodra je nu een drukke dag hebt (het 'belletje'), krijg je automatisch trek om te ${actieWerkwoord}.</p>
                        
                        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 8px; margin-top: 24px;">
                            <p style="margin: 0; font-size: 14px; color: #1e40af; line-height: 1.6;"><strong>Belangrijk:</strong> Trek hebben is dus geen zwakte, het is simpelweg een associatie die je brein heeft gemaakt. Trek is dus vooral een <strong>lichamelijke reactie op de situatie</strong>. Verander je de situatie, dan zal de trek ook minder worden.</p>
                        </div>
                    </div>

                    <div class="stagger-2 button-group" style="display: flex; justify-content: space-between; margin-top: 24px;">
                        <button class="btn-secondary prev-step" data-prev="trek-step-intro" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                        <button class="btn-primary next-step" data-next="trek-step-2" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">Volgende &rarr;</button>
                    </div>
                </div>
            </section>

            <!-- STAP 2: DE TREKGOLF -->
            <section class="wizard-step" id="trek-step-2" style="display: none;">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 12px; font-weight: 600; color: #ef4444; text-transform: uppercase; letter-spacing: 0.5px;">Stap 2 van 3</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">De Trekgolf (Urge Surfing)</h2>
                    </div>

                    <div class="info-block info-block-border-red stagger-1">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                            <span style="font-size: 24px;">🌊</span>
                            <h4 style="font-size: 18px; margin: 0; color: #1e293b;">Surfen op de drang</h4>
                        </div>
                        <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 12px;">Als je trek ervaart, voelt het vaak alsof de drang oneindig blijft stijgen totdat je eraan toegeeft. Je brein vertelt je dat het gevoel ondragelijk wordt. <strong>Dit is een illusie.</strong></p>
                        <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 12px;">Trek werkt als een golf. Het zwelt aan, bereikt een piek en ebt daarna vanzelf weer weg, zelfs als je er <em>niet</em> aan toegeeft. Door dit uit te zitten train je je brein dat de drang ook zonder gebruik weer verdwijnt.</p>
                        
                        <!-- De geanimeerde Wave SVG -->
                        <div class="wave-graphic stagger-2">
                            <span class="wave-label start">Prikkel</span>
                            <span class="wave-label peak">Piekmoment (20-30 min.)</span>
                            <span class="wave-label end">Rust</span>
                            <div class="wave-svg-wrapper">
                                <svg viewBox="0 0 1000 100" preserveAspectRatio="none" class="traveling-wave-svg">
                                    <path class="traveling-wave-path" vector-effect="non-scaling-stroke">
                                        <!-- Animatie: de bult beweegt van links naar rechts over de lijn -->
                                        <animate 
                                            attributeName="d" 
                                            dur="6s" 
                                            repeatCount="indefinite"
                                            keyTimes="0; 0.25; 0.5; 0.75; 1"
                                            values="
                                                M 0 80 L 0 80 C 10 80, 25 80, 50 80 C 75 80, 90 80, 100 80 L 1000 80;
                                                M 0 80 L 100 80 C 150 80, 200 50, 250 50 C 300 50, 350 80, 400 80 L 1000 80;
                                                M 0 80 L 300 80 C 380 80, 440 20, 500 20 C 560 20, 620 80, 700 80 L 1000 80;
                                                M 0 80 L 600 80 C 650 80, 700 50, 750 50 C 800 50, 850 80, 900 80 L 1000 80;
                                                M 0 80 L 900 80 C 910 80, 925 80, 950 80 C 975 80, 990 80, 1000 80 L 1000 80
                                            "
                                        />
                                    </path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="stagger-3 button-group" style="display: flex; justify-content: space-between; margin-top: 24px;">
                        <button class="btn-secondary prev-step" data-prev="trek-step-1" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                        <button class="btn-primary next-step" data-next="trek-step-3" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">Volgende &rarr;</button>
                    </div>
                </div>
            </section>

            <!-- STAP 3: TOLERANTIE & CHECKBOX -->
            <section class="wizard-step" id="trek-step-3" style="display: none;">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 12px; font-weight: 600; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.5px;">Stap 3 van 3</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Gewenning (Tolerantie)</h2>
                    </div>

                    <div class="info-block info-block-border-orange stagger-1">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                            <span style="font-size: 24px;">📈</span>
                            <h4 style="font-size: 18px; margin: 0; color: #1e293b;">Steeds meer nodig</h4>
                        </div>
                        <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 12px;">Wanneer je herhaaldelijk ${actieWerkwoordJe}, komt er steeds een grote hoeveelheid dopamine vrij. Je brein wordt dan geleidelijk ongevoeliger voor deze dopamine. Hierdoor heb je na verloop van tijd steeds méér ${middelNaam} nodig om hetzelfde positieve effect te bereiken.</p>
                        <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 12px;">Omdat je brein ongevoeliger wordt voor dopamine, geniet je waarschijnlijk ook minder van gezonde bronnen van dopamine, zoals sport, lekker eten of sociaal contact.</p>
                        <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 0;">Wees gerust: als het je lukt om een aantal weken (bijna) te stoppen met ${actieWerkwoord}, zal je brein weer gevoeliger worden voor dopamine en zul je alledaagse bezigheden weer leuker gaan vinden.</p>
                    </div>
                    
                    <div class="trek-insight stagger-2">
                        <label class="trek-insight-check">
                            <input type="checkbox" id="check-begrepen" ${savedCheck ? 'checked' : ''}>
                            <span class="trek-insight-text">
                                Ik begrijp dat trek een natuurlijke reflex is, en dat het gevoel vanzelf weer wegebt als ik het weet uit te zitten.
                            </span>
                        </label>
                    </div>

                    <div class="stagger-3 button-group" style="display: flex; justify-content: space-between; margin-top: 24px;">
                        <button class="btn-secondary prev-step" data-prev="trek-step-2" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                        <button class="btn-primary" id="btn-finish-trek" style="background-color: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; transition: opacity 0.2s;" ${savedCheck ? '' : 'disabled'}>
                            Module Afronden 🎉
                        </button>
                    </div>
                </div>
            </section>

            <!-- STAP 4: AFRONDING -->
            <section class="wizard-step" id="trek-step-finish" style="display: none;">
                <div style="max-width: 600px; margin: 40px auto; padding: 32px; font-family: inherit; text-align: center; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                    <div class="stagger-1">
                        <div style="font-size: 64px; margin-bottom: 16px;">🧠</div>
                        <h2 style="font-size: 24px; color: #1e293b; margin-bottom: 16px;">Kennis is Kracht</h2>
                        <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 32px; max-width: 450px; margin-left: auto; margin-right: auto;">
                            Je weet nu dat trek een voorspelbare, tijdelijke golf is. De volgende keer dat je die golf voelt aankomen, weet je dat je hem niet hoeft te gehoorzamen, maar dat je hem gewoon kunt uitzitten.
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

    // --- EVENT LISTENERS ---
    const containerEl = document.querySelector('.anatomie-container');
    if (containerEl) {
        
        // Checkbox validatie (om afronden knop te enablen)
        const checkBegrepen = containerEl.querySelector('#check-begrepen');
        const finishBtn = containerEl.querySelector('#btn-finish-trek');
        if (checkBegrepen && finishBtn) {
            // Check direct bij inladen (als hij al in localstorage stond)
            finishBtn.style.opacity = checkBegrepen.checked ? '1' : '0.5';

            checkBegrepen.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                localStorage.setItem('arminius_trek_begrepen', isChecked);
                finishBtn.disabled = !isChecked;
                finishBtn.style.opacity = isChecked ? '1' : '0.5';
            });
        }

        // Navigatie via Event Delegation
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
            
            const afrondBtn = e.target.closest('#btn-finish-trek');
            if (afrondBtn && !afrondBtn.disabled) {
                triggerConfetti();
                showStep('trek-step-finish');
                return;
            }
            
            const backDashBtn = e.target.closest('#btn-back-dashboard');
            if (backDashBtn) {
                if (typeof onComplete === 'function') onComplete();
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

            // Forceer een herlading van de SVG in stap 2 zodat de animatie altijd netjes start
            if (stepId === 'trek-step-2') {
                const svgWrapper = targetStep.querySelector('.wave-svg-wrapper');
                if (svgWrapper) {
                    svgWrapper.innerHTML = svgWrapper.innerHTML;
                }
            }
        }

        // Progress bar updaten
        const progressBarContainer = containerEl.querySelector('.progress-bar-container');
        const progressBar = containerEl.querySelector('#trek-progress-bar');
        
        if (stepId === 'trek-step-finish') {
            if (progressBarContainer) progressBarContainer.style.display = 'none';
        } else {
            if (progressBarContainer) progressBarContainer.style.display = 'block';
            if (progressBar) {
                if (stepId === 'trek-step-intro') progressBar.style.width = '25%';
                else if (stepId === 'trek-step-1') progressBar.style.width = '50%';
                else if (stepId === 'trek-step-2') progressBar.style.width = '75%';
                else if (stepId === 'trek-step-3') progressBar.style.width = '100%';
            }
        }
    }
}