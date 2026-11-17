// src/components/modules/persoonlijk/persoonlijk.js

function loadPersoonlijkCSS() {
    const cssUrl = new URL('./persoonlijk.css', import.meta.url).href;
    if (!document.querySelector(`link[href="${cssUrl}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssUrl;
        document.head.appendChild(link);
    }
}

function loadChartJS(callback) {
    if (window.Chart) {
        callback();
    } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = callback;
        document.head.appendChild(script);
    }
}

const trajectConfig = {
    'alcohol': { naam: 'Alcohol', icon: '🍺' },
    'cannabis': { naam: 'Cannabis', icon: '🌿' },
    'cocaine': { naam: 'Cocaïne', icon: '❄️' },
    'gokken': { naam: 'Gokken', icon: '🎰' }
};

const mottos = [
    "Elke stap voorwaarts brengt helderheid en kracht.",
    "Alles komt goed.",
    "Morgen weer een nieuwe dag.",
    "Na regen komt zonneschijn.",
    "Carpe diem.",
    "Pluk de dag.",
    "Eén dag tegelijk.",
    "Je bent sterker dan je denkt.",
    "Vooruitgang, geen perfectie.",
    "Vallen en weer opstaan.",
    "One day at a time.",
    "Progress, not perfection.",
    "This too shall pass.",
    "You've got this."
];

// Helper: Haalt de ruwe opgeslagen data uit registraties.js
function getRegAmount(reg, traject) {
    let total = 0;
    if (reg.actieType === 'alternatief') return 0;

    if (traject === 'alcohol') {
        if (reg.gebruikDetails && reg.gebruikDetails.berekend) {
            total += parseFloat(String(reg.gebruikDetails.berekend).replace(',', '.')) || 0;
        } else if (reg.gebruikDetails && reg.gebruikDetails.aantal) {
            total += parseFloat(String(reg.gebruikDetails.aantal).replace(',', '.')) || 0;
        }

        if (reg.extraMiddelen && Array.isArray(reg.extraMiddelen)) {
            reg.extraMiddelen.forEach(extra => {
                if (extra.type === 'alcohol' && extra.berekend) {
                    total += parseFloat(String(extra.berekend).replace(',', '.')) || 0;
                } else if (extra.aantal) {
                    total += parseFloat(String(extra.aantal).replace(',', '.')) || 0;
                }
            });
        }
        return total > 0 ? total : 1; 
    } else {
        if (reg.gebruikDetails && reg.gebruikDetails.aantal) {
            total += parseFloat(String(reg.gebruikDetails.aantal).replace(',', '.')) || 0;
        }
        if (reg.extraMiddelen && Array.isArray(reg.extraMiddelen)) {
            reg.extraMiddelen.forEach(extra => {
                if (extra.aantal) {
                    total += parseFloat(String(extra.aantal).replace(',', '.')) || 0;
                }
            });
        }
        return total > 0 ? total : 1;
    }
}

// Helper: Berekent de dagelijkse limiet op basis van Doelen Stellen
function getMaxAllowedPerDag(goalData, traject) {
    if (!goalData) return Infinity;
    if (goalData.type === 'stoppen') return 0;
    
    if (goalData.type === 'minderen') {
        if (traject === 'alcohol') {
            if (goalData.minderingItems && goalData.minderingItems.length > 0) {
                let maxStGlazen = 0;
                goalData.minderingItems.forEach(item => {
                    const liters = parseFloat(String(item.maat || 0).replace(',', '.'));
                    const perc = parseFloat(String(item.percentage || 0).replace(',', '.'));
                    const stGl = (liters * (perc / 100)) / 0.01;
                    maxStGlazen += stGl * (parseFloat(String(item.aantalPerDag || 0).replace(',', '.')));
                });
                return maxStGlazen;
            }
        } else {
            if (goalData.minderingItems && goalData.minderingItems.length > 0) {
                return Math.max(...goalData.minderingItems.map(i => parseFloat(String(i.aantalPerDag || Infinity).replace(',', '.'))));
            }
        }
    }
    return Infinity;
}

// Helper: Berekent de wekelijkse limiet
function getMaxAllowedPerWeek(goalData, traject) {
    if (!goalData || goalData.type === 'stoppen') return 0;
    if (goalData.type === 'minderen' && goalData.minderingItems) {
        if (traject === 'alcohol') {
            let maxStGlazen = 0;
            goalData.minderingItems.forEach(item => {
                const liters = parseFloat(String(item.maat || 0).replace(',', '.'));
                const perc = parseFloat(String(item.percentage || 0).replace(',', '.'));
                const stGl = (liters * (perc / 100)) / 0.01;
                maxStGlazen += stGl * (parseFloat(String(item.aantalPerWeek || 0).replace(',', '.')));
            });
            return maxStGlazen;
        } else {
            return Math.max(...goalData.minderingItems.map(i => parseFloat(String(i.aantalPerWeek || Infinity).replace(',', '.'))));
        }
    }
    return Infinity;
}

export function renderPersoonlijkModule() {
    window.scrollTo(0, 0);
    loadPersoonlijkCSS();

    const registratiesData = JSON.parse(localStorage.getItem('registratiesData') || '[]');
    const mijnTrajecten = JSON.parse(localStorage.getItem('mijnTrajecten') || '[]');
    const opgeslagenMotto = localStorage.getItem('persoonlijkMotto');
    const huidigMotto = opgeslagenMotto || mottos[0];

    function berekenSuccesRatio(regs, middel, goalData) {
        const trajectRegs = regs.filter(r => r.middel === middel);
        if (!trajectRegs || trajectRegs.length === 0) return { ratio: 0, totaal: 0, gehoudenAanDoel: 0 };
        
        const maxAllowed = getMaxAllowedPerDag(goalData, middel);
        const groupedByDate = {};
        
        trajectRegs.forEach(reg => {
            const dateObj = new Date(reg.tijdstip);
            dateObj.setHours(0,0,0,0);
            const ts = dateObj.getTime();
            if (!groupedByDate[ts]) groupedByDate[ts] = 0;
            if (reg.actieType !== 'alternatief') {
                groupedByDate[ts] += getRegAmount(reg, middel);
            }
        });

        const minTs = Math.min(...trajectRegs.map(r => new Date(r.tijdstip).setHours(0,0,0,0)));
        let curr = new Date(minTs);
        const maxDateObj = new Date();
        maxDateObj.setHours(0,0,0,0);

        while (curr <= maxDateObj) {
            const ts = curr.getTime();
            if (groupedByDate[ts] === undefined) {
                groupedByDate[ts] = 0;
            }
            curr.setDate(curr.getDate() + 1);
        }

        let gehoudenAanDoel = 0;
        const totalDays = Object.keys(groupedByDate).length;

        Object.values(groupedByDate).forEach(dailyAmount => {
            if (dailyAmount <= maxAllowed + 0.01) { 
                gehoudenAanDoel++;
            }
        });

        const ratio = totalDays > 0 ? Math.round((gehoudenAanDoel / totalDays) * 100) : 0;
        return { ratio, totaal: totalDays, gehoudenAanDoel };
    }

    let trajectenHTML = '';

    if (mijnTrajecten.length === 0) {
        trajectenHTML = `
            <div style="text-align: center; padding: 30px 16px; background: #ffffff; border-radius: 20px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); color: #64748b; width: 100%; max-width: 100%;">
                <div style="font-size: 40px; margin-bottom: 12px;">🧭</div>
                <h3 style="margin: 0 0 6px 0; color: #1e293b; font-size: 16px;">Nog geen trajecten actief</h3>
                <p style="margin: 0; font-size: 14px;">Kies een traject via het menu rechtsboven om hier je doelen en voortgang te zien.</p>
            </div>
        `;
    } else {
        mijnTrajecten.forEach(traject => {
            const config = trajectConfig[traject] || { naam: traject, icon: '📌' };
            
            const savedGoalStr = localStorage.getItem(`arminius_user_goal_${traject}`);
            let doelTekst = "<em>Nog geen doel geformuleerd.</em>";
            let parsedGoalData = null;

            if (savedGoalStr) {
                try {
                    parsedGoalData = JSON.parse(savedGoalStr);
                    if (parsedGoalData.type === 'stoppen') {
                        doelTekst = `Volledig stoppen met ${config.naam.toLowerCase()}`;
                    } else if (parsedGoalData.type === 'minderen') {
                        let itemsSummary = (parsedGoalData.minderingItems || []).map(item => {
                            let name = item.drank ? item.drank.charAt(0).toUpperCase() + item.drank.slice(1) : 'Middel';
                            let maxDag = item.aantalPerDag || '?';
                            let maxWeek = item.aantalPerWeek || '?';
                            
                            if (traject === 'alcohol') {
                                const liters = parseFloat(String(item.maat || 0).replace(',', '.'));
                                const perc = parseFloat(String(item.percentage || 0).replace(',', '.'));
                                const stGlPerItem = (liters * (perc / 100)) / 0.01;
                                
                                const stGlDag = (stGlPerItem * parseFloat(String(maxDag).replace(',', '.'))).toFixed(1).replace('.0', '');
                                const stGlWeek = (stGlPerItem * parseFloat(String(maxWeek).replace(',', '.'))).toFixed(1).replace('.0', '');
                                
                                return `${name} (max. ${maxDag}/dag = ca. ${stGlDag} standaardglazen, max. ${maxWeek}/week = ca. ${stGlWeek} standaardglazen)`;
                            } else {
                                return `${name} (max. ${maxDag}/dag, ${maxWeek}/week)`;
                            }
                        }).join('<br>');
                        
                        doelTekst = `<strong>Minderen met ${config.naam.toLowerCase()}:</strong><br><span style="font-size: 15px; font-weight: normal; line-height: 1.6; display: block; margin-top: 4px;">${itemsSummary}</span>`;
                    }
                } catch (e) {
                    doelTekst = savedGoalStr.replace(/"/g, '');
                }
            }

            const succesData = berekenSuccesRatio(registratiesData, traject, parsedGoalData);

            const savedRedenenStr = localStorage.getItem(`arminius_module_redenen_data_${traject}`);
            let top3HTML = '';
            if (savedRedenenStr) {
                try {
                    const savedRedenen = JSON.parse(savedRedenenStr);
                    if (savedRedenen.top3 && savedRedenen.top3.length > 0) {
                        top3HTML = `
                            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px;">
                                ${savedRedenen.top3.map((item, index) => {
                                    const isNadeel = item.type === 'Nadeel';
                                    const bgColor = isNadeel ? '#fef2f2' : '#f0fdf4';
                                    const borderColor = isNadeel ? '#ef4444' : '#10b981';
                                    
                                    return `
                                        <li style="display: flex; align-items: center; gap: 14px; background: ${bgColor}; padding: 14px; border-radius: 12px; border-left: 4px solid${borderColor}; box-sizing: border-box; max-width: 100%;">
                                            <div style="background: ${borderColor}; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 15px; flex-shrink: 0; text-align: center; line-height: 1;">
                                                ${index + 1}
                                            </div>
                                            <div style="font-size: 14px; color: #1e293b; line-height: 1.4; word-break: break-word;">
                                                <strong>${isNadeel ? '⚠️' : '✨'} ${item.type}:</strong>${item.text}
                                            </div>
                                        </li>
                                    `;
                                }).join('')}
                            </ul>
                        `;
                    }
                } catch (e) {}
            }
            if (!top3HTML) {
                top3HTML = `<div style="text-align: center; padding: 16px; background: #f8fafc; border-radius: 12px; border: 1px dashed #cbd5e1; color: #64748b; font-size: 15px;">Nog geen Top 3 ingesteld.</div>`;
            }

            const maxWeekAllowed = getMaxAllowedPerWeek(parsedGoalData, traject);
            let weekTotal = 0;
            let weekBarHTML = '';

            if (maxWeekAllowed > 0 && maxWeekAllowed !== Infinity) {
                const now = new Date();
                const currentDay = now.getDay(); 
                const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() + diffToMonday);
                startOfWeek.setHours(0,0,0,0);

                const trajectRegs = registratiesData.filter(r => r.middel === traject);
                trajectRegs.forEach(reg => {
                    const regDate = new Date(reg.tijdstip);
                    if (regDate >= startOfWeek && reg.actieType !== 'alternatief') {
                        weekTotal += getRegAmount(reg, traject);
                    }
                });

                const percentage = Math.min((weekTotal / maxWeekAllowed) * 100, 100);
                let barColor = '#10b981'; 
                if (weekTotal > maxWeekAllowed) barColor = '#ef4444'; 
                else if (percentage >= 80) barColor = '#f59e0b'; 

                const eenheidLabel = traject === 'alcohol' ? 'standaardglazen' : 'eenheden';

                weekBarHTML = `
                    <div style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed #cbd5e1; box-sizing: border-box; max-width: 100%;">
                        <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; color: #475569; margin-bottom: 8px;">
                            <span>Weekvoortgang (ma-zo)</span>
                            <span>${weekTotal.toFixed(1).replace('.0', '')} / ${maxWeekAllowed.toFixed(1).replace('.0', '')} ${eenheidLabel}</span>
                        </div>
                        <div style="height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; position: relative;">
                            <div style="height: 100%; width: ${percentage}%; background: ${barColor}; border-radius: 4px; transition: width 0.5s ease-out;"></div>
                        </div>
                    </div>
                `;
            }

            trajectenHTML += `
                <div class="responsive-card stagger-2" style="background: #ffffff; border-radius: 20px; padding: 16px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); margin-bottom: 24px; border-top: 5px solid #2563eb; box-sizing: border-box; width: 100%; max-width: 100%; overflow: hidden;">
                    
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px; width: 100%; max-width: 100%;">
                        <span style="font-size: 28px;">${config.icon}</span>
                        <h3 style="margin: 0; font-size: 20px; font-weight: 800; color: #1e293b;">Mijn traject: ${config.naam}</h3>
                    </div>

                    <div style="display: flex; gap: 20px; flex-wrap: wrap; box-sizing: border-box; width: 100%; max-width: 100%;">
                        
                        <div style="flex: 1 1 280px; min-width: 0; max-width: 100%; display: flex; flex-direction: column; gap: 16px; box-sizing: border-box;">
                            <div style="max-width: 100%;">
                                <h4 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 700; color: #1e293b;">Mijn Doel & Redenen</h4>
                                <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 14px; border-radius: 0 10px 10px 0; box-sizing: border-box; word-break: break-word; max-width: 100%;">
                                    <strong style="color: #1e40af; display: block; margin-bottom: 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Mijn doel is:</strong>
                                    <span style="font-size: 15px; color: #1e293b; font-weight: 600; line-height: 1.5;">${doelTekst}</span>
                                </div>
                            </div>
                            <div style="max-width: 100%;">
                                ${top3HTML}
                            </div>
                        </div>

                        <div style="flex: 1 1 280px; min-width: 0; max-width: 100%; display: flex; flex-direction: column; gap: 16px; box-sizing: border-box;">
                            <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 14px; padding: 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; box-sizing: border-box; width: 100%; max-width: 100%;">
                                <div style="min-width: 0; flex: 1;">
                                    <h4 style="margin: 0 0 4px 0; color: #1e40af; font-size: 15px; font-weight: 700;">Slagingspercentage</h4>
                                    <p style="margin: 0; color: #3b82f6; font-size: 15px; line-height: 1.4; word-break: break-word;">Op <strong>${succesData.gehoudenAanDoel} van de ${succesData.totaal}</strong> geregistreerde dagen hield je je aan je gestelde dagdoel.</p>
                                </div>
                                <div style="background: #ffffff; padding: 8px 16px; border-radius: 10px; box-shadow: 0 2px 4px rgb(0 0 0 / 0.05); text-align: center; flex-shrink: 0;">
                                    <span style="display: block; font-size: 24px; font-weight: 800; color: ${succesData.ratio >= 50 ? '#10b981' : '#f59e0b'};">${succesData.ratio}%</span>
                                </div>
                            </div>

                            <div style="box-sizing: border-box; width: 100%; min-width: 0; max-width: 100%;">
                                <h4 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 700; color: #1e293b;">Voortgang Registraties</h4>
                                <div class="chart-scroll-container" style="position: relative; width: 100%; max-width: 100%; background: #f8fafc; border-radius: 12px; padding: 8px; box-sizing: border-box; overflow-x: auto; overflow-y: hidden;">
                                    <div id="grafiek-wrapper-${traject}" style="min-width: 100%; height: 180px;">
                                        <canvas id="grafiek-${traject}"></canvas>
                                    </div>
                                </div>
                                ${weekBarHTML}
                            </div>
                        </div>

                    </div>

                </div>
            `;
        });
    }

    const htmlContent = `
        <div id="persoonlijk-module-root" class="module-container" style="font-family: 'Nunito', sans-serif; color: #1e293b; width: 100%; max-width: 100%; margin: 0; padding: 8px; box-sizing: border-box; padding-bottom: 100px; overflow-x: hidden;">
            
            <div class="stagger-1" style="background: #ffffff; border-radius: 20px; padding: 28px 20px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 16px; margin-bottom: 24px; box-sizing: border-box; width: 100%; max-width: 100%;">
                
                <div style="position: relative; width: 120px; height: 120px; border-radius: 50%; background: #f1f5f9; border: 2px dashed #cbd5e1; display: flex; align-items: center; justify-content: center; cursor: pointer; overflow: hidden; flex-shrink: 0; margin: 0 auto;" title="Klik om profielfoto toe te voegen">
                    <span style="font-size: 56px; line-height: 1; display: flex; align-items: center; justify-content: center;">👤</span>
                    <input type="file" id="profielfoto-input" style="position: absolute; inset: 0; opacity: 0; cursor: pointer;" accept="image/*">
                </div>
                
                <div style="width: 100%; max-width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 6px; width: 100%;" id="motto-wrapper">
                        <span style="font-size: 11px; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Jouw Persoonlijke Kompas</span>
                        
                        <div style="position: relative; display: inline-block;">
                            <button type="button" id="btn-toggle-motto" style="background: none; border: none; font-size: 15px; cursor: pointer; color: #64748b; padding: 2px 4px; border-radius: 4px; transition: background 0.2s;" title="Verander motto">✏️</button>
                            
                            <div id="motto-dropdown" class="hidden" style="position: absolute; left: 50%; transform: translateX(-50%); top: 100%; background: white; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); padding: 8px; width: 260px; z-index: 100; max-height: 350px; overflow-y: auto; border: 1px solid #e2e8f0; margin-top: 4px; text-align: left;">
                                
                                <div style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; padding: 4px 8px; margin-bottom: 4px;">Eigen motto invullen</div>
                                <div style="padding: 0 8px 12px 8px; border-bottom: 1px solid #e2e8f0; margin-bottom: 8px;">
                                    <input type="text" id="custom-motto-input" placeholder="Typ je eigen motto..." style="width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid #cbd5e1; font-size: 15px; box-sizing: border-box; outline: none;">
                                    <button type="button" id="btn-save-custom-motto" style="margin-top: 6px; width: 100%; background: #2563eb; color: white; border: none; padding: 8px; border-radius: 6px; font-weight: 600; font-size: 14px; cursor: pointer;">Motto opslaan</button>
                                </div>

                                <div style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; padding: 4px 8px; margin-bottom: 4px;">Of kies een voorbeeld</div>
                                ${mottos.map((m) => `
                                    <div class="motto-option" data-motto="${m}" style="padding: 8px 10px; font-size: 15px; color: #1e293b; border-radius: 8px; cursor: pointer; transition: background 0.2s; ${m === huidigMotto ? 'background: #eff6ff; font-weight: 600; color: #2563eb;' : ''}">
                                        "${m}"
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <blockquote id="motto-display" style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-size: 20px; color: #0f172a; line-height: 1.3; max-width: 100%; text-align: center; word-break: break-word;">
                        "${huidigMotto}"
                    </blockquote>
                </div>

            </div>

            ${trajectenHTML}

            <div class="stagger-3" style="background: #ffffff; border-radius: 20px; padding: 20px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); box-sizing: border-box; width: 100%; max-width: 100%;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                    <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: #1e293b;">Inspiratie & Motivatie</h3>
                    <button type="button" id="btn-add-foto" style="background: #2563eb; color: #ffffff; border: none; border-radius: 20px; padding: 6px 14px; font-weight: 700; font-size: 14px; cursor: pointer; font-family: inherit;">+ Foto toevoegen</button>
                </div>
                <p style="margin: 0 0 16px 0; font-size: 15px; color: #64748b; line-height: 1.4;">Beelden die je kracht geven en herinneren aan je doelen.</p>
                
                <div id="fotoalbum-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 12px;">
                    <div style="aspect-ratio: 1; border-radius: 14px; background: #f8fafc; border: 2px dashed #e2e8f0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #94a3b8; font-size: 15px; font-weight: 600; text-align: center;">
                        <span style="font-size: 36px; line-height: 1;">🌄</span>
                        <span>Natuur / Rust</span>
                    </div>
                    <div style="aspect-ratio: 1; border-radius: 14px; background: #f8fafc; border: 2px dashed #e2e8f0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #94a3b8; font-size: 15px; font-weight: 600; text-align: center;">
                        <span style="font-size: 36px; line-height: 1;">🎯</span>
                        <span>Doelgericht</span>
                    </div>
                </div>
            </div>

        </div>
        <style>
            .motto-option:hover { background: #f1f5f9 !important; }
            #btn-toggle-motto:hover { background: #f1f5f9 !important; }
            .hidden { display: none !important; }
        </style>
    `;

    setTimeout(() => {
        initPersoonlijkListeners();
        
        loadChartJS(() => {
            mijnTrajecten.forEach(traject => {
                const trajectRegs = registratiesData.filter(r => r.middel === traject);
                
                const savedGoalStr = localStorage.getItem(`arminius_user_goal_${traject}`);
                let parsedGoalData = null;
                if (savedGoalStr) {
                    try { parsedGoalData = JSON.parse(savedGoalStr); } catch(e) {}
                }

                tekenGrafiek(trajectRegs, `grafiek-${traject}`, parsedGoalData, traject);
            });
        });
    }, 50);

    return htmlContent;
}

function tekenGrafiek(registraties, canvasId, goalData, traject) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (registraties.length === 0) {
        ctx.parentElement.innerHTML = `<div style="height: 100%; display:flex; align-items:center; justify-content:center; color:#94a3b8; font-size:13px; font-style:italic; text-align:center; padding: 10px;">Nog geen registraties voor dit traject.</div>`;
        return;
    }

    let maxAllowedPerDag = getMaxAllowedPerDag(goalData, traject);
    const groupedByDate = {};
    
    registraties.forEach(reg => {
        const dateObj = new Date(reg.tijdstip);
        dateObj.setHours(0,0,0,0); 
        const ts = dateObj.getTime();
        
        if (!groupedByDate[ts]) {
            groupedByDate[ts] = { 
                hoeveelheid: 0, 
                label: dateObj.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' }) 
            };
        }
        
        if (reg.actieType !== 'alternatief') {
            let amount = getRegAmount(reg, traject);
            groupedByDate[ts].hoeveelheid += amount;
        }
    });

    const minTs = Math.min(...registraties.map(r => new Date(r.tijdstip).setHours(0,0,0,0)));
    let curr = new Date(minTs);
    const maxDateObj = new Date();
    maxDateObj.setHours(0,0,0,0);

    while (curr <= maxDateObj) {
        const ts = curr.getTime();
        if (!groupedByDate[ts]) {
            groupedByDate[ts] = {
                hoeveelheid: 0,
                label: curr.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
            };
        }
        curr.setDate(curr.getDate() + 1);
    }

    const sortedTimestamps = Object.keys(groupedByDate).sort((a, b) => a - b);

    const labels = [];
    const dataBehaald = [];
    const dataNietBehaald = [];

    sortedTimestamps.forEach(ts => {
        const dayData = groupedByDate[ts];
        labels.push(dayData.label);
        
        if (dayData.hoeveelheid <= maxAllowedPerDag + 0.01) { 
            dataBehaald.push(dayData.hoeveelheid);
            dataNietBehaald.push(0);
        } else {
            dataBehaald.push(0);
            dataNietBehaald.push(dayData.hoeveelheid);
        }
    });

    // NIEUW: Dwing een minimale breedte af per staafje, zodat we kunnen scrollen!
    const wrapperId = `grafiek-wrapper-${traject}`;
    const wrapperEl = document.getElementById(wrapperId);
    if (wrapperEl && labels.length > 7) { 
        // 40 pixels breedte per staafje
        wrapperEl.style.width = `${labels.length * 40}px`;
        
        // Scroll automatisch helemaal naar rechts (vandaag) zodra de module opent
        setTimeout(() => {
            const scrollContainer = wrapperEl.parentElement;
            if (scrollContainer) {
                scrollContainer.scrollLeft = scrollContainer.scrollWidth;
            }
        }, 100);
    }

    const checkmarkPlugin = {
        id: 'checkmarkPlugin',
        afterDatasetsDraw(chart) {
            const { ctx, scales: { x, y } } = chart;
            const behaaldData = chart.data.datasets[0].data;
            const nietBehaaldData = chart.data.datasets[1].data;
            
            for (let i = 0; i < behaaldData.length; i++) {
                if (behaaldData[i] === 0 && nietBehaaldData[i] === 0) {
                    const xPos = x.getPixelForValue(i);
                    const yPos = y.getPixelForValue(0) - 14; 
                    ctx.save();
                    ctx.font = '16px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('✅', xPos, yPos);
                    ctx.restore();
                }
            }
        }
    };

    new Chart(ctx, {
        type: 'bar',
        plugins: [checkmarkPlugin],
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Doel behaald',
                    data: dataBehaald,
                    backgroundColor: '#10b981',
                    borderRadius: 4
                },
                {
                    label: 'Doel niet behaald',
                    data: dataNietBehaald,
                    backgroundColor: '#ef4444',
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { stacked: true, grid: { display: false }, ticks: { font: { size: 10 } } },
                y: { 
                    stacked: true, 
                    beginAtZero: true, 
                    ticks: { font: { size: 10 } },
                    title: { display: true, text: traject === 'alcohol' ? 'Aantal standaardglazen' : 'Hoeveelheid / Inzet', font: { size: 11, weight: 'bold' } }
                }
            },
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 6, font: { size: 11 } } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if(context.parsed.y === 0) return null;
                            let unit = traject === 'alcohol' ? ' st.glazen' : '';
                            return context.dataset.label + ': ' + context.parsed.y + unit;
                        }
                    }
                }
            }
        }
    });
}

