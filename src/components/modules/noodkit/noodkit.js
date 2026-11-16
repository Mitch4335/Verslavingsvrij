// src/components/modules/noodkit/noodkit.js

let activeNoodkitFase = 'rood';
let cachedNoodkitContainer = null;

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

export function renderNoodkit(containerElement, isInternal = false) {
    const container = containerElement || document.getElementById('app-content');
    if (!container) return;
    
    cachedNoodkitContainer = container;

    if (!isInternal) {
        activeNoodkitFase = 'rood';
        setTimeout(() => window.scrollTo(0, 0), 50);
    }

    const actiefTraject = localStorage.getItem('actieveVerslaving') || 'alcohol';
    const savedState = JSON.parse(localStorage.getItem(`signaleringsplan_state_${actiefTraject}`)) || {};
    const savedRedenenStr = localStorage.getItem(`arminius_module_redenen_data_${actiefTraject}`);
    
    // --- BELANGRIJKE FIX: Noodkit checkt nu of de risicogedachte daadwerkelijk nog actief is ---
    const savedHelpendeStr = localStorage.getItem(`arminius_module_helpende_gedachten_data_${actiefTraject}`);
    let helpendeKoppelingen = {};
    let actieveRisicos = [];
    
    if (savedHelpendeStr) {
        try {
            const parsed = JSON.parse(savedHelpendeStr);
            if (parsed.gekoppeldeGedachten) helpendeKoppelingen = parsed.gekoppeldeGedachten;
            if (parsed.risicogedachten) actieveRisicos = parsed.risicogedachten;
        } catch (e) { console.error(e); }
    }
    
    // Filter out wees-data (orphan data)
    const risicos = Object.keys(helpendeKoppelingen).filter(r => actieveRisicos.includes(r));
    const heeftHelpendeGedachten = risicos.length > 0;

    let topRedenen = [];
    if (savedRedenenStr) {
        try {
            const savedRedenen = JSON.parse(savedRedenenStr);
            if (savedRedenen.top3 && Array.isArray(savedRedenen.top3)) {
                topRedenen = savedRedenen.top3.map(item => {
                    const icon = item.type === 'Nadeel' ? '⚠️' : '✨';
                    return {
                        html: `<strong>${icon} ${item.type}:</strong> ${item.text}`,
                        type: item.type
                    };
                });
            }
        } catch (e) {}
    }

    if (topRedenen.length === 0) {
        topRedenen = [
            { html: "<strong>✨ Voordeel:</strong> Weer de controle over mijn eigen leven en keuzes", type: 'Voordeel' },
            { html: "<strong>✨ Voordeel:</strong> Beter voor mijn gezondheid en toekomst", type: 'Voordeel' },
            { html: "<strong>⚠️ Nadeel:</strong> Problemen voorkomen met werk of studie", type: 'Nadeel' }
        ];
    }

    const hasData = Object.keys(savedState).some(key => savedState[key] && savedState[key].length > 0) || heeftHelpendeGedachten;

    if (!hasData) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; font-family: inherit;">
                <div style="font-size: 48px; margin-bottom: 16px;">🛡️</div>
                <h2 style="color: #1e293b; margin-bottom: 12px;">Je Noodkit is nog leeg</h2>
                <p style="color: #475569; line-height: 1.6; margin-bottom: 24px;">Vul eerst je Signaleringsplan in via de Route.</p>
            </div>
        `;
        return;
    }

    let html = `
        <style>
            @keyframes emergency-pulse {
                0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
                70% { box-shadow: 0 0 0 15px rgba(34, 197, 94, 0); }
                100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
            }
            .contact-pulse {
                animation: emergency-pulse 2s infinite;
                border: 2px solid #16a34a !important;
                background: #dcfce7 !important;
            }
        </style>
        <div style="padding-bottom: 80px; font-family: inherit;">
            <div style="margin-bottom: 24px; text-align: center;">
                <h2 style="font-size: 32px; color: #1e293b; margin-bottom: 4px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.5px;">Noodkit</h2>
                <p style="color: #dc2626; font-weight: 800; font-size: 16px;">LEES DIT. JE HOEFT DIT NIET ALLEEN TE DOEN.</p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">
    `;

    const fasen = [
        { id: 'rood', titel: '🚨 ACUUT: VEEL TREK (ROOD)', bgHeader: '#dc2626', textHeader: '#ffffff', bgBody: '#fef2f2', borderColor: '#ef4444' },
        { id: 'oranje', titel: '⚠️ PREVENTIE: BEETJE TREK (ORANJE)', bgHeader: '#f59e0b', textHeader: '#ffffff', bgBody: '#fffbeb', borderColor: '#fcd34d' }
    ];

    const themas = [
        { id: 'zelf', label: 'WAT IK NU DIRECT KAN DOEN:' },
        { id: 'anderen', label: 'HOE ANDEREN KUNNEN HELPEN:' },
        { id: 'contacten', label: 'BEL DIRECT VOOR HULP:' }
    ];

    fasen.forEach(fase => {
        const faseHeeftInhoud = themas.some(thema => savedState[`${fase.id}_${thema.id}`]?.length > 0);
        
        if (faseHeeftInhoud) {
            const isOpen = (activeNoodkitFase === fase.id);

            html += `
                <div style="border: 2px solid ${fase.borderColor}; border-radius: 16px; overflow: hidden; box-shadow: ${isOpen ? '0 10px 25px -5px rgba(0,0,0,0.1)' : 'none'}; transition: all 0.3s ease;">
                    <div class="noodkit-accordion-btn" data-fasekey="${fase.id}" style="background: ${fase.bgHeader}; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                        <h3 style="color: ${fase.textHeader}; margin: 0; font-size: 1.3rem; font-weight: 900; letter-spacing: 0.5px;">${fase.titel}</h3>
                        <span style="color: ${fase.textHeader}; font-size: 1.5rem; font-weight: 900;">${isOpen ? '▲' : '▼'}</span>
                    </div>
            `;

            if (isOpen) {
                html += `<div style="background: ${fase.bgBody}; padding: 0 24px 24px 24px;">`;
                
                themas.forEach(thema => {
                    const items = savedState[`${fase.id}_${thema.id}`];

                    if (items && items.length > 0) {
                        const isContact = thema.id === 'contacten';
                        html += `
                            <div style="margin-top: 24px;">
                                <div style="font-size: 0.95rem; font-weight: 900; color: #1e293b; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">${thema.label}</div>
                                <div style="display: flex; flex-direction: column; gap: 12px;">
                                    ${items.map(item => `
                                        <div class="${isContact ? 'contact-pulse' : ''}" style="background: #ffffff; border: 2px solid ${isContact ? '#16a34a' : '#cbd5e1'}; padding: 16px 20px; border-radius: 12px; color: ${isContact ? '#166534' : '#0f172a'}; font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                                            <span style="margin-right: 16px; font-size: 1.4rem; color: ${isContact ? '#16a34a' : fase.bgHeader};">${isContact ? '📞' : '➤'}</span> 
                                            ${escapeHtml(item)}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    }
                });
                
                html += `</div>`;
            }
            html += `</div>`;
        }
    });

    html += `</div>`; 

    if (topRedenen.length > 0 || heeftHelpendeGedachten) {
        html += `<div style="margin-top: 40px; padding-top: 32px; border-top: 4px solid #cbd5e1;">`;

        if (topRedenen.length > 0) {
            html += `
                <h3 style="color: #0f172a; font-size: 1.4rem; font-weight: 900; margin-bottom: 20px; text-align: center; text-transform: uppercase;">Waarom ik dit doe:</h3>
                <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">
                    ${topRedenen.map(reden => {
                        const isNadeel = reden.type === 'Nadeel';
                        const bgColor = isNadeel ? '#fef2f2' : '#f0fdf4';
                        const borderColor = isNadeel ? '#f87171' : '#4ade80';
                        
                        return `
                        <div style="background: ${bgColor}; border-left: 6px solid ${borderColor}; padding: 16px 20px; border-radius: 0 12px 12px 0; font-size: 1.1rem; color: #1e293b; font-weight: 700; line-height: 1.5; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                            ${reden.html}
                        </div>
                        `;
                    }).join('')}
                </div>
            `;
        }

        if (heeftHelpendeGedachten) {
            html += `
                <h3 style="color: #0f172a; font-size: 1.4rem; font-weight: 900; margin-bottom: 20px; text-align: center; text-transform: uppercase;">Mijn helpende gedachten:</h3>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    ${risicos.map(risico => `
                        <div style="background: #ffffff; border: 2px solid #86efac; padding: 16px 20px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                            <div style="font-size: 0.95rem; color: #dc2626; font-weight: 700; margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px; opacity: 0.8;">
                                <span>⚠️</span> <span style="text-decoration: line-through;">${escapeHtml(risico)}</span>
                            </div>
                            <div style="font-size: 1.1rem; color: #15803d; font-weight: 800; display: flex; align-items: flex-start; gap: 8px;">
                                <span>✨</span> <span>${escapeHtml(helpendeKoppelingen[risico])}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        html += `</div>`;
    }

    html += `</div>`;

    container.innerHTML = html;
    attachNoodkitEventHandlers(container);
}

function attachNoodkitEventHandlers(container) {
    container.onclick = function(e) {
        const accHeader = e.target.closest('.noodkit-accordion-btn');
        if (accHeader) {
            const faseKey = accHeader.dataset.fasekey;
            activeNoodkitFase = (activeNoodkitFase === faseKey) ? null : faseKey;
            renderNoodkit(cachedNoodkitContainer, true);
        }
    };
}