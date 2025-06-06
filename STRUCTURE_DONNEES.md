# 📊 Structure des Données - Decks et Flashcards de Langues

## 🎯 Exemple de Deck avec Flashcards (Traductions)

```javascript
{
  id: 1,
  title: "Anglais - Vocabulaire de base",
  description: "Mots essentiels pour débuter en anglais",
  category: "Langues",
  language: "anglais",
  level: "Débutant",
  cardCount: 7,
  flashcards: [
    {
      id: "1-0",
      question: "Bonjour",
      answer: "Hello"
    },
    {
      id: "1-1", 
      question: "Merci",
      answer: "Thank you"
    },
    {
      id: "1-2",
      question: "Au revoir",
      answer: "Goodbye"
    },
    {
      id: "1-3",
      question: "S'il vous plaît",
      answer: "Please"
    },
    {
      id: "1-4",
      question: "Excusez-moi",
      answer: "Excuse me"
    },
    {
      id: "1-5",
      question: "Eau",
      answer: "Water"
    },
    {
      id: "1-6",
      question: "Pain",
      answer: "Bread"
    }
  ]
}
```

## 🗃️ Structure complète d'un Deck

```typescript
interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

interface Deck {
  id: number;
  title: string;
  description: string;
  category: string;
  language: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  cardCount: number;
  flashcards: Flashcard[];
  // Compatibilité avec fakestoreapi
  price?: number;
  image?: string;
}
```

## 📝 Exemples de Decks par Langue

### 🇬🇧 Anglais - Débutant
```javascript
{
  title: "Anglais - Vocabulaire de base",
  description: "Mots essentiels pour débuter en anglais",
  category: "Langues",
  language: "anglais",
  level: "Débutant",
  flashcards: [
    { question: "Bonjour", answer: "Hello" },
    { question: "Merci", answer: "Thank you" },
    { question: "Eau", answer: "Water" },
    { question: "Famille", answer: "Family" },
    // ...
  ]
}
```

### 🇯🇵 Japonais - Débutant
```javascript
{
  title: "Japonais - Hiragana",
  description: "Apprentissage des caractères hiragana",
  category: "Langues",
  language: "japonais",
  level: "Débutant",
  flashcards: [
    { question: "Bonjour", answer: "こんにちは (Konnichiwa)" },
    { question: "Merci", answer: "ありがとう (Arigatou)" },
    { question: "Japon", answer: "にほん (Nihon)" },
    { question: "École", answer: "がっこう (Gakkou)" },
    // ...
  ]
}
```

### 🇪🇸 Espagnol - Débutant
```javascript
{
  title: "Espagnol - Phrases courantes",
  description: "Expressions utiles pour voyager",
  category: "Langues",
  language: "espagnol",
  level: "Débutant",
  flashcards: [
    { question: "Bonjour", answer: "Hola" },
    { question: "Comment allez-vous?", answer: "¿Cómo está?" },
    { question: "Ami", answer: "Amigo" },
    { question: "Famille", answer: "Familia" },
    // ...
  ]
}
```

## 🔄 Transformation depuis FakeStoreAPI

L'app transforme automatiquement les produits de fakestoreapi en decks :

```javascript
// Produit original (fakestoreapi)
{
  id: 1,
  title: "Fjallraven - Foldsack No. 1 Backpack",
  price: 109.95,
  description: "Your perfect pack...",
  category: "men's clothing",
  image: "https://fakestoreapi.com/img/..."
}

// Transformé en Deck
{
  id: 1,
  title: "Fjallraven - Foldsack No. 1 Backpack",
  description: "Your perfect pack...",
  category: "men's clothing",
  cardCount: 5,
  flashcards: [
    { id: "1-0", question: "Bonjour", answer: "Hello" },
    { id: "1-1", question: "Merci", answer: "Thank you" },
    // ...
  ],
  // Garde la compatibilité
  price: 109.95,
  image: "https://fakestoreapi.com/img/..."
}
```

## 💡 Pour une vraie API de Flashcards

Avec une vraie API, les endpoints seraient :

```bash
GET    /api/decks              # Liste tous les decks
GET    /api/decks/:id          # Détail d'un deck avec ses flashcards
POST   /api/decks              # Créer un nouveau deck
PUT    /api/decks/:id          # Modifier un deck
DELETE /api/decks/:id          # Supprimer un deck

GET    /api/decks/:id/flashcards      # Toutes les flashcards d'un deck
POST   /api/decks/:id/flashcards      # Ajouter une flashcard
PUT    /api/flashcards/:id            # Modifier une flashcard
DELETE /api/flashcards/:id            # Supprimer une flashcard
``` 