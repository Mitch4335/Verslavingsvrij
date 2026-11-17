// src/components/gereedschapskist/leefstijl/leefstijl.js

function loadCSS() {
    const cssUrl = new URL('./leefstijl.css', import.meta.url).href;
    if (!document.querySelector(`link[href="${cssUrl}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssUrl;
        document.head.appendChild(link);
    }
}

// --- DATA VOOR DE INTERACTIEVE SCAN & TIPS ---
const scanVragen = [
    { id: 'voeding', vraag: 'Voeding: Hoe vaak eet je dagelijks een basis van verse onbewerkte producten, groente en fruit?' },
    { id: 'slaap', vraag: 'Slaap: Hoe regelmatig is je bedtijd en word je redelijk uitgerust wakker?' },
    { id: 'structuur', vraag: 'Structuur: Hoeveel vaste gewoontes en rustmomenten zitten er momenteel in je dag?' },
    { id: 'beweging', vraag: 'Beweging: Onderbreek je het zitten regelmatig om even te bewegen of te wandelen?' }
];

const praktischeTips = {
    voeding: {
        titel: "Voeding Opladen",
        intro: "Kies voor pure brandstof. Bewerkte voeding kost je lichaam meer energie dan het oplevert.",
        tips: [
            "Lees het etiket: heeft een product een lange lijst met suikers en onbekende toevoegingen? Laat het dan liggen.",
            "Het beste etiket is géén etiket: pure producten zoals groente, fruit, ongezouten noten en eieren hebben geen ingrediëntenlijst nodig.",
            "Zet een vol glas water naast je bed en drink dit direct leeg zodra je wakker wordt."
        ],
        kleur: '#eab308' 
    },
    slaap: {
        titel: "Slaap Opladen",
        intro: "Slaap is geen passieve pauze, maar het belangrijkste actieve herstelmoment voor je brein.",
        tips: [
            "You snooze, you lose: zet je wekker buiten handbereik. Door te snoozen verlies je juist je meest waardevolle diepe slaap of REM-slaap.",
            "Plan een 'piekerkwartier' eerder op de avond. Schrijf je gedachten van je af (bijvoorbeeld in het Dagboek van deze app), zodat je hoofd leeg is als je naar bed gaat.",
            "Zet de verwarming in je slaapkamer uit. Een koele kamer (tussen de 15 en 18 graden) helpt je lichaam om in de diepe slaap te komen."
        ],
        kleur: '#8b5cf6' 
    },
    structuur: {
        titel: "Structuur & Stress Opladen",
        intro: "Breng je zenuwstelsel tot rust door kleine ankers in je dag te bouwen.",
        tips: [
            "Maak je bed op zodra je wakker wordt. Dit piepkleine succes activeert direct een gevoel van structuur en controle.",
            "Gebruik de 4-7-8 methode als je onrust voelt: adem 4 seconden in, houd 7 seconden vast, en adem 8 seconden uit. Dit kalmeert direct je zenuwstelsel.",
            "Voorkom 'alles-of-niets' denken. Een kleine misstap is slechts een 'glijmoment', geen volledige terugval. Pak je routine de volgende minuut gewoon weer op."
        ],
        kleur: '#3b82f6' 
    },
    beweging: {
        titel: "Beweging Opladen",
        intro: "Je hoeft niet direct te sporten. Het doorbreken van langdurig zitten is de allerbelangrijkste eerste stap.",
        tips: [
            "Gebruik de 2-minutenregel: onderbreek het zitten elke 30 tot 60 minuten met slechts 1 tot 2 minuten beweging. Dit verlaagt direct je spanning en balanceert je bloedsuiker.",
            "Maak bewegen ongemerkt onderdeel van je routine: loop rond tijdens het telefoneren of neem altijd de trap.",
            "Ga naar buiten. Buiten wandelen of in de natuur zijn ('bosbaden') verlaagt direct je stresshormonen en ontstekingswaarden."
        ],
        kleur: '#10b981' 
    }
};

// --- DATA VOOR DE KENNISBANK ---
const leefstijlData = {
    voeding: {
        titel: "Voeding & Energie", subtitel: "Kies de juiste brandstof", icon: "🍏", bg: "#fefce8",
        intro: "Eten is meer dan vulling; het geeft je hersenen de energie die nodig is om de dag rustig door te komen.",
        lessen: [
            {
                id: "darmen", titel: "Je tweede brein", desc: "De connectie tussen darm en hoofd.", icon: "🦠", mediaType: "bouwstoffen",
                tekst: `<h3>De nervus vagus</h3><p>Je darmen bevatten biljoenen bacteriën die letterlijk als een tweede brein fungeren. Ze communiceren direct met je hersenen via de nervus vagus (een belangrijke hersenzenuw). Wat je eet, beïnvloedt dus direct hoe jij je mentaal voelt en hoeveel stress je ervaart.</p>`
            },
            {
                id: "leaky", titel: "De lekkende darm", desc: "Ontstekingen en je stemming.", icon: "🔥", mediaType: "bewerkt",
                tekst: `<h3>Stress en bewerkt eten</h3><p>Te veel suiker, sterk bewerkte fabrieksvoeding en chronische stress kunnen leiden tot een "leaky gut" (een lekkende darm). Dit veroorzaakt kleine ontstekingen in je lichaam die je niet direct voelt als pijn, maar die je stemming en energieniveau wel zwaar onderuit halen.</p>`
            },
            {
                id: "koolhydraten", titel: "Snelle en Langzame Energie", desc: "Voorkom pieken en dalen.", icon: "🌾", mediaType: "koolhydraten",
                tekst: `<h3>De achtbaan in je bloed</h3><p>Suikers en snelle koolhydraten (witbrood, snoep) schieten direct je bloed in. De crash die volgt voelt vaak als paniek of trek. <strong>Langzame energie</strong> (havermout, volkoren) druppelt rustig je bloed in. Je voelt je urenlang stabiel.</p>`
            }
        ]
    },
    slaap: {
        titel: "Slaap & Herstel", subtitel: "De actieve wasstraat voor je brein", icon: "🌙", bg: "#f5f3ff",
        intro: "Slaap is geen passieve pauze. Het is het moment waarop je lichaam fysiek herstelt en je emoties verwerkt.",
        lessen: [
            {
                id: "actief", titel: "Slaap is keihard werken", desc: "Fysiek en emotioneel herstel.", icon: "🧠", mediaType: "slaapdruk",
                tekst: `<h3>Het verwerken van de dag</h3><p>Tijdens het slapen repareert je lichaam cellen en weefsels. Daarnaast verwerk je in je REM-slaap (de droomfase) alle intense emoties en informatie van de dag. Zonder deze diepe slaap blijf je overdag emotioneel instabiel en vatbaarder voor triggers.</p>`
            },
            {
                id: "jetlag", titel: "De Social Jetlag", desc: "Waarom uitslapen tegenwerkt.", icon: "⏱️", mediaType: "ritueel", 
                tekst: `<h3>Je Innerlijke Klok</h3><p>Als je in het weekend veel later naar bed gaat en later opstaat dan doordeweeks, creëer je wekelijks een "social jetlag". Je biologische klok raakt hiervan compleet ontregeld, wat resulteert in slaapproblemen en constante vermoeidheid door de week heen.</p>`
            },
            {
                id: "avondritueel", titel: "Rust in de avond", desc: "Melatonine en donkerte.", icon: "💡", mediaType: "avond",
                tekst: `<h3>Licht is de schakelaar</h3><p>Je maakt het slaaphormoon <strong>melatonine</strong> alleen aan als het donker is. Fel licht (vooral van telefoons) blokkeert dit direct. Zet lampen een uur voor bedtijd zachter, plan een 'piekerkwartier' in, en zorg voor een koele kamer (15-18 graden) om de diepe slaap te bevorderen.</p>`
            }
        ]
    },
    structuur: {
        titel: "Stress & Gewoontes", subtitel: "Kalmeer je overlevingsstand", icon: "🗓️", bg: "#eff6ff",
        intro: "Door structuur aan te brengen en je stress-reacties te begrijpen, voorkom je dat je op de automatische piloot terugvalt in oud gedrag.",
        lessen: [
            {
                id: "stress", titel: "Fight, Flight, Freeze, Fawn", desc: "Hoe je zenuwstelsel reageert.", icon: "⚡", mediaType: "omgeving",
                tekst: `<h3>Meer dan vechten of vluchten</h3><p>Als je stress ervaart of getriggerd wordt, schakelt je brein onbewust over naar de overlevingsstand. Dit is niet alleen 'Fight' (vechten) of 'Flight' (vluchten). Soms reageer je met 'Freeze' (verstijven, niks meer kunnen) of 'Fawn' (extreem meebuigen, pleasen en conflicten vermijden ten koste van jezelf).</p>`
            },
            {
                id: "terugval", titel: "Glijmoment vs Terugval", desc: "Alles-of-niets denken.", icon: "📉", mediaType: "klein",
                tekst: `<h3>Een misstap is niet het einde</h3><p>Een kortdurend 'glijmoment' (een kleine misstap) is normaal bij gedragsverandering. Pas als je denkt: "Nu is toch alles al verpest, ik kan net zo goed doorgaan" (alles-of-niets denken), wordt het een volledige terugval. Herken dit vroege signaal en pak je goede routine de volgende minuut gewoon weer op.</p>`
            },
            {
                id: "koppelen", titel: "Gewoontes koppelen", desc: "De bestaande routine gebruiken.", icon: "🔗", mediaType: "koppelen",
                tekst: `<h3>Plak het vast</h3><p>Wilskracht is een batterij die leeg kan raken. Koppel nieuwe acties daarom altijd direct aan een bestaande gewoonte. Bijv: 'Direct nadat ik mijn tanden poets, doe ik de 4-7-8 ademhalingsoefening'. Zo kost het je geen mentale energie meer.</p>`
            }
        ]
    },
    beweging: {
        titel: "Lichaamsbeweging", subtitel: "Stress uit je lijf halen", icon: "🏃", bg: "#f0fdf4",
        intro: "Bewegen is de snelste manier om opgebouwde spanning kwijt te raken, en het hoeft absoluut geen topsport te zijn.",
        lessen: [
            {
                id: "mythe", titel: "De 10.000 stappen mythe", desc: "Kleine stapjes maken het verschil.", icon: "🚶", mediaType: "wandelen",
                tekst: `<h3>Je hoeft geen marathon te lopen</h3><p>Het idee dat je dagelijks 10.000 stappen móét zetten, is ontstaan als een marketingstunt. Wetenschappelijk is bewezen dat je al bij 2.600 tot 2.800 stappen per dag significante gezondheidsvoordelen en minder stress ervaart. Laat de perfectie los.</p>`
            },
            {
                id: "zitten", titel: "Doorbreek het zitten", desc: "De 2-minutenregel.", icon: "⏱️", mediaType: "klein",
                tekst: `<h3>Korte pauzes, groot effect</h3><p>Je hoeft je niet direct in het zweet te werken. Onderbreek langdurig zitten simpelweg elke 30 tot 60 minuten. Een extreem korte beweging van 1 tot 2 minuten verlaagt direct je spanning en houdt je bloedsuiker stabiel.</p>`
            },
            {
                id: "buiten", titel: "De kracht van de natuur", desc: "Bosbaden en daglicht.", icon: "☀️", mediaType: "buiten",
                tekst: `<h3>Shinrin-yoku</h3><p>Buiten zijn in de natuur, ook wel 'bosbaden' genoemd, prikkelt je parasympathische zenuwstelsel (je rust-stand). Dit verlaagt onmiddellijk de ontstekingswaarden en stresshormonen in je lichaam, en helpt je om uit je hoofd te komen.</p>`
            }
        ]
    }
};

// Functie voor de SVG animaties (kennisbank)
function getMediaHtml(mediaType) {
    if (mediaType === 'koolhydraten') return `<div style="display:flex; justify-content:center; width:100%;"><span class="anim-float" style="animation-delay:0s;">🍞</span><span class="anim-float" style="animation-delay:1.5s;">🥣</span><span class="anim-float" style="animation-delay:0.7s;">🍠</span></div>`;
    if (mediaType === 'bouwstoffen') return `<div style="display:flex; justify-content:center; width:100%;"><span class="anim-pulse" style="animation-delay:0s;">🧠</span><span class="anim-pulse" style="animation-delay:1s;">⚡</span><span class="anim-pulse" style="animation-delay:2s;">🦠</span></div>`;
    if (mediaType === 'bewerkt') return `<div style="display:flex; justify-content:center; width:100%;"><span class="anim-float" style="filter:grayscale(50%);">🌭</span><span class="anim-float" style="animation-delay:1s; filter:grayscale(50%);">🔥</span><span class="anim-float" style="animation-delay:2s; filter:grayscale(50%);">🍩</span></div>`;
    if (mediaType === 'slaapdruk') return `<div style="display:flex; justify-content:center; width:100%;"><span class="anim-pulse">💭</span><span class="anim-pulse" style="animation-delay:1s;">🛠️</span><span class="anim-pulse" style="animation-delay:2s;">🔋</span></div>`;
    if (mediaType === 'ritueel') return `<div style="display:flex; justify-content:center; width:100%;"><span class="anim-float">⏰</span><span class="anim-float" style="animation-delay:1s;">📅</span><span class="anim-float" style="animation-delay:2s;">🔄</span></div>`;
    if (mediaType === 'avond') return `<div style="display:flex; justify-content:center; align-items:center; width:100%; height:100px; position:relative;"><span class="icon-transition">📵</span><span class="icon-transition" style="animation-delay:2s; opacity:0;">📝</span><span class="icon-transition" style="animation-delay:4s; opacity:0;">❄️</span></div>`;
    if (mediaType === 'omgeving') return `<div style="display:flex; justify-content:center; align-items:center; width:100%; height:100px; position:relative;"><span class="icon-transition">🏃</span><span class="icon-transition" style="animation-delay:1.5s; opacity:0;">🛡️</span><span class="icon-transition" style="animation-delay:3s; opacity:0;">🧊</span><span class="icon-transition" style="animation-delay:4.5s; opacity:0;">🤝</span></div>`;
    if (mediaType === 'koppelen') return `<div style="display:flex; justify-content:center; align-items:center; gap:24px; width:100%;"><span class="anim-pulse" style="font-size:48px;">🪥</span><span style="font-size:32px; color:#cbd5e1; font-weight:bold;">+</span><span class="anim-pulse" style="font-size:48px; animation-delay:0.5s;">🧘</span></div>`;
    if (mediaType === 'klein') return `<div style="display:flex; justify-content:center; width:100%;"><span class="anim-float">📉</span><span class="anim-float" style="animation-delay:0.5s;">⚠️</span><span class="anim-float" style="animation-delay:1s;">🔄</span></div>`;
    if (mediaType === 'wandelen') return `<div style="display:flex; justify-content:center; width:100%;"><span class="anim-float">🚶</span><span class="anim-float" style="animation-delay:1s;">🎯</span><span class="anim-float" style="animation-delay:2s;">2.6k</span></div>`;
    if (mediaType === 'sport') return `<div style="display:flex; justify-content:center; width:100%;"><span class="anim-pulse">🏋️</span><span class="anim-pulse" style="animation-delay:1s;">💦</span><span class="anim-pulse" style="animation-delay:2s;">🏃</span></div>`;
    if (mediaType === 'buiten') return `<div style="display:flex; justify-content:center; width:100%;"><span class="anim-float">☀️</span><span class="anim-float" style="animation-delay:1.5s;">🌳</span><span class="anim-float" style="animation-delay:0.7s;">🌲</span></div>`;
    return `<div style="font-size: 48px;">✨</div>`;
}
export function renderLeefstijlModule(containerElement, onBackToKist) {
    loadCSS();
    window.scrollTo(0, 0);

    const container = containerElement || document.getElementById('app-content');
    if (!container) return;

    let currentView = 'overview'; 
    let activeThema = null;
    let activeLes = null;
    
    let batterijScores = JSON.parse(localStorage.getItem('arminius_leefstijl_scores')) || null;
    let actieveVraagIndex = 0;
    let tempScores = {}; 

    function saveScores(scores) {
        batterijScores = scores;
        localStorage.setItem('arminius_leefstijl_scores', JSON.stringify(scores));
    }

    function tekenBatterijBlokjes(score, kleur) {
        let blokjesHtml = '';
        for(let i=1; i<=3; i++) {
            const isGevuld = i <= score;
            const bg = isGevuld ? kleur : '#e2e8f0';
            blokjesHtml += `<div class="b-block" style="background-color: ${bg};"></div>`;
        }
        return `<div class="battery-blocks">${blokjesHtml}</div>`;
    }

    function renderView() {
        const scrollY = window.scrollY;

        if (currentView === 'overview') {
            let html = `
                <div style="padding: 20px;">
                    <div class="module-container ls-container" style="max-width: 650px; margin: 0 auto;">
                        <div style="margin-bottom: 24px;" class="stagger-1">
                            <span style="font-size: 14px; font-weight: 800; color: #ec4899; text-transform: uppercase; letter-spacing: 1px;">Hulpmiddelen</span>
                            <h2 style="font-size: 28px; color: #1e293b; margin-top: 4px; font-weight: 800;">Leefstijl & Fundament</h2>
                        </div>
            `;

            html += `<h3 class="sectie-titel stagger-1">Hoe vol is jouw batterij?</h3>`;
            
            if (!batterijScores) {
                html += `
                    <div class="scan-card stagger-2">
                        <div style="font-size: 40px; margin-bottom: 12px;">🔋</div>
                        <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size: 18px;">Check je fundament</h4>
                        <p style="color: #64748b; font-size: 14px; margin: 0 0 20px 0; line-height: 1.5;">
                            Door middel van 4 korte vragen brengen we in kaart welk onderdeel van jouw leefstijl deze week wel wat extra energie kan gebruiken.
                        </p>
                        <button class="btn-primary start-scan-btn">Doe de Leefstijl Scan</button>
                    </div>
                `;
            } else {
                html += `
                    <div class="stagger-2">
                        <p style="font-size: 14px; color: #475569; margin-bottom: 16px;">Tik op een batterij om praktische tips te zien voor dit onderdeel.</p>
                        <div class="battery-grid">
                            <div class="battery-item open-focus" data-domein="voeding">
                                <div class="battery-info">
                                    <div class="battery-icon">🍏</div>
                                    <span class="battery-name">Voeding</span>
                                </div>
                                ${tekenBatterijBlokjes(batterijScores.voeding, praktischeTips.voeding.kleur)}
                            </div>
                            <div class="battery-item open-focus" data-domein="slaap">
                                <div class="battery-info">
                                    <div class="battery-icon">🌙</div>
                                    <span class="battery-name">Slaap</span>
                                </div>
                                ${tekenBatterijBlokjes(batterijScores.slaap, praktischeTips.slaap.kleur)}
                            </div>
                            <div class="battery-item open-focus" data-domein="structuur">
                                <div class="battery-info">
                                    <div class="battery-icon">🗓️</div>
                                    <span class="battery-name">Structuur</span>
                                </div>
                                ${tekenBatterijBlokjes(batterijScores.structuur, praktischeTips.structuur.kleur)}
                            </div>
                            <div class="battery-item open-focus" data-domein="beweging">
                                <div class="battery-info">
                                    <div class="battery-icon">🏃</div>
                                    <span class="battery-name">Beweging</span>
                                </div>
                                ${tekenBatterijBlokjes(batterijScores.beweging, praktischeTips.beweging.kleur)}
                            </div>
                        </div>
                        <div style="text-align: center;">
                            <button class="btn-secondary start-scan-btn" style="display: inline-flex; width: auto; font-size: 15px; padding: 10px 20px;">
                                🔄 Scan opnieuw doen
                            </button>
                        </div>
                    </div>
                `;
            }

            html += `
                <h3 class="sectie-titel stagger-3" style="margin-top: 40px;">Kennisbank: Hoe werkt je lichaam?</h3>
                <div class="stagger-4">
            `;

            Object.keys(leefstijlData).forEach((key) => {
                const pijler = leefstijlData[key];
                html += `
                    <div class="pillar-card nav-to-thema" data-thema="${key}">
                        <div class="pillar-info">
                            <div class="pillar-icon" style="background-color: ${pijler.bg};">${pijler.icon}</div>
                            <div>
                                <h3 class="pillar-title">${pijler.titel}</h3>
                                <p class="pillar-subtitle">${pijler.subtitel}</p>
                            </div>
                        </div>
                        <div class="pillar-arrow">&rarr;</div>
                    </div>
                `;
            });

            html += `
                        </div>
                        <div class="stagger-4" style="margin-top: 32px;">
                            <button id="btn-terug-kist" class="btn-secondary">&larr; Terug naar Hulpmiddelen</button>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML = html;

        } else if (currentView === 'vragenlijst') {
            const vraagObj = scanVragen[actieveVraagIndex];
            
            let html = `
                <div style="padding: 20px;">
                    <div class="module-container ls-container" style="max-width: 650px; margin: 0 auto;">
                        <div style="margin-bottom: 24px;">
                            <span style="font-size: 15px; font-weight: 700; color: #94a3b8;">Vraag ${actieveVraagIndex + 1} van ${scanVragen.length}</span>
                        </div>
                        
                        <div class="vraag-card stagger-1">
                            <h4>${vraagObj.vraag}</h4>
                            <div class="antwoord-opties">
                                <button class="antwoord-btn" data-score="1" data-domein="${vraagObj.id}">Zelden of nooit (kost me moeite)</button>
                                <button class="antwoord-btn" data-score="2" data-domein="${vraagObj.id}">Soms (ik probeer het wel)</button>
                                <button class="antwoord-btn" data-score="3" data-domein="${vraagObj.id}">Meestal (dit gaat best goed)</button>
                            </div>
                        </div>

                        <div class="stagger-2" style="margin-top: 24px;">
                            <button id="btn-annuleer-scan" class="btn-secondary">Annuleren</button>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML = html;

        } else if (currentView === 'focus') {
            const data = praktischeTips[activeThema];
            
            let html = `
                <div style="padding: 20px;">
                    <div class="module-container ls-container" style="max-width: 650px; margin: 0 auto;">
                        
                        <div style="margin-bottom: 24px; text-align: center;" class="stagger-1">
                            <div class="battery-icon" style="margin: 0 auto 16px auto; font-size: 40px; width: 72px; height: 72px;">${leefstijlData[activeThema].icon}</div>
                            <h2 style="font-size: 24px; color: #1e293b; margin: 0 0 8px 0; font-weight: 800;">${data.titel}</h2>
                            <p style="color: #64748b; font-size: 15px; margin: 0;">${data.intro}</p>
                        </div>

                        <div class="stagger-2">
                            <h3 class="sectie-titel" style="margin-top: 0;">Actiepunten voor deze week</h3>
                            <ul class="tip-list">
                                ${data.tips.map(tip => `
                                    <li class="tip-item">
                                        <div class="tip-icon">💡</div>
                                        <p class="tip-text">${tip}</p>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>

                        <div class="stagger-3 scan-card" style="margin-top: 24px; text-align: left;">
                            <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size: 16px;">Wil je begrijpen waarom dit werkt?</h4>
                            <p style="color: #64748b; font-size: 14px; margin: 0 0 16px 0;">Lees de theorie over hoe jouw lichaam hierop reageert in de Kennisbank.</p>
                            <button class="btn-secondary nav-to-thema" data-thema="${activeThema}" style="background-color: #ffffff; border: 1px solid #cbd5e1; justify-content: flex-start;">
                                📖 Lees theorie over ${leefstijlData[activeThema].titel}
                            </button>
                        </div>
                        
                        <div class="stagger-4" style="margin-top: 32px;">
                            <button id="btn-terug-overzicht" class="btn-primary" style="width: 100%; margin-bottom: 12px;">Ik ga hiermee aan de slag</button>
                            <button id="btn-terug-overzicht" class="btn-secondary" style="background: transparent;">Kies een ander domein</button>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML = html;
            window.scrollTo(0, 0);

        } else if (currentView === 'thema') {
            const data = leefstijlData[activeThema];
            
            let html = `
                <div style="padding: 20px;">
                    <div class="module-container ls-container" style="max-width: 650px; margin: 0 auto;">
                        
                        <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0;" class="stagger-1">
                            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 12px;">
                                <div class="pillar-icon" style="background-color: ${data.bg};">${data.icon}</div>
                                <div>
                                    <span style="font-size: 14px; font-weight: 800; color: #64748b; text-transform: uppercase;">Kennisbank</span>
                                    <h2 style="font-size: 24px; color: #1e293b; margin: 0; font-weight: 800;">${data.titel}</h2>
                                </div>
                            </div>
                            <p style="margin: 0; font-size: 15px; color: #475569;">${data.intro}</p>
                        </div>

                        <div class="chapter-list stagger-2">
            `;

            data.lessen.forEach((les) => {
                html += `
                    <div class="chapter-card nav-to-les" data-les="${les.id}">
                        <div class="chapter-icon">${les.icon}</div>
                        <div class="chapter-text">
                            <h4>${les.titel}</h4>
                            <p>${les.desc}</p>
                        </div>
                    </div>
                `;
            });

            html += `
                        </div>
                        
                        <div class="stagger-3" style="margin-top: 32px;">
                            <button id="btn-terug-overzicht" class="btn-secondary">&larr; Terug naar overzicht</button>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML = html;
            window.scrollTo(0, 0);

        } else if (currentView === 'les') {
            const themaData = leefstijlData[activeThema];
            const lesData = themaData.lessen.find(l => l.id === activeLes);

            let html = `
                <div style="padding: 20px;">
                    <div class="module-container ls-container" style="max-width: 650px; margin: 0 auto;">
                        
                        <div class="lesson-header stagger-1">
                            <span style="font-size: 14px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 8px; display: block;">${themaData.titel}</span>
                            <h2>${lesData.titel}</h2>
                            <p>${lesData.desc}</p>
                        </div>

                        <div class="lesson-media-box stagger-2">
                            ${getMediaHtml(lesData.mediaType)}
                        </div>

                        <div class="lesson-content stagger-3">
                            ${lesData.tekst}
                        </div>
                        
                        <div class="stagger-3" style="margin-top: 48px;">
                            <button id="btn-terug-thema" class="btn-secondary">&larr; Terug</button>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML = html;
            window.scrollTo(0, 0);
        }
    }

    function bindEvents() {
        container.onclick = (e) => {
            if (e.target.closest('#btn-terug-kist')) {
                if (onBackToKist) onBackToKist();
                return;
            }
            if (e.target.closest('#btn-terug-overzicht')) {
                currentView = 'overview';
                renderView();
                return;
            }
            if (e.target.closest('#btn-terug-thema')) {
                currentView = 'thema';
                renderView();
                return;
            }
            if (e.target.closest('.start-scan-btn')) {
                tempScores = {};
                actieveVraagIndex = 0;
                currentView = 'vragenlijst';
                renderView();
                return;
            }
            if (e.target.closest('#btn-annuleer-scan')) {
                currentView = 'overview';
                renderView();
                return;
            }

            const antwoordBtn = e.target.closest('.antwoord-btn');
            if (antwoordBtn) {
                const score = parseInt(antwoordBtn.getAttribute('data-score'));
                const domein = antwoordBtn.getAttribute('data-domein');
                
                tempScores[domein] = score;
                
                if (actieveVraagIndex < scanVragen.length - 1) {
                    actieveVraagIndex++;
                    renderView();
                } else {
                    saveScores(tempScores);
                    currentView = 'overview';
                    renderView();
                }
                return;
            }

            const focusCard = e.target.closest('.open-focus');
            if (focusCard) {
                activeThema = focusCard.getAttribute('data-domein');
                currentView = 'focus';
                renderView();
                return;
            }

            const themaCard = e.target.closest('.nav-to-thema');
            if (themaCard) {
                activeThema = themaCard.getAttribute('data-thema');
                currentView = 'thema';
                renderView();
                return;
            }

            const lesCard = e.target.closest('.nav-to-les');
            if (lesCard) {
                activeLes = lesCard.getAttribute('data-les');
                currentView = 'les';
                renderView();
                return;
            }
        };
    }

    renderView();
    bindEvents();
}