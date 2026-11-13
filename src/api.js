const API_URL = "https://xaus.com/api/v1/spot";

export async function getPrices() {

    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Erreur HTTP : " + response.status);
    }

    const data = await response.json();

    return data;
}
