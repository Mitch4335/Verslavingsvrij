// src/components/modules/vooruitkijken/vooruitkijken.js

function loadCSS() {
    const cssUrl = new URL('./vooruitkijken.css', import.meta.url).href;
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

    // Extra confetti voor de allerlaatste afronding!
    for (let i = 0; i < 200; i++) {
        pieces.push({
            x: canvas.width / 2, 
            y: canvas.height / 2 + 100, 
            size: Math.random() * 10 + 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: (Math.random() * -22) - 5,
            speedX: (Math.random() * 30) - 15, 
            gravity: 0.5, 
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 12 - 6
        });
    }

    let animationFrame;
    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let activePieces = 0;

        pieces.forEach(p => {
            p.speedY += p.gravity; 
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
            if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
            if (onFinish) onFinish();
        }
    }
    update();
}

export function renderVooruitkijkenModule(containerElement, onComplete) {
    loadCSS();
    window.scrollTo(0, 0);

    const container = containerElement || document.getElementById('app-content');
    if (!container) return;

    const actiefTraject = localStorage.getItem('actieveVerslaving') || 'alcohol';
    let currentStepIndex = 0; 
    let geselecteerdeWaarden = [];

    const opgeslagen = localStorage.getItem(`arminius_gekozen_waarden_${actiefTraject}`);
    if (opgeslagen) {
        try { geselecteerdeWaarden = JSON.parse(opgeslagen); } catch(e) {}
    }

    const tekstMap = {
        'alcohol': { middel: 'alcohol' },
        'cannabis': { middel: 'blowen' },
        'cocaine': { middel: 'cocaïne' },
        'gokken': { middel: 'gokken' }
    };
    const tData = tekstMap[actiefTraject] || tekstMap['alcohol'];

    container.innerHTML = `
        <div style="padding: 20px;">
            <div class="progress-bar-container" style="background: #e2e8f0; height: 6px; border-radius: 3px; margin-bottom: 24px; overflow: hidden; max-width: 700px; margin-left: auto; margin-right: auto;">
                <div class="progress-bar" id="vk-progress-bar" style="width: 25%; background: #2563eb; height: 100%; transition: width 0.4s ease-out;"></div>
            </div>
            
            <div class="module-container vooruitkijken-container" style="max-width: 700px; margin: 0 auto;">
                <div style="margin-bottom: 32px;" id="vk-main-header">
                    <span style="font-size: 12px; font-weight: 600; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Afsluiting</span>
                    <h2 style="font-size: 24px; color: #1e293b; margin-top: 4px;" id="vk-header-title">Vooruitkijken</h2>
                </div>

                <div id="vk-page-content"></div>
            </div>
        </div>
    `;

    const pageContent = container.querySelector('#vk-page-content');
    const progressBar = container.querySelector('#vk-progress-bar');
    const headerTitle = container.querySelector('#vk-header-title');
    const headerWrapper = container.querySelector('#vk-main-header');
    const progressWrapper = container.querySelector('.progress-bar-container');

    function renderStep(preserveScroll = false) {
        const scrollY = window.scrollY;

        // Bepaal zichtbaarheid header en progressie
        headerWrapper.style.display = (currentStepIndex === 4) ? 'none' : 'block';
        if (progressWrapper) {
            progressWrapper.style.display = (currentStepIndex === 4) ? 'none' : 'block';
        }

        if (progressBar) {
            if (currentStepIndex === 0) progressBar.style.width = '25%';
            else if (currentStepIndex === 1) progressBar.style.width = '50%';
            else if (currentStepIndex === 2) progressBar.style.width = '75%';
            else if (currentStepIndex === 3) progressBar.style.width = '100%';
        }

        let html = '';

        if (currentStepIndex === 0) {
            // INTRODUCTIE
            headerTitle.textContent = "De eindstreep van de routekaart";
            html = `
                <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">
                    <div class="stagger-1 info-block info-block-border-green" style="margin-bottom: 0;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                            <span style="font-size: 24px;">🏁</span>
                            <h3 style="color: #0f172a; font-size: 18px; margin: 0;">Je bent er</h3>
                        </div>
                        <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                            Je hebt de volledige routekaart doorlopen. Je weet nu hoe je brein werkt, wat je risicosituaties zijn en hoe je jezelf én je omgeving kunt inschakelen om nuchter en clean te blijven.
                        </p>
                    </div>

                    <div class="stagger-2 info-block info-block-border-orange" style="margin-bottom: 0;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                            <span style="font-size: 24px;">🌅</span>
                            <h3 style="color: #0f172a; font-size: 18px; margin: 0;">De echte test</h3>
                        </div>
                        <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                            Maar het échte werk begint nu pas. De actieve 'lesfase' is voorbij. Vanaf nu ga je het geleerde in de praktijk brengen zonder dat deze app je continu bij de hand neemt.
                        </p>
                    </div>

                    <div class="stagger-3 info-block info-block-border-purple" style="margin-bottom: 0;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                            <span style="font-size: 24px;">🔮</span>
                            <h3 style="color: #0f172a; font-size: 18px; margin: 0;">Vooruitkijken</h3>
                        </div>
                        <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6;">
                            In deze laatste module kijken we vooruit. Wat ga je doen met al die vrijgekomen tijd? En hoe zorg je ervoor dat je jezelf blijft herinneren aan waarom je dit allemaal doet?
                        </p>
                    </div>
                </div>

                <div class="stagger-4 button-group" style="display: flex; justify-content: flex-end;">
                    <button type="button" id="btn-volgende" style="background-color: #2563eb; color: white; border: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 15px;">
                        Het zwarte gat &rarr;
                    </button>
                </div>
            `;
        }
        else if (currentStepIndex === 1) {
            // HET NIEUWE NORMAAL
            headerTitle.textContent = "Het normaliseren van 'saai'";
            html = `
                <div class="stagger-1" style="margin-bottom: 24px;">
                    <span style="font-size: 12px; font-weight: 600; color: #f59e0b; text-transform: uppercase; letter-spacing: 0.5px;">Stap 1 van 3</span>
                </div>

                <div class="stagger-2 info-block info-block-border-orange" style="margin-bottom: 32px;">
                    <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155; line-height: 1.6;">
                        Veel mensen ervaren een gevoel van leegte na het stoppen of minderen met ${tData.middel}. Het plannen, het stiekem doen, de pieken en de dalen... het is allemaal weggevallen. Opeens is het leven een stuk vlakker. Misschien voelt het zelfs een beetje saai.
                    </p>

                    <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                        <strong style="display: block; color: #1e3a8a; margin-bottom: 8px; font-size: 15px;">Saai is veilig</strong>
                        <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.6;">
                            Dit gevoel is een volkomen logisch fysiologisch proces. Je dopaminesysteem moet herstellen van langdurige overprikkeling. Een kopje koffie of een wandeling geeft nog niet dezelfde 'kick'. Geef je brein de tijd.
                        </p>
                    </div>

                    <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size: 16px;">De kracht van routine</h4>
                    <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.6;">
                        De beste manier om door deze fase heen te komen, is door te focussen op de absolute basis. Een strakke dagroutine, goede nachtrust en gezond eten zijn nu je belangrijkste wapens. Accepteer de leegte; het is de ruimte waarin je nieuwe leven wordt gebouwd.
                    </p>
                </div>

                <div class="stagger-3 button-group" style="display: flex; justify-content: space-between;">
                    <button type="button" id="btn-vorige" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        &larr; Vorige
                    </button>
                    <button type="button" id="btn-volgende" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        Ruimte voor nieuws &rarr;
                    </button>
                </div>
            `;
        }
        else if (currentStepIndex === 2) {
            // WAARDEN
            headerTitle.textContent = "Wat is écht belangrijk?";
            html = `
                <div class="stagger-1" style="margin-bottom: 24px;">
                    <span style="font-size: 12px; font-weight: 600; color: #8b5cf6; text-transform: uppercase; letter-spacing: 0.5px;">Stap 2 van 3</span>
                </div>

                <div class="stagger-2 info-block info-block-border-purple" style="margin-bottom: 32px;">
                    <p style="margin: 0 0 24px 0; font-size: 15px; color: #334155; line-height: 1.6;">
                        Nu ${tData.middel} niet langer op de eerste plaats staat, komt er ongemerkt veel tijd, geld en mentale ruimte vrij. Dit is hét moment om jezelf af te vragen: wie wil ik eigenlijk zijn?
                    </p>

                    <h4 style="margin: 0 0 16px 0; color: #1e293b; font-size: 16px;">Komende tijd ga ik me richten op... <span style="font-size: 13px; font-weight: normal; color: #64748b;">(kies wat bij je past)</span></h4>

                    <div class="waarden-grid">
                        <div class="value-card ${geselecteerdeWaarden.includes('relaties') ? 'selected-green' : ''}" data-id="relaties" data-color="green" style="background: #f0fdf4; border: 2px solid #bbf7d0;">
                            <span class="checkmark">✓</span>
                            <span style="font-size: 24px; display: block; margin-bottom: 8px;">❤️</span>
                            <strong style="color: #166534; font-size: 14px; display: block; margin-bottom: 4px;">Relaties & Gezin</strong>
                            <p style="margin: 0; color: #15803d; font-size: 13px;">Tijd steken in het herstellen van banden en oprecht aanwezig zijn.</p>
                        </div>
                        <div class="value-card ${geselecteerdeWaarden.includes('gezondheid') ? 'selected-blue' : ''}" data-id="gezondheid" data-color="blue" style="background: #eff6ff; border: 2px solid #bfdbfe;">
                            <span class="checkmark">✓</span>
                            <span style="font-size: 24px; display: block; margin-bottom: 8px;">💪</span>
                            <strong style="color: #1e3a8a; font-size: 14px; display: block; margin-bottom: 4px;">Gezondheid & Sport</strong>
                            <p style="margin: 0; color: #1d4ed8; font-size: 13px;">Het lichaam de kans geven om te herstellen en fitter te worden.</p>
                        </div>
                        <div class="value-card ${geselecteerdeWaarden.includes('ontwikkeling') ? 'selected-yellow' : ''}" data-id="ontwikkeling" data-color="yellow" style="background: #fffbeb; border: 2px solid #fde68a;">
                            <span class="checkmark">✓</span>
                            <span style="font-size: 24px; display: block; margin-bottom: 8px;">🎨</span>
                            <strong style="color: #b45309; font-size: 14px; display: block; margin-bottom: 4px;">Ontwikkeling & Hobby</strong>
                            <p style="margin: 0; color: #b45309; font-size: 13px;">Een oude passie oppakken of een nieuwe vaardigheid leren.</p>
                        </div>
                        <div class="value-card ${geselecteerdeWaarden.includes('werk') ? 'selected-purple' : ''}" data-id="werk" data-color="purple" style="background: #f5f3ff; border: 2px solid #ddd6fe;">
                            <span class="checkmark">✓</span>
                            <span style="font-size: 24px; display: block; margin-bottom: 8px;">💼</span>
                            <strong style="color: #5b21b6; font-size: 14px; display: block; margin-bottom: 4px;">Werk & Doel</strong>
                            <p style="margin: 0; color: #6d28d9; font-size: 13px;">Investeren in je carrière of betekenisvol vrijwilligerswerk.</p>
                        </div>
                    </div>
                </div>

                <div class="stagger-3 button-group" style="display: flex; justify-content: space-between;">
                    <button type="button" id="btn-vorige" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        &larr; Vorige
                    </button>
                    <button type="button" id="btn-opslaan-waarden" style="background-color: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        De Tijdcapsule &rarr;
                    </button>
                </div>
            `;
        }
        else if (currentStepIndex === 3) {
            // DE TIJDCAPSULE
            headerTitle.textContent = "Een brief aan jezelf";
            const savedText = localStorage.getItem(`arminius_tijdcapsule_${actiefTraject}`) || '';

            html = `
                <div class="stagger-1" style="margin-bottom: 24px;">
                    <span style="font-size: 12px; font-weight: 600; color: #10b981; text-transform: uppercase; letter-spacing: 0.5px;">Stap 3 van 3</span>
                    <p style="font-size: 15px; color: #475569; margin-top: 6px;">Er gaan geheid momenten komen waarop je het zwaar krijgt of je motivatie wegzakt. Schrijf hieronder een korte, krachtige boodschap aan je 'toekomstige zelf'. Waarom doe je dit?</p>
                </div>

                <div class="stagger-2 info-block info-block-border-green" style="margin-bottom: 32px;">
                    <textarea id="capsule-input" class="textarea-capsule" placeholder="Beste ik, als je het nu even zwaar hebt, herinner je dan dat...">${escapeHtml(savedText)}</textarea>
                    <p style="margin: 12px 0 0 0; font-size: 13px; color: #64748b;">Deze boodschap wordt lokaal opgeslagen en kun je later op je profiel of tijdens moeilijke momenten teruglezen.</p>
                </div>

                <div class="stagger-3 button-group" style="display: flex; justify-content: space-between;">
                    <button type="button" id="btn-vorige" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        &larr; Vorige
                    </button>
                    <button type="button" id="btn-opslaan-capsule" style="background-color: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        Opslaan & Afronden 🎉
                    </button>
                </div>
            `;
        }
        else if (currentStepIndex === 4) {
            // COMPLETION
            html = `
                <div class="stagger-1" style="max-width: 600px; margin: 40px auto; padding: 32px; text-align: center; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                    <div style="font-size: 56px; margin-bottom: 16px;">🌅</div>
                    <h2 style="font-size: 24px; color: #1e293b; margin-bottom: 16px;">Gefeliciteerd!</h2>
                    <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 24px; max-width: 450px; margin-left: auto; margin-right: auto;">
                        Je hebt alle modules van de routekaart succesvol doorlopen. Je beschikt nu over een compleet fundament aan theorie en inzicht.
                    </p>
                    
                    <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin-bottom: 32px; text-align: left;">
                        <strong style="display: block; color: #1e3a8a; margin-bottom: 12px; font-size: 16px;">Hoe nu verder?</strong>
                        <p style="margin: 0 0 12px 0; color: #334155; font-size: 14px; line-height: 1.6;">
                            Vanaf nu draait het om <strong>onderhoud</strong>. Je actieve theorielessen zitten erop, maar blijf waakzaam. Om terugval te voorkomen, is het belangrijk dat je:
                        </p>
                        <ul style="margin: 0 0 16px 0; padding-left: 20px; color: #334155; font-size: 14px; line-height: 1.6;">
                            <li style="margin-bottom: 8px;">Blijft <strong>registreren</strong> in je logboek om inzicht te houden in je zucht.</li>
                            <li style="margin-bottom: 8px;">Eerdere theoriemodules <strong>nog eens doorleest</strong> als herinnering.</li>
                            <li>Je <strong>signaleringsplan actueel houdt</strong>. Je doelen, valkuilen of helpende handelingen veranderen immers naarmate je groeit.</li>
                        </ul>
                        <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.6; padding-top: 12px; border-top: 1px solid #bfdbfe;">
                            Onderin je navigatiebalk vind je straks bovendien de tab <em>Gereedschappen</em> om jezelf dagelijks of wekelijks scherp te houden.
                        </p>
                    </div>

                    <div class="button-group" style="justify-content: center;">
                        <button type="button" id="btn-close-module" style="background-color: #2563eb; color: white; border: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 15px; box-shadow: 0 2px 4px rgba(37,99,235,0.2);">
                            Terug naar routekaart
                        </button>
                    </div>
                </div>
            `;
        }

        pageContent.innerHTML = html;

        if (preserveScroll) window.scrollTo(0, scrollY);
        else window.scrollTo(0, 0);
    }

    // --- EVENT DELEGATION VOOR DE HELE MODULE ---
    if (container) {
        container.addEventListener('click', (e) => {
            if (e.target.closest('#btn-volgende')) {
                currentStepIndex++;
                renderStep();
                return;
            }
            if (e.target.closest('#btn-vorige')) {
                currentStepIndex--;
                renderStep();
                return;
            }
            
            // --- Waarden selectie ---
            const valueCard = e.target.closest('.value-card');
            if (valueCard) {
                const id = valueCard.getAttribute('data-id');
                const color = valueCard.getAttribute('data-color');
                const selectedClass = `selected-${color}`;
                
                if (geselecteerdeWaarden.includes(id)) {
                    geselecteerdeWaarden = geselecteerdeWaarden.filter(v => v !== id);
                    valueCard.classList.remove(selectedClass);
                } else {
                    geselecteerdeWaarden.push(id);
                    valueCard.classList.add(selectedClass);
                }
                return;
            }

            if (e.target.closest('#btn-opslaan-waarden')) {
                localStorage.setItem(`arminius_gekozen_waarden_${actiefTraject}`, JSON.stringify(geselecteerdeWaarden));
                currentStepIndex = 3;
                renderStep();
                return;
            }

            if (e.target.closest('#btn-opslaan-capsule')) {
                const capsuleInp = container.querySelector('#capsule-input');
                if (capsuleInp) {
                    const text = capsuleInp.value.trim();
                    if(text) localStorage.setItem(`arminius_tijdcapsule_${actiefTraject}`, text);
                }
                currentStepIndex = 4;
                triggerConfetti();
                renderStep();
                return;
            }

            if (e.target.closest('#btn-close-module')) {
                if (onComplete) onComplete();
                return;
            }
        });
    }

    // Start eerste render
    renderStep();
}