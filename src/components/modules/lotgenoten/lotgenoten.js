// src/components/modules/lotgenoten/lotgenoten.js

function loadCSS() {
    const cssUrl = new URL('./lotgenoten.css', import.meta.url).href;
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

export function renderLotgenotenModule(containerElement, onComplete) {
    loadCSS();
    window.scrollTo(0, 0);

    const container = containerElement || document.getElementById('app-content');
    if (!container) return;

    const actiefTraject = localStorage.getItem('actieveVerslaving') || 'alcohol';
    let currentStepIndex = 0; 

    const fellowshipData = {
        'alcohol': { 
            naam: 'AA (Anonieme Alcoholisten)', 
            url: 'https://aa-nederland.nl/vind-een-meeting/', 
            beschrijving: 'Voor iedereen die de wens heeft om te stoppen met drinken.',
            icoon: '🍺'
        },
        'cannabis': { 
            naam: 'NA (Narcotics Anonymous)', 
            url: 'https://na-holland.nl/meetings/', 
            beschrijving: 'Voor iedereen voor wie drugs (of specifiek blowen) een probleem is geworden.',
            icoon: '🌿'
        },
        'cocaine': { 
            naam: 'CA (Cocaine Anonymous)', 
            url: 'https://ca-holland.org/meetings/', 
            beschrijving: 'Voor iedereen die wil stoppen met cocaïne en andere middelen.',
            icoon: '❄️'
        },
        'gokken': { 
            naam: 'GA (Gamblers Anonymous / AGOG)', 
            url: 'https://www.ganederland.nl/meetings/', 
            beschrijving: 'Voor iedereen die wil stoppen met gokken en de regie wil terugpakken.',
            icoon: '🎰'
        }
    };
    
    const fData = fellowshipData[actiefTraject] || fellowshipData['alcohol'];

    const tekstMap = {
        'alcohol': { middel: 'alcohol' },
        'cannabis': { middel: 'wiet of hasj' },
        'cocaine': { middel: 'cocaïne' },
        'gokken': { middel: 'gokken' }
    };
    const tData = tekstMap[actiefTraject] || tekstMap['alcohol'];

    container.innerHTML = `
        <div style="padding: 20px;">
            <div class="progress-bar-container" style="background: #e2e8f0; height: 6px; border-radius: 3px; margin-bottom: 24px; overflow: hidden; max-width: 700px; margin-left: auto; margin-right: auto;">
                <div class="progress-bar" id="lo-progress-bar" style="width: 25%; background: #2563eb; height: 100%; transition: width 0.4s ease-out;"></div>
            </div>
            
            <div class="module-container lotgenoten-container" style="max-width: 700px; margin: 0 auto;">
                <div style="margin-bottom: 32px;" id="lo-main-header">
                    <span style="font-size: 12px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Omgeving & Steun</span>
                    <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;" id="lo-header-title">Lotgenoten</h2>
                </div>

                <div id="lo-page-content"></div>
            </div>
        </div>
    `;

    const pageContent = container.querySelector('#lo-page-content');
    const progressBar = container.querySelector('#lo-progress-bar');
    const headerTitle = container.querySelector('#lo-header-title');
    const headerWrapper = container.querySelector('#lo-main-header');
    const progressWrapper = container.querySelector('.progress-bar-container');

    function renderStep(preserveScroll = false) {
        const scrollY = window.scrollY;

        // Bepaal zichtbaarheid header en progressie
        headerWrapper.style.display = (currentStepIndex === 5) ? 'none' : 'block';
        if (progressWrapper) {
            progressWrapper.style.display = (currentStepIndex === 5) ? 'none' : 'block';
        }

        if (progressBar) {
            if (currentStepIndex === 0) progressBar.style.width = '20%';
            else if (currentStepIndex === 1) progressBar.style.width = '40%';
            else if (currentStepIndex === 2) progressBar.style.width = '60%';
            else if (currentStepIndex === 3) progressBar.style.width = '80%';
            else if (currentStepIndex === 4) progressBar.style.width = '100%';
        }

        let html = '';

        if (currentStepIndex === 0) {
            // INTRODUCTIE
            headerTitle.textContent = "De kracht van herkenning";
            html = `
                <div class="stagger-1 info-block info-block-border-blue" style="margin-bottom: 16px;">
                    <h3 style="color: #0f172a; font-size: 18px; margin: 0 0 12px 0;">Je bent niet alleen</h3>
                    <p style="font-size: 15px; color: #334155; margin-bottom: 0; line-height: 1.6;">
                        Hoeveel je ook leert in deze app of bespreekt met je directe omgeving, soms voel je je toch eenzaam in dit proces. Je hoeft dit echter niet alleen te doen.
                    </p>
                </div>
                
                <div class="stagger-2 info-block info-block-border-orange" style="margin-bottom: 16px;">
                    <h3 style="color: #0f172a; font-size: 18px; margin: 0 0 12px 0;">De brug naar lotgenoten</h3>
                    <p style="font-size: 15px; color: #334155; margin-bottom: 0; line-height: 1.6;">
                        Gesprekken met mensen die hetzelfde hebben meegemaakt, zijn vaak goud waard. Zij herkennen de smoesjes die je brein maakt, de schaamte, en de valkuilen zonder enig oordeel.
                    </p>
                </div>

                <div class="stagger-3 info-block info-block-border-green">
                    <h3 style="color: #0f172a; font-size: 18px; margin: 0 0 12px 0;">De drempel over</h3>
                    <p style="font-size: 15px; color: #334155; margin-bottom: 0; line-height: 1.6;">
                        Voor veel mensen klinkt het bezoeken van een meeting in eerste instantie heel spannend. In deze module laten we zien welke meetings er zijn, hoe laagdrempelig het bezoeken is en helpen we je direct aan de juiste locatie in jouw regio.
                    </p>
                </div>

                <div class="stagger-4 button-group" style="display: flex; justify-content: flex-end; margin-top: 24px;">
                    <button type="button" id="btn-volgende" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        Welke groepen zijn er? &rarr;
                    </button>
                </div>
            `;
        }
        else if (currentStepIndex === 1) {
            // VORMEN VAN MEETINGS
            headerTitle.textContent = "Soorten meetings";
            html = `
                <div class="stagger-1" style="margin-bottom: 24px;">
                    <span style="font-size: 12px; font-weight: 600; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.5px;">Stap 1 van 4</span>
                    <p style="font-size: 15px; color: #475569; margin-top: 6px;">Er zijn grofweg twee soorten zelfhulpgroepen. Zoek vooral naar de insteek die het beste bij jou past.</p>
                </div>

                <div class="stagger-2 info-block info-block-border-blue" style="margin-bottom: 24px;">
                    <h4 style="margin: 0 0 12px 0; color: #1e293b; font-size: 16px;">Het 12-stappenprogramma (Minnesota-model)</h4>
                    <p style="margin: 0 0 12px 0; font-size: 14px; color: #475569; line-height: 1.6;">
                        Wereldwijd is het 12-stappenmodel (zoals AA, NA of CA) de meest bekende vorm van lotgenotencontact. Deze groepen werken met een vast protocol.
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.6;">
                        In de kern draait dit programma om het erkennen van je machteloosheid over je verslaving, het overgeven aan een groter geheel (wat door sommigen spiritueel wordt ingevuld) en het structureel goedmaken van fouten uit het verleden om met een schone lei te beginnen.
                    </p>
                </div>

                <div class="stagger-3 info-block info-block-border-green" style="background: #f0fdf4; border-color: #bbf7d0; margin-bottom: 32px;">
                    <h4 style="margin: 0 0 8px 0; color: #166534; font-size: 16px;">Alternatieven (Zonder het 12-stappenmodel)</h4>
                    <p style="margin: 0 0 12px 0; font-size: 14px; color: #15803d; line-height: 1.6;">
                        Niet iedereen voelt zich thuis bij het vaste stappenplan of de spirituele kant van het Minnesota-model. Gelukkig zijn er hele sterke alternatieven met een andere insteek:
                    </p>
                    <ul style="margin: 0; padding-left: 20px; color: #15803d; font-size: 14px; line-height: 1.6;">
                        <li><strong>De Buitenveldertgroepen:</strong> Vrije, wekelijkse praatgroepen voor mensen met een verslaving én hun naasten. Hier wordt niet gewerkt met theorie of een stappenplan, maar ligt de focus op het ongedwongen delen van elkaars ervaringen in het hier en nu.</li>
                    </ul>
                </div>

                <div class="stagger-4 button-group" style="display: flex; justify-content: space-between;">
                    <button type="button" id="btn-vorige" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        &larr; Vorige
                    </button>
                    <button type="button" id="btn-volgende" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        Wat kun je verwachten? &rarr;
                    </button>
                </div>
            `;
        }
        else if (currentStepIndex === 2) {
            // HOE WERKT HET
            headerTitle.textContent = "Hoe ziet een avond eruit?";
            html = `
                <div class="stagger-1" style="margin-bottom: 24px;">
                    <span style="font-size: 12px; font-weight: 600; color: #ec4899; text-transform: uppercase; letter-spacing: 0.5px;">Stap 2 van 4</span>
                    <p style="font-size: 15px; color: #475569; margin-top: 6px;">Meetings worden vaak gehouden in laagdrempelige, anonieme ruimtes zoals buurthuizen. Dit is hoe een typische bijeenkomst verloopt:</p>
                </div>

                <div style="margin-bottom: 32px;">
                    <div class="stagger-1 event-step">
                        <div class="event-icon-wrapper">☕</div>
                        <div class="event-content">
                            <h4>De binnenkomst</h4>
                            <p>Koffie is bijna altijd een vast onderdeel. Voel je vrij om direct een kopje te pakken. Vaak zullen vaste aanwezigen even naar je toe komen om zich voor te stellen en je welkom te heten, maar alles is volkomen vrijblijvend en anoniem.</p>
                        </div>
                    </div>

                    <div class="stagger-2 event-step">
                        <div class="event-icon-wrapper">📖</div>
                        <div class="event-content">
                            <h4>De opening</h4>
                            <p>De bijeenkomst wordt geleid door een voorzitter. Soms opent de avond met een tekst of een kort rondje. Mocht de voorzitter vragen of er nieuwelingen zijn, dan ben je vrij om je hand op te steken of jezelf voor te stellen, maar dit hoeft absoluut niet.</p>
                        </div>
                    </div>

                    <div class="stagger-3 event-step">
                        <div class="event-icon-wrapper">🗣️</div>
                        <div class="event-content">
                            <h4>Delen & Luisteren</h4>
                            <p>Er zijn verschillende vormen. Soms is er één spreker ('speaker meeting'), en soms mag iedereen die dat wil kort iets vertellen ('open discussie'). Het belangrijkste principe: <strong>anderen luisteren zonder te oordelen of te onderbreken</strong>. Je mag altijd passen ("Ik luister vandaag liever alleen").</p>
                        </div>
                    </div>

                    <div class="stagger-4 event-step">
                        <div class="event-icon-wrapper">🏅</div>
                        <div class="event-content">
                            <h4>Mijlpalen vieren (Bij 12-stappen)</h4>
                            <p>Binnen groepen als de AA of NA wordt abstinentie actief gevierd. Er worden dan regelmatig 'chips' of muntjes uitgedeeld voor bijvoorbeeld 24 uur, een maand of een jaar clean zijn. Dit helpt groepsleden om positief te blijven en 'hun score' vol te houden.</p>
                        </div>
                    </div>

                    <div class="stagger-5 event-step">
                        <div class="event-icon-wrapper">🤝</div>
                        <div class="event-content">
                            <h4>Na de meeting (Je netwerk)</h4>
                            <p>Na afloop praten mensen vaak nog even na. Dit is hét moment waarop het echte steunnetwerk ontstaat. Veel mensen zoeken hier bijvoorbeeld een sponsor of wisselen nummers uit zodat ze elkaar kunnen bellen als de zucht groot is.</p>
                        </div>
                    </div>
                </div>

                <div class="stagger-6 info-block info-block-border-green" style="background: #f8fafc; margin-bottom: 32px;">
                    <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.5;">
                        <strong>Goed om te onthouden:</strong> Aanwezigheid is áltijd vrijblijvend. Je bepaalt zelf hoe vaak en wanneer je gaat. Sommige mensen gaan één keer per week, anderen slaan wel eens over, en weer anderen bezoeken meerdere meetings per week op verschillende locaties.
                    </p>
                </div>

                <div class="stagger-6 button-group" style="display: flex; justify-content: space-between;">
                    <button type="button" id="btn-vorige" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        &larr; Vorige
                    </button>
                    <button type="button" id="btn-volgende" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        De drempel verlagen &rarr;
                    </button>
                </div>
            `;
        }
        else if (currentStepIndex === 3) {
            // DREMPEL VERLAGEN
            headerTitle.textContent = "Tips voor je eerste keer";
            html = `
                <div class="stagger-1" style="margin-bottom: 24px;">
                    <span style="font-size: 12px; font-weight: 600; color: #8b5cf6; text-transform: uppercase; letter-spacing: 0.5px;">Stap 3 van 4</span>
                    <p style="font-size: 15px; color: #475569; margin-top: 6px;">Het is heel logisch als je dit nog spannend vindt. Gebruik deze tips om de drempel voor jezelf zo laag mogelijk te maken.</p>
                </div>

                <div class="stagger-2 info-block info-block-border-purple" style="margin-bottom: 16px;">
                    <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                        <span>🎧</span> Verhalen van anderen
                    </h4>
                    <p style="margin: 0 0 12px 0; font-size: 14px; color: #475569; line-height: 1.6;">
                        Mensen vinden het soms lastig om in een meeting de 'ellende' van anderen aan te horen, zeker als je zélf al flink in de problemen zit. Dat is heel begrijpelijk. 
                    </p>
                    <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.6;">
                        Maar onthoud dat de kracht juist in het luisteren zit. Jullie zijn er voor elkaar door elkaar de ruimte te geven om een verhaal te delen. Een vuistregel is: <em>"Haal eruit wat voor jou werkt."</em>
                    </p>
                </div>

                <div class="stagger-3 info-block info-block-border-blue" style="margin-bottom: 16px;">
                    <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                        <span>🤝</span> Neem iemand mee & de vluchtroute
                    </h4>
                    <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.6;">
                        Je hoeft het niet alleen te doen! Je mag altijd een vriend, partner of familielid meenemen naar een zogeheten <strong>'open meeting'</strong> (kijk hiervoor op het rooster). En het belangrijkste: voelt het echt niet goed? Je mag in de pauze, of zelfs halverwege, altijd gewoon weer weggaan.
                    </p>
                </div>

                <div class="stagger-4 info-block info-block-border-green" style="margin-bottom: 32px;">
                    <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                        <span>💻</span> Begin veilig online
                    </h4>
                    <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.6;">
                        Vind je een fysieke ruimte binnenstappen te intimiderend? Veel groepen hebben online (Zoom) meetings. Je mag daar vaak anoniem aansluiten en je camera en microfoon uit laten staan om puur even de sfeer te proeven.
                    </p>
                </div>

                <div class="stagger-4 button-group" style="display: flex; justify-content: space-between;">
                    <button type="button" id="btn-vorige" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        &larr; Vorige
                    </button>
                    <button type="button" id="btn-volgende" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        Vind een groep &rarr;
                    </button>
                </div>
            `;
        }
        else if (currentStepIndex === 4) {
            // MEETING VINDEN
            headerTitle.textContent = "Een groep bij jou in de buurt";
            html = `
                <div class="stagger-1" style="margin-bottom: 24px;">
                    <span style="font-size: 12px; font-weight: 600; color: #10b981; text-transform: uppercase; letter-spacing: 0.5px;">Stap 4 van 4</span>
                </div>

                <div class="stagger-2" style="margin-bottom: 24px;">
                    <p style="font-size: 15px; color: #475569; margin-bottom: 8px;">Op basis van jouw gekozen traject (${tData.middel}), hebben we de bijbehorende 12-stappenorganisatie voor je geselecteerd:</p>
                    <a href="${fData.url}" target="_blank" rel="noopener noreferrer" class="meeting-link-card">
                        <span style="font-size: 40px; display: block; margin-bottom: 12px;">${fData.icoon}</span>
                        <h3 style="margin: 0 0 8px 0; font-size: 22px;">Zoek een meeting van ${fData.naam}</h3>
                        <p style="margin: 0; font-size: 15px; opacity: 0.9;">${fData.beschrijving}</p>
                        <div style="margin-top: 20px; background: rgba(255,255,255,0.2); display: inline-block; padding: 8px 20px; border-radius: 20px; font-weight: 700; font-size: 14px;">
                            Naar de website &nearr;
                        </div>
                    </a>
                </div>

                <div class="stagger-3 info-block info-block-border-orange" style="margin-bottom: 24px;">
                    <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #1e293b;">Alternatieven (Zonder 12-stappen)</h4>
                    <p style="margin: 0 0 16px 0; font-size: 14px; color: #475569;">Liever een andere aanpak zonder het spirituele Minnesota-model? Bekijk dan het landelijke overzicht van de vrije praatgroepen:</p>
                    
                    <a href="https://www.zelfhelp.nl/" target="_blank" rel="noopener noreferrer" class="alt-link-card">
                        <div>
                            <strong style="display: block; font-size: 15px;">Buitenveldertgroepen</strong>
                            <span style="font-size: 13px; color: #64748b;">Zelfhelp.nl</span>
                        </div>
                        <span style="color: #3b82f6; font-weight: 800;">&nearr;</span>
                    </a>
                </div>

                <div class="stagger-4" style="text-align: center; margin-bottom: 32px; padding: 0 20px;">
                    <p style="font-size: 13px; color: #64748b; font-style: italic; line-height: 1.5; margin: 0;">
                        Natuurlijk zijn er nog talloze andere (lokale) initiatieven, zoals bijvoorbeeld het 'Zelfregiecentrum'. 
                        Google gerust eens op <strong>'lotgenoten verslaving [jouw woonplaats]'</strong>.
                    </p>
                </div>

                <div class="stagger-4 button-group" style="display: flex; justify-content: space-between;">
                    <button type="button" id="btn-vorige" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        &larr; Vorige
                    </button>
                    <button type="button" id="btn-opslaan" style="background-color: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        Afronden 🎉
                    </button>
                </div>
            `;
        }
        else if (currentStepIndex === 5) {
            // SUCCES PAGINA
            html = `
                <div class="stagger-1" style="max-width: 600px; margin: 40px auto; padding: 32px; text-align: center; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                    <div style="font-size: 64px; margin-bottom: 16px; display: inline-block;">👥</div>
                    <h2 style="font-size: 24px; color: #1e293b; margin-bottom: 12px;">Goed bezig!</h2>
                    <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 32px; max-width: 450px; margin-left: auto; margin-right: auto;">
                        Je weet nu precies wat je kunt verwachten en waar je terecht kunt als je behoefte hebt aan een netwerk van mensen die je begrijpen. Ook al ga je vandaag niet direct naar een meeting, het is waardevol dat je de drempel voor jezelf hebt verlaagd!
                    </p>
                    <div class="button-group" style="justify-content: center; gap: 16px;">
                        <button type="button" id="btn-close-module" style="background-color: #2563eb; color: white; border: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 15px; transition: background 0.2s;">
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
            if (e.target.closest('#btn-volgende')) {
                currentStepIndex++;
                renderStep();
                return;
            }
            if (e.target.closest('#btn-vorige')) {
                currentStepIndex--;
                renderStep();
                return;
            }
            if (e.target.closest('#btn-opslaan')) {
                currentStepIndex = 5;
                triggerConfetti();
                renderStep();
                return;
            }
            if (e.target.closest('#btn-close-module')) {
                if (onComplete) onComplete();
                return;
            }
        });
    }

    // Start eerste render
    renderStep();
}