// src/components/modules/hulp/hulp.js

function loadCSS() {
    const cssUrl = new URL('./hulp.css', import.meta.url).href;
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

export function renderHulpModule(containerElement, onComplete) {
    loadCSS();
    window.scrollTo(0, 0);

    const container = containerElement || document.getElementById('app-content');
    if (!container) return;

    const actiefTraject = localStorage.getItem('actieveVerslaving') || 'alcohol';
    let currentStepIndex = 0; 

    const tekstMap = {
        'alcohol': { middel: 'alcohol', infolijn: 'Alcohol Infolijn (0900-1995)' },
        'cannabis': { middel: 'drugs', infolijn: 'Drugs Infolijn (0900-1995)' },
        'cocaine': { middel: 'drugs', infolijn: 'Drugs Infolijn (0900-1995)' },
        'gokken': { middel: 'gokken', infolijn: 'Gokken Infolijn (0900-2121034)' }
    };
    const tData = tekstMap[actiefTraject] || tekstMap['alcohol'];
    const isAlcohol = actiefTraject === 'alcohol';

    container.innerHTML = `
        <div style="padding: 20px;">
            <div class="progress-bar-container" style="background: #e2e8f0; height: 6px; border-radius: 3px; margin-bottom: 24px; overflow: hidden; max-width: 700px; margin-left: auto; margin-right: auto;">
                <div class="progress-bar" id="hu-progress-bar" style="width: 20%; background: #2563eb; height: 100%; transition: width 0.4s ease-out;"></div>
            </div>
            
            <div class="module-container hulp-container" style="max-width: 700px; margin: 0 auto;">
                <div style="margin-bottom: 32px;" id="hu-main-header">
                    <span style="font-size: 14px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Omgeving & Steun</span>
                    <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;" id="hu-header-title">Hulp inschakelen</h2>
                </div>

                <div id="hu-page-content"></div>
            </div>
        </div>
    `;

    const pageContent = container.querySelector('#hu-page-content');
    const progressBar = container.querySelector('#hu-progress-bar');
    const headerTitle = container.querySelector('#hu-header-title');
    const headerWrapper = container.querySelector('#hu-main-header');
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
            headerTitle.textContent = "Professionele hulp inschakelen";
            html = `
                <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">
                    <div class="stagger-1 info-block info-block-border-blue" style="margin-bottom: 0;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                            <span style="font-size: 24px;">🩺</span>
                            <h3 style="color: #0f172a; font-size: 18px; margin: 0;">Wanneer is het tijd?</h3>
                        </div>
                        <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                            Als je eigen pogingen om te minderen niet succesvol zijn, de hoeveelheid te groot is om veilig af te bouwen of als je behoefte hebt aan een sterke professionele stok achter de deur.
                        </p>
                    </div>

                    <div class="stagger-2 info-block info-block-border-orange" style="margin-bottom: 0;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                            <span style="font-size: 24px;">🤝</span>
                            <h3 style="color: #0f172a; font-size: 18px; margin: 0;">Geen zwakte</h3>
                        </div>
                        <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                            Je probeert met deze app de regie terug te pakken en dat is fantastisch. Maar verslaving is een hardnekkig patroon. Hulp inschakelen is geen falen, het is een hele belangrijke stap naar herstel.
                        </p>
                    </div>

                    <div class="stagger-3 info-block info-block-border-green" style="margin-bottom: 0;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                            <span style="font-size: 24px;">🗺️</span>
                            <h3 style="color: #0f172a; font-size: 18px; margin: 0;">De weg vinden</h3>
                        </div>
                        <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                            De gespecialiseerde verslavingszorg in Nederland is enorm goed, maar kan voelen als een doolhof. In deze module leggen we precies uit hoe je binnenkomt, welke smaken er zijn en waar je anoniem terecht kunt.
                        </p>
                    </div>
                </div>

                <div class="stagger-4 button-group" style="display: flex; justify-content: flex-end;">
                    <button type="button" id="btn-volgende" style="background-color: #2563eb; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 15px;">
                        De Huisarts &rarr;
                    </button>
                </div>
            `;
        }
        else if (currentStepIndex === 1) {
            // DE HUISARTS
            headerTitle.textContent = "De voordeur: De Huisarts";
            html = `
                <div class="stagger-1" style="margin-bottom: 24px;">
                    <span style="font-size: 14px; font-weight: 600; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.5px;">Stap 1 van 4</span>
                </div>

                <div class="stagger-2 info-block info-block-border-orange">
                    <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155; line-height: 1.6;">
                        In Nederland loopt de route naar gespecialiseerde hulp altijd via de huisarts. Een afspraak maken is vaak de allermoeilijkste stap, maar bedenk: de huisarts heeft een strikt <strong>medisch beroepsgeheim</strong>. Er wordt niets gedeeld met werkgevers of familie als jij daar geen toestemming voor geeft.
                    </p>
                    
                    <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 16px; border-radius: 8px; border-left: 4px solid #ef4444; margin-bottom: 24px;">
                        <strong style="display: block; color: #991b1b; margin-bottom: 8px; font-size: 15px;">Speel open kaart</strong>
                        <p style="margin: 0; color: #7f1d1d; font-size: 14px; line-height: 1.5;">Mensen schamen zich vaak en maken hun gebruik in de spreekkamer kleiner dan het is. Doe dit niet. Vertel precies wélk middel, hoeveel en hoe vaak. Alleen door extreme eerlijkheid kan de juiste inschatting worden gemaakt.</p>
                    </div>

                    <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size: 16px;">Onderliggende klachten? Eerst de pleister!</h4>
                    <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.6;">
                        Speelt er ook een trauma of een andere psychische aandoening mee? De psychologische richtlijn is helder: <em>eerst</em> wordt de verslaving behandeld voordat onderliggende problemen worden aangepakt. Zie de verslaving als een pleister op een bloedende wond. De wond kan pas goed gehecht en behandeld worden als de pleister eraf is.
                    </p>
                </div>

                <div class="stagger-3 button-group" style="display: flex; justify-content: space-between;">
                    <button type="button" id="btn-vorige" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        &larr; Vorige
                    </button>
                    <button type="button" id="btn-volgende" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        Vormen van Zorg &rarr;
                    </button>
                </div>
            `;
        }
        else if (currentStepIndex === 2) {
            // VERSLAVINGSZORG 1
            headerTitle.textContent = "De specialistische route";
            html = `
                <div class="stagger-1" style="margin-bottom: 24px;">
                    <span style="font-size: 14px; font-weight: 600; color: #10b981; text-transform: uppercase; letter-spacing: 0.5px;">Stap 2 van 4</span>
                    <p style="font-size: 15px; color: #475569; margin-top: 6px;">Bij de verslavingszorg instellingen wordt, afhankelijk van jouw situatie, een plan gemaakt. Dit zijn de twee meest voorkomende opties:</p>
                </div>

                <div class="stagger-2 info-block info-block-border-green">
                    <div style="margin-bottom: 24px;">
                        <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size: 18px;">1. Ambulante behandeling</h4>
                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #475569; line-height: 1.6;">
                            Dit is de standaardbehandeling bij verslaving. Je gaat wekelijks naar behandelafspraken, waar je leert over verslaving en huiswerk krijgt om thuis mee aan de slag te gaan. De behandeling is voornamelijk gebaseerd op <strong>Cognitieve Gedragstherapie (CGT)</strong>. 
                        </p>
                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #475569; line-height: 1.6;">
                            De aanpak is heel praktisch en lijkt veel op de inhoud van deze app: je onderzoekt risicosituaties, trekgevoelens en welke alternatieve gedachten en gedragingen écht helpen.
                        </p>
                        <p style="margin: 0; font-size: 14px; color: #475569; font-style: italic; line-height: 1.6;">
                            De duur varieert enorm: van een succesvol, kort traject tot jarenlange betrokkenheid bij herhaaldelijke terugvallen.
                        </p>
                    </div>

                    <div style="height: 1px; background: #e2e8f0; margin: 24px 0;"></div>

                    <div>
                        <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size: 18px;">2. Medische Detox</h4>
                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #475569; line-height: 1.6;">
                            Een detoxopname duurt vaak 1 tot 3 weken en is nodig als afbouwen van het gebruik niet lukt en er een medisch risico ontstaat. Artsen en verpleegkundigen bewaken je gezondheid en kunnen medicatie voorschrijven tegen ontwenningsklachten.
                        </p>
                        <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.6;">
                            Vergis je niet: een detox is feitelijk slechts een <strong>'wasstraat voor verslaving'</strong>. Er is hier vrijwel geen psychologische behandeling. Na de detox moet je thuis (of ambulant) de echte emotionele arbeid nog verrichten om niet terug te vallen.
                        </p>
                    </div>
                </div>

                <div class="stagger-3 button-group" style="display: flex; justify-content: space-between;">
                    <button type="button" id="btn-vorige" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        &larr; Vorige
                    </button>
                    <button type="button" id="btn-volgende" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        Klinisch & Medicatie &rarr;
                    </button>
                </div>
            `;
        }
        else if (currentStepIndex === 3) {
            // VERSLAVINGSZORG 2
            headerTitle.textContent = "Klinieken & Ondersteuning";
            html = `
                <div class="stagger-1" style="margin-bottom: 24px;">
                    <span style="font-size: 14px; font-weight: 600; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.5px;">Stap 3 van 4</span>
                </div>

                <div class="stagger-2 info-block info-block-border-blue" style="margin-bottom: 24px;">
                    <h4 style="margin: 0 0 12px 0; color: #1e293b; font-size: 18px;">Klinische behandeling</h4>
                    <p style="margin: 0 0 12px 0; font-size: 14px; color: #475569; line-height: 1.6;">
                        Bij hardnekkige verslaving is ambulante behandeling of een medische detox soms niet voldoende. Dan is het goed om een langere tijd in de veilige omgeving van een kliniek aan jezelf en de verslaving te werken. Inhoudelijk lijken veel klinieken op elkaar: er is dagritme, groepstherapie en vaak het verplicht bezoeken van lotgenoten meetings.
                    </p>
                    
                    <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 16px; border-radius: 8px; border-left: 4px solid #ef4444;">
                        <strong style="display: block; color: #991b1b; margin-bottom: 8px; font-size: 14px;">⚠ Let goed op je verzekering</strong>
                        <p style="margin: 0; color: #7f1d1d; font-size: 15px; line-height: 1.5;">Niet elke zorgverzekeraar werkt samen met elke (particuliere) kliniek. Zeker opnames in buitenlandse klinieken worden zelden volledig vergoed en kunnen leiden tot torenhoge onverwachte kosten. Zoek dit altijd vooraf goed uit!</p>
                    </div>
                </div>

                ${isAlcohol ? `
                <div class="stagger-3 info-block info-block-border-green" style="background: #f0fdf4; border-color: #bbf7d0; margin-bottom: 24px;">
                    <h4 style="margin: 0 0 12px 0; color: #166534; font-size: 18px;">Medicatie bij Alcohol</h4>
                    <p style="margin: 0 0 12px 0; font-size: 14px; color: #15803d; line-height: 1.6;">
                        Specifiek voor alcoholverslaving kan de arts ondersteunende medicatie voorschrijven om herstel makkelijker te maken:
                    </p>
                    <ul style="margin: 0; padding-left: 20px; color: #15803d; font-size: 14px; line-height: 1.6;">
                        <li style="margin-bottom: 8px;"><strong>Aversiemedicatie (Disulfiram / Refusal / Antabus):</strong> Je moet hiervoor al gestopt zijn. Deze medicatie zorgt ervoor dat je extreem ziek wordt als je toch drinkt. Dit wordt veel ingezet als harde 'stok achter de deur' om terugvallen te blokkeren.</li>
                        <li><strong>Anti-trek medicatie (Naltrexon / Campral):</strong> Werkt in op het beloningssysteem in de hersenen waardoor de zin om te drinken afneemt en het 'fijne' gevoel van alcohol geblokkeerd wordt.</li>
                    </ul>
                </div>
                ` : ''}

                <div class="stagger-4 button-group" style="display: flex; justify-content: space-between;">
                    <button type="button" id="btn-vorige" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        &larr; Vorige
                    </button>
                    <button type="button" id="btn-volgende" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        Anoniem contact &rarr;
                    </button>
                </div>
            `;
        }
        else if (currentStepIndex === 4) {
            // ANONIEM CONTACT
            headerTitle.textContent = "Direct en Anoniem contact";
            html = `
                <div class="stagger-1" style="margin-bottom: 24px;">
                    <span style="font-size: 14px; font-weight: 600; color: #8b5cf6; text-transform: uppercase; letter-spacing: 0.5px;">Stap 4 van 4</span>
                    <p style="font-size: 15px; color: #475569; margin-top: 6px;">Is de stap naar de huisarts nog net te groot? Blijf er niet alleen mee rondlopen. Er zijn professionals die je vandaag nog anoniem, gratis en zonder verplichtingen te woord staan.</p>
                </div>

                <div class="stagger-2">
                    <a href="https://mindkorrelatie.nl/" target="_blank" rel="noopener noreferrer" class="contact-card">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h4 style="margin: 0; font-size: 16px; color: #1e293b;">MIND Hulplijn</h4>
                            <span style="color: #3b82f6; font-size: 20px;">💬</span>
                        </div>
                        <p style="margin: 0; font-size: 14px; color: #475569;">Anonieme, professionele psychologische en maatschappelijke hulp. Je kunt ze bellen, chatten of appen voor een luisterend oor en advies.</p>
                        <span style="color: #2563eb; font-weight: 700; font-size: 15px; margin-top: 8px;">Naar mindkorrelatie.nl &nearr;</span>
                    </a>

                    <a href="https://www.deluisterlijn.nl/" target="_blank" rel="noopener noreferrer" class="contact-card">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h4 style="margin: 0; font-size: 16px; color: #1e293b;">De Luisterlijn (088 0767 000)</h4>
                            <span style="color: #3b82f6; font-size: 20px;">📞</span>
                        </div>
                        <p style="margin: 0; font-size: 14px; color: #475569;">Zit je even helemaal vast? De vrijwilligers van de Luisterlijn zijn 24/7 bereikbaar voor een vertrouwelijk gesprek.</p>
                        <span style="color: #2563eb; font-weight: 700; font-size: 15px; margin-top: 8px;">Naar deluisterlijn.nl &nearr;</span>
                    </a>

                    <div class="contact-card" style="border-left: 4px solid #10b981; cursor: default;">
                        <h4 style="margin: 0; font-size: 16px; color: #1e293b;">Specifiek voor jouw traject</h4>
                        <p style="margin: 0; font-size: 14px; color: #475569;">Je kunt voor gerichte, anonieme vragen over ${tData.middel} en behandelopties in de buurt altijd bellen met de specialisten van de <strong>${tData.infolijn}</strong>.</p>
                    </div>
                </div>

                <div class="stagger-3 button-group" style="display: flex; justify-content: space-between; margin-top: 32px;">
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
                    <div style="font-size: 64px; margin-bottom: 16px; display: inline-block;">🤝</div>
                    <h2 style="font-size: 24px; color: #1e293b; margin-bottom: 16px;">Trots!</h2>
                    <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 32px; max-width: 450px; margin-left: auto; margin-right: auto;">
                        Het is cruciaal om te weten dat je er niet alleen voor staat. De route naar professionele hulp is nu geen mysterie meer. Mocht het met de app en je omgeving toch niet helemaal lukken, dan weet je nu precies hoe de routekaart van de zorg eruitziet en wat je kunt verwachten.
                    </p>
                </div>

                <div class="stagger-2" style="display: flex; justify-content: center;">
                    <button type="button" id="terug-naar-overzicht-btn" style="background-color: #2563eb; color: white; border: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 15px; box-shadow: 0 2px 4px rgba(37,99,235,0.2);">
                        Terug naar routekaart
                    </button>
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
            if (e.target.closest('#terug-naar-overzicht-btn')) {
                if (onComplete) onComplete();
                return;
            }
        });
    }

    // Start eerste render
    renderStep();
}