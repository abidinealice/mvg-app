# Mon Vieux Grimoire

## Contexte

Ce projet fait parti des projets à réaliser durant la formation Développeur Web d’OpenClassrooms.

Mon Vieux Grimoire est un site internet qui permet aux usagers inscrit de référencer ainsi que de noter des livres. J'ai été chargé de développer la partie back-end. Le serveur Express est connecté à une base de données MongoDB. Des opérations CRUD ont été implémentées pour la gestion des livres et des notations.

## Comment lancer le projet ?

### Avec npm

Faites la commande `npm install`, `npm install nodemon` pour installer les dépendances puis `nodemon start` pour lancer le projet.

Le projet a été testé sur node v21.6.2.

## Comment se connecter à MongoDB ?

Le fichier .env contient les données nécessaires à la connexion à MongoDB. Il a été mis à votre disposition.

Dans le cas où les valeurs des clés ne seraient pas présentes dans le fichier .env vous pouvez vous connecter en utilisant cet utilisateur qui peut lire et modifier toutes données de la base de données :

DB_NAME=kevinTest
DB_PASSWORD=testmvg
