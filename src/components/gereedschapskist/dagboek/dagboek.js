// src/components/gereedschapskist/dagboek/dagboek.js

function loadCSS() {
    const cssUrl = new URL('./dagboek.css', import.meta.url).href;
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

const stemmingsOpties = [
    { id: 'blij', emoji: '😊', label: 'Blij' },
    { id: 'ontspannen', emoji: '😌', label: 'Ontspannen' },
    { id: 'bedroefd', emoji: '😢', label: 'Bedroefd' },
    { id: 'bang', emoji: '😨', label: 'Bang' },
    { id: 'boos', emoji: '😡', label: 'Boos' },
    { id: 'beschaamd', emoji: '😳', label: 'Beschaamd' }
];

export function renderDagboekModule(containerElement, onBackToKist) {
    loadCSS();
    window.scrollTo(0, 0);

    const container = containerElement || document.getElementById('app-content');
    if (!container) return;

    // GLOBALE OPSLAG: Niet meer afhankelijk van actieveVerslaving
    const lsKey = `arminius_dagboek_data_globaal`;
    
    let notities = [];
    let isEditing = false;
    let currentFilter = 'all'; // State voor de emoji filter

    let huidigeNotitie = {
        id: null,
        datum: '',
        stemming: '',
        tekst: '',
        conclusie: ''
    };

    try {
        const storedStr = localStorage.getItem(lsKey);
        if (storedStr) notities = JSON.parse(storedStr);
    } catch (e) {}

    function saveNotities() {
        localStorage.setItem(lsKey, JSON.stringify(notities));
    }

    container.innerHTML = `
        <div style="padding: 20px;">
            <div class="module-container db-container" style="max-width: 700px; margin: 0 auto;">
                <div style="margin-bottom: 32px;" id="db-main-header">
                    <span style="font-size: 12px; font-weight: 600; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.5px;">Hulpmiddelen</span>
                    <h2 style="font-size: 28px; color: #1e293b; margin-top: 4px; font-weight: 800;" id="db-header-title">Dagboek</h2>
                </div>

                <div id="db-page-content"></div>
            </div>
        </div>
    `;

    const pageContent = container.querySelector('#db-page-content');
    const headerTitle = container.querySelector('#db-header-title');

    function renderView() {
        const scrollY = window.scrollY;
        
        if (!isEditing) {
            // --- OVERZICHTSPAGINA ---
            headerTitle.textContent = "Mijn Dagboek";
            
            let overzichtHtml = `
                <div class="stagger-1" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
                    <p style="margin: 0; font-size: 15px; color: #475569;">Even stilstaan bij de dag.</p>
                    <button type="button" id="btn-nieuw" style="background-color: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; box-shadow: 0 2px 4px rgba(59,130,246,0.2);">
                        + Nieuwe notitie
                    </button>
                </div>
            `;

            if (notities.length === 0) {
                overzichtHtml += `
                    <div class="stagger-2 db-info-block" style="text-align: center; padding: 48px 24px;">
                        <div style="font-size: 48px; margin-bottom: 16px;">📖</div>
                        <h3 style="color: #1e293b; margin: 0 0 8px 0; font-size: 18px;">Nog geen notities</h3>
                        <p style="color: #64748b; font-size: 15px; margin: 0; line-height: 1.6;">
                            Schrijf de dingen van je af. Het hoeft niet altijd over verslaving te gaan; ook alledaagse overpeinzingen helpen om je hoofd leeg te maken voor het slapen.
                        </p>
                    </div>
                `;
            } else {
                // Mooie Mood-grid Filter balk rendering, met het reset-linkje subtiel naast de titel
                overzichtHtml += `
                    <div class="stagger-1" style="margin-bottom: 24px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <label style="font-size: 14px; font-weight: 700; color: #64748b; margin: 0;">Filter op stemming:</label>
                            ${currentFilter !== 'all' ? `<button type="button" class="filter-reset-btn" id="btn-reset-filter">Alle notities tonen</button>` : ''}
                        </div>
                        <div class="mood-grid">
                            ${stemmingsOpties.map(opt => `
                                <div class="mood-card filter-card ${currentFilter === opt.id ? 'active' : ''}" data-filter="${opt.id}">
                                    <span class="mood-emoji">${opt.emoji}</span>
                                    <span class="mood-label">${opt.label}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;

                // Sorteer van nieuw naar oud en filter
                let gefilterd = [...notities].sort((a, b) => b.id - a.id);
                if (currentFilter !== 'all') {
                    gefilterd = gefilterd.filter(n => n.stemming === currentFilter);
                }

                if (gefilterd.length === 0) {
                    overzichtHtml += `
                        <div class="stagger-2" style="text-align: center; padding: 32px 0;">
                            <p style="color: #94a3b8; font-size: 15px; font-style: italic;">Geen notities gevonden met deze stemming.</p>
                        </div>
                    `;
                } else {
                    overzichtHtml += `<div class="stagger-2">`;
                    gefilterd.forEach((noot) => {
                        const dateObj = new Date(noot.id);
                        const datumStr = dateObj.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute:'2-digit' });
                        const stemmingObj = stemmingsOpties.find(s => s.id === noot.stemming) || { emoji: '📝', label: 'Neutraal' };

                        overzichtHtml += `
                            <div class="log-card">
                                <button type="button" class="delete-btn" data-id="${noot.id}" title="Verwijder notitie">🗑️</button>
                                <div class="log-header">
                                    <span style="font-size: 24px;">${stemmingObj.emoji}</span>
                                    <div>
                                        <div class="log-date">${datumStr}</div>
                                        <div style="font-size: 13px; color: #94a3b8; font-weight: 600;">Voelt zich ${stemmingObj.label.toLowerCase()}</div>
                                    </div>
                                </div>
                                <p class="log-text">${escapeHtml(noot.tekst)}</p>
                                
                                ${noot.conclusie ? `
                                <div class="log-insight">
                                    <span class="log-insight-label">Geleerd:</span>
                                    <p class="log-insight-text">"${escapeHtml(noot.conclusie)}"</p>
                                </div>
                                ` : ''}
                            </div>
                        `;
                    });
                    overzichtHtml += `</div>`;
                }
            }

            overzichtHtml += `
                <div class="stagger-3" style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
                    <button type="button" id="btn-terug-kist" style="background-color: #64748b; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        &larr; Terug naar Hulpmiddelen
                    </button>
                </div>
            `;

            pageContent.innerHTML = overzichtHtml;
        } else {
            // --- INVOER FORMULIER ---
            headerTitle.textContent = "Nieuwe Notitie";
            
            const moodGridHtml = stemmingsOpties.map(opt => `
                <div class="mood-card form-mood-card ${huidigeNotitie.stemming === opt.id ? 'active' : ''}" data-mood="${opt.id}">
                    <span class="mood-emoji">${opt.emoji}</span>
                    <span class="mood-label">${opt.label}</span>
                </div>
            `).join('');

            pageContent.innerHTML = `
                <div class="stagger-1 db-info-block db-info-block-soft">
                    <label style="display: block; font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 4px;">1. Hoe voel je je vandaag?</label>
                    <p style="font-size: 13px; color: #64748b; margin: 0 0 8px 0;">Kies de stemming die nu het beste bij je past.</p>
                    <div class="mood-grid" id="stemming-selector">
                        ${moodGridHtml}
                    </div>
                </div>

                <div class="stagger-2 db-info-block">
                    <label style="display: block; font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 4px;">2. Waar denk je aan?</label>
                    <p style="font-size: 13px; color: #64748b; margin: 0 0 16px 0;">Schrijf vrijuit over wat je bezighoudt, een gebeurtenis van vandaag, of een gevoel dat je kwijt wilt.</p>
                    <textarea id="dagboek-tekst" class="db-textarea db-textarea-large" placeholder="Vandaag was een dag waarop...">${escapeHtml(huidigeNotitie.tekst)}</textarea>
                </div>

                <div class="stagger-3 db-info-block">
                    <label style="display: block; font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 4px;">3. Inzicht (Optioneel)</label>
                    <p style="font-size: 13px; color: #64748b; margin: 0 0 16px 0;">Wat heb je hiervan geleerd, of wat wil je uit deze dag meenemen naar morgen?</p>
                    <textarea id="dagboek-conclusie" class="db-textarea db-textarea-small" placeholder="Ik besefte vandaag dat...">${escapeHtml(huidigeNotitie.conclusie)}</textarea>
                </div>

                <div class="stagger-4 button-group" style="display: flex; justify-content: space-between; margin-top: 24px;">
                    <button type="button" id="btn-annuleren" style="background-color: #ffffff; color: #475569; border: 1px solid #cbd5e1; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px;">
                        Annuleren
                    </button>
                    <button type="button" id="btn-opslaan" style="background-color: #3b82f6; color: white; border: none; padding: 12px 32px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 14px; box-shadow: 0 2px 4px rgba(59,130,246,0.2);">
                        Opslaan & Afronden
                    </button>
                </div>
            `;
        }

        window.scrollTo(0, scrollY);
    }

    // --- Event Delegation ---
    container.addEventListener('click', (e) => {
        // Terug naar Gereedschapskist
        if (e.target.closest('#btn-terug-kist')) {
            if (onBackToKist) onBackToKist();
            return;
        }

        // Nieuwe Notitie starten
        if (e.target.closest('#btn-nieuw')) {
            isEditing = true;
            huidigeNotitie = { id: Date.now(), datum: new Date().toISOString(), stemming: '', tekst: '', conclusie: '' };
            renderView();
            return;
        }

        // Notitie Annuleren
        if (e.target.closest('#btn-annuleren')) {
            isEditing = false;
            renderView();
            return;
        }

        // Stemming selecteren in formulier
        const formMoodCard = e.target.closest('.form-mood-card');
        if (formMoodCard) {
            container.querySelectorAll('.form-mood-card').forEach(c => c.classList.remove('active'));
            formMoodCard.classList.add('active');
            huidigeNotitie.stemming = formMoodCard.getAttribute('data-mood');
            return;
        }

        // Filter knop selecteren in overzicht
        const filterCard = e.target.closest('.filter-card');
        if (filterCard) {
            const mood = filterCard.getAttribute('data-filter');
            // Toggle logica: Als je op de reeds actieve klikt, de-selecteer je hem
            if (currentFilter === mood) {
                currentFilter = 'all';
            } else {
                currentFilter = mood;
            }
            renderView();
            return;
        }

        // Reset filter via tekstlinkje
        if (e.target.closest('#btn-reset-filter')) {
            currentFilter = 'all';
            renderView();
            return;
        }

        // Notitie Opslaan
        if (e.target.closest('#btn-opslaan')) {
            const tekstVeld = container.querySelector('#dagboek-tekst');
            const conclusieVeld = container.querySelector('#dagboek-conclusie');
            
            if (!huidigeNotitie.stemming) {
                alert("Kies even een stemming voordat je opslaat.");
                return;
            }
            if (tekstVeld.value.trim() === '') {
                alert("Schrijf in ieder geval een korte zin bij stap 2.");
                return;
            }

            huidigeNotitie.tekst = tekstVeld.value.trim();
            huidigeNotitie.conclusie = conclusieVeld.value.trim();
            
            notities.push({...huidigeNotitie});
            saveNotities();
            
            isEditing = false;
            currentFilter = 'all'; // Reset filter zodat de nieuwe notitie direct zichtbaar is
            renderView();
            return;
        }

        // Notitie Verwijderen
        const deleteBtn = e.target.closest('.delete-btn');
        if (deleteBtn) {
            if (confirm("Weet je zeker dat je deze notitie wilt weggooien?")) {
                const id = parseInt(deleteBtn.getAttribute('data-id'));
                notities = notities.filter(n => n.id !== id);
                saveNotities();
                renderView();
            }
            return;
        }
    });

    renderView();
}