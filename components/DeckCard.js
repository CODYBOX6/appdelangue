import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function DeckCard({ deck, onPress, onLaunch }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(deck)}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{deck.title}</Text>
        <TouchableOpacity style={styles.launchButton} onPress={() => onLaunch(deck)}>
          <Text style={styles.launchButtonText}>🔥 Lancer</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.description}>{deck.description}</Text>
      <Text style={styles.meta}>
        {deck.flashcards?.length || 0} cartes – {deck.language} ({deck.level})
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  meta: {
    fontSize: 12,
    color: '#888',
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
    paddingTop: 10,
    marginTop: 5,
  },
  launchButton: {
    backgroundColor: '#ff9500',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  launchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
}); 