
const API_URL = "https://xaus.com/api/v1/spot";
const HISTORY_URL = "https://xaus.com/api/v1/history";
const CHART_URL = "https://xaus.com/api/v1/chart";

// Fonction pour récupérer les données
async function getData(url) {

    // Vérifier la connexion
    if (!navigator.onLine) {
        throw new Error("offline");
    }

    let response;

    try {

        response = await fetch(url);

    } catch (error) {

        throw new Error("network");
    }

    // Vérifier le quota
    if (response.status === 429) {
        throw new Error("quota");
    }

    // Vérifier les erreurs HTTP
    if (!response.ok) {
        throw new Error("http-" + response.status);
    }

    // Lire le JSON
    try {

        const data = await response.json();

        return data;

    } catch (error) {

        throw new Error("json");
    }
}

// Prix actuels
export async function getPrices(currency = "USD") {

    const data = await getData(
        `${API_URL}?currency=${currency}`
    );

    return data;
}


// Historique de l'or
export async function getHistoricalPrices() {

    const data = await getData(HISTORY_URL);

    return data.points;
}


// Historique de l'argent
export async function getSilverHistoricalPrices() {

    const data = await getData(
        `${CHART_URL}?symbol=silver&range=3mo&interval=1d`
    );

// CHART_URL le titre initial
// symbol=silver: la demande de silver
// range=3mo: nous besoin de 3 mois
// interval=1d: chaque point présenté un jour


    return data.points;
}
