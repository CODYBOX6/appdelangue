import AsyncStorage from '@react-native-async-storage/async-storage';

// C'est mon API maison, en gros ca sauvegarde tout sur le tel
// Ca fait le taff pour le projet, pas besoin de vrai serveur

export const STORAGE_KEYS = {
  TOKEN: 'authToken',
  DECKS: 'decks',
  USERS: 'app_users',
};

// les decks de base, pour pas partir de zero
const initialDecks = [
  {
    id: '1',
    title: "🇬🇧 Anglais - Vocabulaire de base",
    description: "Mots essentiels pour débuter en anglais",
    category: "Langues",
    language: "anglais",
    level: "Débutant",
    flashcards: [
      { id: '1-1', question: "Bonjour", answer: "Hello" },
      { id: '1-2', question: "Merci", answer: "Thank you" },
      { id: '1-3', question: "Au revoir", answer: "Goodbye" },
      { id: '1-4', question: "S'il vous plaît", answer: "Please" },
      { id: '1-5', question: "Excusez-moi", answer: "Excuse me" }
    ]
  },
  {
    id: '2',
    title: "🇪🇸 Espagnol - Phrases courantes",
    description: "Expressions utiles pour voyager",
    category: "Langues",
    language: "espagnol",
    level: "Débutant",
    flashcards: [
      { id: '2-1', question: "Bonjour", answer: "Hola" },
      { id: '2-2', question: "Merci", answer: "Gracias" },
      { id: '2-3', question: "Au revoir", answer: "Adiós" },
      { id: '2-4', question: "Comment allez-vous?", answer: "¿Cómo está?" },
      { id: '2-5', question: "Très bien", answer: "Muy bien" }
    ]
  },
  {
    id: '3',
    title: "🇩🇪 Allemand - Vie quotidienne",
    description: "Vocabulaire du quotidien en allemand",
    category: "Langues",
    language: "allemand",
    level: "Intermédiaire",
    flashcards: [
      { id: '3-1', question: "Bonjour", answer: "Guten Tag" },
      { id: '3-2', question: "Merci", answer: "Danke" },
      { id: '3-3', question: "Bonne nuit", answer: "Gute Nacht" },
      { id: '3-4', question: "École", answer: "Schule" },
      { id: '3-5', question: "Voiture", answer: "Auto" }
    ]
  },
  {
    id: '4',
    title: "🇮🇹 Italien - Restaurant & Cuisine",
    description: "Vocabulaire pour commander au restaurant",
    category: "Langues",
    language: "italien",
    level: "Débutant",
    flashcards: [
      { id: '4-1', question: "Pizza", answer: "Pizza" },
      { id: '4-2', question: "Pâtes", answer: "Pasta" },
      { id: '4-3', question: "Café", answer: "Caffè" },
      { id: '4-4', question: "L'addition", answer: "Il conto" },
      { id: '4-5', question: "Délicieux", answer: "Delizioso" }
    ]
  },
  {
    id: '5',
    title: "🇯🇵 Japonais - Hiragana",
    description: "Apprentissage des caractères hiragana",
    category: "Langues",
    language: "japonais",
    level: "Débutant",
    flashcards: [
      { id: '5-1', question: "Bonjour", answer: "こんにちは (Konnichiwa)" },
      { id: '5-2', question: "Merci", answer: "ありがとう (Arigatou)" },
      { id: '5-3', question: "Oui", answer: "はい (Hai)" },
      { id: '5-4', question: "Non", answer: "いいえ (Iie)" },
      { id: '5-5', question: "École", answer: "がっこう (Gakkou)" }
    ]
  },
  {
    id: '6',
    title: "🇨🇳 Chinois - HSK 1",
    description: "Vocabulaire de base HSK niveau 1",
    category: "Langues",
    language: "chinois",
    level: "Débutant",
    flashcards: [
      { id: '6-1', question: "Bonjour", answer: "你好 (Nǐ hǎo)" },
      { id: '6-2', question: "Merci", answer: "谢谢 (Xièxiè)" },
      { id: '6-3', question: "Je", answer: "我 (Wǒ)" },
      { id: '6-4', question: "Chine", answer: "中国 (Zhōngguó)" },
      { id: '6-5', question: "Étudier", answer: "学习 (Xuéxí)" }
    ]
  },
  {
    id: '7',
    title: "🇧🇷 Portugais - Voyages",
    description: "Phrases utiles pour voyager au Brésil",
    category: "Langues",
    language: "portugais",
    level: "Débutant",
    flashcards: [
      { id: '7-1', question: "Bonjour", answer: "Olá" },
      { id: '7-2', question: "Plage", answer: "Praia" },
      { id: '7-3', question: "Soleil", answer: "Sol" },
      { id: '7-4', question: "Football", answer: "Futebol" },
      { id: '7-5', question: "Merci", answer: "Obrigado" }
    ]
  },
  {
    id: '8',
    title: "🇷🇺 Russe - Alphabet cyrillique",
    description: "Apprendre à lire le cyrillique",
    category: "Langues",
    language: "russe",
    level: "Débutant",
    flashcards: [
      { id: '8-1', question: "Bonjour", answer: "Привет (Privet)" },
      { id: '8-2', question: "Merci", answer: "Спасибо (Spasibo)" },
      { id: '8-3', question: "Oui", answer: "Да (Da)" },
      { id: '8-4', question: "Non", answer: "Нет (Net)" },
      { id: '8-5', question: "Russie", answer: "Россия (Rossiya)" }
    ]
  },
  {
    id: '9',
    title: "🇸🇦 Arabe - Salutations",
    description: "Formules de politesse en arabe",
    category: "Langues",
    language: "arabe",
    level: "Débutant",
    flashcards: [
      { id: '9-1', question: "Paix sur vous", answer: "السلام عليكم (As-salāmu ʿalaykum)" },
      { id: '9-2', question: "Merci", answer: "شكرا (Shukran)" },
      { id: '9-3', question: "Oui", answer: "نعم (Na'am)" },
      { id: '9-4', question: "Maison", answer: "بيت (Bayt)" },
      { id: '9-5', question: "Livre", answer: "كتاب (Kitab)" }
    ]
  },
  {
    id: '10',
    title: "🇰🇷 Coréen - K-pop & Culture",
    description: "Vocabulaire de la culture coréenne",
    category: "Langues",
    language: "coréen",
    level: "Intermédiaire",
    flashcards: [
      { id: '10-1', question: "Bonjour", answer: "안녕하세요 (Annyeonghaseyo)" },
      { id: '10-2', question: "Merci", answer: "감사합니다 (Gamsahamnida)" },
      { id: '10-3', question: "K-pop", answer: "케이팝 (K-pop)" },
      { id: '10-4', question: "Chanson", answer: "노래 (Norae)" },
      { id: '10-5', question: "Corée", answer: "한국 (Hanguk)" }
    ]
  }
];

