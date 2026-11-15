
const API_URL = "https://xaus.com/api/v1/spot";
const HISTORY_URL = "https://xaus.com/api/v1/history";
const CHART_URL = "https://xaus.com/api/v1/chart";


// Ajouter une requête dans le journal
function addRequestLog(method, url, status, duration) {

    const requestsLog = document.getElementById("requests-log");

    // Vérifier si le journal existe
    if (!requestsLog) {
        return;
    }

    // Créer une ligne
    const requestItem = document.createElement("div");
    requestItem.className = "request-log-item";

    // Afficher la méthode et l'URL
    const requestTitle = document.createElement("p");

    requestTitle.textContent = method + " - " + url;

    // Afficher le statut et la durée
    const requestInfo = document.createElement("p");

    requestInfo.textContent =
        "Statut : " + status +
        " | Durée : " + duration + " ms";

    requestItem.append(requestTitle, requestInfo);

    // Ajouter la nouvelle requête en haut
    requestsLog.prepend(requestItem);

    // Garder seulement les 10 dernières requêtes
    if (requestsLog.children.length > 10) {
        requestsLog.removeChild(requestsLog.lastElementChild);
    }
}


// Fonction pour récupérer les données
async function getData(url) {

    // Enregistrer l'heure de départ
    const startTime = Date.now();

    let status = "Non envoyé";

    try {

        // Vérifier la connexion
        if (!navigator.onLine) {
            status = "Hors ligne";
            throw new Error("offline");
        }

        let response;

        try {

            response = await fetch(url);

        } catch (error) {

            status = "Erreur réseau";
            throw new Error("network");
        }

        // Récupérer le code HTTP
        status = response.status;

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

    } finally {

        // Calculer la durée
        const duration = Date.now() - startTime;

        // Enregistrer la requête
        addRequestLog("GET", url, status, duration);
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

    return data.points;
}
