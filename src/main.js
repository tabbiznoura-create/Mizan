
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

// Récupérer le select
const historyMetal = document.getElementById("history-metal");

// Créer le choix Or
const goldOption = document.createElement("option");
goldOption.value = "or";
goldOption.textContent = "Or";

// Créer le choix Argent
const silverOption = document.createElement("option");
silverOption.value = "argent";
silverOption.textContent = "Argent";

// Ajouter les choix dans le select
historyMetal.append(goldOption);
historyMetal.append(silverOption);

// Historique des métaux
let goldHistory = [];
let silverHistory = [];

// Taux de conversion
let currentFxRate = 1;

// Éléments HTML
const historyPeriod = document.getElementById("history-period");
const historyButton = document.getElementById("history-button");
const historyMessage = document.getElementById("history-message");

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

        // Taux de conversion
currentFxRate = data.fx_rate || 1;

// Réinitialiser les historiques
goldHistory = [];
silverHistory = [];

// Historique de l'or
try {

    goldHistory = await getHistoricalPrices();

} catch (error) {

    console.log("Erreur historique or :", error.message);
}


// Historique de l'argent
try {

    silverHistory = await getSilverHistoricalPrices();

} catch (error) {

    console.log("Erreur historique argent :", error.message);
}

        const fxRate = data.fx_rate || 1;

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




function drawChart(points) {

    const canvas = document.getElementById("history-chart");

    // Taille du graphique
    canvas.width = 700;
    canvas.height = 300;

    const ctx = canvas.getContext("2d");

    // Effacer l'ancien graphique
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Vérifier les données
    if (points.length === 0) {
        return;
    }

    // Dimensions
    const left = 60;
    const right = 20;
    const top = 20;
    const bottom = 45;

    const chartWidth = canvas.width - left - right;
    const chartHeight = canvas.height - top - bottom;

    // Trouver le prix minimum et maximum
    let minPrice = points[0].price;
    let maxPrice = points[0].price;

    points.forEach(function(point) {

        if (point.price < minPrice) {
            minPrice = point.price;
        }

        if (point.price > maxPrice) {
            maxPrice = point.price;
        }

    });

    // Éviter que les prix soient identiques
    if (minPrice === maxPrice) {
        minPrice = minPrice - 1;
        maxPrice = maxPrice + 1;
    }

    // Dessiner les lignes horizontales
    ctx.font = "12px Arial";
    ctx.textAlign = "right";

    for (let i = 0; i <= 4; i++) {

        const y = top + i * chartHeight / 4;

        const price = maxPrice - i * (maxPrice - minPrice) / 4;

        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(canvas.width - right, y);

        ctx.strokeStyle = "#dddddd";
        ctx.stroke();

        ctx.fillStyle = "#555555";
        ctx.fillText(price.toFixed(2), left - 8, y + 4);
    }

    // Dessiner la courbe
    ctx.beginPath();
    ctx.strokeStyle = "#b8860b";
    ctx.lineWidth = 3;

    points.forEach(function(point, index) {

        let x = left;

        if (points.length > 1) {
            x = left + index * chartWidth / (points.length - 1);
        }

        const y = top +
            (maxPrice - point.price) * chartHeight /
            (maxPrice - minPrice);

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }

    });

    ctx.stroke();

    // Dessiner les points
    points.forEach(function(point, index) {

        let x = left;

        if (points.length > 1) {
            x = left + index * chartWidth / (points.length - 1);
        }

        const y = top +
            (maxPrice - point.price) * chartHeight /
            (maxPrice - minPrice);

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);

        ctx.fillStyle = "#b8860b";
        ctx.fill();

    });

    // Afficher les dates
    ctx.fillStyle = "#555555";
    ctx.textAlign = "center";

    ctx.fillText(points[0].date, left, canvas.height - 12);

    const lastIndex = points.length - 1;

    if (lastIndex > 0) {
        ctx.fillText(
            points[lastIndex].date,
            canvas.width - right,
            canvas.height - 12
        );
    }

}

historyButton.addEventListener("click", showHistory);

function showHistory() {

    // Récupérer le métal choisi
    const selectedMetal = historyMetal.value;

    // Récupérer la période choisie
    const days = Number(historyPeriod.value);

    // Choisir les données
    let history = [];

    if (selectedMetal === "or") {
        history = goldHistory;
    } else {
        history = silverHistory;
    }

    // Prendre les derniers jours
    const lastPoints = history.slice(-days);

    // Préparer les données du graphique
    const chartPoints = [];

    lastPoints.forEach(function(item) {

        let date;

        if (selectedMetal === "or") {

            date = item.d;

        } else {

            let timestamp = item.t;

            if (timestamp < 1000000000000) {
                timestamp = timestamp * 1000;
            }

            date = new Date(timestamp).toISOString().slice(0, 10);
        }

        chartPoints.push({
            date: date,
            price: item.c * currentFxRate
        });

    });

    // Vérifier les données
    if (chartPoints.length === 0) {

        historyMessage.textContent =
            "Aucune donnée disponible.";

        historyMessage.hidden = false;

        return;
    }

    // Afficher le nombre de points
    historyMessage.textContent =
        "Nombre de points : " + chartPoints.length;

    historyMessage.hidden = false;

    // Dessiner le graphique
    drawChart(chartPoints);
}


// Bouton Afficher
historyButton.addEventListener("click", showHistory);

// Lancer l'application
init();

