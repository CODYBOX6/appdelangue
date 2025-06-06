import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
  Platform,
} from 'react-native';
import localStorageAPI from '../services/localStorageAPI';

// ÉCRAN 3 : DeckDetailScreen - Détail avec persistance locale
export default function DeckDetailScreen({ navigation, route }) {
  // Récupération du deck passé en props via navigation
  const { deck } = route.params;

  // useState pour gérer les champs modifiables du deck
  const [title, setTitle] = useState(deck.title);
  const [description, setDescription] = useState(deck.description);
  const [category, setCategory] = useState(deck.category);
  const [flashcards, setFlashcards] = useState(deck.flashcards || []);
  const [loading, setLoading] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  // Animation pour le feedback
  const fadeAnim = new Animated.Value(0);

  // Détecter les changements
  useEffect(() => {
    const changed = 
      title !== deck.title || 
      description !== deck.description || 
      category !== deck.category;
    setHasChanges(changed);
  }, [title, description, category]);

  // UseEffect pour mettre à jour le titre de la navigation
  useEffect(() => {
    navigation.setOptions({ title });
  }, [title, navigation]);

  // Fonction de modification avec stockage local
  const handleUpdate = async () => {
    setLoading(true);

    try {
      const result = await localStorageAPI.updateDeck(deck.id, {
        title,
        description,
        category,
        language: deck.language,
        level: deck.level
      });

      if (result.success) {
        // Animation de succès
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 2000,
            delay: 1000,
            useNativeDriver: true,
          }),
        ]).start();

        Alert.alert(
          '✅ Succès !',
          `Le deck "${title}" a été modifié avec succès !`,
          [{ 
            text: 'Super !', 
            onPress: () => {
              setHasChanges(false);
              // Optionnel : retour à la liste
              // navigation.goBack();
            }
          }]
        );
      } else {
        Alert.alert('❌ Erreur', result.message || 'Impossible de modifier le deck');
      }
    } catch (error) {
      Alert.alert('❌ Erreur', 'Problème lors de la modification');
      console.error('Erreur update:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction de suppression avec stockage local
  const handleDelete = async () => {
    Alert.alert(
      '🗑️ Confirmation',
      `Êtes-vous sûr de vouloir supprimer le deck "${deck.title}" ?\n\nCette action est irréversible !`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);

            try {
              const result = await localStorageAPI.deleteDeck(deck.id);

              if (result.success) {
                Alert.alert(
                  '✅ Deck supprimé !',
                  `Le deck "${deck.title}" a été supprimé avec succès.`,
                  [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
              } else {
                Alert.alert('❌ Erreur', result.message || 'Impossible de supprimer le deck');
              }
            } catch (error) {
              Alert.alert('❌ Erreur', 'Problème lors de la suppression');
              console.error('Erreur delete:', error);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // Gérer la suppression d'une flashcard
  const handleDeleteFlashcard = (flashcardId) => {
    Alert.alert(
      '🗑️ Supprimer la carte',
      'Êtes-vous sûr de vouloir supprimer cette flashcard ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            const result = await localStorageAPI.deleteFlashcard(deck.id, flashcardId);
            if (result.success) {
              setFlashcards(result.decks.find(d => d.id === deck.id).flashcards);
              Alert.alert('✅ Succès', 'Flashcard supprimée.');
            } else {
              Alert.alert('❌ Erreur', result.message || 'Impossible de supprimer la carte.');
            }
          },
        },
      ]
    );
  };

  // Gérer la modification d'une flashcard
  const handleUpdateFlashcard = (flashcard) => {
    if (Platform.OS === 'ios') {
      Alert.prompt(
        '✏️ Modifier la question',
        `Question actuelle : "${flashcard.question}"`,
        [
          {
            text: 'Annuler',
            style: 'cancel',
          },
          {
            text: 'Suivant',
            onPress: (newQuestion) => {
              Alert.prompt(
                '✏️ Modifier la réponse',
                `Réponse actuelle : "${flashcard.answer}"`,
                [
                  {
                    text: 'Annuler',
                    style: 'cancel',
                  },
                  {
                    text: 'Enregistrer',
                    onPress: async (newAnswer) => {
                      const result = await localStorageAPI.updateFlashcard(deck.id, flashcard.id, { question: newQuestion, answer: newAnswer });
                      if (result.success) {
                        setFlashcards(result.decks.find(d => d.id === deck.id).flashcards);
                        Alert.alert('✅ Succès', 'Flashcard modifiée.');
                      } else {
                        Alert.alert('❌ Erreur', result.message || 'Impossible de modifier la carte.');
                      }
                    },
                  },
                ],
                'plain-text',
                flashcard.answer
              );
            },
          },
        ],
        'plain-text',
        flashcard.question
      );
    } else {
      // Alert for Android and other platforms
      Alert.alert(
        'Fonctionnalité non disponible',
        'La modification de flashcards est uniquement supportée sur iOS pour cette démo.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Message de succès animé */}
        <Animated.View style={[styles.successMessage, { opacity: fadeAnim }]}>
          <Text style={styles.successText}>✨ Modifications enregistrées !</Text>
        </Animated.View>

        {/* Info badge */}
        <View style={styles.infoBadge}>
          <Text style={styles.infoBadgeText}>💾 Stockage local - Les modifications sont persistantes</Text>
        </View>

        <Text style={styles.label}>Titre du deck</Text>
        <TextInput
          style={[styles.input, hasChanges && styles.inputChanged]}
          value={title}
          onChangeText={setTitle}
          placeholder="Titre"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea, hasChanges && styles.inputChanged]}
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Catégorie</Text>
        <TextInput
          style={[styles.input, hasChanges && styles.inputChanged]}
          value={category}
          onChangeText={setCategory}
          placeholder="Catégorie"
        />

        {/* Indicateur de modifications */}
        {hasChanges && (
          <View style={styles.changesIndicator}>
            <Text style={styles.changesText}>✏️ Modifications non sauvegardées</Text>
          </View>
        )}

        {/* Boutons d'action */}
        <TouchableOpacity
          style={[
            styles.button, 
            styles.updateButton, 
            loading && styles.buttonDisabled,
            !hasChanges && styles.buttonSecondary
          ]}
          onPress={handleUpdate}
          disabled={loading || !hasChanges}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.buttonText}>
                {hasChanges ? '💾 Enregistrer les modifications' : '✓ Aucune modification'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton, loading && styles.buttonDisabled]}
          onPress={handleDelete}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>🗑️ Supprimer le deck</Text>
        </TouchableOpacity>

        {/* Section Flashcards */}
        <View style={styles.flashcardsSection}>
          <TouchableOpacity 
            style={styles.flashcardsHeader}
            onPress={() => setShowFlashcards(!showFlashcards)}
            activeOpacity={0.7}
          >
            <Text style={styles.flashcardsTitle}>
              📚 Flashcards ({flashcards.length} cartes)
            </Text>
            <Text style={styles.toggleIcon}>
              {showFlashcards ? '▼' : '▶'}
            </Text>
          </TouchableOpacity>

          {showFlashcards && (
            <View style={styles.flashcardsContainer}>
              {flashcards.length > 0 ? (
                flashcards.map((card, index) => (
                  <View key={index} style={styles.flashcard}>
                    <View style={styles.flashcardContent}>
                      <Text style={styles.flashcardText}><Text style={styles.flashcardLabel}>Q:</Text> {card.question}</Text>
                      <Text style={styles.flashcardText}><Text style={styles.flashcardLabel}>R:</Text> {card.answer}</Text>
                    </View>
                    <View style={styles.flashcardActions}>
                      <TouchableOpacity onPress={() => handleUpdateFlashcard(card)} style={styles.actionButton}>
                        <Text>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteFlashcard(card.id)} style={[styles.actionButton, styles.deleteAction]}>
                        <Text>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noFlashcardsText}>Aucune flashcard dans ce deck.</Text>
              )}
            </View>
          )}
        </View>

        {/* Info deck */}
        <View style={styles.deckInfo}>
          <Text style={styles.deckInfoText}>🏷️ ID: {deck.id}</Text>
          <Text style={styles.deckInfoText}>🌍 Langue: {deck.language}</Text>
          <Text style={styles.deckInfoText}>📊 Niveau: {deck.level}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  successMessage: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  successText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBadge: {
    backgroundColor: '#e3f2fd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoBadgeText: {
    color: '#1976d2',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '600',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
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
  inputChanged: {
    borderColor: '#FF9800',
    borderWidth: 2,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  changesIndicator: {
    backgroundColor: '#FFF3E0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  changesText: {
    color: '#E65100',
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
  },
  updateButton: {
    backgroundColor: '#007AFF',
    marginTop: 10,
  },
  buttonSecondary: {
    backgroundColor: '#95a5a6',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  flashcardsSection: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  flashcardsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  flashcardsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  toggleIcon: {
    fontSize: 16,
    color: '#666',
  },
  flashcardsContainer: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  flashcard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  flashcardContent: {
    flex: 1,
  },
  flashcardActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 10,
  },
  deleteAction: {
    // Pas de style particulier pour l'instant
  },
  flashcardText: {
    fontSize: 16,
    color: '#333',
  },
  flashcardLabel: {
    fontWeight: 'bold',
  },
  noFlashcardsText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 20,
    fontStyle: 'italic',
  },
  deckInfo: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  deckInfoText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
  toggleButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
  },
  toggleButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
}); 