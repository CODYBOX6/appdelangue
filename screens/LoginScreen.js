import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import localStorageAPI from '../services/localStorageAPI';

// ÉCRAN 1 : LoginScreen - Authentification avec stockage local
export default function LoginScreen({ navigation }) {
  // useState pour gérer les champs du formulaire
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Animation pour le feedback
  const fadeAnim = new Animated.Value(1);

  // Fonction de connexion avec stockage local
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('⚠️ Attention', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);

    // Animation de pulsation pendant le chargement
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    try {
      // Authentification avec stockage local
      const result = await localStorageAPI.login(username, password);

      if (result.success) {
        // Animation de succès
        Alert.alert(
          '✅ Connexion réussie !',
          'Bienvenue dans votre application de flashcards !',
          [{ 
            text: 'Commencer', 
            onPress: () => navigation.replace('MainTabs')
          }]
        );
      } else {
        Alert.alert(
          '❌ Erreur de connexion',
          result.message || 'Identifiants incorrects',
          [{ text: 'Réessayer' }]
        );
      }
    } catch (error) {
      Alert.alert('❌ Erreur', 'Problème de connexion');
      console.error('Erreur login:', error);
    } finally {
      setLoading(false);
      pulseAnimation.stop();
      fadeAnim.setValue(1);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.title}>🎯 FlashCards</Text>
        <Text style={styles.subtitle}>Apprenez les langues facilement</Text>
      </Animated.View>
      
      {/* Formulaire de connexion */}
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        editable={!loading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#fff" />
            <Text style={styles.loadingText}>Connexion...</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>Se connecter</Text>
        )}
      </TouchableOpacity>

      {/* Info pour la démo */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>🔐 Identifiants de test</Text>
        <Text style={styles.infoText}>Username: mor_2314</Text>
        <Text style={styles.infoText}>Password: 83r5^_</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#1565c0',
    marginVertical: 2,
  },
}); 