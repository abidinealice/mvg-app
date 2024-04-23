# Mon vieux Grimoire

## Comment lancer le projet ?

### Avec npm

Faites la commande `npm install`, `npm install nodemon` pour installer les dépendances puis `nodemon start` pour lancer le projet.

Le projet a été testé sur node v21.6.2.

## Comment se connecter à MongoDB ?

Le fichier .env contient les données nécessaire à la connection à MongoDB. Il a été mis à votre disposition.

Dans le cas où les valeurs des clés ne seraient pas présentes dans le fichier .env vous pouvez vous connecter en utilisant cet utilisateur qui peut lire et modifier toutes donées de la base de donnée :

DB_NAME=kevinTest
DB_PASSWORD=testmvg
