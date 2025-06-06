# 🌍 Application React Native - Apprentissage de Langues avec Flashcards

## 🎯 Description
Application React Native (Expo) d'apprentissage de langues utilisant un système de flashcards. L'app démontre l'utilisation complète d'une API REST avec authentification par token JWT, permettant d'apprendre 10 langues différentes avec des mots et leurs traductions. Parfait pour mémoriser du vocabulaire !

## ✅ Points validés selon le cahier des charges

### 1. Structure (3 écrans minimum) ✓
- **LoginScreen** : Authentification avec formulaire
- **DeckListScreen** : Liste des decks avec nombre de cartes
- **DeckDetailScreen** : Détail du deck, modification, suppression et affichage des flashcards

### 2. Concepts React utilisés ✓
- **useState** : Gestion des états locaux (formulaires, données)
- **useEffect** : Chargement des données au montage
- **props** : Passage de données entre écrans via navigation
- **AsyncStorage** : Stockage persistant du token
- **Navigation** : React Navigation pour la navigation entre écrans

### 3. Opérations API REST ✓
- **POST** : `/auth/login` - Connexion et récupération du token
- **GET** : `/products` (simulant `/decks`) - Récupération de la liste des decks
- **PUT** : `/products/:id` (simulant `/decks/:id`) - Modification d'un deck
- **DELETE** : `/products/:id` (simulant `/decks/:id`) - Suppression d'un deck

### 4. Gestion du token ✓
- Stockage sécurisé dans AsyncStorage après connexion
- Ajout automatique dans les headers de toutes les requêtes
- Redirection vers login si token absent

## 🚀 Installation et lancement

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer l'application
npm start

# 3. Scanner le QR code avec Expo Go (iOS/Android)
```

## 🔧 Configuration de l'API

L'application est configurée pour utiliser `fakestoreapi.com` par défaut. Pour utiliser votre propre API (Laravel, Node.js, etc.), modifiez le fichier `config/api.js` :

```javascript
export const API_CONFIG = {
  // Remplacez par votre URL d'API
  BASE_URL: 'https://votre-api.com/api',
  LOGIN: '/login',
  PRODUCTS: '/products',
};
```

### Exemple avec API Laravel locale via ngrok :
```javascript
BASE_URL: 'https://abc123.ngrok.io/api',
```

## 🌐 Langues disponibles

L'application propose 10 decks de langues différentes :
- 🇬🇧 **Anglais** - Vocabulaire de base
- 🇪🇸 **Espagnol** - Phrases courantes  
- 🇩🇪 **Allemand** - Vie quotidienne
- 🇮🇹 **Italien** - Restaurant & Cuisine
- 🇯🇵 **Japonais** - Hiragana
- 🇨🇳 **Chinois** - HSK 1
- 🇧🇷 **Portugais** - Voyages
- 🇷🇺 **Russe** - Alphabet cyrillique
- 🇸🇦 **Arabe** - Salutations
- 🇰🇷 **Coréen** - K-pop & Culture

## 📱 Identifiants de test

Pour l'API de démonstration (fakestoreapi) :
- **Username** : mor_2314
- **Password** : 83r5^_

## 🗂️ Structure du projet

```
├── App.js                    # Point d'entrée, configuration navigation
├── config/
│   └── api.js               # Configuration centralisée de l'API
├── screens/
│   ├── LoginScreen.js       # Écran de connexion
│   ├── DeckListScreen.js    # Liste des decks
│   └── DeckDetailScreen.js  # Détail du deck avec flashcards
└── README.md
```

## 🎥 Points clés pour la vidéo démo

1. **Connexion** : Montrer la saisie des identifiants et la récupération du token
2. **Liste des decks** : Afficher la liste récupérée via GET avec le token et le nombre de cartes
3. **Navigation** : Passage de la liste au détail d'un deck avec les props
4. **Flashcards** : Montrer la liste des flashcards dans le deck
5. **Modification** : Démontrer la modification d'un deck (PUT)
6. **Suppression** : Supprimer un deck (DELETE)
7. **Token** : Expliquer comment le token est stocké et utilisé
8. **Flexibilité** : Mentionner que l'app fonctionne avec n'importe quelle API REST

## 🛠️ Technologies utilisées

- React Native (Expo)
- React Navigation
- AsyncStorage
- Fetch API

## 📝 Notes importantes

- Le code est commenté pour faciliter la compréhension
- La configuration API est centralisée pour faciliter les changements
- Gestion des erreurs et états de chargement incluse
- Compatible avec toute API REST respectant les standards JWT # appdelangue
