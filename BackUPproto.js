import React, { useState, useRef, useEffect, memo } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  Alert,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // Icônes depuis Expo
import { MaterialCommunityIcons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

// 8 couleurs pastels
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

export default function App() {
  // Navigation possible : "left", "center", "reminder", "tiktok"
  const [activeView, setActiveView] = useState('center');
  // Liste de decks
  const [decks, setDecks] = useState([]);
  // Deck sélectionné (pour TikTokView)
  const [selectedDeck, setSelectedDeck] = useState(null);
  // Message popup
  const [popupMessage, setPopupMessage] = useState('');
  // Rappels par deck : { deckId: frequency }
  const [reminders, setReminders] = useState({});
  // Mode "shake" => suppr decks via corbeille
  const [shakeMode, setShakeMode] = useState(false);

  // Animation horizontale (Left, Center, Reminder)
  const translateX = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (activeView === 'tiktok') return;
    let toValue = 0;
    if (activeView === 'left') toValue = 0;
    else if (activeView === 'center') toValue = -WINDOW_WIDTH;
    else if (activeView === 'reminder') toValue = -2 * WINDOW_WIDTH;

    Animated.spring(translateX, {
      toValue,
      useNativeDriver: true,
      tension: 120,
      friction: 15,
    }).start();
  }, [activeView]);

  // Fade in/out popup
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!popupMessage) return;
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setPopupMessage(''));
      }, 1200);
    });
  }, [popupMessage]);

  // -----------------------------------------------------
  // CENTER VIEW : Création / ajout d'un deck
  // -----------------------------------------------------
  const CenterView = () => {
    const [step, setStep] = useState(0);
    const [word, setWord] = useState('');
    const [translation, setTranslation] = useState('');
    const [deckName, setDeckName] = useState('');
    const [color, setColor] = useState('#4B9CD3');

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
            prev.map((d) => (d.id === existingDeck.id ? updatedDeck : d))
          );
          setPopupMessage(`Word added to deck: ${existingDeck.name}`);
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

    // Bouton cloche en haut à droite
    const renderHeader = () => (
      <View style={styles.centerHeader}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => setActiveView('reminder')}>
          <Ionicons name="notifications-outline" size={28} color="#333" style={styles.reminderIcon} />
        </TouchableOpacity>
      </View>
    );

    const renderStep = () => {
      switch (step) {
        case 0:
          return (
            <>
              <Text style={styles.title}>Enter new word</Text>
              <TextInput
                style={styles.input}
                placeholder="Word..."
                value={word}
                onChangeText={setWord}
                onSubmitEditing={handleNext}
              />
            </>
          );
        case 1:
          return (
            <>
              <Text style={styles.title}>Enter translation</Text>
              <TextInput
                style={styles.input}
                placeholder="Translation..."
                value={translation}
                onChangeText={setTranslation}
                onSubmitEditing={handleNext}
              />
            </>
          );
        case 2:
          return (
            <>
              <Text style={styles.title}>Enter deck name</Text>
              <TextInput
                style={styles.input}
                placeholder="Deck name..."
                value={deckName}
                onChangeText={setDeckName}
                onSubmitEditing={handleNext}
              />
            </>
          );
        case 3:
          return (
            <>
              <Text style={styles.title}>Choose deck color</Text>
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
        {/* Conteneur centré */}
        <View style={styles.centerStepsContainer}>
          {renderStep()}
          <Button title="Next" onPress={handleNext} />
        </View>
      </SafeAreaView>
    );
  };

  // -----------------------------------------------------
  // DECKROWITEM : Sous-composant pour un deck
  // -----------------------------------------------------
  const DeckRowItem = React.memo(({ item, shakeMode, onSelectDeck, onDeleteDeck }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

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
      if (!shakeMode) onSelectDeck(item);
    };

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={[styles.deckItem, { backgroundColor: item.color }]}
          onPress={handlePress}
          activeOpacity={1}
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
  });

  // -----------------------------------------------------
  // LEFT VIEW : "Your Decks" + shakeMode sur long press
  // -----------------------------------------------------
  const LeftView = () => {
    const handleLongPressDeck = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setShakeMode(true);
    };

    const handleExitShakeMode = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setShakeMode(false);
    };

    const handleDeleteDeck = (deckId) => {
      Alert.alert(
        "Delete deck",
        "Are you sure you want to delete this deck?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setDecks((prev) => prev.filter((deck) => deck.id !== deckId));
              setPopupMessage("Deck deleted");
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
        style={{ marginBottom: 10 }}
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
          style={{ width: '100%' }}
        />
        <Button title="Go to Create" onPress={() => setActiveView('center')} />
      </SafeAreaView>
    );
  };

  // -----------------------------------------------------
  // REMINDER VIEW
  // -----------------------------------------------------
  const ReminderView = () => {
    const setReminderForDeck = (deckId, frequency) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setReminders((prev) => ({ ...prev, [deckId]: frequency }));
      setPopupMessage(`Reminder set for deck ${deckId} : ${frequency} / day`);
    };

    const deleteReminderForDeck = (deckId) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setReminders((prev) => {
        const updated = { ...prev };
        delete updated[deckId];
        return updated;
      });
      setPopupMessage(`Reminder deleted for deck ${deckId}`);
    };

    const renderDeckReminder = ({ item }) => {
      const freq = reminders[item.id] || 0;
      return (
        // Fond coloré = item.color
        <View style={[styles.reminderItem, { backgroundColor: item.color }]}>
          {/* Nom du deck */}
          <Text style={styles.deckName}>{item.name}</Text>

          {/* Légende emojis */}
          <View style={styles.reminderLegendRow}>
            <Text style={styles.reminderLegendText}>Chill</Text>
            <Text style={styles.reminderLegendText}>TongueSpeedrunner</Text>
            <Text style={styles.reminderLegendText}>Tryharder</Text>
          </View>

          {/* Les 3 boutons (😴, 😀📈, 🧠🔥) */}
          <View style={styles.reminderOptions}>
            {/* freq=3 => "😴" */}
            <TouchableOpacity
              onPress={() => setReminderForDeck(item.id, 3)}
              style={[
                styles.reminderButton,
                freq === 3 && styles.reminderButtonSelected,
              ]}
            >
              <Text style={styles.reminderButtonText}>😴</Text>
            </TouchableOpacity>
            {/* freq=10 => "😀📈" */}
            <TouchableOpacity
              onPress={() => setReminderForDeck(item.id, 10)}
              style={[
                styles.reminderButton,
                freq === 10 && styles.reminderButtonSelected,
              ]}
            >
              <Text style={styles.reminderButtonText}>😀📈</Text>
            </TouchableOpacity>
            {/* freq=20 => "🧠🔥" */}
            <TouchableOpacity
              onPress={() => setReminderForDeck(item.id, 20)}
              style={[
                styles.reminderButton,
                freq === 20 && styles.reminderButtonSelected,
              ]}
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
        <Text style={styles.title}>Reminders Setup</Text>
        <FlatList
          data={decks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDeckReminder}
          style={{ width: '100%' }}
        />
        <Button title="Back" onPress={() => setActiveView('center')} />
      </SafeAreaView>
    );
  };

  // -----------------------------------------------------
  // TIKTOK VIEW
  // -----------------------------------------------------
  const TikTokView = () => {
    const deck = selectedDeck;
    if (!deck || !deck.words || deck.words.length === 0) {
      return (
        <SafeAreaView style={styles.tiktokContainer}>
          <Text style={styles.title}>No words in this deck</Text>
          <Button title="Back" onPress={() => setActiveView('left')} />
        </SafeAreaView>
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
  };

  // -----------------------------------------------------
  // 3 VUES (Left, Center, Reminder) + TIKTOK
  // -----------------------------------------------------
  const renderAnimatedViews = () => {
    return (
      <Animated.View style={[styles.animatedContainer, { transform: [{ translateX }] }]}>
        {/* LEFT */}
        <View style={{ width: WINDOW_WIDTH }}>
          <LeftView />
        </View>
        {/* CENTER */}
        <View style={{ width: WINDOW_WIDTH }}>
          <CenterView />
        </View>
        {/* REMINDER */}
        <View style={{ width: WINDOW_WIDTH }}>
          <ReminderView />
        </View>
      </Animated.View>
    );
  };

  // Swipes horizontaux
  const onSwipeLeft = () => {
    if (activeView === 'left') setActiveView('center');
    else if (activeView === 'center') setActiveView('reminder');
  };
  const onSwipeRight = () => {
    if (activeView === 'reminder') setActiveView('center');
    else if (activeView === 'center') setActiveView('left');
  };

  return (
    <SafeAreaProvider>
      {activeView === 'tiktok' ? (
        <TikTokView />
      ) : (
        <GestureRecognizer
          onSwipeLeft={onSwipeLeft}
          onSwipeRight={onSwipeRight}
          style={styles.rootContainer}
        >
          {renderAnimatedViews()}
        </GestureRecognizer>
      )}
      {popupMessage !== '' && (
        <Animated.View style={[styles.popupContainer, { opacity: fadeAnim }]}>
          <Text style={styles.popupText}>{popupMessage}</Text>
        </Animated.View>
      )}
    </SafeAreaProvider>
  );
}

// -----------------------------------------------------
// STYLES
// -----------------------------------------------------
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  animatedContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },

  // Center
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
    justifyContent: 'flex-end',
  },
  centerStepsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderIcon: {
    padding: 10,
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

  // Left
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
    marginBottom: 8,
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
  deckItem: {
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#444',
  },
  deckName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  deckScore: {
    fontSize: 14,
    marginTop: 4,
    color: '#fff',
  },
  trashOnDeck: {
    position: 'absolute',
    top: 10,
    right: 10,
  },

  // Reminder
  reminderContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  reminderItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  reminderLegendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 6,
  },
  reminderLegendText: {
    fontSize: 12,
    color: '#fff', // Sur fond coloré, on met le texte en blanc
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

  // TikTok
  tiktokContainer: {
    flex: 1,
    backgroundColor: '#000',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  tiktokWord: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 10,
  },

  // Popup
  popupContainer: {
    position: 'absolute',
    top: 60,
    left: 50,
    right: 50,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  popupText: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
  },
});
