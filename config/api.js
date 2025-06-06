// Configuration de l'API
// Pour changer d'API (Laravel, json-server, etc.), modifiez simplement l'URL ici

export const API_CONFIG = {
  // URL de base de l'API - Changez cette URL pour utiliser votre propre API
  BASE_URL: 'https://fakestoreapi.com',
  
  // Endpoints
  LOGIN: '/auth/login',
  DECKS: '/products', // On utilise /products pour simuler les decks avec fakestoreapi
  
  // Pour une vraie API de decks/flashcards, utilisez :
  // BASE_URL: 'https://votre-api.com/api',
  // LOGIN: '/login',
  // DECKS: '/decks',
  // FLASHCARDS: '/flashcards',
};

// Helper pour construire les URLs complètes
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper pour ajouter le token aux headers
export const getAuthHeaders = (token) => {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}; 