// Config API - modifie ici pour changer d'API

export const API_CONFIG = {
  // URL de base - change ça pour ton API perso
  BASE_URL: 'https://fakestoreapi.com',
  
  // endpoints
  LOGIN: '/auth/login',
  DECKS: '/products', // on utilise products de fakestoreapi pour simuler des decks
  
  // pour une vraie API de flashcards, mettre:
  // BASE_URL: 'https://ton-api.com/api',
  // LOGIN: '/login',
  // DECKS: '/decks',
};

// helper pour les URL complètes
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// helper pour mettre le token dans les headers
export const getAuthHeaders = (token) => {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}; 