// src/components/modules/doelen-stellen/doelen-stellen.js
import { getActiveData } from '../../../data/contentManager.js';

let baselineDaysVal = '';
let baselineAmountVal = '';
let selectedGoalType = null;
let minderingItems = [];
let selectedDrinkDays = ['vrijdag', 'zaterdag'];
let activeAccordionIndex = 0;

let startDateVal = new Date().toISOString().split('T')[0];
let endDateVal = '';
let reminderEnabled = false;

function loadCSS() {
    const cssUrl = new URL('./doelen-stellen.css', import.meta.url).href;
    if (!document.querySelector(`link[href="${cssUrl}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssUrl;
        document.head.appendChild(link);
    }
}

const fontStyle = "font-family: 'Nunito', sans-serif;";

export function renderDoelenModule(onComplete) {
    loadCSS();
    
    const actieveData = getActiveData();
    const term = actieveData.terminologie;

    let baselinePlaceholder = "Bijv. aantal of bedrag";
    let werkwoordVorm = "gebruik"; 
    
    switch (term.middel.toLowerCase()) {
        case 'alcohol': 
            baselinePlaceholder = "Bijv. 6 glazen of 2 flessen"; 
            werkwoordVorm = "drink";
            break;
        case 'cannabis': 
            baselinePlaceholder = "Bijv. 2 joints of 1 gram"; 
            werkwoordVorm = "blow";
            break;
        case 'cocaïne':
        case 'cocaine': 
            baselinePlaceholder = "Bijv. 1 gram of 4 puntjes"; 
            werkwoordVorm = "gebruik";
            break;
        case 'gokken': 
            baselinePlaceholder = "Bijv. €50 inleg of 3 uur speeltijd"; 
            werkwoordVorm = "gok";
            break;
    }

    const actiefTraject = localStorage.getItem('actieveVerslaving') || 'alcohol';
    const savedGoalStr = localStorage.getItem(`arminius_user_goal_${actiefTraject}`);
    
    if (savedGoalStr) {
        try {
            const saved = JSON.parse(savedGoalStr);
            baselineDaysVal = saved.baselineDays || '';
            baselineAmountVal = saved.baselineAmount || '';
            selectedGoalType = saved.type || null;
            startDateVal = saved.startDate || new Date().toISOString().split('T')[0];
            endDateVal = saved.endDate || '';
            minderingItems = saved.minderingItems || [];
            selectedDrinkDays = saved.drinkDays || ['vrijdag', 'zaterdag'];
            reminderEnabled = saved.reminderEnabled || false;
        } catch(e) {
            console.error("Fout bij laden doel:", e);
        }
    } else {
        baselineDaysVal = '';
        baselineAmountVal = '';
        selectedGoalType = null;
        minderingItems = [];
        selectedDrinkDays = ['vrijdag', 'zaterdag'];
        activeAccordionIndex = 0;
        startDateVal = new Date().toISOString().split('T')[0];
        endDateVal = '';
        reminderEnabled = false;
    }

    const htmlContent = `
        <div class="module-container" style="${fontStyle}">
            <div class="progress-bar-container">
                <div class="progress-bar" id="goal-progress-bar" style="width: 20%;"></div>
            </div>

            <style>
                @keyframes slideUpFade { 0% { opacity: 0; transform: translateY(15px); } 100% { opacity: 1; transform: translateY(0); } }
                .stagger-1 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.1s; }
                .stagger-2 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.2s; }
                .stagger-3 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.3s; }
                .stagger-4 { animation: slideUpFade 0.4s ease forwards; opacity: 0; animation-delay: 0.4s; }
                
                .info-block { background: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid #3b82f6; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                
                /* Verbeterde Formulier Inputs */
                .form-input { width: 100%; padding: 14px 16px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 15px; color: #1e293b; background-color: #f8fafc; transition: all 0.2s ease; box-sizing: border-box; }
                .form-input:focus { outline: none; border-color: #3b82f6; background-color: #ffffff; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
                
                /* Interactieve Goal Cards met Nudging (Stoppen = Groen, Minderen = Oranje/Geel) */
                .goal-options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
                .goal-card { background: #ffffff; border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: left; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
                .goal-card:hover { border-color: #cbd5e1; transform: translateY(-2px); }
                
                .goal-card.selected[data-goal="stoppen"] { border-color: #10b981; background: #f0fdf4; box-shadow: 0 0 0 3px rgba(16,185,129,0.2); transform: scale(1.02); }
                .goal-card.selected[data-goal="minderen"] { border-color: #f59e0b; background: #fffbeb; box-shadow: 0 0 0 3px rgba(245,158,11,0.2); transform: scale(1.02); }
                
                .goal-icon { font-size: 32px; margin-bottom: 12px; }
                .goal-card h4 { margin: 0 0 8px 0; font-size: 16px; color: #1e293b; }
                .goal-card p { margin: 0; font-size: 15px; color: #475569; line-height: 1.5; }
                
                @media(max-width: 600px) { .goal-options-grid { grid-template-columns: 1fr; } }
            </style>

            <!-- STAP 0: ZACHTE INTRODUCTIE -->
            <section class="wizard-step active" id="step-intro">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 32px;">
                        <span style="font-size: 14px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Module Introductie</span>
                        <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Doelen stellen</h2>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">
                        <div class="stagger-1 info-block" style="border-left-color: #3b82f6;">
                            <span style="font-size: 24px; display: block; margin-bottom: 8px;">🎯</span>
                            <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                                <strong>Stilstaan bij wat reëel is.</strong> Een goed doel gaat niet over jezelf direct enorme beperkingen opleggen. Het gaat erom dat je kiest voor een stap waar je zelf achter staat en die haalbaar is.
                            </p>
                        </div>
                        <div class="stagger-2 info-block" style="border-left-color: #f59e0b;">
                            <span style="font-size: 24px; display: block; margin-bottom: 8px;">⚖️</span>
                            <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                                <strong>De Nulmeting.</strong> Om je succes te kunnen meten, maken we eerst de balans op. Hoe ziet jouw gebruik er nu uit in een gemiddelde week?
                            </p>
                        </div>
                        <div class="stagger-3 info-block" style="border-left-color: #10b981;">
                            <span style="font-size: 24px; display: block; margin-bottom: 8px;">🗺️</span>
                            <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                                <strong>Jouw nieuwe koers.</strong> Vervolgens bepalen we rustig je nieuwe koers en leggen we je doelen vast.
                            </p>
                        </div>
                    </div>

                    <div class="stagger-4" style="display: flex; justify-content: flex-end;">
                        <button type="button" class="btn-primary next-step" id="btn-intro-next" data-next="step-baseline" style="background-color: #2563eb; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 15px;">Start de meting &rarr;</button>
                    </div>
                </div>
            </section>

            <!-- STAP 1: DE NULMETING (BASELINE) -->
            <section class="wizard-step" id="step-baseline">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 14px; font-weight: 600; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.5px;">Stap 1 van 4</span>
                        <h3 style="font-size: 24px; color: #1e293b; margin-top: 4px;">De Nulmeting</h3>
                    </div>

                    <div class="info-block stagger-1" style="border-left-color: #f59e0b;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                            <span style="font-size: 24px;">📊</span>
                            <h4 style="font-size: 18px; margin: 0; color: #1e293b;">Waar sta je nu?</h4>
                        </div>
                        
                        <p style="font-size: 15px; color: #475569; margin-bottom: 24px; line-height: 1.6;">
                            Om je succes te kunnen meten, moeten we je huidige uitgangspositie vastleggen. Wees hierin eerlijk naar jezelf. Hoe ziet het gebruik er de afgelopen tijd uit?
                        </p>

                        <div class="form-group" style="margin-bottom: 20px;">
                            <label for="baseline-days" style="display: block; font-weight: 700; margin-bottom: 8px; font-size: 14px; color: #1e293b;">Hoeveel dagen in een gemiddelde week ${werkwoordVorm} je momenteel?</label>
                            <input type="number" id="baseline-days" class="form-input" min="0" max="7" placeholder="0 t/m 7 dagen" value="${baselineDaysVal}" style="${fontStyle}">
                        </div>

                        <div class="form-group">
                            <label for="baseline-amount" style="display: block; font-weight: 700; margin-bottom: 8px; font-size: 14px; color: #1e293b;">Wat is de gemiddelde hoeveelheid op zo'n dag?</label>
                            <input type="text" id="baseline-amount" class="form-input" placeholder="${baselinePlaceholder}" value="${baselineAmountVal}" style="${fontStyle}">
                        </div>
                    </div>

                    <div class="stagger-2 button-group" style="display: flex; justify-content: space-between; margin-top: 24px;">
                        <button type="button" class="btn-secondary prev-step" data-prev="step-intro" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Terug</button>
                        <button type="button" class="btn-primary next-step" id="btn-baseline-next" data-next="step-1" disabled style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">Volgende: Reflectie &rarr;</button>
                    </div>
                </div>
            </section>

            <!-- STAP 2: KORTE REFLECTIE -->
            <section class="wizard-step" id="step-1">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 14px; font-weight: 600; color: #8b5cf6; text-transform: uppercase; letter-spacing: 0.5px;">Stap 2 van 4</span>
                        <h3 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Wat is haalbaar?</h3>
                    </div>

                    <div class="info-block stagger-1" style="border-left-color: #8b5cf6;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                            <span style="font-size: 24px;">🤔</span>
                            <h4 style="font-size: 18px; margin: 0; color: #1e293b;">De eerste stap</h4>
                        </div>
                        <p style="font-size: 15px; color: #475569; margin-bottom: 20px; line-height: 1.6;">
                            Verandering kost energie. Als je te hard van stapel loopt, is de kans op een terugval groter. Wat zou de komende weken een waardevolle en haalbare verandering zijn?
                        </p>
                        <div style="background: #fef9c3; border: 1px solid #fde047; border-left: 4px solid #eab308; padding: 16px; border-radius: 8px; font-size: 14px; color: #854d0e; line-height: 1.6;">
                            <strong>💡 Tip:</strong> Kies liever een iets kleiner doel dat je succesvol volhoudt, dan een te groot doel dat direct heel zwaar voelt.
                        </div>
                    </div>

                    <div class="stagger-2 button-group" style="display: flex; justify-content: space-between; margin-top: 24px;">
                        <button type="button" class="btn-secondary prev-step" data-prev="step-baseline" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                        <button type="button" class="btn-primary next-step" data-next="step-2" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">Naar de hoofdkeuze &rarr;</button>
                    </div>
                </div>
            </section>

            <!-- STAP 3: HOOFDKEUZE -->
            <section class="wizard-step" id="step-2">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 24px;">
                        <span class="step-indicator" style="font-size: 14px; font-weight: 600; color: #ec4899; text-transform: uppercase; letter-spacing: 0.5px;">Stap 3 van 4</span>
                        <h3 style="font-size: 24px; color: #1e293b; margin-top: 4px;">Jouw richting kiezen</h3>
                        <p style="font-size: 15px; color: #64748b; margin-top: 8px;">Wat wordt je doel met betrekking tot ${term.middel}?</p>
                    </div>

                    <div class="stagger-1 goal-options-grid">
                        <button type="button" class="goal-card ${selectedGoalType === 'stoppen' ? 'selected' : ''}" data-goal="stoppen">
                            <div class="goal-icon">🛑</div>
                            <h4>Ik wil (tijdelijk) stoppen</h4>
                            <p>Ik kies ervoor om een periode of permanent helemaal niet meer te ${term.werkwoord}.</p>
                        </button>

                        <button type="button" class="goal-card ${selectedGoalType === 'minderen' ? 'selected' : ''}" data-goal="minderen">
                            <div class="goal-icon">📉</div>
                            <h4>Ik wil minderen</h4>
                            <p>Ik wil minder gaan ${term.werkwoord} en duidelijke grenzen instellen voor mijn gedrag.</p>
                        </button>
                    </div>

                    <div class="stagger-2 button-group" style="display: flex; justify-content: space-between; margin-top: 24px;">
                        <button type="button" class="btn-secondary prev-step" data-prev="step-1" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                        <button type="button" class="btn-primary next-step" id="btn-goal-step1-next" data-next="step-3" ${!selectedGoalType ? 'disabled' : ''} style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">Verder naar plan &rarr;</button>
                    </div>
                </div>
            </section>

            <!-- STAP 4: INHOUD / PLAN & HERINNERING -->
            <section class="wizard-step" id="step-3">
                <div style="max-width: 700px; margin: 0 auto; padding: 20px; font-family: inherit;">
                    <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <span class="step-indicator" style="font-size: 14px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Stap 4 van 4</span>
                            <h3 id="step2-main-title" style="font-size: 24px; color: #1e293b; margin-top: 4px;">Jouw Plan & Herinnering</h3>
                        </div>
                        <button type="button" class="info-btn-blue hidden" id="btn-info-withdrawal" title="Informatie over veilig stoppen" style="background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; border-radius: 50%; width: 32px; height: 32px; font-weight: bold; cursor: pointer;">i</button>
                    </div>

                    <div class="info-box hidden" id="withdrawal-info-box" style="background: #fef2f2; border: 1px solid #fca5a5; border-left: 4px solid #ef4444; padding: 16px; border-radius: 8px; margin-bottom: 20px; color: #991b1b; font-size: 14px;">
                        <p style="margin: 0 0 8px 0;"><strong>⚠️ Belangrijke veiligheidsinformatie:</strong></p>
                        <p style="margin: 0;">Als je meerdere keren per week veel gebruikt of drinkt, kan het gevaarlijk zijn om in één keer abrupt te stoppen i.v.m. ontwenningsverschijnselen. Vraag bij twijfel je behandelaar of huisarts om advies.</p>
                    </div>

                    <div id="goal-dynamic-form">
                        <!-- Dynamische inhoud -->
                    </div>

                    <div class="button-group" style="display: flex; justify-content: space-between; margin-top: 24px;">
                        <button type="button" class="btn-secondary prev-step" data-prev="step-2" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">&larr; Vorige</button>
                        <button type="button" class="btn-primary" id="btn-finish-goal-wizard" disabled style="background-color: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">Opslaan & Afronden 🎉</button>
                    </div>
                </div>
            </section>

            <!-- STAP 5: AFRONDING & SUCCES (Nieuwe Afsluitende Pagina) -->
            <section class="wizard-step" id="step-4">
                <div style="max-width: 600px; margin: 40px auto; padding: 32px; text-align: center; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                    <div style="font-size: 64px; margin-bottom: 16px; display: inline-block;">🎯</div>
                    <h2 style="font-size: 24px; color: #1e293b; margin-bottom: 12px;">Doel ingesteld!</h2>
                    <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 32px;">
                        Mooi dat je dit heldere doel hebt geformuleerd voor ${term.middel}. Je hebt nu een concrete uitgangspositie én een helder plan. Veel succes!
                    </p>
                    <button type="button" id="btn-back-dashboard" style="background-color: #2563eb; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 15px; transition: background 0.2s;">
                        Naar volgende module &rarr;
                    </button>
                </div>
            </section>
        </div>
    `;

    const container = document.getElementById('app-content') || document.getElementById('app');
    if (container) {
        container.innerHTML = htmlContent;
    }

    setupGoalListeners(onComplete, term);
    validateBaseline(); 
    return htmlContent;
}

function getDefaultValuesForDrink(drankType) {
    switch (drankType) {
        case 'bier': return { verpakking: 'glas', maat: 0.3, percentage: 5, aantalPerDag: '2', dagenPerWeek: '2', aantalPerWeek: '4' };
        case 'wijn': return { verpakking: 'glas', maat: 0.15, percentage: 12, aantalPerDag: '2', dagenPerWeek: '2', aantalPerWeek: '4' };
        case 'sterke drank': return { verpakking: 'glas', maat: 0.35, percentage: 35, aantalPerDag: '1', dagenPerWeek: '2', aantalPerWeek: '2' };
        case 'mixdrank': return { verpakking: 'blik', maat: 0.25, percentage: 10, aantalPerDag: '1', dagenPerWeek: '2', aantalPerWeek: '2' };
        default: return { verpakking: '', maat: '', percentage: '', aantalPerDag: '', dagenPerWeek: '', aantalPerWeek: '' };
    }
}

function validateBaseline() {
    const days = document.getElementById('baseline-days')?.value;
    const amount = document.getElementById('baseline-amount')?.value;
    const btn = document.getElementById('btn-baseline-next');
    
    if (btn) {
        const isValid = days !== '' && days >= 0 && days <= 7 && amount && amount.trim() !== '';
        btn.disabled = !isValid;
        btn.style.opacity = isValid ? '1' : '0.5';
    }
}

function setupGoalListeners(onComplete, term) {
    const container = document.getElementById('app-content') || document.getElementById('app');
    if (!container) return;

    let savedGoalData = null;

    container.onclick = (e) => {
        const removeBtn = e.target.closest('.btn-remove-mindering');
        if (removeBtn) {
            e.stopPropagation();
            const index = parseInt(removeBtn.getAttribute('data-index'), 10);
            minderingItems.splice(index, 1);
            if (activeAccordionIndex >= minderingItems.length) {
                activeAccordionIndex = minderingItems.length - 1;
            }
            renderMinderingRows(term);
            validateStep3(term);
            return;
        }

        const accordionHeader = e.target.closest('.accordion-header');
        if (accordionHeader) {
            const index = parseInt(accordionHeader.getAttribute('data-index'), 10);
            activeAccordionIndex = activeAccordionIndex === index ? -1 : index;
            renderMinderingRows(term);
            return;
        }

        const infoBtn = e.target.closest('#btn-info-withdrawal');
        if (infoBtn) {
            const infoBox = document.getElementById('withdrawal-info-box');
            if (infoBox) infoBox.classList.toggle('hidden');
            return;
        }

        const goalCard = e.target.closest('.goal-card');
        if (goalCard) {
            container.querySelectorAll('.goal-card').forEach(card => card.classList.remove('selected'));
            goalCard.classList.add('selected');
            selectedGoalType = goalCard.getAttribute('data-goal');

            const nextBtn = document.getElementById('btn-goal-step1-next');
            if (nextBtn) {
                nextBtn.disabled = false;
                nextBtn.style.opacity = '1';
            }
        }

        if (e.target.id === 'btn-intro-next') {
            showGoalStep('step-baseline');
        }

        if (e.target.matches('.next-step') && !e.target.disabled) {
            const nextStepId = e.target.getAttribute('data-next');
            if (nextStepId === 'step-1') {
                baselineDaysVal = document.getElementById('baseline-days').value;
                baselineAmountVal = document.getElementById('baseline-amount').value;
            }
            if (nextStepId === 'step-3') {
                renderSpecificFields(term);
            }
            showGoalStep(nextStepId);
        }

        if (e.target.matches('.prev-step')) {
            const prevId = e.target.getAttribute('data-prev');
            showGoalStep(prevId);
        }

        const dayChip = e.target.closest('.day-chip');
        if (dayChip) {
            const dayValue = dayChip.getAttribute('data-day');
            if (selectedDrinkDays.includes(dayValue)) {
                selectedDrinkDays = selectedDrinkDays.filter(d => d !== dayValue);
                dayChip.classList.remove('selected');
                dayChip.style.border = '1px solid #cbd5e1';
                dayChip.style.background = '#ffffff';
                dayChip.style.color = '#334155';
                dayChip.style.fontWeight = '400';
            } else {
                selectedDrinkDays.push(dayValue);
                dayChip.classList.add('selected');
                dayChip.style.border = '1px solid #2563eb';
                dayChip.style.background = '#eff6ff';
                dayChip.style.color = '#1d4ed8';
                dayChip.style.fontWeight = '600';
            }
            validateStep3(term);
            return;
        }

        if (e.target.id === 'btn-add-mindering-item') {
            if (term.middel === 'alcohol') {
                const defaults = getDefaultValuesForDrink('bier');
                minderingItems.push({ drank: 'bier', ...defaults });
            } else {
                minderingItems.push({ drank: '', verpakking: '', aantalPerDag: '', dagenPerWeek: '', aantalPerWeek: '' });
            }
            activeAccordionIndex = minderingItems.length - 1;
            renderMinderingRows(term);
            validateStep3(term);
            return;
        }

        const finishGoalBtn = e.target.closest('#btn-finish-goal-wizard');
        if (finishGoalBtn && !finishGoalBtn.disabled) {
            savedGoalData = collectGoalData();
            triggerConfetti();
            showGoalStep('step-4');
            return;
        }

        const backDashBtn = e.target.closest('#btn-back-dashboard');
        if (backDashBtn) {
            if (typeof onComplete === 'function') {
                onComplete(savedGoalData);
            }
            return;
        }
    };

    container.oninput = (e) => {
        if (e.target.id === 'baseline-days' || e.target.id === 'baseline-amount') {
            validateBaseline();
        }
        validateStep3(term);
    };

    container.onchange = (e) => {
        if (e.target.closest('#mindering-items-container')) {
            const row = e.target.closest('.accordion-item');
            const index = parseInt(row.querySelector('.accordion-header').getAttribute('data-index'), 10);

            if (term.middel === 'alcohol' && e.target.classList.contains('drank-type-select')) {
                const newDrank = e.target.value;
                const defaults = getDefaultValuesForDrink(newDrank);
                minderingItems[index] = { drank: newDrank, ...defaults };
            } else {
                updateMinderingItemsFromDOM(term);
            }

            renderMinderingRows(term);
            validateStep3(term);
        }
    };
}

function showGoalStep(stepId) {
    const steps = document.querySelectorAll('.wizard-step');
    steps.forEach(step => step.classList.remove('active'));

    const targetStep = document.getElementById(stepId);
    if (targetStep) targetStep.classList.add('active');

    const progressBarContainer = document.querySelector('.progress-bar-container');
    const progressBar = document.getElementById('goal-progress-bar');
    
    if (stepId === 'step-4') {
        if (progressBarContainer) progressBarContainer.style.display = 'none';
    } else {
        if (progressBarContainer) progressBarContainer.style.display = 'block';
        if (progressBar) {
            const progressPercentages = { 'step-intro': 20, 'step-baseline': 40, 'step-1': 60, 'step-2': 80, 'step-3': 100 };
            progressBar.style.width = `${progressPercentages[stepId] || 20}%`;
        }
    }
}

function renderSpecificFields(term) {
    const dynamicForm = document.getElementById('goal-dynamic-form');
    const stepTitle = document.getElementById('step2-main-title');
    const infoBtn = document.getElementById('btn-info-withdrawal');
    if (!dynamicForm) return;

    if (selectedGoalType === 'stoppen') {
        if (stepTitle) stepTitle.textContent = 'Jouw plan om te stoppen';
        if (infoBtn) infoBtn.classList.remove('hidden');

        dynamicForm.innerHTML = `
            <div class="info-block stagger-1" style="border-left-color: #10b981;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                    <span style="font-size: 24px;">🛑</span>
                    <h4 style="font-size: 18px; margin: 0; color: #1e293b;">Afspraken</h4>
                </div>

                <div class="form-group" style="margin-bottom: 16px;">
                    <label for="goal-start-date" style="display: block; font-weight: 700; margin-bottom: 8px; font-size: 14px; color: #334155;">1. Vanaf welke datum wil je je aan dit doel houden?</label>
                    <input type="date" id="goal-start-date" class="form-input" value="${startDateVal}" style="${fontStyle}">
                </div>

                <div class="form-group" style="margin-bottom: 24px;">
                    <label for="goal-end-date" style="display: block; font-weight: 700; margin-bottom: 8px; font-size: 14px; color: #334155;">2. Tot wanneer wil je dit minimaal volhouden?</label>
                    <input type="date" id="goal-end-date" class="form-input" value="${endDateVal}" style="${fontStyle}">
                </div>

                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;">

                <div class="form-group" style="background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0;">
                    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-weight: 700; font-size: 14px; color: #1e293b;">
                        <input type="checkbox" id="goal-reminder-checkbox" ${reminderEnabled ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: #2563eb;">
                        Ontvang een herinneringsmelding over een maand
                    </label>
                    <p style="margin: 6px 0 0 28px; font-size: 15px; color: #64748b;">We sturen je dan een vriendelijk seintje om je voortgang te evalueren.</p>
                </div>
            </div>
        `;
    } else if (selectedGoalType === 'minderen') {
        if (stepTitle) stepTitle.textContent = 'Jouw plan om te minderen';
        if (infoBtn) infoBtn.classList.add('hidden');

        const daysOfWeek = [
            { key: 'maandag', label: 'Ma' }, { key: 'dinsdag', label: 'Di' }, { key: 'woensdag', label: 'Wo' },
            { key: 'donderdag', label: 'Do' }, { key: 'vrijdag', label: 'Vr' }, { key: 'zaterdag', label: 'Za' },
            { key: 'zondag', label: 'Zo' }
        ];

        const daysHtml = daysOfWeek.map(d => {
            const isSelected = selectedDrinkDays.includes(d.key);
            const borderCol = isSelected ? '#2563eb' : '#cbd5e1';
            const bgCol = isSelected ? '#eff6ff' : '#ffffff';
            const textCol = isSelected ? '#1d4ed8' : '#334155';
            const fw = isSelected ? '600' : '400';
            return `
                <button type="button" class="day-chip ${isSelected ? 'selected' : ''}" data-day="${d.key}" style="padding: 10px 14px; border-radius: 8px; border: 1px solid ${borderCol}; background: ${bgCol}; color: ${textCol}; font-weight: ${fw}; cursor: pointer; transition: all 0.2s; flex: 1; text-align: center;">
                    ${d.label}
                </button>
            `;
        }).join('');

        const isAlcohol = term.middel === 'alcohol';

        let addBtnText = '+ Toevoegen';
        if (term.middel === 'alcohol') {
            addBtnText = '+ Andere alcoholische drank';
        } else if (term.middel === 'gokken') {
            addBtnText = '+ Ander type gokspel';
        } else {
            addBtnText = `+ Andere vorm van ${term.middel}`;
        }

        dynamicForm.innerHTML = `
            <div class="info-block stagger-1" style="border-left-color: #f59e0b; padding: 24px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                    <span style="font-size: 24px;">📉</span>
                    <h4 style="font-size: 18px; margin: 0; color: #1e293b;">Afspraken (Minderen)</h4>
                </div>

                <div class="form-group" style="margin-bottom: 24px;">
                    <label style="display: block; font-weight: 800; color: #1e293b; margin-bottom: 4px; font-size: 15px;">Stap 1: Bepaal je maximale grenzen</label>
                    <p style="font-size: 14px; color: #64748b; margin-bottom: 12px; line-height: 1.5;">
                        Voeg hieronder toe wat en hoeveel je maximaal wilt ${term.werkwoord} op een gebruiksmoment. Dit wordt je nieuwe ijkpunt.
                    </p>

                    <div id="mindering-items-container"></div>

                    <button type="button" id="btn-add-mindering-item" style="margin-top: 12px; font-size: 14px; font-weight: 700; color: #2563eb; padding: 12px; width: 100%; border: 2px dashed #bfdbfe; background: #eff6ff; border-radius: 8px; cursor: pointer; transition: all 0.2s; ${fontStyle}">
                        ${addBtnText}
                    </button>
                </div>

                ${isAlcohol ? `
                <div id="total-standard-glasses-summary" style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 12px 16px; border-radius: 8px; margin: 16px 0 24px 0; font-size: 14px; color: #1e40af; font-weight: 600; text-align: center;">
                    Totaal berekend: ca. 0 standaardglazen per week
                </div>
                ` : ''}

                <hr class="form-divider" style="margin: 24px 0; border: 0; border-top: 1px solid #e2e8f0;">

                <div class="form-group" style="margin-bottom: 24px;">
                    <label style="display: block; font-weight: 800; color: #1e293b; margin-bottom: 8px; font-size: 15px;">Stap 2: Bepaal je frequentie</label>
                    
                    <label style="display: block; font-size: 14px; color: #475569; margin-bottom: 8px;">Op welke dagen sta je jezelf toe te ${term.werkwoord}? (Optioneel)</label>
                    <div style="display: flex; gap: 6px; justify-content: space-between;">
                        ${daysHtml}
                    </div>
                </div>

                <hr class="form-divider" style="margin: 24px 0; border: 0; border-top: 1px solid #e2e8f0;">

                <div class="form-group" style="margin-bottom: 16px;">
                    <label style="display: block; font-weight: 800; color: #1e293b; margin-bottom: 12px; font-size: 15px;">Stap 3: Kies de datums</label>
                </div>

                <div class="form-group" style="margin-bottom: 16px;">
                    <label for="goal-start-date" style="display: block; font-size: 14px; color: #475569; margin-bottom: 6px; font-weight: 600;">1. Vanaf welke datum wil je je aan dit doel houden?</label>
                    <input type="date" id="goal-start-date" class="form-input" value="${startDateVal}" style="${fontStyle}">
                </div>

                <div class="form-group" style="margin-bottom: 24px;">
                    <label for="goal-end-date" style="display: block; font-size: 14px; color: #475569; margin-bottom: 6px; font-weight: 600;">2. Tot wanneer wil je dit minimaal volhouden?</label>
                    <input type="date" id="goal-end-date" class="form-input" value="${endDateVal}" style="${fontStyle}">
                </div>

                <div class="form-group" style="background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; margin-top: 24px;">
                    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-weight: 700; font-size: 14px; color: #1e293b;">
                        <input type="checkbox" id="goal-reminder-checkbox" ${reminderEnabled ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: #2563eb;">
                        Ontvang een herinneringsmelding over een maand
                    </label>
                    <p style="margin: 6px 0 0 28px; font-size: 15px; color: #64748b;">We sturen je dan een vriendelijk seintje om te kijken hoe het ervoor staat met je doel.</p>
                </div>
            </div>
        `;

        if (minderingItems.length === 0) {
            if (isAlcohol) {
                const defaults = getDefaultValuesForDrink('bier');
                minderingItems.push({ drank: 'bier', ...defaults });
            } else {
                minderingItems.push({ drank: '', verpakking: '', aantalPerDag: '', dagenPerWeek: '', aantalPerWeek: '' });
            }
        }
        renderMinderingRows(term);
    }

    validateStep3(term);
}

function renderMinderingRows(term) {
    const container = document.getElementById('mindering-items-container');
    if (!container) return;

    const isAlcohol = term.middel === 'alcohol';
    let totalWeeklyStandardGlasses = 0;

    container.innerHTML = minderingItems.map((item, index) => {
        const isOpen = activeAccordionIndex === index;
        
        if (isAlcohol) {
            let verpakkingOptions = `<option value="" ${!item.verpakking ? 'selected disabled' : ''}>-- Kies eenheid --</option>`;
            let maatOptions = `<option value="" ${!item.maat ? 'selected disabled' : ''}>-- Kies maat --</option>`;
            let percentageOptions = `<option value="" ${item.percentage === '' ? 'selected disabled' : ''}>-- Kies percentage --</option>`;

            if (item.drank === 'bier') {
                verpakkingOptions += `
                    <option value="glas" ${item.verpakking === 'glas' ? 'selected' : ''}>Glas</option>
                    <option value="fles" ${item.verpakking === 'fles' ? 'selected' : ''}>Fles</option>
                    <option value="blik" ${item.verpakking === 'blik' ? 'selected' : ''}>Blik</option>
                `;
                maatOptions += `
                    <option value="0.25" ${item.maat == 0.25 ? 'selected' : ''}>0,25 liter (25 cl)</option>
                    <option value="0.3" ${item.maat == 0.3 ? 'selected' : ''}>0,3 liter (30 cl)</option>
                    <option value="0.5" ${item.maat == 0.5 ? 'selected' : ''}>0,5 liter (50 cl)</option>
                `;
                percentageOptions += `
                    <option value="5" ${item.percentage == 5 ? 'selected' : ''}>5% (pils)</option>
                    <option value="7" ${item.percentage == 7 ? 'selected' : ''}>6-8% (speciaalbier)</option>
                    <option value="11" ${item.percentage == 11 ? 'selected' : ''}>10-12% (zwaar)</option>
                `;
            } else if (item.drank === 'wijn') {
                verpakkingOptions += `
                    <option value="glas" ${item.verpakking === 'glas' ? 'selected' : ''}>Glas</option>
                    <option value="fles" ${item.verpakking === 'fles' ? 'selected' : ''}>Fles</option>
                `;
                if (item.verpakking === 'glas') {
                    maatOptions += `
                        <option value="0.1" ${item.maat == 0.1 ? 'selected' : ''}>100 ml (10 cl)</option>
                        <option value="0.15" ${item.maat == 0.15 ? 'selected' : ''}>150 ml (15 cl)</option>
                        <option value="0.35" ${item.maat == 0.35 ? 'selected' : ''}>35 cl (port)</option>
                    `;
                } else if (item.verpakking === 'fles') {
                    maatOptions += `
                        <option value="0.7" ${item.maat == 0.7 ? 'selected' : ''}>0,7 liter (70 cl)</option>
                        <option value="1" ${item.maat == 1 ? 'selected' : ''}>1 liter (100 cl)</option>
                    `;
                }
                percentageOptions += `
                    <option value="12" ${item.percentage == 12 ? 'selected' : ''}>12%</option>
                    <option value="20" ${item.percentage == 20 ? 'selected' : ''}>20% (port)</option>
                `;
            } else if (item.drank === 'sterke drank') {
                verpakkingOptions += `
                    <option value="glas" ${item.verpakking === 'glas' ? 'selected' : ''}>Glas</option>
                    <option value="fles" ${item.verpakking === 'fles' ? 'selected' : ''}>Fles</option>
                `;
                if (item.verpakking === 'glas') {
                    maatOptions += `
                        <option value="0.35" ${item.maat == 0.35 ? 'selected' : ''}>35 cl</option>
                    `;
                } else if (item.verpakking === 'fles') {
                    maatOptions += `
                        <option value="0.7" ${item.maat == 0.7 ? 'selected' : ''}>0,7 liter (70 cl)</option>
                        <option value="1" ${item.maat == 1 ? 'selected' : ''}>1 liter (100 cl)</option>
                    `;
                }
                percentageOptions += `
                    <option value="35" ${item.percentage == 35 ? 'selected' : ''}>35%</option>
                    <option value="40" ${item.percentage == 40 ? 'selected' : ''}>40%</option>
                `;
            } else if (item.drank === 'mixdrank') {
                verpakkingOptions += `
                    <option value="glas" ${item.verpakking === 'glas' ? 'selected' : ''}>Glas</option>
                    <option value="blik" ${item.verpakking === 'blik' ? 'selected' : ''}>Blik</option>
                `;
                maatOptions += `
                    <option value="0.25" ${item.maat == 0.25 ? 'selected' : ''}>0,25 liter (25 cl)</option>
                    <option value="0.3" ${item.maat == 0.3 ? 'selected' : ''}>0,3 liter (30 cl)</option>
                `;
                percentageOptions += `
                    <option value="5" ${item.percentage == 5 ? 'selected' : ''}>5%</option>
                    <option value="10" ${item.percentage == 10 ? 'selected' : ''}>10%</option>
                `;
            }

            const liters = parseFloat(item.maat) || 0;
            const perc = parseFloat(item.percentage) || 0;
            const alcoholInLiters = liters * (perc / 100);
            const standardGlassesPerUnit = alcoholInLiters > 0 ? alcoholInLiters / 0.01 : 0;
            const weeklyTotalForThisItem = standardGlassesPerUnit * (parseInt(item.aantalPerWeek) || 0);
            totalWeeklyStandardGlasses += weeklyTotalForThisItem;

            const readableDrankName = item.drank ? (item.drank.charAt(0).toUpperCase() + item.drank.slice(1)) : 'Nog niet gekozen';
            const showStepUnit = Boolean(item.drank);
            const showStepMax = Boolean(item.drank && item.verpakking && item.maat && item.percentage !== '');

            return `
                <div class="accordion-item" style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 8px; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.02);">
                    <div class="accordion-header" data-index="${index}" style="padding: 14px 16px; background: ${isOpen ? '#f1f5f9' : '#f8fafc'}; display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-weight: 600; font-size: 14px; color: #1e293b;">Soort: ${readableDrankName}</span>
                            ${showStepMax ? `<span style="font-size: 14px; color: #64748b; background: #e2e8f0; padding: 2px 8px; border-radius: 12px;">ca. ${weeklyTotalForThisItem.toFixed(1)} st.gl/week</span>` : ''}
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            ${minderingItems.length > 1 ? `<button type="button" class="btn-remove-mindering" data-index="${index}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 14px; font-weight: 600;">Verwijderen</button>` : ''}
                            <span style="font-size: 14px; color: #64748b; transition: transform 0.2s; transform: rotate(${isOpen ? '180deg' : '0deg'});">▼</span>
                        </div>
                    </div>
                    <div class="accordion-content" style="padding: 16px; display: ${isOpen ? 'grid' : 'none'}; gap: 16px; border-top: 1px solid #e2e8f0; background: #ffffff;">
                        <div>
                            <label style="font-size: 14px; font-weight: 600; color: #475569; display: block; margin-bottom: 6px;">Soort drank</label>
                            <select class="form-input drank-type-select" style="padding: 10px; font-size: 14px; ${fontStyle}">
                                <option value="" ${!item.drank ? 'selected disabled' : ''}>-- Kies soort --</option>
                                <option value="bier" ${item.drank === 'bier' ? 'selected' : ''}>Bier</option>
                                <option value="wijn" ${item.drank === 'wijn' ? 'selected' : ''}>Wijn</option>
                                <option value="sterke drank" ${item.drank === 'sterke drank' ? 'selected' : ''}>Sterke drank</option>
                                <option value="mixdrank" ${item.drank === 'mixdrank' ? 'selected' : ''}>Mixdrank</option>
                            </select>
                        </div>
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; display: ${showStepUnit ? 'grid' : 'none'}; gap: 12px;">
                            <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                                <div>
                                    <label style="font-size: 14px; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">Verpakking</label>
                                    <select class="form-input drank-verpakking-select" style="padding: 10px; font-size: 14px; ${fontStyle}">
                                        ${verpakkingOptions}
                                    </select>
                                </div>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                                <div>
                                    <label style="font-size: 14px; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">Maat / Inhoud</label>
                                    <select class="form-input drank-maat-select" style="padding: 10px; font-size: 14px; ${fontStyle}">
                                        ${maatOptions}
                                    </select>
                                </div>
                                <div>
                                    <label style="font-size: 14px; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">Alcoholpercentage (%)</label>
                                    <select class="form-input drank-percentage-select" style="padding: 10px; font-size: 14px; ${fontStyle}">
                                        ${percentageOptions}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; display: ${showStepMax ? 'grid' : 'none'}; gap: 12px;">
                            <span style="font-size: 15px; font-weight: 700; color: #1e293b;">Maximale inname / frequentie</span>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 12px;">
                                <div>
                                    <label style="font-size: 14px; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">Max. per dag</label>
                                    <input type="number" class="form-input drank-per-dag-input" min="0" step="any" value="${item.aantalPerDag}" style="padding: 10px; font-size: 14px; width: 100%; ${fontStyle}">
                                </div>
                                <div>
                                    <label style="font-size: 14px; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">Dagen per week</label>
                                    <input type="number" class="form-input drank-dagen-per-week-input" min="0" max="7" step="1" value="${item.dagenPerWeek}" style="padding: 10px; font-size: 14px; width: 100%; ${fontStyle}">
                                </div>
                                <div>
                                    <label style="font-size: 14px; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">Max. per week</label>
                                    <input type="number" class="form-input drank-per-week-input" min="0" step="any" value="${item.aantalPerWeek}" style="padding: 10px; font-size: 14px; width: 100%; ${fontStyle}">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            const safeName = item.drank ? item.drank : 'Nieuw item';
            return `
                <div class="accordion-item" style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 8px; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.02);">
                    <div class="accordion-header" data-index="${index}" style="padding: 14px 16px; background: ${isOpen ? '#f1f5f9' : '#f8fafc'}; display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none;">
                        <span style="font-weight: 600; font-size: 14px; color: #1e293b;">Beperking: ${safeName}</span>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            ${minderingItems.length > 1 ? `<button type="button" class="btn-remove-mindering" data-index="${index}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 14px; font-weight: 600;">Verwijderen</button>` : ''}
                            <span style="font-size: 14px; color: #64748b; transition: transform 0.2s; transform: rotate(${isOpen ? '180deg' : '0deg'});">▼</span>
                        </div>
                    </div>
                    <div class="accordion-content" style="padding: 16px; display: ${isOpen ? 'grid' : 'none'}; gap: 16px; border-top: 1px solid #e2e8f0; background: #ffffff;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                            <div>
                                <label style="font-size: 14px; font-weight: 600; color: #475569; display: block; margin-bottom: 6px;">Wat precies?</label>
                                <input type="text" class="form-input drank-type-select generic-input" placeholder="Bijv. Wiet, Gokkast" value="${item.drank}" style="padding: 10px; font-size: 14px; ${fontStyle}">
                            </div>
                            <div>
                                <label style="font-size: 14px; font-weight: 600; color: #475569; display: block; margin-bottom: 6px;">Eenheid</label>
                                <input type="text" class="form-input drank-verpakking-select generic-input" placeholder="Bijv. gram, euro's, joints" value="${item.verpakking}" style="padding: 10px; font-size: 14px; ${fontStyle}">
                            </div>
                        </div>
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; display: grid; gap: 12px;">
                            <span style="font-size: 15px; font-weight: 700; color: #1e293b;">Maximale inname / inzet</span>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 12px;">
                                <div>
                                    <label style="font-size: 14px; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">Max. per dag</label>
                                    <input type="number" class="form-input drank-per-dag-input" min="0" step="any" value="${item.aantalPerDag}" style="padding: 10px; font-size: 14px; width: 100%; ${fontStyle}">
                                </div>
                                <div>
                                    <label style="font-size: 14px; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">Dagen per week</label>
                                    <input type="number" class="form-input drank-dagen-per-week-input" min="0" max="7" step="1" value="${item.dagenPerWeek}" style="padding: 10px; font-size: 14px; width: 100%; ${fontStyle}">
                                </div>
                                <div>
                                    <label style="font-size: 14px; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">Max. per week</label>
                                    <input type="number" class="form-input drank-per-week-input" min="0" step="any" value="${item.aantalPerWeek}" style="padding: 10px; font-size: 14px; width: 100%; ${fontStyle}">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }).join('');

    if (isAlcohol) {
        const summaryBox = document.getElementById('total-standard-glasses-summary');
        if (summaryBox) {
            summaryBox.textContent = `Totaal berekend: ca. ${totalWeeklyStandardGlasses.toFixed(1)} standaardglazen per week`;
        }
    }
}

function updateMinderingItemsFromDOM(term) {
    const isAlcohol = term.middel === 'alcohol';
    const rows = document.querySelectorAll('.accordion-item');
    minderingItems = [];
    rows.forEach(row => {
        if (isAlcohol) {
            minderingItems.push({
                drank: row.querySelector('.drank-type-select')?.value || '',
                verpakking: row.querySelector('.drank-verpakking-select')?.value || '',
                maat: parseFloat(row.querySelector('.drank-maat-select')?.value) || '',
                percentage: row.querySelector('.drank-percentage-select')?.value !== '' ? parseFloat(row.querySelector('.drank-percentage-select')?.value) : '',
                aantalPerDag: row.querySelector('.drank-per-dag-input')?.value || '',
                dagenPerWeek: row.querySelector('.drank-dagen-per-week-input')?.value || '',
                aantalPerWeek: row.querySelector('.drank-per-week-input')?.value || ''
            });
        } else {
            minderingItems.push({
                drank: row.querySelector('.drank-type-select')?.value || '',
                verpakking: row.querySelector('.drank-verpakking-select')?.value || '',
                aantalPerDag: row.querySelector('.drank-per-dag-input')?.value || '',
                dagenPerWeek: row.querySelector('.drank-dagen-per-week-input')?.value || '',
                aantalPerWeek: row.querySelector('.drank-per-week-input')?.value || ''
            });
        }
    });
}

function validateStep3(term) {
    const finishBtn = document.getElementById('btn-finish-goal-wizard');
    const startDate = document.getElementById('goal-start-date')?.value;
    const endDate = document.getElementById('goal-end-date')?.value;

    if (!finishBtn) return;

    let isValid = Boolean(startDate && endDate);

    if (selectedGoalType === 'minderen') {
        updateMinderingItemsFromDOM(term);
        let hasValidItems = false;
        
        if (term.middel === 'alcohol') {
            hasValidItems = minderingItems.length > 0 && minderingItems.every(item => 
                item.drank && item.verpakking && item.maat && item.percentage !== '' && item.aantalPerDag && item.dagenPerWeek && item.aantalPerWeek
            );
        } else {
            hasValidItems = minderingItems.length > 0 && minderingItems.every(item => 
                item.drank.trim() !== '' && item.verpakking.trim() !== '' && item.aantalPerDag && item.dagenPerWeek && item.aantalPerWeek
            );
        }
        
        isValid = isValid && hasValidItems;
    }

    finishBtn.disabled = !isValid;
    finishBtn.style.opacity = isValid ? '1' : '0.5';
}

function collectGoalData() {
    startDateVal = document.getElementById('goal-start-date')?.value;
    endDateVal = document.getElementById('goal-end-date')?.value;
    reminderEnabled = document.getElementById('goal-reminder-checkbox')?.checked || false;

    const data = {
        type: selectedGoalType,
        baselineDays: baselineDaysVal,
        baselineAmount: baselineAmountVal,
        startDate: startDateVal,
        endDate: endDateVal,
        reminderEnabled: reminderEnabled,
        createdAt: new Date().toISOString()
    };

    if (selectedGoalType === 'minderen') {
        data.minderingItems = minderingItems;
        data.drinkDays = selectedDrinkDays;
    }

    return data;
}

function triggerConfetti() {
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
        }
    }

    update();
}