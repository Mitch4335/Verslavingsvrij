// src/data/contentManager.js
import { alcoholData } from './alcohol.js';
import { cannabisData } from './cannabis.js'; 
import { cocaineData } from './cocaine.js';
import { gokkenData } from './gokken.js';

export function getActiveData() {
    const actieveVerslaving = localStorage.getItem('actieveVerslaving') || 'alcohol';

    switch (actieveVerslaving) {
        case 'alcohol':
            return alcoholData;
        case 'cannabis':
            return cannabisData; 
        case 'cocaine':
            return cocaineData;
        case 'gokken':
            return gokkenData;
        default:
            return alcoholData;
    }
}