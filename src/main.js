// src/main.js
import { renderRedenenModule } from './components/modules/redenen-voor-verandering/redenen-voor-verandering.js';
import { renderDoelenModule } from './components/modules/doelen-stellen/doelen-stellen.js';
import { renderEersteStappen } from './components/modules/eerste-stappen/eerste-stappen.js';
import { renderPersoonlijkModule } from './components/modules/persoonlijk/persoonlijk.js';
import { renderRegistratiesModule } from './components/modules/registraties/registraties.js';
import { renderSignaleringsplan } from './components/modules/signaleringsplan/signaleringsplan.js'; 
import { renderDopamineModule } from './components/modules/dopamine/dopamine.js'; 
import { renderNoodkit } from './components/modules/noodkit/noodkit.js';
import { renderFasenVanVerandering } from './components/modules/fasen-van-verandering/fasen-van-verandering.js';
import { renderAnatomieVanTrek } from './components/modules/anatomie-van-trek/anatomie-van-trek.js';
import { renderRisicosituaties } from './components/modules/risicosituaties/risicosituaties.js';
import { renderGSchemaModule } from './components/modules/g-schema/g-schema.js';
import { renderHelpendeGedachtenModule } from './components/modules/helpende-gedachten/helpende-gedachten.js';
import { renderUitglijderModule } from './components/modules/uitglijder/uitglijder.js';
import { renderCirkelsModule } from './components/modules/cirkels/cirkels.js';
import { renderWeigerenModule } from './components/modules/weigeren/weigeren.js';
import { renderBespreekbaarModule } from './components/modules/bespreekbaar/bespreekbaar.js';
import { renderWatIsVerslavingModule } from './components/modules/watisverslaving/watisverslaving.js';
import { renderLotgenotenModule } from './components/modules/lotgenoten/lotgenoten.js';
import { renderHulpModule } from './components/modules/hulp/hulp.js';
import { renderVooruitkijkenModule } from './components/modules/vooruitkijken/vooruitkijken.js';

import { renderGereedschapskist } from './components/gereedschapskist/gereedschapskist.js';

const addictionConfig = {
    'alcohol': '🍺',
    'cannabis': '🌿',
    'cocaine': '❄️',
    'gokken': '🎰'
};

const beschikbareTrajecten = [
    { id: 'alcohol', naam: 'Alcohol', icon: '🍺' },
    { id: 'cannabis', naam: 'Cannabis', icon: '🌿' },
    { id: 'cocaine', naam: 'Cocaïne', icon: '❄️' },
    { id: 'gokken', naam: 'Gokken', icon: '🎰' }
];

function getMijnTrajecten() {
    const saved = localStorage.getItem('mijnTrajecten');
    return saved ? JSON.parse(saved) : [];
}

function getActiefTraject() {
    return localStorage.getItem('actieveVerslaving'); 
}

export function renderTrajectDropdown(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const mijnTrajecten = getMijnTrajecten();
    const actiefTraject = getActiefTraject();

    let html = `
        <div class="traject-dropdown" style="background: white; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); width: 250px; padding: 16px; font-family: 'Nunito', sans-serif;">
            <div style="font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; padding-left: 8px;">
                Kies je traject
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
    `;

    beschikbareTrajecten.forEach(traject => {
        const isToegevoegd = mijnTrajecten.includes(traject.id);
        const isActief = actiefTraject === traject.id;
        
        const bgStyle = isActief ? 'background: #f0fdf4; border: 1px solid #bbf7d0;' : 'background: transparent; border: 1px solid transparent;';
        const hoverClass = isActief ? '' : 'hover-bg-slate'; 
        
        let actieIcoon = '';
        if (isToegevoegd) {
            actieIcoon = `
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="color: #22c55e; font-size: 20px; font-weight: 900;" title="Actief">✓</span>
                    <button onclick="event.stopPropagation(); removeTraject('${traject.id}')" style="background: none; border: none; font-size: 16px; color: #cbd5e1; cursor: pointer; padding: 4px; line-height: 1; transition: color 0.2s;" onmouseover="this.style.color='#ef4444'" onmouseout="this.style.color='#cbd5e1'" title="Traject uitzetten">✖</button>
                    <button onclick="event.stopPropagation(); resetTraject('${traject.id}')" style="background: none; border: none; font-size: 16px; color: #cbd5e1; cursor: pointer; padding: 4px; line-height: 1; transition: color 0.2s;" onmouseover="this.style.color='#3b82f6'" onmouseout="this.style.color='#cbd5e1'" title="Traject opnieuw beginnen">🔄</button>
                </div>
            `;
        } else {
            actieIcoon = `<span style="color: #3b82f6; font-size: 24px; font-weight: 400;">+</span>`;
        }

        const onClickActie = isToegevoegd ? `switchTraject('${traject.id}')` : `addTraject('${traject.id}')`;

        html += `
            <div onclick="${onClickActie}" class="${hoverClass}" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-radius: 12px; cursor: pointer; transition: all 0.2s; ${bgStyle}">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 20px;">${traject.icon}</span>
                    <span style="font-size: 16px; font-weight: 700; color: #1e293b;">${traject.naam}</span>
                </div>
                <div>
                    ${actieIcoon}
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
        <style>
            .hover-bg-slate:hover { background: #f8fafc !important; }
        </style>
    `;

    container.innerHTML = html;
}

window.switchTraject = function(trajectId) {
    localStorage.setItem('actieveVerslaving', trajectId);
    location.reload(); 
}

window.addTraject = function(trajectId) {
    let mijnTrajecten = getMijnTrajecten();
    if (!mijnTrajecten.includes(trajectId)) {
        mijnTrajecten.push(trajectId);
        localStorage.setItem('mijnTrajecten', JSON.stringify(mijnTrajecten));
    }
    switchTraject(trajectId);
}

window.removeTraject = function(trajectId) {
    let mijnTrajecten = getMijnTrajecten();
    mijnTrajecten = mijnTrajecten.filter(t => t !== trajectId);
    localStorage.setItem('mijnTrajecten', JSON.stringify(mijnTrajecten));
    
    let actiefTraject = getActiefTraject();
    if (actiefTraject === trajectId) {
        if (mijnTrajecten.length > 0) {
            localStorage.setItem('actieveVerslaving', mijnTrajecten[0]);
        } else {
            localStorage.removeItem('actieveVerslaving');
        }
    }
    location.reload();
}

window.resetTraject = function(trajectId) {
    if (confirm(`Weet je zeker dat je het traject voor ${trajectId} opnieuw wilt beginnen? Alle opgeslagen inhoud en voortgang van de modules voor dit traject verdwijnt.`)) {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.endsWith(`_${trajectId}`)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));

        let registraties = JSON.parse(localStorage.getItem('registratiesData') || '[]');
        registraties = registraties.filter(reg => reg.middel !== trajectId);
        localStorage.setItem('registratiesData', JSON.stringify(registraties));

        location.reload();
    }
}

