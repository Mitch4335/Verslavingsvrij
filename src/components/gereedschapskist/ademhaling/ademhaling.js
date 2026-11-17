// src/components/gereedschapskist/ademhaling/ademhaling.js

function loadCSS() {
    const cssUrl = new URL('./ademhaling.css', import.meta.url).href;
    if (!document.querySelector(`link[href="${cssUrl}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssUrl;
        document.head.appendChild(link);
    }
}

// De 3 ademhalingsoefeningen (tijden in seconden)
const technieken = [
    { id: 'rust', naam: 'Rustige Ademhaling', desc: '4s in, 6s uit. Goed voor snelle ontspanning.', in: 4, hold1: 0, out: 6, hold2: 0 },
    { id: 'box', naam: 'Box Breathing', desc: '4s in, 4s vast, 4s uit, 4s vast. Voor extreme focus.', in: 4, hold1: 4, out: 4, hold2: 4 },
    { id: 'slaap', naam: 'Diepe Ontspanning', desc: '4s in, 7s vast, 8s uit. Helpt bij paniek of slapen.', in: 4, hold1: 7, out: 8, hold2: 0 }
];

export function renderAdemhalingModule(containerElement, onBackToKist) {
    loadCSS();
    window.scrollTo(0, 0);

    const container = containerElement || document.getElementById('app-content');
    if (!container) return;

    let actieveTechniek = technieken[0];
    let minuten = 5;
    let isRunning = false;
    
    // Timers
    let mainTimerInterval = null;
    let phaseTimeout = null;
    let resterendeSeconden = 0;

    function renderSetup() {
        let html = `
            <div style="padding: 20px;">
                <div class="module-container adem-container" style="max-width: 600px; margin: 0 auto;">
                    <div style="margin-bottom: 32px;" class="stagger-1">
                        <span style="font-size: 14px; font-weight: 800; color: #10b981; text-transform: uppercase; letter-spacing: 1px;">Hulpmiddelen</span>
                        <h2 style="font-size: 28px; color: #1e293b; margin-top: 4px; font-weight: 800;">Ademhaling</h2>
                    </div>

                    <div class="adem-intro-card stagger-1">
                        <h3><span>🌬️</span> De kracht van je adem</h3>
                        <p>Een trage ademhaling geeft je zenuwstelsel het fysieke signaal dat je veilig bent. Dit verlaagt direct de hartslag, remt de aanmaak van stresshormonen en vermindert de intensiteit van trek of paniek.</p>
                    </div>

                    <div class="stagger-2" style="margin-bottom: 12px; font-weight: 700; color: #1e293b; font-size: 15px;">Kies een techniek:</div>
                    <div class="techniek-grid stagger-2">
                        ${technieken.map(t => `
                            <button class="techniek-btn ${actieveTechniek.id === t.id ? 'active' : ''}" data-id="${t.id}">
                                <h4>${t.naam}</h4>
                                <p>${t.desc}</p>
                            </button>
                        `).join('')}
                    </div>

                    <div class="stagger-3" style="margin-bottom: 12px; font-weight: 700; color: #1e293b; font-size: 15px;">Duur (minuten):</div>
                    <div class="timer-config stagger-3">
                        <span class="timer-config-label">Tijdsduur van de oefening</span>
                        <div class="timer-controls">
                            <button class="timer-btn" id="btn-min-min" title="Korter">-</button>
                            <span class="timer-value">${minuten}:00</span>
                            <button class="timer-btn" id="btn-min-plus" title="Langer">+</button>
                        </div>
                    </div>

                    <div class="stagger-3" style="margin-top: 32px;">
                        <button id="btn-start-oefening" class="btn-primary">Start Oefening</button>
                        <button id="btn-terug-kist" class="btn-secondary" style="width: 100%; margin-top: 12px;">&larr; Terug naar Hulpmiddelen</button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML = html;
        bindSetupEvents();
    }

    function renderActiveSession() {
        container.innerHTML = `
            <div style="padding: 20px; height: 80vh; display: flex; flex-direction: column;">
                <div class="module-container adem-container" style="max-width: 600px; margin: 0 auto; flex: 1; display: flex; flex-direction: column; justify-content: center;">
                    
                    <div class="active-session-container">
                        <div class="instruction-text" id="adem-instructie">Maak je klaar...</div>
                        
                        <div class="breath-circle-wrapper">
                            <div class="breath-circle" id="adem-cirkel"></div>
                        </div>

                        <div class="countdown-display" id="adem-timer">
                            ${formatTime(resterendeSeconden)}
                        </div>

                        <button id="btn-stop-oefening" class="btn-stop">Stoppen</button>
                    </div>

                </div>
            </div>
        `;
        bindActiveEvents();
        
        setTimeout(() => {
            startBreathingCycle();
        }, 50);
    }

    // --- NIEUW: Het beloningsscherm ---
    function renderCompletion() {
        container.innerHTML = `
            <div style="padding: 20px; height: 80vh; display: flex; flex-direction: column; justify-content: center;">
                <div class="module-container adem-container" style="max-width: 600px; margin: 0 auto; text-align: center;">
                    
                    <div class="stagger-1" style="font-size: 72px; margin-bottom: 24px;">🌿</div>
                    
                    <h2 class="stagger-1" style="font-size: 32px; color: #1e293b; margin-bottom: 16px; font-weight: 800;">Heel goed gedaan</h2>
                    
                    <p class="stagger-2" style="font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 40px; padding: 0 20px;">
                        Je hebt zojuist actief de tijd genomen om stil te staan, de controle te pakken en je zenuwstelsel tot rust te brengen. Dat is een prachtige overwinning op jezelf.
                    </p>
                    
                    <div class="stagger-3">
                        <button id="btn-klaar-kist" class="btn-primary" style="margin-bottom: 16px;">Terug naar Hulpmiddelen</button>
                        <button id="btn-nog-een-keer" class="btn-secondary" style="width: 100%;">Nog een oefening doen</button>
                    </div>

                </div>
            </div>
        `;

        const btnKlaar = container.querySelector('#btn-klaar-kist');
        const btnOpnieuw = container.querySelector('#btn-nog-een-keer');

        if (btnKlaar) btnKlaar.onclick = () => onBackToKist && onBackToKist();
        if (btnOpnieuw) btnOpnieuw.onclick = renderSetup;
    }

    function bindSetupEvents() {
        const btnTerug = container.querySelector('#btn-terug-kist');
        if (btnTerug) btnTerug.onclick = () => onBackToKist && onBackToKist();

        const btnMin = container.querySelector('#btn-min-min');
        const btnPlus = container.querySelector('#btn-min-plus');
        const valDisplay = container.querySelector('.timer-value');

        if (btnMin) {
            btnMin.onclick = () => {
                if (minuten > 1) minuten--;
                valDisplay.textContent = `${minuten}:00`;
            };
        }
        if (btnPlus) {
            btnPlus.onclick = () => {
                if (minuten < 30) minuten++;
                valDisplay.textContent = `${minuten}:00`;
            };
        }

        container.querySelectorAll('.techniek-btn').forEach(btn => {
            btn.onclick = (e) => {
                container.querySelectorAll('.techniek-btn').forEach(b => b.classList.remove('active'));
                
                const clickedBtn = e.currentTarget;
                clickedBtn.classList.add('active');
                
                const id = clickedBtn.getAttribute('data-id');
                actieveTechniek = technieken.find(t => t.id === id);
            };
        });

        const btnStart = container.querySelector('#btn-start-oefening');
        if (btnStart) {
            btnStart.onclick = () => {
                isRunning = true;
                resterendeSeconden = minuten * 60;
                renderActiveSession();
            };
        }
    }

    function bindActiveEvents() {
        const btnStop = container.querySelector('#btn-stop-oefening');
        if (btnStop) {
            btnStop.onclick = stopSession;
        }
    }

    function formatTime(totalSeconds) {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    // Stop alles (bijvoorbeeld bij handmatig afbreken)
    function stopTimers() {
        isRunning = false;
        clearInterval(mainTimerInterval);
        clearTimeout(phaseTimeout);
    }

    function stopSession() {
        stopTimers();
        renderSetup();
    }

    // Succesvolle afronding
    function finishSession() {
        stopTimers();
        renderCompletion();
    }

    function startBreathingCycle() {
        const timerDisplay = document.getElementById('adem-timer');
        
        mainTimerInterval = setInterval(() => {
            resterendeSeconden--;
            if (timerDisplay) timerDisplay.textContent = formatTime(resterendeSeconden);
            
            if (resterendeSeconden <= 0) {
                // Vervangt de harde alert door de zachte overgang
                finishSession();
            }
        }, 1000);

        runPhase('in');
    }

    function runPhase(phase) {
        if (!isRunning) return;

        const cirkel = document.getElementById('adem-cirkel');
        const instructie = document.getElementById('adem-instructie');
        if (!cirkel || !instructie) return;

        let duur = 0;
        let scale = 1;
        let tekst = "";
        let nextPhase = "";

        if (phase === 'in') {
            duur = actieveTechniek.in;
            scale = 2.2;
            tekst = "Adem in...";
            nextPhase = actieveTechniek.hold1 > 0 ? 'hold1' : 'out';
        } else if (phase === 'hold1') {
            duur = actieveTechniek.hold1;
            scale = 2.2; 
            tekst = "Vasthouden";
            nextPhase = 'out';
        } else if (phase === 'out') {
            duur = actieveTechniek.out;
            scale = 1; 
            tekst = "Adem uit...";
            nextPhase = actieveTechniek.hold2 > 0 ? 'hold2' : 'in';
        } else if (phase === 'hold2') {
            duur = actieveTechniek.hold2;
            scale = 1; 
            tekst = "Vasthouden";
            nextPhase = 'in';
        }

        cirkel.style.transitionDuration = `${duur}s`;
        cirkel.style.transform = `scale(${scale})`;
        instructie.textContent = tekst;

        phaseTimeout = setTimeout(() => {
            runPhase(nextPhase);
        }, duur * 1000);
    }

    renderSetup();
}