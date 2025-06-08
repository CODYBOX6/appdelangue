import React, { memo, useRef, useEffect } from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function DeckRowItem({ item, shakeMode, onSelectDeck, onDeleteDeck }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // petite animation quand l'element apparait
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (shakeMode) {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 0.98,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ])
      );
      anim.start();
      return () => anim.stop();
    } else {
      scaleAnim.stopAnimation();
      scaleAnim.setValue(1);
    }
  }, [shakeMode]);

  const handlePress = () => {
    if (!shakeMode && onSelectDeck) {
      onSelectDeck(item);
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: fadeAnim }}>
      <TouchableOpacity
        style={[styles.deckItem, { backgroundColor: item.color }]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Text style={styles.deckName}>{item.name}</Text>
        <Text style={styles.deckScore}>Score: {item.score}</Text>
      </TouchableOpacity>
      {shakeMode && (
        <TouchableOpacity
          style={styles.trashOnDeck}
          onPress={() => onDeleteDeck(item.id)}
        >
          <Ionicons name="trash" size={24} color="#ff5252" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

export default memo(DeckRowItem);

const styles = StyleSheet.create({
  deckItem: {
    borderRadius: 20,
    padding: 20,
    marginVertical: 1,
    backgroundColor: '#444',
    // une petite ombre pour donner du relief
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  deckName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  deckScore: {
    fontSize: 14,
    marginTop: 6,
    color: '#eee',
  },
  trashOnDeck: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
