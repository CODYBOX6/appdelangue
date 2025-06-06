# Guide de Résolution des Problèmes

## ✅ Problèmes Résolus

### 1. Erreur "Unable to resolve ProductListScreen.js"
**Cause** : Les anciens fichiers ProductListScreen et ProductDetailScreen ont été supprimés et remplacés par DeckListScreen et DeckDetailScreen.

**Solution appliquée** :
- Suppression du fichier `App.old.js` qui référençait encore les anciens fichiers
- Vérification qu'aucun autre fichier ne référence les anciens écrans

### 2. Dépendances Web manquantes
**Cause** : Les packages nécessaires pour le support web n'étaient pas installés.

**Solution appliquée** :
```bash
npx expo install react-dom react-native-web @expo/metro-runtime
```

### 3. Version d'AsyncStorage
**Cause** : Version incompatible d'AsyncStorage.

**Solution appliquée** :
```bash
npm install @react-native-async-storage/async-storage@2.1.2
```

## 🚀 Pour Démarrer l'Application

1. **Arrêter tous les processus Expo** :
   ```bash
   pkill -f "expo start"
   ```

2. **Nettoyer le cache** (si nécessaire) :
   ```bash
   npx expo start -c
   ```

3. **Démarrer normalement** :
   ```bash
   npm start
   ```

4. **Choisir la plateforme** :
   - Appuyez sur `w` pour ouvrir dans le navigateur web
   - Scannez le QR code avec Expo Go pour mobile
   - Appuyez sur `i` pour iOS simulator (nécessite Xcode)
   - Appuyez sur `a` pour Android emulator

## ⚠️ Erreurs dans la Console du Navigateur

Les erreurs suivantes peuvent être ignorées car elles proviennent d'extensions Chrome :
- `background.js` errors
- `Unchecked runtime.lastError`
- `FrameIsBrowserFrameError`
- `FrameDoesNotExistError`

Ces erreurs n'affectent pas le fonctionnement de votre application React Native.

## 📱 Test de l'Application

Une fois l'application lancée, testez dans l'ordre :

1. **Page de Login** :
   - Username : `mor_2314`
   - Password : `83r5^_`

2. **Liste des Decks** :
   - Vérifiez que 10 decks de langues s'affichent
   - Testez la déconnexion

3. **Détail d'un Deck** :
   - Cliquez sur un deck
   - Testez la modification
   - Testez la suppression

## 🔧 Si l'Application ne Démarre Pas

1. **Vérifier les ports** :
   Si le port 8081 est occupé, Expo proposera automatiquement un autre port.

2. **Réinstaller les dépendances** :
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **Nettoyer le cache Metro** :
   ```bash
   npx expo start -c
   ```

## ✅ Vérification Finale

L'application fonctionne correctement si :
- ✅ Login avec token fonctionne
- ✅ Liste des decks se charge
- ✅ Navigation vers le détail fonctionne
- ✅ Modification (PUT) fonctionne
- ✅ Suppression (DELETE) fonctionne
- ✅ Déconnexion supprime le token
- ✅ Sans token, redirection vers login

## 📞 Support

Si vous rencontrez d'autres problèmes :
1. Vérifiez la console pour les erreurs spécifiques
2. Consultez les fichiers de documentation créés
3. Assurez-vous que toutes les dépendances sont installées 