// src/components/gereedschapskist/gereedschapskist.js

import { renderDagboekModule } from './dagboek/dagboek.js';
import { renderActiviteitenModule } from './activiteiten/activiteiten.js';
import { renderAdemhalingModule } from './ademhaling/ademhaling.js';
import { renderLeefstijlModule } from './leefstijl/leefstijl.js';
import { renderGeluidenModule } from './geluiden/geluiden.js';

function loadCSS() {
    const cssUrl = new URL('./gereedschapskist.css', import.meta.url).href;
    if (!document.querySelector(`link[href="${cssUrl}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssUrl;
        document.head.appendChild(link);
    }
}

export function renderGereedschapskist(containerElement) {
    loadCSS();
    window.scrollTo(0, 0);

    const container = containerElement || document.getElementById('app-content');
    if (!container) return;

    const tools = [
        { 
            id: 'dagboek', 
            title: 'Dagboek', 
            desc: 'Reflecteer op je dag en sluit rustig af.', 
            icon: '📖', 
            bg: '#eff6ff', 
            color: '#3b82f6',
            delay: 'stagger-delay-1'
        },
        { 
            id: 'activiteiten', 
            title: 'Activiteiten', 
            desc: 'Een lijst met plezierige bezigheden.', 
            icon: '🎨', 
            bg: '#fffbeb', 
            color: '#f59e0b',
            delay: 'stagger-delay-2'
        },
        { 
            id: 'ademhaling', 
            title: 'Ademhaling', 
            desc: 'Oefeningen om direct tot rust te komen.', 
            icon: '🌬️', 
            bg: '#f0fdf4', 
            color: '#10b981',
            delay: 'stagger-delay-3'
        },
        { 
            id: 'leefstijl', 
            title: 'Leefstijl', 
            desc: 'Basisinformatie over een gezond fundament.', 
            icon: '🍏', 
            bg: '#fdf2f8', 
            color: '#ec4899',
            delay: 'stagger-delay-4'
        },
        { 
            id: 'geluiden', 
            title: 'Rustgevende Geluiden', 
            desc: 'Kalmerende geluiden voor snelle grounding.', 
            icon: '🎧', 
            bg: '#f5f3ff', 
            color: '#8b5cf6',
            delay: 'stagger-delay-5'
        }
    ];

    let gridHtml = '';
    tools.forEach(tool => {
        gridHtml += `
            <div class="gk-card ${tool.delay}" data-tool-id="${tool.id}">
                <div class="gk-icon-wrapper" style="background-color: ${tool.bg}; color: ${tool.color};">
                    ${tool.icon}
                </div>
                <div class="gk-card-text">
                    <h3>${tool.title}</h3>
                    <p>${tool.desc}</p>
                </div>
            </div>
        `;
    });

    container.innerHTML = `
        <div class="gk-container">
            <div class="gk-header">
                <span>Ondersteuning & Zelfzorg</span>
                <h1>Hulpmiddelen</h1>
            </div>
            
            <div class="gk-grid">
                ${gridHtml}
            </div>
        </div>
    `;

    container.onclick = (e) => {
        const card = e.target.closest('.gk-card');
        if (card) {
            const toolId = card.getAttribute('data-tool-id');
            openTool(toolId);
        }
    };

    function openTool(toolId) {
        if (window.pushAppHistory) window.pushAppHistory('tools-sub');

        if (toolId === 'dagboek') {
            renderDagboekModule(container, () => renderGereedschapskist(container));
        } else if (toolId === 'activiteiten') {
            renderActiviteitenModule(container, () => renderGereedschapskist(container));
        } else if (toolId === 'ademhaling') {
            renderAdemhalingModule(container, () => renderGereedschapskist(container));
        } else if (toolId === 'leefstijl') {
            renderLeefstijlModule(container, () => renderGereedschapskist(container));
        } else if (toolId === 'geluiden') {
            renderGeluidenModule(container, () => renderGereedschapskist(container));
        } else {
            alert(`Je klikte op: ${toolId}.`);
        }
    }
}