// initialise les données de base
const initializeData = async () => {
  try {
    // check si decks existent déjà
    const existingDecks = await AsyncStorage.getItem(STORAGE_KEYS.DECKS);
    if (!existingDecks) {
      await AsyncStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(initialDecks));
    }
    // check si users existent déjà
    const existingUsers = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
    if (!existingUsers) {
      const demoUser = { username: 'mor_2314', password: '83r5^_' };
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([demoUser]));
    }
  } catch (error) {
    console.error('❌ Erreur initialisation données:', error);
  }
};

// mon 'API' locale, avec toutes les fonctions pour gérer les données
export const localStorageAPI = {
  // pour s'inscrire
  register: async (username, password) => {
    await initializeData();
    const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
    const users = usersJson ? JSON.parse(usersJson) : [];

    if (users.find(u => u.username === username)) {
      return { success: false, message: 'Ce nom d\'utilisateur est déjà pris.' };
    }

    users.push({ username, password });
    await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return { success: true };
  },

  // pour se connecter
  login: async (username, password) => {
    await initializeData();
    const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
    const users = usersJson ? JSON.parse(usersJson) : [];

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      // ÉTAPES A & B - création token et stockage
      const token = 'fake-jwt-token-' + Date.now();
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);

      return { success: true, token };
    }
    return { success: false, message: 'Identifiants incorrects' };
  },

  // déconnexion - vire le token
  logout: async () => {
    // ÉTAPE F - déconnexion: suppr token
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  // récup tous les decks
  getDecks: async () => {
    try {
      await initializeData(); // faut verifier que les données sont la avant
      const decksJson = await AsyncStorage.getItem(STORAGE_KEYS.DECKS);
      return JSON.parse(decksJson) || [];
    } catch (error) {
      console.error('❌ Erreur lecture decks:', error);
      return [];
    }
  },

  // trouver un deck avec son id
  getDeckById: async (id) => {
    const decks = await localStorageAPI.getDecks();
    return decks.find(deck => deck.id === id);
  },

  // pour modifier un deck
  updateDeck: async (id, updatedData) => {
    try {
      const decks = await localStorageAPI.getDecks();
      const index = decks.findIndex(deck => deck.id === id);
      
      if (index !== -1) {
        // qd je modifie un deck, je veux pas ecraser les cartes dedans
        decks[index] = {
          ...decks[index],
          ...updatedData,
          flashcards: decks[index].flashcards // donc je les garde
        };
        
        await AsyncStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
        console.log('✅ Deck mis à jour avec succès');
        return { success: true, deck: decks[index] };
      }
      
      return { success: false, message: 'Deck non trouvé' };
    } catch (error) {
      console.error('❌ Erreur mise à jour deck:', error);
      return { success: false, message: error.message };
    }
  },

  // pour supprimer un deck
  deleteDeck: async (id) => {
    try {
      const decks = await localStorageAPI.getDecks();
      const filteredDecks = decks.filter(deck => deck.id !== id);
      
      await AsyncStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(filteredDecks));
      console.log('✅ Deck supprimé avec succès');
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur suppression deck:', error);
      return { success: false, message: error.message };
    }
  },

  // pour creer un nouveau deck
  createDeck: async (newDeck) => {
    try {
      const decks = await localStorageAPI.getDecks();
      const deckWithId = {
        ...newDeck,
        id: Date.now().toString(),
        flashcards: newDeck.flashcards || []
      };
      
      decks.push(deckWithId);
      await AsyncStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
      console.log('✅ Deck créé avec succès');
      return { success: true, deck: deckWithId };
    } catch (error) {
      console.error('❌ Erreur création deck:', error);
      return { success: false, message: error.message };
    }
  },

  // ajouter une carte a un deck precis
  addFlashcard: async (deckId, flashcard) => {
    try {
      const decks = await localStorageAPI.getDecks();
      const deck = decks.find(d => d.id === deckId);
      
      if (deck) {
        const newFlashcard = {
          ...flashcard,
          id: `${deckId}-${Date.now()}`
        };
        
        deck.flashcards = deck.flashcards || [];
        deck.flashcards.push(newFlashcard);
        
        await AsyncStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
        console.log('✅ Flashcard ajoutée avec succès');
        return { success: true, flashcard: newFlashcard };
      }
      
      return { success: false, message: 'Deck non trouvé' };
    } catch (error) {
      console.error('❌ Erreur ajout flashcard:', error);
      return { success: false, message: error.message };
    }
  },

  // modifier une carte
  updateFlashcard: async (deckId, flashcardId, updatedData) => {
    try {
      const decks = await localStorageAPI.getDecks();
      const deck = decks.find(d => d.id === deckId);

      if (deck) {
        const cardIndex = deck.flashcards.findIndex(c => c.id === flashcardId);
        if (cardIndex !== -1) {
          deck.flashcards[cardIndex] = { ...deck.flashcards[cardIndex], ...updatedData };
          await AsyncStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
          console.log('✅ Flashcard mise à jour');
          return { success: true, decks };
        }
      }
      return { success: false, message: 'Flashcard non trouvée' };
    } catch (error) {
      console.error('❌ Erreur mise à jour flashcard:', error);
      return { success: false, message: error.message };
    }
  },

  // supprimer une carte
  deleteFlashcard: async (deckId, flashcardId) => {
    try {
      const decks = await localStorageAPI.getDecks();
      const deck = decks.find(d => d.id === deckId);

      if (deck) {
        deck.flashcards = deck.flashcards.filter(c => c.id !== flashcardId);
        await AsyncStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
        console.log('✅ Flashcard supprimée');
        return { success: true, decks };
      }
      return { success: false, message: 'Deck non trouvé' };
    } catch (error) {
      console.error('❌ Erreur suppression flashcard:', error);
      return { success: false, message: error.message };
    }
  }
};

export default localStorageAPI; 