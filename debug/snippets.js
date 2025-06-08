export const SNIPPETS = {
  A: {
    title: 'Étape A – Inscription',
    code: `// inscription: on génère un token et on le sauvegarde 
const token = uuid(); // id unique = parfait pour un token
await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);`,
    explain: 'Inscription → génère UUID → stocke dans le AsyncStorage (comme ça on le perd pas)'
  },
  B: {
    title: 'Étape B – Login',
    code: `// login: pareil, on stock le token après verif
const token = uuid(); // normalement viendrait du backend
await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);`,
    explain: 'Login → après verif des identifiants → stocke token (clé d\'accès)'
  },
  C: {
    title: 'Étape C – Bootstrap',
    code: `// au demarrage, on regarde si on a déjà un token
const userToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
// si userToken pas null = on est auth`,
    explain: 'Démarrage app → check si token existant → identifie l\'utilisateur'
  },
  D: {
    title: 'Étape D – Blocage sans token',
    code: `// Affiche login si pas de token, sinon app 
{ state.userToken == null ? 
  <AuthStack/> // écrans login/signup 
  : 
  <AppStack/>  // app complète
}`,
    explain: 'Système de garde: redirection auto login si pas connecté'
  },
  E: {
    title: 'Étape E – Utilisation dans un écran',
    code: `// avant de faire un fetch, on récup le token
const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
// et on l'utilise pour authentifier la requête
fetch(url, { headers: { 'Authorization': token } });`,
    explain: 'Ajoute token à toutes les requêtes → accès aux données privées'
  },
  F: {
    title: 'Étape F – Logout (service)',
    code: `// quand on déconnecte, on supprime le token
await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
// plus de token = plus d'auth!`,
    explain: 'Déconnexion → supprime token complètement'
  },
  G: {
    title: 'Étape G – Logout (UI)',
    code: `// Côté UI: appelle le service puis reset nav
await localStorageAPI.logout(); // supprime token
signOut(); // gère redirection`,
    explain: 'UI logout → supprime token → retour login screen'
  }
}; 