function initAddictionSwitcher() {
    const actieveVerslaving = getActiefTraject();
    const iconEl = document.getElementById('current-addiction-icon');
    if (iconEl) {
        iconEl.textContent = actieveVerslaving ? addictionConfig[actieveVerslaving] : '🧭';
    }
    
    const container = document.getElementById('addiction-dropdown-container');
    if (container) container.style.display = 'none';
    
    renderTrajectDropdown('addiction-dropdown-container');
}

// --- DASHBOARD TEMPLATE ---
function getDashboardTemplate() {
    return `
        <style>
            .route-container { 
                max-width: 650px; 
                margin: 0 auto; 
                padding: 10px 20px 100px 20px; 
                font-family: 'Inter', system-ui, sans-serif; 
            }
            
            .route-section { 
                margin: 48px 0 20px 0; 
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .route-section span { 
                color: #64748b; 
                font-size: 14px; 
                font-weight: 800; 
                text-transform: uppercase; 
                letter-spacing: 1.5px; 
                background: #f1f5f9;
                padding: 6px 16px;
                border-radius: 20px;
            }
            
            .route-section::after {
                content: '';
                flex: 1;
                height: 1px;
                background: #e2e8f0;
            }

            @keyframes slideUpFade { 
                0% { opacity: 0; transform: translateY(20px); } 
                100% { opacity: 1; transform: translateY(0); } 
            }
            
            .route-card { 
                display: flex; 
                align-items: center; 
                background: #ffffff !important; 
                color: #1e293b !important;
                border: 1px solid #e2e8f0;
                border-radius: 24px; 
                padding: 24px; 
                margin-bottom: 16px; 
                cursor: pointer; 
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
                box-shadow: 0 4px 15px rgba(0,0,0,0.03); 
                width: 100%; 
                text-align: left;
                position: relative;
                opacity: 0;
                animation: slideUpFade 0.5s ease forwards;
                
                height: auto !important;
                min-height: 108px;
                white-space: normal !important;
                overflow: hidden;
            }
            
            .route-card:hover:not(.locked) { 
                transform: translateY(-4px); 
                box-shadow: 0 12px 25px rgba(0,0,0,0.06); 
                border-color: #cbd5e1; 
            }
            
            .route-card.completed { 
                border-color: #e2e8f0;
                box-shadow: 0 2px 8px rgba(0,0,0,0.02);
            }
            
            .route-card.locked { 
                box-shadow: none; 
                border: 2px dashed #cbd5e1; 
                background: #f8fafc !important; 
                opacity: 0.6; 
                cursor: not-allowed; 
            }
            
            .route-icon { 
                width: 60px; 
                height: 60px; 
                border-radius: 18px; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-size: 28px; 
                margin-right: 20px; 
                flex-shrink: 0; 
                transition: transform 0.3s;
            }
            
            .route-card:hover:not(.locked) .route-icon { transform: scale(1.08); }
            
            .route-text { 
                flex: 1; 
                display: flex; 
                flex-direction: column; 
            }
            
            .route-text h3 { 
                font-size: 18px; 
                font-weight: 800; 
                color: #1e293b !important; 
                margin: 0 0 6px 0; 
                line-height: 1.3 !important;
                white-space: normal !important;
            }
            
            .route-text p { 
                font-size: 14px; 
                color: #64748b !important; 
                margin: 0; 
                font-weight: 500;
                line-height: 1.5 !important;
                white-space: normal !important;
            }
            
            .route-status { 
                width: 40px; 
                display: flex; 
                justify-content: flex-end; 
                align-items: center; 
            }
            
            .status-badge { 
                width: 32px; 
                height: 32px; 
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-size: 16px; 
                font-weight: 900; 
            }
            
            .status-completed {
                background: #ecfdf5; 
                color: #10b981; 
            }
            
            .status-start {
                color: #cbd5e1;
                transition: color 0.2s, transform 0.2s;
            }
            
            .route-card:hover:not(.locked) .status-start {
                color: #3b82f6;
                transform: translateX(4px);
            }
            
            .status-locked {
                color: #94a3b8;
                font-size: 14px;
            }
        </style>

        <div class="route-container">

            <!-- SECTIE 1 (Standaard open) -->
            <div class="route-section"><span>Voorbereiding & Informatie</span></div>

            <button class="route-card path-node active" id="node-motivatie" style="animation-delay: 0.05s;">
                <div class="route-icon" style="background: #fff1f2;">🔥</div>
                <div class="route-text">
                    <h3>Redenen voor verandering</h3>
                    <p>Jouw persoonlijke motivatie</p>
                </div>
                <div class="route-status"><div class="status-badge status-start">→</div></div>
            </button>

            <button class="route-card path-node active" id="node-info" style="animation-delay: 0.1s;">
                <div class="route-icon" style="background: #f5f3ff;">🧠</div>
                <div class="route-text">
                    <h3>Je brein en dopamine</h3>
                    <p>Begrijp de biologische drang</p>
                </div>
                <div class="route-status"><div class="status-badge status-start">→</div></div>
            </button>

            <button class="route-card path-node active" id="node-doelen" style="animation-delay: 0.15s;">
                <div class="route-icon" style="background: #ecfdf5;">🎯</div>
                <div class="route-text">
                    <h3>Doelen stellen</h3>
                    <p>Concreet naar de toekomst</p>
                </div>
                <div class="route-status"><div class="status-badge status-start">→</div></div>
            </button>


            <!-- SECTIE 2 (Standaard Locked) -->
            <div class="route-section"><span>Kerninterventies</span></div>

            <button class="route-card path-node locked" id="node-zelfcontrole" style="animation-delay: 0.2s;">
                <div class="route-icon" style="background: #f8fafc;">🎛️</div>
                <div class="route-text">
                    <h3>Eerste stappen</h3>
                    <p>Zelfcontrole toepassen</p>
                </div>
                <div class="route-status"><div class="status-badge status-locked">🔒</div></div>
            </button>

            <button class="route-card path-node locked" id="node-registraties" style="animation-delay: 0.25s;">
                <div class="route-icon" style="background: #f8fafc;">📖</div>
                <div class="route-text">
                    <h3>Registraties</h3>
                    <p>Monitor je gebruik en trek</p>
                </div>
                <div class="route-status"><div class="status-badge status-locked">🔒</div></div>
            </button>


            <!-- SECTIE 3 (Standaard Locked) -->
            <div class="route-section"><span>Risico's & Inzicht</span></div>

            <button class="route-card path-node locked" id="node-fasen-gedrag" style="animation-delay: 0.3s;">
                <div class="route-icon" style="background: #f8fafc;">📈</div>
                <div class="route-text">
                    <h3>Fasen van verandering</h3>
                    <p>Waar sta jij in je proces?</p>
                </div>
                <div class="route-status"><div class="status-badge status-locked">🔒</div></div>
            </button>

            <button class="route-card path-node locked" id="node-watisverslaving" style="animation-delay: 0.35s;">
                <div class="route-icon" style="background: #f8fafc;">💡</div>
                <div class="route-text">
                    <h3>Wat is verslaving?</h3>
                    <p>Achtergrondinformatie</p>
                </div>
                <div class="route-status"><div class="status-badge status-locked">🔒</div></div>
            </button>

            <button class="route-card path-node locked" id="node-anatomie-trek" style="animation-delay: 0.4s;">
                <div class="route-icon" style="background: #f8fafc;">🌊</div>
                <div class="route-text">
                    <h3>Anatomie van trek</h3>
                    <p>De golf van behoefte</p>
                </div>
                <div class="route-status"><div class="status-badge status-locked">🔒</div></div>
            </button>

            <button class="route-card path-node locked" id="node-risicosituaties" style="animation-delay: 0.45s;">
                <div class="route-icon" style="background: #f8fafc;">⚠️</div>
                <div class="route-text">
                    <h3>Risicosituaties</h3>
                    <p>Jouw valkuilen herkennen</p>
                </div>
                <div class="route-status"><div class="status-badge status-locked">🔒</div></div>
            </button>

            <button class="route-card path-node locked" id="node-g-schema" style="animation-delay: 0.5s;">
                <div class="route-icon" style="background: #f8fafc;">💭</div>
                <div class="route-text">
                    <h3>Het G-schema</h3>
                    <p>Gedachtenpatronen analyseren</p>
                </div>
                <div class="route-status"><div class="status-badge status-locked">🔒</div></div>
            </button>

            <button class="route-card path-node locked" id="node-helpende-gedachten" style="animation-delay: 0.55s;">
                <div class="route-icon" style="background: #f8fafc;">✨</div>
                <div class="route-text">
                    <h3>Helpende Gedachten</h3>
                    <p>Je mindset draaien</p>
                </div>
                <div class="route-status"><div class="status-badge status-locked">🔒</div></div>
            </button>


            <div class="route-section"><span>Actieplan & Herstel</span></div>

            <button class="route-card path-node locked" id="node-signaleringsplan" style="animation-delay: 0.6s;">
                <div class="route-icon" style="background: #f8fafc;">🚦</div>
                <div class="route-text">
                    <h3>Signaleringsplan</h3>
                    <p>Stoplicht voor je gedrag</p>
                </div>
                <div class="route-status"><div class="status-badge status-locked">🔒</div></div>
            </button>

            <button class="route-card path-node locked" id="node-uitglijder" style="animation-delay: 0.65s;">
                <div class="route-icon" style="background: #f8fafc;">🔄</div>
                <div class="route-text">
                    <h3>Herstel na uitglijder</h3>
                    <p>De draad weer oppakken</p>
                </div>
                <div class="route-status"><div class="status-badge status-locked">🔒</div></div>
            </button>

            <button class="route-card path-node locked" id="node-weigeren" style="animation-delay: 0.7s;">
                <div class="route-icon" style="background: #f8fafc;">✋</div>
                <div class="route-text">
                    <h3>Nee zeggen</h3>
                    <p>Grenzen stellen in de praktijk</p>
                </div>
                <div class="route-status"><div class="status-badge status-locked">🔒</div></div>
            </button>


            <div class="route-section"><span>Omgeving & Steun</span></div>

            <button class="route-card path-node locked" id="node-cirkels" style="animation-delay: 0.75s;">
                <div class="route-icon" style="background: #f8fafc;">⭕</div>
                <div class="route-text">
                    <h3>Cirkels van nabijheid</h3>
                    <p>Jouw sociale vangnet</p>
                </div>
                <div class="route-status"><div class="status-badge status-locked">🔒</div></div>
            </button>

            <button class="route-card path-node locked" id="node-bespreekbaar" style="animation-delay: 0.8s;">
                <div class="route-icon" style="background: #f8fafc;">🗣️</div>
                <div class="route-text">
                    <h3>Bespreekbaar maken</h3>
                    <p>Hoe vertel je het anderen?</p>
                </div>
                <div class="route-status"><div class="status-badge status-locked">🔒</div></div>
            </button>

            <button class="route-card path-node locked" id="node-lotgenoten" style="animation-delay: 0.85s;">
                <div class="route-icon" style="background: #f8fafc;">👥</div>
                <div class="route-text">
                    <h3>Lotgenoten</h3>
                    <p>Steun bij gelijkgestemden</p>
                </div>
                <div class="route-status"><div class="status-badge status-locked">🔒</div></div>
            </button>

            <button class="route-card path-node locked" id="node-hulp" style="animation-delay: 0.9s;">
                <div class="route-icon" style="background: #f8fafc;">🤝</div>
                <div class="route-text">
                    <h3>Hulp inschakelen</h3>
                    <p>Professionele ondersteuning</p>
                </div>
                <div class="route-status"><div class="status-badge status-locked">🔒</div></div>
            </button>

            
            <div class="route-section"><span>Afsluiting</span></div>

            <button class="route-card path-node locked" id="node-vooruitkijken" style="animation-delay: 0.95s;">
                <div class="route-icon" style="background: #f8fafc;">🌅</div>
                <div class="route-text">
                    <h3>Vooruitkijken</h3>
                    <p>Je nieuwe leven behouden</p>
                </div>
                <div class="route-status"><div class="status-badge status-locked">🔒</div></div>
            </button>

        </div>
    `;
}

