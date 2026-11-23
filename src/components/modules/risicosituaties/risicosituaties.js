// src/components/modules/risicosituaties/risicosituaties.js

function loadCSS() {
    const cssUrl = new URL('./risicosituaties.css', import.meta.url).href;
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

const triggersPerTraject = {
    alcohol: {
        momenten: [
            '🍻 Vrijdagmiddag',
            '🌙 In de avond',
            '🎉 In het weekend',
            '💼 Na werktijd',
            '🍳 Tijdens het koken',
            '🍽️ Bij het eten',
            '💢 Na een ruzie',
            '🌅 Vlak na het opstaan'
        ],
        omgeving: [
            '🍻 De horeca / kroeg',
            '🎈 Een feestje',
            '🏠 Alleen thuis zijn',
            '🛒 De supermarkt',
            '👥 Bepaalde vrienden',
            '🍽️ Restaurant',
            '🥂 Werkborrel',
            '👔 Collega\'s',
            '✈️ Vakantie'
        ],
        gevoelens: [
            '😫 Stress',
            '🥱 Verveling',
            '👤 Eenzaamheid',
            '🌪️ Onrust',
            '🌧️ Somberheid',
            '😁 Blijdschap',
            '😡 Boosheid',
            '😴 Vermoeidheid',
            '🛀 Ontspanning',
            '🍽️ Honger'
        ],
        afleiding: [
            '🚶 Wandelen',
            '💪 Sporten',
            '📱 Telefoongebruik',
            '🎧 Muziek',
            '📞 Iemand bellen / spreken / opzoeken',
            '📺 Tv kijken',
            '🎮 Gamen',
            '🧹 Opruimen'
        ]
    },
    cannabis: {
        momenten: [
            '🌙 In de avond',
            '🛌 Voor het slapen',
            '💼 Na werktijd',
            '🎉 In het weekend',
            '🍽️ Na het eten',
            '🌅 Vlak na het opstaan',
            '🎮 Tijdens het gamen / tv kijken',
            '📅 Vrijdagmiddag',
            '💢 Na een ruzie'
        ],
        omgeving: [
            '🏠 Alleen thuis zijn',
            '🏪 De coffeeshop',
            '👥 Bepaalde vrienden',
            '🎈 Een feestje',
            '📍 Bekende blowplekken',
            '🛋️ Op de bank',
            '👔 Collega\'s',
            '✈️ Vakantie'
        ],
        gevoelens: [
            '🥱 Verveling',
            '😫 Stress',
            '🌪️ Onrust',
            '🌧️ Somberheid',
            '👤 Eenzaamheid',
            '🛌 Slaapproblemen',
            '😴 Vermoeidheid',
            '😡 Boosheid',
            '🛀 Ontspanning',
            '😁 Blijdschap'
        ],
        afleiding: [
            '🚶 Wandelen',
            '💪 Sporten',
            '🍳 Koken / iets klaarmaken',
            '🎧 Muziek',
            '📞 Iemand bellen / spreken / opzoeken',
            '🚴 Fietsen',
            '🧹 Opruimen',
            '📺 Tv kijken / gamen'
        ]
    },
    cocaine: {
        momenten: [
            '🎉 In het weekend',
            '🍺 Na het drinken van alcohol',
            '🌙 Laat in de avond / nacht',
            '📅 Vrijdagmiddag',
            '💶 Salarisdag',
            '💼 Na een drukke werkweek',
            '🪩 Tijdens een afterparty',
            '💢 Na een ruzie'
        ],
        omgeving: [
            '🍻 De horeca / kroeg / club',
            '🎈 Een feestje',
            '👥 Bepaalde vrienden',
            '🏠 Alleen thuis zijn',
            '🎪 Festival',
            '📍 Plekken waar gebruikt wordt',
            '🥂 Werkborrel / collega\'s',
            '✈️ Vakantie'
        ],
        gevoelens: [
            '⚡ Opgewonden / zin in feest',
            '😫 Stress',
            '🥱 Verveling',
            '🌧️ Somberheid',
            '👤 Eenzaamheid',
            '🌪️ Onrust',
            '😔 Onzekerheid',
            '😡 Boosheid',
            '😴 Vermoeidheid',
            '😁 Blijdschap'
        ],
        afleiding: [
            '🚶 Wandelen',
            '💪 Sporten',
            '🚿 Douchen / koud water',
            '🎧 Muziek',
            '📞 Iemand bellen / spreken / opzoeken',
            '🍳 Koken / iets klaarmaken',
            '🎮 Gamen / tv kijken',
            '🧹 Opruimen'
        ]
    },
    gokken: {
        momenten: [
            '🌙 \'s Avonds op telefoon / laptop',
            '💶 Salarisdag / geld op rekening',
            '⚽ Tijdens live sportwedstrijden',
            '🎉 In het weekend',
            '📉 Na een verlies (terug willen winnen)',
            '💼 Na werktijd',
            '📅 Vrijdagmiddag',
            '💢 Na een ruzie'
        ],
        omgeving: [
            '🏠 Alleen thuis zijn',
            '🌐 Gokwebsites & apps',
            '🎰 Casino / speelhal / gokkast',
            '📈 Beurs- / cryptonieuws',
            '📧 Gokreclames / mails',
            '👥 Bepaalde vrienden',
            '🍻 De kroeg (gokkast)',
            '👔 Collega\'s'
        ],
        gevoelens: [
            '🥱 Verveling',
            '⚡ Opgewonden / kick zoeken',
            '😫 Stress',
            '🌪️ Onrust',
            '💸 Geldzorgen / financiële druk',
            '🌧️ Somberheid',
            '👤 Eenzaamheid',
            '😡 Boosheid',
            '😴 Vermoeidheid',
            '😁 Blijdschap'
        ],
        afleiding: [
            '🚶 Wandelen',
            '💪 Sporten',
            '🍳 Koken / iets klaarmaken',
            '🎧 Muziek',
            '📞 Iemand bellen / spreken / opzoeken',
            '🚿 Douchen / koud water',
            '📺 Tv kijken',
            '🧹 Opruimen'
        ]
    }
};

export function renderRisicosituaties(containerElement, onComplete) {
    loadCSS();
    window.scrollTo(0, 0);

    const container = containerElement || document.getElementById('app-content');
    if (!container) return;

    const actiefTraject = localStorage.getItem('actieveVerslaving') || 'alcohol';
    const storageKey = `arminius_risicosituaties_data_${actiefTraject}`;
    const trajectOpties = triggersPerTraject[actiefTraject] || triggersPerTraject.alcohol;

    let actieWerkwoord = 'gebruiken';
    if (actiefTraject === 'alcohol') actieWerkwoord = 'drinken';
    else if (actiefTraject === 'cannabis') actieWerkwoord = 'blowen';
    else if (actiefTraject === 'gokken') actieWerkwoord = 'gokken';

    const categorieen = [
        {
            id: 'momenten',
            icon: '⏱️',
            titel: 'Momenten & Gewoontes',
            desc: 'De tijd van de dag of ingesleten routines die standaard gekoppeld zijn aan de behoefte.',
            opties: trajectOpties.momenten,
            color: 'info-block-border-blue'
        },
        {
            id: 'omgeving',
            icon: '📍',
            titel: 'Mensen & Plaatsen',
            desc: `Specifieke omgevingen of het gezelschap van bepaalde mensen kunnen sterke associaties met ${actieWerkwoord} oproepen.`,
            opties: trajectOpties.omgeving,
            color: 'info-block-border-orange'
        },
        {
            id: 'gevoelens',
            icon: '🎭',
            titel: 'Gevoelens (Interne triggers)',
            desc: 'Soms triggert een specifieke emotie of lichamelijke staat direct de trek.',
            opties: trajectOpties.gevoelens,
            color: 'info-block-border-purple'
        }
    ];

    const afleidingActies = trajectOpties.afleiding;

    function getPrioritizedActions(situatie, traject) {
        const actieDrinken = '🥤 Iets anders te drinken pakken (water/fris)';
        const actieFrisseLucht = '🌬️ Even naar buiten voor frisse lucht';
        const actieHanden = '🪥 Iets met mijn handen doen / tandenpoetsen';
        const actieGeenAlcohol = '🚫 Geen alcohol drinken op dit moment';
        const actieNaarHuis = '🏠 Direct naar huis gaan';
        const actieTelefoonWeg = '📵 Telefoon of laptop direct wegleggen';
        const actieAppSluiten = '❌ Website of app meteen sluiten';

        const actieWeggaan = '🚪 Weggaan uit de situatie';
        const actieAfleiding = '🧩 Afleiding zoeken';
        const actiePraten = '💬 Er met iemand over praten';
        const actieAccepteren = '🧠 Tegen mezelf zeggen dat de drang weggaat';
        const actieAdem = '🫁 Een ademhalingsoefening';
        const actieTellen = '🔢 Tot 10 tellen';

        let baseActions = [actieAfleiding, actiePraten, actieAccepteren, actieAdem, actieTellen];
        if (traject === 'alcohol') baseActions.unshift(actieDrinken);
        else if (traject === 'cannabis') baseActions.unshift(actieFrisseLucht, actieHanden);
        else if (traject === 'cocaine') baseActions.unshift(actieGeenAlcohol, actieNaarHuis);
        else if (traject === 'gokken') baseActions.unshift(actieTelefoonWeg, actieAppSluiten);

        const sit = situatie.toLowerCase();
        let priority = [];

        const weggaanSituaties = [
            'ruzie', 'supermarkt', 'horeca', 'kroeg', 'club', 'werkborrel',
            'onrust', 'boosheid', 'stress', 'feest', 'festival', 'vrienden',
            'coffeeshop', 'blowplek', 'afterparty', 'gebruikt wordt', 'casino', 'speelhal', 'gokkast'
        ];
        const weggaanIsLogisch = weggaanSituaties.some(kw => sit.includes(kw));

        if (weggaanIsLogisch) {
            priority.push(actieWeggaan);
        }

        if (traject === 'gokken' && (sit.includes('telefoon') || sit.includes('website') || sit.includes('app') || sit.includes('sport') || sit.includes('beurs') || sit.includes('reclame') || sit.includes('salaris') || sit.includes('verlies'))) {
            priority.push(actieTelefoonWeg, actieAppSluiten, actieAfleiding);
        } else if (traject === 'cocaine' && (sit.includes('alcohol') || sit.includes('kroeg') || sit.includes('club') || sit.includes('feest') || sit.includes('festival') || sit.includes('afterparty') || sit.includes('borrel'))) {
            priority.push(actieGeenAlcohol, actieNaarHuis, actiePraten);
        } else if (traject === 'cannabis' && (sit.includes('avond') || sit.includes('slapen') || sit.includes('bank') || sit.includes('eten') || sit.includes('gamen'))) {
            priority.push(actieFrisseLucht, actieHanden, actieAfleiding);
        } else if (sit.includes('restaurant') || sit.includes('koken')) {
            if (traject === 'alcohol') priority.push(actieDrinken);
            priority.push(actieTellen, actieAfleiding);
        } else if (sit.includes('alleen') || sit.includes('avond') || sit.includes('verveling') || sit.includes('eenzaam') || sit.includes('weekend') || sit.includes('slapen')) {
            if (traject === 'gokken') priority.push(actieTelefoonWeg);
            priority.push(actieAfleiding, actieAccepteren, actiePraten);
        } else if (sit.includes('ontspanning') || sit.includes('blijdschap') || sit.includes('vakantie')) {
            if (traject === 'alcohol') priority.push(actieDrinken);
            priority.push(actieAccepteren, actieAfleiding);
        } else if (sit.includes('stress') || sit.includes('boos') || sit.includes('ruzie') || sit.includes('onrust') || sit.includes('geldzorgen')) {
            priority.push(actieAdem, actieTellen, actiePraten);
        } else {
            if (traject === 'alcohol') priority.push(actieDrinken);
            else if (traject === 'cannabis') priority.push(actieFrisseLucht);
            else if (traject === 'cocaine') priority.push(actieGeenAlcohol);
            else if (traject === 'gokken') priority.push(actieTelefoonWeg);
            priority.push(actieAfleiding, actiePraten);
        }

        let all = [...new Set([...priority, ...baseActions])];
        if (!weggaanIsLogisch) all.push(actieWeggaan);

        return all;
    }

    let data = JSON.parse(localStorage.getItem(storageKey)) || {
        momenten: [],
        omgeving: [],
        gevoelens: [],
        top3: []
    };

    container.innerHTML = `
        <div style="padding: 20px;">
            <div class="progress-bar-container" style="background: #e2e8f0; height: 6px; border-radius: 3px; margin-bottom: 24px; overflow: hidden; max-width: 700px; margin-left: auto; margin-right: auto;">
                <div class="progress-bar" id="risico-progress-bar" style="width: 25%; background: #2563eb; height: 100%; transition: width 0.4s ease-out;"></div>
            </div>
            
            <div class="module-container risico-container" style="max-width: 700px; margin: 0 auto;">
                <div style="margin-bottom: 32px;" id="risico-main-header">
                    <span style="font-size: 14px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Zelfonderzoek</span>
                    <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Jouw Risicosituaties</h2>
                </div>

                <!-- STAP 0: INTRODUCTIE -->
                <section class="wizard-step active" id="step-0-intro" style="display: block;">
                    <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">
                        <div class="stagger-1 info-block info-block-border-yellow">
                            <span style="font-size: 24px; display: block; margin-bottom: 8px;">🎯</span>
                            <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                                <strong>De rode knoppen van je brein.</strong> Er zijn specifieke momenten, plekken of gevoelens die jouw brein direct koppelt aan de behoefte om te ${actieWerkwoord}. We noemen dit triggers of risicosituaties.
                            </p>
                        </div>
                        <div class="stagger-2 info-block info-block-border-blue">
                            <span style="font-size: 24px; display: block; margin-bottom: 8px;">🗺️</span>
                            <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                                <strong>Je eigen landkaart.</strong> Door deze triggers voor jezelf in kaart te brengen, word je niet meer overvallen door onverwachte trek. Je herkent het moment en kunt je voorbereiden.
                            </p>
                        </div>
                        <div class="stagger-3 info-block info-block-border-green">
                            <span style="font-size: 24px; display: block; margin-bottom: 8px;">🛡️</span>
                            <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                                <strong>Het Signaleringsplan.</strong> In deze module verzamelen we jouw triggers, filteren we je absolute 'Top 3' valkuilen en koppelen we daar direct concrete, helpende acties aan.
                            </p>
                        </div>
                    </div>

                    <div class="stagger-4 button-group" style="display: flex; justify-content: flex-end;">
                        <button type="button" class="btn-primary next-step" data-next="step-1-triggers" style="background-color: #2563eb; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 15px;">Start Zelfonderzoek &rarr;</button>
                    </div>
                </section>

                <!-- STAP 1: TRIGGERS SELECTEREN -->
                <section class="wizard-step" id="step-1-triggers" style="display: none;">
                    <div class="stagger-1" style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 14px; font-weight: 600; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.5px;">Stap 1 van 2</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Wat zijn jouw triggers?</h2>
                        <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-top: 6px;">
                            In welke situaties of bij welke gevoelens is de kans op trek bij jou het grootst? Selecteer alles wat je herkent.
                        </p>
                    </div>

                    ${categorieen.map((cat, idx) => {
                        const customOpties = data[cat.id].filter(optie => !cat.opties.includes(optie));
                        const allItems = [
                            ...cat.opties.map(optie => ({ val: optie, label: optie, isSelected: data[cat.id].includes(optie) })),
                            ...customOpties.map(optie => ({ val: optie, label: `✏️ ${optie}`, isSelected: true }))
                        ];
                        const visibleItems = [
                            ...allItems.slice(0, 4),
                            ...allItems.slice(4).filter(item => item.isSelected)
                        ];
                        const hiddenItems = allItems.slice(4).filter(item => !item.isSelected);

                        return `
                        <div class="info-block stagger-${idx + 1} ${cat.color}" data-cat="${cat.id}">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                                <span style="font-size: 24px;">${cat.icon}</span>
                                <h3 style="font-size: 18px; color: #1e293b; margin: 0;">${cat.titel}</h3>
                            </div>
                            <p style="font-size: 14px; color: #64748b; margin-bottom: 16px;">${cat.desc}</p>
                            
                            <div class="chip-group risico-category" data-cat="${cat.id}">
                                ${visibleItems.map(item => `<div class="risico-chip ${item.isSelected ? 'selected' : ''}" data-value="${escapeHtml(item.val)}">${escapeHtml(item.label)}</div>`).join('')}

                                ${hiddenItems.length > 0 ? `
                                    <div class="chip-group more-risico-${cat.id}" style="display: none; margin: 0; width: 100%;">
                                        ${hiddenItems.map(item => `<div class="risico-chip ${item.isSelected ? 'selected' : ''}" data-value="${escapeHtml(item.val)}">${escapeHtml(item.label)}</div>`).join('')}
                                    </div>
                                ` : ''}
                            </div>

                            ${hiddenItems.length > 0 ? `
                                <button type="button" class="btn-more-risico" data-target="more-risico-${cat.id}" style="background: none; border: none; color: #2563eb; font-weight: 600; cursor: pointer; padding: 0; font-size: 14px; margin-bottom: 16px;">+ Meer voorbeelden...</button>
                            ` : ''}

                            <div class="custom-input-wrapper">
                                <input type="text" class="custom-risico-input input-custom-${cat.id}" placeholder="+ Voeg eigen situatie toe...">
                                <button type="button" class="btn-add-custom btn-add-cat" data-target="${cat.id}">Toevoegen</button>
                            </div>
                        </div>
                        `;
                    }).join('')}

                    <div class="stagger-4 button-group" style="display: flex; justify-content: space-between; margin-top: 32px;">
                        <button type="button" class="btn-secondary prev-step" data-prev="step-0-intro" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                        <button type="button" class="btn-primary" id="btn-to-step2" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">Volgende: Jouw Top 3 &rarr;</button>
                    </div>
                </section>

                <!-- STAP 2: TOP 3 & ACTIES -->
                <section class="wizard-step" id="step-2-top3" style="display: none;">
                    <div class="stagger-1" style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 14px; font-weight: 600; color: #10b981; text-transform: uppercase; letter-spacing: 0.5px;">Stap 2 van 2</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Koppel je acties</h2>
                        <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-top: 6px;">
                            Kies je drie belangrijkste valkuilen en bepaal direct hoe je hier in de toekomst mee om wilt gaan.
                        </p>
                    </div>

                    <div class="stagger-2 info-block info-block-border-blue">
                        <h4 style="font-size: 18px; color: #1e293b; margin: 0 0 4px 0;">Jouw selectie</h4>
                        <p style="font-size: 14px; color: #64748b; margin-bottom: 16px;">Klik op een situatie om hem aan je Top 3 toe te voegen. Klik nogmaals om te verwijderen.</p>
                        
                        <div class="source-columns-grid">
                            <div class="source-col">
                                <h5>⏱️ Momenten</h5>
                                <div id="source-momenten"></div>
                            </div>
                            <div class="source-col">
                                <h5>📍 Plaatsen</h5>
                                <div id="source-omgeving"></div>
                            </div>
                            <div class="source-col">
                                <h5>🎭 Gevoelens</h5>
                                <div id="source-gevoelens"></div>
                            </div>
                        </div>
                    </div>

                    <div class="stagger-3 info-block info-block-border-green" style="padding: 24px;">
                        <h4 style="font-size: 18px; color: #1e293b; margin: 0 0 4px 0;">Jouw Top 3 Valkuilen</h4>
                        <p style="font-size: 14px; color: #64748b; margin-bottom: 24px;">Sleep de blokken om de volgorde aan te passen. Selecteer voor elke situatie minstens één helpende actie.</p>
                        
                        <ul class="top3-list" id="top3-draggable-list">
                            <!-- Injected via updateTop3UI -->
                        </ul>
                    </div>

                    <div class="stagger-4 button-group" style="display: flex; justify-content: space-between; margin-top: 32px;">
                        <button type="button" class="btn-secondary prev-step" data-prev="step-1-triggers" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                            &larr; Terug
                        </button>
                        <button type="button" id="btn-finish-risico" style="background-color: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; transition: opacity 0.2s;" disabled>
                            Opslaan & Afronden 🎉
                        </button>
                    </div>
                </section>

                <!-- STAP 3: AFRONDING -->
                <section class="wizard-step" id="step-3-success" style="display: none;">
                    <div style="max-width: 600px; margin: 40px auto; padding: 32px; text-align: center; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                        <div class="stagger-1">
                            <div style="font-size: 64px; margin-bottom: 16px;">🎯</div>
                            <h2 style="font-size: 24px; color: #1e293b; margin-bottom: 12px;">Module Afgerond!</h2>
                            <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 32px;">
                                Geweldig! Je hebt je belangrijkste risicosituaties en helpende acties in kaart gebracht. Deze vormen een sterke basis voor je persoonlijke Signaleringsplan.
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

    const pageContainer = container.querySelector('.risico-container');
    let draggedIndex = null;

    // --- EVENT DELEGATION VOOR DE HELE MODULE ---
    if (pageContainer) {
        pageContainer.addEventListener('click', (e) => {
            // Navigatie
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

            // Stap 1: Categorie chip klikken
            const catChip = e.target.closest('#step-1-triggers .risico-chip');
            if (catChip) {
                const categoryId = catChip.closest('.risico-category').getAttribute('data-cat');
                const val = catChip.getAttribute('data-value');

                catChip.classList.toggle('selected');
                if (catChip.classList.contains('selected')) {
                    if (!data[categoryId].includes(val)) data[categoryId].push(val);
                } else {
                    data[categoryId] = data[categoryId].filter(v => v !== val);
                }
                return;
            }

            // Stap 1: Custom toevoegen
            const btnAddCat = e.target.closest('.btn-add-cat');
            if (btnAddCat) {
                const categoryId = btnAddCat.getAttribute('data-target');
                const inputEl = pageContainer.querySelector(`.input-custom-${categoryId}`);
                const val = inputEl.value.trim();

                if (val && !data[categoryId].includes(val)) {
                    data[categoryId].push(val);
                    const newChip = document.createElement('div');
                    newChip.className = 'risico-chip selected';
                    newChip.setAttribute('data-value', val);
                    newChip.textContent = `✏️ ${val}`;
                    pageContainer.querySelector(`.risico-category[data-cat="${categoryId}"]`).appendChild(newChip);
                }
                inputEl.value = '';
                return;
            }

            // Stap 1: Meer voorbeelden tonen/verbergen
            const btnMoreRisico = e.target.closest('.btn-more-risico');
            if (btnMoreRisico) {
                const targetClass = btnMoreRisico.getAttribute('data-target');
                const targetDiv = btnMoreRisico.closest('.info-block').querySelector(`.${targetClass}`);
                if (targetDiv) {
                    const isHidden = targetDiv.style.display === 'none';
                    targetDiv.style.display = isHidden ? 'flex' : 'none';
                    btnMoreRisico.textContent = isHidden
                        ? '- Minder voorbeelden...'
                        : '+ Meer voorbeelden...';
                }
                return;
            }

            // Validatie & Transitie naar Stap 2
            const btnToStep2 = e.target.closest('#btn-to-step2');
            if (btnToStep2) {
                const alleGeselecteerd = [...data.momenten, ...data.omgeving, ...data.gevoelens];
                if (alleGeselecteerd.length === 0) {
                    alert("Selecteer in ieder geval één risicosituatie om verder te gaan.");
                    return;
                }
                data.top3 = data.top3.filter(t => alleGeselecteerd.includes(t.situatie));
                buildStep2Sources();
                showStep('step-2-top3');
                return;
            }

            // Stap 2: Source chip klikken
            const sourceChip = e.target.closest('.top3-source-chip');
            if (sourceChip) {
                const sit = sourceChip.getAttribute('data-situatie');
                const index = data.top3.findIndex(i => i.situatie === sit);
                if (index > -1) {
                    data.top3.splice(index, 1);
                } else if (data.top3.length < 3) {
                    data.top3.push({ situatie: sit, acties: [] });
                }
                updateTop3UI();
                return;
            }

            // Stap 2: Acties openklappen
            if (e.target.classList.contains('btn-more-coping')) {
                const targetClass = e.target.getAttribute('data-target');
                const targetDiv = e.target.closest('.slot-coping-section').querySelector(`.${targetClass}`);
                if (targetDiv) {
                    targetDiv.classList.toggle('hidden');
                    e.target.textContent = targetDiv.classList.contains('hidden')
                        ? '+ Meer voorbeelden tonen...'
                        : '- Minder voorbeelden tonen';
                }
                return;
            }

            // Stap 2: Coping chip klikken
            const copingChip = e.target.closest('.coping-chip');
            if (copingChip) {
                const slot = copingChip.closest('.top3-slot');
                const rankIndex = parseInt(slot.getAttribute('data-index'));
                const actie = copingChip.getAttribute('data-actie');
                const top3Item = data.top3[rankIndex];

                if (top3Item) {
                    if (!top3Item.acties.includes(actie)) {
                        top3Item.acties.push(actie);
                    } else {
                        top3Item.acties = top3Item.acties.filter(a => a !== actie);
                    }
                    updateTop3UI();
                }
                return;
            }

            // Stap 2: Custom actie toevoegen
            const btnAddCoping = e.target.closest('.btn-add-coping');
            if (btnAddCoping) {
                const slot = btnAddCoping.closest('.top3-slot');
                const rankIndex = parseInt(slot.getAttribute('data-index'));
                const inputEl = slot.querySelector('.input-coping');
                const actie = inputEl.value.trim();
                const top3Item = data.top3[rankIndex];

                if (actie && top3Item && !top3Item.acties.includes(actie)) {
                    top3Item.acties.push(`✏️ ${actie}`);
                    updateTop3UI();
                }
                return;
            }

            // Afronden
            const btnFinish = e.target.closest('#btn-finish-risico');
            if (btnFinish && !btnFinish.disabled) {
                localStorage.setItem(storageKey, JSON.stringify(data));
                triggerConfetti();
                showStep('step-3-success');
                return;
            }

            // Terug naar dashboard
            const btnDash = e.target.closest('#btn-back-dashboard-final');
            if (btnDash) {
                if (typeof onComplete === 'function') onComplete();
                return;
            }
        });

        // Enter-toets voor eigen invoervelden
        pageContainer.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('custom-risico-input')) {
                e.preventDefault();
                const addBtn = e.target.nextElementSibling;
                if (addBtn) addBtn.click();
            }
        });

        // --- DRAG AND DROP LOGICA ---
        const listContainer = pageContainer.querySelector('#step-2-top3');

        listContainer.addEventListener('dragstart', (e) => {
            const slot = e.target.closest('.top3-slot');
            if (!slot || slot.classList.contains('empty')) {
                e.preventDefault();
                return;
            }
            draggedIndex = parseInt(slot.getAttribute('data-index'));
            slot.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        listContainer.addEventListener('dragend', (e) => {
            const slot = e.target.closest('.top3-slot');
            if (slot) slot.classList.remove('dragging');
            listContainer.querySelectorAll('.top3-slot').forEach(s => s.classList.remove('drag-over'));
        });

        listContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            const slot = e.target.closest('.top3-slot');
            if (slot) {
                e.dataTransfer.dropEffect = 'move';
                slot.classList.add('drag-over');
            }
        });

        listContainer.addEventListener('dragleave', (e) => {
            const slot = e.target.closest('.top3-slot');
            if (slot) slot.classList.remove('drag-over');
        });

        listContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            const slot = e.target.closest('.top3-slot');
            if (!slot) return;

            slot.classList.remove('drag-over');
            const targetIndex = parseInt(slot.getAttribute('data-index'));

            if (draggedIndex !== null && draggedIndex !== targetIndex && data.top3[draggedIndex]) {
                const temp = data.top3[draggedIndex];
                data.top3[draggedIndex] = data.top3[targetIndex];
                data.top3[targetIndex] = temp;

                data.top3 = data.top3.filter(i => i !== undefined);
                updateTop3UI();
            }
            draggedIndex = null;
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
        }

        const progressBarContainer = container.querySelector('.progress-bar-container');
        const progressBar = container.querySelector('#risico-progress-bar');
        const mainHeader = container.querySelector('#risico-main-header');

        if (stepId === 'step-3-success') {
            if (progressBarContainer) progressBarContainer.style.display = 'none';
            if (mainHeader) mainHeader.style.display = 'none';
        } else {
            if (progressBarContainer) progressBarContainer.style.display = 'block';
            if (mainHeader) mainHeader.style.display = 'block';

            if (progressBar) {
                if (stepId === 'step-0-intro') progressBar.style.width = '25%';
                else if (stepId === 'step-1-triggers') progressBar.style.width = '50%';
                else if (stepId === 'step-2-top3') progressBar.style.width = '75%';
            }
        }
    }

    function buildStep2Sources() {
        const populateSourceCol = (catId, targetId) => {
            const targetDiv = pageContainer.querySelector(`#${targetId}`);
            if (!targetDiv) return;
            targetDiv.innerHTML = data[catId].map(sit => `
                <div class="top3-source-chip" data-situatie="${escapeHtml(sit)}">
                    <span>${escapeHtml(sit)}</span><span class="badge-rank"></span>
                </div>
            `).join('');
        };

        populateSourceCol('momenten', 'source-momenten');
        populateSourceCol('omgeving', 'source-omgeving');
        populateSourceCol('gevoelens', 'source-gevoelens');

        updateTop3UI();
    }

    function updateTop3UI() {
        const sourceChips = pageContainer.querySelectorAll('.top3-source-chip');
        sourceChips.forEach(chip => {
            const sit = chip.getAttribute('data-situatie');
            const rankIndex = data.top3.findIndex(i => i.situatie === sit);
            const badge = chip.querySelector('.badge-rank');

            if (rankIndex > -1) {
                chip.classList.add('in-top3');
                badge.textContent = `#${rankIndex + 1}`;
            } else {
                chip.classList.remove('in-top3');
                badge.textContent = '';
            }
        });

        const listContainer = pageContainer.querySelector('#top3-draggable-list');
        if (!listContainer) return;

        listContainer.innerHTML = '';

        for (let i = 1; i <= 3; i++) {
            const item = data.top3[i - 1];
            const li = document.createElement('li');
            li.id = `top-rank-${i}`;
            li.setAttribute('data-index', i - 1);

            if (item) {
                li.className = 'top3-slot filled';
                li.setAttribute('draggable', 'true');

                const allPrioritized = getPrioritizedActions(item.situatie, actiefTraject);
                const shownBase = allPrioritized.slice(0, 3);
                const hiddenBase = allPrioritized.slice(3);

                const renderChip = (actie) => {
                    const sel = item.acties.includes(actie) ? 'selected' : '';
                    return `<div class="risico-chip coping-chip ${sel}" data-actie="${escapeHtml(actie)}">${escapeHtml(actie)}</div>`;
                };

                item.acties.forEach(actie => {
                    if (hiddenBase.includes(actie)) {
                        hiddenBase.splice(hiddenBase.indexOf(actie), 1);
                        shownBase.push(actie);
                    }
                });

                const shownHTML = shownBase.map(renderChip).join('');
                const hiddenHTML = hiddenBase.map(renderChip).join('');

                const customHTML = item.acties
                    .filter(a => !allPrioritized.includes(a) && !afleidingActies.includes(a))
                    .map(renderChip).join('');

                const isAfleidingSelected = item.acties.includes('🧩 Afleiding zoeken') || item.acties.some(a => afleidingActies.includes(a));

                let afleidingSubPanelHTML = '';
                if (isAfleidingSelected) {
                    afleidingSubPanelHTML = `
                        <div class="sub-coping-section">
                            <p class="sub-coping-title">Vormen van afleiding</p>
                            <p class="sub-coping-desc">Welke specifieke afleiding helpt jou op dit moment?</p>
                            <div class="chip-group">
                                ${afleidingActies.map(renderChip).join('')}
                            </div>
                        </div>
                    `;
                }

                li.innerHTML = `
                    <div class="top3-slot-header">
                        <span class="rank-num">${i}</span>
                        <span class="slot-text">${escapeHtml(item.situatie)}</span>
                        <span class="drag-handle">⋮⋮</span>
                    </div>
                    <div class="slot-coping-section">
                        <p style="margin: 0 0 10px 0; font-size: 15px; font-weight: 700; color: #475569;">Helpende acties:</p>
                        <div class="chip-group coping-chip-container">
                            ${shownHTML}
                            ${customHTML}
                            <div class="chip-group hidden more-coping-${i}" style="margin:0;">
                                ${hiddenHTML}
                            </div>
                        </div>
                        <button type="button" class="btn-more-coping" data-target="more-coping-${i}">+ Meer voorbeelden tonen...</button>
                        
                        ${afleidingSubPanelHTML}

                        <div class="custom-input-wrapper" style="margin-top: 12px;">
                            <input type="text" class="custom-risico-input input-coping" placeholder="+ Eigen actie toevoegen...">
                            <button type="button" class="btn-add-custom btn-add-coping" data-index="${i - 1}">Toevoegen</button>
                        </div>
                    </div>
                `;
            } else {
                li.className = 'top3-slot empty';
                li.innerHTML = `
                    <span class="rank-num">${i}</span>
                    <span class="slot-text empty">Klik bovenaan op je ${i === 1 ? 'belangrijkste' : i + 'e'} situatie...</span>
                `;
            }
            listContainer.appendChild(li);
        }

        const totalAvailable = sourceChips.length;
        const targetCount = Math.min(3, totalAvailable);
        const incompleet = data.top3.some(t => t.acties.length === 0);

        const btnFinish = pageContainer.querySelector('#btn-finish-risico');
        if (btnFinish) {
            btnFinish.disabled = totalAvailable === 0 || data.top3.length < targetCount || incompleet;
            btnFinish.style.opacity = btnFinish.disabled ? '0.5' : '1';
        }
    }
}