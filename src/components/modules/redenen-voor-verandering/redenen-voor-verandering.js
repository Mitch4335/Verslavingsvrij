// src/components/modules/redenen-voor-verandering/redenen-voor-verandering.js
import { getActiveData } from '../../../data/contentManager.js';

let selectedTop3 = [];
let draggedIndex = null;
let onCompleteCallback = null;

// Laadt automatisch de CSS uit dezelfde map als dit JS-bestand
function loadCSS() {
    const cssUrl = new URL('./redenen-voor-verandering.css', import.meta.url).href;
    if (!document.querySelector(`link[href="${cssUrl}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssUrl;
        document.head.appendChild(link);
    }
}

// Helper om de knoppen te genereren
function renderReasonChips(chipArray) {
    if (!chipArray) return '';
    return chipArray.map(item => `
        <button class="chip" data-val="${item.val}">${item.text}</button>
    `).join('');
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

            if (p.y < canvas.height) {
                activePieces++;
            }

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
            if (document.body.contains(canvas)) {
                document.body.removeChild(canvas);
            }
            if (onFinish) onFinish();
        }
    }

    update();
}

export function renderRedenenModule(onComplete) {
    window.scrollTo(0, 0);
    
    loadCSS();
    selectedTop3 = [];
    onCompleteCallback = typeof onComplete === 'function' ? onComplete : null;
    
    // Haal de data op van het huidige traject
    const currentData = getActiveData();
    const term = currentData.terminologie;
    const redenen = currentData.redenen;
    
    const htmlContent = `
        <div class="module-container">
            <style>
                @keyframes slideUpFade { 0% { opacity: 0; transform: translateY(15px); } 100% { opacity: 1; transform: translateY(0); } }
                .stagger-1 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.1s; }
                .stagger-2 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.2s; }
                .stagger-3 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.3s; }
                .stagger-4 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.4s; }

                /* Voorkomt horizontaal scrollen in de hele module */
                .module-container, .module-container * {
                    box-sizing: border-box;
                }
                .module-container {
                    max-width: 100%;
                    overflow-x: hidden;
                }

                .info-block { background: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid #3b82f6; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); max-width: 100%; overflow-x: hidden; }
                
                /* Frisse styling voor de chips in de hele module */
                .chip-group { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 16px; align-items: flex-start; max-width: 100%; }
                .chip {
                    display: flex;
                    align-items: flex-start;
                    gap: 8px; padding: 10px 16px; border-radius: 20px;
                    font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s;
                    border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; font-family: inherit;
                    text-align: left;
                    line-height: 1.4;
                    white-space: normal;
                    width: max-content;
                    max-width: 100%;
                }
                .chip span {
                    display: inline;
                }
                .chip:hover { background: #f1f5f9; transform: translateY(-1px); }
                
                /* Nadelen (Stap 1) - Rode accenten */
                #step-1 .chip.selected { border: 1px solid #ef4444; background: #fef2f2; color: #b91c1c; font-weight: 600; box-shadow: 0 2px 4px rgba(239,68,68,0.1); }
                
                /* Voordelen (Stap 2) - Groene accenten */
                #step-2 .chip.selected { border: 1px solid #10b981; background: #f0fdf4; color: #047857; font-weight: 600; box-shadow: 0 2px 4px rgba(16,185,129,0.1); }

                /* Moderne invoervelden (mobielvriendelijk) */
                .custom-input-wrapper { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px 6px 6px 12px; margin-top: 16px; max-width: 100%; }
                .custom-input-wrapper input { flex: 1; min-width: 0; border: none; background: transparent; outline: none; font-size: 14px; color: #334155; font-family: inherit; }
                .custom-input-wrapper .btn-add { background: #1e293b; color: white; border: none; padding: 10px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; transition: background 0.2s; flex-shrink: 0; }
                .custom-input-wrapper .btn-add:hover { background: #334155; }
                
                .btn-more { background: none; border: none; color: #2563eb; font-weight: 600; cursor: pointer; padding: 0; font-size: 14px; margin-top: 8px; }
                .hidden { display: none !important; }

                /* Compactere marges op mobiel */
                @media (max-width: 600px) {
                    .module-container {
                        padding: 12px !important;
                    }
                    .wizard-step > div {
                        padding: 0 !important;
                    }
                    .info-block {
                        padding: 16px !important;
                    }
                }
            </style>

            <div class="progress-bar-container">
                <div class="progress-bar" id="redenen-progress-bar" style="width: 20%;"></div>
            </div>

            <!-- STAP 0: INTRODUCTIE -->
            <section class="wizard-step active" id="step-intro">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 32px;">
                        <span style="font-size: 14px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Module Introductie</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Motivatie & Verandering</h2>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">
                        <div class="stagger-1 info-block" style="border-left-color: #3b82f6;">
                            <span style="font-size: 24px; display: block; margin-bottom: 8px;">🔥</span>
                            <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                                <strong>Waarom veranderen?</strong> Voordat je actief aan de slag gaat met veranderen, is het belangrijk om voor jezelf helder te hebben waarom je dit wilt.
                            </p>
                        </div>
                        <div class="stagger-2 info-block" style="border-left-color: #f59e0b;">
                            <span style="font-size: 24px; display: block; margin-bottom: 8px;">⚖️</span>
                            <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                                <strong>De balans opmaken.</strong> In deze module wegen we de voor- en nadelen van het ${term.werkwoord} tegen elkaar af. Wat kost het je nu? En wat levert het op als je je gedrag aanpast?
                            </p>
                        </div>
                        <div class="stagger-3 info-block" style="border-left-color: #10b981;">
                            <span style="font-size: 24px; display: block; margin-bottom: 8px;">🧱</span>
                            <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                                <strong>Een sterk fundament.</strong> Door dit op een rijtje te zetten en je persoonlijke Top 3 te kiezen, creëer je een krachtig anker voor de moeilijke momenten.
                            </p>
                        </div>
                    </div>

                    <div class="stagger-4 button-group" style="display: flex; justify-content: flex-end;">
                        <button type="button" class="btn-primary next-step" data-next="step-1" style="background-color: #2563eb; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 15px;">Start de module &rarr;</button>
                    </div>
                </div>
            </section>

            <!-- STAP 1: NADELEN -->
            <section class="wizard-step" id="step-1">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 14px; font-weight: 600; color: #ef4444; text-transform: uppercase; letter-spacing: 0.5px;">Stap 1 van 3</span>
                        <h3 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Nadelen van ${term.werkwoord}</h3>
                        <p class="step-intro" style="font-size: 14px; color: #64748b; margin-top: 6px;">Welke nadelen ervaar je of verwacht je als je blijft ${term.werkwoord} zoals je nu doet?</p>
                    </div>

                    <!-- KORTE TERMIJN -->
                    <div class="card-section info-block stagger-1" style="border-left-color: #f59e0b;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
                            <span style="font-size: 24px;">⚡</span>
                            <h4 style="font-size: 18px; margin: 0; color: #1e293b;">Korte termijn</h4>
                        </div>
                        <p style="font-size: 15px; color: #64748b; margin-bottom: 16px;">Tijdens het ${term.werkwoord} of kort daarna</p>
                        
                        <div class="chip-group" id="chips-nadelen-kt">
                            ${renderReasonChips(redenen.nadelenKorteTermijn?.shown)}
                            <div class="custom-chips-container" id="custom-chips-nadelen-kt" style="display: contents;"></div>
                            <div class="more-chips hidden chip-group" id="more-nadelen-kt" style="margin-bottom: 0;">
                                ${renderReasonChips(redenen.nadelenKorteTermijn?.hidden)}
                            </div>
                        </div>

                        <button class="btn-more" id="btn-more-nadelen-kt">+ Meer voorbeelden...</button>

                        <div class="custom-input-wrapper">
                            <input type="text" id="input-nadelen-kt" placeholder="+ Voeg eigen nadeel toe...">
                            <button class="btn-add" data-input="input-nadelen-kt" data-target="nadelen-kt">Toevoegen</button>
                        </div>
                    </div>

                    <!-- LANGE TERMIJN -->
                    <div class="card-section info-block stagger-2" style="border-left-color: #ef4444;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
                            <span style="font-size: 24px;">🌪️</span>
                            <h4 style="font-size: 18px; margin: 0; color: #1e293b;">Lange termijn</h4>
                        </div>
                        <p style="font-size: 15px; color: #64748b; margin-bottom: 16px;">Als het gedrag de komende jaren niet verandert</p>
                        
                        <div class="chip-group" id="chips-nadelen-lt">
                            ${renderReasonChips(redenen.nadelenLangeTermijn?.shown)}
                            <div class="custom-chips-container" id="custom-chips-nadelen-lt" style="display: contents;"></div>
                            <div class="more-chips hidden chip-group" id="more-nadelen-lt" style="margin-bottom: 0;">
                                ${renderReasonChips(redenen.nadelenLangeTermijn?.hidden)}
                            </div>
                        </div>

                        <button class="btn-more" id="btn-more-nadelen-lt">+ Meer voorbeelden...</button>

                        <div class="custom-input-wrapper">
                            <input type="text" id="input-nadelen-lt" placeholder="+ Voeg eigen nadeel toe...">
                            <button class="btn-add" data-input="input-nadelen-lt" data-target="nadelen-lt">Toevoegen</button>
                        </div>
                    </div>

                    <div class="stagger-3 button-group" style="display: flex; justify-content: space-between; margin-top: 24px;">
                        <button class="btn-secondary prev-step" data-prev="step-intro" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Terug</button>
                        <button class="btn-primary next-step" id="btn-step1-next" data-next="step-2" disabled style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">Volgende: Voordelen &rarr;</button>
                    </div>
                </div>
            </section>

            <!-- STAP 2: VOORDELEN VAN STOPPEN / MINDEREN -->
            <section class="wizard-step" id="step-2">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 14px; font-weight: 600; color: #10b981; text-transform: uppercase; letter-spacing: 0.5px;">Stap 2 van 3</span>
                        <h3 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Voordelen van verandering</h3>
                        <p class="step-intro" style="font-size: 14px; color: #64748b; margin-top: 6px;">Welke voordelen levert het jou op als je stopt of mindert met ${term.werkwoord}?</p>
                    </div>

                    <!-- KORTE TERMIJN -->
                    <div class="card-section info-block stagger-1" style="border-left-color: #10b981;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
                            <span style="font-size: 24px;">🌱</span>
                            <h4 style="font-size: 18px; margin: 0; color: #1e293b;">Korte termijn</h4>
                        </div>
                        <p style="font-size: 15px; color: #64748b; margin-bottom: 16px;">Binnen een paar dagen tot weken</p>
                        
                        <div class="chip-group" id="chips-voordelen-kt">
                            ${renderReasonChips(redenen.voordelenKorteTermijn?.shown)}
                            <div class="custom-chips-container" id="custom-chips-voordelen-kt" style="display: contents;"></div>
                            <div class="more-chips hidden chip-group" id="more-voordelen-kt" style="margin-bottom: 0;">
                                ${renderReasonChips(redenen.voordelenKorteTermijn?.hidden)}
                            </div>
                        </div>

                        <button class="btn-more" id="btn-more-voordelen-kt">+ Meer voorbeelden...</button>

                        <div class="custom-input-wrapper">
                            <input type="text" id="input-voordelen-kt" placeholder="+ Voeg eigen voordeel toe...">
                            <button class="btn-add" data-input="input-voordelen-kt" data-target="voordelen-kt">Toevoegen</button>
                        </div>
                    </div>

                    <!-- LANGE TERMIJN -->
                    <div class="card-section info-block stagger-2" style="border-left-color: #3b82f6;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
                            <span style="font-size: 24px;">🌳</span>
                            <h4 style="font-size: 18px; margin: 0; color: #1e293b;">Lange termijn</h4>
                        </div>
                        <p style="font-size: 15px; color: #64748b; margin-bottom: 16px;">Binnen enkele maanden tot jaren</p>
                        
                        <div class="chip-group" id="chips-voordelen-lt">
                            ${renderReasonChips(redenen.voordelenLangeTermijn?.shown)}
                            <div class="custom-chips-container" id="custom-chips-voordelen-lt" style="display: contents;"></div>
                            <div class="more-chips hidden chip-group" id="more-voordelen-lt" style="margin-bottom: 0;">
                                ${renderReasonChips(redenen.voordelenLangeTermijn?.hidden)}
                            </div>
                        </div>

                        <button class="btn-more" id="btn-more-voordelen-lt">+ Meer voorbeelden...</button>

                        <div class="custom-input-wrapper">
                            <input type="text" id="input-voordelen-lt" placeholder="+ Voeg eigen voordeel toe...">
                            <button class="btn-add" data-input="input-voordelen-lt" data-target="voordelen-lt">Toevoegen</button>
                        </div>
                    </div>

                    <div class="stagger-3 button-group" style="display: flex; justify-content: space-between; margin-top: 24px;">
                        <button class="btn-secondary prev-step" data-prev="step-1" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                        <button class="btn-primary next-step" id="btn-step2-next" data-next="step-3" disabled style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">Volgende: Top 3 &rarr;</button>
                    </div>
                </div>
            </section>

            <!-- STAP 3: TOP 3 OVERZICHT -->
            <section class="wizard-step" id="step-3">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 14px; font-weight: 600; color: #8b5cf6; text-transform: uppercase; letter-spacing: 0.5px;">Stap 3 van 3</span>
                        <h3 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Jouw persoonlijke Top 3</h3>
                    </div>

                    <div class="card-section info-block stagger-1" id="step3-selection-area" style="border-left-color: #8b5cf6;">
                        <!-- Dynamisch opgebouwd -->
                    </div>

                    <div class="card-section info-block stagger-2" style="border-left-color: #eab308;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
                            <span style="font-size: 24px;">🏆</span>
                            <h4 style="font-size: 18px; margin: 0; color: #1e293b;">Jouw Top 3 Motivaties</h4>
                        </div>
                        <p class="sub-text" style="font-size: 15px; color: #64748b; margin-bottom: 16px;">Sleep de kaarten om de volgorde aan te passen.</p>
                        
                        <ul class="top3-list" id="top3-draggable-list">
                            <li class="top3-slot" id="top-rank-1" draggable="true" data-index="0">
                                <span class="rank-num">1</span>
                                <span class="slot-text empty">Klik op je belangrijkste reden...</span>
                                <span class="drag-handle">⋮⋮</span>
                            </li>
                            <li class="top3-slot" id="top-rank-2" draggable="true" data-index="1">
                                <span class="rank-num">2</span>
                                <span class="slot-text empty">Klik op je 2e reden...</span>
                                <span class="drag-handle">⋮⋮</span>
                            </li>
                            <li class="top3-slot" id="top-rank-3" draggable="true" data-index="2">
                                <span class="rank-num">3</span>
                                <span class="slot-text empty">Klik op je 3e reden...</span>
                                <span class="drag-handle">⋮⋮</span>
                            </li>
                        </ul>
                    </div>

                    <div class="stagger-3 button-group" style="display: flex; justify-content: space-between; margin-top: 24px;">
                        <button class="btn-secondary prev-step" data-prev="step-2" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                        <button class="btn-primary" id="btn-finish-wizard" style="background-color: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;" disabled>Opslaan & Afronden 🎉</button>
                    </div>
                </div>
            </section>

            <!-- STAP 4: AFRONDING & SUCCES -->
            <section class="wizard-step" id="step-4">
                <div style="max-width: 600px; margin: 40px auto; padding: 32px; text-align: center; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                    <div style="font-size: 48px; margin-bottom: 16px;">🔥</div>
                    <h2 style="font-size: 24px; color: #1e293b; margin-bottom: 12px;">Module Afgerond!</h2>
                    <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 32px;">
                        Geweldig! Je hebt je belangrijkste redenen om te veranderen op een rijtje gezet. Jouw persoonlijke Top 3 is opgeslagen in je profiel. Dit fundament gaat je enorm helpen op de momenten dat je het lastig hebt.
                    </p>
                    <button type="button" id="btn-back-dashboard" class="btn-primary" style="background-color: #2563eb; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 15px;">
                        Terug naar overzicht
                    </button>
                </div>
            </section>
        </div>
    `;

    const appContainer = document.getElementById('app-content') || document.getElementById('app');
    if (appContainer) {
        appContainer.innerHTML = htmlContent;
    }

    // --- LAAD OPGESLAGEN DATA IN (PER TRAJECT) EN VERPLAATS EXTRA ITEMS ---
    const actiefTraject = localStorage.getItem('actieveVerslaving') || 'alcohol';
    const savedDataStr = localStorage.getItem(`arminius_module_redenen_data_${actiefTraject}`);
    
    if (savedDataStr) {
        try {
            const savedData = JSON.parse(savedDataStr);
            
            const restoreChips = (vals, containerId, customContainerId) => {
                if (!Array.isArray(vals)) return;
                const mainContainer = document.getElementById(containerId);
                const customContainer = document.getElementById(customContainerId);
                const moreContainer = mainContainer ? mainContainer.parentElement.querySelector('.more-chips') : null;

                vals.forEach(val => {
                    const safeVal = val.replace(/"/g, '\\"');
                    const existing = document.querySelector(`#${containerId} .chip[data-val="${safeVal}"]`);
                    
                    if (existing) {
                        existing.classList.add('selected');
                        if (moreContainer && moreContainer.contains(existing)) {
                            mainContainer.insertBefore(existing, customContainer);
                            existing.dataset.fromMore = 'true';
                        }
                    } else {
                        if (customContainer) {
                            const newChip = document.createElement('button');
                            newChip.className = 'chip selected';
                            newChip.setAttribute('data-val', val);
                            newChip.innerHTML = `✏️ ${val}`;
                            customContainer.appendChild(newChip);
                        }
                    }
                });

                if (moreContainer && moreContainer.children.length === 0) {
                    const btnMore = mainContainer.parentElement.querySelector('.btn-more');
                    if (btnMore) btnMore.style.display = 'none';
                }
            };

            restoreChips(savedData.nadelenKT, 'chips-nadelen-kt', 'custom-chips-nadelen-kt');
            restoreChips(savedData.nadelenLT, 'chips-nadelen-lt', 'custom-chips-nadelen-lt');
            restoreChips(savedData.voordelenKT, 'chips-voordelen-kt', 'custom-chips-voordelen-kt');
            restoreChips(savedData.voordelenLT, 'chips-voordelen-lt', 'custom-chips-voordelen-lt');

            if (savedData.top3 && Array.isArray(savedData.top3)) {
                selectedTop3 = savedData.top3;
            }
        } catch(e) {
            console.error("Fout bij ophalen opgeslagen redenen:", e);
        }
    }

    validateStepSelections();
    setupDragAndDrop();

    return htmlContent;
}

