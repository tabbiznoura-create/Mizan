
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

    const url = `${CHART_URL}?symbol=silver&range=5d&interval=1d`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Erreur historique de l'argent");
    }

    const data = await response.json();

    return data.points;
}