function markCompleted(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.remove('locked');
        el.classList.add('completed');
        const statusDiv = el.querySelector('.route-status');
        if (statusDiv) {
            statusDiv.innerHTML = `<div class="status-badge status-completed">✓</div>`;
        }
    }
}

// Activeren van vergrendelde modules (geeft ze hun kleur terug)
function unlockModule(id, bgColor) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.remove('locked');
        const iconDiv = el.querySelector('.route-icon');
        if (iconDiv && bgColor) {
            iconDiv.style.background = bgColor;
        }
        const statusDiv = el.querySelector('.route-status');
        if (statusDiv && !el.classList.contains('completed')) {
            statusDiv.innerHTML = `<div class="status-badge status-start">→</div>`;
        }
    }
}

function updateBottomNav(activeId) {
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.classList.remove('active');
    });
    const target = document.getElementById(activeId);
    if (target) target.classList.add('active');
}

export function renderDashboard() {
    const appContent = document.getElementById('app-content');
    if (!appContent) return;

    setTimeout(() => window.scrollTo(0, 0), 50);

    const mijnTrajecten = getMijnTrajecten();
    const actiefTraject = getActiefTraject();
    
    if (mijnTrajecten.length === 0 || !actiefTraject) {
        appContent.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 65vh; text-align: center; padding: 24px; font-family: 'Nunito', sans-serif;">
                <div style="font-size: 64px; margin-bottom: 24px;">🧭</div>
                <h2 style="font-size: 24px; font-weight: 800; color: #1e293b; margin-bottom: 12px;">Welkom bij Verslavingsvrij!</h2>
                <p style="font-size: 16px; color: #475569; max-width: 400px; line-height: 1.6; margin-bottom: 0;">
                    Goed dat je aan de slag wilt gaan om je middelengebruik/gokken aan te pakken!<br><br>
                    <strong>Kies een traject in het menu rechtsboven om te starten.</strong>
                </p>
            </div>
        `;
        updateBottomNav('btn-home');
        return; 
    }

    appContent.innerHTML = getDashboardTemplate();
    updateBottomNav('btn-home');

    // Data ophalen uit localStorage
    const p1 = localStorage.getItem(`arminius_module_redenen_completed_${actiefTraject}`);
    const pInfo = localStorage.getItem(`arminius_module_dopamine_completed_${actiefTraject}`); 
    const p2 = localStorage.getItem(`arminius_module_doelen_completed_${actiefTraject}`);
    
    const p3 = localStorage.getItem(`arminius_module_eerste_stappen_completed_${actiefTraject}`);
    const pRegsDone = localStorage.getItem(`arminius_module_registraties_completed_${actiefTraject}`); 
    
    const alleRegistraties = JSON.parse(localStorage.getItem('registratiesData') || '[]');
    const trajectRegistraties = alleRegistraties.filter(reg => reg.middel === actiefTraject);
    const hasRegs = trajectRegistraties.length > 0;

    const pFasen = localStorage.getItem(`arminius_module_fasen_completed_${actiefTraject}`);
    const pAnatomie = localStorage.getItem(`arminius_module_anatomie_completed_${actiefTraject}`);
    const pWatisverslaving = localStorage.getItem(`arminius_module_watisverslaving_completed_${actiefTraject}`);
    
    const pRisico = localStorage.getItem(`arminius_module_risicosituaties_completed_${actiefTraject}`);
    const pGSchema = localStorage.getItem(`arminius_module_gschema_completed_${actiefTraject}`);

    const pHelpendeGedachten = localStorage.getItem(`arminius_module_helpende_gedachten_completed_${actiefTraject}`);
    const pSignaleringsplan = localStorage.getItem(`arminius_module_signaleringsplan_completed_${actiefTraject}`);
    const pUitglijder = localStorage.getItem(`arminius_module_uitglijder_completed_${actiefTraject}`); 
    
    const pWeigeren = localStorage.getItem(`arminius_module_weigeren_completed_${actiefTraject}`); 
    const pCirkels = localStorage.getItem(`arminius_module_cirkels_completed_${actiefTraject}`); 
    const pBespreekbaar = localStorage.getItem(`arminius_module_bespreekbaar_completed_${actiefTraject}`);
    
    const pLotgenoten = localStorage.getItem(`arminius_module_lotgenoten_completed_${actiefTraject}`);
    const pHulp = localStorage.getItem(`arminius_module_hulp_completed_${actiefTraject}`);
    const pVooruitkijken = localStorage.getItem(`arminius_module_vooruitkijken_completed_${actiefTraject}`);

    // Noodknop status (buiten de route)
    const noodknop = document.getElementById('btn-noodknop');
    if (noodknop) {
        noodknop.style.opacity = '1';
        noodknop.style.filter = 'none';
    }

    // --- LOGICA SECTIE 1 ---
    if (p1) markCompleted('node-motivatie');
    if (pInfo) markCompleted('node-info');
    if (p2) markCompleted('node-doelen');

    const sectie1Done = (p1 && pInfo && p2);

    // --- LOGICA SECTIE 2 ---
    if (sectie1Done) {
        unlockModule('node-zelfcontrole', '#eff6ff');
        unlockModule('node-registraties', '#fffbeb');

        if (p3) markCompleted('node-zelfcontrole');
        if (hasRegs || pRegsDone) markCompleted('node-registraties');
    }

    const sectie2Done = (sectie1Done && p3 && (hasRegs || pRegsDone));

    // --- LOGICA SECTIE 3 ---
    if (sectie2Done) {
        unlockModule('node-fasen-gedrag', '#fefce8');
        unlockModule('node-watisverslaving', '#fff1f2');
        unlockModule('node-anatomie-trek', '#eff6ff');
        
        if (pFasen) markCompleted('node-fasen-gedrag');
        if (pWatisverslaving) markCompleted('node-watisverslaving');
        if (pAnatomie) markCompleted('node-anatomie-trek');
    }

    // --- LOGICA VERVOLG ---
    if (sectie2Done && pFasen && pAnatomie) {
        unlockModule('node-risicosituaties', '#fffbeb');
        unlockModule('node-g-schema', '#f5f3ff');
        
        if (pRisico) markCompleted('node-risicosituaties');
        if (pGSchema) markCompleted('node-g-schema');
    }

    if (sectie2Done && pFasen && pAnatomie && pRisico && pGSchema) {
        unlockModule('node-helpende-gedachten', '#ecfdf5');
        if (pHelpendeGedachten) markCompleted('node-helpende-gedachten');
    }

    if (pHelpendeGedachten) {
        unlockModule('node-signaleringsplan', '#fef2f2');
        unlockModule('node-uitglijder', '#eff6ff');

        if (pSignaleringsplan) markCompleted('node-signaleringsplan');
        if (pUitglijder) markCompleted('node-uitglijder'); 
    }

    if (pSignaleringsplan && pUitglijder) {
        unlockModule('node-weigeren', '#fff1f2');
        if (pWeigeren) markCompleted('node-weigeren');
    }

    if (pWeigeren) {
        unlockModule('node-cirkels', '#f5f3ff');
        if (pCirkels) markCompleted('node-cirkels');
    }

    if (pCirkels) {
        unlockModule('node-bespreekbaar', '#ecfdf5');
        if (pBespreekbaar) markCompleted('node-bespreekbaar');
    }

    if (pBespreekbaar) {
        unlockModule('node-lotgenoten', '#eff6ff');
        unlockModule('node-hulp', '#fffbeb');

        if (pLotgenoten) markCompleted('node-lotgenoten');
        if (pHulp) markCompleted('node-hulp');

        if (pLotgenoten && pHulp) {
            unlockModule('node-vooruitkijken', '#fff1f2');
            if (pVooruitkijken) markCompleted('node-vooruitkijken');
        }
    }

    // =========================================================
    // --- TIJDELIJKE DEMO-MODUS: ALLES ONTGRENDELEN ---
    // Verwijder dit blok later om de beveiliging weer aan te zetten
    // =========================================================
    unlockModule('node-zelfcontrole', '#eff6ff');
    unlockModule('node-registraties', '#fffbeb');
    unlockModule('node-fasen-gedrag', '#fefce8');
    unlockModule('node-watisverslaving', '#fff1f2');
    unlockModule('node-anatomie-trek', '#eff6ff');
    unlockModule('node-risicosituaties', '#fffbeb');
    unlockModule('node-g-schema', '#f5f3ff');
    unlockModule('node-helpende-gedachten', '#ecfdf5');
    unlockModule('node-signaleringsplan', '#fef2f2');
    unlockModule('node-uitglijder', '#eff6ff');
    unlockModule('node-weigeren', '#fff1f2');
    unlockModule('node-cirkels', '#f5f3ff');
    unlockModule('node-bespreekbaar', '#ecfdf5');
    unlockModule('node-lotgenoten', '#eff6ff');
    unlockModule('node-hulp', '#fffbeb');
    unlockModule('node-vooruitkijken', '#fff1f2');
    // =========================================================
}

document.addEventListener('click', (e) => {
    
    if (e.target.closest('#btn-addiction-switch')) {
        const dropdown = document.getElementById('addiction-dropdown-container');
        if (dropdown.style.display === 'none' || dropdown.classList.contains('hidden')) {
            dropdown.style.display = 'block';
            dropdown.classList.remove('hidden');
            renderTrajectDropdown('addiction-dropdown-container'); 
        } else {
            dropdown.style.display = 'none';
            dropdown.classList.add('hidden');
        }
        return; 
    }

    if (!e.target.closest('#addiction-switcher')) {
        const dropdown = document.getElementById('addiction-dropdown-container');
        if (dropdown && dropdown.style.display !== 'none') {
            dropdown.style.display = 'none';
            dropdown.classList.add('hidden');
        }
    }

    if (e.target.closest('#btn-home')) {
        renderDashboard();
        return;
    }

    if (e.target.closest('#btn-logbook')) {
        const mijnTrajecten = getMijnTrajecten();
        if (mijnTrajecten.length === 0) {
            alert("Kies eerst een traject om de registraties te openen.");
            return;
        }
        
        updateBottomNav('btn-logbook');
        renderRegistratiesModule(() => {
            const actief = getActiefTraject();
            localStorage.setItem(`arminius_module_registraties_completed_${actief}`, 'true');
            renderDashboard();
        });
        return;
    }

    if (e.target.closest('#btn-noodknop')) {
        updateBottomNav('btn-noodknop');
        renderNoodkit();
        return;
    }

    if (e.target.closest('#btn-tools')) {
        updateBottomNav('btn-tools');
        const appContent = document.getElementById('app-content');
        if (appContent) {
            renderGereedschapskist(appContent);
        }
        return;
    }

    if (e.target.closest('#btn-profile')) {
        updateBottomNav('btn-profile');
        const appContent = document.getElementById('app-content') || document.getElementById('app');
        if (appContent) {
            appContent.innerHTML = renderPersoonlijkModule();
        }
        return;
    }

    if (e.target.closest('#node-info')) {
        renderDopamineModule(() => {
            const actief = getActiefTraject();
            localStorage.setItem(`arminius_module_dopamine_completed_${actief}`, 'true');
            renderDashboard();
        });
        return;
    }

    if (e.target.closest('#node-motivatie')) {
        renderRedenenModule(() => {
            const actief = getActiefTraject();
            localStorage.setItem(`arminius_module_redenen_completed_${actief}`, 'true');
            renderDashboard();
        });
        return;
    }

    if (e.target.closest('#node-doelen')) {
        renderDoelenModule((goalData) => {
            const actief = getActiefTraject();
            localStorage.setItem(`arminius_module_doelen_completed_${actief}`, 'true');
            if (goalData) {
                localStorage.setItem(`arminius_user_goal_${actief}`, JSON.stringify(goalData));
            }
            renderDashboard();
        });
        return;
    }

    // Klik event voor Sectie 2 modules (Nu mét slotje-beveiliging)
    if (e.target.closest('#node-zelfcontrole')) {
        const node = e.target.closest('.path-node');
        if (node && !node.classList.contains('locked')) {
            const appContent = document.getElementById('app-content');
            renderEersteStappen(appContent, () => {
                const actief = getActiefTraject();
                localStorage.setItem(`arminius_module_eerste_stappen_completed_${actief}`, 'true');
                renderDashboard();
            });
        } else {
            alert("Voltooi eerst de voorgaande modules in 'Voorbereiding & Informatie'.");
        }
        return;
    }

    if (e.target.closest('#node-registraties')) {
        const node = e.target.closest('.path-node');
        if (node && !node.classList.contains('locked')) {
            updateBottomNav('btn-logbook');
            renderRegistratiesModule(() => {
                const actief = getActiefTraject();
                localStorage.setItem(`arminius_module_registraties_completed_${actief}`, 'true');
                renderDashboard();
            });
        } else {
            alert("Voltooi eerst de voorgaande modules in 'Voorbereiding & Informatie'.");
        }
        return;
    }

    // Klik events voor overige modules
    if (e.target.closest('#node-watisverslaving')) {
        const node = e.target.closest('.path-node');
        if (node && !node.classList.contains('locked')) {
            const appContent = document.getElementById('app-content');
            renderWatIsVerslavingModule(appContent, () => {
                const actief = getActiefTraject();
                localStorage.setItem(`arminius_module_watisverslaving_completed_${actief}`, 'true');
                renderDashboard();
            });
        } else {
            alert("Voltooi eerst de voorgaande modules op je routekaart.");
        }
        return;
    }

    if (e.target.closest('#node-fasen-gedrag')) {
        const node = e.target.closest('.path-node');
        if (node && !node.classList.contains('locked')) {
            const appContent = document.getElementById('app-content');
            renderFasenVanVerandering(appContent, () => {
                const actief = getActiefTraject();
                localStorage.setItem(`arminius_module_fasen_completed_${actief}`, 'true');
                renderDashboard();
            });
        } else {
            alert("Voltooi eerst de voorgaande modules op je routekaart.");
        }
        return;
    }

    if (e.target.closest('#node-anatomie-trek')) {
        const node = e.target.closest('.path-node');
        if (node && !node.classList.contains('locked')) {
            const appContent = document.getElementById('app-content');
            renderAnatomieVanTrek(appContent, () => {
                const actief = getActiefTraject();
                localStorage.setItem(`arminius_module_anatomie_completed_${actief}`, 'true');
                renderDashboard();
            });
        } else {
            alert("Voltooi eerst de voorgaande modules op je routekaart.");
        }
        return;
    }

    if (e.target.closest('#node-risicosituaties')) {
        const node = e.target.closest('.path-node');
        if (node && !node.classList.contains('locked')) {
            const appContent = document.getElementById('app-content');
            renderRisicosituaties(appContent, () => {
                const actief = getActiefTraject();
                localStorage.setItem(`arminius_module_risicosituaties_completed_${actief}`, 'true');
                renderDashboard();
            });
        } else {
            alert("Voltooi eerst 'Fasen van verandering' en 'Anatomie van trek'.");
        }
        return;
    }

    if (e.target.closest('#node-g-schema')) {
        const node = e.target.closest('.path-node');
        if (node && !node.classList.contains('locked')) {
            const appContent = document.getElementById('app-content');
            renderGSchemaModule(() => {
                const actief = getActiefTraject();
                localStorage.setItem(`arminius_module_gschema_completed_${actief}`, 'true');
                renderDashboard();
            });
        } else {
            alert("Voltooi eerst 'Fasen van verandering' en 'Anatomie van trek'.");
        }
        return;
    }

    if (e.target.closest('#node-helpende-gedachten')) {
        const node = e.target.closest('.path-node');
        if (node && !node.classList.contains('locked')) {
            const appContent = document.getElementById('app-content');
            renderHelpendeGedachtenModule(appContent, () => {
                const actief = getActiefTraject();
                localStorage.setItem(`arminius_module_helpende_gedachten_completed_${actief}`, 'true');
                renderDashboard();
            });
        } else {
            alert("Voltooi eerst 'Risicosituaties' en 'Het G-schema'.");
        }
        return;
    }

    if (e.target.closest('#node-signaleringsplan')) {
        const node = e.target.closest('.path-node');
        if (node && !node.classList.contains('locked')) {
            const appContent = document.getElementById('app-content');
            renderSignaleringsplan(appContent, () => {
                const actief = getActiefTraject();
                localStorage.setItem(`arminius_module_signaleringsplan_completed_${actief}`, 'true');
                renderDashboard();
            });
        } else {
            alert("Voltooi eerst de module 'Helpende Gedachten'.");
        }
        return;
    }

    if (e.target.closest('#node-uitglijder')) {
        const node = e.target.closest('.path-node');
        if (node && !node.classList.contains('locked')) {
            const appContent = document.getElementById('app-content');
            renderUitglijderModule(appContent, () => {
                const actief = getActiefTraject();
                localStorage.setItem(`arminius_module_uitglijder_completed_${actief}`, 'true');
                renderDashboard();
            });
        } else {
            alert("Voltooi eerst de module 'Helpende Gedachten'.");
        }
        return;
    }

    if (e.target.closest('#node-weigeren')) {
        const node = e.target.closest('.path-node');
        if (node && !node.classList.contains('locked')) {
            const appContent = document.getElementById('app-content');
            renderWeigerenModule(appContent, () => {
                const actief = getActiefTraject();
                localStorage.setItem(`arminius_module_weigeren_completed_${actief}`, 'true');
                renderDashboard();
            });
        } else {
            alert("Voltooi eerst 'Signaleringsplan' en 'Herstel na uitglijder'.");
        }
        return;
    }

    if (e.target.closest('#node-cirkels')) {
        const node = e.target.closest('.path-node');
        if (node && !node.classList.contains('locked')) {
            const appContent = document.getElementById('app-content');
            renderCirkelsModule(appContent, () => {
                const actief = getActiefTraject();
                localStorage.setItem(`arminius_module_cirkels_completed_${actief}`, 'true');
                renderDashboard();
            });
        } else {
            alert("Voltooi eerst de module 'Nee zeggen'.");
        }
        return;
    }

    if (e.target.closest('#node-bespreekbaar')) {
        const node = e.target.closest('.path-node');
        if (node && !node.classList.contains('locked')) {
            const appContent = document.getElementById('app-content');
            renderBespreekbaarModule(appContent, () => {
                const actief = getActiefTraject();
                localStorage.setItem(`arminius_module_bespreekbaar_completed_${actief}`, 'true');
                renderDashboard();
            });
        } else {
            alert("Voltooi eerst de module 'Cirkels van nabijheid'.");
        }
        return;
    }

    if (e.target.closest('#node-lotgenoten')) {
        const node = e.target.closest('.path-node');
        if (node && !node.classList.contains('locked')) {
            const appContent = document.getElementById('app-content');
            renderLotgenotenModule(appContent, () => {
                const actief = getActiefTraject();
                localStorage.setItem(`arminius_module_lotgenoten_completed_${actief}`, 'true');
                renderDashboard();
            });
        } else {
            alert("Voltooi eerst de module 'Bespreekbaar maken'.");
        }
        return;
    }

    if (e.target.closest('#node-hulp')) {
        const node = e.target.closest('.path-node');
        if (node && !node.classList.contains('locked')) {
            const appContent = document.getElementById('app-content');
            renderHulpModule(appContent, () => {
                const actief = getActiefTraject();
                localStorage.setItem(`arminius_module_hulp_completed_${actief}`, 'true');
                renderDashboard();
            });
        } else {
            alert("Voltooi eerst de module 'Bespreekbaar maken'.");
        }
        return;
    }

    if (e.target.closest('#node-vooruitkijken')) {
        const node = e.target.closest('.path-node');
        if (node && !node.classList.contains('locked')) {
            const appContent = document.getElementById('app-content');
            renderVooruitkijkenModule(appContent, () => {
                const actief = getActiefTraject();
                localStorage.setItem(`arminius_module_vooruitkijken_completed_${actief}`, 'true');
                renderDashboard();
            });
        } else {
            alert("Voltooi eerst de modules 'Lotgenoten' en 'Hulp inschakelen'.");
        }
        return;
    }
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initAddictionSwitcher();
        renderDashboard(); 
    });
} else {
    initAddictionSwitcher();
    renderDashboard(); 
}

// =========================================================
// --- TERUGKNOP (HISTORY API) VOOR MOBIEL ---
// =========================================================
function pushAppHistory(viewName) {
    if (history.state?.view !== viewName) {
        history.pushState({ view: viewName }, '', `#${viewName}`);
    }
}

