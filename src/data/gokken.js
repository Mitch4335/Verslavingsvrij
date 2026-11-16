// src/data/gokken.js
export const gokkenData = {
    terminologie: {
        middel: "gokken",
        werkwoord: "gokken",
        actie: "gegokt",
        eenheid: "euro's"
    },

    redenen: {
        nadelenKorteTermijn: {
            shown: [
                { val: "Geldverlies", text: "💸 Geldverlies" },
                { val: "Spijt / schuldgevoel", text: "😞 Spijt / schuld" },
                { val: "Stress / hartkloppingen", text: "⚡ Stress" },
                { val: "Tijdverlies", text: "⏳ Tijdverlies" }
            ],
            hidden: [
                { val: "Slecht slapen", text: "🌙 Slecht slapen" },
                { val: "Drang om terug te winnen", text: "🔄 Drang om terug te winnen" },
                { val: "Kortaf tegen anderen", text: "😠 Kort lontje" },
                { val: "Lege bankrekening", text: "🕳️ Lege rekening" }
            ]
        },
        nadelenLangeTermijn: {
            shown: [
                { val: "Schulden", text: "💳 Schulden" },
                { val: "Liegen tegen naasten", text: "🤥 Liegen / stiekem doen" },
                { val: "Verlies van relaties", text: "💔 Verlies van relaties" },
                { val: "Depressie / somberheid", text: "🌧️ Depressie" }
            ],
            hidden: [
                { val: "Problemen op werk", text: "💼 Werkproblemen" },
                { val: "Constant piekeren", text: "🧠 Constant piekeren" },
                { val: "Minderwaardigheidsgevoel", text: "📉 Laag zelfbeeld" },
                { val: "Gevoel van controleverlies", text: "⛓️ Controle kwijt" }
            ]
        },
        voordelenKorteTermijn: {
            shown: [
                { val: "Geen stress om geldverlies", text: "🧘 Geen stress" },
                { val: "Meer tijd voor mezelf", text: "⏳ Meer tijd" },
                { val: "Beter slapen", text: "🌙 Beter slapen" },
                { val: "Geen schuldgevoel", text: "✨ Geen schuldgevoel" }
            ],
            hidden: [
                { val: "Aandacht bij gesprek", text: "👀 Meer aandacht" },
                { val: "Trots op mezelf", text: "🦁 Trots" },
                { val: "Minder telefoongebruik", text: "📱 Minder op telefoon" }
            ]
        },
        voordelenLangeTermijn: {
            shown: [
                { val: "Financiële stabiliteit", text: "💳 Financiële stabiliteit" },
                { val: "Herstel van vertrouwen", text: "🤝 Herstel vertrouwen" },
                { val: "Rust in m'n hoofd", text: "🧠 Rust in hoofd" },
                { val: "Doelen (weer) behalen", text: "🎯 Doelen behalen" }
            ],
            hidden: [
                { val: "Betere relaties", text: "👥 Betere relaties" },
                { val: "Weer kunnen genieten", text: "☀️ Weer genieten" },
                { val: "Meer zelfwaardering", text: "🛡️ Zelfwaardering" }
            ]
        }
    },

    registraties: {
        locatie: {
            shown: [
                { val: "Thuis", text: "🏠 Thuis" },
                { val: "Op de bank voor de tv", text: "🛋️ Op de bank voor de tv" },
                { val: "Achter de laptop/pc", text: "💻 Achter de laptop" },
                { val: "In het openbaar vervoer", text: "🚌 In het openbaar vervoer" }
            ],
            hidden: [
                { val: "Bij anderen thuis", text: "👥 Bij anderen thuis" },
                { val: "Casino / Speelhal", text: "🎰 Casino / Speelhal" },
                { val: "Kroeg", text: "🍻 Kroeg" },
                { val: "In bed", text: "🛏️ In bed" },
                { val: "Op het werk", text: "💼 Op het werk" }
            ]
        },
        situatie: {
            shown: [
                { val: "Lege planning, verveling", text: "🥱 Lege planning, verveling" },
                { val: "Na salarisstorting", text: "💰 Na salarisstorting" },
                { val: "Reclame over gokken gezien", text: "📺 Reclame over gokken gezien" },
                { val: "Eerder geld verloren door gokken", text: "🔄 Eerder geld verloren door gokken" }
            ],
            hidden: [
                { val: "Filmpje gezien over snel rijk worden", text: "🤑 Filmpje over snel rijk worden" },
                { val: "Alleen zijn", text: "👤 Alleen zijn" },
                { val: "Bij een sportwedstrijd", text: "⚽ Bij sportwedstrijd" },
                { val: "Na een rotdag", text: "🌧️ Na een rotdag" },
                { val: "Spanning zoeken", text: "⚡ Spanning zoeken" }
            ]
        },
        gezelschap: {
            shown: [
                { val: "Alleen", text: "👤 Alleen" },
                { val: "Partner", text: "❤️ Partner" },
                { val: "Familie", text: "👨‍👩‍👧‍👦 Familie" },
                { val: "Vrienden", text: "🤝 Vrienden" }
            ],
            hidden: [
                { val: "Online / chat", text: "🌐 Online / chat" },
                { val: "Collega's", text: "💼 Collega's" },
                { val: "Onbekenden", text: "🚶 Onbekenden" }
            ]
        },
        gedachten: {
            shown: [
                { val: "Ik moet mijn geld terugwinnen", text: "🔄 Ik moet mijn geld terugwinnen" },
                { val: "Nu ga ik winnen", text: "🤑 Nu ga ik winnen" },
                { val: "Nog één spelletje", text: "☝️ Nog één spelletje" },
                { val: "Ik heb er geld voor", text: "🤷 Ik heb er geld voor" }
            ],
            hidden: [
                { val: "Een klein bedrag kan wel", text: "🤏 Klein bedrag kan wel" },
                { val: "Ik verveel me", text: "🥱 Ik verveel me" },
                { val: "Vandaag is mijn geluksdag", text: "🍀 Vandaag is mijn geluksdag" }
            ]
        },
        gevoelens: {
            shown: [
                { val: "Blij", text: "😊 Blij" },
                { val: "Boos", text: "😠 Boos" },
                { val: "Bang", text: "😨 Bang" },
                { val: "Bedroefd", text: "😢 Bedroefd" },
                { val: "Ontspannen", text: "😌 Ontspannen" }
            ],
            hidden: [
                { val: "Neutraal", text: "😐 Neutraal" },
                { val: "Gespannen / stress", text: "⚡ Gespannen / stress" },
                { val: "Somberheid", text: "🌧️ Somberheid" },
                { val: "Leeg gevoel", text: "🕳️ Leeg gevoel" },
                { val: "Onrustig", text: "🔌 Onrustig" },
                { val: "Verveeld", text: "🥱 Verveeld" },
                { val: "Eenzaam", text: "🚪 Eenzaam" },
                { val: "Frustratie", text: "😤 Frustratie" }
            ]
        }
    }
};