document.addEventListener('click', (e) => {
    
    // Chips selecteren/deselecteren EN dynamisch verplaatsen
    const chip = e.target.closest('.chip');
    if (chip && !chip.classList.contains('top3-source-chip')) {
        chip.classList.toggle('selected');
        
        const mainContainer = chip.closest('.chip-group')?.parentElement;
        const moreContainer = mainContainer ? mainContainer.querySelector('.more-chips') : null;
        const customContainer = mainContainer ? mainContainer.querySelector('.custom-chips-container') : null;
        const btnMore = mainContainer ? mainContainer.querySelector('.btn-more') : null;

        if (chip.classList.contains('selected') && moreContainer && moreContainer.contains(chip)) {
            chip.closest('.chip-group').insertBefore(chip, customContainer);
            chip.dataset.fromMore = 'true';
        } else if (!chip.classList.contains('selected') && chip.dataset.fromMore === 'true') {
            if (moreContainer) {
                moreContainer.appendChild(chip);
            }
        }

        if (moreContainer && btnMore) {
            btnMore.style.display = moreContainer.children.length === 0 ? 'none' : 'inline-block';
        }

        validateStepSelections();
    }

    if (e.target.matches('.next-step') && !e.target.disabled) {
        showStep(e.target.getAttribute('data-next'));
    }
    if (e.target.matches('.prev-step')) {
        showStep(e.target.getAttribute('data-prev'));
    }

    if (e.target.classList.contains('btn-more')) {
        const targetMoreId = e.target.id.replace('btn-more-', 'more-');
        const moreContainer = document.getElementById(targetMoreId);
        if (moreContainer) {
            moreContainer.classList.toggle('hidden');
            e.target.textContent = moreContainer.classList.contains('hidden') 
                ? '+ Meer voorbeelden...' 
                : '- Minder voorbeelden';
        }
    }

    if (e.target.classList.contains('btn-add')) {
        const inputId = e.target.getAttribute('data-input');
        const targetKey = e.target.getAttribute('data-target');
        const inputEl = document.getElementById(inputId);
        const container = document.getElementById(`custom-chips-${targetKey}`);

        if (inputEl && container && inputEl.value.trim() !== '') {
            const val = inputEl.value.trim();
            const newChip = document.createElement('button');
            newChip.className = 'chip selected';
            newChip.setAttribute('data-val', val);
            newChip.innerHTML = `✏️ ${val}`;
            container.appendChild(newChip);
            inputEl.value = '';

            validateStepSelections();
        }
    }

    if (e.target.id === 'btn-finish-wizard' && !e.target.disabled) {
        const actiefTraject = localStorage.getItem('actieveVerslaving') || 'alcohol';
        const formData = {
            nadelenKT: Array.from(document.querySelectorAll('#chips-nadelen-kt .chip.selected')).map(c => c.getAttribute('data-val')),
            nadelenLT: Array.from(document.querySelectorAll('#chips-nadelen-lt .chip.selected')).map(c => c.getAttribute('data-val')),
            voordelenKT: Array.from(document.querySelectorAll('#chips-voordelen-kt .chip.selected')).map(c => c.getAttribute('data-val')),
            voordelenLT: Array.from(document.querySelectorAll('#chips-voordelen-lt .chip.selected')).map(c => c.getAttribute('data-val')),
            top3: selectedTop3
        };
        localStorage.setItem(`arminius_module_redenen_data_${actiefTraject}`, JSON.stringify(formData));

        triggerConfetti();
        showStep('step-4'); 
    }

    if (e.target.id === 'btn-back-dashboard') {
        if (onCompleteCallback) {
            onCompleteCallback(selectedTop3);
        }
    }
});

