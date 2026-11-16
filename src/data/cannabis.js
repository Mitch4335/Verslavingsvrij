// src/data/cannabis.js
export const cannabisData = {
    terminologie: {
        middel: "cannabis",
        werkwoord: "blowen",
        actie: "geblowd",
        eenheid: "joints/gram"
    },

    redenen: {
        nadelenKorteTermijn: {
            shown: [
                { val: "Suf / lusteloos", text: "🥱 Suf / lusteloos" },
                { val: "Slecht slapen / zweten", text: "💦 Slecht slapen / zweten" },
                { val: "Eetkicks (munchies)", text: "🍕 Eetkicks" },
                { val: "Paranoia / angst", text: "👀 Paranoia / angst" }
            ],
            hidden: [
                { val: "Niets uit handen krijgen", text: "🛋️ Niets uit handen krijgen" },
                { val: "Geldverspilling", text: "💸 Geldverspilling" },
                { val: "Afspraken vergeten", text: "📅 Afspraken vergeten" },
                { val: "Hoesten / keelpijn", text: "😮‍💨 Hoesten / keelpijn" }
            ]
        },
        nadelenLangeTermijn: {
            shown: [
                { val: "Geheugenproblemen", text: "🧠 Geheugenproblemen" },
                { val: "Relatieproblemen", text: "👥 Relatieproblemen" },
                { val: "Achterstand studie/werk", text: "💼 Achterstand studie/werk" },
                { val: "Isolatie", text: "🚪 Isolatie" }
            ],
            hidden: [
                { val: "Geldproblemen", text: "💳 Geldproblemen" },
                { val: "Somberheid / vlak voelen", text: "🌧️ Somberheid" },
                { val: "Afhankelijkheid", text: "⛓️ Afhankelijkheid" },
                { val: "Conditieverlies", text: "😮‍💨 Conditieverlies" }
            ]
        },
        voordelenKorteTermijn: {
            shown: [
                { val: "Helder hoofd", text: "🧠 Helder hoofd" },
                { val: "Actiever / meer energie", text: "⚡ Actiever" },
                { val: "Dingen wél afkrijgen", text: "📈 Dingen afkrijgen" },
                { val: "Beter contact", text: "💬 Beter contact" }
            ],
            hidden: [
                { val: "Geld overhouden", text: "🐖 Geld overhouden" },
                { val: "Beter onthouden", text: "💡 Beter onthouden" },
                { val: "Niet meer stiekem doen", text: "🔓 Niet meer stiekem doen" },
                { val: "Gezondere longen", text: "🫁 Gezondere longen" }
            ]
        },
        voordelenLangeTermijn: {
            shown: [
                { val: "Doelen behalen", text: "🎯 Doelen behalen" },
                { val: "Beter sociaal leven", text: "🤝 Beter sociaal leven" },
                { val: "Succes op werk/studie", text: "💼 Succes op werk/studie" },
                { val: "Mentale rust", text: "🧘 Mentale rust" }
            ],
            hidden: [
                { val: "Financiële stabiliteit", text: "💳 Financiële stabiliteit" },
                { val: "Onafhankelijk voelen", text: "🦅 Onafhankelijk voelen" },
                { val: "Meer zelfvertrouwen", text: "🛡️ Meer zelfvertrouwen" }
            ]
        }
    },

    registraties: {
        locatie: {
            shown: [
                { val: "Thuis", text: "🏠 Thuis" },
                { val: "Op de bank voor de tv", text: "🛋️ Op de bank voor de tv" },
                { val: "Bij anderen thuis", text: "👥 Bij anderen thuis" },
                { val: "Buiten/Park", text: "🌳 Buiten/Park" }
            ],
            hidden: [
                { val: "Op werk / studie", text: "💼 Op werk / studie" },
                { val: "Festival", text: "🎪 Festival" },
                { val: "Coffeeshop", text: "☕ Coffeeshop" },
                { val: "In de auto", text: "🚗 In de auto" },
                { val: "Slaapkamer", text: "🛏️ Slaapkamer" }
            ]
        },
        situatie: {
            shown: [
                { val: "Na werk / studie", text: "💼 Na werk / studie" },
                { val: "Op een feest", text: "🎉 Op een feest" },
                { val: "Sociale gelegenheid", text: "🥳 Sociale gelegenheid" },
                { val: "Lege planning, verveling", text: "🥱 Lege planning, verveling" }
            ],
            hidden: [
                { val: "Voor het slapen", text: "🌙 Voor het slapen" },
                { val: "Na wakker worden", text: "☀️ Na wakker worden" },
                { val: "Drukte, stress", text: "⚡ Drukte, stress" },
                { val: "Tijdens gamen", text: "🎮 Tijdens gamen" }
            ]
        },
        gezelschap: {
            shown: [
                { val: "Alleen", text: "👤 Alleen" },
                { val: "Vrienden", text: "🤝 Vrienden" },
                { val: "Partner", text: "❤️ Partner" },
                { val: "Familie", text: "👨‍👩‍👧‍👦 Familie" }
            ],
            hidden: [
                { val: "Onbekenden", text: "🚶 Onbekenden" },
                { val: "Dealer", text: "🤫 Dealer" }
            ]
        },
        gedachten: {
            shown: [
                { val: "Even ontspannen", text: "🧘 Even ontspannen" },
                { val: "Het hoort erbij", text: "🔄 Het hoort erbij" },
                { val: "Ik heb het nodig", text: "🧠 Ik heb het nodig" },
                { val: "Ik heb het verdiend", text: "💭 Ik heb het verdiend" }
            ],
            hidden: [
                { val: "Ik kan niet slapen zonder", text: "🌙 Kan niet slapen zonder" },
                { val: "Het is gezellig", text: "🥳 Het is gezellig" },
                { val: "Ik verveel me anders", text: "🥱 Ik verveel me" },
                { val: "Nog eentje dan", text: "☝️ Nog eentje dan" },
                { val: "Ik wil even niks voelen", text: "🕳️ Wil niks voelen" }
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