// src/components/modules/signaleringsplan/signaleringsplan.js

function loadCSS() {
    const cssUrl = new URL('./signaleringsplan.css', import.meta.url).href;
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
    let isFinished = false;

    setTimeout(() => {
        if (!isFinished) {
            isFinished = true;
            if (onFinish) onFinish();
        }
    }, 1500);

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
            if (!isFinished && onFinish) {
                isFinished = true;
                onFinish();
            }
        }
    }
    update();
}

function getModuleData(traject) {
    const specifiek = {
        alcohol: {
            oranjeSignalenExtra: ["🍺 Zin om te drinken"],
            oranjeSituatiesShown: ["💼 Na een drukke dag", "🏠 Alleen thuis", "🍻 In gezelschap waar gedronken wordt", "⏱️ Verveling"],
            oranjeSituatiesHidden: ["😴 Slecht geslapen", "🌧️ Regenachtig weer", "🌴 Vakantie", "⚠️ Tegenslag", "🎉 Goed nieuws", "🍾 Iets te vieren"],
            oranjeZelfShown: ["🔍 Afleiding zoeken", "🗣️ Erover praten", "🧃 Iets anders drinken", "🏃 Sporten"],
            roodSituatiesShown: ["🔥 Hevige stress", "🍻 Sterke trigger-omgeving", "📦 Overbelasting", "👥 Hoge sociale druk"],
            roodSituatiesHidden: ["😢 Verdriet", "⚡ Ruzie", "🛑 Grote tegenslag"],
            roodZelfHidden: ["🏡 Naar veilige omgeving", "☎️ Hulpnummer bellen", "🚿 Douchen", "🚶 Wandelen"]
        },
        cannabis: {
            oranjeSignalenExtra: ["🌿 Zin om te blowen", "🛌 Moeite met inslapen"],
            oranjeSituatiesShown: ["💼 Na een drukke dag", "🏠 Alleen thuis", "🌙 's Avonds op de bank", "⏱️ Verveling"],
            oranjeSituatiesHidden: ["🌿 In gezelschap waar geblowd wordt", "🏪 Langs de coffeeshop", "😴 Slecht geslapen", "🌧️ Regenachtig weer", "🌴 Vakantie", "⚠️ Tegenslag", "🎉 Goed nieuws"],
            oranjeZelfShown: ["🔍 Afleiding zoeken", "🗣️ Erover praten", "🌬️ Even naar buiten", "🏃 Sporten"],
            roodSituatiesShown: ["🔥 Hevige stress", "🚨 Sterke trigger-omgeving", "📦 Overbelasting", "👥 Hoge sociale druk"],
            roodSituatiesHidden: ["😢 Verdriet", "⚡ Ruzie", "🛑 Grote tegenslag", "🛌 Slaapproblemen"],
            roodZelfHidden: ["🏡 Naar veilige omgeving", "☎️ Hulpnummer bellen", "🚿 Douchen", "🚶 Wandelen"]
        },
        cocaine: {
            oranjeSignalenExtra: ["⚡ Zin om te gebruiken", "🍺 Trek na alcohol"],
            oranjeSituatiesShown: ["🍺 Na het drinken van alcohol", "🪩 Op een feest / in de kroeg", "🏠 Alleen thuis", "⏱️ Verveling"],
            oranjeSituatiesHidden: ["💼 Na een drukke werkweek", "💶 Salarisdag", "😴 Slecht geslapen", "🌴 Vakantie", "⚠️ Tegenslag", "🎉 Goed nieuws", "🍾 Iets te vieren"],
            oranjeZelfShown: ["🔍 Afleiding zoeken", "🗣️ Erover praten", "🚫 Geen alcohol drinken", "🏃 Sporten"],
            roodSituatiesShown: ["🔥 Hevige stress", "🚨 Sterke trigger-omgeving", "📦 Overbelasting", "👥 Hoge sociale druk"],
            roodSituatiesHidden: ["🍺 Alcohol gedronken", "😢 Verdriet", "⚡ Ruzie", "🛑 Grote tegenslag"],
            roodZelfHidden: ["🏡 Direct naar huis gaan", "☎️ Hulpnummer bellen", "🚿 Douchen", "🚶 Wandelen"]
        },
        gokken: {
            oranjeSignalenExtra: ["🎰 Zin om te gokken", "📉 Verlies willen terugwinnen"],
            oranjeSituatiesShown: ["📱 Alleen met telefoon / laptop", "🏠 Alleen thuis", "💶 Salarisdag / geld op rekening", "⏱️ Verveling"],
            oranjeSituatiesHidden: ["⚽ Live sportwedstrijd", "📧 Gokreclame gezien", "💼 Na een drukke dag", "😴 Slecht geslapen", "⚠️ Tegenslag", "🎉 Goed nieuws"],
            oranjeZelfShown: ["🔍 Afleiding zoeken", "🗣️ Erover praten", "📵 Telefoon / laptop wegleggen", "🏃 Sporten"],
            roodSituatiesShown: ["🔥 Hevige stress", "🚨 Sterke trigger-omgeving", "💸 Geldzorgen / financiële druk", "📦 Overbelasting"],
            roodSituatiesHidden: ["📉 Na een verlies", "😢 Verdriet", "⚡ Ruzie", "🛑 Grote tegenslag"],
            roodZelfHidden: ["❌ Site / app direct sluiten", "🏡 Naar veilige omgeving", "☎️ Hulpnummer bellen", "🚿 Douchen", "🚶 Wandelen"]
        }
    };

    const s = specifiek[traject] || specifiek.alcohol;

    return {
        groen: {
            title: "Fase Groen: Geen trek",
            bgHeader: "#10b981",
            textColor: "#ffffff",
            borderClass: "info-block-border-green",
            themas: [
                { id: "signalen", label: "1. Wat zijn de signalen?", shown: ["🌿 Rustig", "😊 Vrolijk", "⚡ Energiek", "🏃 Actief"], hidden: ["🤝 Sociaal", "💡 Helder", "💪 Fit", "🚀 Ondernemend", "☕ Gezellig"] },
                { id: "situaties", label: "2. In welke situaties komt het voor?", shown: ["☀️ Alles loopt zoals gewenst", "💤 Goed geslapen", "🏡 Rustige omgeving", "🌤️ Mooi weer"], hidden: ["🎯 Gevoel alles onder controle te hebben", "🧘 Alleen zijn", "👥 Bij vrienden/familie", "🚴 Tijdens/na sporten"] },
                { id: "zelf", label: "3. Wat kan ik zelf doen?", shown: ["📅 Dagstructuur aanhouden", "🏋️ Sporten", "☕ Afspreken met mensen", "🛋️ Genoeg rust bewaren"], hidden: [] },
                { id: "anderen", label: "4. Hoe zouden anderen mij kunnen helpen?", shown: ["🎉 Samen iets leuks doen", "📞 Contact met me opnemen", "🛡️ Me niet belasten met iets negatiefs", "💬 Positief contact"], hidden: [] },
                { id: "contacten", label: "Contactpersonen", subtitle: "Wie kan ik hiervoor benaderen?", shown: [], hidden: [] }
            ]
        },
        oranje: {
            title: "Fase Oranje: Beetje trek",
            bgHeader: "#f59e0b",
            textColor: "#ffffff",
            borderClass: "info-block-border-orange",
            themas: [
                { id: "signalen", label: "1. Wat zijn de signalen?", shown: ["⚡ Trekgevoel", "💢 Irritatie", "🌀 Opwinding", "🚶 Teruggetrokken"], hidden: ["🌧️ Somber", "😰 Angstig", "💭 Piekeren", "✨ Euforisch", "😊 Vrolijk", ...s.oranjeSignalenExtra, "🧱 Behoefte aan verdoving", "🔥 Stress", "⚡ Licht ontvlambaar"] },
                { id: "situaties", label: "2. In welke situaties komt het voor?", shown: s.oranjeSituatiesShown, hidden: s.oranjeSituatiesHidden },
                { id: "zelf", label: "3. Wat kan ik zelf doen?", shown: s.oranjeZelfShown, hidden: ["🚶 Wandelen", "🎵 Muziek luisteren", "🧘 Ontspanningsoefening", "🚪 Weggaan uit de situatie"] },
                { id: "anderen", label: "4. Hoe zouden anderen mij kunnen helpen?", shown: ["👂 Luisterend oor", "🎯 Afleiding", "💡 Advies", "🤝 Steun"], hidden: ["🚶 Samen een rondje wandelen", "🚪 Samen weggaan uit de situatie", "🎯 Me helpen herinneren aan mijn doelen", "⭐ Me positieve feedback geven"] },
                { id: "contacten", label: "Contactpersonen", subtitle: "Wie kan ik bellen voor afleiding of advies?", shown: [], hidden: [] }
            ]
        },
        rood: {
            title: "Fase Rood: Veel trek",
            bgHeader: "#ef4444",
            textColor: "#ffffff",
            borderClass: "info-block-border-red",
            themas: [
                { id: "signalen", label: "1. Wat zijn de signalen?", shown: ["🚨 Sterke fysieke drang", "⚠️ Directe neiging om toe te geven", "🔄 Vasthouden aan trekgedachten", "🧩 Geen afleiding meer kunnen vinden"], hidden: ["🌪️ Zeer onrustig", "😱 Paniek", "🧱 Geïsoleerd", "🛋️ Passief"] },
                { id: "situaties", label: "2. In welke situaties komt het voor?", shown: s.roodSituatiesShown, hidden: s.roodSituatiesHidden },
                { id: "zelf", label: "3. Wat kan ik zelf doen?", shown: ["🚪 Weggaan uit de situatie", "📞 Iemand bellen/spreken", "🎯 Afleiding", "📋 Terugvallen op plan"], hidden: s.roodZelfHidden },
                { id: "anderen", label: "4. Hoe zouden anderen mij kunnen helpen?", shown: ["👂 Actief luisteren", "🎯 Helpen met afleiden", "💡 Helder advies geven", "🤝 Directe steun bieden"], hidden: ["🚶 Samen weggaan", "🎯 Herinneren aan doelen"] },
                { id: "contacten", label: "Contactpersonen", subtitle: "Wie moet ik nu direct bellen?", shown: [], hidden: [] }
            ]
        }
    };
}