function initPersoonlijkListeners() {
    const profielInput = document.getElementById('profielfoto-input');
    if (profielInput) {
        profielInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) console.log('Profielfoto geselecteerd:', file.name);
        });
    }

    const btnToggle = document.getElementById('btn-toggle-motto');
    const dropdown = document.getElementById('motto-dropdown');
    const mottoDisplay = document.getElementById('motto-display');
    const customInput = document.getElementById('custom-motto-input');
    const btnSaveCustom = document.getElementById('btn-save-custom-motto');

    if (btnToggle && dropdown) {
        dropdown.classList.add('hidden');

        btnToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('#motto-wrapper')) {
                dropdown.classList.add('hidden');
            }
        });

        dropdown.querySelectorAll('.motto-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const newMotto = e.currentTarget.getAttribute('data-motto');
                
                if (mottoDisplay) {
                    mottoDisplay.innerHTML = `"${newMotto}"`;
                }
                
                localStorage.setItem('persoonlijkMotto', newMotto);
                dropdown.classList.add('hidden');
                
                dropdown.querySelectorAll('.motto-option').forEach(opt => {
                    opt.style.background = 'transparent';
                    opt.style.fontWeight = 'normal';
                    opt.style.color = '#1e293b';
                });
                e.currentTarget.style.background = '#eff6ff';
                e.currentTarget.style.fontWeight = '600';
                e.currentTarget.style.color = '#2563eb';
                
                if (customInput) customInput.value = '';
            });
        });

        if (btnSaveCustom && customInput) {
            customInput.addEventListener('click', (e) => e.stopPropagation()); 
            
            customInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    btnSaveCustom.click();
                }
            });

            btnSaveCustom.addEventListener('click', (e) => {
                e.stopPropagation();
                const newMotto = customInput.value.trim();
                
                if (newMotto) {
                    if (mottoDisplay) mottoDisplay.innerHTML = `"${newMotto}"`;
                    localStorage.setItem('persoonlijkMotto', newMotto);
                    dropdown.classList.add('hidden');
                    
                    dropdown.querySelectorAll('.motto-option').forEach(opt => {
                        opt.style.background = 'transparent';
                        opt.style.fontWeight = 'normal';
                        opt.style.color = '#1e293b';
                    });
                }
            });
        }
    }
}