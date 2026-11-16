// src/components/modules/weigeren/weigeren.js

function loadCSS() {
    const cssUrl = new URL('./weigeren.css', import.meta.url).href;
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

export function renderWeigerenModule(containerElement, onComplete) {
    loadCSS();
    window.scrollTo(0, 0);

    const container = containerElement || document.getElementById('app-content');
    if (!container) return;

    const actiefTraject = localStorage.getItem('actieveVerslaving') || 'alcohol';
    const lsKey = `arminius_module_weigeren_data_${actiefTraject}`;
    
    let savedData = { situaties: [] };
    let currentStepIndex = 0; 
    let currentQuizIndex = 0;

    const storedStr = localStorage.getItem(lsKey);
    if (storedStr) {
        try {
            const parsed = JSON.parse(storedStr);
            if (parsed) {
                if (typeof parsed.situaties === 'string') {
                    savedData.situaties = parsed.situaties ? [parsed.situaties] : [];
                } else {
                    savedData = parsed;
                }
            }
        } catch (e) {}
    }

    const standaardSituaties = [
        "Verjaardag of feestje", 
        "Vrijdagmiddagborrel / Werk", 
        "Als iemand trakteert", 
        "Tijdens het uitgaan", 
        "Bij bepaalde vrienden", 
        "Tijdens een etentje"
    ];

    const contentMap = {
        'alcohol': {
            stof: 'een drankje',
            voorbeeldNee: '"Nee dank je. Ik hoef geen wijn, doe mij maar bruiswater."',
            extraTip: 'Houd een (non-alcoholisch) drankje in je hand. Als je je eigen glas vasthoudt, is de kans veel kleiner dat iemand ongevraagd een nieuw glas met alcohol voor je neus neerzet. Houd er desnoods een klein restje in.',
            chat: [
                { sender: 'other', text: 'Hé, drink even gezellig een biertje of wijntje mee!' },
                { sender: 'user', text: 'Nee dank je, ik hou het vanavond bij fris.' },
                { sender: 'other', text: 'Ah joh, doe niet zo ongezellig. Eentje kan toch wel?' },
                { sender: 'user', text: 'Ik heb besloten het vandaag niet te doen, dus ik sla over. Maar proost!' }
            ],
            quiz: [
                {
                    vraag: '"Ik pak een wijntje. Wil jij ook?"',
                    opties: [
                        { text: '"Eh... eh... nee hoor."', correct: false, feedback: "Fout. Je klinkt onzeker en twijfelend. Dit geeft de ander de ruimte om je over te halen." },
                        { text: '"Nee, dank je wel. Maar neem jij gerust."', correct: true, feedback: "Goed! Je weigert duidelijk en houdt de sfeer neutraal door de ander zijn gang te laten gaan." }
                    ]
                },
                {
                    vraag: '"Hier, ik heb alvast een koud biertje voor je meegebracht."',
                    opties: [
                        { text: '"Nee, dank je. Ik moet morgen vroeg opstaan."', correct: false, feedback: "Fout. Zelfs als het waar is, geef je hiermee ruimte voor onderhandeling. De ander zal waarschijnlijk zeggen: 'Ah joh, met eentje slaap je er wel doorheen!'" },
                        { text: '"Ik hoef niet, bedankt."', correct: true, feedback: "Goed! Kort en krachtig, zonder redenen te geven die ruimte bieden voor discussie." }
                    ]
                },
                {
                    vraag: "De ander zet zonder het te vragen een glas bier voor je neer.",
                    opties: [
                        { text: "Niks zeggen en het laten staan.", correct: false, feedback: "Fout. Dit is risicovol. Het glas blijft aandacht trekken en de verleiding letterlijk voor je neus staan." },
                        { text: '"Nee hoor, dank je wel. Ik pak straks wat fris."', correct: true, feedback: "Goed! Je benoemt eerst wat je niet wilt, en vult het direct aan met wat je wél wilt." }
                    ]
                },
                {
                    vraag: '"Doe niet zo ongezellig en drink ook wat!"',
                    opties: [
                        { text: '"Nee sorry, ik moet nog autorijden."', correct: false, feedback: "Fout. Je gebruikt een excuus. Dit biedt onderhandelingsruimte ('Met één biertje mag je over een uur wel weer rijden.')." },
                        { text: '"Nee, ik heb besloten niet te drinken. Hoe gaat het op werk trouwens?"', correct: true, feedback: "Goed! Je bent duidelijk en buigt het gesprek tactisch om naar een ander onderwerp." }
                    ]
                },
                {
                    vraag: '"Als je één drankje doet en een uur wacht, mag je weer autorijden."',
                    opties: [
                        { text: '"Ja, nou ja, ik weet niet of dat klopt hoor."', correct: false, feedback: "Fout. Je gaat in discussie over de feiten in plaats van duidelijk 'nee' te zeggen." },
                        { text: '"Alsnog hoef ik niet, bedankt. Ik houd het bij mijn 0.0."', correct: true, feedback: "Goed! Je laat je niet meeslepen in de discussie, maar blijft helder bij je eigen besluit." }
                    ]
                }
            ]
        },
        'cannabis': {
            stof: 'een joint',
            voorbeeldNee: '"Nee dank je. Ik hoef niet te blowen, ik hou het bij een frisje."',
            extraTip: 'Zorg dat je niet in de zogenaamde "doorreik-cirkel" gaat zitten. Als een joint wordt doorgegeven, is de automatische reflex om hem aan te pakken erg groot. Positioneer jezelf tactisch of houd je handen bezig.',
            chat: [
                { sender: 'other', text: 'Trek in een hijs?' },
                { sender: 'user', text: 'Nee dank je, ik sla over.' },
                { sender: 'other', text: 'Zeker weten? Helpt lekker ontspannen na vandaag.' },
                { sender: 'user', text: 'Zeker weten, ik heb het niet nodig vanavond.' }
            ],
            quiz: [
                {
                    vraag: '"Ik ga er even eentje draaien. Rook je mee?"',
                    opties: [
                        { text: '"Misschien straks, ik weet het nog niet."', correct: false, feedback: "Fout. Je houdt de deur op een kier. Hierdoor zal de ander het straks gewoon nog een keer vragen." },
                        { text: '"Nee dank je, ik sla over."', correct: true, feedback: "Goed! Duidelijk en beslist. Je sluit de verwachting direct af." }
                    ]
                },
                {
                    vraag: '"Hier, neem even een hijs, dan ontspan je tenminste."',
                    opties: [
                        { text: '"Nee dank je, ik hoef echt niet."', correct: true, feedback: "Goed! Kort, krachtig en je houdt het dicht bij jezelf zonder uitleg te geven." },
                        { text: '"Ik kan niet, ik heb morgen een vroege dienst."', correct: false, feedback: "Fout. Zelfs als het waar is, geef je hiermee ruimte voor onderhandeling ('Eén hijsje voel je morgen echt niet meer')." }
                    ]
                },
                {
                    vraag: "De ander geeft zonder te vragen een brandende joint aan je door.",
                    opties: [
                        { text: '"Nee bedankt, geef maar door aan de volgende."', correct: true, feedback: "Goed! Je weigert direct en zorgt dat de trigger (de joint) weer snel uit je handen is." },
                        { text: "Hem aannemen maar net doen alsof je niet inhaleert.", correct: false, feedback: "Fout. Dit is enorm risicovol. De drempel om toch te inhaleren is te groot als je het middel al vasthebt." }
                    ]
                },
                {
                    vraag: '"Doe niet zo ongezellig, rook gewoon even gezellig mee!"',
                    opties: [
                        { text: '"Nee sorry, ik moet echt nog rijden straks."', correct: false, feedback: "Fout. Excuses bieden ruimte voor onderhandeling ('Ah joh, we gaan pas over een uur weg')." },
                        { text: '"Nee, ik pas. Heb je trouwens die nieuwe serie al gezien?"', correct: true, feedback: "Goed! Je blijft bij je standpunt en leidt het gesprek direct soepel af." }
                    ]
                },
                {
                    vraag: '"Ah joh, van één trekje word je echt niet meteen weer helemaal stoned."',
                    opties: [
                        { text: '"Zou je denken? Nou, misschien dan..."', correct: false, feedback: "Fout. Je laat je meeslepen door hun argument en verliest je grens." },
                        { text: '"Dat kan, maar ik hoef alsnog niet. Bedankt."', correct: true, feedback: "Goed! Je weigert de discussie aan te gaan en herhaalt simpelweg je grens." }
                    ]
                }
            ]
        },
        'cocaine': {
            stof: 'cocaïne',
            voorbeeldNee: '"Nee dank je. Ik sla deze ronde over."',
            extraTip: 'Vermijd de typische plekken waar gebruikt wordt, zoals bepaalde toiletten op een feestje of het groepje dat zich even "terugtrekt". Loop op dat moment bewust even naar buiten of naar de bar.',
            chat: [
                { sender: 'other', text: 'Ik loop even naar de wc, loop je mee?' },
                { sender: 'user', text: 'Nee dank je, ik blijf even hier.' },
                { sender: 'other', text: 'Kom op even snel één nakkie, we hebben goeie.' },
                { sender: 'user', text: 'Nee, ik sla echt over vanavond. Veel plezier.' }
            ],
            quiz: [
                {
                    vraag: '"Ik ga even naar de wc. Loop je mee?"',
                    opties: [
                        { text: '"Ja is goed, maar ik neem niks hoor."', correct: false, feedback: "Fout. Je gaat bewust de risicosituatie opzoeken en maakt het jezelf onnodig moeilijk om daar alsnog te weigeren." },
                        { text: '"Nee man, dank je. Ik blijf even hier."', correct: true, feedback: "Goed! Je weigert niet alleen het middel, maar vermijdt ook proactief de triggersituatie." }
                    ]
                },
                {
                    vraag: '"Kom op, we hebben echt goeie, even eentje om wakker te worden."',
                    opties: [
                        { text: '"Nee dank je, ik heb vandaag al paracetamol op."', correct: false, feedback: "Fout. Ook als het waar is, klinkt het als een zwak excuus. De ander voelt dat je twijfelt en zal waarschijnlijk blijven aandringen." },
                        { text: '"Nee, bedankt."', correct: true, feedback: "Goed! Punt. Geen uitleg of excuus nodig, je weigert helder en stopt het gesprek daar." }
                    ]
                },
                {
                    vraag: "De ander legt ongevraagd een lijntje voor je klaar op tafel.",
                    opties: [
                        { text: "Het laten liggen maar er wel naar blijven staren.", correct: false, feedback: "Fout. Zodra het binnen handbereik ligt, wordt het een test van wilskracht. Dat verlies je op termijn." },
                        { text: '"Nee hoor, ik sla over, verdeel hem maar."', correct: true, feedback: "Goed! Je weigert direct en zorgt dat de situatie door de anderen wordt 'opgelost' zodat de trigger verdwijnt." }
                    ]
                },
                {
                    vraag: '"Doe niet zo saai, het is nog vroeg en het feestje moet nog beginnen!"',
                    opties: [
                        { text: '"Nee sorry, ik ben vandaag met de auto gekomen."', correct: false, feedback: "Fout. Excuses bieden altijd ruimte voor onderhandeling ('Dan pak je toch morgen een Uber?')." },
                        { text: '"Ik vermaak me zo ook prima, dus ik sla over."', correct: true, feedback: "Goed! Duidelijk, bij jezelf gehouden, en geen ruimte voor onderhandeling." }
                    ]
                },
                {
                    vraag: '"Neem gewoon een klein sleuteltje, daar merk je morgen helemaal niks meer van."',
                    opties: [
                        { text: '"Dat zal wel, maar ik hoef het gewoon niet."', correct: true, feedback: "Goed! Je gaat niet in op de logica van hun argument, maar herhaalt je grens." },
                        { text: '"Ja maar als ik één doe wil ik er daarna meer."', correct: false, feedback: "Fout. Hierdoor maak je jezelf heel kwetsbaar in deze groep en open je een discussie over je gebruik." }
                    ]
                }
            ]
        },
        'gokken': {
            stof: 'een bet of casinobezoek',
            voorbeeldNee: '"Nee dank je. Ik leg deze keer niet in voor de bet."',
            extraTip: 'Kijk niet mee op de schermen of telefoons van anderen als ze aan het spelen zijn. De visuele prikkels en geluiden kunnen de drang om mee te doen direct activeren.',
            chat: [
                { sender: 'other', text: 'We leggen even in voor een dikke combi-bet, doe je mee?' },
                { sender: 'user', text: 'Nee dank je, ik leg deze keer niet in.' },
                { sender: 'other', text: 'Ah joh, het is maar een tientje! Kans is best groot.' },
                { sender: 'user', text: 'Nee, ik doe echt niet mee. Succes met de bet.' }
            ],
            quiz: [
                {
                    vraag: '"We leggen even in voor een flinke combi-bet, doe je mee?"',
                    opties: [
                        { text: '"Ik heb even geen saldo op mijn rekening."', correct: false, feedback: "Fout. Zelfs als het waar is, is dit een gevaarlijk excuus. Grote kans dat iemand zegt: 'Geeft niet, ik schiet het wel voor!'" },
                        { text: '"Nee dank je, ik leg deze keer niet in."', correct: true, feedback: "Goed! Je bent duidelijk over wat je wel en niet doet, zonder in excuses te vervallen." }
                    ]
                },
                {
                    vraag: '"Ik ga vanavond even naar het casino, zin om mee te gaan?"',
                    opties: [
                        { text: '"Nee bedankt, ik ga niet mee vanavond."', correct: true, feedback: "Goed! Je sluit de deur helder en respectvol, zonder uitleg te geven over het waarom." },
                        { text: '"Ik wil wel, maar mijn partner wordt echt boos als ik weer ga."', correct: false, feedback: "Fout. Je verschuift de verantwoordelijkheid naar iemand anders. Hierdoor houd je zelf de controle niet." }
                    ]
                },
                {
                    vraag: "De ander logt ongevraagd in op een gok-app en legt zijn telefoon tussen jullie in.",
                    opties: [
                        { text: "Meekijken hoe de weddenschap verloopt.", correct: false, feedback: "Fout. De visuele triggers van de app of wedstrijd maken het verlangen direct onnodig groot." },
                        { text: "Er even iets voor zetten of vragen of hij het scherm wegdraait.", correct: true, feedback: "Goed! Je beschermt jezelf direct tegen onnodige triggers." }
                    ]
                },
                {
                    vraag: '"Doe niet zo flauw, leg gewoon een tientje in voor de spanning!"',
                    opties: [
                        { text: '"Nee sorry, ik moet die tien euro echt nog pinnen voor boodschappen."', correct: false, feedback: "Fout. Dit is een reden die onderhandelingsruimte biedt ('Ah ik betaal die boodschappen wel als we winnen')." },
                        { text: '"Nee bedankt, ik haal liever even een rondje drinken zo."', correct: true, feedback: "Goed! Je bent duidelijk en geeft meteen een alternatieve invulling aan de situatie." }
                    ]
                },
                {
                    vraag: '"We zetten in op een zekere wedstrijd, je kunt je inleg eigenlijk niet verliezen."',
                    opties: [
                        { text: '"Nee, bedankt. Ik doe echt niet mee."', correct: true, feedback: "Goed! Je gaat niet mee in de 'gegarandeerde winst' illusie, maar kapt het af." },
                        { text: '"Welke wedstrijd is het dan precies?"', correct: false, feedback: "Fout. Door inhoudelijk op de weddenschap in te gaan, zit je er eigenlijk al met één been weer in." }
                    ]
                }
            ]
        }
    };

    const tData = contentMap[actiefTraject] || contentMap['alcohol'];

    container.innerHTML = `
        <div style="padding: 20px;">
            <div class="progress-bar-container" style="background: #e2e8f0; height: 6px; border-radius: 3px; margin-bottom: 24px; overflow: hidden; max-width: 700px; margin-left: auto; margin-right: auto;">
                <div class="progress-bar" id="we-progress-bar" style="width: 25%; background: #2563eb; height: 100%; transition: width 0.4s ease-out;"></div>
            </div>
            
            <div class="module-container weigeren-container" style="max-width: 700px; margin: 0 auto;">
                <div style="margin-bottom: 32px;" id="we-main-header">
                    <span style="font-size: 12px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Vaardigheden</span>
                    <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;" id="we-header-title">Nee zeggen</h2>
                </div>

                <div id="we-page-content"></div>
            </div>
        </div>
    `;

    const pageContent = container.querySelector('#we-page-content');
    const progressBar = container.querySelector('#we-progress-bar');
    const headerTitle = container.querySelector('#we-header-title');
    const headerWrapper = container.querySelector('#we-main-header');
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
            headerTitle.textContent = "Aanbod weigeren";
            html = `
                <div class="intro-grid" style="margin-bottom: 24px;">
                    <div class="stagger-1 info-block info-block-border-blue" style="margin-bottom: 0;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                            <span style="font-size: 24px;">🎁</span>
                            <h3 style="color: #0f172a; font-size: 18px; margin: 0;">Het aanbod</h3>
                        </div>
                        <p style="font-size: 15px; color: #334155; margin-bottom: 0; line-height: 1.6;">
                            Hoe goed je alles ook gepland hebt, er komt een moment dat iemand je onverwacht ${tData.stof} aanbiedt. Dat kan op een feestje zijn of gewoon in je eigen omgeving.
                        </p>
                    </div>
                    <div class="stagger-2 info-block info-block-border-orange" style="margin-bottom: 0;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                            <span style="font-size: 24px;">✋</span>
                            <h3 style="color: #0f172a; font-size: 18px; margin: 0;">Nee zeggen</h3>
                        </div>
                        <p style="font-size: 15px; color: #334155; margin-bottom: 0; line-height: 1.6;">
                            Op zo'n moment overvallen worden door twijfel vergroot de kans op een uitglijder. Daarom is "nee zeggen" een vaardigheid die je vooraf moet voorbereiden.
                        </p>
                    </div>
                </div>

                <div class="stagger-3 button-group" style="display: flex; justify-content: flex-end; margin-top: 24px;">
                    <button type="button" id="btn-volgende" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        Start module &rarr;
                    </button>
                </div>
            `;
        }
        else if (currentStepIndex === 1) {
            // INVENTARISATIE (Aangepast naar Oranje styling)
            headerTitle.textContent = "Inleven in de situatie";
            html = `
                <div class="stagger-1" style="margin-bottom: 24px;">
                    <span style="font-size: 12px; font-weight: 600; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.5px;">Stap 1 van 4</span>
                </div>

                <div class="stagger-2 info-block info-block-border-orange" style="margin-bottom: 24px;">
                    <label style="display: block; font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 12px;">
                        In welke situaties of bij welke personen verwacht jij dat het lastig wordt om te weigeren?
                    </label>
                    <p style="font-size: 14px; color: #64748b; margin-top: 0; margin-bottom: 16px;">
                        Kies de momenten die voor jou van toepassing zijn, of voeg je eigen situaties toe.
                    </p>
                    
                    <div class="chip-group" id="situaties-container" style="margin-bottom: 16px;">
                    </div>

                    <div class="custom-input-wrapper">
                        <input type="text" id="eigen-situatie-input" class="custom-weigeren-input" placeholder="+ Voeg eigen situatie toe">
                        <button type="button" id="btn-add-situatie" class="btn-add-custom">Toevoegen</button>
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
        else if (currentStepIndex === 2) {
            // WAT ZEG JE
            headerTitle.textContent = "Wát zeg je?";
            html = `
                <div class="stagger-1" style="margin-bottom: 24px;">
                    <span style="font-size: 12px; font-weight: 600; color: #10b981; text-transform: uppercase; letter-spacing: 0.5px;">Stap 2 van 4</span>
                    <p style="font-size: 15px; color: #475569; margin-top: 6px;">De inhoud van je boodschap is cruciaal. Houd het bij jezelf.</p>
                </div>

                <div class="stagger-2 info-block info-block-border-orange" style="background: #fffbeb; border-color: #fcd34d; margin-bottom: 24px;">
                    <h4 style="margin: 0 0 6px 0; color: #9a3412; font-size: 15px; display: flex; align-items: center; gap: 8px;">
                        <span>💡</span> De goede bedoelingen van de ander
                    </h4>
                    <p style="font-size: 14px; color: #7c2d12; margin: 0; line-height: 1.5;">
                        Als de ander aandringt, is dat meestal <strong>niet</strong> per se erg bedoeld. Vaak wil de ander gewoon gastvrij zijn, of je geruststellen dat "eentje wel kan", puur zodat jij zonder zorgen van de situatie kunt genieten. Dat besef kan je helpen om rustig te reageren in plaats van onnodig in de verdediging te schieten.
                    </p>
                </div>

                <div class="stagger-3" style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px;">
                    
                    <div style="background: #ffffff; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 16px 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                        <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size: 16px;">1. Hou het kort</h4>
                        <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.5;">Een simpel <strong>"Nee, dank je"</strong> is genoeg. Je hoeft er geen heel verhaal van te maken.</p>
                    </div>

                    <div style="background: #ffffff; border-left: 4px solid #ef4444; border-radius: 8px; padding: 16px 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                        <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size: 16px;">2. Gebruik geen smoesjes</h4>
                        <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.5;">Zeg niet: <em>"Ik heb medicatie", "Ik moet vroeg op"</em> of <em>"Ik ben met de auto"</em>. Dit geeft de ander ruimte om te onderhandelen of het dwingt jou om te liegen.</p>
                    </div>

                    <div style="background: #ffffff; border-left: 4px solid #10b981; border-radius: 8px; padding: 16px 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                        <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size: 16px;">3. Uitleg is NIET verplicht</h4>
                        <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.5;">Je mag bespreken waar jij je comfortabel bij voelt. Maar besef goed: je bent <strong>niemand</strong> uitleg verschuldigd over waarom je weigert.</p>
                    </div>

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
        else if (currentStepIndex === 3) {
            // HOE ZEG JE HET
            headerTitle.textContent = "Hóe zeg je het?";
            html = `
                <div class="stagger-1" style="margin-bottom: 24px;">
                    <span style="font-size: 12px; font-weight: 600; color: #8b5cf6; text-transform: uppercase; letter-spacing: 0.5px;">Stap 3 van 4</span>
                    <p style="font-size: 15px; color: #475569; margin-top: 6px;">Oefening baart kunst. Kijk mee met dit voorbeeld.</p>
                </div>

                <div class="stagger-2 info-block" style="background: #f1f5f9; border: 1px solid #cbd5e1; min-height: 240px; display: flex; flex-direction: column;">
                    <div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; text-align: center; margin-bottom: 16px;">Voorbeeld Gesprek</div>
                    <div id="chat-box" style="display: flex; flex-direction: column; gap: 12px; flex-grow: 1;">
                    </div>
                </div>

                <div class="stagger-3 info-block info-block-border-blue">
                    <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px;">
                        <li style="display: flex; gap: 12px;">
                            <span style="font-size: 20px;">👀</span>
                            <div>
                                <strong style="color: #1e293b; display: block;">Kijk de ander aan</strong>
                                <span style="color: #475569; font-size: 14px;">Oogcontact straalt zelfverzekerdheid uit. Weiger duidelijk en zonder twijfel in je stem.</span>
                            </div>
                        </li>
                        <li style="display: flex; gap: 12px;">
                            <span style="font-size: 20px;">🔄</span>
                            <div>
                                <strong style="color: #1e293b; display: block;">Benoem eerst wat je niet wilt, dan wat je wél wilt</strong>
                                <span style="color: #475569; font-size: 14px;">Bijvoorbeeld: <em>${tData.voorbeeldNee}</em></span>
                            </div>
                        </li>
                        <li style="display: flex; gap: 12px;">
                            <span style="font-size: 20px;">🛡️</span>
                            <div>
                                <strong style="color: #1e293b; display: block;">Als iemand blijft aandringen</strong>
                                <span style="color: #475569; font-size: 14px;">Herhaal je besluit ("Ik heb echt besloten het niet te doen"). Blijft het doorgaan? Vraag dan duidelijk of ze erover op willen houden, of loop weg uit de situatie.</span>
                            </div>
                        </li>
                    </ul>
                </div>

                <div class="stagger-4 info-block info-block-border-green" style="background: #f0fdf4; border-color: #bbf7d0;">
                    <p style="font-size: 14px; color: #166534; margin: 0; line-height: 1.5;">
                        <strong>💡 Praktische tip:</strong> ${tData.extraTip}
                    </p>
                </div>

                <div class="stagger-4 button-group" style="display: flex; justify-content: space-between;">
                    <button type="button" id="btn-vorige" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        &larr; Vorige
                    </button>
                    <button type="button" id="btn-volgende" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        Oefenen &rarr;
                    </button>
                </div>
            `;
        }
        else if (currentStepIndex === 4) {
            // OEFENEN QUIZ
            const quizData = tData.quiz;
            const currentScenario = quizData[currentQuizIndex];

            const optionsHtml = currentScenario.opties.map((opt, index) => `
                <button type="button" class="quiz-btn" data-index="${index}" style="text-align: left; background: #ffffff; border: 2px solid #e2e8f0; border-radius: 12px; padding: 16px; cursor: pointer; font-size: 15px; color: #1e293b; transition: all 0.2s;">
                    ${escapeHtml(opt.text)}
                </button>
            `).sort(() => Math.random() - 0.5).join('');

            headerTitle.textContent = "Oefenen in de praktijk";
            html = `
                <div class="stagger-1" style="margin-bottom: 24px;">
                    <span style="font-size: 12px; font-weight: 600; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.5px;">Stap 4 van 4</span>
                    <p style="font-size: 15px; color: #475569; margin-top: 6px;">Wat is de beste reactie in deze situatie?</p>
                </div>

                <div class="stagger-2" style="font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 8px;">Scenario ${currentQuizIndex + 1} van ${quizData.length}</div>
                
                <div class="stagger-2 info-block info-block-border-orange" style="margin-bottom: 24px;">
                    <h3 style="font-size: 18px; color: #1e293b; margin-top: 0; margin-bottom: 20px; font-weight: 800; line-height: 1.4;">
                        ${currentScenario.vraag}
                    </h3>
                    
                    <div id="quiz-options" style="display: flex; flex-direction: column; gap: 12px;">
                        ${optionsHtml}
                    </div>

                    <div id="quiz-feedback" style="display: none; margin-top: 20px; padding: 16px; border-radius: 8px; font-size: 14px; line-height: 1.5;"></div>
                </div>

                <div class="stagger-3 button-group" style="display: flex; justify-content: space-between; align-items: center;">
                    <button type="button" id="btn-quiz-back" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        &larr; Vorige
                    </button>
                    <button type="button" id="next-quiz-btn" style="display: none; background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        ${currentQuizIndex < quizData.length - 1 ? 'Volgende scenario &rarr;' : 'Opslaan en Afronden 🎉'}
                    </button>
                </div>
            `;
        }
        else if (currentStepIndex === 5) {
            // SUCCES PAGINA
            html = `
                <div class="stagger-1" style="max-width: 600px; margin: 40px auto; padding: 32px; text-align: center; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                    <div style="font-size: 64px; margin-bottom: 16px; display: inline-block;">✋</div>
                    <h2 style="font-size: 24px; color: #1e293b; margin-bottom: 12px;">Klaar voor weerstand</h2>
                    <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 32px;">
                        Goed gedaan! Door de theorie in de praktijk te oefenen, sta je veel steviger in je schoenen op het moment dat iemand je onverwacht iets aanbiedt.
                    </p>
                    <div class="button-group" style="justify-content: center; gap: 16px;">
                        <button type="button" id="btn-close-module" style="background-color: #2563eb; color: white; border: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 15px; transition: background 0.2s;">
                            Terug naar overzicht
                        </button>
                    </div>
                </div>
            `;
        }

        pageContent.innerHTML = html;

        // Post-render acties (zoals de chat animatie en chips laden)
        if (currentStepIndex === 1) {
            drawChips();
        }

        if (currentStepIndex === 3) {
            const chatBox = container.querySelector('#chat-box');
            tData.chat.forEach((msg, index) => {
                setTimeout(() => {
                    if (!document.getElementById('chat-box')) return;
                    
                    const cssClass = msg.sender === 'user' ? 'chat-user' : 'chat-other';
                    const titleStr = msg.sender === 'user' ? '<strong>Jij:</strong><br>' : '<strong>De ander:</strong><br>';
                    const bubble = document.createElement('div');
                    bubble.className = `chat-bubble ${cssClass}`;
                    bubble.innerHTML = `${titleStr}${msg.text}`;
                    chatBox.appendChild(bubble);
                }, index * 1500 + 500); 
            });
        }

        if (preserveScroll) window.scrollTo(0, scrollY);
        else window.scrollTo(0, 0);
    }

    function drawChips() {
        const containerDiv = container.querySelector('#situaties-container');
        if (!containerDiv) return;
        
        const allSituaties = [...new Set([...standaardSituaties, ...savedData.situaties])];
        
        let html = '';
        allSituaties.forEach(sit => {
            const isSelected = savedData.situaties.includes(sit);
            // Geselecteerde chips gebruiken nu de oranje klasse (ipv blue)
            const colorClass = isSelected ? 'selected-orange' : '';
            html += `
                <button type="button" class="weigeren-chip ${colorClass}" data-val="${escapeHtml(sit)}">
                    ${escapeHtml(sit)} ${isSelected ? '✓' : ''}
                </button>
            `;
        });
        containerDiv.innerHTML = html;
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
            if (e.target.closest('#btn-vorige')) {
                currentStepIndex--;
                renderStep();
                return;
            }
            if (e.target.closest('#btn-volgende')) {
                currentStepIndex++;
                renderStep();
                return;
            }
            if (e.target.closest('#btn-close-module')) {
                if (onComplete) onComplete();
                return;
            }

            // --- Inventarisatie (Stap 1) Acties ---
            const chip = e.target.closest('.weigeren-chip');
            if (chip) {
                const val = chip.getAttribute('data-val');
                if (savedData.situaties.includes(val)) {
                    savedData.situaties = savedData.situaties.filter(s => s !== val);
                } else {
                    savedData.situaties.push(val);
                }
                drawChips();
                return;
            }

            const addBtn = e.target.closest('#btn-add-situatie');
            if (addBtn) {
                const inputEl = container.querySelector('#eigen-situatie-input');
                const val = inputEl.value.trim();
                if (val && !savedData.situaties.includes(val)) {
                    savedData.situaties.push(val);
                    inputEl.value = '';
                    drawChips();
                }
                return;
            }

            // --- Quiz (Stap 4) Acties ---
            const quizBtn = e.target.closest('.quiz-btn');
            if (quizBtn && !quizBtn.classList.contains('disabled')) {
                const index = parseInt(quizBtn.getAttribute('data-index'));
                const currentScenario = tData.quiz[currentQuizIndex];
                const chosenOption = currentScenario.opties[index];
                
                const feedbackBox = container.querySelector('#quiz-feedback');
                const nextQuizBtn = container.querySelector('#next-quiz-btn');
                const optionsContainer = container.querySelector('#quiz-options');
                
                if (chosenOption.correct) {
                    optionsContainer.querySelectorAll('.quiz-btn').forEach(b => b.classList.add('disabled'));
                    
                    quizBtn.classList.remove('selected-incorrect');
                    quizBtn.classList.add('selected-correct');
                    feedbackBox.style.background = '#ecfdf5';
                    feedbackBox.style.border = '1px solid #a7f3d0';
                    feedbackBox.style.color = '#065f46';
                    feedbackBox.innerHTML = `<strong>✅ ${chosenOption.feedback}</strong>`;
                    
                    nextQuizBtn.style.display = 'block';
                } else {
                    quizBtn.classList.add('selected-incorrect');
                    quizBtn.classList.add('disabled');
                    
                    feedbackBox.style.background = '#fef2f2';
                    feedbackBox.style.border = '1px solid #fecaca';
                    feedbackBox.style.color = '#991b1b';
                    feedbackBox.innerHTML = `<strong>❌ ${chosenOption.feedback}</strong> <br><span style="font-size: 13px; opacity: 0.8; margin-top: 4px; display: inline-block;">Probeer het nog eens!</span>`;
                    
                    nextQuizBtn.style.display = 'none';
                }
                
                feedbackBox.style.display = 'block';
                return;
            }

            const nextQuizBtn = e.target.closest('#next-quiz-btn');
            if (nextQuizBtn) {
                if (currentQuizIndex < tData.quiz.length - 1) {
                    currentQuizIndex++;
                    renderStep();
                } else {
                    localStorage.setItem(lsKey, JSON.stringify(savedData));
                    currentStepIndex = 5;
                    triggerConfetti();
                    renderStep();
                }
                return;
            }

            const quizBackBtn = e.target.closest('#btn-quiz-back');
            if (quizBackBtn) {
                if (currentQuizIndex > 0) {
                    currentQuizIndex--;
                    renderStep();
                } else {
                    currentStepIndex = 3; 
                    renderStep(); 
                }
                return;
            }
        });

        // Enter toets voor custom fields
        container.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('custom-weigeren-input')) {
                const addBtn = e.target.nextElementSibling;
                if(addBtn) addBtn.click();
            }
        });
    }

    // Start eerste render
    renderStep();
}