
const pricesContainer = document.querySelector("#prices-container");

export function displayPrices(metals) {

    pricesContainer.textContent = "";

    metals.forEach(metal => {

        // Créer la carte
        const card = document.createElement("div");
        card.classList.add("price-card");

        // Créer le titre
        const title = document.createElement("h3");
        title.textContent = metal.name;

        // Créer le prix
        const price = document.createElement("p");
        price.textContent = `${metal.price} ${metal.currency}`;

        // Ajouter les éléments à la carte
        card.appendChild(title);
        card.appendChild(price);

        // Ajouter la carte au container
        pricesContainer.appendChild(card);
    });
}
