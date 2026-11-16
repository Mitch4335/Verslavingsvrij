// src/data/cocaine.js
export const cocaineData = {
    terminologie: {
        middel: "cocaïne",
        werkwoord: "gebruiken",
        actie: "gebruikt",
        eenheid: "gram/lijntjes"
    },

    redenen: {
        nadelenKorteTermijn: {
            shown: [
                { val: "Dinsdagdip / neerslachtig", text: "📉 Dinsdagdip" },
                { val: "Slecht slapen", text: "🌙 Slecht slapen" },
                { val: "Geldverspilling", text: "💸 Geldverspilling" },
                { val: "Hartkloppingen / onrust", text: "⚡ Hartkloppingen" }
            ],
            hidden: [
                { val: "Paranoia / achterdocht", text: "👀 Paranoia" },
                { val: "Kater / extreme craving", text: "😫 Craving" },
                { val: "Agressie / kort lontje", text: "😠 Agressie" },
                { val: "Kaak- en neusklachten", text: "🤧 Neusklachten" }
            ]
        },
        nadelenLangeTermijn: {
            shown: [
                { val: "Financiële problemen", text: "💳 Financiële problemen" },
                { val: "Relaties beschadigd", text: "💔 Relaties kapot" },
                { val: "Uitputting", text: "🔋 Uitputting" },
                { val: "Depressie", text: "🌧️ Depressie" }
            ],
            hidden: [
                { val: "Schade aan neusschot/hart", text: "🏥 Fysieke schade" },
                { val: "Prestatieverlies werk", text: "💼 Prestatieverlies" },
                { val: "Liegen en stiekem doen", text: "🤥 Stiekem doen" },
                { val: "Verlies van controle", text: "⛓️ Verlies controle" }
            ]
        },
        voordelenKorteTermijn: {
            shown: [
                { val: "Beter slapen", text: "🌙 Beter slapen" },
                { val: "Meer geld over", text: "🐖 Meer geld over" },
                { val: "Rust in m'n hoofd", text: "🧘 Rust in hoofd" },
                { val: "Geen dip of kater", text: "✨ Geen dip" }
            ],
            hidden: [
                { val: "Minder angstig/paranoïde", text: "🌈 Minder angstig" },
                { val: "Echt contact met anderen", text: "💬 Echt contact" },
                { val: "Niet meer liegen", text: "🔓 Niet liegen" }
            ]
        },
        voordelenLangeTermijn: {
            shown: [
                { val: "Financiële stabiliteit", text: "💳 Financiële stabiliteit" },
                { val: "Fysiek en mentaal gezond", text: "❤️ Gezondheid" },
                { val: "Betrouwbaar voor naasten", text: "🤝 Betrouwbaar" },
                { val: "Doelen behalen", text: "🎯 Doelen behalen" }
            ],
            hidden: [
                { val: "Stabiel energieniveau", text: "⚡ Stabiele energie" },
                { val: "Zelfrespect", text: "🛡️ Zelfrespect" },
                { val: "Tijd voor hobby's", text: "⏳ Tijd over" }
            ]
        }
    },

    registraties: {
        locatie: {
            shown: [
                { val: "In de kroeg / club", text: "🍻 Kroeg / Club" },
                { val: "Feest / Festival", text: "🎪 Feest / Festival" },
                { val: "Thuis", text: "🏠 Thuis" },
                { val: "Bij anderen thuis", text: "👥 Bij anderen thuis" },
            ],
            hidden: [
                { val: "Op werk / studie", text: "💼 Op werk / studie" },
                { val: "In de stad", text: "🌃 In de stad" },
                { val: "Op het toilet", text: "🚽 Op het toilet" },
                { val: "In de auto", text: "🚗 In de auto" }
            ]
        },
        situatie: {
            shown: [
                { val: "Tijdens het stappen", text: "🪩 Tijdens het stappen" },
                { val: "Als ik al alcohol op heb", text: "🍺 Na alcohol" },
                { val: "Na een lange werkdag", text: "💼 Na werk" },
                { val: "Tijdens stress", text: "⚡ Tijdens stress" }
            ],
            hidden: [
                { val: "Alleen zijn", text: "👤 Alleen zijn" },
                { val: "Salaris gestort", text: "💸 Salaris gestort" },
                { val: "Om langer door te kunnen", text: "🔋 Om langer door te kunnen" }
            ]
        },
        gezelschap: {
            shown: [
                { val: "Vrienden", text: "🤝 Vrienden" },
                { val: "Alleen", text: "👤 Alleen" },
                { val: "Familie", text: "👨‍👩‍👧‍👦 Familie" },
                { val: "Collega's", text: "💼 Collega's" }
            ],
            hidden: [
                { val: "Dealer", text: "🚶 Dealer" },
                { val: "Partner", text: "❤️ Partner" },
                { val: "Onbekenden", text: "👥 Onbekenden" }
            ]
        },
        gedachten: {
            shown: [
                { val: "Eén lijntje kan wel", text: "☝️ Eén lijntje kan wel" },
                { val: "Ik heb energie nodig", text: "🔋 Ik heb energie nodig" },
                { val: "Het hoort erbij", text: "🔄 Het hoort erbij" },
                { val: "Daar wordt het gezellig van", text: "🎊 Daar wordt het gezellig van" }
            ],
            hidden: [
                { val: "Wat maakt het ook uit?", text: "🤷 Wat maakt het ook uit?" },
                { val: "Nu wordt het pas echt leuk", text: "🥳 Nu wordt het leuk" },
                { val: "Ik verdien het", text: "💭 Ik verdien het" },
                { val: "Iedereen doet het", text: "👥 Iedereen doet het" },
                { val: "Ik wil deze onrust niet voelen", text: "🕳️ Wil onrust niet voelen" }
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