function validateStepSelections() {
    const selectedNadelen = document.querySelectorAll('#step-1 .chip.selected');
    const step1NextBtn = document.getElementById('btn-step1-next');
    if (step1NextBtn) step1NextBtn.disabled = selectedNadelen.length === 0;

    const selectedVoordelen = document.querySelectorAll('#step-2 .chip.selected');
    const step2NextBtn = document.getElementById('btn-step2-next');
    if (step2NextBtn) step2NextBtn.disabled = selectedVoordelen.length === 0;
}

export function showStep(stepId) {
    window.scrollTo(0, 0);

    const steps = document.querySelectorAll('.wizard-step');
    if (steps.length === 0) return;

    steps.forEach(step => step.classList.remove('active'));
    
    const targetStep = document.getElementById(stepId);
    if (targetStep) targetStep.classList.add('active');

    const progressBar = document.getElementById('redenen-progress-bar');
    if (progressBar) {
        if (stepId === 'step-intro') progressBar.style.width = '20%';
        else if (stepId === 'step-1') progressBar.style.width = '45%';
        else if (stepId === 'step-2') progressBar.style.width = '70%';
        else if (stepId === 'step-3') progressBar.style.width = '100%';
        else if (stepId === 'step-4') {
            document.querySelector('.progress-bar-container').style.display = 'none';
        }
    }

    if (stepId === 'step-3') {
        buildStep3Items();
    }
}

