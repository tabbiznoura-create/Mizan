import { getPrices } from "./api.js";

async function init() {
    const errorMessage = document.getElementById("error-message")

    try {
        const data = await getPrices();
        
        console.log(data);
        errorMessage.hidden = true;

        // afficher les prix
        const pricesContainer = document.getElementById("prices-container");

        // Or
        const goldDiv = document.createElement("div");

        const goldTitle = document.createElement("h3");
        goldTitle.textContent = "Or";

        const goldPrice = document.createElement("p");
        goldPrice.textContent = data.xau.price + " " + data.xau.currency;

        const goldUnit = document.createElement("p");
        goldUnit.textContent = "Unité : " + data.xau.unit;


        goldDiv.append(goldTitle)
        goldDiv.append(goldPrice)
        goldDiv.append(goldUnit)

        // Argent
        const silverDiv = document.createElement("div")

        const silverTitle = document.createElement("h3")
        silverTitle.textContent = "Argent";

        const silverPrice = document.createElement("p");
        silverPrice.textContent = data.silver_usd_oz + " USD";

        const silverUnit = document.createElement("p")
        silverUnit.textContent = "Unité : troy_oz";

        silverDiv.append(silverTitle)
        silverDiv.append(silverPrice)
        silverDiv.append(silverUnit)

        // Ajouter les deux prix
        pricesContainer.append(goldDiv);
        pricesContainer.append(silverDiv);

        // Date de mise à jour
        const date = new Date(data.updated_at);

        document.getElementById("last-update").textContent = 
            date.toLocaleString("fr-FR");
        


    } catch (error) {
        const errorMesssage = document.getElementById("error-message")

        errorMesssage.hidden = false;
        console.log(error.message)
    }
}
          
const retryButton = document.getElementById("retry-button");
const refreshButton = document.getElementById("refresh-button");

    retryButton.addEventListener("click", init)
    refreshButton.addEventListener("click", init)

init();