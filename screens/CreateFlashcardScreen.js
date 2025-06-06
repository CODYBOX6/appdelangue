import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl, getAuthHeaders } from '../config/api';

export default function CreateFlashcardScreen({ navigation }) {
  const [motFrancais, setMotFrancais] = useState('');
  const [traduction, setTraduction] = useState('');
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger les decks existants
  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(getApiUrl('/products'), {
        headers: getAuthHeaders(token),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Transformer en decks de langues (même logique que DeckListScreen)
        const languageDecks = data.slice(0, 10).map((item, index) => ({
          id: item.id,
          title: getLanguageInfo(index).title,
          language: getLanguageInfo(index).language,
        }));
        setDecks(languageDecks);
      }
    } catch (error) {
      console.error('Erreur chargement decks:', error);
    }
  };

  const getLanguageInfo = (index) => {
    const languages = [
      { title: '🇬🇧 Anglais', language: 'anglais' },
      { title: '🇪🇸 Espagnol', language: 'espagnol' },
      { title: '🇩🇪 Allemand', language: 'allemand' },
      { title: '🇮🇹 Italien', language: 'italien' },
      { title: '🇯🇵 Japonais', language: 'japonais' },
      { title: '🇨🇳 Chinois', language: 'chinois' },
      { title: '🇧🇷 Portugais', language: 'portugais' },
      { title: '🇷🇺 Russe', language: 'russe' },
      { title: '🇸🇦 Arabe', language: 'arabe' },
      { title: '🇰🇷 Coréen', language: 'coréen' },
    ];
    return languages[index % languages.length];
  };

  const handleCreateFlashcard = async () => {
    if (!motFrancais || !traduction || !selectedDeckId) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs et sélectionner un deck');
      return;
    }

    setLoading(true);

    try {
      // Dans une vraie app, on ferait un POST vers l'API
      // Pour la démo, on simule juste le succès
      Alert.alert(
        'Succès ! 🎉',
        `Nouvelle flashcard ajoutée :\n\n${motFrancais} → ${traduction}\n\nDeck : ${selectedLanguage}`,
        [
          {
            text: 'Créer une autre',
            onPress: () => {
              setMotFrancais('');
              setTraduction('');
            }
          },
          {
            text: 'Voir le deck',
            onPress: () => navigation.navigate('Decks')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer la flashcard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Ionicons name="language" size={50} color="#007AFF" />
            <Text style={styles.title}>Créer une Flashcard</Text>
            <Text style={styles.subtitle}>Ajoutez un nouveau mot à apprendre</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mot en français 🇫🇷</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Bonjour"
                value={motFrancais}
                onChangeText={setMotFrancais}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Traduction</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Hello"
                value={traduction}
                onChangeText={setTraduction}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Choisir un deck</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.deckSelector}>
                  {decks.map((deck) => (
                    <TouchableOpacity
                      key={deck.id}
                      style={[
                        styles.deckOption,
                        selectedDeckId === deck.id && styles.deckOptionSelected
                      ]}
                      onPress={() => {
                        setSelectedDeckId(deck.id);
                        setSelectedLanguage(deck.title);
                      }}
                    >
                      <Text style={[
                        styles.deckOptionText,
                        selectedDeckId === deck.id && styles.deckOptionTextSelected
                      ]}>
                        {deck.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <TouchableOpacity
              style={[styles.createButton, loading && styles.createButtonDisabled]}
              onPress={handleCreateFlashcard}
              disabled={loading}
            >
              <Ionicons name="add-circle" size={24} color="#fff" />
              <Text style={styles.createButtonText}>
                {loading ? 'Création...' : 'Créer la flashcard'}
              </Text>
            </TouchableOpacity>

            <View style={styles.tips}>
              <Text style={styles.tipsTitle}>💡 Conseils</Text>
              <Text style={styles.tipText}>• Commencez par des mots simples</Text>
              <Text style={styles.tipText}>• Ajoutez 5-10 mots par jour</Text>
              <Text style={styles.tipText}>• Révisez régulièrement</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  deckSelector: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  deckOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  deckOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  deckOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  deckOptionTextSelected: {
    color: '#fff',
  },
  createButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  tips: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
}); 