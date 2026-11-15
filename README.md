# Mizan — Tableau de bord des cours des métaux précieux

## 1. Présentation du projet

**Mizan** est une application web qui permet de consulter les prix actuels de l'or et de l'argent, de suivre leur évolution historique et d'estimer la valeur d'un bijou selon son poids.

L'application utilise une API externe pour récupérer les données des métaux précieux et les afficher dynamiquement.

## 2. Fonctionnalités

### US-01 — Connexion à l'API
- Récupération des prix actuels de l'or et de l'argent.
- Affichage du nom, du prix, de la devise et de la date de mise à jour.
- Affichage d'un message en cas d'erreur.

### US-02 — Cartes de prix
- Création dynamique des cartes des métaux.
- Affichage du prix et de l'unité en grammes.
- Calcul de la variation en valeur et en pourcentage.
- Indication de la tendance avec une flèche et une couleur.

### US-03 — Choix de la devise
- Choix entre MAD, USD et EUR.
- Mise à jour des prix sans rechargement de la page.
- Conservation de la devise choisie avec localStorage.

### US-04 — Historique
- Consultation de l'historique de l'or et de l'argent.
- Choix entre les 7 et les 30 derniers jours.
- Affichage d'un graphique créé avec Canvas et JavaScript, sans bibliothèque externe.

### US-05 — Estimateur de bijou
- Saisie du poids du bijou en grammes.
- Choix du métal.
- Calcul de la valeur estimée à partir du prix actuel.
- Validation du poids avec affichage des erreurs sous le champ.

### US-06 — États de la requête et résilience
- Affichage des états de chargement, succès et erreur.
- Gestion des erreurs hors ligne, réseau, HTTP, quota et JSON invalide.
- Désactivation des boutons pendant les requêtes.
- Possibilité de relancer une requête avec le bouton « Réessayer ».

### US-07 — Journal des requêtes (Bonus)
- Affichage des dernières requêtes API.
- Affichage de la méthode HTTP, de l'URL, du statut et de la durée.
- Conservation des 10 dernières requêtes.

## 3. API utilisée

L'application utilise l'API **XAUS**.

### Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/v1/spot` | Récupération des prix actuels |
| `GET /api/v1/history` | Historique de l'or |
| `GET /api/v1/chart` | Données historiques pour le graphique de l'argent |

### Paramètres utilisés

**Prix actuels :**
- `currency` : MAD, USD ou EUR.

Exemple :
`/api/v1/spot?currency=MAD`

**Historique de l'argent :**
- `symbol=silver` : métal sélectionné.
- `range=3mo` : période de trois mois.
- `interval=1d` : intervalle quotidien.

Exemple :
`/api/v1/chart?symbol=silver&range=3mo&interval=1d`

## 4. Choix techniques

- **HTML5 :** structure de l'application.
- **CSS3 :** mise en forme et design responsive.
- **JavaScript Vanilla :** logique de l'application et manipulation du DOM.
- **Fetch API :** communication avec l'API externe.
- **Async / Await :** gestion des requêtes asynchrones.
- **Canvas 2D :** création du graphique historique sans bibliothèque externe.
- **localStorage :** sauvegarde de la devise sélectionnée.

### Conversion des unités

Les prix de l'API sont exprimés en once troy.

Une once troy correspond à environ 31,1034768 grammes.

Pour obtenir le prix par gramme :

`Prix par gramme = Prix par once troy / 31,1034768`

La valeur estimée du bijou est calculée avec une fonction pure :

`Valeur estimée = Poids × Prix par gramme`

## 5. Difficultés rencontrées et solutions

| Difficultés | Solutions |
|---|---|
| Récupération des données depuis l'API | Utilisation de Fetch API et Async/Await |
| Affichage dynamique des cartes | Utilisation de createElement et forEach |
| Changement de devise | Utilisation des paramètres API et localStorage |
| Conversion de l'once troy en grammes | Division par 31,1034768 |
| Création du graphique sans bibliothèque | Utilisation de Canvas 2D |
| Validation du poids | Utilisation de conditions et de messages d'erreur |
| Gestion des erreurs API | Utilisation de try/catch/finally |
| Suivi des requêtes | Création d'un journal avec la méthode GET, l'URL, le statut et la durée |

## 6. Captures d'écran

Ajouter dans cette section des captures d'écran de l'application montrant :

- Le tableau de bord et les cartes de prix.
- Le changement de devise.
- Le graphique historique de l'or et de l'argent.
- Le résultat de l'estimateur.
- L'état de chargement et l'état de succès.
- Le message d'erreur hors ligne.
- Le journal des requêtes.

Les images seront placées dans le dossier `screenshots/`.

## 7. Échantillons de données JSON

Le dossier `samples/` contient des réponses JSON réelles récupérées depuis l'API, afin de conserver des exemples de données pour les tests hors ligne.

Fichiers prévus :
- `spot.json` : réponse des prix actuels.
- `gold-history.json` : historique de l'or.
- `silver-chart.json` : historique de l'argent.

## 8. Installation et lancement

1. Cloner le dépôt GitHub.
2. Ouvrir le projet dans Visual Studio Code.
3. Lancer `index.html` avec Live Server.
4. Ouvrir l'application dans le navigateur.

Aucune bibliothèque JavaScript externe n'est nécessaire pour le graphique.

## 9. Démonstration

- **Dépôt GitHub :** À compléter.
- **Démo GitHub Pages :** À compléter.

---

**Mizan — Tableau de bord des cours des métaux précieux.**