// Stel het startpunt in zodra de app laadt
history.replaceState({ view: 'dashboard' }, '', '#dashboard');

// Leg automatisch een kruimelspoor neer bij het klikken op tabs of modules
document.addEventListener('click', (e) => {
    if (e.target.closest('#btn-home')) pushAppHistory('dashboard');
    else if (e.target.closest('#btn-tools')) pushAppHistory('tools');
    else if (e.target.closest('#btn-logbook')) pushAppHistory('logbook');
    else if (e.target.closest('#btn-noodknop')) pushAppHistory('noodknop');
    else if (e.target.closest('#btn-profile')) pushAppHistory('profile');
    else if (e.target.closest('.path-node:not(.locked)')) pushAppHistory('module');
});

// Vang de fysieke terugknop (of swipe) van de telefoon op
window.addEventListener('popstate', (e) => {
    const targetView = e.state?.view || 'dashboard';
    const appContent = document.getElementById('app-content');

    if (targetView === 'tools' && appContent) {
        updateBottomNav('btn-tools');
        renderGereedschapskist(appContent);
    } else if (targetView === 'logbook') {
        updateBottomNav('btn-logbook');
        renderRegistratiesModule(() => {
            const actief = getActiefTraject();
            localStorage.setItem(`arminius_module_registraties_completed_${actief}`, 'true');
            renderDashboard();
        });
    } else if (targetView === 'noodknop') {
        updateBottomNav('btn-noodknop');
        renderNoodkit();
    } else if (targetView === 'profile' && appContent) {
        updateBottomNav('btn-profile');
        appContent.innerHTML = renderPersoonlijkModule();
    } else {
        renderDashboard();
    }
});

// Maak beschikbaar voor sub-pagina's (zoals Achtergrondgeluiden in Hulpmiddelen)
window.pushAppHistory = pushAppHistory;