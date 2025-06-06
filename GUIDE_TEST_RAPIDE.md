# Guide de Test Rapide - Vérification des Fonctionnalités

## 🚀 Démarrage

1. **Lancer l'application** :
   ```bash
   npm start
   ```

2. **Scanner le QR code** avec Expo Go ou ouvrir dans le navigateur web

## ✅ Tests à effectuer dans l'ordre

### 1️⃣ Test du Login (POST + Token)

1. Sur l'écran de connexion, entrer :
   - Username : `mor_2314`
   - Password : `83r5^_`
2. Cliquer sur "Se connecter"
3. **Vérifier** : Vous arrivez sur l'écran avec les tabs (Decks, Créer, Rappels)

### 2️⃣ Test de la Liste (GET avec Token)

1. Vous devez voir 10 decks de langues différentes
2. Chaque deck affiche :
   - Un drapeau emoji
   - Le titre de la langue
   - Une description
   - Le niveau (Débutant/Intermédiaire)
   - Le nombre de cartes

### 3️⃣ Test Navigation Liste → Détail

1. Cliquer sur n'importe quel deck (ex: "🇬🇧 Anglais - Vocabulaire de base")
2. **Vérifier** : Vous arrivez sur l'écran de détail avec :
   - Les champs modifiables (titre, description, catégorie)
   - Les boutons "Modifier" et "Supprimer"
   - La liste des flashcards

### 4️⃣ Test de Modification (PUT)

1. Dans l'écran détail, modifier :
   - Le titre (ex: ajouter "MODIFIÉ" à la fin)
   - La description
2. Cliquer sur "Modifier le deck"
3. **Vérifier** : 
   - Alert "Succès - Deck modifié avec succès"
   - Retour automatique à la liste

### 5️⃣ Test de Suppression (DELETE)

1. Retourner sur un deck
2. Cliquer sur "Supprimer le deck"
3. **Vérifier** :
   - Alert de confirmation apparaît
   - Si vous confirmez → Alert "Succès - Deck supprimé avec succès"
   - Retour automatique à la liste

### 6️⃣ Test de Gestion du Token

1. Cliquer sur "Déconnexion" (en haut à droite de la liste)
2. **Vérifier** : Retour à l'écran de login
3. Essayer de naviguer directement vers `/decks` (si web)
4. **Vérifier** : Redirection automatique vers login

### 7️⃣ Test des Fonctionnalités Bonus

1. Se reconnecter
2. Aller sur l'onglet "Créer"
   - **Vérifier** : Formulaire pour créer une nouvelle flashcard
3. Aller sur l'onglet "Rappels"
   - **Vérifier** : Interface de gestion des rappels

## 📋 Checklist Finale

- [ ] Login fonctionne avec les identifiants de test
- [ ] Token est stocké (pas d'erreur de navigation)
- [ ] Liste des decks s'affiche avec 10 éléments
- [ ] Navigation vers le détail fonctionne
- [ ] Les données du deck sont bien passées
- [ ] Modification d'un deck fonctionne
- [ ] Suppression d'un deck fonctionne
- [ ] Déconnexion supprime le token
- [ ] Sans token, redirection vers login
- [ ] Les 3 tabs fonctionnent

## ⚠️ Notes Importantes

1. **API de test** : Les modifications ne sont pas persistantes car on utilise FakeStoreAPI
2. **Token** : Le token est valide pour la session, mais FakeStoreAPI ne vérifie pas vraiment l'autorisation
3. **Flashcards** : Les flashcards sont générées côté client pour la démo

## 🎯 Résultat Attendu

Si tous les tests passent ✅, l'application respecte toutes les exigences du cahier des charges :
- 3 écrans minimum ✅
- useState et useEffect ✅
- Props (passage du deck) ✅
- AsyncStorage (token) ✅
- Navigation ✅
- API REST (POST, GET, PUT, DELETE) ✅
- Token dans tous les headers ✅ 