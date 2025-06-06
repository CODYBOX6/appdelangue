// screens/ReminderView.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  SafeAreaView,
  StyleSheet,
  LayoutAnimation,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import localStorageAPI from '../services/localStorageAPI';

export default function ReminderView({ navigation }) {
  // États locaux pour l'écran de rappels
  const [decks, setDecks] = useState([]);
  const [reminders, setReminders] = useState({});
  const [loading, setLoading] = useState(true);

  // Recharger les decks à chaque fois que l'écran est focus
  useFocusEffect(
    React.useCallback(() => {
      loadDecks();
    }, [])
  );

  const loadDecks = async () => {
    setLoading(true);
    try {
      const data = await localStorageAPI.getDecks();
      // On simplifie les données pour la vue
      const languageDecks = data.map((item, index) => {
        const colors = ['#FFB347', '#FFD700', '#B0E57C', '#AEC6CF', '#F49AC2', '#ff7f7f', '#c1a7e2', '#87ceeb', '#f7cac9', '#98ff98'];
        return {
          id: item.id,
          name: item.title,
          color: colors[index % colors.length],
        };
      });
      setDecks(languageDecks);
    } catch (error) {
      console.error('Erreur chargement decks:', error);
      Alert.alert("Erreur", "Impossible de charger les decks.");
    } finally {
      setLoading(false);
    }
  };

  const setReminderForDeck = (deckId, frequency) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setReminders((prev) => ({ ...prev, [deckId]: frequency }));
    Alert.alert('Rappel configuré ! 🔔', `${frequency} notifications par jour`);

  };

  const deleteReminderForDeck = (deckId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setReminders((prev) => {
      const updated = { ...prev };
      delete updated[deckId];
      return updated;
    });
    Alert.alert('Rappel supprimé', 'Les notifications ont été désactivées');
  };

  const renderDeckReminder = ({ item }) => {
    const freq = reminders[item.id] || 0;
    return (
      <View style={[styles.reminderItem, { backgroundColor: item.color }]}>
        <Text style={styles.deckName}>{item.name}</Text>
        <View style={styles.reminderLegendRow}>
          <Text style={styles.reminderLegendText}>Chill</Text>
          <Text style={styles.reminderLegendText}>TongueSpeedrunner</Text>
          <Text style={styles.reminderLegendText}>Tryharder</Text>
        </View>
        <View style={styles.reminderOptions}>
          <TouchableOpacity
            onPress={() => setReminderForDeck(item.id, 3)}
            style={[styles.reminderButton, freq === 3 && styles.reminderButtonSelected]}
          >
            <Text style={styles.reminderButtonText}>😴</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setReminderForDeck(item.id, 10)}
            style={[styles.reminderButton, freq === 10 && styles.reminderButtonSelected]}
          >
            <Text style={styles.reminderButtonText}>😀📈</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setReminderForDeck(item.id, 20)}
            style={[styles.reminderButton, freq === 20 && styles.reminderButtonSelected]}
          >
            <Text style={styles.reminderButtonText}>🧠🔥</Text>
          </TouchableOpacity>
        </View>
        {freq !== 0 && (
          <TouchableOpacity
            onPress={() => deleteReminderForDeck(item.id)}
            style={styles.deleteReminderButton}
          >
            <Text style={styles.deleteReminderButtonText}>Delete Reminder</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.reminderContainer}>
      <Text style={styles.title}>Configurer les Rappels 🔔</Text>
      <Text style={styles.subtitle}>Recevez des notifications pour réviser</Text>
      <FlatList
        data={decks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderDeckReminder}
        style={{ width: '100%' }}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  reminderContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
  },
  reminderItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  deckName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  reminderLegendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 6,
  },
  reminderLegendText: {
    fontSize: 12,
    color: '#fff',
  },
  reminderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  reminderButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 4,
  },
  reminderButtonSelected: {
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  reminderButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  deleteReminderButton: {
    marginTop: 10,
    backgroundColor: '#ff5252',
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: 'center',
  },
  deleteReminderButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});
