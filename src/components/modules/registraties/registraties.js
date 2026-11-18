// src/components/modules/registraties/registraties.js
import { getActiveData } from '../../../data/contentManager.js';

let regData = {
    id: null,
    middel: '',
    tijdstip: '',
    plaats: '',
    situatieContext: [],
    personen: [],
    gedachten: [],
    gevoelens: [],
    actieType: null, 
    gebruikDetails: {}, 
    extraMiddelen: [], 
    alternatiefTekst: [],
    selfEfficacyScore: null,
    positieveEffecten: [],
    negatieveEffecten: [],
    totaalStandaardGlazen: 0,
    hoeveelheid: 0
};

function loadCSS() {
    const cssUrl = new URL('./registraties.css', import.meta.url).href;
    if (!document.querySelector(`link[href="${cssUrl}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssUrl;
        document.head.appendChild(link);
    }
}

function getActiveAddictionKey() {
    return localStorage.getItem('actieveVerslaving') || 'alcohol';
}

function getVoltooidDeelwoord(middel) {
    if (middel === 'alcohol') return 'gedronken';
    if (middel === 'cannabis') return 'geblowd';
    if (middel === 'cocaine' || middel === 'cocaïne') return 'gebruikt';
    if (middel === 'gokken') return 'gegokt';
    return 'gebruikt'; 
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

export function renderRegistratiesModule(onComplete) {
    window.scrollTo(0, 0);
    
    loadCSS();
    window._onRegComplete = onComplete; 
    renderCatalogus();
}

function renderCatalogus() {
    window.scrollTo(0, 0);

    const container = document.getElementById('app-content') || document.getElementById('app');
    if (!container) return;

    const registraties = JSON.parse(localStorage.getItem('registratiesData') || '[]');

    let html = `
        <style>
            .fab-btn { position: fixed; bottom: 80px; right: 20px; background: #2563eb; color: white; border: none; border-radius: 50%; width: 56px; height: 56px; font-size: 28px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4); cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 100; transition: transform 0.2s;}
            .fab-btn:active { transform: scale(0.95); }
            
            .reg-cards-container { display: flex; flex-direction: column; gap: 12px; }
            .reg-card { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
            .reg-card-summary { padding: 16px; cursor: pointer; list-style: none; position: relative; outline: none; transition: background 0.2s; }
            .reg-card-summary:hover { background: #f8fafc; }
            .reg-card-summary::-webkit-details-marker { display: none; }
            .reg-card-summary::marker { display: none; }
            
            .reg-card[open] .toggle-icon { transform: rotate(180deg); }
            .reg-card[open] .reg-card-summary { border-bottom: 1px solid #e2e8f0; background: #f8fafc; }
            
            .reg-card-details { padding: 16px; font-size: 14px; line-height: 1.5; color: #334155; }
            .t-label { font-weight: 700; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px; margin-top: 12px; }
            .t-label:first-child { margin-top: 0; }
        </style>
        
        <div style="padding-bottom: 80px; font-family: 'Nunito', sans-serif, system-ui;">
            <div style="margin-bottom: 24px;" class="stagger-1">
                <h2 style="font-size: 24px; font-weight: 700; color: #1e293b; margin-bottom: 4px;">Mijn Registraties</h2>
                <p style="color: #64748b; font-size: 14px;">Bekijk hier het overzicht van je situaties en gedrag.</p>
            </div>
    `;

    if (registraties.length === 0) {
        html += `
            <div class="stagger-2" style="text-align: center; padding: 40px 20px; background: #ffffff; border-radius: 12px; border: 1px dashed #cbd5e1;">
                <div style="font-size: 40px; margin-bottom: 12px;">📝</div>
                <h3 style="color: #1e293b; margin-bottom: 8px;">Nog geen registraties</h3>
                <p style="color: #64748b; font-size: 14px; margin-bottom: 20px;">Breng je eerste situatie in kaart door op de knop te klikken.</p>
                <button id="btn-nieuw-leeg" class="btn-primary" style="background: #2563eb; color: white; padding: 10px 20px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">+ Nieuwe registratie</button>
            </div>
        `;
    } else {
        const reversed = [...registraties].reverse();
        
        html += `<div class="reg-cards-container stagger-2">`;

        reversed.forEach(reg => {
            let details = reg.gebruikDetails || {};
            
            let rMiddel = reg.middel;
            if (!rMiddel) {
                const checkStr = String(details.soort || details.drank || '').toLowerCase();
                if (checkStr.includes('wiet') || checkStr.includes('hasj') || checkStr.includes('joint')) rMiddel = 'cannabis';
                else if (checkStr.includes('coca') || checkStr.includes('coke') || checkStr.includes('base') || checkStr.includes('crack')) rMiddel = 'cocaine';
                else if (checkStr.includes('gok') || checkStr.includes('euro')) rMiddel = 'gokken';
                else rMiddel = 'alcohol'; 
            }

            const rVoltooid = getVoltooidDeelwoord(rMiddel);
            const displayMiddel = rMiddel === 'cocaine' ? 'Cocaïne' : rMiddel;
            const badgeLabel = displayMiddel.charAt(0).toUpperCase() + displayMiddel.slice(1);

            const dateObj = new Date(reg.tijdstip);
            const dateDisplay = !isNaN(dateObj) ? dateObj.toLocaleString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : reg.tijdstip;
            
            const extPlaats = reg.plaats ? `<div><strong>Locatie:</strong> ${reg.plaats}</div>` : '';
            const extWieFiltered = (reg.personen || []).map(p => {
                const lower = p.toLowerCase();
                return (lower.includes('vrienden') || lower.includes('blowmaatjes')) ? 'Vrienden' : p;
            });
            const extWie = extWieFiltered.length ? `<div><strong>Personen:</strong> ${extWieFiltered.join(', ')}</div>` : '';
            const extWat = (reg.situatieContext && reg.situatieContext.length) ? `<div><strong>Situatie:</strong> ${reg.situatieContext.join(', ')}</div>` : '';
            
            const intGedachte = (reg.gedachten && reg.gedachten.length) ? `<div><strong>Gedachten:</strong> ${reg.gedachten.join(', ')}</div>` : '';
            const intGevoel = (reg.gevoelens && reg.gevoelens.length) ? `<div><strong>Gevoel:</strong> ${reg.gevoelens.join(', ')}</div>` : '';

            let gedragText = '';

            if (reg.actieType === 'drinken' || reg.actieType === 'gebruiken') { 
                let alcoholItems = [];
                let overigItems = [];
                let totalAlcoholGlazen = reg.totaalStandaardGlazen || 0;

                if (rMiddel === 'alcohol' && (details.soort || details.drank)) {
                    alcoholItems.push({ ...details });
                } else if (details.soort || details.drank) {
                    overigItems.push({ ...details, middel: rMiddel });
                }

                if (reg.extraMiddelen && Array.isArray(reg.extraMiddelen)) {
                    reg.extraMiddelen.forEach(extra => {
                        if (extra.type === 'alcohol') {
                            alcoholItems.push(extra);
                        } else {
                            overigItems.push(extra);
                        }
                    });
                }

                gedragText = `<div style="font-weight:700; color:#ef4444; margin-bottom:4px;">⚠️ Wel ${rVoltooid}</div>`;

                if (alcoholItems.length > 0) {
                    alcoholItems.forEach(item => {
                        let maatSuffix = item.maat ? ` (${item.maat} ml)` : '';
                        let qty = item.weergaveAantal !== undefined ? item.weergaveAantal : (item.aantal || '');
                        gedragText += `• ${qty}x ${item.eenheid || item.verpakking || ''} ${item.soort || item.drank}${maatSuffix}<br>`;
                    });
                    gedragText += `<span style="color:#ef4444; font-weight:bold;">(Totaal: ca. ${totalAlcoholGlazen.toFixed(1)} st.glazen)</span><br>`;
                }

                if (overigItems.length > 0) {
                    if (alcoholItems.length > 0) {
                        gedragText += `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #cbd5e1; font-size: 15px; color: #475569;">`;
                        gedragText += `<b>Ook gebruikt:</b><ul style="margin: 4px 0 0 0; padding-left: 16px;">`;
                        overigItems.forEach(item => {
                            let qty = item.weergaveAantal !== undefined ? item.weergaveAantal : (item.aantal || '');
                            if (item.middel === 'gokken' || item.soort === 'Geld ingezet') {
                                let bedrag = qty || item.berekend || '';
                                if (!bedrag && item.drank) bedrag = item.drank.replace(/[^0-9]/g, '');
                                gedragText += `<li>€${bedrag || 'onbekend'} ingezet</li>`;
                            } else if (item.berekendLabel || item.eenheid) {
                                let eenheid = item.eenheid || '';
                                if (eenheid.toLowerCase() === 'joints' && parseFloat(qty) <= 1) eenheid = 'joint';
                                gedragText += `<li>${qty}${eenheid === 'x' ? 'x' : ' ' + eenheid} ${item.soort || item.drank}</li>`;
                            } else {
                                gedragText += `<li>${item.soort || item.drank} (${qty || 'onbekend'})</li>`;
                            }
                        });
                        gedragText += `</ul></div>`;
                    } else {
                        overigItems.forEach(item => {
                            let qty = item.weergaveAantal !== undefined ? item.weergaveAantal : (item.aantal || '');
                            if (item.middel === 'gokken' || item.soort === 'Geld ingezet') {
                                let bedrag = qty || item.berekend || '';
                                if (!bedrag && item.drank) bedrag = item.drank.replace(/[^0-9]/g, '');
                                gedragText += `€${bedrag || 'onbekend'} ingezet<br>`;
                            } else if (item.berekendLabel || item.eenheid) {
                                let eenheid = item.eenheid || '';
                                if (eenheid.toLowerCase() === 'joints' && parseFloat(qty) <= 1) eenheid = 'joint';
                                gedragText += `${qty}${eenheid === 'x' ? 'x' : ' ' + eenheid} ${item.soort || item.drank}<br>`;
                            } else {
                                gedragText += `${item.soort || item.drank} (${qty || 'onbekend'})<br>`;
                            }
                        });
                    }
                }

            } else if (reg.actieType === 'alternatief') {
                let altList = 'Niets specifieks';
                if (Array.isArray(reg.alternatiefTekst)) {
                    altList = reg.alternatiefTekst.length ? reg.alternatiefTekst.join(', ') : 'Niets specifieks';
                } else if (typeof reg.alternatiefTekst === 'string' && reg.alternatiefTekst) {
                    altList = reg.alternatiefTekst;
                }
                
                let seBadge = (reg.selfEfficacyScore !== null && reg.selfEfficacyScore !== undefined) 
                    ? `<span style="display: inline-block; margin-top: 4px; font-size: 11px; background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; padding: 2px 6px; border-radius: 4px; font-weight: 700;">Vertrouwen: ${reg.selfEfficacyScore}%</span><br>` 
                    : '';

                gedragText = `<div style="font-weight:700; color:#10b981; margin-bottom:4px;">🛡️ Niet ${rVoltooid}</div>Alternatief: ${altList}<br>${seBadge}`;
                
                if (reg.extraMiddelen && reg.extraMiddelen.length > 0) {
                    let extraText = `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #cbd5e1; font-size: 15px; color: #475569;">`;
                    extraText += `<b>Wel gebruikt (terugval/vervanging):</b><ul style="margin: 4px 0 0 0; padding-left: 16px;">`;
                    reg.extraMiddelen.forEach(item => {
                        let qty = item.weergaveAantal !== undefined ? item.weergaveAantal : (item.aantal || '');
                        if (item.type === 'alcohol' && item.berekend !== undefined) {
                            let maatSuffix = item.maat ? ` (${item.maat} ml)` : '';
                            extraText += `<li>${qty}x ${item.eenheid} ${item.soort}${maatSuffix} <span style="color:#ef4444;">(${item.berekend} glz)</span></li>`;
                        } else if (item.middel === 'gokken' || item.soort === 'Geld ingezet') {
                            let bedrag = qty || item.berekend || '';
                            if (!bedrag && item.drank) bedrag = item.drank.replace(/[^0-9]/g, '');
                            extraText += `<li>€${bedrag || 'onbekend'} ingezet</li>`;
                        } else if (item.berekendLabel || item.eenheid) {
                            let eenheid = item.eenheid || '';
                            if (eenheid.toLowerCase() === 'joints' && parseFloat(qty) <= 1) eenheid = 'joint';
                            extraText += `<li>${qty}${eenheid === 'x' ? 'x' : ' ' + eenheid} ${item.soort || item.drank}</li>`;
                        } else {
                            extraText += `<li>${item.soort || item.drank} (${qty || 'onbekend'})</li>`;
                        }
                    });
                    extraText += `</ul></div>`;
                    gedragText += extraText;
                }
                
            } else {
                gedragText = 'Niet ingevuld';
            }

            let posText = '';
            if (Array.isArray(reg.positieveEffecten)) {
                posText = reg.positieveEffecten.length ? reg.positieveEffecten.join(', ') : '';
            } else if (typeof reg.positieveEffecten === 'string') {
                posText = reg.positieveEffecten;
            }
            const pos = posText ? `<div><strong>Positief:</strong> ${posText}</div>` : '';

            let negText = '';
            if (Array.isArray(reg.negatieveEffecten)) {
                negText = reg.negatieveEffecten.length ? reg.negatieveEffecten.join(', ') : '';
            } else if (typeof reg.negatieveEffecten === 'string') {
                negText = reg.negatieveEffecten;
            }
            const neg = negText ? `<div><strong>Negatief:</strong> ${negText}</div>` : '';

            html += `
                <details class="reg-card">
                    <summary class="reg-card-summary">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div style="flex-grow: 1; padding-right: 16px;">
                                <div style="font-weight: 800; color: #1e293b; font-size: 16px;">${dateDisplay}</div>
                                <div style="margin-top: 6px; margin-bottom: 12px;"><span style="font-size: 11px; font-weight: 700; color: #475569; background: #e2e8f0; padding: 4px 8px; border-radius: 6px;">${badgeLabel}</span></div>
                                <div style="font-size: 14px; color: #334155;">${gedragText}</div>
                            </div>
                            <div class="toggle-icon" style="color: #64748b; font-size: 16px; transition: transform 0.3s;">▼</div>
                        </div>
                    </summary>
                    <div class="reg-card-details">
                        <span class="t-label">Gebeurtenis</span>
                        ${extPlaats}${extWie}${extWat}
                        
                        <span class="t-label">Gedachten & Gevoelens</span>
                        ${intGedachte}${intGevoel}
                        
                        <span class="t-label">Gevolgen</span>
                        ${pos}${neg}
                        
                        <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px;">
                            <button type="button" style="background: none; border: 1px solid #cbd5e1; color: #475569; padding: 6px 12px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer;" onclick="editRegistratie(${reg.id})">✏️ Bijwerken</button>
                            <button type="button" style="background: none; border: 1px solid #fca5a5; color: #ef4444; padding: 6px 12px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer;" onclick="deleteRegistratie(${reg.id})">🗑️ Verwijderen</button>
                        </div>
                    </div>
                </details>
            `;
        });

        html += `
            </div>
            <button id="btn-nieuw-fab" class="fab-btn stagger-3">+</button>
        `;
    }

    html += `</div>`;
    container.innerHTML = html;

    const btnLeeg = document.getElementById('btn-nieuw-leeg');
    const btnFab = document.getElementById('btn-nieuw-fab');

    if (btnLeeg) btnLeeg.addEventListener('click', () => { window.showRegStep('intro'); window.renderFormulier(); });
    if (btnFab) btnFab.addEventListener('click', () => { window.showRegStep('intro'); window.renderFormulier(); });
}

// --------------------------------------------------------
// FUNCTIES VOOR HET GENEREREN EN BEPERKEN VAN CHIPS
// --------------------------------------------------------

function populateInitialChips(category, targetId) {
    const currentData = getActiveData();
    let rawItems = currentData.registraties[category];
    if (!rawItems) return;
    
    // Voeg 'shown' en 'hidden' arrays samen als de bron data opgesplitst is
    let items = [];
    if (rawItems.shown && rawItems.hidden) {
        items = [...rawItems.shown, ...rawItems.hidden];
    } else if (Array.isArray(rawItems)) {
        items = rawItems;
    }
    
    if (items.length === 0) return;
    
    let html = '';
    let hasHidden = false;

    items.forEach((item, index) => {
        let displayText = item.text || item.val || item;
        const lowerText = String(displayText).toLowerCase();
        const safeVal = (item.val || item.text || item).replace(/'/g, "\\'");
        let iconHtml = item.icon ? `<span>${item.icon}</span>` : '';
        
        if (lowerText.includes('vrienden') || lowerText.includes('blowmaatjes')) { displayText = '🤝 Vrienden'; iconHtml = ''; }
        if (displayText === "Ik moet m'n geld terug") { displayText = "Ik moet m'n geld terugverdienen"; iconHtml = ''; }
        
        // Vanaf index 4 krijgen ze een 'hidden' class zodat de layout netjes blijft
        const isExtra = index >= 4;
        const extraClass = isExtra ? ` extra-chip-${targetId}` : '';
        const extraStyle = isExtra ? 'display: none;' : 'display: inline-flex;';
        if (isExtra) hasHidden = true;

        if (lowerText === 'dealer / onbekenden') {
            html += `<button type="button" class="reg-chip${extraClass}" style="${extraStyle}" data-val="Dealer" onclick="selectChip('${targetId}', 'Dealer', this)">Dealer</button> `;
            html += `<button type="button" class="reg-chip${extraClass}" style="${extraStyle}" data-val="Onbekenden" onclick="selectChip('${targetId}', 'Onbekenden', this)">Onbekenden</button> `;
            return;
        }

        html += `<button type="button" class="reg-chip${extraClass}" style="${extraStyle}" data-val="${safeVal}" onclick="selectChip('${targetId}', '${safeVal}', this)">${iconHtml}<span>${displayText}</span></button> `;
    });
    
    const container = document.getElementById(`container-${targetId}`);
    if (container) {
        container.innerHTML = html;
    }
    
    const btnMore = document.getElementById(`btn-more-${targetId}`);
    if (btnMore) {
        if (!hasHidden) {
            btnMore.style.display = 'none';
        } else {
            btnMore.style.display = 'inline-block';
            btnMore.textContent = '+ Meer voorbeelden';
            btnMore.dataset.expanded = 'false';
        }
    }
}

// Zorgt dat statische arrays (zoals Alternatief, Pos en Neg) op identieke wijze max 4 tonen
function populateStaticChips(suggesties, targetId) {
    let html = '';
    let hasHidden = false;

    suggesties.forEach((sug, index) => {
        const isExtra = index >= 4;
        const extraClass = isExtra ? ` extra-chip-${targetId}` : '';
        const extraStyle = isExtra ? 'display: none;' : 'display: inline-flex;';
        if (isExtra) hasHidden = true;

        html += `<button type="button" class="reg-chip${extraClass}" style="${extraStyle}" data-val="${sug}" onclick="selectChip('${targetId}', '${sug}', this)"><span>${getUniqueEmoji(sug)}</span><span>${sug}</span></button> `;
    });
    
    const container = document.getElementById(`container-${targetId}`);
    if (container) {
        container.innerHTML = html;
    }
    
    const btnMore = document.getElementById(`btn-more-${targetId}`);
    if (btnMore) {
        if (!hasHidden) {
            btnMore.style.display = 'none';
        } else {
            btnMore.style.display = 'inline-block';
            btnMore.textContent = '+ Meer voorbeelden';
            btnMore.dataset.expanded = 'false';
        }
    }
}

window.renderCatalogus = renderCatalogus;

window.editRegistratie = function(id) {
    const registraties = JSON.parse(localStorage.getItem('registratiesData') || '[]');
    const regToEdit = registraties.find(r => r.id === id);
    if (regToEdit) {
        window.showRegStep('1'); 
        window.renderFormulier(regToEdit);
    }
};

window.restoreChips = function(type, values) {
    if (!values) return;
    const arr = Array.isArray(values) ? values : [values];
    const hiddenInputId = type === 'situatie' ? 'reg-situatie-val' : type === 'gezelschap' ? 'reg-personen' : (type === 'locatie' ? 'reg-plaats' : `reg-${type}-val`);

    let colorClass = 'selected-blue';
    if (type === 'neg') colorClass = (regData.actieType === 'alternatief') ? 'selected-orange' : 'selected-red';
    else if (type === 'pos') colorClass = (regData.actieType === 'alternatief') ? 'selected-green' : 'selected-orange';
    else if (type === 'alternatief') colorClass = 'selected-purple';

    arr.forEach(val => {
        const safeVal = val.replace(/'/g, "\\'");
        const existingChip = document.querySelector(`#container-${type} .reg-chip[data-val="${safeVal}"]`);
        
        if (existingChip) {
            existingChip.classList.add('selected', colorClass);
            // ALTIJD ZICHTBAAR MAKEN ALS HIJ GESELECTEERD IS (ook als het een extra-chip is)
            existingChip.style.display = 'inline-flex';
        } else {
            const container = document.getElementById(`container-${type}`);
            const newChip = document.createElement('button');
            newChip.type = 'button';
            newChip.className = `reg-chip selected ${colorClass}`;
            newChip.dataset.val = val;
            newChip.innerHTML = `<span>${getUniqueEmoji(val)}</span><span>${val}</span>`;
            newChip.onclick = function() { window.selectChip(type, val, this); };
            
            if (container) {
                container.appendChild(newChip);
            }
        }
    });
    
    if (type === 'locatie') {
        document.getElementById(hiddenInputId).value = arr[0] || '';
    } else {
        document.getElementById(hiddenInputId).value = JSON.stringify(arr);
    }
};

window.renderFormulier = function(editData = null) {
    if (window.pushAppHistory) window.pushAppHistory('logbook-new');
    window.scrollTo(0, 0);

    if (editData) {
        regData = JSON.parse(JSON.stringify(editData));
        window._extraItemCount = regData.extraMiddelen ? regData.extraMiddelen.length : 0;
    } else {
        window._extraItemCount = 0;
        regData = {
            id: null, middel: '', tijdstip: '', plaats: '', situatieContext: [], personen: [], gedachten: [],
            gevoelens: [], actieType: null, gebruikDetails: {}, extraMiddelen: [], alternatiefTekst: [],
            selfEfficacyScore: null, positieveEffecten: [], negatieveEffecten: [], totaalStandaardGlazen: 0, hoeveelheid: 0
        };
    }

    const container = document.getElementById('app-content') || document.getElementById('app');
    if (!container) return;
    
    const addictionKey = getActiveAddictionKey();
    const voltooid = getVoltooidDeelwoord(addictionKey);

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const maxDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

    const defaultTime = (editData && editData.tijdstip) ? editData.tijdstip.slice(0, 16) : maxDateTime;

    const alternatiefSuggesties = [
        { text: "Wandelen", icon: "🚶‍♂️" }, 
        { text: "Sporten", icon: "💪" }, 
        { text: "Telefoongebruik", icon: "📱" }, 
        { text: "Muziek", icon: "🎧" }, 
        { text: "Iets anders drinken (water / fris / thee)", icon: "🥤" }, 
        { text: "Weggaan uit de situatie", icon: "🚪" }, 
        { text: "Afleiding zoeken", icon: "🧩" }, 
        { text: "Er met iemand over praten", icon: "💬" }
    ];

    let specifiekeGedragInvoer = '';
    
    if (addictionKey === 'alcohol') {
        specifiekeGedragInvoer = `
            <div style="background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0;">
                <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 12px;">
                    <label style="font-size: 14px; font-weight: 600; color: #64748b;">Soort drank</label>
                    <select id="reg-drank-type" class="form-input" style="border-radius: 8px; padding: 10px;" onchange="updateAlcoholDropdowns('type')">
                        <option value="" selected disabled>-- Kies soort --</option>
                        <option value="bier">Bier</option>
                        <option value="wijn">Wijn</option>
                        <option value="sterke drank">Sterke drank</option>
                        <option value="mixdrank">Mixdrank</option>
                        <option value="cocktail">Cocktail</option>
                    </select>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
                    <div>
                        <label style="font-size: 14px; font-weight: 600; color: #64748b;">Verpakking / Type</label>
                        <select id="reg-drank-verpakking" class="form-input" style="border-radius: 8px; padding: 10px;" onchange="updateAlcoholDropdowns('verpakking')">
                            <option value="" selected disabled>-- Kies eerst soort --</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size: 14px; font-weight: 600; color: #64748b;">Aantal eenheden</label>
                        <input type="number" id="reg-drank-aantal" class="form-input" style="border-radius: 8px; padding: 10px;" min="1" value="1" oninput="calcStandaardGlazen()">
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <div>
                        <label style="font-size: 14px; font-weight: 600; color: #64748b;">Maat</label>
                        <select id="reg-drank-maat" class="form-input" style="border-radius: 8px; padding: 10px;" onchange="calcStandaardGlazen()">
                            <option value="" selected disabled>-- Kies maat --</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size: 14px; font-weight: 600; color: #64748b;">Alcohol %</label>
                        <select id="reg-drank-percentage" class="form-input" style="border-radius: 8px; padding: 10px;" onchange="calcStandaardGlazen()">
                            <option value="" selected disabled>-- Kies percentage --</option>
                        </select>
                    </div>
                </div>
                <div id="calc-result" style="font-weight: 700; color: #2563eb; font-size: 14px; text-align: center; margin-top: 12px;"></div>
            </div>
        `;
    } else if (addictionKey === 'cannabis') {
        specifiekeGedragInvoer = `
            <div style="background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0;">
                <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 12px;">
                    <label style="font-size: 14px; font-weight: 600; color: #64748b;">Wat precies?</label>
                    <select id="reg-can-wat" class="form-input" style="border-radius: 8px; padding: 10px;" onchange="checkStep3Completion()">
                        <option value="Wiet">Wiet</option>
                        <option value="Hasj">Hasj</option>
                    </select>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <div>
                        <label style="font-size: 14px; font-weight: 600; color: #64748b;">Eenheid</label>
                        <select id="reg-can-eenheid" class="form-input" style="border-radius: 8px; padding: 10px;" onchange="checkStep3Completion()">
                            <option value="Joints">Joints</option>
                            <option value="Gram">Gram</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size: 14px; font-weight: 600; color: #64748b;">Hoeveelheid</label>
                        <input type="number" id="reg-can-aantal" class="form-input" style="border-radius: 8px; padding: 10px;" min="0.1" step="0.5" value="1" oninput="checkStep3Completion()">
                    </div>
                </div>
            </div>
        `;
    } else if (addictionKey === 'cocaine') {
        specifiekeGedragInvoer = `
            <div style="background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0;">
                <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 12px;">
                    <label style="font-size: 14px; font-weight: 600; color: #64748b;">Wat precies?</label>
                    <select id="reg-coc-wat" class="form-input" style="border-radius: 8px; padding: 10px;" onchange="checkStep3Completion()">
                        <option value="Snuifcocaïne">Snuifcocaïne</option>
                        <option value="Crack / Basecoke">Crack / Basecoke</option>
                    </select>
                </div>
                <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                    <div>
                        <label style="font-size: 14px; font-weight: 600; color: #64748b;">Hoeveelheid (in gram)</label>
                        <input type="number" id="reg-coc-aantal" class="form-input" style="border-radius: 8px; padding: 10px;" min="0.1" step="0.1" value="1.0" oninput="checkStep3Completion()">
                    </div>
                </div>
            </div>
        `;
    } else if (addictionKey === 'gokken') {
        specifiekeGedragInvoer = `
            <div style="background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0;">
                <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                    <div>
                        <label style="font-size: 14px; font-weight: 600; color: #64748b;">Hoeveel geld heb je ingezet (€)?</label>
                        <input type="number" id="reg-gok-aantal" class="form-input" style="border-radius: 8px; padding: 10px;" min="0" step="10" value="50" oninput="checkStep3Completion()">
                    </div>
                </div>
            </div>
        `;
    }

    const htmlContent = `
        <style>
            @keyframes slideUpFade { 0% { opacity: 0; transform: translateY(15px); } 100% { opacity: 1; transform: translateY(0); } }
            .stagger-1 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.1s; }
            .stagger-2 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.2s; }
            .stagger-3 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.3s; }
            .stagger-4 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.4s; }
            
            .info-block { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
            .info-block-border-blue { border-left: 4px solid #3b82f6; }
            .info-block-border-orange { border-left: 4px solid #f59e0b; }
            .info-block-border-green { border-left: 4px solid #10b981; }
            .info-block-border-red { border-left: 4px solid #ef4444; }
            .info-block-border-purple { border-left: 4px solid #8b5cf6; }
            
            input[type="datetime-local"] { font-family: 'Nunito', sans-serif !important; font-size: 15px !important; font-weight: 600 !important; color: #1e293b !important; }
            
            /* Frisse styling voor alle chips, standaard display inline-flex */
           .reg-chip {
                display: inline-flex; align-items: flex-start; gap: 8px; padding: 10px 16px; border-radius: 20px;
                font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s;
                border: 1px solid #cbd5e1; background: #ffffff; color: #334155; font-family: inherit;
                text-align: left; line-height: 1.4; max-width: 100%;
            }
            .reg-chip:hover { background: #f8fafc; transform: translateY(-1px); box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
            
            /* Verschillende selectie kleuren op basis van context */
            .reg-chip.selected-blue { border-color: #3b82f6; background: #eff6ff; color: #2563eb; box-shadow: 0 2px 4px rgba(59,130,246,0.1); font-weight: 600; }
            .reg-chip.selected-red { border-color: #ef4444; background: #fef2f2; color: #b91c1c; box-shadow: 0 2px 4px rgba(239,68,68,0.1); font-weight: 600; }
            .reg-chip.selected-orange { border-color: #f59e0b; background: #fffbeb; color: #b45309; box-shadow: 0 2px 4px rgba(245,158,11,0.1); font-weight: 600; }
            .reg-chip.selected-purple { border-color: #8b5cf6; background: #f5f3ff; color: #6d28d9; box-shadow: 0 2px 4px rgba(139,92,246,0.1); font-weight: 600; }
            .reg-chip.selected-green { border-color: #10b981; background: #f0fdf4; color: #047857; box-shadow: 0 2px 4px rgba(16,185,129,0.1); font-weight: 600; }

            /* Actiekaarten (Stap 3) */
            .choice-card { border-radius: 16px; padding: 20px; border: 2px solid #e2e8f0; background: #ffffff; cursor: pointer; text-align: left; transition: all 0.2s; }
            .choice-card:hover { border-color: #cbd5e1; transform: translateY(-2px); }
            .choice-card.selected-red { border-color: #ef4444; background: #fef2f2; box-shadow: 0 0 0 3px rgba(239,68,68,0.2); transform: scale(1.02); }
            .choice-card.selected-green { border-color: #10b981; background: #f0fdf4; box-shadow: 0 0 0 3px rgba(16,185,129,0.2); transform: scale(1.02); }

            .btn-outline { background: white; border: 1px solid #cbd5e1; color: #3b82f6; font-weight: 600; padding: 10px 16px; border-radius: 20px; font-size: 14px; cursor: pointer; transition: all 0.2s; }
            .btn-outline:hover { background: #f8fafc; border-color: #94a3b8; }
            
            .btn-more { background: none; border: none; color: #2563eb; font-weight: 600; cursor: pointer; padding: 0; font-size: 14px; margin-bottom: 20px; margin-top: 8px; display: inline-block; }
            
            /* Moderne invoervelden */
            .custom-input-wrapper { display: flex; gap: 10px; align-items: center; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px 6px 6px 16px; }
            .custom-input-wrapper input { flex: 1; border: none; background: transparent; outline: none; font-size: 14px; color: #334155; font-family: inherit; }
            .custom-input-wrapper .reg-btn-add { background: #1e293b; color: white; border: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; transition: background 0.2s; }
            .custom-input-wrapper .reg-btn-add:hover { background: #334155; }
        </style>

        <div class="module-container" style="font-family: 'Nunito', sans-serif, system-ui; color: #1e293b;">
            
            <div id="reg-header-nav" style="display: flex; align-items: center; margin-bottom: 16px;">
                <button id="btn-back-cat" style="background: none; border: none; font-size: 24px; color: #64748b; cursor: pointer; margin-right: 12px; padding: 0;">←</button>
                <span style="font-size: 16px; font-weight: 700; color: #64748b;">Terug naar overzicht</span>
            </div>

            <div class="progress-bar-container" style="background: #e2e8f0; height: 6px; border-radius: 3px; margin-bottom: 24px; overflow: hidden;">
                <div class="progress-bar" id="reg-progress-bar" style="width: 10%; height: 100%; background: #2563eb; transition: width 0.3s; border-radius: 3px;"></div>
            </div>

            <!-- STAP 0: INTRODUCTIE -->
            <section class="wizard-step active" id="reg-step-intro">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 32px;">
                        <span style="font-size: 14px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Nieuwe Registratie</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Inzicht door registratie</h2>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">
                        <div class="stagger-1 info-block info-block-border-blue">
                            <span style="font-size: 24px; display: block; margin-bottom: 8px;">🧠</span>
                            <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                                <strong>Inzicht in patronen.</strong> Het invullen van registraties helpt je om patronen te ontdekken. Door telkens stil te staan bij je gevoelens en omgeving, leer je je eigen valkuilen herkennen.
                            </p>
                        </div>
                        <div class="stagger-2 info-block info-block-border-orange">
                            <span style="font-size: 24px; display: block; margin-bottom: 8px;">📊</span>
                            <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                                <strong>Trek en Gedrag.</strong> We brengen zo in kaart wat je aan het doen was, wie erbij waren en wat je op dat moment dacht en voelde toen de trek toesloeg.
                            </p>
                        </div>
                        <div class="stagger-3 info-block info-block-border-green">
                            <span style="font-size: 24px; display: block; margin-bottom: 8px;">🛡️</span>
                            <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                                <strong>Helpend gedrag.</strong> Bovenal ontdek je gaandeweg welk alternatief gedrag voor jóu het beste werkt op moeilijke momenten.
                            </p>
                        </div>
                    </div>

                    <div class="stagger-4 button-group" style="display: flex; justify-content: flex-end;">
                        <button type="button" class="btn-primary" onclick="showRegStep(1)">Start met invullen &rarr;</button>
                    </div>
                </div>
            </section>

            <!-- STAP 1 -->
            <section class="wizard-step" id="reg-step-1" style="display: none;">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 24px;">
                        <span style="font-size: 14px; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Stap 1 van 4</span>
                        <h2 style="font-size: 24px; font-weight: 700; color: #1e293b; margin-top: 4px; margin-bottom: 6px;">Externe situatie</h2>
                        <p style="font-size: 14px; font-weight: 600; color: #3b82f6; margin: 8px 0 0 0; background: #eff6ff; padding: 10px 14px; border-radius: 8px; border: 1px solid #bfdbfe;">
                            ℹ️ Vul dit in voor het moment waarop je <strong>trek kreeg</strong>, ongeacht of je daarna wel of niet hebt ${voltooid}.
                        </p>
                    </div>

                    <div class="info-block info-block-border-blue stagger-1" style="margin-bottom: 24px;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                            <span style="font-size: 24px;">🕒</span>
                            <h3 style="font-size: 18px; color: #1e293b; margin: 0; font-weight: 800;">Tijdstip</h3>
                        </div>
                        <p style="font-size: 14px; color: #64748b; margin-bottom: 16px; margin-top: 0;">Op welk moment begon de trek?</p>
                        
                        <input type="datetime-local" id="reg-tijd" class="form-input" max="${maxDateTime}" style="border-radius: 12px; padding: 12px 14px; border: 1px solid #cbd5e1; width: 100%; box-sizing: border-box;" value="${defaultTime}" onchange="checkStep1Completion()">
                    </div>

                    <div class="info-block info-block-border-blue stagger-2" style="margin-bottom: 24px;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                            <span style="font-size: 24px;">📍</span>
                            <h3 style="font-size: 18px; color: #1e293b; margin: 0; font-weight: 800;">Waar was je?</h3>
                        </div>
                        <p style="font-size: 14px; color: #64748b; margin-bottom: 16px; margin-top: 0;">Geef aan op welke locatie je was.</p>
                        
                        <div class="chip-container" id="container-locatie" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
                        </div>
                        <button type="button" id="btn-more-locatie" class="btn-more" style="display: none;" onclick="toggleMore('locatie')">+ Meer voorbeelden</button>
                        
                        <div class="custom-input-wrapper">
                            <input type="text" id="reg-locatie-eigen" placeholder="+ Voeg eigen locatie toe" onkeypress="if(event.key==='Enter') { event.preventDefault(); addCustomChip('locatie'); }">
                            <button type="button" class="reg-btn-add" onclick="addCustomChip('locatie')">Toevoegen</button>
                        </div>
                        <input type="hidden" id="reg-plaats" value="">
                    </div>

                    <div class="info-block info-block-border-blue stagger-3" style="margin-bottom: 24px;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                            <span style="font-size: 24px;">🎬</span>
                            <h3 style="font-size: 18px; color: #1e293b; margin: 0; font-weight: 800;">Wat was de situatie?</h3>
                        </div>
                        <p style="font-size: 14px; color: #64748b; margin-bottom: 16px; margin-top: 0;">Wat gebeurde er precies om je heen?</p>
                        
                        <div class="chip-container" id="container-situatie" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
                        </div>
                        <button type="button" id="btn-more-situatie" class="btn-more" style="display: none;" onclick="toggleMore('situatie')">+ Meer voorbeelden</button>
                        
                        <div class="custom-input-wrapper">
                            <input type="text" id="reg-situatie-eigen" placeholder="+ Voeg eigen situatie toe" onkeypress="if(event.key==='Enter') { event.preventDefault(); addCustomChip('situatie'); }">
                            <button type="button" class="reg-btn-add" onclick="addCustomChip('situatie')">Toevoegen</button>
                        </div>
                        <input type="hidden" id="reg-situatie-val" value="[]">
                    </div>

                    <div class="info-block info-block-border-blue stagger-4">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                            <span style="font-size: 24px;">👥</span>
                            <h3 style="font-size: 18px; color: #1e293b; margin: 0; font-weight: 800;">Wie waren erbij?</h3>
                        </div>
                        <p style="font-size: 14px; color: #64748b; margin-bottom: 16px; margin-top: 0;">In welk gezelschap bevond je je?</p>
                        
                        <div class="chip-container" id="container-gezelschap" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
                        </div>
                        <button type="button" id="btn-more-gezelschap" class="btn-more" style="display: none;" onclick="toggleMore('gezelschap')">+ Meer voorbeelden</button>
                        
                        <div class="custom-input-wrapper">
                            <input type="text" id="reg-gezelschap-eigen" placeholder="+ Voeg eigen gezelschap toe" onkeypress="if(event.key==='Enter') { event.preventDefault(); addCustomChip('gezelschap'); }">
                            <button type="button" class="reg-btn-add" onclick="addCustomChip('gezelschap')">Toevoegen</button>
                        </div>
                        <input type="hidden" id="reg-personen" value="[]">
                    </div>

                    <div class="button-group stagger-4">
                        <button type="button" class="btn-secondary" onclick="showRegStep('intro')">&larr; Terug</button>
                        <button type="button" class="btn-primary" id="btn-reg-1-next" disabled>Volgende &rarr;</button>
                    </div>
                </div>
            </section>

            <!-- STAP 2 -->
            <section class="wizard-step" id="reg-step-2" style="display: none;">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 24px;">
                        <span style="font-size: 14px; font-weight: 700; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.5px;">Stap 2 van 4</span>
                        <h2 style="font-size: 24px; font-weight: 700; color: #1e293b; margin-top: 4px; margin-bottom: 6px;">Interne beleving</h2>
                        <p style="font-size: 15px; color: #475569; margin: 0;">Welke gedachten en gevoelens speelden er van binnen toen je trek kreeg?</p>
                    </div>

                    <div class="info-block info-block-border-orange stagger-1" style="margin-bottom: 24px;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                            <span style="font-size: 24px;">💭</span>
                            <h3 style="font-size: 18px; color: #1e293b; margin: 0; font-weight: 800;">Gedachten</h3>
                        </div>
                        <p style="font-size: 14px; color: #64748b; margin-bottom: 16px; margin-top: 0;">Welke gedachten gingen er door je heen?</p>
                        
                        <div class="chip-container" id="container-gedachten" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
                        </div>
                        <button type="button" id="btn-more-gedachten" class="btn-more" style="display: none;" onclick="toggleMore('gedachten')">+ Meer voorbeelden</button>
                        
                        <div class="custom-input-wrapper">
                            <input type="text" id="reg-gedachten-eigen" placeholder="+ Voeg eigen gedachte toe" onkeypress="if(event.key==='Enter') { event.preventDefault(); addCustomChip('gedachten'); }">
                            <button type="button" class="reg-btn-add" onclick="addCustomChip('gedachten')">Toevoegen</button>
                        </div>
                        <input type="hidden" id="reg-gedachten-val" value="[]">
                    </div>

                    <div class="info-block info-block-border-orange stagger-2">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                            <span style="font-size: 24px;">💓</span>
                            <h3 style="font-size: 18px; color: #1e293b; margin: 0; font-weight: 800;">Gevoelens</h3>
                        </div>
                        <p style="font-size: 14px; color: #64748b; margin-bottom: 16px; margin-top: 0;">Welke emoties of fysieke sensaties merkte je op?</p>
                        
                        <div class="chip-container" id="container-gevoelens" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
                        </div>
                        <button type="button" id="btn-more-gevoelens" class="btn-more" style="display: none;" onclick="toggleMore('gevoelens')">+ Meer voorbeelden</button>
                        
                        <div class="custom-input-wrapper">
                            <input type="text" id="reg-gevoelens-eigen" placeholder="+ Voeg eigen gevoel toe" onkeypress="if(event.key==='Enter') { event.preventDefault(); addCustomChip('gevoelens'); }">
                            <button type="button" class="reg-btn-add" onclick="addCustomChip('gevoelens')">Toevoegen</button>
                        </div>
                        <input type="hidden" id="reg-gevoelens-val" value="[]">
                    </div>

                    <div class="button-group stagger-3">
                        <button type="button" class="btn-secondary" id="btn-reg-2-back" onclick="showRegStep(1)">&larr; Terug</button>
                        <button type="button" class="btn-primary" id="btn-reg-2-next" disabled>Volgende &rarr;</button>
                    </div>
                </div>
            </section>

            <!-- STAP 3 -->
            <section class="wizard-step" id="reg-step-3" style="display: none;">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 14px; font-weight: 700; color: #ef4444; text-transform: uppercase; letter-spacing: 0.5px;">Stap 3 van 4</span>
                        <h2 style="font-size: 24px; font-weight: 700; color: #1e293b; margin-top: 4px; margin-bottom: 6px;">Jouw actie</h2>
                        <p style="font-size: 15px; color: #475569; margin: 0;">Wat heb je uiteindelijk gedaan in deze situatie?</p>
                    </div>

                    <div class="info-block info-block-border-red stagger-1">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                            <span style="font-size: 24px;">🎬</span>
                            <h3 style="font-size: 18px; color: #1e293b; margin: 0; font-weight: 800;">Maak een keuze</h3>
                        </div>
                        
                        <div class="choice-grid">
                            <button type="button" class="choice-card" id="card-actie-drinken" onclick="setActieType('drinken')">
                                <h4 style="margin: 0 0 6px 0; color: #1e293b; font-size: 16px; font-weight: 700;">⚠️ Wel ${voltooid}</h4>
                                <p style="margin: 0; color: #64748b; font-size: 15px; font-weight: 500;">Je hebt toegegeven aan de trek.</p>
                            </button>
                            <button type="button" class="choice-card" id="card-actie-alternatief" onclick="setActieType('alternatief')">
                                <h4 style="margin: 0 0 6px 0; color: #1e293b; font-size: 16px; font-weight: 700;">🛡️ Niet ${voltooid}</h4>
                                <p style="margin: 0; color: #64748b; font-size: 15px; font-weight: 500;">Gekozen voor alternatief gedrag.</p>
                            </button>
                        </div>

                        <!-- WEL GEBRUIKT / GEDRONKEN FLOW -->
                        <div id="subform-drinken" style="display: none; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                            <div class="form-group">
                                <label style="display: block; font-weight: 700; font-size: 15px; color: #1e293b; margin-bottom: 12px;">Wat heb je precies ${voltooid}?</label>
                                
                                <!-- Hoofdformulier Middel -->
                                ${specifiekeGedragInvoer}
                                
                                <!-- Container voor extra toegevoegde middelen -->
                                <div id="extra-items-container" style="display: flex; flex-direction: column; gap: 8px;"></div>
                                
                                <!-- Knoppen voor polygebruik / extra drankjes -->
                                <div style="display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap;">
                                    ${addictionKey === 'alcohol' ? `<button type="button" class="btn-outline" onclick="addExtraAlcohol()">+ Andere alcoholische drank</button>` : ''}
                                    <button type="button" class="btn-outline" onclick="addExtraSubstance('extra-items-container')">+ Ander middel</button>
                                </div>
                            </div>
                        </div>

                        <!-- NIET GEBRUIKT / ALTERNATIEF FLOW -->
                        <div id="subform-alternatief" style="display: none; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                            <div class="form-group">
                                <label style="display: block; font-weight: 700; font-size: 15px; color: #1e293b; margin-bottom: 12px;">Welk alternatief gedrag heb je ingezet?</label>
                                
                                <div class="chip-container" id="container-alternatief" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
                                </div>
                                <button type="button" id="btn-more-alternatief" class="btn-more" style="display: none;" onclick="toggleMore('alternatief')">+ Meer voorbeelden</button>
                                
                                <div class="custom-input-wrapper">
                                    <input type="text" id="reg-alternatief-eigen" placeholder="+ Voeg eigen actie toe" onkeypress="if(event.key==='Enter') { event.preventDefault(); addCustomChip('alternatief'); }">
                                    <button type="button" class="reg-btn-add" onclick="addCustomChip('alternatief')">Toevoegen</button>
                                </div>
                                <input type="hidden" id="reg-alternatief-val" value="[]">

                                <!-- Terugval / Vervangend middel -->
                                <div style="margin-top: 24px; padding-top: 16px; border-top: 1px dashed #cbd5e1;">
                                    <label style="display: block; font-weight: 700; font-size: 15px; color: #1e293b; margin-bottom: 4px;">Vervangend middel gebruikt?</label>
                                    <p style="font-size: 15px; color: #64748b; margin-bottom: 16px; margin-top: 0;">Heb je in de plaats hiervan iets anders gebruikt (bijv. geblowd i.p.v. gedronken)?</p>
                                    
                                    <div id="alt-extra-items-container" style="display: flex; flex-direction: column; gap: 8px;"></div>
                                    
                                    <div style="display: flex; gap: 8px; margin-top: 12px;">
                                        <button type="button" class="btn-outline" onclick="addExtraSubstance('alt-extra-items-container')">+ Ander middel</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div class="button-group stagger-2">
                        <button type="button" class="btn-secondary" id="btn-reg-3-back" onclick="showRegStep(2)">&larr; Terug</button>
                        <button type="button" class="btn-primary" id="btn-reg-3-next" disabled>Volgende &rarr;</button>
                    </div>
                </div>
            </section>

            <!-- STAP 4 -->
            <section class="wizard-step" id="reg-step-4" style="display: none;">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 14px; font-weight: 700; color: #10b981; text-transform: uppercase; letter-spacing: 0.5px;">Stap 4 van 4</span>
                        <h2 style="font-size: 24px; font-weight: 700; color: #1e293b; margin-top: 4px; margin-bottom: 6px;">De Effecten</h2>
                        <p style="font-size: 15px; color: #475569; margin: 0;">Wat waren de voor- en nadelen van jouw gemaakte keuze?</p>
                    </div>

                    <!-- DYNAMISCH SELF-EFFICACY BLOK -->
                    <div id="self-efficacy-wrapper" style="display: none;">
                        <div class="info-block info-block-border-green stagger-1" style="margin-bottom: 24px;">
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                                <span style="font-size: 24px;">🌟</span>
                                <h3 style="font-size: 18px; color: #1e293b; margin: 0; font-weight: 800;">Succeservaring</h3>
                            </div>
                            <label id="self-efficacy-question" style="font-weight: 600; font-size: 14px; color: #166534; display: block; margin-bottom: 16px; margin-top: 8px; line-height: 1.5;"></label>
                            
                            <div style="display: flex; align-items: center; gap: 16px;">
                                <input type="range" id="reg-se-slider" min="0" max="100" value="70" step="5" style="flex: 1; accent-color: #16a34a; cursor: pointer;" oninput="document.getElementById('se-val-display').innerText = this.value + '%'">
                                <span id="se-val-display" style="font-weight: 800; color: #166534; font-size: 16px; min-width: 50px; text-align: right;">70%</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 14px; color: #15803d; font-weight: 600; margin-top: 8px;">
                                <span>Niet zo snel</span>
                                <span>Zeker wel</span>
                            </div>
                        </div>
                    </div>

                    <div id="pos-effect-block" class="info-block info-block-border-orange stagger-2" style="margin-bottom: 24px;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                            <span style="font-size: 24px;">☀️</span>
                            <h3 style="font-size: 18px; color: #1e293b; margin: 0; font-weight: 800;">Positieve effecten</h3>
                        </div>
                        <p style="font-size: 14px; color: #64748b; margin-bottom: 16px; margin-top: 0;">Wat leverde het op?</p>
                        
                        <div class="chip-container" id="container-pos" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;"></div>
                        <button type="button" id="btn-more-pos" class="btn-more" style="display: none;" onclick="toggleMore('pos')">+ Meer voorbeelden</button>

                        <div class="custom-input-wrapper">
                            <input type="text" id="reg-pos-eigen" placeholder="+ Voeg eigen positief effect toe" onkeypress="if(event.key==='Enter') { event.preventDefault(); addCustomChip('pos'); }">
                            <button type="button" class="reg-btn-add" onclick="addCustomChip('pos')">Toevoegen</button>
                        </div>
                        <input type="hidden" id="reg-pos-val" value="[]">
                    </div>

                    <div id="neg-effect-block" class="info-block info-block-border-red stagger-3">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                            <span style="font-size: 24px;">📉</span>
                            <h3 style="font-size: 18px; color: #1e293b; margin: 0; font-weight: 800;">Negatieve effecten</h3>
                        </div>
                        <p style="font-size: 14px; color: #64748b; margin-bottom: 16px; margin-top: 0;">Wat kostte het?</p>
                        
                        <div class="chip-container" id="container-neg" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;"></div>
                        <button type="button" id="btn-more-neg" class="btn-more" style="display: none;" onclick="toggleMore('neg')">+ Meer voorbeelden</button>

                        <div class="custom-input-wrapper">
                            <input type="text" id="reg-neg-eigen" placeholder="+ Voeg eigen negatief effect toe" onkeypress="if(event.key==='Enter') { event.preventDefault(); addCustomChip('neg'); }">
                            <button type="button" class="reg-btn-add" onclick="addCustomChip('neg')">Toevoegen</button>
                        </div>
                        <input type="hidden" id="reg-neg-val" value="[]">
                    </div>

                    <div class="button-group stagger-4">
                        <button type="button" class="btn-secondary" id="btn-reg-4-back" onclick="showRegStep(3)">&larr; Terug</button>
                        <button type="button" class="btn-primary" style="background: #10b981; border: none; cursor: pointer;" onclick="finishRegistratie()">Opslaan en Afronden 🎉</button>
                    </div>
                </div>
            </section>
            
            <!-- STAP 5: SUCCES & AFSLUITING (Zonder animatie voor direct zicht) -->
            <section class="wizard-step" id="reg-step-5" style="display: none;">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit; text-align: center; margin-top: 40px;">
                    <div style="font-size: 64px; margin-bottom: 16px;">🏆</div>
                    <h2 style="font-size: 28px; font-weight: 800; color: #1e293b; margin-bottom: 12px;">Goed bezig!</h2>
                    <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 32px; max-width: 400px; margin-left: auto; margin-right: auto;">
                        Je registratie is succesvol opgeslagen. Elk moment dat je vastlegt, helpt je om patronen beter te begrijpen en sterker te staan in je herstel.
                    </p>
                    <div>
                        <button type="button" class="btn-primary" style="background: #2563eb; width: auto; min-width: 200px;" onclick="renderCatalogus()">Terug naar overzicht</button>
                    </div>
                </div>
            </section>

        </div>
    `;

    container.innerHTML = htmlContent;

    const backBtn = document.getElementById('btn-back-cat');
    if (backBtn) backBtn.addEventListener('click', renderCatalogus);

    setupGlobalHandlers();

    // --------------------------------------------------------
    // A. POPULATE DYNAMISCHE CHIPS (STAP 1 EN 2)
    // --------------------------------------------------------
    function populateInitialChips(category, targetId) {
        const currentData = getActiveData();
        let rawData = currentData.registraties[category];
        if (!rawData) return;
        
        let items = [];
        if (rawData.shown && rawData.hidden) {
            items = [...rawData.shown, ...rawData.hidden];
        } else if (Array.isArray(rawData)) {
            items = rawData;
        }

        if (items.length === 0) return;
        
        let html = '';
        let hasHidden = false;

        items.forEach((item, index) => {
            let displayText = item.text || item.val || item;
            const lowerText = String(displayText).toLowerCase();
            const safeVal = (item.val || item.text || item).replace(/'/g, "\\'");
            let iconHtml = item.icon ? `<span>${item.icon}</span>` : '';
            
            if (lowerText.includes('vrienden') || lowerText.includes('blowmaatjes')) { displayText = '🤝 Vrienden'; iconHtml = ''; }
            if (displayText === "Ik moet m'n geld terug") { displayText = "Ik moet m'n geld terugverdienen"; iconHtml = ''; }
            
            const isExtra = index >= 4;
            const extraClass = isExtra ? ` extra-chip-${targetId}` : '';
            const extraStyle = isExtra ? 'display: none;' : 'display: inline-flex;';
            if (isExtra) hasHidden = true;

            if (lowerText === 'dealer / onbekenden') {
                html += `<button type="button" class="reg-chip${extraClass}" style="${extraStyle}" data-val="Dealer" onclick="selectChip('${targetId}', 'Dealer', this)">Dealer</button> `;
                html += `<button type="button" class="reg-chip${extraClass}" style="${extraStyle}" data-val="Onbekenden" onclick="selectChip('${targetId}', 'Onbekenden', this)">Onbekenden</button> `;
                return;
            }

            html += `<button type="button" class="reg-chip${extraClass}" style="${extraStyle}" data-val="${safeVal}" onclick="selectChip('${targetId}', '${safeVal}', this)">${iconHtml}<span>${displayText}</span></button> `;
        });
        
        const targetContainer = document.getElementById(`container-${targetId}`);
        if (targetContainer) {
            targetContainer.innerHTML = html;
        }
        
        const btnMore = document.getElementById(`btn-more-${targetId}`);
        if (btnMore) {
            if (!hasHidden) {
                btnMore.style.display = 'none';
            } else {
                btnMore.style.display = 'inline-block';
                btnMore.dataset.expanded = 'false';
                btnMore.textContent = '+ Meer voorbeelden';
            }
        }
    }

    populateInitialChips('locatie', 'locatie');
    populateInitialChips('situatie', 'situatie');
    populateInitialChips('gezelschap', 'gezelschap');
    populateInitialChips('gedachten', 'gedachten');
    populateInitialChips('gevoelens', 'gevoelens');
    
    // --------------------------------------------------------
    // B. POPULATE STATISCHE CHIPS (STAP 3 EN 4)
    // --------------------------------------------------------
    window._populateStaticChips = function(suggesties, targetId) {
        let html = '';
        let hasHidden = false;

        suggesties.forEach((sug, index) => {
            const text = typeof sug === 'object' ? sug.text : sug;
            const icon = (typeof sug === 'object' && sug.icon) ? sug.icon : getUniqueEmoji(text);
            const safeVal = text.replace(/'/g, "\\'");

            const isExtra = index >= 4;
            const extraClass = isExtra ? ` extra-chip-${targetId}` : '';
            const extraStyle = isExtra ? 'display: none;' : 'display: inline-flex;';
            if (isExtra) hasHidden = true;

            html += `<button type="button" class="reg-chip${extraClass}" style="${extraStyle}" data-val="${safeVal}" onclick="selectChip('${targetId}', '${safeVal}', this)"><span>${icon}</span><span>${text}</span></button> `;
        });
        
        const targetContainer = document.getElementById(`container-${targetId}`);
        if (targetContainer) {
            targetContainer.innerHTML = html;
        }
        
        const btnMore = document.getElementById(`btn-more-${targetId}`);
        if (btnMore) {
            if (!hasHidden) {
                btnMore.style.display = 'none';
            } else {
                btnMore.style.display = 'inline-block';
                btnMore.dataset.expanded = 'false';
                btnMore.textContent = '+ Meer voorbeelden';
            }
        }
    };
    
    window._populateStaticChips(alternatiefSuggesties, 'alternatief');

    if (editData) {
        setTimeout(prefillFormulier, 100);
    }
}

window.renderCatalogus = renderCatalogus;
window.renderFormulier = renderFormulier;

function prefillFormulier() {
    if (regData.plaats) window.restoreChips('locatie', [regData.plaats]);
    if (regData.situatieContext && regData.situatieContext.length > 0) window.restoreChips('situatie', regData.situatieContext);
    if (regData.personen && regData.personen.length > 0) window.restoreChips('gezelschap', regData.personen);
    if (regData.gedachten && regData.gedachten.length > 0) window.restoreChips('gedachten', regData.gedachten);
    if (regData.gevoelens && regData.gevoelens.length > 0) window.restoreChips('gevoelens', regData.gevoelens);

    if (regData.actieType) {
        window.setActieType(regData.actieType);
        if (regData.actieType === 'alternatief') {
            if (regData.alternatiefTekst && regData.alternatiefTekst.length > 0) {
                window.restoreChips('alternatief', regData.alternatiefTekst);
            }
            if (regData.extraMiddelen) {
                regData.extraMiddelen.forEach(item => {
                    window.addExtraSubstance('alt-extra-items-container');
                    const id = window._extraItemCount;
                    setTimeout(() => {
                        const typeSelect = document.querySelector(`#extra-sub-${id} .extra-sub-type`);
                        if (typeSelect) {
                            typeSelect.value = 'Ander middel (zelf invullen)';
                            window.renderExtraSubFields(id, 'Ander middel (zelf invullen)');
                            setTimeout(() => {
                                const customName = document.querySelector(`#extra-sub-${id} .extra-sub-custom-name`);
                                const aantalInp = document.querySelector(`#extra-sub-${id} .extra-sub-aantal`);
                                if (customName) customName.value = item.soort || '';
                                let qty = item.weergaveAantal !== undefined ? item.weergaveAantal : item.aantal;
                                if (aantalInp) aantalInp.value = qty || '';
                            }, 10);
                        }
                    }, 10);
                });
            }
        } else if (regData.actieType === 'drinken') {
            const addictionKey = getActiveAddictionKey();
            if (addictionKey === 'cannabis' && regData.gebruikDetails) {
                const wEl = document.getElementById('reg-can-wat');
                const eEl = document.getElementById('reg-can-eenheid');
                if(wEl) wEl.value = regData.gebruikDetails.soort;
                if(eEl) eEl.value = regData.gebruikDetails.eenheid;
                const aEl = document.getElementById('reg-can-aantal');
                if (aEl) aEl.value = regData.gebruikDetails.aantal || 1;
            } else if (addictionKey === 'cocaine' && regData.gebruikDetails) {
                const wEl = document.getElementById('reg-coc-wat');
                if(wEl) wEl.value = regData.gebruikDetails.soort;
                const aEl = document.getElementById('reg-coc-aantal');
                if (aEl) aEl.value = regData.gebruikDetails.aantal || 1;
            } else if (addictionKey === 'gokken' && regData.gebruikDetails) {
                const aEl = document.getElementById('reg-gok-aantal');
                if (aEl) aEl.value = regData.gebruikDetails.aantal || 50;
            } else if (addictionKey === 'alcohol' && regData.gebruikDetails) {
                 const typeMap = {'Bier': 'bier', 'Wijn': 'wijn', 'Sterke drank': 'sterke drank', 'Mixdrank': 'mixdrank', 'Cocktail': 'cocktail'};
                 const t = typeMap[regData.gebruikDetails.soort];
                 if (t) {
                     const tEl = document.getElementById('reg-drank-type');
                     if(tEl) tEl.value = t;
                     window.updateAlcoholDropdowns('type');
                     setTimeout(() => {
                         const vSelect = document.getElementById('reg-drank-verpakking');
                         if(vSelect) {
                             for(let i=0; i<vSelect.options.length; i++) {
                                 if(vSelect.options[i].text.includes(regData.gebruikDetails.eenheid)) {
                                     vSelect.selectedIndex = i; break;
                                 }
                             }
                         }
                         window.updateAlcoholDropdowns('verpakking');
                         setTimeout(() => {
                             const mSelect = document.getElementById('reg-drank-maat');
                             if(mSelect && regData.gebruikDetails.maat) mSelect.value = regData.gebruikDetails.maat;
                             const aInp = document.getElementById('reg-drank-aantal');
                             if(aInp) aInp.value = regData.gebruikDetails.aantal || 1;
                             window.calcStandaardGlazen();
                         }, 50);
                     }, 50);
                 }
            }

            if (regData.extraMiddelen) {
                regData.extraMiddelen.forEach(item => {
                    window.addExtraSubstance('extra-items-container');
                    const id = window._extraItemCount;
                    setTimeout(() => {
                        const typeSelect = document.querySelector(`#extra-sub-${id} .extra-sub-type`);
                        if (typeSelect) {
                            typeSelect.value = 'Ander middel (zelf invullen)';
                            window.renderExtraSubFields(id, 'Ander middel (zelf invullen)');
                            setTimeout(() => {
                                const customName = document.querySelector(`#extra-sub-${id} .extra-sub-custom-name`);
                                const aantalInp = document.querySelector(`#extra-sub-${id} .extra-sub-aantal`);
                                if (customName) customName.value = item.soort || '';
                                let qty = item.weergaveAantal !== undefined ? item.weergaveAantal : item.aantal;
                                if (aantalInp) aantalInp.value = qty || '';
                            }, 10);
                        }
                    }, 10);
                });
            }
        }
    }
}

// Hier zit de unieke emoji bibliotheek voor elk mogelijk effect
function getUniqueEmoji(sug) {
    const text = sug.toLowerCase();
    
    // Positief
    if (text.includes('trots op mezelf')) return '🌟';
    if (text.includes('controle behouden')) return '🛡️';
    if (text.includes('geld bespaard') || text.includes('geld gewonnen')) return '💰';
    if (text.includes('geen kater') || text.includes('helder wakker') || text.includes('gezond bezig')) return '☀️';
    if (text.includes('geen spijt')) return '😌';
    if (text.includes('trek ging voorbij') || text.includes('geen trek meer')) return '✨';
    if (text.includes('beter geslapen') || text.includes('in slaap vallen') || text.includes('makkelijker slapen')) return '💤';
    if (text.includes('rust') || text.includes('ontspanning')) return '🧘';
    if (text.includes('fijn gevoel')) return '✨';
    if (text.includes('gezelligheid')) return '🥂';
    if (text.includes('smaak')) return '👅';
    if (text.includes('praten')) return '🗣️';
    if (text.includes('kick') || text.includes('rush')) return '🚀';
    if (text.includes('energieboost') || text.includes('meer energie')) return '🔋';
    if (text.includes('zelfverzekerd')) return '😎';
    if (text.includes('focus')) return '🎯';
    if (text.includes('spanning') || text.includes('sensatie')) return '🎢';
    if (text.includes('afleiding') || text.includes('ontsnapping')) return '🏃';
    
    // Negatief
    if (text.includes('kater')) return '🤕';
    if (text.includes('spijt') || text.includes('teleurgesteld')) return '😞';
    if (text.includes('duur') || text.includes('geld kwijt') || text.includes('geld verloren')) return '💸';
    if (text.includes('slecht geslapen') || text.includes('niet kunnen slapen')) return '🌙';
    if (text.includes('geheugenverlies')) return '🌫️';
    if (text.includes('ruzie') || text.includes('gedoe') || text.includes('prikkelbaar') || text.includes('geïrriteerd') || text.includes('kort lontje') || text.includes('frustratie')) return '⚡';
    if (text.includes('aanhoudende trek') || text.includes('onrust') || text.includes('stress')) return '〰️';
    if (text.includes('suf') || text.includes('loom') || text.includes('energielevel laag') || text.includes('moe')) return '🪫';
    if (text.includes('passief')) return '🛋️';
    if (text.includes('paranoia') || text.includes('achterdochtig')) return '👀';
    if (text.includes('vreetkick')) return '🍔';
    if (text.includes('crash') || text.includes('leeg gevoel')) return '🕳️';
    if (text.includes('hartkloppingen')) return '🫀';
    if (text.includes('schuldgevoel')) return '😔';
    if (text.includes('stiekem') || text.includes('liegen')) return '🤫';
    if (text.includes('somber')) return '🌧️';
    if (text.includes('ontspannen')) return '🪢';
    if (text.includes('buitenbeentje')) return '🧍';
    if (text.includes('gezelligheid gemist') || text.includes('gevoel van gemis')) return '🥺';
    if (text.includes('verveling')) return '🥱';
    if (text.includes('minder zelfverzekerd')) return '🐢';
    if (text.includes('feestje minder leuk')) return '🎈';
    if (text.includes('fomo')) return '📱';
    if (text.includes('terugwinnen')) return '🎰';
    
    return '📌'; // Fallback
}

function populateStep4Effects() {
    const addictionKey = getActiveAddictionKey();
    const isWelGebruikt = regData.actieType === 'drinken';
    const voltooid = getVoltooidDeelwoord(addictionKey);

    let posSuggesties = [];
    let negSuggesties = [];

    const seWrapper = document.getElementById('self-efficacy-wrapper');
    const seQuestion = document.getElementById('self-efficacy-question');

    // Nudging blokranden
    const posBlock = document.getElementById('pos-effect-block');
    const negBlock = document.getElementById('neg-effect-block');

    if (isWelGebruikt) {
        if (seWrapper) seWrapper.style.display = 'none';
        
        if (posBlock) { posBlock.className = 'info-block info-block-border-orange stagger-2'; }
        if (negBlock) { negBlock.className = 'info-block info-block-border-red stagger-3'; }

        if (addictionKey === 'alcohol') {
            posSuggesties = ["Rust / Ontspanning", "Fijn gevoel", "Gezelligheid", "Lekkere smaak", "Makkelijker praten", "In slaap vallen", "Geen trek meer"];
            negSuggesties = ["Kater", "Spijt", "Duur / Geld kwijt", "Slecht geslapen", "Geheugenverlies", "Ruzie / Gedoe", "Teleurgesteld in mezelf", "Onrustige dag erna"];
        } else if (addictionKey === 'cannabis') {
            posSuggesties = ["Ontspannen / Rust", "Fijn gevoel", "Gezelligheid", "Lekkere smaak", "Makkelijker slapen", "Geen trek meer"];
            negSuggesties = ["Suf / Loom", "Spijt", "Duur", "Passief geworden", "Paranoia / Onrust", "Vreetkick", "Teleurgesteld in mezelf"];
        } else if (addictionKey === 'cocaine' || addictionKey === 'cocaïne') {
            posSuggesties = ["Kick / Rush", "Energieboost", "Zelfverzekerd", "Scherpe focus", "Gezelligheid", "Geen trek meer"];
            negSuggesties = ["Crash / Leeg gevoel", "Spijt", "Duur", "Niet kunnen slapen", "Hartkloppingen", "Paranoïde / Achterdochtig", "Kort lontje", "Teleurgesteld in mezelf"];
        } else if (addictionKey === 'gokken') {
            posSuggesties = ["Een kick", "Spanning / Sensatie", "Fijn gevoel", "Geld gewonnen", "Afleiding / Ontsnapping", "Geen trek meer"];
            negSuggesties = ["Geld verloren", "Spijt", "Schuldgevoel", "Onrust / Stress", "Stiekem gedoe / Liegen", "Teleurgesteld in mezelf", "Slecht geslapen"];
        } else {
            posSuggesties = ["Rust", "Fijn gevoel", "Gezelligheid", "Meer energie", "Geen trek meer"];
            negSuggesties = ["Spijt", "Kater", "Duur", "Onrustig", "Somber", "Teleurgesteld", "Slecht geslapen", "Ruzie"];
        }
    } else {
        const alts = JSON.parse(document.getElementById('reg-alternatief-val')?.value || '[]');
        if (seWrapper && seQuestion) {
            if (alts.length > 0) {
                const altTekstWeergave = alts.slice(0, 2).map(a => a.toLowerCase()).join(' of ');
                
                let successMessage = `niet ${voltooid}`;
                let goalAction = `niet te ${voltooid === 'gedronken' ? 'drinken' : (voltooid === 'geblowd' ? 'blowen' : (voltooid === 'gegokt' ? 'gokken' : 'gebruiken'))}`;

                if (addictionKey === 'cocaine' || addictionKey === 'cocaïne') {
                    successMessage = "geen cocaïne gebruikt";
                    goalAction = "geen cocaïne te gebruiken";
                }

                seQuestion.innerHTML = `🌟 <strong>Goed dat je ${successMessage} hebt!</strong><br>Zou ${altTekstWeergave} je een volgende keer opnieuw kunnen helpen om ${goalAction}?`;
                seWrapper.style.display = 'block';
            } else {
                seWrapper.style.display = 'none';
            }
        }
        
        if (posBlock) { posBlock.className = 'info-block info-block-border-green stagger-2'; }
        if (negBlock) { negBlock.className = 'info-block info-block-border-orange stagger-3'; }

        posSuggesties = ["Trots op mezelf", "Controle behouden", "Geld bespaard", "Geen kater / Helder wakker", "Geen spijt", "Trek ging voorbij", "Gezond bezig", "Beter geslapen"];
        
        if (addictionKey === 'alcohol') {
            negSuggesties = ["Aanhoudende trek / Onrust", "Gemis van de smaak", "Moeilijk kunnen ontspannen", "Moeilijk in slaap vallen", "Buitenbeentje voelen", "Gezelligheid gemist", "Prikkelbaar / Geïrriteerd", "Verveling"];
        } else if (addictionKey === 'cannabis') {
            negSuggesties = ["Aanhoudende trek / Onrust", "Moeilijk in slaap vallen", "Moeilijk kunnen ontspannen", "Prikkelbaar / Geïrriteerd", "Gevoel van gemis", "Verveling"];
        } else if (addictionKey === 'cocaine' || addictionKey === 'cocaïne') {
            negSuggesties = ["Aanhoudende trek / Onrust", "Energielevel laag / Moe", "Minder zelfverzekerd voelen", "Feestje minder leuk gevonden", "Prikkelbaar", "FOMO (bang iets te missen)"];
        } else if (addictionKey === 'gokken') {
            negSuggesties = ["Aanhoudende onrust / Drang", "Gedachten aan geld terugwinnen", "Verveling", "Frustratie / Prikkelbaar", "Leeg gevoel"];
        } else {
            negSuggesties = ["Aanhoudende trek / Onrust", "Moeilijk kunnen ontspannen", "Prikkelbaar / Geïrriteerd", "Verveling"];
        }
    }

    if (window._populateStaticChips) {
        window._populateStaticChips(posSuggesties, 'pos');
        window._populateStaticChips(negSuggesties, 'neg');
    }
}

window.addExtraAlcohol = function() {
    window._extraItemCount++;
    const id = window._extraItemCount;
    const html = `
        <div class="extra-item-block" id="extra-alc-${id}" style="background: #f8fafc; padding: 16px; border-radius: 16px; border: 1px solid #e2e8f0; margin-top: 12px; position: relative;">
            <button type="button" onclick="document.getElementById('extra-alc-${id}').remove(); calcStandaardGlazen();" style="position: absolute; top: 12px; right: 16px; background: none; border: none; color: #ef4444; font-weight: bold; cursor: pointer; font-size: 16px;">✕</button>
            <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 12px;">
                <label style="font-size: 14px; font-weight: 600; color: #64748b;">Soort drank (extra)</label>
                <select id="reg-drank-type-${id}" class="form-input extra-alc-type" style="border-radius: 12px; padding: 10px;" onchange="updateAlcoholDropdowns('type', '${id}')">
                    <option value="" selected disabled>-- Kies soort --</option>
                    <option value="bier">Bier</option>
                    <option value="wijn">Wijn</option>
                    <option value="sterke drank">Sterke drank</option>
                    <option value="mixdrank">Mixdrank</option>
                    <option value="cocktail">Cocktail</option>
                </select>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
                <div>
                    <label style="font-size: 14px; font-weight: 600; color: #64748b;">Verpakking / Type</label>
                    <select id="reg-drank-verpakking-${id}" class="form-input extra-alc-verpakking" style="border-radius: 12px; padding: 10px;" onchange="updateAlcoholDropdowns('verpakking', '${id}')">
                        <option value="" selected disabled>-- Kies eerst soort --</option>
                    </select>
                </div>
                <div>
                    <label style="font-size: 14px; font-weight: 600; color: #64748b;">Aantal eenheden</label>
                    <input type="number" id="reg-drank-aantal-${id}" class="form-input extra-alc-aantal" style="border-radius: 12px; padding: 10px;" min="1" value="1" placeholder="Aantal" oninput="calcStandaardGlazen()">
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div>
                    <label style="font-size: 14px; font-weight: 600; color: #64748b;">Maat</label>
                    <select id="reg-drank-maat-${id}" class="form-input extra-alc-maat" style="border-radius: 12px; padding: 10px;" onchange="calcStandaardGlazen()">
                        <option value="" selected disabled>-- Kies maat --</option>
                    </select>
                </div>
                <div>
                    <label style="font-size: 14px; font-weight: 600; color: #64748b;">Alcohol %</label>
                    <select id="reg-drank-percentage-${id}" class="form-input extra-alc-perc" style="border-radius: 12px; padding: 10px;" onchange="calcStandaardGlazen()">
                        <option value="" selected disabled>-- Kies percentage --</option>
                    </select>
                </div>
            </div>
        </div>
    `;
    document.getElementById('extra-items-container').insertAdjacentHTML('beforeend', html);
};

window.addExtraSubstance = function(containerId) {
    const activeKey = getActiveAddictionKey();
    window._extraItemCount++;
    const id = window._extraItemCount;
    
    const options = [
        { val: 'alcohol', label: 'Alcohol' },
        { val: 'cannabis', label: 'Cannabis' },
        { val: 'cocaine', label: 'Cocaïne' },
        { val: 'xtc', label: 'XTC / MDMA' },
        { val: 'ghb', label: 'GHB' },
        { val: 'ketamine', label: 'Ketamine' },
        { val: 'paddos', label: "Paddo's / truffels" },
        { val: 'mmc', label: '2 / 3 / 4-MMC' },
        { val: 'benzos', label: "Benzo's (Valium, Xanax, etc.)" },
        { val: 'opiaten', label: 'Opiaten (morfines)' },
        { val: 'gokken', label: 'Gokken' },
        { val: 'nicotine', label: 'Nicotine' },
        { val: 'anders', label: 'Ander middel (zelf invullen)' }
    ].filter(opt => opt.val !== activeKey); 

    const optionsHtml = options.map(o => `<option value="${o.label}">${o.label}</option>`).join('');

    const html = `
        <div class="extra-substance-block" id="extra-sub-${id}" style="background: #f8fafc; padding: 16px; border-radius: 12px; margin-top: 8px; position: relative; border: 1px solid #e2e8f0;">
            <button type="button" onclick="document.getElementById('extra-sub-${id}').remove();" style="position: absolute; top: 12px; right: 16px; background: none; border: none; color: #ef4444; font-weight: bold; cursor: pointer; font-size: 16px;">✕</button>
            <label style="font-size: 15px; font-weight: 700; color: #1e293b; display: block; margin-bottom: 8px;">Ander middel</label>
            <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 8px;">
                <select class="form-input extra-sub-type" style="border-radius: 8px; padding: 8px;" onchange="renderExtraSubFields('${id}', this.value)">
                    <option value="" selected disabled>-- Kies middel --</option>
                    ${optionsHtml}
                </select>
            </div>
            <div id="extra-sub-fields-${id}">
                <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                    <input type="text" class="form-input extra-sub-aantal" style="border-radius: 8px; padding: 8px;" placeholder="Hoeveelheid (bijv. 1 pil, 0.5 gram)">
                </div>
            </div>
        </div>
    `;
    
    const targetId = (typeof containerId === 'string') ? containerId : 'extra-items-container';
    document.getElementById(targetId).insertAdjacentHTML('beforeend', html);
};

window.renderExtraSubFields = function(id, type) {
    const container = document.getElementById(`extra-sub-fields-${id}`);
    if (!container) return;
    
    if (type === 'Cannabis') {
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                <select class="form-input extra-sub-can-wat" style="border-radius: 8px; padding: 8px;">
                    <option value="Wiet">Wiet</option>
                    <option value="Hasj">Hasj</option>
                </select>
                <select class="form-input extra-sub-can-eenheid" style="border-radius: 8px; padding: 8px;">
                    <option value="Joints">Joints</option>
                    <option value="Gram">Gram</option>
                </select>
            </div>
            <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                <input type="number" class="form-input extra-sub-can-aantal" style="border-radius: 8px; padding: 8px;" min="0.1" step="0.5" value="1" placeholder="Aantal">
            </div>
        `;
    } else if (type === 'Cocaïne') {
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                <select class="form-input extra-sub-coc-wat" style="border-radius: 8px; padding: 8px;">
                    <option value="Snuifcocaïne">Snuifcocaïne</option>
                    <option value="Crack / Basecoke">Crack / Basecoke</option>
                </select>
            </div>
            <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                <input type="number" class="form-input extra-sub-coc-aantal" style="border-radius: 8px; padding: 8px;" min="0.1" step="0.1" value="1.0" placeholder="Aantal in gram">
            </div>
        `;
    } else if (type === 'Gokken') {
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                <input type="number" class="form-input extra-sub-gok-aantal" style="border-radius: 8px; padding: 8px;" min="0" step="10" value="50" placeholder="Ingezet bedrag (€)">
            </div>
        `;
    } else if (type === 'Nicotine') {
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                <select class="form-input extra-sub-nic-wat" style="border-radius: 8px; padding: 8px;">
                    <option value="Sigaret(ten)">Sigaretten</option>
                    <option value="Sigaar/sigaren">Sigaren</option>
                    <option value="Sjekkie(s)">Sjekkies</option>
                </select>
                <input type="number" class="form-input extra-sub-nic-aantal" style="border-radius: 8px; padding: 8px;" min="1" step="1" value="1" placeholder="Aantal">
            </div>
        `;
    } else if (type === 'Ander middel (zelf invullen)') {
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 8px;">
                <input type="text" class="form-input extra-sub-custom-name" style="border-radius: 8px; padding: 8px;" placeholder="Naam van het middel">
            </div>
            <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                <input type="text" class="form-input extra-sub-aantal" style="border-radius: 8px; padding: 8px;" placeholder="Hoeveelheid (bijv. 1 pil, 0.5 gram)">
            </div>
        `;
    } else {
        container.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                <input type="text" class="form-input extra-sub-aantal" style="border-radius: 8px; padding: 8px;" placeholder="Hoeveelheid (bijv. 1 pil, 0.5 gram)">
            </div>
        `;
    }
};

window.showRegStep = function(stepId) {
    window.scrollTo(0, 0);

    document.querySelectorAll('.wizard-step').forEach(s => s.style.display = 'none');
    const target = document.getElementById(`reg-step-${stepId}`);
    if (target) target.style.display = 'block';

    const progressBarContainer = document.querySelector('.progress-bar-container');
    const bar = document.getElementById('reg-progress-bar');
    const regHeader = document.getElementById('reg-header-nav');
    
    if (stepId === '5' || stepId === 'intro') {
        if (progressBarContainer) progressBarContainer.style.display = 'none';
        
        if (regHeader && stepId === '5') {
            regHeader.style.display = 'none';
        } else if (regHeader && stepId === 'intro') {
            regHeader.style.display = 'flex';
        }
    } else {
        if (progressBarContainer) progressBarContainer.style.display = 'block';
        if (regHeader) regHeader.style.display = 'flex';
        
        if (bar) {
            if (stepId == 1) bar.style.width = '25%';
            else if (stepId == 2) bar.style.width = '50%';
            else if (stepId == 3) bar.style.width = '75%';
            else if (stepId == 4) bar.style.width = '100%';
        }
    }

    if (stepId == 4) {
        populateStep4Effects();
        if (regData.id) {
            if (regData.positieveEffecten && regData.positieveEffecten.length > 0) window.restoreChips('pos', regData.positieveEffecten);
            if (regData.negatieveEffecten && regData.negatieveEffecten.length > 0) window.restoreChips('neg', regData.negatieveEffecten);
            if (regData.selfEfficacyScore !== null) {
                const slider = document.getElementById('reg-se-slider');
                if (slider) {
                    slider.value = regData.selfEfficacyScore;
                    document.getElementById('se-val-display').innerText = slider.value + '%';
                }
            }
        }
    }
};

window.updateAlcoholDropdowns = function(source, idSuffix = '') {
    const suffix = idSuffix ? `-${idSuffix}` : '';
    const type = document.getElementById(`reg-drank-type${suffix}`).value;
    const verpakkingSelect = document.getElementById(`reg-drank-verpakking${suffix}`);
    const maatSelect = document.getElementById(`reg-drank-maat${suffix}`);
    const percSelect = document.getElementById(`reg-drank-percentage${suffix}`);

    if (source === 'type') {
        if (type === 'bier') verpakkingSelect.innerHTML = `<option value="glas">Glas</option><option value="blik">Blik</option><option value="fles" selected>Fles</option>`;
        else if (type === 'wijn') verpakkingSelect.innerHTML = `<option value="glas" selected>Glas</option><option value="fles">Fles</option>`;
        else if (type === 'sterke drank') verpakkingSelect.innerHTML = `<option value="glas" selected>Glas (Shot)</option><option value="fles">Fles</option>`;
        else if (type === 'mixdrank') verpakkingSelect.innerHTML = `<option value="fles" selected>Flesje</option><option value="blik">Blik</option>`;
        else if (type === 'cocktail') verpakkingSelect.innerHTML = `<option value="short">Short drink (bijv. Martini)</option><option value="medium" selected>Medium drink (bijv. Margarita)</option><option value="long">Long drink (bijv. Mojito)</option>`;
        
        updateAlcoholDropdowns('verpakking', idSuffix);
        return;
    }

    const verpakking = verpakkingSelect.value;
    
    if (type === 'bier') {
        maatSelect.innerHTML = `<option value="250">250 ml</option><option value="300" selected>300 ml</option><option value="500">500 ml</option>`;
        percSelect.innerHTML = `<option value="5" selected>5% (Pils)</option><option value="7">6-8% (Speciaal)</option><option value="11">10-12% (Zwaar)</option>`;
    } 
    else if (type === 'wijn') {
        if (verpakking === 'glas') maatSelect.innerHTML = `<option value="100">100 ml</option><option value="150" selected>150 ml</option><option value="200">200 ml</option>`;
        else maatSelect.innerHTML = `<option value="750" selected>750 ml</option><option value="1000">1000 ml (1L)</option>`;
        percSelect.innerHTML = `<option value="10" selected>10% (Wijn)</option><option value="20">20% (Port/Sherry)</option>`;
    }
    else if (type === 'sterke drank') {
        if (verpakking === 'glas') maatSelect.innerHTML = `<option value="35" selected>35 ml (Shot)</option>`;
        else maatSelect.innerHTML = `<option value="700" selected>700 ml</option><option value="1000">1000 ml (1L)</option>`;
        percSelect.innerHTML = `<option value="35">35%</option><option value="40" selected>40%</option>`;
    }
    else if (type === 'mixdrank') {
        if (verpakking === 'fles') maatSelect.innerHTML = `<option value="275" selected>275 ml</option>`;
        else maatSelect.innerHTML = `<option value="250" selected>250 ml</option><option value="330">330 ml</option>`;
        percSelect.innerHTML = `<option value="5" selected>5%</option><option value="5.6">5,6%</option>`;
    }
    else if (type === 'cocktail') {
        if (verpakking === 'short') { maatSelect.innerHTML = `<option value="50" selected>50 ml</option>`; percSelect.innerHTML = `<option value="25" selected>20-30%</option>`; }
        else if (verpakking === 'medium') { maatSelect.innerHTML = `<option value="150" selected>150 ml</option>`; percSelect.innerHTML = `<option value="15" selected>10-20%</option>`; }
        else if (verpakking === 'long') { maatSelect.innerHTML = `<option value="40" selected>40 ml sterke drank</option>`; percSelect.innerHTML = `<option value="40" selected>40% (in de mix)</option>`; }
    }

    window.calcStandaardGlazen();
};

window.calcStandaardGlazen = function() {
    const addictionKey = getActiveAddictionKey();
    let totalGlazen = 0;

    if (addictionKey === 'alcohol') {
        const typeEl = document.getElementById('reg-drank-type');
        if (typeEl && typeEl.value) {
            const maat = parseFloat(document.getElementById('reg-drank-maat').value) || 0;
            const perc = parseFloat(document.getElementById('reg-drank-percentage').value) || 0;
            const aantal = parseInt(document.getElementById('reg-drank-aantal').value) || 0;
            totalGlazen += (maat * perc) / 1000 * aantal; 
        }
    }

    document.querySelectorAll('.extra-item-block select.extra-alc-type').forEach(select => {
        const idMatch = select.id.match(/-(\d+)$/);
        if (!idMatch) return;
        const id = idMatch[1];
        const type = select.value;
        if (type && type !== '-- Soort drank --' && type !== '-- Kies soort --') {
            const maat = parseFloat(document.getElementById(`reg-drank-maat-${id}`).value) || 0;
            const perc = parseFloat(document.getElementById(`reg-drank-percentage-${id}`).value) || 0;
            const parseIntVal = parseInt(document.getElementById(`reg-drank-aantal-${id}`).value) || 0;
            totalGlazen += (maat * perc) / 1000 * parseIntVal; 
        }
    });

    const display = document.getElementById('calc-result');
    if (display) {
        display.innerHTML = totalGlazen > 0 ? `Totaal berekend: ca. ${totalGlazen.toFixed(1)} standaardglazen` : '';
    }
    window.checkStep3Completion();
};

window.checkStep3Completion = function() {
    const addictionKey = getActiveAddictionKey();
    const btnNext = document.getElementById('btn-reg-3-next');
    if (!btnNext) return;

    if (regData.actieType === 'drinken') {
        if (addictionKey === 'alcohol') {
            const el = document.getElementById('reg-drank-type');
            btnNext.disabled = el ? !el.value : true;
        } else if (addictionKey === 'cannabis') {
            const el = document.getElementById('reg-can-aantal');
            btnNext.disabled = el ? !el.value : true;
        } else if (addictionKey === 'cocaine') {
            const el = document.getElementById('reg-coc-aantal');
            btnNext.disabled = el ? !el.value : true;
        } else if (addictionKey === 'gokken') {
            const el = document.getElementById('reg-gok-aantal');
            btnNext.disabled = el ? !el.value : true;
        }
    } else if (regData.actieType === 'alternatief') {
        const valEl = document.getElementById('reg-alternatief-val');
        const alts = JSON.parse(valEl ? valEl.value || '[]' : '[]');
        btnNext.disabled = alts.length === 0;
    } else {
        btnNext.disabled = true;
    }
};

window.setActieType = function(type) {
    regData.actieType = type;
    const cardDrinken = document.getElementById('card-actie-drinken');
    const cardAlternatief = document.getElementById('card-actie-alternatief');

    cardDrinken.className = 'choice-card' + (type === 'drinken' ? ' selected-red' : '');
    cardAlternatief.className = 'choice-card' + (type === 'alternatief' ? ' selected-green' : '');

    if (type === 'drinken') {
        document.getElementById('subform-drinken').style.display = 'block';
        document.getElementById('subform-alternatief').style.display = 'none';
    } else {
        document.getElementById('subform-alternatief').style.display = 'block';
        document.getElementById('subform-drinken').style.display = 'none';
    }
    checkStep3Completion();
};

window.checkStep1Completion = function() {
    const tijd = (document.getElementById('reg-tijd').value || '').trim();
    const plaats = (document.getElementById('reg-plaats').value || '').trim();
    const situatie = JSON.parse(document.getElementById('reg-situatie-val').value || '[]');
    const personen = JSON.parse(document.getElementById('reg-personen').value || '[]');
    const btnNext = document.getElementById('btn-reg-1-next');
    if (btnNext) btnNext.disabled = !(tijd && plaats && situatie.length > 0 && personen.length > 0);
};

window.checkStep2Completion = function() {
    const gedachten = JSON.parse(document.getElementById('reg-gedachten-val').value || '[]');
    const gevoelens = JSON.parse(document.getElementById('reg-gevoelens-val').value || '[]');
    const btnNext = document.getElementById('btn-reg-2-next');
    if (btnNext) btnNext.disabled = !(gedachten.length > 0 && gevoelens.length > 0);
};

window.selectChip = function(type, value, btnElement) {
    const isMultiSelect = ['situatie', 'gezelschap', 'gedachten', 'gevoelens', 'alternatief', 'pos', 'neg'].includes(type);
    const hiddenInputId = type === 'situatie' ? 'reg-situatie-val' : type === 'gezelschap' ? 'reg-personen' : (type === 'locatie' ? 'reg-plaats' : `reg-${type}-val`);
    
    let colorClass = 'selected-blue';
    if (type === 'neg') colorClass = (regData.actieType === 'alternatief') ? 'selected-orange' : 'selected-red';
    else if (type === 'pos') colorClass = (regData.actieType === 'alternatief') ? 'selected-green' : 'selected-orange';
    else if (type === 'alternatief') colorClass = 'selected-purple';

    if (isMultiSelect) {
        btnElement.classList.toggle('selected');
        btnElement.classList.toggle(colorClass);

        const container = document.getElementById(`container-${type}`);
        const selectedValues = Array.from(container.querySelectorAll('.reg-chip.selected')).map(el => el.dataset.val);
        document.getElementById(hiddenInputId).value = JSON.stringify(selectedValues);
    } else {
        const isAlreadySelected = btnElement.classList.contains('selected');
        const container = document.getElementById(`container-${type}`);
        
        container.querySelectorAll('.reg-chip').forEach(c => {
            c.classList.remove('selected', 'selected-blue', 'selected-red', 'selected-orange', 'selected-purple', 'selected-green');
        });

        if (!isAlreadySelected) {
            btnElement.classList.add('selected', colorClass);
            document.getElementById(hiddenInputId).value = value;
        } else {
            document.getElementById(hiddenInputId).value = '';
        }
    }
    
    // Zorg ervoor dat geselecteerde items altijd zichtbaar blijven (forceer de weergave)
    btnElement.style.display = 'inline-flex';

    if (['locatie', 'situatie', 'gezelschap'].includes(type)) checkStep1Completion();
    else if (['gedachten', 'gevoelens'].includes(type)) checkStep2Completion();
    else if (type === 'alternatief') checkStep3Completion();
};

window.addCustomChip = function(type) {
    const inputEl = document.getElementById(`reg-${type}-eigen`);
    const val = inputEl.value.trim();
    if (!val) return;

    let colorClass = 'selected-blue';
    if (type === 'neg') colorClass = (regData.actieType === 'alternatief') ? 'selected-orange' : 'selected-red';
    else if (type === 'pos') colorClass = (regData.actieType === 'alternatief') ? 'selected-green' : 'selected-orange';
    else if (type === 'alternatief') colorClass = 'selected-purple';

    const safeVal = val.replace(/'/g, "\\'");

    const container = document.getElementById(`container-${type}`);
    const newChip = document.createElement('button');
    newChip.type = 'button';
    newChip.className = `reg-chip`;
    newChip.dataset.val = val;
    newChip.innerHTML = `<span>${getUniqueEmoji(val)}</span><span>${val}</span>`;
    newChip.onclick = function() { window.selectChip(type, val, this); };
    
    // Altijd direct zichtbaar toevoegen
    container.appendChild(newChip);

    window.selectChip(type, val, newChip);
    inputEl.value = '';
};

// --- EENVOUDIGE EN ROBUUSTE TOGGLE LOGICA ---
window.toggleMore = function(category) {
    const btn = document.getElementById(`btn-more-${category}`);
    if (!btn) return;
    
    const isExpanded = btn.dataset.expanded === 'true';
    const extraChips = document.querySelectorAll(`.extra-chip-${category}`);
    
    if (isExpanded) {
        // Opnieuw verbergen, behalve als ze geselecteerd zijn
        extraChips.forEach(chip => {
            if (!chip.classList.contains('selected')) {
                chip.style.display = 'none';
            }
        });
        btn.textContent = '+ Meer voorbeelden';
        btn.dataset.expanded = 'false';
    } else {
        // Alles uitvouwen
        extraChips.forEach(chip => {
            chip.style.display = 'inline-flex';
        });
        btn.textContent = '- Minder voorbeelden';
        btn.dataset.expanded = 'true';
    }
};

window.finishRegistratie = function() {
    const addictionKey = getActiveAddictionKey();

    regData.middel = addictionKey; 
    regData.tijdstip = document.getElementById('reg-tijd').value;
    regData.plaats = document.getElementById('reg-plaats').value;
    regData.situatieContext = JSON.parse(document.getElementById('reg-situatie-val').value || '[]');
    regData.personen = JSON.parse(document.getElementById('reg-personen').value || '[]');
    regData.gedachten = JSON.parse(document.getElementById('reg-gedachten-val').value || '[]');
    regData.gevoelens = JSON.parse(document.getElementById('reg-gevoelens-val').value || '[]');
    
    regData.positieveEffecten = JSON.parse(document.getElementById('reg-pos-val').value || '[]');
    regData.negatieveEffecten = JSON.parse(document.getElementById('reg-neg-val').value || '[]');

    const seSlider = document.getElementById('reg-se-slider');
    const seWrapper = document.getElementById('self-efficacy-wrapper');
    if (seWrapper && seWrapper.style.display !== 'none' && seSlider) {
        regData.selfEfficacyScore = parseInt(seSlider.value, 10);
    } else {
        regData.selfEfficacyScore = null;
    }

    const verzameldeExtraMiddelen = [];
    
    let masterTotaalStandaardGlazen = 0;
    let masterTotaleHoeveelheid = 0;

    if (regData.actieType === 'drinken') {
        let details = {};
        if (addictionKey === 'alcohol') {
            const typeSelect = document.getElementById('reg-drank-type');
            const type = typeSelect ? typeSelect.options[typeSelect.selectedIndex].text : '';
            const verpakkingSelect = document.getElementById('reg-drank-verpakking');
            let verpakking = verpakkingSelect ? verpakkingSelect.options[verpakkingSelect.selectedIndex]?.text || '' : '';
            if (verpakking.includes('bijv.')) { verpakking = verpakking.split(' (')[0]; }

            const maatVal = document.getElementById('reg-drank-maat').value;
            const maat = parseFloat(maatVal) || 0;
            const perc = parseFloat(document.getElementById('reg-drank-percentage').value) || 0;
            const aantal = parseInt(document.getElementById('reg-drank-aantal').value) || 1;
            
            const glazen = (maat * perc) / 1000 * aantal; 
            masterTotaalStandaardGlazen += glazen;
            
            details = { 
                soort: type, 
                eenheid: verpakking, 
                aantal: aantal, 
                berekend: parseFloat(glazen.toFixed(1)), 
                berekendLabel: 'standaardglazen', 
                maat: maatVal 
            };
        } else if (addictionKey === 'cannabis') {
            const eenheid = document.getElementById('reg-can-eenheid').value;
            const aantalVal = parseFloat(document.getElementById('reg-can-aantal').value) || 0;
            masterTotaleHoeveelheid += aantalVal;
            
            details = { 
                soort: document.getElementById('reg-can-wat').value, 
                eenheid: eenheid, 
                aantal: aantalVal,
                berekend: aantalVal,
                berekendLabel: eenheid.toLowerCase()
            };
        } else if (addictionKey === 'cocaine') {
            const aantalVal = parseFloat(document.getElementById('reg-coc-aantal').value) || 0;
            masterTotaleHoeveelheid += aantalVal;
            
            details = {
                soort: document.getElementById('reg-coc-wat').value,
                eenheid: 'gram',
                aantal: aantalVal,
                berekend: aantalVal,
                berekendLabel: 'gram'
            };
        } else if (addictionKey === 'gokken') {
            const aantalVal = parseFloat(document.getElementById('reg-gok-aantal').value) || 0;
            masterTotaleHoeveelheid += aantalVal;
            
            details = {
                soort: 'Geld ingezet',
                eenheid: 'euro',
                aantal: aantalVal,
                berekend: aantalVal,
                berekendLabel: 'euro'
            };
        }
        regData.gebruikDetails = details;
    } else {
        regData.alternatiefTekst = JSON.parse(document.getElementById('reg-alternatief-val').value || '[]');
    }

    const targetContainerId = regData.actieType === 'drinken' ? 'extra-items-container' : 'alt-extra-items-container';
    const targetContainer = document.getElementById(targetContainerId);

    if (targetContainer) {
        targetContainer.querySelectorAll('.extra-item-block select.extra-alc-type').forEach(select => {
            const idMatch = select.id.match(/-(\d+)$/);
            if (!idMatch) return;
            const id = idMatch[1];
            
            const type = select.options[select.selectedIndex]?.text;
            const verpakkingSelect = document.getElementById(`reg-drank-verpakking-${id}`);
            let verpakking = verpakkingSelect ? verpakkingSelect.options[verpakkingSelect.selectedIndex]?.text || '' : '';
            if (verpakking.includes('bijv.')) { verpakking = verpakking.split(' (')[0]; }
            
            const aantal = parseInt(document.getElementById(`reg-drank-aantal-${id}`).value) || 1;
            const maatVal = document.getElementById(`reg-drank-maat-${id}`).value;
            const maat = parseFloat(maatVal) || 0;
            const perc = parseFloat(document.getElementById(`reg-drank-percentage-${id}`).value) || 0;
            
            const glazen = (maat * perc) / 1000 * aantal; 

            if (type && type !== '-- Soort drank --' && type !== '-- Kies soort --') {
                masterTotaalStandaardGlazen += glazen;
                verzameldeExtraMiddelen.push({
                    type: 'alcohol',
                    soort: type,
                    eenheid: verpakking,
                    weergaveAantal: aantal,
                    berekend: parseFloat(glazen.toFixed(1)),
                    berekendLabel: 'standaardglazen',
                    maat: maatVal
                });
            }
        });

        targetContainer.querySelectorAll('.extra-substance-block').forEach(block => {
            const typeSelect = block.querySelector('.extra-sub-type');
            let type = typeSelect ? typeSelect.value : '';
            let soort = type;
            let aantal = '';
            let eenheid = '';

            if (type === 'Cannabis') {
                soort = block.querySelector('.extra-sub-can-wat')?.value || '';
                eenheid = block.querySelector('.extra-sub-can-eenheid')?.value || '';
                aantal = block.querySelector('.extra-sub-can-aantal')?.value || '';
            } else if (type === 'Cocaïne') {
                soort = block.querySelector('.extra-sub-coc-wat')?.value || '';
                eenheid = 'gram';
                aantal = block.querySelector('.extra-sub-coc-aantal')?.value || '';
            } else if (type === 'Gokken') {
                soort = 'Geld ingezet';
                eenheid = 'euro';
                aantal = block.querySelector('.extra-sub-gok-aantal')?.value || '';
            } else if (type === 'Nicotine') {
                soort = block.querySelector('.extra-sub-nic-wat')?.value || '';
                eenheid = 'x'; 
                aantal = block.querySelector('.extra-sub-nic-aantal')?.value || '';
            } else if (type === 'Ander middel (zelf invullen)') {
                soort = block.querySelector('.extra-sub-custom-name')?.value || '';
                aantal = block.querySelector('.extra-sub-aantal')?.value || '';
            } else if (type && type !== '-- Kies middel --') {
                aantal = block.querySelector('.extra-sub-aantal')?.value || '';
            }

            if (soort && soort !== '-- Kies middel --') {
                verzameldeExtraMiddelen.push({
                    type: 'overig',
                    soort: soort,
                    weergaveAantal: aantal,
                    eenheid: eenheid
                });
            }
        });
    }

    regData.extraMiddelen = verzameldeExtraMiddelen;
    regData.totaalStandaardGlazen = parseFloat(masterTotaalStandaardGlazen.toFixed(2));
    regData.hoeveelheid = parseFloat(masterTotaleHoeveelheid.toFixed(2));

    const finaleRegistratie = JSON.parse(JSON.stringify(regData));
    
    const opgeslagen = JSON.parse(localStorage.getItem('registratiesData') || '[]');
    
    if (finaleRegistratie.id) {
        const index = opgeslagen.findIndex(r => r.id === finaleRegistratie.id);
        if (index > -1) {
            opgeslagen[index] = finaleRegistratie;
        } else {
            opgeslagen.push(finaleRegistratie);
        }
    } else {
        finaleRegistratie.id = Date.now();
        opgeslagen.push(finaleRegistratie);
    }
    
    localStorage.setItem('registratiesData', JSON.stringify(opgeslagen));

    triggerConfetti();
    window.showRegStep('5');
};

function setupGlobalHandlers() {
    const btn1Next = document.getElementById('btn-reg-1-next');
    if (btn1Next) {
        btn1Next.onclick = function() {
            if (!this.disabled) showRegStep(2);
        };
    }

    const btn2Next = document.getElementById('btn-reg-2-next');
    if (btn2Next) {
        btn2Next.onclick = function() {
            if (!this.disabled) showRegStep(3);
        };
    }
    
    const btn3Next = document.getElementById('btn-reg-3-next');
    if (btn3Next) {
        btn3Next.onclick = function() {
            if (!this.disabled) showRegStep(4);
        };
    }

    const btn2Back = document.getElementById('btn-reg-2-back');
    if (btn2Back) btn2Back.onclick = () => showRegStep(1);

    const btn3Back = document.getElementById('btn-reg-3-back');
    if (btn3Back) btn3Back.onclick = () => showRegStep(2);

    const btn4Back = document.getElementById('btn-reg-4-back');
    if (btn4Back) btn4Back.onclick = () => showRegStep(3);
    
    const btnBackDash = document.getElementById('btn-back-dashboard');
    if (btnBackDash) btnBackDash.onclick = () => renderCatalogus();

    checkStep1Completion();
    checkStep2Completion();
    checkStep3Completion();
}