# 🎥 Script pour la Vidéo Démo (5 min max)

## Introduction (30 secondes)
"Bonjour, je vais vous présenter mon application React Native de gestion de decks et flashcards. Elle démontre l'utilisation complète d'une API REST avec authentification par token JWT, et respecte tous les critères du cahier des charges avec 3 écrans principaux et l'utilisation des hooks React demandés."

## 1. Démonstration de la connexion (1 minute)

### Actions à montrer :
1. **Ouvrir l'app** sur le LoginScreen
2. **Montrer le code** de `LoginScreen.js` rapidement :
   - "Ici j'utilise `useState` pour gérer les champs du formulaire"
   - "La fonction `handleLogin` fait un POST vers l'API"
   - "Le token reçu est stocké dans `AsyncStorage`"
3. **Se connecter** avec les identifiants :
   - Username: `mor_2314`
   - Password: `83r5^_`
4. **Expliquer** : "L'API retourne un token JWT qui est automatiquement sauvegardé"

## 2. Liste des decks (1 minute)

### Actions à montrer :
1. **Arrivée sur DeckListScreen**
2. **Montrer le code** rapidement :
   - "J'utilise `useEffect` pour charger les decks au montage"
   - "Le token est récupéré depuis AsyncStorage et ajouté aux headers"
   - "La requête GET récupère tous les decks avec leurs flashcards simulées"
3. **Faire défiler la liste** pour montrer les decks
4. **Expliquer** : "Chaque deck affiche son titre, description et nombre de cartes"

## 3. Navigation et passage de props (30 secondes)

### Actions à montrer :
1. **Cliquer sur un deck**
2. **Montrer dans le code** :
   - "Je passe le deck sélectionné avec ses flashcards via les props de navigation"
   - "DeckDetailScreen récupère ces props avec `route.params`"

## 4. Affichage des flashcards et modification du deck (1 minute 30)

### Actions à montrer :
1. **Sur l'écran de détail** :
   - Montrer la section flashcards (cliquer pour déplier/replier)
   - Afficher les questions/réponses
2. **Modifier le deck** :
   - Le titre
   - La description
   - La catégorie
3. **Montrer le code** :
   - "J'utilise `useState` pour chaque champ et pour gérer l'affichage des flashcards"
   - "La fonction `handleUpdate` fait un PUT avec le token"
4. **Cliquer sur "Modifier le deck"**
5. **Montrer l'alerte de succès**

## 5. Suppression d'un deck (45 secondes)

### Actions à montrer :
1. **Cliquer sur "Supprimer le deck"**
2. **Montrer la confirmation**
3. **Confirmer la suppression**
4. **Montrer dans le code** :
   - "DELETE avec le token dans les headers"
   - "Retour automatique à la liste après suppression"

## 6. Configuration API flexible (45 secondes)

### Actions à montrer :
1. **Ouvrir `config/api.js`**
2. **Expliquer** :
   - "Toute la configuration API est centralisée ici"
   - "Pour utiliser une API Laravel, il suffit de changer BASE_URL"
   - "Compatible avec n'importe quelle API REST standard"
3. **Montrer les exemples commentés** pour ngrok/Laravel

## Conclusion (30 secondes)

"En résumé, cette application de gestion de decks et flashcards démontre :
- L'authentification avec token JWT stocké dans AsyncStorage
- Les 4 opérations CRUD via API REST (GET, POST, PUT, DELETE)
- L'utilisation des hooks React : useState, useEffect, props
- Le passage de données complexes (decks avec flashcards) entre écrans
- La gestion d'états multiples (champs modifiables, affichage flashcards)
- Une architecture flexible compatible avec toute API REST

Le code est propre, commenté et prêt à l'emploi. L'application peut facilement être adaptée pour utiliser une vraie API de flashcards. Merci de votre attention !"

## 📝 Conseils techniques :
- Enregistrer avec **QuickTime** (Mac) ou **OBS Studio**
- Résolution **1920x1080** minimum
- Avoir le **simulateur** et **VS Code** ouverts côte à côte
- Parler **clairement** et **lentement**
- **Zoomer** sur le code important 