function buildStep3Items() {
    const cardSection = document.getElementById('step3-selection-area');
    if (!cardSection) return;

    const term = getActiveData().terminologie; 

    cardSection.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
            <span style="font-size: 24px;">⚖️</span>
            <h4 style="font-size: 18px; margin: 0; color: #1e293b;">Geselecteerde redenen</h4>
        </div>
        <p class="sub-text" style="font-size: 15px; color: #64748b; margin-bottom: 16px;">Klik op een reden om hem toe te voegen aan je Top 3. Klik nogmaals om te verwijderen.</p>
        
        <div class="reasons-columns-grid">
            <div class="reason-col disadvantages-col">
                <h5 style="margin-bottom: 12px; color: #b91c1c;">⚠️ Nadelen van ${term.middel}</h5>
                <div class="chip-group-col" id="top3-source-nadelen"></div>
            </div>
            <div class="reason-col advantages-col">
                <h5 style="margin-bottom: 12px; color: #047857;">✨ Voordelen van verandering</h5>
                <div class="chip-group-col" id="top3-source-voordelen"></div>
            </div>
        </div>
    `;

    const containerNadelen = document.getElementById('top3-source-nadelen');
    const containerVoordelen = document.getElementById('top3-source-voordelen');

    let currentAvailableIds = [];

    document.querySelectorAll('#step-1 .chip.selected').forEach((chip) => {
        const text = chip.getAttribute('data-val') || chip.innerText.trim();
        const safeId = 'nadeel-' + text.replace(/[^a-zA-Z0-9]/g, '');
        const itemObj = { id: safeId, text: text, type: 'Nadeel', labelHTML: chip.innerHTML };
        
        currentAvailableIds.push(safeId);
        containerNadelen.appendChild(createSourceChipElement(itemObj));
    });

    document.querySelectorAll('#step-2 .chip.selected').forEach((chip) => {
        const text = chip.getAttribute('data-val') || chip.innerText.trim();
        const safeId = 'voordeel-' + text.replace(/[^a-zA-Z0-9]/g, '');
        const itemObj = { id: safeId, text: text, type: 'Voordeel', labelHTML: chip.innerHTML };
        
        currentAvailableIds.push(safeId);
        containerVoordelen.appendChild(createSourceChipElement(itemObj));
    });

    selectedTop3 = selectedTop3.filter(item => item && currentAvailableIds.includes(item.id));

    updateTop3UI();
}

function createSourceChipElement(itemObj) {
    const card = document.createElement('div');
    card.className = 'top3-source-chip';
    card.setAttribute('data-id', itemObj.id);
    card.setAttribute('data-val', itemObj.text);
    card.setAttribute('data-type', itemObj.type);
    card.innerHTML = `<span>${itemObj.labelHTML}</span> <span class="badge-rank"></span>`;

    card.addEventListener('click', () => {
        const index = selectedTop3.findIndex(i => i && i.id === itemObj.id);
        if (index > -1) {
            selectedTop3.splice(index, 1);
        } else if (selectedTop3.length < 3) {
            selectedTop3.push(itemObj);
        }
        updateTop3UI();
    });

    return card;
}

function updateTop3UI() {
    const sourceChips = document.querySelectorAll('.top3-source-chip');
    sourceChips.forEach(chip => {
        const id = chip.getAttribute('data-id');
        const rankIndex = selectedTop3.findIndex(i => i && i.id === id);
        const badge = chip.querySelector('.badge-rank');

        if (rankIndex > -1) {
            chip.classList.add('in-top3');
            badge.textContent = `#${rankIndex + 1}`;
        } else {
            chip.classList.remove('in-top3');
            badge.textContent = '';
        }
    });

    const top3List = document.getElementById('top3-draggable-list');
    if (top3List) {
        top3List.style.maxWidth = '600px';
        top3List.style.margin = '0 auto';
    }

    for (let i = 1; i <= 3; i++) {
        const slotEl = document.getElementById(`top-rank-${i}`);
        if (!slotEl) continue;

        const textEl = slotEl.querySelector('.slot-text');
        const item = selectedTop3[i - 1];

        if (item) {
            textEl.innerHTML = `<strong>${item.type}:</strong> ${item.labelHTML}`;
            textEl.classList.remove('empty');
            slotEl.classList.add('filled');

            const isNadeel = item.type === 'Nadeel';
            slotEl.style.backgroundColor = isNadeel ? '#fef2f2' : '#f0fdf4';
            slotEl.style.borderColor = isNadeel ? '#f87171' : '#4ade80';
            slotEl.style.color = '#1e293b';
        } else {
            textEl.textContent = i === 1 ? 'Klik op je belangrijkste reden...' : (i === 2 ? 'Klik op je 2e reden...' : 'Klik op je 3e reden...');
            textEl.classList.add('empty');
            slotEl.classList.remove('filled');
            
            slotEl.style.backgroundColor = '#f8fafc';
            slotEl.style.borderColor = '#cbd5e1';
        }
    }

    const finishBtn = document.getElementById('btn-finish-wizard');
    const totalAvailable = sourceChips.length;
    const targetCount = Math.min(3, totalAvailable);

    if (finishBtn) {
        finishBtn.disabled = totalAvailable === 0 || selectedTop3.length < targetCount;
    }
}

function setupDragAndDrop() {
    const slots = document.querySelectorAll('.top3-slot');

    slots.forEach(slot => {
        slot.addEventListener('dragstart', (e) => {
            const index = parseInt(slot.getAttribute('data-index'));
            if (!selectedTop3[index]) {
                e.preventDefault();
                return;
            }
            draggedIndex = index;
            slot.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        slot.addEventListener('dragend', () => {
            slot.classList.remove('dragging');
            slots.forEach(s => s.classList.remove('drag-over'));
        });

        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            slot.classList.add('drag-over');
        });

        slot.addEventListener('dragleave', () => {
            slot.classList.remove('drag-over');
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.classList.remove('drag-over');
            
            const targetIndex = parseInt(slot.getAttribute('data-index'));

            if (draggedIndex !== null && draggedIndex !== targetIndex && selectedTop3[draggedIndex]) {
                const temp = selectedTop3[draggedIndex];
                selectedTop3[draggedIndex] = selectedTop3[targetIndex];
                selectedTop3[targetIndex] = temp;

                updateTop3UI();
            }
            draggedIndex = null;
        });
    });
}