// src/components/gereedschapskist/geluiden/geluiden.js

function loadCSS() {
    const cssUrl = new URL('./geluiden.css', import.meta.url).href;
    if (!document.querySelector(`link[href="${cssUrl}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssUrl;
        document.head.appendChild(link);
    }
}

const geluidenData = [
    { id: 'regen', titel: 'Regen', desc: 'Zachte, constante regendruppels', icon: '🌧️', bg: '#eff6ff', file: 'src/assets/audio/regen.mp3', volume: 50 },
    { id: 'zee', titel: 'Aan het strand', desc: 'Het ritmische geluid van de branding', icon: '🌊', bg: '#f0fdf4', file: 'src/assets/audio/strand.mp3', volume: 50 },
    { id: 'wind', titel: 'Wind', desc: 'Een kalmerend briesje door de bomen', icon: '🍃', bg: '#f8fafc', file: 'src/assets/audio/wind.mp3', volume: 50 },
    { id: 'vogels', titel: 'Fluitende Vogels', desc: 'Een vroege lenteochtend in het bos', icon: '🐦', bg: '#fefce8', file: 'src/assets/audio/vogels.mp3', volume: 50 },
    { id: 'onweer', titel: 'Onweer', desc: 'In de verte rommelende donder', icon: '⛈️', bg: '#f5f3ff', file: 'src/assets/audio/onweer.mp3', volume: 50 },
    { id: 'kampvuur', titel: 'Kampvuur', desc: 'Knisperend hout voor een warm gevoel', icon: '🔥', bg: '#fff1f2', file: 'src/assets/audio/kampvuur.mp3', volume: 50 }
];

// Perfect gecentreerde SVG iconen
const svgPlay = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
const svgPause = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

let huidigeAudio = null;
let actiefGeluidId = null;

export function renderGeluidenModule(containerElement, onBackToKist) {
    loadCSS();
    window.scrollTo(0, 0);

    const container = containerElement || document.getElementById('app-content');
    if (!container) return;

    function renderView() {
        let html = `
            <div style="padding: 20px;">
                <div class="module-container geluiden-container" style="max-width: 600px; margin: 0 auto;">
                    
                    <div style="margin-bottom: 32px;" class="stagger-1">
                        <span style="font-size: 14px; font-weight: 800; color: #8b5cf6; text-transform: uppercase; letter-spacing: 1px;">Hulpmiddelen</span>
                        <h2 style="font-size: 28px; color: #1e293b; margin-top: 4px; font-weight: 800;">Rustgevende Geluiden</h2>
                    </div>

                    <div class="geluiden-intro-card stagger-1">
                        <h3><span>🎧</span> Sluit je af voor onrust</h3>
                        <p>Constante, natuurlijke achtergrondgeluiden helpen je brein om te focussen. Ze leggen een verzachtende deken over storende prikkels uit je omgeving en dempen rondrazende gedachten.</p>
                    </div>

                    <div class="stagger-2">
        `;

        geluidenData.forEach(geluid => {
            const isActive = actiefGeluidId === geluid.id;
            const playIcon = isActive ? svgPause : svgPlay;
            
            html += `
                <div class="sound-card ${isActive ? 'active-sound' : ''}" id="card-${geluid.id}">
                    <div class="sound-header">
                        <div class="sound-info-group">
                            <div class="sound-icon" style="background-color: ${geluid.bg};">${geluid.icon}</div>
                            <div>
                                <h4 class="sound-title">${geluid.titel}</h4>
                                <p class="sound-desc">${geluid.desc}</p>
                            </div>
                        </div>
                        <button class="play-btn" data-id="${geluid.id}" aria-label="Afspelen/Pauzeren">
                            ${playIcon}
                        </button>
                    </div>
                    <div class="volume-control">
                        <span class="volume-icon">🔈</span>
                        <input type="range" class="volume-slider" data-id="${geluid.id}" min="0" max="100" value="${geluid.volume}">
                        <span class="volume-icon">🔊</span>
                    </div>
                </div>
            `;
        });

        html += `
                    </div>
                    
                    <div class="stagger-3" style="margin-top: 32px;">
                        <button id="btn-terug-kist" class="btn-secondary">&larr; Terug naar Hulpmiddelen</button>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }

    function updateUI() {
        container.querySelectorAll('.sound-card').forEach(card => {
            card.classList.remove('active-sound');
            const btn = card.querySelector('.play-btn');
            if (btn) btn.innerHTML = svgPlay; // Veranderd naar innerHTML voor de SVG
        });

        if (actiefGeluidId) {
            const activeCard = container.querySelector(`#card-${actiefGeluidId}`);
            if (activeCard) {
                activeCard.classList.add('active-sound');
                const btn = activeCard.querySelector('.play-btn');
                if (btn) btn.innerHTML = svgPause; // Veranderd naar innerHTML voor de SVG
            }
        }
    }

    function stopHuidigeAudio() {
        if (huidigeAudio) {
            huidigeAudio.pause();
            huidigeAudio.currentTime = 0;
            huidigeAudio = null;
        }
        actiefGeluidId = null;
    }

    function togglePlay(geluidId) {
        const geluid = geluidenData.find(g => g.id === geluidId);
        if (!geluid) return;

        if (actiefGeluidId === geluidId) {
            stopHuidigeAudio();
        } else {
            stopHuidigeAudio();
            
            huidigeAudio = new Audio(geluid.file);
            huidigeAudio.loop = true; 
            huidigeAudio.volume = geluid.volume / 100;
            
            huidigeAudio.play().catch(e => console.log("Audiofout:", e));
            actiefGeluidId = geluidId;
        }
        
        updateUI(); 
    }

    // Event listeners
    container.onclick = (e) => {
        if (e.target.closest('#btn-terug-kist')) {
            stopHuidigeAudio();
            if (onBackToKist) onBackToKist();
            return;
        }

        const playBtn = e.target.closest('.play-btn');
        if (playBtn) {
            const id = playBtn.getAttribute('data-id');
            togglePlay(id);
        }
    };

    container.addEventListener('input', (e) => {
        if (e.target.classList.contains('volume-slider')) {
            const id = e.target.getAttribute('data-id');
            const nieuwVolume = e.target.value;
            
            const geluid = geluidenData.find(g => g.id === id);
            if (geluid) {
                geluid.volume = nieuwVolume;
            }
            
            if (huidigeAudio && actiefGeluidId === id) {
                huidigeAudio.volume = nieuwVolume / 100;
            }
        }
    });

    renderView();
}