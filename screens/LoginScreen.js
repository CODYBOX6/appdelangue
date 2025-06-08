import React, { useState, useContext } from 'react';
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
import { AuthContext } from '../App';

// C'est l'écran de co, tout simple
export default function LoginScreen({ navigation }) {
  // les variables pour le form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // une petite anim pour faire joli
  const fadeAnim = new Animated.Value(1);
  const { signIn } = useContext(AuthContext);

  // la fonction qui verifie si le mdp est bon
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('⚠️ Attention', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);

    // petite anim de chargement pour pas que l'user s'impatiente
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
      // je check les infos avec le contexte
      const result = await signIn({ username, password });

      if (!result.success) {
        Alert.alert(
          '❌ Erreur de connexion',
          result.message || 'Identifiants incorrects',
          [{ text: 'Réessayer' }]
        );
      }
      // La navigation est gérée par le contexte maintenant, plus besoin de le faire ici
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
      
      {/* le formulaire de co */}
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

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.linkButton}>
        <Text style={styles.linkText}>Pas encore de compte ? S'inscrire</Text>
      </TouchableOpacity>
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
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
}); 