const fasenKeys = ['groen', 'oranje', 'rood'];
const heeftTelefoonboek = 'contacts' in navigator && 'ContactsManager' in window;

function formatContactLabel(raw) {
    const parts = String(raw || '').split(' | ');
    const naam = parts[0].trim();
    const tel = parts[1] ? parts[1].trim() : '';
    return tel ? `📞 ${naam} (${tel})` : `✏️ ${naam}`;
}

export function renderSignaleringsplan(containerElement, onComplete) {
    loadCSS();
    window.scrollTo(0, 0);

    const container = containerElement || document.getElementById('app-content');
    if (!container) return;

    const actiefTraject = localStorage.getItem('actieveVerslaving') || 'alcohol';
    const MODULE_DATA = getModuleData(actiefTraject);
    const storageKeyName = `signaleringsplan_state_${actiefTraject}`;
    const isCompleted = localStorage.getItem(`arminius_module_signaleringsplan_completed_${actiefTraject}`) === 'true';

    // State variabelen
    let currentStepIndex = isCompleted ? 3 : -1;
    let isEditing = !isCompleted;
    let expandedThemas = new Set();
    let activeAccordionFase = 'groen';
    let savedState = JSON.parse(localStorage.getItem(storageKeyName)) || {};

    // Vaste schil opbouwen
    container.innerHTML = `
        <div style="padding: 20px;">
            <div class="progress-bar-container" style="background: #e2e8f0; height: 6px; border-radius: 3px; margin-bottom: 24px; overflow: hidden; max-width: 700px; margin-left: auto; margin-right: auto;">
                <div class="progress-bar" id="sp-progress-bar" style="width: 20%; background: #2563eb; height: 100%; transition: width 0.4s ease-out;"></div>
            </div>
            
            <div class="module-container sp-container" style="max-width: 700px; margin: 0 auto;">
                <div style="margin-bottom: 32px;" id="sp-main-header">
                    <span style="font-size: 14px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Zelfonderzoek</span>
                    <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;" id="sp-header-title">Het Signaleringsplan</h2>
                </div>

                <div id="sp-page-content"></div>
            </div>
        </div>
    `;

    const pageContent = container.querySelector('#sp-page-content');
    const progressBar = container.querySelector('#sp-progress-bar');
    const headerTitle = container.querySelector('#sp-header-title');
    const headerWrapper = container.querySelector('#sp-main-header');
    const progressWrapper = container.querySelector('.progress-bar-container');

    function renderThemaHTML(thema, actieveFaseKey, faseData) {
        const storageKey = `${actieveFaseKey}_${thema.id}`;
        const selectedItems = savedState[storageKey] || [];
        const isExpanded = expandedThemas.has(storageKey);
        const placeholderText = thema.id === 'contacten' ? '+ Naam toevoegen...' : '+ Eigen optie toevoegen...';

        let html = `
            <div class="info-block ${faseData.borderClass}" style="margin-bottom: 0; padding: 20px;">
                <div class="thema-title">${thema.label}</div>
                ${thema.subtitle ? `<div class="thema-subtitle">${thema.subtitle}</div>` : ''}
                <div class="chip-group">
        `;

        // Geselecteerde items altijd eerst tonen
        const allPredefined = [...thema.shown, ...thema.hidden];
        const customItems = selectedItems.filter(i => !allPredefined.includes(i));

        const visibleList = [
            ...allPredefined.filter(i => selectedItems.includes(i)),
            ...thema.shown.filter(i => !selectedItems.includes(i))
        ];

        const hiddenList = thema.hidden.filter(i => !selectedItems.includes(i));

        // Render zichtbare items
        visibleList.forEach(opt => {
            const isSelected = selectedItems.includes(opt);
            html += `
                <button type="button" class="sp-chip fase-${actieveFaseKey} ${isSelected ? 'selected' : ''}" data-fase="${actieveFaseKey}" data-thema="${thema.id}" data-value="${escapeHtml(opt)}">
                    ${escapeHtml(opt)} ${isSelected ? '✓' : ''}
                </button>
            `;
        });

        // Render verborgen items
        if (hiddenList.length > 0) {
            html += `<div style="display: ${isExpanded ? 'contents' : 'none'};">`;
            hiddenList.forEach(opt => {
                const isSelected = selectedItems.includes(opt);
                html += `
                    <button type="button" class="sp-chip fase-${actieveFaseKey} ${isSelected ? 'selected' : ''}" data-fase="${actieveFaseKey}" data-thema="${thema.id}" data-value="${escapeHtml(opt)}">
                        ${escapeHtml(opt)}
                    </button>
                `;
            });
            html += `</div>`;
        }

        // Custom items
        customItems.forEach(opt => {
            const label = thema.id === 'contacten' ? formatContactLabel(opt) : `✏️ ${opt}`;
            html += `
                <button type="button" class="sp-chip fase-${actieveFaseKey} selected" data-fase="${actieveFaseKey}" data-thema="${thema.id}" data-value="${escapeHtml(opt)}" title="Klik om te verwijderen">
                    ${escapeHtml(label)} &times;
                </button>
            `;
        });

        html += `</div>`;

        if (hiddenList.length > 0) {
            html += `<button type="button" class="toggle-hidden-btn" data-storagekey="${storageKey}">
                        ${isExpanded ? '- Minder voorbeelden tonen' : '+ Meer voorbeelden tonen...'}
                     </button>`;
        }

        if (thema.id === 'contacten') {
            html += `
                ${heeftTelefoonboek ? `
                    <button type="button" class="btn-pick-contact" data-fase="${actieveFaseKey}" style="width: 100%; margin-bottom: 10px; padding: 10px 14px; border-radius: 8px; border: 1px dashed #2563eb; background: #eff6ff; color: #1d4ed8; font-weight: 700; font-size: 14px; cursor: pointer; font-family: inherit;">
                        📒 Kies uit telefoonboek
                    </button>
                ` : ''}
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div class="custom-input-wrapper" style="margin-top: 0;">
                        <input type="text" class="custom-sp-input contact-naam-input" placeholder="+ Naam van contactpersoon...">
                    </div>
                    <div class="custom-input-wrapper" style="margin-top: 0;">
                        <input type="tel" class="custom-sp-input contact-tel-input" placeholder="Telefoonnummer (optioneel)...">
                        <button type="button" class="btn-add-custom" data-fase="${actieveFaseKey}" data-thema="contacten">Toevoegen</button>
                    </div>
                </div>
            </div>
            `;
        } else {
            html += `
                <div class="custom-input-wrapper">
                    <input type="text" class="custom-sp-input" placeholder="${placeholderText}">
                    <button type="button" class="btn-add-custom" data-fase="${actieveFaseKey}" data-thema="${thema.id}">Toevoegen</button>
                </div>
            </div>
            `;
        }
        return html;
    }

    function renderStep(preserveScroll = false) {
        const scrollY = window.scrollY;

        headerWrapper.style.display = (currentStepIndex === 4) ? 'none' : 'block';
        if (progressWrapper) {
            progressWrapper.style.display = (currentStepIndex === 4 || (currentStepIndex === 3 && !isEditing)) ? 'none' : 'block';
        }

        if (progressBar) {
            let pct = '20%';
            if (currentStepIndex === 0) pct = '40%';
            if (currentStepIndex === 1) pct = '60%';
            if (currentStepIndex === 2) pct = '80%';
            if (currentStepIndex === 3) pct = '100%';
            progressBar.style.width = pct;
        }

        // STAP -1: INTRODUCTIE
        if (currentStepIndex === -1) {
            headerTitle.textContent = "Het Signaleringsplan";
            pageContent.innerHTML = `
                <div class="stagger-1 info-block info-block-border-blue">
                    <span style="font-size: 24px; display: block; margin-bottom: 8px;">🌊</span>
                    <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                        Trek en verleiding overvallen je vaak niet ineens; ze komen in golven en kennen vroege signalen. Als je leert om die signalen tijdig te herkennen, kun je ingrijpen vóórdat de trek te groot wordt.
                    </p>
                </div>
                <div class="stagger-2 info-block info-block-border-green">
                    <span style="font-size: 24px; display: block; margin-bottom: 8px;">🚦</span>
                    <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                        In dit <strong>Signaleringsplan</strong> deel je je proces op in drie fasen (Groen, Oranje en Rood). Je legt per fase vast wat je merkt, in welke situaties dat gebeurt en wat je zelf kunt doen.
                    </p>
                </div>
                <div class="stagger-3 button-group" style="display: flex; justify-content: space-between; margin-top: 24px;">
                    ${isCompleted ? `
                        <button type="button" id="btn-annuleren" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                            Annuleren
                        </button>
                    ` : '<div></div>'}
                    <button type="button" id="btn-start" style="background: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        Start je Plan &rarr;
                    </button>
                </div>
            `;
        }
        // STAP 0, 1, 2: FASEN INVULLEN
        else if (currentStepIndex >= 0 && currentStepIndex <= 2) {
            const actieveFaseKey = fasenKeys[currentStepIndex];
            const fase = MODULE_DATA[actieveFaseKey];

            const hasSignalen = savedState[`${actieveFaseKey}_signalen`]?.length > 0;
            const hasSituaties = savedState[`${actieveFaseKey}_situaties`]?.length > 0;
            const hasZelf = savedState[`${actieveFaseKey}_zelf`]?.length > 0;
            const isStepValid = hasSignalen && hasSituaties && hasZelf;

            headerTitle.textContent = fase.title;

            let colorCode = '#3b82f6';
            if (currentStepIndex === 0) colorCode = '#10b981';
            if (currentStepIndex === 1) colorCode = '#f59e0b';
            if (currentStepIndex === 2) colorCode = '#ef4444';

            pageContent.innerHTML = `
                <div class="stagger-1" style="margin-bottom: 24px;">
                    <span style="font-size: 14px; font-weight: 600; color: ${colorCode}; text-transform: uppercase; letter-spacing: 0.5px;">Stap ${currentStepIndex + 1} van 3</span>
                    <p style="font-size: 15px; color: #475569; margin-top: 4px;">Breng jouw signalen, situaties en helpende acties voor deze fase in kaart.</p>
                </div>

                <div class="stagger-2 themas-layout">
                    <div class="themas-col">
                        ${fase.themas.slice(0, 2).map(t => renderThemaHTML(t, actieveFaseKey, fase)).join('')}
                    </div>
                    <div class="themas-col">
                        ${fase.themas.slice(2).map(t => renderThemaHTML(t, actieveFaseKey, fase)).join('')}
                    </div>
                </div>

                <div class="stagger-3 button-group" style="display: flex; justify-content: space-between; margin-top: 32px;">
                    <button type="button" id="btn-terug" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        &larr; Vorige
                    </button>
                    <button type="button" id="${currentStepIndex === 2 ? 'btn-overzicht' : 'btn-volgende'}" ${!isStepValid ? 'disabled' : ''} style="background: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: ${!isStepValid ? 'not-allowed' : 'pointer'}; font-size: 14px; opacity: ${!isStepValid ? '0.5' : '1'}; transition: opacity 0.2s;">
                        ${currentStepIndex === 2 ? 'Naar overzicht &rarr;' : 'Volgende fase &rarr;'}
                    </button>
                </div>
            `;
        }
        // STAP 3: OVERZICHT
        else if (currentStepIndex === 3) {
            headerTitle.textContent = isEditing ? 'Controleer je Signaleringsplan' : 'Mijn Signaleringsplan';

            let overzichtHtml = `
                <div class="stagger-1">
                    <p style="font-size: 15px; color: #475569; margin-bottom: 24px;">Klik op een fase om je ingevulde antwoorden in te zien.</p>
                </div>
                <div class="stagger-2" style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">
            `;

            fasenKeys.forEach((faseKey) => {
                const fase = MODULE_DATA[faseKey];
                const isOpen = (activeAccordionFase === faseKey);

                overzichtHtml += `
                    <div style="border-radius: 12px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; background: #ffffff;">
                        <div class="accordion-header-btn" data-fasekey="${faseKey}" style="background: ${fase.bgHeader}; color: ${fase.textColor}; padding: 16px 20px; font-size: 16px; font-weight: 700; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                            <span>${fase.title}</span>
                            <span>${isOpen ? '▲' : '▼'}</span>
                        </div>
                `;

                if (isOpen) {
                    const renderOverviewBox = (thema) => {
                        const storageKey = `${faseKey}_${thema.id}`;
                        const selectedItems = savedState[storageKey] || [];
                        return `
                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;">
                                <div class="sp-overview-title" style="font-size: 14px; font-weight: 700; color: #1e293b; margin-bottom: 12px;">${thema.label}</div>
                                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                    ${selectedItems.length > 0
                                        ? selectedItems.map(item => `<span class="sp-overview-chip" style="background: #ffffff; color: #334155; border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 9999px; font-size: 15px; font-weight: 500;">${escapeHtml(item)}</span>`).join('')
                                        : '<span style="font-size: 15px; color: #94a3b8; font-style: italic;">Nog niets ingevuld</span>'
                                    }
                                </div>
                            </div>
                        `;
                    };

                    overzichtHtml += `
                        <div style="padding: 16px;">
                            <div class="themas-layout">
                                <div class="themas-col">
                                    ${fase.themas.slice(0, 2).map(renderOverviewBox).join('')}
                                </div>
                                <div class="themas-col">
                                    ${fase.themas.slice(2).map(renderOverviewBox).join('')}
                                </div>
                            </div>
                        </div>
                    `;
                }
                overzichtHtml += `</div>`;
            });

            overzichtHtml += `</div>`;

            if (isEditing) {
                overzichtHtml += `
                    <div class="stagger-3 button-group" style="display: flex; justify-content: space-between;">
                        <button type="button" id="btn-terug-naar-rood" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                            &larr; Aanpassen
                        </button>
                        <button type="button" id="btn-opslaan-plan" style="background-color: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                            Plan Opslaan & Afronden 🎉
                        </button>
                    </div>
                `;
            } else {
                overzichtHtml += `
                    <div class="stagger-4 button-group" style="display: flex; justify-content: space-between; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
                        <button type="button" id="btn-close-module" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                            &larr; Terug
                        </button>
                        <button type="button" id="btn-wijzigen" style="background-color: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                            Plan Wijzigen ✏️
                        </button>
                    </div>
                `;
            }

            pageContent.innerHTML = overzichtHtml;
        }
        // STAP 4: SUCCESPAGINA
        else if (currentStepIndex === 4) {
            pageContent.innerHTML = `
                <div style="max-width: 600px; margin: 40px auto; padding: 32px; text-align: center; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                    <div class="stagger-1">
                        <div style="font-size: 64px; margin-bottom: 16px;">🚦</div>
                        <h2 style="font-size: 24px; color: #1e293b; margin-bottom: 12px;">Plan Afgerond!</h2>
                        <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 32px;">
                            Geweldig! Je Signaleringsplan is opgeslagen. Je hebt nu altijd een helder overzicht van je valkuilen en helpende acties bij de hand.
                        </p>
                    </div>
                    <div class="stagger-2">
                        <button type="button" id="btn-close-module-success" style="background-color: #2563eb; color: white; border: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 15px; transition: background 0.2s;">
                            Terug naar overzicht
                        </button>
                    </div>
                </div>
            `;
        }

        if (preserveScroll) window.scrollTo(0, scrollY);
        else window.scrollTo(0, 0);
    }

    // --- EVENT LISTENERS (Delegation op pageContent tegen dubbele listeners) ---
    if (pageContent) {
        pageContent.addEventListener('click', (e) => {
            if (e.target.closest('#btn-start')) {
                currentStepIndex = 0;
                renderStep();
                return;
            }
            if (e.target.closest('#btn-annuleren')) {
                currentStepIndex = 3;
                isEditing = false;
                renderStep();
                return;
            }
            if (e.target.closest('#btn-terug')) {
                currentStepIndex--;
                expandedThemas.clear();
                renderStep();
                return;
            }
            if (e.target.closest('#btn-volgende') && !e.target.closest('#btn-volgende').disabled) {
                currentStepIndex++;
                expandedThemas.clear();
                renderStep();
                return;
            }
            if (e.target.closest('#btn-overzicht') && !e.target.closest('#btn-overzicht').disabled) {
                currentStepIndex = 3;
                activeAccordionFase = 'groen';
                expandedThemas.clear();
                renderStep();
                return;
            }
            if (e.target.closest('#btn-terug-naar-rood')) {
                currentStepIndex = 2;
                renderStep();
                return;
            }

            if (e.target.closest('#btn-opslaan-plan')) {
                localStorage.setItem(`arminius_module_signaleringsplan_completed_${actiefTraject}`, 'true');
                isEditing = false;
                triggerConfetti();
                currentStepIndex = 4;
                renderStep();
                return;
            }

            if (e.target.closest('#btn-wijzigen')) {
                currentStepIndex = -1;
                isEditing = true;
                renderStep();
                return;
            }

            if (e.target.closest('#btn-close-module') || e.target.closest('#btn-close-module-success')) {
                if (onComplete) onComplete();
                return;
            }

            const accHeader = e.target.closest('.accordion-header-btn');
            if (accHeader) {
                activeAccordionFase = accHeader.dataset.fasekey;
                renderStep(true);
                return;
            }

            const updateNextButton = (fase) => {
                const hasSignalen = savedState[`${fase}_signalen`]?.length > 0;
                const hasSituaties = savedState[`${fase}_situaties`]?.length > 0;
                const hasZelf = savedState[`${fase}_zelf`]?.length > 0;
                const isStepValid = hasSignalen && hasSituaties && hasZelf;
                const nextBtn = pageContent.querySelector('#btn-volgende, #btn-overzicht');
                if (nextBtn) {
                    nextBtn.disabled = !isStepValid;
                    nextBtn.style.cursor = isStepValid ? 'pointer' : 'not-allowed';
                    nextBtn.style.opacity = isStepValid ? '1' : '0.5';
                }
            };

            const chip = e.target.closest('.sp-chip');
            if (chip) {
                const fase = chip.dataset.fase;
                const thema = chip.dataset.thema;
                const value = chip.dataset.value;

                const sKey = `${fase}_${thema}`;
                if (!savedState[sKey]) savedState[sKey] = [];

                const index = savedState[sKey].indexOf(value);
                const isNowSelected = index === -1;
                if (isNowSelected) savedState[sKey].push(value);
                else savedState[sKey].splice(index, 1);

                localStorage.setItem(storageKeyName, JSON.stringify(savedState));

                if (chip.title === 'Klik om te verwijderen') {
                    chip.remove();
                } else {
                    chip.classList.toggle('selected', isNowSelected);
                    chip.textContent = isNowSelected ? `${value} ✓` : value;
                }

                updateNextButton(fase);
                return;
            }

            const toggleBtn = e.target.closest('.toggle-hidden-btn');
            if (toggleBtn) {
                const sKey = toggleBtn.dataset.storagekey;
                const infoBlock = toggleBtn.closest('.info-block');
                const chipGroup = infoBlock.querySelector('.chip-group');
                const hiddenBox = chipGroup.querySelector(':scope > div');

                if (expandedThemas.has(sKey)) {
                    expandedThemas.delete(sKey);
                    if (hiddenBox) {
                        hiddenBox.querySelectorAll('.sp-chip.selected').forEach(selChip => {
                            chipGroup.insertBefore(selChip, hiddenBox);
                        });
                        hiddenBox.style.display = 'none';
                        if (hiddenBox.children.length === 0) {
                            toggleBtn.style.display = 'none';
                        } else {
                            toggleBtn.textContent = '+ Meer voorbeelden tonen...';
                        }
                    }
                } else {
                    expandedThemas.add(sKey);
                    if (hiddenBox) hiddenBox.style.display = 'contents';
                    toggleBtn.textContent = '- Minder voorbeelden tonen';
                }
                return;
            }

            const pickContactBtn = e.target.closest('.btn-pick-contact');
            if (pickContactBtn && heeftTelefoonboek) {
                const fase = pickContactBtn.dataset.fase;
                navigator.contacts.select(['name', 'tel'], { multiple: false })
                    .then(contacts => {
                        if (!contacts || contacts.length === 0) return;
                        const c = contacts[0];
                        const naam = (c.name && c.name[0]) ? c.name[0].trim() : '';
                        const tel = (c.tel && c.tel[0]) ? c.tel[0].trim() : '';
                        if (!naam && !tel) return;

                        const val = tel ? `${naam || tel} | ${tel}` : naam;
                        const sKey = `${fase}_contacten`;
                        if (!savedState[sKey]) savedState[sKey] = [];
                        if (!savedState[sKey].includes(val)) {
                            savedState[sKey].push(val);
                            localStorage.setItem(storageKeyName, JSON.stringify(savedState));

                            const chipGroup = pickContactBtn.closest('.info-block').querySelector('.chip-group');
                            if (chipGroup) {
                                const newChip = document.createElement('button');
                                newChip.type = 'button';
                                newChip.className = `sp-chip fase-${fase} selected`;
                                newChip.dataset.fase = fase;
                                newChip.dataset.thema = 'contacten';
                                newChip.dataset.value = val;
                                newChip.title = 'Klik om te verwijderen';
                                newChip.textContent = `${formatContactLabel(val)} ×`;
                                chipGroup.appendChild(newChip);
                            }
                        }
                    })
                    .catch(err => console.log('Telefoonboek geannuleerd of niet beschikbaar:', err));
                return;
            }

            const addBtn = e.target.closest('.btn-add-custom');
            if (addBtn) {
                const fase = addBtn.dataset.fase;
                const thema = addBtn.dataset.thema;
                const infoBlock = addBtn.closest('.info-block');
                let val = '';

                if (thema === 'contacten') {
                    const naamInput = infoBlock.querySelector('.contact-naam-input');
                    const telInput = infoBlock.querySelector('.contact-tel-input');
                    const naam = naamInput ? naamInput.value.trim() : '';
                    const tel = telInput ? telInput.value.trim() : '';
                    if (!naam) return;
                    val = tel ? `${naam} | ${tel}` : naam;
                    if (naamInput) naamInput.value = '';
                    if (telInput) telInput.value = '';
                } else {
                    const input = addBtn.previousElementSibling;
                    if (!input || !input.value.trim()) return;
                    val = input.value.trim();
                    input.value = '';
                }

                const sKey = `${fase}_${thema}`;
                if (!savedState[sKey]) savedState[sKey] = [];
                if (!savedState[sKey].includes(val)) {
                    savedState[sKey].push(val);
                    localStorage.setItem(storageKeyName, JSON.stringify(savedState));

                    const chipGroup = infoBlock.querySelector('.chip-group');
                    if (chipGroup) {
                        const newChip = document.createElement('button');
                        newChip.type = 'button';
                        newChip.className = `sp-chip fase-${fase} selected`;
                        newChip.dataset.fase = fase;
                        newChip.dataset.thema = thema;
                        newChip.dataset.value = val;
                        newChip.title = 'Klik om te verwijderen';
                        newChip.textContent = thema === 'contacten' ? `${formatContactLabel(val)} ×` : `✏️ ${val} ×`;
                        chipGroup.appendChild(newChip);
                    }
                    updateNextButton(fase);
                }
                return;
            }
        });

        pageContent.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('custom-sp-input')) {
                const addBtn = e.target.nextElementSibling;
                if (addBtn) addBtn.click();
            }
        });
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>'"]/g,
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    renderStep();
}