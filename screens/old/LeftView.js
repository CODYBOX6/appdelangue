// screens/LeftView.js
import React from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  Alert,
  TouchableOpacity,
  LayoutAnimation,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import DeckRowItem from '../components/DeckRowItem';

export default function LeftView({
  decks,
  setDecks,
  setPopupMessage,
  setActiveView,
  selectedDeck,
  setSelectedDeck,
  shakeMode,
  setShakeMode,
}) {
  const handleLongPressDeck = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShakeMode(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  const handleExitShakeMode = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShakeMode(false);
  };

  const handleDeleteDeck = (deckId) => {
    Alert.alert(
      'Delete deck',
      'Are you sure you want to delete this deck?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setDecks((prev) => prev.filter((deck) => deck.id !== deckId));
            setPopupMessage('Deck deleted');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const onSelectDeck = (deck) => {
    setSelectedDeck(deck);
    setActiveView('tiktok');
  };

  const renderDeck = ({ item }) => (
    <TouchableOpacity
      style={styles.deckWrapper}
      onLongPress={handleLongPressDeck}
      activeOpacity={1}
    >
      <DeckRowItem
        item={item}
        shakeMode={shakeMode}
        onSelectDeck={onSelectDeck}
        onDeleteDeck={handleDeleteDeck}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.leftContainer}>
      <View style={styles.shakeHeader}>
        <Text style={styles.title}>Your Decks</Text>
        {shakeMode && (
          <TouchableOpacity onPress={handleExitShakeMode} style={styles.doneButton}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={decks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderDeck}
        contentContainerStyle={styles.listContainer}
      />
      <Button title="Go to Create" onPress={() => setActiveView('center')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  leftContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  shakeHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#B2AFAF', // Gris pastel taupe
    textAlign: 'center',
  },
  doneButton: {
    position: 'absolute',
    right: 10,
    padding: 10,
  },
  doneButtonText: {
    fontSize: 16,
    color: '#007aff',
  },
  listContainer: {
    paddingBottom: 20,
  },
  deckWrapper: {
    marginBottom: 10,
  },
});
