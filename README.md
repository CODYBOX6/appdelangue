# App flashcards de langues 

J'ai codé cette app en React Native/Expo pour apprendre les langues avec des cartes recto-verso. Y'a un système d'auth avec tokens JWT pour la sécurité. Bref on peut apprendre plein de langues avec.

Pour le prof (validations des critères):

Structure: j'ai bien les 3 écrans demandés
- écran login avec formulaire
- écran liste des decks (affiche nb de cartes) 
- écran détail qui montre les cartes avec modif/suppression

Pour le React j'ai tout utilisé:
- useState pour les données, forms, etc
- useEffect pour charger des trucs
- props entre écrans
- AsyncStorage pour le token 
- react nav pour la navigation

Côté API REST:
- POST login → token
- GET decks
- PUT modif
- DELETE suppression

Pour le token je fais comme demandé:
- stocké dans AsyncStorage 
- ajouté dans tous les headers
- redirection login si pas de token

Pour lancer l'app:

npm install
npm start

Puis scanner avec Expo Go

Config API:
J'utilise fakestoreapi par défaut mais c'est modifiable dans config/api.js

export const API_CONFIG = {
  BASE_URL: 'ton-api.com/api',
  LOGIN: '/login',
  PRODUCTS: '/products', 
};


Les langues dispo:
- Anglais (trucs de base)
- Espagnol (phrases utiles)  
- Allemand (quotidien)
- Italien (resto & bouffe)
- Japonais (hiragana)
- Chinois (HSK1)
- Portugais (voyage)
- Russe (cyrillique, galère!)
- Arabe (salutations)
- Coréen (kpop)

Identifiants test:
- Username: mor_2314
- Password: 83r5^_

Pour la vidéo je montre:
1. Connexion/token
2. Liste des decks
3. Navigation
4. Cartes dans chaque deck
5. Modif d'un deck
6. Suppression
7. Fonctionnement du token
8. Compatibilité avec d'autres API

J'ai commenté le code et centralisé la config API. L'app est compatible avec n'importe quelle API qui respecte JWT.



  Petite modif de l'app pour montrer le code concernant la durée de vie et gestion du token a travers l application (debug mode) sera enlevé de l'app après la vidéo.

