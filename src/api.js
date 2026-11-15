
const API_URL = "https://xaus.com/api/v1/spot";
const HISTORY_URL = "https://xaus.com/api/v1/history";
const CHART_URL = "https://xaus.com/api/v1/chart";

// Prix actuels
export async function getPrices(currency = "USD") {

    const response = await fetch(`${API_URL}?currency=${currency}`);

    if (!response.ok) {
        throw new Error("Erreur HTTP : " + response.status);
    }

    const data = await response.json();

    return data;
}


// Historique de l'or
export async function getHistoricalPrices() {

    const response = await fetch(HISTORY_URL);

    if (!response.ok) {
        throw new Error("Erreur historique de l'or");
    }

    const data = await response.json();

    return data.points;
}


// Historique de l'argent
export async function getSilverHistoricalPrices() {

        const response = await fetch(
            `${CHART_URL}?symbol=silver&range=5d&interval=1d`
        );

// CHART_URL le titre initial
// symbol=silver: la demande de silver
// range=3mo: nous besoin de 3 mois
// interval=1d: chaque point présenté un jour

    if (!response.ok) {
        throw new Error("Erreur historique de l'argent");
    }

    const data = await response.json();

    return data.points;
}
