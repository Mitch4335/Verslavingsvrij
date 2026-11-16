// src/data/alcohol.js
export const alcoholData = {
    terminologie: {
        middel: "alcohol",
        werkwoord: "drinken",
        actie: "gedronken",
        eenheid: "standaardglazen"
    },

    redenen: {
        nadelenKorteTermijn: {
            shown: [
                { val: "Kater / vermoeidheid", text: "🥱 Kater / vermoeidheid" },
                { val: "Slecht slapen", text: "🌙 Slecht slapen" },
                { val: "Ruzie", text: "⚡ Ruzie" },
                { val: "Schaamte", text: "😳 Schaamte" }
            ],
            hidden: [
                { val: "Niet aan plannen toekomen", text: "📅 Niet aan plannen toekomen" },
                { val: "Geldverspilling", text: "💸 Geldverspilling" },
                { val: "Vervelend worden in gedrag", text: "☁️ Vervelend worden in gedrag" },
                { val: "Leidt tot drugsgebruik/gokken", text: "🎲 Leidt tot drugsgebruik/gokken" }
            ]
        },
        nadelenLangeTermijn: {
            shown: [
                { val: "Gezondheidsschade", text: "🏥 Gezondheidsschade" },
                { val: "Relatieproblemen", text: "👥 Relatieproblemen" },
                { val: "Problemen op werk/studie", text: "💼 Problemen op werk/studie" },
                { val: "Laag zelfbeeld", text: "📉 Laag zelfbeeld" }
            ],
            hidden: [
                { val: "Verlies van vrienden/familie", text: "💔 Verlies van vrienden/familie" },
                { val: "Geldproblemen", text: "💳 Geldproblemen" },
                { val: "Doelen niet behalen", text: "🎯 Doelen niet behalen" },
                { val: "Gewichtstoename", text: "⚖️ Gewichtstoename" },
                { val: "Depressiviteit", text: "🌧️ Depressiviteit" }
            ]
        },
        voordelenKorteTermijn: {
            shown: [
                { val: "Beter slapen", text: "🌙 Beter slapen" },
                { val: "Fitter voelen", text: "⚡ Fitter voelen" },
                { val: "Productiever", text: "📈 Productiever" },
                { val: "Beter zelfbeeld", text: "🌟 Beter zelfbeeld" }
            ],
            hidden: [
                { val: "Fijner contact met anderen", text: "💬 Fijner contact met anderen" },
                { val: "Bespaart geld", text: "🐖 Bespaart geld" },
                { val: "Helder hoofd", text: "🧠 Helder hoofd" },
                { val: "Meer tijd over", text: "⏳ Meer tijd over" },
                { val: "Geen schaamte / kater", text: "✨ Geen schaamte / kater" },
                { val: "Trots op jezelf", text: "🦁 Trots op jezelf" }
            ]
        },
        voordelenLangeTermijn: {
            shown: [
                { val: "Beter voor gezondheid", text: "❤️ Beter voor gezondheid" },
                { val: "Beter contact met naasten", text: "🤝 Beter contact met naasten" },
                { val: "Productiever op werk/studie", text: "💼 Productiever op werk/studie" },
                { val: "Meer zelfvertrouwen", text: "🛡️ Meer zelfvertrouwen" }
            ],
            hidden: [
                { val: "Doelen behalen", text: "🎯 Doelen behalen" },
                { val: "Gewichtsverlies", text: "🏃 Gewichtsverlies" },
                { val: "Betere financiële situatie", text: "💳 Betere financiële situatie" },
                { val: "Minder angst/somberheid", text: "🌈 Minder angst / somberheid" }
            ]
        }
    },

    registraties: {
        locatie: {
            shown: [
                { val: "Thuis", text: "🏠 Thuis" },
                { val: "Bij anderen thuis", text: "👥 Bij anderen thuis" },
                { val: "Café / restaurant", text: "🍽️ Café / restaurant" },
                { val: "Supermarkt", text: "🛒 Supermarkt" }
            ],
            hidden: [
                { val: "Kroeg", text: "🍻 Kroeg" },
                { val: "Werk", text: "💼 Werk" },
                { val: "Buiten", text: "🌳 Buiten" },
                { val: "Festival", text: "🎪 Festival" }
            ]
        },
        situatie: {
            shown: [
                { val: "Na drukke werkdag", text: "💼 Na drukke werkdag" },
                { val: "Tijdens koken", text: "🍳 Tijdens koken" },
                { val: "(Uit)eten", text: "🍽️ (Uit)eten" },
                { val: "Feest", text: "🎉 Feest" }
            ],
            hidden: [
                { val: "Stressvol moment", text: "⚡ Stressvol moment" },
                { val: "Drukte", text: "🌀 Drukte" },
                { val: "Sociale gelegenheid", text: "🥳 Sociale gelegenheid" },
                { val: "Op de bank voor de tv", text: "🛋️ Op de bank voor de tv" }
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
                { val: "Collega's", text: "💼 Collega's" },
                { val: "Onbekenden", text: "🚶 Onbekenden" }
            ]
        },
        gedachten: {
            shown: [
                { val: "Ik heb het verdiend", text: "💭 Ik heb het verdiend" },
                { val: "Ik heb het nodig", text: "🧠 Ik heb het nodig" },
                { val: "Het hoort erbij", text: "🔄 Het hoort erbij" },
                { val: "Lekker", text: "✨ Lekker" }
            ],
            hidden: [
                { val: "Daar wordt het gezellig van", text: "🥳 Daar wordt het gezellig van" },
                { val: "Ik wil rust in mijn hoofd", text: "🧘 Ik wil rust in mijn hoofd" },
                { val: "Anderen drinken ook", text: "👥 Anderen drinken ook" },
                { val: "Wat maakt het ook uit?", text: "🤷 Wat maakt het ook uit?" }
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