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

// ici on voit les détails d'un deck, on peut le modif ou le supprimer
export default function DeckDetailScreen({ navigation, route }) {
  // je recup le deck qu'on m'a envoyé
  const { deck } = route.params;

  // les variables pour les infos du deck
  const [title, setTitle] = useState(deck.title);
  const [description, setDescription] = useState(deck.description);
  const [category, setCategory] = useState(deck.category);
  const [flashcards, setFlashcards] = useState(deck.flashcards || []);
  const [loading, setLoading] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  // petite anim
  const fadeAnim = new Animated.Value(0);

  // pour savoir si l'user a modifié un truc
  useEffect(() => {
    const changed = 
      title !== deck.title || 
      description !== deck.description || 
      category !== deck.category;
    setHasChanges(changed);
  }, [title, description, category]);

  // je met le nom du deck en titre de la page
  useEffect(() => {
    navigation.setOptions({ title });
  }, [title, navigation]);

  // la fonction pour sauvegarder les modifs
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
        // petite anim pour dire que c'est ok
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
              // si je veux revenir en arriere apres la modif
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

  // pour jeter un deck
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

  // pour supprimer une seule carte
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

  // pour changer une question ou une réponse
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
      // sur android, ca marche pas encore
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
        {/* le petit message qui dit que c'est sauvegardé */}
        <Animated.View style={[styles.successMessage, { opacity: fadeAnim }]}>
          <Text style={styles.successText}>✨ Modifications enregistrées !</Text>
        </Animated.View>

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

        {/* un truc pour montrer qu'il y a des changements pas sauvés */}
        {hasChanges && (
          <View style={styles.changesIndicator}>
            <Text style={styles.changesText}>Vous avez des modifications non enregistrées.</Text>
          </View>
        )}

        {/* Section des actions sur le deck */}
        <View style={styles.deckActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton, !hasChanges && styles.disabledButton]}
            onPress={handleUpdate}
            disabled={loading || !hasChanges}
            activeOpacity={0.7}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.actionButtonText}>Enregistrer</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>Supprimer le Deck</Text>
          </TouchableOpacity>
        </View>

        {/* Section des flashcards */}
        <View style={styles.flashcardsSection}>
          <TouchableOpacity 
            style={styles.flashcardsHeader} 
            onPress={() => setShowFlashcards(!showFlashcards)}
            activeOpacity={0.8}
          >
            <Text style={styles.flashcardsTitle}>
              Flashcards ({flashcards.length})
            </Text>
            <Text style={styles.toggleIcon}>{showFlashcards ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {showFlashcards && (
            <View>
              {flashcards.map((card, index) => (
                <View key={index} style={styles.flashcard}>
                  <View style={styles.flashcardContent}>
                    <Text style={styles.flashcardText}><Text style={styles.bold}>Q:</Text> {card.question}</Text>
                    <Text style={styles.flashcardText}><Text style={styles.bold}>R:</Text> {card.answer}</Text>
                  </View>
                  <View style={styles.flashcardActions}>
                    <TouchableOpacity onPress={() => handleUpdateFlashcard(card)} style={[styles.cardButton, styles.editButton]}>
                      <Text style={styles.cardButtonText}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteFlashcard(card.id)} style={[styles.cardButton, styles.deleteCardButton]}>
                      <Text style={styles.cardButtonText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              {flashcards.length === 0 && (
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
    marginBottom: 15,
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 1000,
    alignItems: 'center',
  },
  successText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 165, 0, 0.3)',
    alignItems: 'center',
  },
  changesText: {
    color: '#D9822B',
    fontWeight: '500',
  },
  deckActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  flashcardsSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 15,
  },
  flashcardsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  flashcardsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  toggleIcon: {
    fontSize: 16,
    color: '#007AFF',
  },
  flashcard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  flashcardContent: {
    flex: 1,
  },
  flashcardText: {
    fontSize: 16,
    color: '#444',
    marginVertical: 2,
  },
  flashcardActions: {
    flexDirection: 'row',
  },
  cardButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#FFC107',
  },
  deleteCardButton: {
    backgroundColor: '#ff3b30',
  },
  cardButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  noFlashcardsText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontStyle: 'italic',
  },
  bold: {
    fontWeight: 'bold',
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