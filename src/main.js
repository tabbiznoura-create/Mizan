
import {
    getPrices,
    getHistoricalPrices,
    getSilverHistoricalPrices
} from "./api.js";


// 1. Récupérer le select
const currencySelect = document.getElementById("currency-select");

// Devise sauvegardée
let selectedCurrency =
    localStorage.getItem("mizan-currency") || "MAD";

// Vérifier la devise
if (
    selectedCurrency !== "MAD" &&
    selectedCurrency !== "USD" &&
    selectedCurrency !== "EUR"
) {
    selectedCurrency = "MAD";
}

currencySelect.value = selectedCurrency;


// 2. Créer une carte
function createCard(metal) {

    const card = document.createElement("div");

    const title = document.createElement("h3");
    title.textContent = metal.name;

    const price = document.createElement("p");
    price.textContent =
        metal.price.toFixed(2) + " " + metal.currency;

    const unit = document.createElement("p");
    unit.textContent = "Unité : " + metal.unit;

    const variationText = document.createElement("p");

    // Vérifier si le prix précédent existe
    if (
        metal.previousPrice === null ||
        metal.previousPrice === 0
    ) {

        variationText.textContent = "Variation indisponible";

    } else {

        // Calcul de la variation
        const variation =
            metal.price - metal.previousPrice;

        const percentage =
            (variation / metal.previousPrice) * 100;

        let arrow = "→";
        let color = "gray";
        let sign = "";

        if (variation > 0) {
            arrow = "↑";
            color = "green";
            sign = "+";

        } else if (variation < 0) {
            arrow = "↓";
            color = "red";
        }

        variationText.textContent =
            arrow + " " +
            sign + variation.toFixed(2) + " " +
            metal.currency + " (" +
            sign + percentage.toFixed(2) + "%)";

        variationText.style.color = color;
    }

    card.append(title, price, unit, variationText);

    return card;
}


// 3. Charger les prix
async function init() {

    const errorMessage = document.getElementById("error-message");
    const errorText = document.getElementById("error-text");
    const pricesContainer = document.getElementById("prices-container");

    errorMessage.hidden = true;

    try {

        // Prix actuels
        const data = await getPrices(selectedCurrency);

        const fxRate = data.fx_rate || 1;


        // 4. Historique de l'or
        let goldHistory = [];

        try {

            goldHistory = await getHistoricalPrices();

        } catch (error) {

            console.log("Erreur historique or :", error.message);
        }


        // 5. Historique de l'argent
        let silverHistory = [];

        try {

            silverHistory = await getSilverHistoricalPrices();

        } catch (error) {

            console.log("Erreur historique argent :", error.message);
        }


        // 6. Derniers prix historiques
        let previousGoldPrice = null;
        let previousSilverPrice = null;

        if (goldHistory.length > 0) {

            const lastGold = goldHistory[goldHistory.length - 1];

            previousGoldPrice = lastGold.c * fxRate;
        }

        if (silverHistory.length > 0) {

            const lastSilver = silverHistory[silverHistory.length - 1];

            previousSilverPrice = lastSilver.c * fxRate;
        }


        // Historique des 7 et 30 jours (or)
        const last7Days = goldHistory.slice(-7);
        const last30Days = goldHistory.slice(-30);

        console.log("Derniers 7 jours :", last7Days);
        console.log("Derniers 30 jours :", last30Days);


        // 7. Préparer les métaux
        const metals = [];

        if (data.xau) {

            metals.push({
                name: "Or",
                price: data.xau.price,
                currency: data.xau.currency,
                unit: data.xau.unit,
                previousPrice: previousGoldPrice
            });
        }

        if (
            data.silver_usd_oz !== null &&
            data.silver_usd_oz !== undefined
        ) {

            metals.push({
                name: "Argent",
                price: data.silver_usd_oz * fxRate,
                currency: selectedCurrency,
                unit: "troy_oz",
                previousPrice: previousSilverPrice
            });
        }


        // 8. Supprimer les anciennes cartes
        pricesContainer.replaceChildren();


        // 9. Ajouter les nouvelles cartes
        metals.forEach(function(metal) {

            const card = createCard(metal);

            pricesContainer.append(card);

        });


        // 10. Date de mise à jour
        const date = new Date(data.updated_at);

        document.getElementById("last-update").textContent =
            date.toLocaleString("fr-FR");


    } catch (error) {

        errorMessage.hidden = false;

        errorText.textContent =
            "Impossible de récupérer les cours.";

        console.log(error.message);
    }
}


// 11. Changer la devise
currencySelect.addEventListener("change", function() {

    selectedCurrency = currencySelect.value;

    localStorage.setItem("mizan-currency", selectedCurrency);

    init();

});


// 12. Actualiser
document.getElementById("refresh-button")
    .addEventListener("click", init);


// Réessayer
document.getElementById("retry-button")
    .addEventListener("click", init);


// Lancer l'application
init();
