// screens/TikTokView.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  Dimensions,
  Button,
  StyleSheet,
} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

export default function TikTokView({ deck, setSelectedDeck, setActiveView }) {
  if (!deck || !deck.words || deck.words.length === 0) {
    return (
      <View style={styles.tiktokContainer}>
        <Text style={styles.title}>No words in this deck</Text>
        <Button title="Back" onPress={() => setActiveView('left')} />
      </View>
    );
  }

  const [translationToggles, setTranslationToggles] = useState({});
  const toggleTranslation = (index) => {
    setTranslationToggles((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const translateXTikTok = useRef(new Animated.Value(0)).current;
  const handleSwipeLeftTikTok = () => {
    Animated.timing(translateXTikTok, {
      toValue: -WINDOW_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSelectedDeck(null);
      setActiveView('left');
      translateXTikTok.setValue(0);
    });
  };

  const renderItem = ({ item, index }) => {
    const showTrans = translationToggles[index];
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[
          styles.tiktokCard,
          { width: WINDOW_WIDTH, height: WINDOW_HEIGHT, backgroundColor: deck.color },
        ]}
        onPress={() => toggleTranslation(index)}
      >
        <View style={styles.tiktokInnerContent}>
          <Text style={styles.tiktokWord}>
            {showTrans ? item.translation || 'No translation' : item.word}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <GestureRecognizer
      config={{
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80,
      }}
      onSwipeLeft={handleSwipeLeftTikTok}
      onSwipeUp={() => {}}
      onSwipeDown={() => {}}
      style={{ flex: 1 }}
    >
      <Animated.View style={{ flex: 1, transform: [{ translateX: translateXTikTok }] }}>
        <FlatList
          data={deck.words}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          pagingEnabled
          snapToInterval={WINDOW_HEIGHT}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          getItemLayout={(_, idx) => ({
            length: WINDOW_HEIGHT,
            offset: WINDOW_HEIGHT * idx,
            index: idx,
          })}
        />
      </Animated.View>
    </GestureRecognizer>
  );
}

const styles = StyleSheet.create({
  tiktokContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#B2AFAF', // Gris pastel taupe pour les titres
    textAlign: 'center',
  },
  tiktokCard: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tiktokInnerContent: {
    width: '85%',
    height: '85%',
    backgroundColor: 'rgba(16,16,16,0.6)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  tiktokWord: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 10,
  },
});
