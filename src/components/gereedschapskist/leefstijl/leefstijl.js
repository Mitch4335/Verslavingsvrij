// src/components/gereedschapskist/leefstijl/leefstijl.js

function loadCSS() {
    const cssUrl = new URL('./leefstijl.css', import.meta.url).href;
    const existing = document.querySelector(`link[href="${cssUrl}"]`);
    if (existing) {
        if (existing.dataset.loaded === 'true' || existing.sheet) return Promise.resolve();
        return new Promise((resolve) => {
            existing.addEventListener('load', resolve, { once: true });
            existing.addEventListener('error', resolve, { once: true });
        });
    }
    return new Promise((resolve) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssUrl;
        link.onload = () => {
            link.dataset.loaded = 'true';
            resolve();
        };
        link.onerror = resolve;
        document.head.appendChild(link);
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g,
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// --- DATA VOOR DE INTERACTIEVE SCAN (3 VRAGEN PER THEMA) ---
const scanVragen = [
    // Voeding
    { id: 'voeding', themaLabel: 'Voeding', vraag: 'Eet je dagelijks voldoende groente en fruit?' },
    { id: 'voeding', themaLabel: 'Voeding', vraag: 'Kies je meestal voor verse, onbewerkte producten (in plaats van pakjes, snacks of snelle suikers)?' },
    { id: 'voeding', themaLabel: 'Voeding', vraag: 'Drink je overdag voldoende water?' },

    // Slaap
    { id: 'slaap', themaLabel: 'Slaap', vraag: 'Ga je meestal rond dezelfde tijd naar bed en sta je op een vast tijdstip op (ook in het weekend)?' },
    { id: 'slaap', themaLabel: 'Slaap', vraag: 'Bouw je \'s avonds bewust af, zonder fel schermlicht vlak voor het slapen?' },
    { id: 'slaap', themaLabel: 'Slaap', vraag: 'Word je \'s ochtends over het algemeen redelijk uitgerust wakker?' },

    // Structuur & Stress
    { id: 'structuur', themaLabel: 'Structuur & Stress', vraag: 'Heb je vaste ankers in je dag (zoals op vaste tijden opstaan, eten en slapen)?' },
    { id: 'structuur', themaLabel: 'Structuur & Stress', vraag: 'Neem je overdag bewust korte rustmomenten zonder prikkels of scherm?' },
    { id: 'structuur', themaLabel: 'Structuur & Stress', vraag: 'Lukt het je om bij spanning of een drukke dag even gas terug te nemen?' },

    // Beweging
    { id: 'beweging', themaLabel: 'Beweging', vraag: 'Beweeg of sport je regelmatig actief?' },
    { id: 'beweging', themaLabel: 'Beweging', vraag: 'Onderbreek je langdurig zitten overdag regelmatig door even op te staan of kort te lopen?' },
    { id: 'beweging', themaLabel: 'Beweging', vraag: 'Kom je dagelijks even naar buiten voor daglicht en frisse lucht?' }
];

const praktischeTips = {
    voeding: {
        titel: "Voeding Opladen",
        intro: "Kies voor pure brandstof. Tik op de acties die je deze week wilt toepassen.",
        tips: [
            {
                uitleg: "Lees het etiket: heeft een product een lange lijst met suikers en onbekende toevoegingen? Laat het dan liggen.",
                actie: "Deze week laat ik producten met een lange ingrediëntenlijst vaker liggen."
            },
            {
                uitleg: "Het beste etiket is géén etiket: pure producten zoals groente, fruit, ongezouten noten en eieren hebben geen ingrediëntenlijst nodig.",
                actie: "Deze week kies ik elke dag voor onbewerkte producten zoals groente, fruit, noten of eieren."
            },
            {
                uitleg: "Zet een vol glas water naast je bed en drink dit direct leeg zodra je wakker wordt.",
                actie: "Deze week begin ik elke ochtend met een groot glas water."
            }
        ],
        kleur: '#eab308'
    },
    slaap: {
        titel: "Slaap Opladen",
        intro: "Slaap is het belangrijkste herstelmoment voor je brein. Kies wat je deze week gaat uitproberen.",
        tips: [
            {
                uitleg: "You snooze, you lose: zet je wekker buiten handbereik. Door te snoozen verlies je juist je meest waardevolle diepe slaap of REM-slaap.",
                actie: "Deze week zet ik mijn wekker buiten handbereik om niet meer te snoozen."
            },
            {
                uitleg: "Plan een 'piekerkwartier' eerder op de avond. Schrijf je gedachten van je af, zodat je hoofd leeg is als je naar bed gaat.",
                actie: "Deze week plan ik 's avonds een kort piekerkwartier in om mijn hoofd leeg te maken."
            },
            {
                uitleg: "Zet de verwarming in je slaapkamer uit. Een koele kamer (tussen de 15 en 18 graden) helpt je lichaam om in de diepe slaap te komen.",
                actie: "Deze week zorg ik voor een koele, donkere slaapkamer."
            }
        ],
        kleur: '#8b5cf6'
    },
    structuur: {
        titel: "Structuur & Stress Opladen",
        intro: "Breng je zenuwstelsel tot rust door kleine ankers in je dag te bouwen.",
        tips: [
            {
                uitleg: "Maak je bed op zodra je wakker wordt. Dit piepkleine succes activeert direct een gevoel van structuur en controle.",
                actie: "Deze week maak ik elke ochtend direct mijn bed op als eerste vaste anker."
            },
            {
                uitleg: "Gebruik de 4-7-8 methode als je onrust voelt: adem 4 seconden in, houd 7 seconden vast, en adem 8 seconden uit.",
                actie: "Deze week gebruik ik de 4-7-8 ademhaling zodra ik onrust of spanning voel."
            },
            {
                uitleg: "Voorkom 'alles-of-niets' denken. Een kleine misstap is slechts een 'glijmoment', geen volledige terugval.",
                actie: "Deze week pak ik na een klein glijmoment direct mijn normale routine weer op."
            }
        ],
        kleur: '#3b82f6'
    },
    beweging: {
        titel: "Beweging Opladen",
        intro: "Je hoeft niet direct topsport te bedrijven. Kleine, haalbare beweegmomenten maken het verschil.",
        tips: [
            {
                uitleg: "Gebruik de 2-minutenregel: onderbreek het zitten elke 30 tot 60 minuten met slechts 1 tot 2 minuten beweging.",
                actie: "Deze week sta ik tijdens het zitten elk uur even 2 minuten op om te bewegen."
            },
            {
                uitleg: "Maak bewegen ongemerkt onderdeel van je routine: loop rond tijdens het telefoneren of neem altijd de trap.",
                actie: "Deze week pak ik vaker de trap of loop ik rond tijdens het bellen."
            },
            {
                uitleg: "Ga naar buiten. Buiten wandelen of in de natuur zijn verlaagt direct je stresshormonen.",
                actie: "Deze week ga ik elke dag even naar buiten voor daglicht en frisse lucht."
            }
        ],
        kleur: '#10b981'
    }
};

// --- DATA VOOR DE KENNISBANK (MET CONCRETE ACTIE PER LES) ---
const leefstijlData = {
    voeding: {
        titel: "Voeding & Energie", kort: "Voeding", subtitel: "Kies de juiste brandstof", icon: "🍏", bg: "#fefce8",
        intro: "Eten is meer dan vulling; het geeft je hersenen de energie die nodig is om de dag rustig door te komen.",
        lessen: [
            {
                id: "darmen", titel: "Je tweede brein", desc: "De connectie tussen darm en hoofd.", icon: "🦠", mediaType: "bouwstoffen",
                tekst: `<h3>De nervus vagus</h3><p>Je darmen bevatten biljoenen bacteriën die letterlijk als een tweede brein fungeren. Ze communiceren direct met je hersenen via de nervus vagus (een belangrijke hersenzenuw). Wat je eet, beïnvloedt dus direct hoe jij je mentaal voelt en hoeveel stress je ervaart.</p>`,
                actie: "Deze week voeg ik elke dag extra groente of vezels toe voor mijn darmen."
            },
            {
                id: "leaky", titel: "De lekkende darm", desc: "Ontstekingen en je stemming.", icon: "🔥", mediaType: "bewerkt",
                tekst: `<h3>Stress en bewerkt eten</h3><p>Te veel suiker, sterk bewerkte fabrieksvoeding en chronische stress kunnen leiden tot een "leaky gut" (een lekkende darm). Dit veroorzaakt kleine ontstekingen in je lichaam die je niet direct voelt als pijn, maar die je stemming en energieniveau wel zwaar onderuit halen.</p>`,
                actie: "Deze week kies ik bij trek voor een onbewerkte snack in plaats van fabrieksvoeding."
            },
            {
                id: "koolhydraten", titel: "Snelle en Langzame Energie", desc: "Voorkom pieken en dalen.", icon: "🌾", mediaType: "koolhydraten",
                tekst: `<h3>De achtbaan in je bloed</h3><p>Suikers en snelle koolhydraten (witbrood, snoep) schieten direct je bloed in. De crash die volgt voelt vaak als paniek of trek. <strong>Langzame energie</strong> (havermout, volkoren) druppelt rustig je bloed in. Je voelt je urenlang stabiel.</p>`,
                actie: "Deze week vervang ik snelle suikers of witbrood door volkoren of havermout."
            }
        ]
    },
    slaap: {
        titel: "Slaap & Herstel", kort: "Slaap", subtitel: "De actieve wasstraat voor je brein", icon: "🌙", bg: "#f5f3ff",
        intro: "Slaap is geen passieve pauze. Het is het moment waarop je lichaam fysiek herstelt en je emoties verwerkt.",
        lessen: [
            {
                id: "actief", titel: "Slaap is keihard werken", desc: "Fysiek en emotioneel herstel.", icon: "🧠", mediaType: "slaapdruk",
                tekst: `<h3>Het verwerken van de dag</h3><p>Tijdens het slapen repareert je lichaam cellen en weefsels. Daarnaast verwerk je in je REM-slaap (de droomfase) alle intense emoties en informatie van de dag. Zonder deze diepe slaap blijf je overdag emotioneel instabiel en vatbaarder voor triggers.</p>`,
                actie: "Deze week geef ik mijn nachtrust prioriteit door op tijd naar bed te gaan."
            },
            {
                id: "jetlag", titel: "De Social Jetlag", desc: "Waarom uitslapen tegenwerkt.", icon: "⏱️", mediaType: "ritueel",
                tekst: `<h3>Je Innerlijke Klok</h3><p>Als je in het weekend veel later naar bed gaat en later opstaat dan doordeweeks, creëer je wekelijks een "social jetlag". Je biologische klok raakt hiervan compleet ontregeld, wat resulteert in slaapproblemen en constante vermoeidheid door de week heen.</p>`,
                actie: "Deze week houd ik ook in het weekend ongeveer dezelfde bed- en opstaantijd aan."
            },
            {
                id: "avondritueel", titel: "Rust in de avond", desc: "Melatonine en donkerte.", icon: "💡", mediaType: "avond",
                tekst: `<h3>Licht is de schakelaar</h3><p>Je maakt het slaaphormoon <strong>melatonine</strong> alleen aan als het donker is. Fel licht (vooral van telefoons) blokkeert dit direct. Zet lampen een uur voor bedtijd zachter, plan een 'piekerkwartier' in, en zorg voor een koele kamer (15-18 graden) om de diepe slaap te bevorderen.</p>`,
                actie: "Deze week leg ik mijn telefoon een uur voor het slapengaan weg."
            }
        ]
    },
    structuur: {
        titel: "Stress & Gewoontes", kort: "Structuur", subtitel: "Kalmeer je overlevingsstand", icon: "🗓️", bg: "#eff6ff",
        intro: "Door structuur aan te brengen en je stress-reacties te begrijpen, voorkom je dat je op de automatische piloot terugvalt in oud gedrag.",
        lessen: [
            {
                id: "stress", titel: "Fight, Flight, Freeze, Fawn", desc: "Hoe je zenuwstelsel reageert.", icon: "⚡", mediaType: "omgeving",
                tekst: `<h3>Meer dan vechten of vluchten</h3><p>Als je stress ervaart of getriggerd wordt, schakelt je brein onbewust over naar de overlevingsstand. Dit is niet alleen 'Fight' (vechten) of 'Flight' (vluchten). Soms reageer je met 'Freeze' (verstijven, niks meer kunnen) of 'Fawn' (extreem meebuigen, pleasen en conflicten vermijden ten koste van jezelf).</p>`,
                actie: "Deze week sta ik bij stress even stil om te herkennen hoe ik reageer."
            },
            {
                id: "terugval", titel: "Glijmoment vs Terugval", desc: "Alles-of-niets denken.", icon: "📉", mediaType: "klein",
                tekst: `<h3>Een misstap is niet het einde</h3><p>Een kortdurend 'glijmoment' (een kleine misstap) is normaal bij gedragsverandering. Pas als je denkt: "Nu is toch alles al verpest, ik kan net zo goed doorgaan" (alles-of-niets denken), wordt het een volledige terugval. Herken dit vroege signaal en pak je goede routine de volgende minuut gewoon weer op.</p>`,
                actie: "Deze week laat ik alles-of-niets denken los en focus ik op de eerstvolgende kleine stap."
            },
            {
                id: "koppelen", titel: "Gewoontes koppelen", desc: "De bestaande routine gebruiken.", icon: "🔗", mediaType: "koppelen",
                tekst: `<h3>Plak het vast</h3><p>Wilskracht is een batterij die leeg kan raken. Koppel nieuwe acties daarom altijd direct aan een bestaande gewoonte. Bijv: 'Direct nadat ik mijn tanden poets, doe ik de 4-7-8 ademhalingsoefening'. Zo kost het je geen mentale energie meer.</p>`,
                actie: "Deze week koppel ik één nieuwe gezonde gewoonte direct aan een bestaande routine."
            }
        ]
    },
    beweging: {
        titel: "Lichaamsbeweging", kort: "Beweging", subtitel: "Stress uit je lijf halen", icon: "🏃", bg: "#f0fdf4",
        intro: "Bewegen is de snelste manier om opgebouwde spanning kwijt te raken, en het hoeft absoluut geen topsport te zijn.",
        lessen: [
            {
                id: "mythe", titel: "De 10.000 stappen mythe", desc: "Kleine stapjes maken het verschil.", icon: "🚶", mediaType: "wandelen",
                tekst: `<h3>Je hoeft geen marathon te lopen</h3><p>Het idee dat je dagelijks 10.000 stappen móét zetten, is ontstaan als een marketingstunt. Wetenschappelijk is bewezen dat je al bij 2.600 tot 2.800 stappen per dag significante gezondheidsvoordelen en minder stress ervaart. Laat de perfectie los.</p>`,
                actie: "Deze week ga ik erop letten dagelijks meer stappen te zetten."
            },
            {
                id: "zitten", titel: "Doorbreek het zitten", desc: "De 2-minutenregel.", icon: "⏱️", mediaType: "klein",
                tekst: `<h3>Korte pauzes, groot effect</h3><p>Je hoeft je niet direct in het zweet te werken. Onderbreek langdurig zitten simpelweg elke 30 tot 60 minuten. Een extreem korte beweging van 1 tot 2 minuten verlaagt direct je spanning en houdt je bloedsuiker stabiel.</p>`,
                actie: "Deze week onderbreek ik langdurig zitten met korte beweegpauzes."
            },
            {
                id: "buiten", titel: "De kracht van de natuur", desc: "Bosbaden en daglicht.", icon: "☀️", mediaType: "buiten",
                tekst: `<h3>Shinrin-yoku</h3><p>Buiten zijn in de natuur, ook wel 'bosbaden' genoemd, prikkelt je parasympathische zenuwstelsel (je rust-stand). Dit verlaagt onmiddellijk de ontstekingswaarden en stresshormonen in je lichaam, en helpt je om uit je hoofd te komen.</p>`,
                actie: "Deze week maak ik bewust een korte wandeling in de buitenlucht."
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

export async function renderLeefstijlModule(containerElement, onBackToKist) {
    await loadCSS();
    window.scrollTo(0, 0);

    const container = containerElement || document.getElementById('app-content');
    if (!container) return;

    let currentView = 'overview';
    let activeThema = null;
    let activeLes = null;
    let geselecteerdCustomThema = 'voeding';

    let batterijScores = JSON.parse(localStorage.getItem('arminius_leefstijl_scores')) || null;
    let gekozenActies = JSON.parse(localStorage.getItem('arminius_leefstijl_acties')) || [];
    let actieveVraagIndex = 0;
    let tempAntwoorden = {};

    function saveScores(scores) {
        batterijScores = scores;
        localStorage.setItem('arminius_leefstijl_scores', JSON.stringify(scores));
    }

    function saveActies() {
        localStorage.setItem('arminius_leefstijl_acties', JSON.stringify(gekozenActies));
    }

    function isActieGekozen(tekst) {
        return gekozenActies.some(a => a.tekst === tekst);
    }

    function toggleActie(domein, tekst) {
        const idx = gekozenActies.findIndex(a => a.tekst === tekst);
        if (idx > -1) {
            gekozenActies.splice(idx, 1);
            saveActies();
            return false;
        } else {
            gekozenActies.push({ domein, tekst });
            saveActies();
            return true;
        }
    }

    function renderActiesLijstHTML() {
        if (gekozenActies.length === 0) {
            return `
                <div class="scan-card" style="text-align: left; margin-bottom: 12px; padding: 18px 20px;">
                    <p style="margin: 0; font-size: 15px; color: #64748b; line-height: 1.5;">
                        Je hebt nog geen weekacties gekozen. Tik hieronder op een <strong>thema</strong> om acties te kiezen, of voeg direct je eigen goede gewoonte toe.
                    </p>
                </div>
            `;
        }

        const themaVolgorde = ['voeding', 'slaap', 'structuur', 'beweging'];
        const gesorteerdeActies = [...gekozenActies].sort((a, b) => {
            const idxA = themaVolgorde.indexOf(a.domein);
            const idxB = themaVolgorde.indexOf(b.domein);
            return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
        });

        return `
            <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px;">
                ${gesorteerdeActies.map(actie => {
                    const domeinInfo = leefstijlData[actie.domein] || { icon: '🎯', bg: '#eff6ff' };
                    return `
                        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; background: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid ${(praktischeTips[actie.domein]?.kleur) || '#2563eb'}; border-radius: 12px; padding: 14px 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.03);">
                            <div style="display: flex; align-items: center; gap: 12px; min-width: 0;">
                                <span style="font-size: 20px; flex-shrink: 0;">${domeinInfo.icon}</span>
                                <span style="font-size: 15px; color: #1e293b; font-weight: 600; line-height: 1.4;">${escapeHtml(actie.tekst)}</span>
                            </div>
                            <button type="button" class="btn-remove-actie" data-tekst="${escapeHtml(actie.tekst)}" title="Actie verwijderen" style="background: #f1f5f9; color: #64748b; border: none; width: 28px; height: 28px; border-radius: 50%; font-size: 16px; font-weight: 700; cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">&times;</button>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    function tekenBatterijBlokjes(score, kleur) {
        let blokjesHtml = '';
        for (let i = 1; i <= 3; i++) {
            const isGevuld = i <= score;
            const bg = isGevuld ? kleur : '#e2e8f0';
            blokjesHtml += `<div class="b-block" style="background-color: ${bg};"></div>`;
        }
        return `<div class="battery-blocks">${blokjesHtml}</div>`;
    }

    function renderView() {
        if (currentView === 'overview') {
            let html = `
                <div style="padding: 20px;">
                    <div class="module-container ls-container" style="max-width: 650px; margin: 0 auto;">
                        <div style="margin-bottom: 24px;" class="stagger-1">
                            <span style="font-size: 14px; font-weight: 800; color: #ec4899; text-transform: uppercase; letter-spacing: 1px;">Hulpmiddelen</span>
                            <h2 style="font-size: 28px; color: #1e293b; margin-top: 4px; font-weight: 800;">Leefstijl & Fundament</h2>
                        </div>
            `;

            // --- MIJN ACTIES VOOR DEZE WEEK ---
            html += `
                <h3 class="sectie-titel stagger-1">Mijn acties voor deze week</h3>
                <div id="ls-acties-lijst" class="stagger-1">
                    ${renderActiesLijstHTML()}
                </div>

                <!-- EIGEN GOEDE GEWOONTE TOEVOEGEN -->
                <div class="stagger-1" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px; margin-bottom: 32px; box-shadow: 0 2px 4px rgba(0,0,0,0.03);">
                    <div style="font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 10px;">Zelf een goede gewoonte toevoegen</div>
                    <div id="ls-custom-thema-picker" style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px;">
                        ${Object.keys(leefstijlData).map(key => {
                            const info = leefstijlData[key];
                            const isActief = key === geselecteerdCustomThema;
                            const kleur = praktischeTips[key]?.kleur || '#2563eb';
                            return `
                                <button type="button" class="ls-thema-pill" data-thema="${key}" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 9999px; border: 2px solid ${isActief ? kleur : '#e2e8f0'}; background: ${isActief ? info.bg : '#f8fafc'}; color: #1e293b; font-size: 13.5px; font-weight: ${isActief ? '700' : '600'}; cursor: pointer; font-family: inherit; transition: all 0.15s;">
                                    <span>${info.icon}</span>
                                    <span>${info.kort}</span>
                                </button>
                            `;
                        }).join('')}
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 4px 4px 4px 12px;">
                        <input type="text" id="ls-custom-gewoonte-input" placeholder="+ Typ je eigen gewoonte..." style="flex: 1; min-width: 0; border: none; background: transparent; outline: none; font-size: 15px; color: #1e293b; font-family: inherit;">
                        <button type="button" id="btn-add-custom-gewoonte" style="background: #1e293b; color: #ffffff; border: none; padding: 10px 14px; border-radius: 8px; font-weight: 700; font-size: 14px; cursor: pointer; font-family: inherit; flex-shrink: 0;">Toevoegen</button>
                    </div>
                </div>
            `;

            // --- GECOMBINEERDE SECTIE: BATTERIJ & THEMA'S ---
            html += `<h3 class="sectie-titel stagger-2">Jouw fundament & thema's</h3>`;

            if (!batterijScores) {
                html += `
                    <div class="scan-card stagger-2" style="margin-bottom: 16px;">
                        <div style="font-size: 36px; margin-bottom: 8px;">🔋</div>
                        <h4 style="margin: 0 0 6px 0; color: #1e293b; font-size: 18px;">Check je fundament</h4>
                        <p style="color: #64748b; font-size: 14px; margin: 0 0 16px 0; line-height: 1.5;">
                            Met 12 korte vragen zie je direct bij elk thema hoe vol jouw batterij op dit moment is.
                        </p>
                        <button class="btn-primary start-scan-btn">Doe de Leefstijl Scan</button>
                    </div>
                `;
            } else {
                html += `<p class="stagger-2" style="font-size: 14px; color: #475569; margin: 0 0 14px 0;">Tik op een thema voor concrete acties en achtergrondinformatie.</p>`;
            }

            html += `<div class="stagger-3">`;

            Object.keys(leefstijlData).forEach((key) => {
                const pijler = leefstijlData[key];
                const score = batterijScores ? batterijScores[key] : null;
                const kleur = praktischeTips[key]?.kleur || '#2563eb';

                html += `
                    <div class="pillar-card nav-to-thema" data-thema="${key}">
                        <div class="pillar-info" style="min-width: 0; flex: 1;">
                            <div class="pillar-icon" style="background-color: ${pijler.bg}; flex-shrink: 0;">${pijler.icon}</div>
                            <div style="min-width: 0;">
                                <h3 class="pillar-title">${pijler.titel}</h3>
                                <p class="pillar-subtitle">${pijler.subtitel}</p>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px; flex-shrink: 0;">
                            ${score ? tekenBatterijBlokjes(score, kleur) : ''}
                            <div class="pillar-arrow">&rarr;</div>
                        </div>
                    </div>
                `;
            });

            html += `</div>`;

            if (batterijScores) {
                html += `
                    <div class="stagger-4" style="text-align: center; margin-top: 16px;">
                        <button class="btn-secondary start-scan-btn" style="display: inline-flex; width: auto; font-size: 15px; padding: 10px 20px;">
                            🔄 Scan opnieuw doen
                        </button>
                    </div>
                `;
            }

            html += `
                        <div class="stagger-4" style="margin-top: 32px;">
                            <button id="btn-terug-kist" class="btn-secondary">&larr; Terug naar Hulpmiddelen</button>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML = html;

        } else if (currentView === 'vragenlijst') {
            const vraagObj = scanVragen[actieveVraagIndex];
            const pct = Math.round(((actieveVraagIndex + 1) / scanVragen.length) * 100);

            let html = `
                <div style="padding: 20px;">
                    <div class="module-container ls-container" style="max-width: 650px; margin: 0 auto;">
                        <div style="margin-bottom: 16px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <span style="font-size: 14px; font-weight: 800; color: #2563eb; text-transform: uppercase;">${vraagObj.themaLabel}</span>
                                <span style="font-size: 14px; font-weight: 700; color: #94a3b8;">Vraag ${actieveVraagIndex + 1} van ${scanVragen.length}</span>
                            </div>
                            <div style="background: #e2e8f0; height: 6px; border-radius: 3px; overflow: hidden;">
                                <div style="width: ${pct}%; background: #2563eb; height: 100%; transition: width 0.3s ease;"></div>
                            </div>
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

        } else if (currentView === 'thema') {
            const data = leefstijlData[activeThema];
            const tipsData = praktischeTips[activeThema];
            const score = batterijScores ? batterijScores[activeThema] : null;

            let html = `
                <div style="padding: 20px;">
                    <div class="module-container ls-container" style="max-width: 650px; margin: 0 auto;">
                        
                        <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0;" class="stagger-1">
                            <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px;">
                                <div style="display: flex; align-items: center; gap: 14px; min-width: 0;">
                                    <div class="pillar-icon" style="background-color: ${data.bg}; flex-shrink: 0;">${data.icon}</div>
                                    <div style="min-width: 0;">
                                        <span style="font-size: 13px; font-weight: 800; color: #64748b; text-transform: uppercase;">Leefstijl</span>
                                        <h2 style="font-size: 24px; color: #1e293b; margin: 0; font-weight: 800;">${data.titel}</h2>
                                    </div>
                                </div>
                                ${score ? `<div style="flex-shrink: 0;">${tekenBatterijBlokjes(score, tipsData.kleur)}</div>` : ''}
                            </div>
                            <p style="margin: 0; font-size: 15px; color: #475569; line-height: 1.5;">${data.intro}</p>
                        </div>

                        <!-- DEEL 1: WAAROM DIT WERKT (KENNISBANK LESSEN) -->
                        <div class="stagger-2" style="margin-bottom: 36px;">
                            <h3 class="sectie-titel" style="margin-top: 0;">Waarom dit werkt</h3>
                            <p style="font-size: 14px; color: #64748b; margin: 0 0 14px 0;">Lees kort hoe jouw lichaam en brein hierop reageren.</p>
                            <div class="chapter-list">
                                ${data.lessen.map(les => {
                                    const gekozen = isActieGekozen(les.actie);
                                    return `
                                        <div class="chapter-card nav-to-les" data-les="${les.id}">
                                            <div class="chapter-icon">${les.icon}</div>
                                            <div class="chapter-text" style="flex: 1;">
                                                <h4>${les.titel} ${gekozen ? '✅' : ''}</h4>
                                                <p>${les.desc}</p>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>

                        <!-- DEEL 2: DIRECT AAN DE SLAG (ACTIEPUNTEN) -->
                        <div class="stagger-3">
                            <h3 class="sectie-titel">Direct aan de slag</h3>
                            <p style="font-size: 14px; color: #64748b; margin: 0 0 14px 0;">Tik op de acties die je deze week wilt toepassen.</p>
                            <ul class="tip-list">
                                ${tipsData.tips.map(tip => {
                                    const gekozen = isActieGekozen(tip.actie);
                                    return `
                                        <li class="tip-item" style="flex-direction: column; align-items: stretch; gap: 12px;">
                                            <div style="display: flex; align-items: flex-start; gap: 12px;">
                                                <div class="tip-icon">💡</div>
                                                <p class="tip-text" style="margin: 0;">${tip.uitleg}</p>
                                            </div>
                                            <button type="button" class="btn-toggle-actie" <button type="button" class="btn-toggle-actie" data-variant="focus" data-domein="${activeThema}" data-tekst="${escapeHtml(tip.actie)}" style="width: 100%; padding: 14px 16px; border-radius: 10px; border: none; background: ${gekozen ? '#10b981' : '#2563eb'}; color: #ffffff; font-weight: 700; font-size: 15px; text-align: left; cursor: pointer; font-family: inherit; line-height: 1.4; transition: background 0.2s;">
                                                ${gekozen ? '✅ Gekozen: ' : '➕ '}${escapeHtml(tip.actie)}
                                            </button>
                                        </li>
                                    `;
                                }).join('')}
                            </ul>
                        </div>
                        
                        <div class="stagger-4" style="margin-top: 32px;">
                            <button class="btn-secondary btn-terug-overzicht">&larr; Terug naar overzicht</button>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML = html;

        } else if (currentView === 'les') {
            const themaData = leefstijlData[activeThema];
            const lesData = themaData.lessen.find(l => l.id === activeLes);
            const gekozen = isActieGekozen(lesData.actie);

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

                        <div id="les-actie-box" class="stagger-3" style="margin-top: 28px; background: ${gekozen ? '#ecfdf5' : '#eff6ff'}; border: 2px solid ${gekozen ? '#10b981' : '#bfdbfe'}; border-radius: 14px; padding: 18px 16px; transition: background 0.2s, border-color 0.2s;">
                            <div id="les-actie-label" style="font-size: 13px; font-weight: 800; color: ${gekozen ? '#047857' : '#1d4ed8'}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                                🎯 Zet dit om in actie
                            </div>
                            <button type="button" class="btn-toggle-actie" data-variant="les" data-domein="${activeThema}" data-tekst="${escapeHtml(lesData.actie)}" style="width: 100%; padding: 14px 16px; border-radius: 10px; border: none; background: ${gekozen ? '#10b981' : '#2563eb'}; color: #ffffff; font-weight: 700; font-size: 15px; text-align: left; cursor: pointer; font-family: inherit; line-height: 1.4; transition: background 0.2s;">
                                ${gekozen ? '✅ Toegevoegd aan je weekacties: ' : '➕ '}${escapeHtml(lesData.actie)}
                            </button>
                            <p id="les-actie-hint" style="margin: 10px 0 0 0; font-size: 13.5px; color: #475569; line-height: 1.4;">
                                ${gekozen ? 'Deze actie staat nu op je Leefstijl-overzicht. Tik nogmaals om te verwijderen.' : 'Tik op de knop om deze actie toe te voegen aan je Leefstijl-overzicht.'}
                            </p>
                        </div>
                        
                        <div class="stagger-3" style="margin-top: 32px;">
                            <button id="btn-terug-thema" class="btn-secondary">&larr; Terug</button>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML = html;
        }

        window.scrollTo(0, 0);
    }

    function voegEigenGewoonteToe() {
        const input = container.querySelector('#ls-custom-gewoonte-input');
        if (!input) return;
        const tekst = input.value.trim();
        if (!tekst) return;

        if (!isActieGekozen(tekst)) {
            gekozenActies.push({ domein: geselecteerdCustomThema, tekst });
            saveActies();
            const lijstEl = container.querySelector('#ls-acties-lijst');
            if (lijstEl) lijstEl.innerHTML = renderActiesLijstHTML();
        }
        input.value = '';
    }

    function navigateTo(nextView) {
        const prevView = currentView;
        if (window.pushSubHistory) {
            window.pushSubHistory(() => {
                currentView = prevView;
                renderView();
            });
        }
        currentView = nextView;
        renderView();
    }

    function bindEvents() {
        container.onclick = (e) => {
            if (e.target.closest('#btn-terug-kist')) {
                if (onBackToKist) onBackToKist();
                return;
            }
            if (e.target.closest('.btn-terug-overzicht') || e.target.closest('#btn-terug-overzicht')) {
                if (window.goBackSubHistory) window.goBackSubHistory(() => { currentView = 'overview'; renderView(); });
                else { currentView = 'overview'; renderView(); }
                return;
            }
            if (e.target.closest('#btn-terug-thema')) {
                if (window.goBackSubHistory) window.goBackSubHistory(() => { currentView = 'thema'; renderView(); });
                else { currentView = 'thema'; renderView(); }
                return;
            }
            if (e.target.closest('.start-scan-btn')) {
                tempAntwoorden = { voeding: [], slaap: [], structuur: [], beweging: [] };
                actieveVraagIndex = 0;
                navigateTo('vragenlijst');
                return;
            }
            if (e.target.closest('#btn-annuleer-scan')) {
                if (window.goBackSubHistory) window.goBackSubHistory(() => { currentView = 'overview'; renderView(); });
                else { currentView = 'overview'; renderView(); }
                return;
            }

            // Thema kiezen bij eigen gewoonte (zonder pagina-verversing)
            const themaPill = e.target.closest('.ls-thema-pill');
            if (themaPill) {
                geselecteerdCustomThema = themaPill.getAttribute('data-thema');
                container.querySelectorAll('.ls-thema-pill').forEach(pill => {
                    const key = pill.getAttribute('data-thema');
                    const isActief = key === geselecteerdCustomThema;
                    const kleur = praktischeTips[key]?.kleur || '#2563eb';
                    pill.style.borderColor = isActief ? kleur : '#e2e8f0';
                    pill.style.background = isActief ? leefstijlData[key].bg : '#f8fafc';
                    pill.style.fontWeight = isActief ? '700' : '600';
                });
                return;
            }

            // Eigen gewoonte toevoegen (zonder pagina-verversing)
            if (e.target.closest('#btn-add-custom-gewoonte')) {
                voegEigenGewoonteToe();
                return;
            }

            // Actie aan- of uitzetten (direct in de DOM, zonder pagina-verversing)
            const toggleActieBtn = e.target.closest('.btn-toggle-actie');
            if (toggleActieBtn) {
                const domein = toggleActieBtn.getAttribute('data-domein');
                const tekst = toggleActieBtn.getAttribute('data-tekst');
                const variant = toggleActieBtn.getAttribute('data-variant');
                const nuGekozen = toggleActie(domein, tekst);

                if (variant === 'les') {
                    const box = container.querySelector('#les-actie-box');
                    const label = container.querySelector('#les-actie-label');
                    const hint = container.querySelector('#les-actie-hint');

                    if (box) {
                        box.style.background = nuGekozen ? '#ecfdf5' : '#eff6ff';
                        box.style.borderColor = nuGekozen ? '#10b981' : '#bfdbfe';
                    }
                    if (label) {
                        label.style.color = nuGekozen ? '#047857' : '#1d4ed8';
                    }
                    toggleActieBtn.style.background = nuGekozen ? '#10b981' : '#2563eb';
                    toggleActieBtn.textContent = `${nuGekozen ? '✅ Toegevoegd aan je weekacties: ' : '➕ '}${tekst}`;
                    if (hint) {
                        hint.textContent = nuGekozen
                            ? 'Deze actie staat nu op je Leefstijl-overzicht. Tik nogmaals om te verwijderen.'
                            : 'Tik op de knop om deze actie toe te voegen aan je Leefstijl-overzicht.';
                    }
                } else {
                    toggleActieBtn.style.background = nuGekozen ? '#10b981' : '#2563eb';
                    toggleActieBtn.textContent = `${nuGekozen ? '✅ Gekozen: ' : '➕ '}${tekst}`;
                }
                return;
            }

            // Actie verwijderen vanaf het Leefstijl-overzicht (zonder pagina-verversing)
            const removeActieBtn = e.target.closest('.btn-remove-actie');
            if (removeActieBtn) {
                const tekst = removeActieBtn.getAttribute('data-tekst');
                gekozenActies = gekozenActies.filter(a => a.tekst !== tekst);
                saveActies();
                const lijstEl = container.querySelector('#ls-acties-lijst');
                if (lijstEl) lijstEl.innerHTML = renderActiesLijstHTML();
                return;
            }

            const antwoordBtn = e.target.closest('.antwoord-btn');
            if (antwoordBtn) {
                const score = parseInt(antwoordBtn.getAttribute('data-score'), 10);
                const domein = antwoordBtn.getAttribute('data-domein');

                if (!tempAntwoorden[domein]) tempAntwoorden[domein] = [];
                tempAntwoorden[domein].push(score);

                if (actieveVraagIndex < scanVragen.length - 1) {
                    actieveVraagIndex++;
                    renderView();
                } else {
                    const berekendeScores = {};
                    Object.keys(tempAntwoorden).forEach(key => {
                        const arr = tempAntwoorden[key];
                        const gem = arr.reduce((sum, val) => sum + val, 0) / arr.length;
                        berekendeScores[key] = Math.round(gem);
                    });
                    saveScores(berekendeScores);
                    if (window.goBackSubHistory) window.goBackSubHistory(() => { currentView = 'overview'; renderView(); });
                    else { currentView = 'overview'; renderView(); }
                }
                return;
            }

            const themaCard = e.target.closest('.nav-to-thema');
            if (themaCard) {
                activeThema = themaCard.getAttribute('data-thema');
                navigateTo('thema');
                return;
            }

            const lesCard = e.target.closest('.nav-to-les');
            if (lesCard) {
                activeLes = lesCard.getAttribute('data-les');
                navigateTo('les');
                return;
            }
        };

        container.onkeypress = (e) => {
            if (e.key === 'Enter' && e.target.id === 'ls-custom-gewoonte-input') {
                e.preventDefault();
                voegEigenGewoonteToe();
            }
        };
    }

    renderView();
    bindEvents();
}