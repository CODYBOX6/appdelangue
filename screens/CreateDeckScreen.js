import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import localStorageAPI from '../services/localStorageAPI';

export default function CreateDeckScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('');
  const [level, setLevel] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateDeck = async () => {
    if (!title || !description || !language || !level) {
      Alert.alert('⚠️ Attention', 'Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);

    try {
      const newDeck = { title, description, language, level, flashcards: [] };
      const result = await localStorageAPI.createDeck(newDeck);

      if (result.success) {
        Alert.alert(
          '✅ Succès !',
          `Le deck "${title}" a été créé.`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('❌ Erreur', result.message || 'Impossible de créer le deck.');
      }
    } catch (error) {
      Alert.alert('❌ Erreur', "Une erreur inattendue est survenue.");
      console.error('Create deck error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Nouveau Deck</Text>
        <Text style={styles.headerSubtitle}>Créez un nouveau paquet de flashcards</Text>
        
        <View style={styles.form}>
          <Text style={styles.label}>Titre du Deck</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 🇬🇧 Anglais - Verbes irréguliers"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Une brève description du contenu du deck"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.label}>Langue</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Anglais"
            value={language}
            onChangeText={setLanguage}
          />

          <Text style={styles.label}>Niveau</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Débutant, Intermédiaire, Avancé"
            value={level}
            onChangeText={setLevel}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCreateDeck}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Création...' : '✨ Créer le Deck'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContent: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 8,
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
}); 