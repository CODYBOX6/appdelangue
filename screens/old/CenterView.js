// screens/CenterView.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GestureRecognizer from 'react-native-swipe-gestures';

const PASTEL_COLORS = [
  '#FFD1DC',
  '#FFB347',
  '#FFD700',
  '#B0E57C',
  '#AEC6CF',
  '#CFCFC4',
  '#F49AC2',
  '#E6E6FA',
];

export default function CenterView({
  decks,
  setDecks,
  setPopupMessage,
  setActiveView,
  showWorldView,        // Props pour gérer WorldView
  setShowWorldView,     // Props pour gérer WorldView
}) {
  const [step, setStep] = useState(0);
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [deckName, setDeckName] = useState('');
  const [color, setColor] = useState('#4B9CD3');
  const [showSwipeHints, setShowSwipeHints] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSwipeHints(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (step === 0 && word) {
      setStep(1);
    } else if (step === 1 && translation) {
      setStep(2);
    } else if (step === 2 && deckName) {
      const existingDeck = decks.find(
        (d) => d.name.toLowerCase() === deckName.toLowerCase()
      );
      if (existingDeck) {
        const updatedDeck = {
          ...existingDeck,
          words: [...(existingDeck.words || []), { id: Date.now(), word, translation }],
        };
        setDecks((prev) =>
          prev.map((deck) => (deck.id === existingDeck.id ? updatedDeck : deck))
        );
        setPopupMessage(`${word} ajouté au deck: ${existingDeck.name}`);
        resetForm();
      } else {
        setStep(3);
      }
    } else if (step === 3 && deckName && color) {
      const newDeck = {
        id: Date.now(),
        name: deckName,
        color,
        score: '0%',
        words: [{ id: Date.now(), word, translation }],
      };
      setDecks((prev) => [...prev, newDeck]);
      setPopupMessage(`New deck created: ${deckName}`);
      resetForm();
    }
  };

  const resetForm = () => {
    setWord('');
    setTranslation('');
    setDeckName('');
    setColor('#4B9CD3');
    setStep(0);
  };

  // Header : L'icône globe active désormais setShowWorldView(true)
  const renderHeader = () => (
    <View style={styles.centerHeader}>
      <TouchableOpacity onPress={() => setShowWorldView(true)}>
        <Ionicons name="earth" size={28} color="#333" style={styles.worldIcon} />
      </TouchableOpacity>
      <View style={{ flex: 1 }} />
      <TouchableOpacity onPress={() => setActiveView('reminder')}>
        <Ionicons name="notifications-outline" size={28} color="#333" style={styles.reminderIcon} />
      </TouchableOpacity>
    </View>
  );

  // Détecte un swipe down au step 0 pour accéder à WorldView
  const onSwipeDownStepZero = () => {
    if (step === 0) {
      setShowWorldView(true);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <GestureRecognizer
            style={styles.gestureWrap}
            onSwipeDown={onSwipeDownStepZero}
            config={{
              velocityThreshold: 0.2,
              directionalOffsetThreshold: 80,
            }}
          >
            <Image
              style={styles.gif}
              source={require('../assets/CuteKittyBrain.gif')}
              resizeMode="cover"
            />
            <Text style={[styles.title, { color: '#B2AFAF' }]}>Feed your Brain</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter a new word..."
              value={word}
              onChangeText={setWord}
              onSubmitEditing={handleNext}
              accessibilityLabel="Word input"
              accessibilityHint="Enter the word you want to learn"
            />
            <Text style={styles.swipeText}>Swipe down for WorldView</Text>
          </GestureRecognizer>
        );
      case 1:
        return (
          <>
            <Text style={[styles.title, { color: '#B2AFAF' }]}>Enter translation</Text>
            <TextInput
              style={styles.input}
              placeholder="Translation..."
              value={translation}
              onChangeText={setTranslation}
              onSubmitEditing={handleNext}
              accessibilityLabel="Translation input"
              accessibilityHint="Enter the translation of the word"
            />
          </>
        );
      case 2:
        return (
          <>
            <Text style={[styles.title, { color: '#B2AFAF' }]}>Enter deck name</Text>
            <TextInput
              style={styles.input}
              placeholder="Deck name..."
              value={deckName}
              onChangeText={setDeckName}
              onSubmitEditing={handleNext}
              accessibilityLabel="Deck name input"
              accessibilityHint="Enter a name for your deck"
            />
          </>
        );
      case 3:
        return (
          <>
            <Text style={[styles.title, { color: '#B2AFAF' }]}>Choose deck color</Text>
            <View style={styles.colorContainer}>
              {PASTEL_COLORS.map((c, idx) => {
                const isSelected = c === color;
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setColor(c)}
                    style={[
                      styles.colorSwatch,
                      {
                        backgroundColor: c,
                        borderWidth: isSelected ? 3 : 0,
                        borderColor: isSelected ? '#333' : 'transparent',
                      },
                    ]}
                    accessibilityLabel={`Color ${c}`}
                    accessibilityHint="Tap to select this deck color"
                  />
                );
              })}
            </View>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.centerContainer}>
      {renderHeader()}
      <View style={styles.centerStepsContainer}>
        {renderStep()}
        <Button title="Next" onPress={handleNext} accessibilityLabel="Next" accessibilityHint="Proceed to the next step" />
      </View>
      {showSwipeHints && (
        <View style={styles.swipeHintsContainer}>
          <Text style={styles.swipeHintText}>← Swipe left to see decks</Text>
          <Text style={styles.swipeHintText}>→ Swipe right to plan a new reminder</Text>
          <Text style={styles.swipeHintText}>↓ Swipe down to go to WorldView</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  centerHeader: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  worldIcon: {
    padding: 10,
  },
  reminderIcon: {
    padding: 10,
  },
  centerStepsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gestureWrap: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 8,
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  swipeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  swipeHintsContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  swipeHintText: {
    fontSize: 12,
    color: '#666',
    marginVertical: 2,
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 8,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
  },
  gif: {
    width: 100,
    height: 100,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 10,
  },
});
