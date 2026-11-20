// src/components/gereedschapskist/activiteiten/activiteiten.js

function loadCSS() {
    const cssUrl = new URL('./activiteiten.css', import.meta.url).href;
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

const activiteitenCatalogus = [
    {
        thema: 'Sport & Beweging',
        icon: '🏃',
        items: ['Wandelen', 'Hardlopen', 'Zwemmen', 'Fietsen / Wielrennen', 'Krachttraining', 'Yoga', 'Balsport', 'Dansen', 'Skeeleren']
    },
    {
        thema: 'Hobby & Creatief',
        icon: '🎨',
        items: ['Tekenen', 'Schilderen', 'Fotografie', 'Origami', 'Muziek maken', 'Houtbewerking', 'Schrijven', 'Breien / Haken', 'Puzzelen']
    },
    {
        thema: 'Zelfzorg & Wellness',
        icon: '🛁',
        items: ['Uitgebreid douchen', 'In bad met een boek', 'Massage boeken', 'Meditatie', 'Gezichtsmasker', 'Mindfulness oefening', 'Vroeg naar bed']
    },
    {
        thema: 'Eropuit',
        icon: '🗺️',
        items: ['Boswandeling', 'Strandwandeling', 'Museum bezoeken', 'Nachtje weg', 'Uit eten', 'Naar de bioscoop', 'Koffie buiten de deur', 'Stad verkennen']
    },
    {
        thema: 'Ontspanning',
        icon: '🛋️',
        items: ['Film kijken', 'Serie bingen', 'Boek lezen', 'Muziek luisteren', 'Podcasts luisteren', 'Gamen', 'Eten bestellen', 'Luieren']
    },
    {
        thema: 'Sociaal',
        icon: '👥',
        items: ['Afspreken met een vriend(in)', 'Bellen met familie', 'Bordspelavond organiseren', 'Samen koken', 'Vrijwilligerswerk']
    },
    {
        thema: 'Huis & Tuin',
        icon: '🪴',
        items: ['Tuinieren / Planten verzorgen', 'Een nieuw recept koken', 'Kast opruimen', 'Klussen in huis', 'Auto wassen', 'Kamer herinrichten']
    }
];

function getIconForAct(naam) {
    for (const cat of activiteitenCatalogus) {
        if (cat.items.includes(naam)) return cat.icon;
    }
    return '✨'; 
}

export function renderActiviteitenModule(containerElement, onBackToKist) {
    loadCSS();
    window.scrollTo(0, 0);

    const container = containerElement || document.getElementById('app-content');
    if (!container) return;

    // GLOBALE OPSLAG: Niet meer afhankelijk van actieveVerslaving
    const lsKey = `arminius_activiteiten_data_globaal`;
    
    let mijnBezigheden = [];
    let viewState = 'overview'; 
    let draftSelection = []; 

    try {
        const storedStr = localStorage.getItem(lsKey);
        if (storedStr) mijnBezigheden = JSON.parse(storedStr);
    } catch (e) {}

    function saveBezigheden() {
        localStorage.setItem(lsKey, JSON.stringify(mijnBezigheden));
    }

    container.innerHTML = `
        <style>
            .custom-act-wrapper {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                width: 100% !important;
                max-width: 100% !important;
                box-sizing: border-box !important;
            }
            .custom-act-input {
                flex: 1 1 0% !important;
                min-width: 0 !important;
                width: auto !important;
                box-sizing: border-box !important;
            }
            .custom-act-wrapper .btn-add-custom {
                flex: 0 0 42px !important;
                width: 42px !important;
                height: 42px !important;
                padding: 0 !important;
                border-radius: 50% !important;
                background: #1e293b !important;
                color: #ffffff !important;
                border: none !important;
                font-size: 22px !important;
                font-weight: 700 !important;
                line-height: 1 !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
            }
        </style>
        <div style="padding: 20px;">
            <div class="module-container act-container" style="max-width: 700px; margin: 0 auto;">
                <div style="margin-bottom: 32px;" id="act-main-header">
                    <span style="font-size: 14px; font-weight: 600; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.5px;">Hulpmiddelen</span>
                    <h2 style="font-size: 28px; color: #1e293b; margin-top: 4px; font-weight: 800;" id="act-header-title">Plezierige Bezigheden</h2>
                </div>

                <div id="act-page-content"></div>
            </div>
        </div>
    `;

    const pageContent = container.querySelector('#act-page-content');
    const headerTitle = container.querySelector('#act-header-title');

    function renderView(preserveScroll = false) {
        const scrollY = window.scrollY;
        
        if (viewState === 'overview') {
            headerTitle.textContent = "Mijn Bezigheden";
            draftSelection = []; 
            
            let overzichtHtml = `
                <div class="stagger-1 act-info-block act-info-block-orange" style="margin-bottom: 24px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
                        <div>
                            <h3 style="margin: 0 0 4px 0; font-size: 17px; color: #1e293b;">Jouw energie-boosters ⚡</h3>
                            <p style="margin: 0; font-size: 14px; color: #64748b;">Vul je dag met dingen die je echt plezier en ontspanning geven.</p>
                        </div>
                        <button type="button" id="btn-open-catalogus" style="background-color: #f59e0b; color: white; border: none; padding: 12px 20px; border-radius: 12px; font-weight: 700; cursor: pointer; font-size: 14px; box-shadow: 0 4px 10px rgba(245,158,11,0.3); transition: transform 0.2s;">
                            + Nieuwe bezigheid kiezen
                        </button>
                    </div>
                </div>
            `;

            if (mijnBezigheden.length === 0) {
                overzichtHtml += `
                    <div class="stagger-2 act-info-block" style="text-align: center; padding: 48px 24px;">
                        <div style="font-size: 48px; margin-bottom: 16px;">🎨</div>
                        <h3 style="color: #1e293b; margin: 0 0 8px 0; font-size: 18px;">Je lijst is nog leeg</h3>
                        <p style="color: #64748b; font-size: 15px; margin: 0; line-height: 1.6;">
                            Het is belangrijk om momenten van leegte of trek op te vullen met dingen die je leuk vindt. Duik in de catalogus en kies een paar bezigheden die bij je passen.
                        </p>
                    </div>
                `;
            } else {
                overzichtHtml += `<div class="stagger-2">`;
                mijnBezigheden.forEach((act, index) => {
                    const icon = act.icon || getIconForAct(act.naam);
                    overzichtHtml += `
                        <div class="user-act-item">
                            <div class="user-act-left">
                                <div class="user-act-icon">${icon}</div>
                                <div class="user-act-info">
                                    <h4>${escapeHtml(act.naam)}</h4>
                                    <span>${escapeHtml(act.frequentie)}</span>
                                </div>
                            </div>
                            <button type="button" class="remove-act-btn" data-index="${index}" title="Verwijderen">×</button>
                        </div>
                    `;
                });
                overzichtHtml += `</div>`;
            }

            overzichtHtml += `
                <div class="stagger-3" style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
                    <button type="button" id="btn-terug-kist" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        &larr; Terug naar Hulpmiddelen
                    </button>
                </div>
            `;

            pageContent.innerHTML = overzichtHtml;
            
        } else if (viewState === 'catalog') {
            headerTitle.textContent = "Inspiratie Catalogus";
            
            let catalogusHtml = `
                <div class="stagger-1 act-info-block act-info-block-orange">
                    <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1e293b;">Wat past bij jou?</h3>
                    <p style="font-size: 14px; color: #475569; margin: 0;">Tik op alle bezigheden die je aanspreken, of voeg je eigen creaties toe!</p>
                </div>
                <div class="stagger-2">
            `;

            activiteitenCatalogus.forEach((cat, cIdx) => {
                catalogusHtml += `
                    <div class="theme-accordion ${cIdx === 0 ? 'open' : ''}" data-index="${cIdx}">
                        <div class="theme-header">
                            <h3><span class="theme-icon">${cat.icon}</span> ${cat.thema}</h3>
                            <span class="theme-toggle">▼</span>
                        </div>
                        <div class="theme-content">
                            <div class="chip-cloud">
                                ${cat.items.map(item => {
                                    const isAlreadySaved = mijnBezigheden.some(a => a.naam === item);
                                    const isDrafted = draftSelection.some(d => d.naam === item);
                                    
                                    let classes = 'act-chip';
                                    if (isAlreadySaved) classes += ' already-added';
                                    if (isDrafted) classes += ' selected';
                                    
                                    return `<button type="button" class="${classes}" data-name="${escapeHtml(item)}" data-icon="${cat.icon}">${escapeHtml(item)}</button>`;
                                }).join('')}
                            </div>
                            
                            <!-- Eigen Invoer per Thema -->
                            <div class="custom-act-wrapper">
                                <input type="text" class="custom-act-input" placeholder="Eigen bezigheid..." data-theme-idx="${cIdx}">
                                <button type="button" class="btn-add-custom" data-theme-idx="${cIdx}" title="Toevoegen aan lijst">+</button>
                            </div>
                        </div>
                    </div>
                `;
            });

            const btnText = draftSelection.length > 0 ? `Frequentie instellen (${draftSelection.length}) &rarr;` : `Selecteer een bezigheid`;
            const btnOpacity = draftSelection.length > 0 ? '1' : '0.5';

            catalogusHtml += `
                </div>
                <div class="stagger-3 button-group" style="display: flex; justify-content: space-between; margin-top: 24px;">
                    <button type="button" id="btn-terug-overzicht" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        &larr; Annuleren
                    </button>
                    <button type="button" id="btn-naar-frequentie" style="background-color: #f59e0b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; opacity: ${btnOpacity}; transition: opacity 0.2s;">
                        ${btnText}
                    </button>
                </div>
            `;

            pageContent.innerHTML = catalogusHtml;
            
        } else if (viewState === 'frequencies') {
            headerTitle.textContent = "Hoe vaak?";
            
            let freqHtml = `
                <div class="stagger-1 act-info-block act-info-block-orange">
                    <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #1e293b;">Maak het concreet</h3>
                    <p style="font-size: 14px; color: #475569; margin: 0;">Geef voor je gekozen bezigheden aan hoe vaak je dit ongeveer wilt gaan doen.</p>
                </div>
                <div class="stagger-2">
            `;

            const freqOptions = ['Elke dag', '1x per week', '2x per week', '3x per week', '1x per maand', '2x per maand', 'Af en toe'];

            draftSelection.forEach((draft, idx) => {
                freqHtml += `
                    <div class="freq-item-card">
                        <h4><span>${draft.icon || '✨'}</span> ${escapeHtml(draft.naam)}</h4>
                        <div class="freq-pill-group">
                            ${freqOptions.map(f => `
                                <button type="button" class="freq-pill ${draft.frequentie === f ? 'active' : ''}" data-index="${idx}" data-val="${f}">${f}</button>
                            `).join('')}
                        </div>
                    </div>
                `;
            });

            freqHtml += `
                </div>
                <div class="stagger-3 button-group" style="display: flex; justify-content: space-between; margin-top: 24px;">
                    <button type="button" id="btn-terug-catalogus" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        &larr; Terug
                    </button>
                    <button type="button" id="btn-save-drafts" style="background-color: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; box-shadow: 0 2px 4px rgba(16,185,129,0.2);">
                        Opslaan & Afronden
                    </button>
                </div>
            `;

            pageContent.innerHTML = freqHtml;
        }

        if (!preserveScroll) window.scrollTo(0, scrollY); 
    }

    container.onclick = (e) => {
        if (e.target.closest('#btn-terug-kist')) {
            if (onBackToKist) onBackToKist();
            return;
        }

        if (e.target.closest('#btn-open-catalogus')) {
            viewState = 'catalog';
            renderView(false);
            return;
        }

        if (e.target.closest('#btn-terug-overzicht')) {
            viewState = 'overview';
            renderView(false);
            return;
        }
        
        if (e.target.closest('#btn-terug-catalogus')) {
            viewState = 'catalog';
            renderView(false);
            return;
        }

        const themeHeader = e.target.closest('.theme-header');
        if (themeHeader) {
            const accordion = themeHeader.closest('.theme-accordion');
            const isOpen = accordion.classList.contains('open');
            
            container.querySelectorAll('.theme-accordion').forEach(acc => acc.classList.remove('open'));
            if (!isOpen) accordion.classList.add('open');
            return;
        }

        const btnAddCustom = e.target.closest('.btn-add-custom');
        if (btnAddCustom) {
            const tIdx = btnAddCustom.getAttribute('data-theme-idx');
            const inputField = container.querySelector(`.custom-act-input[data-theme-idx="${tIdx}"]`);
            const val = inputField.value.trim();
            
            if (val) {
                if (!activiteitenCatalogus[tIdx].items.includes(val)) {
                    activiteitenCatalogus[tIdx].items.push(val);
                }
                
                if (!draftSelection.some(d => d.naam === val)) {
                    draftSelection.push({ naam: val, icon: activiteitenCatalogus[tIdx].icon, frequentie: '1x per week' });
                }
                
                renderView(true);
            }
            return;
        }

        const chip = e.target.closest('.act-chip');
        if (chip) {
            if (chip.classList.contains('already-added')) return;

            const naam = chip.getAttribute('data-name');
            const icon = chip.getAttribute('data-icon');
            const draftIndex = draftSelection.findIndex(d => d.naam === naam);

            if (draftIndex >= 0) {
                draftSelection.splice(draftIndex, 1);
                chip.classList.remove('selected');
            } else {
                draftSelection.push({ naam: naam, icon: icon, frequentie: '1x per week' });
                chip.classList.add('selected');
            }

            const btnNext = container.querySelector('#btn-naar-frequentie');
            if (btnNext) {
                btnNext.innerHTML = draftSelection.length > 0 ? `Frequentie instellen (${draftSelection.length}) &rarr;` : `Selecteer een bezigheid`;
                btnNext.style.opacity = draftSelection.length > 0 ? '1' : '0.5';
            }
            return;
        }

        if (e.target.closest('#btn-naar-frequentie')) {
            if (draftSelection.length === 0) return;
            viewState = 'frequencies';
            window.scrollTo(0,0);
            renderView(true);
            return;
        }

        const freqPill = e.target.closest('.freq-pill');
        if (freqPill) {
            const idx = parseInt(freqPill.getAttribute('data-index'));
            const val = freqPill.getAttribute('data-val');
            
            draftSelection[idx].frequentie = val;
            
            const group = freqPill.closest('.freq-pill-group');
            group.querySelectorAll('.freq-pill').forEach(p => p.classList.remove('active'));
            freqPill.classList.add('active');
            return;
        }

        if (e.target.closest('#btn-save-drafts')) {
            mijnBezigheden = [...mijnBezigheden, ...draftSelection];
            saveBezigheden();
            viewState = 'overview';
            window.scrollTo(0,0);
            renderView(true);
            return;
        }

        const removeBtn = e.target.closest('.remove-act-btn');
        if (removeBtn) {
            const idx = parseInt(removeBtn.getAttribute('data-index'));
            mijnBezigheden.splice(idx, 1);
            saveBezigheden();
            renderView(true);
            return;
        }
    };

    renderView();
}