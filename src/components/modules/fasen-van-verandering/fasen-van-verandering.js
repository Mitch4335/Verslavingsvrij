// src/components/modules/fasen-van-verandering/fasen-van-verandering.js

function loadFasenCSS() {
    const cssUrl = new URL('./fasen-van-verandering.css', import.meta.url).href;
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

const fasenData = {
    'ontkenning': {
        title: '1. Ontkenning (Voorfase)',
        text: 'Je ziet nog geen probleem. Anderen maken zich misschien zorgen of spreken adviezen uit, maar jij denkt: "Het valt wel mee, ik heb alles onder controle."',
        gym: 'Je sport niet en staat daar verder op dit moment ook niet bij stil. Voor jou is het prima zo.'
    },
    'overweging': {
        title: '2. Overweging',
        text: 'Je begint de nadelen van de huidige situatie in te zien, maar je ervaart ook nog steeds de voordelen. Je weegt de voor- en nadelen af, maar maakt nog geen keuze.',
        gym: 'Het is eind december en je blikt terug op het jaar. Je merkt dat je snel buiten adem bent op de trap en overweegt dat het misschien tijd wordt voor een goed voornemen om te gaan sporten.'
    },
    'voorbereiding': {
        title: '3. Voorbereiding',
        text: 'De kogel is door de kerk: je wilt veranderen. Je stelt doelen, maakt een plan en zoekt uit welke hulpmiddelen je nodig hebt.',
        gym: 'De knoop is doorgehakt: in het nieuwe jaar ga je ervoor! Je zoekt online naar de beste sportschool in de buurt en koopt alvast nieuwe sportkleding.'
    },
    'actie': {
        title: '4. Actie',
        text: 'Je bent daadwerkelijk je gedrag aan het aanpassen. Dit kost veel energie, focus en bewuste keuzes maken om niet toe te geven aan de trek.',
        gym: 'Het is januari en je hebt je abonnement afgesloten. Je gaat fanatiek 3 keer per week naar de sportschool. Het kost in het begin best wat discipline om die sporttas steeds in te pakken.'
    },
    'volhouden': {
        title: '5. Volhouden',
        text: 'Het nieuwe gedrag wordt een vaste gewoonte en kost steeds minder moeite. Uiteindelijk kost het helemaal geen bewuste energie meer; je \'verlaat\' als het ware deze cirkel.',
        gym: 'Na een lange tijd is sporten zo\'n vast onderdeel van je leven geworden dat je niet beter weet. Het kost geen wilskracht meer; je bent nu gewoon een sporter.'
    },
    'terugval': {
        title: 'Terugval (Leermoment)',
        text: 'Je valt (tijdelijk) terug in oud gedrag. Dit voelt vaak als falen, maar is het absoluut niet. Je overziet wat er misging, scherpt je plan aan en stapt gewoon weer in de cyclus.',
        gym: 'Je krijgt het erg druk op werk of gaat op vakantie, waardoor je een paar weken niet gaat. Je raakt in verval, cancelt misschien zelfs je abonnement... totdat je het een tijd later gewoon weer opnieuw oppakt.'
    }
};

const feedbackBerichten = {
    'Ontkenning': '<strong>Bedankt voor je eerlijkheid.</strong> Het is helemaal oké als je nu nog geen behoefte voelt om iets aan te passen. Een tip: probeer de komende tijd je gebruik alleen te registreren in het logboek, puur om inzicht te krijgen zonder dat je al iets hóéft te veranderen.',
    'Overweging': '<strong>Goed dat je nadenkt over wat je zou kunnen veranderen in je gebruik.</strong> Een tip: neem nog eens de module \'Redenen voor verandering\' door en houd registraties bij om je te helpen bij het nemen van een beslissing.',
    'Voorbereiding': '<strong>Mooi dat de knoop is doorgehakt!</strong> Een goed begin is het halve werk. Kijk nog eens naar de modules \'Doelen stellen\' en \'Eerste stappen\' om een concreet en haalbaar plan voor jezelf te maken.',
    'Actie': '<strong>Goed dat je actief bezig bent met het aanpakken van je gebruik.</strong> Elke dag is er één. Hou vol, blijf je momenten registreren en wees trots op de stappen die je zet!',
    'Volhouden': '<strong>Wat ontzettend knap dat je dit al zo lang volhoudt.</strong> Het begint inmiddels een vaste gewoonte te worden. Blijf alert bij oude risicosituaties, maar geniet vooral van wat je al hebt bereikt. Ga zo door!',
    'Terugval': '<strong>Goed dat je er eerlijk over bent een stap terug te hebben gedaan.</strong> Dat vergt moed. Een tip: neem nog eens de module \'Redenen voor verandering\' door, houd registraties bij en stel in de module \'Doelen stellen\' een klein, haalbaar doel op voor jezelf.'
};

export function renderFasenVanVerandering(container, onComplete) {
    loadFasenCSS();
    window.scrollTo(0, 0);

    const savedFase = localStorage.getItem('arminius_huidige_fase') || '';

    const html = `
        <div class="module-container fase-container">
            <style>
                @keyframes slideUpFade { 0% { opacity: 0; transform: translateY(15px); } 100% { opacity: 1; transform: translateY(0); } }
                .stagger-1 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.1s; }
                .stagger-2 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.2s; }
                .stagger-3 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.3s; }
                
                .info-block { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                .info-block-border-blue { border-left: 4px solid #3b82f6; }
                .info-block-border-purple { border-left: 4px solid #8b5cf6; }
            </style>

            <div class="progress-bar-container" style="background: #e2e8f0; height: 6px; border-radius: 3px; margin-bottom: 24px; overflow: hidden;">
                <div class="progress-bar" id="fasen-progress-bar" style="width: 33%; background: #2563eb; height: 100%; transition: width 0.3s ease;"></div>
            </div>

            <!-- STAP 1: INTRODUCTIE -->
            <section class="wizard-step active" id="fase-step-intro">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 32px;">
                        <span style="font-size: 14px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Psycho-educatie</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">De Cyclus van Verandering</h2>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">
                        <div class="stagger-1 info-block info-block-border-blue">
                            <span style="font-size: 24px; display: block; margin-bottom: 8px;">🔄</span>
                            <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                                <strong>Geen rechte lijn.</strong> Gedrag veranderen verloopt vrijwel nooit in een rechte lijn van A naar B. Het is een cirkel die mensen vaak meerdere malen doorlopen voordat gewoontes definitief veranderen.
                            </p>
                        </div>
                        <div class="stagger-2 info-block info-block-border-purple">
                            <span style="font-size: 24px; display: block; margin-bottom: 8px;">🧭</span>
                            <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                                <strong>Inzicht in je proces.</strong> Door te ontdekken in welke fase je zit, begrijp je beter waarom bepaalde acties wel of niet lukken en wat je volgende logische stap is.
                            </p>
                        </div>
                    </div>

                    <div class="stagger-3 button-group" style="display: flex; justify-content: flex-end;">
                        <button type="button" class="btn-primary next-step" data-next="fase-step-interactive" style="background-color: #2563eb; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 15px;">Start de module &rarr;</button>
                    </div>
                </div>
            </section>

            <!-- STAP 2: INTERACTIEF WIEL & REFLECTIE -->
            <section class="wizard-step" id="fase-step-interactive" style="display: none;">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px;">
                    <div style="margin-bottom: 24px;">
                        <span style="font-size: 14px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Stap 2 van 2</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Ontdek de fasen</h2>
                        <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-top: 8px;">
                            Klik op de iconen in het wiel om te zien wat elke fase inhoudt. Bepaal daarna onderaan in welke fase jij je bevindt.
                        </p>
                    </div>

                    <div class="wheel-section">
                        <div class="wheel-wrapper">
                            <div class="wheel-node node-1 active" data-fase="ontkenning" title="Ontkenning">🙈</div>
                            <div class="wheel-node node-2" data-fase="overweging" title="Overweging">⚖️</div>
                            <div class="wheel-node node-3" data-fase="voorbereiding" title="Voorbereiding">🎯</div>
                            <div class="wheel-node node-4" data-fase="actie" title="Actie">🚀</div>
                            <div class="wheel-node node-5" data-fase="volhouden" title="Volhouden">🛡️</div>
                            <div class="wheel-node node-6 terugval" data-fase="terugval" title="Terugval">🔄</div>
                        </div>

                        <div class="fase-info-card" id="fase-info-card">
                            <h3 id="info-titel">${fasenData['ontkenning'].title}</h3>
                            <p id="info-tekst">${fasenData['ontkenning'].text}</p>
                            <div class="analogie-box">
                                <strong>🏋️‍♂️ Vergelijk het met sporten:</strong>
                                <span id="info-gym">${fasenData['ontkenning'].gym}</span>
                            </div>
                        </div>
                    </div>

                    <div class="fase-reflectie" style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
                        <h3 style="margin: 0 0 8px 0; font-size: 18px; color: #1e293b;">Waar sta jij nu?</h3>
                        <p style="margin: 0 0 20px 0; font-size: 14px; color: #64748b;">In welke fase van de cirkel bevind jij je op dit moment het meest?</p>
                        
                        <!-- AANGEPASTE KNOPPEN MET EMOJI'S -->
                        <div class="fase-select-grid" id="fase-select-grid">
                            <button type="button" class="fase-select-btn ${savedFase === 'Ontkenning' ? 'selected' : ''}" data-fase="Ontkenning">🙈 Ontkenning</button>
                            <button type="button" class="fase-select-btn ${savedFase === 'Overweging' ? 'selected' : ''}" data-fase="Overweging">⚖️ Overweging</button>
                            <button type="button" class="fase-select-btn ${savedFase === 'Voorbereiding' ? 'selected' : ''}" data-fase="Voorbereiding">🎯 Voorbereiding</button>
                            <button type="button" class="fase-select-btn ${savedFase === 'Actie' ? 'selected' : ''}" data-fase="Actie">🚀 Actie</button>
                            <button type="button" class="fase-select-btn ${savedFase === 'Volhouden' ? 'selected' : ''}" data-fase="Volhouden">🛡️ Volhouden</button>
                            <button type="button" class="fase-select-btn ${savedFase === 'Terugval' ? 'selected' : ''}" data-fase="Terugval">🔄 Terugval</button>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: space-between; margin-top: 32px;">
                        <button type="button" class="btn-secondary prev-step" data-prev="fase-step-intro" style="background-color: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                        <button type="button" id="btn-finish-fasen" style="background-color: #10b981; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 15px; opacity: ${savedFase ? '1' : '0.5'}; transition: opacity 0.2s;" ${savedFase ? '' : 'disabled'}>
                            Module Afronden 🎉
                        </button>
                    </div>
                </div>
            </section>

            <!-- STAP 3: AFRONDING & FEEDBACK -->
            <section class="wizard-step" id="fase-step-finish" style="display: none;">
                <div style="max-width: 600px; margin: 40px auto; padding: 32px; text-align: center; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                    <div style="font-size: 64px; margin-bottom: 16px; display: inline-block;">🔄</div>
                    <h2 style="font-size: 24px; color: #1e293b; margin-bottom: 12px;">Inzicht Opgeslagen!</h2>
                    <p id="fasen-feedback-text" style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 32px;"></p>
                    <button type="button" id="btn-back-dashboard" style="background-color: #2563eb; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 15px; transition: background 0.2s;">
                        Terug naar overzicht
                    </button>
                </div>
            </section>
        </div>
    `;

    container.innerHTML = html;

    // Wizard stap wisselaar logica
    function showStep(stepId) {
        window.scrollTo(0, 0);
        const steps = container.querySelectorAll('.wizard-step');
        steps.forEach(step => {
            step.style.display = (step.id === stepId) ? 'block' : 'none';
        });

        const progressBar = container.querySelector('#fasen-progress-bar');
        if (progressBar) {
            if (stepId === 'fase-step-intro') progressBar.style.width = '33%';
            else if (stepId === 'fase-step-interactive') progressBar.style.width = '66%';
            else if (stepId === 'fase-step-finish') {
                const barContainer = container.querySelector('.progress-bar-container');
                if (barContainer) barContainer.style.display = 'none';
            }
        }
    }

    container.addEventListener('click', (e) => {
        if (e.target.matches('.next-step')) {
            showStep(e.target.getAttribute('data-next'));
        }
        if (e.target.matches('.prev-step')) {
            showStep(e.target.getAttribute('data-prev'));
        }
    });

    // Wiel logica
    const wheelNodes = container.querySelectorAll('.wheel-node');
    const infoTitel = container.querySelector('#info-titel');
    const infoTekst = container.querySelector('#info-tekst');
    const infoGym = container.querySelector('#info-gym');

    wheelNodes.forEach(node => {
        node.addEventListener('click', () => {
            wheelNodes.forEach(n => n.classList.remove('active'));
            node.classList.add('active');

            const faseKey = node.getAttribute('data-fase');
            const data = fasenData[faseKey];
            
            const card = container.querySelector('#fase-info-card');
            card.style.opacity = '0';
            setTimeout(() => {
                infoTitel.textContent = data.title;
                infoTitel.style.color = faseKey === 'terugval' ? '#ef4444' : '#1e293b';
                infoTekst.textContent = data.text;
                infoGym.textContent = data.gym;
                card.style.opacity = '1';
                card.style.transition = 'opacity 0.2s ease-in-out';
            }, 150);
        });
    });

    // Selectie logica voor de nieuwe knoppen
    const reflectieBtns = container.querySelectorAll('.fase-select-btn');
    const finishBtn = container.querySelector('#btn-finish-fasen');

    reflectieBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Zorg ervoor dat we de werkelijke button selecteren, niet toevallig de emoji erin
            const targetBtn = e.target.closest('.fase-select-btn');
            
            reflectieBtns.forEach(b => b.classList.remove('selected'));
            targetBtn.classList.add('selected');
            
            const gekozenFase = targetBtn.getAttribute('data-fase');
            localStorage.setItem('arminius_huidige_fase', gekozenFase);

            finishBtn.disabled = false;
            finishBtn.style.opacity = '1';
        });
    });

    // Afronden knop
    finishBtn.addEventListener('click', () => {
        const huidigeFase = localStorage.getItem('arminius_huidige_fase') || 'Voorbereiding';
        const feedbackEl = container.querySelector('#fasen-feedback-text');
        feedbackEl.innerHTML = feedbackBerichten[huidigeFase] || 'Fase opgeslagen.';
        
        triggerConfetti();
        showStep('fase-step-finish');
    });

    const backDashBtn = container.querySelector('#btn-back-dashboard');
    if (backDashBtn) {
        backDashBtn.addEventListener('click', () => {
            if (typeof onComplete === 'function') {
                onComplete();
            }
        });
    }
}