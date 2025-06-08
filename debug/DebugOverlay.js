import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useDebug } from './DebugContext';
import { SNIPPETS } from './snippets';

// temps avant que ca ferme tout seul
const AUTO_CLOSE_DELAY = 20000; // 20s c'est mieux

// colors des ptites pastilles
const BUBBLE_COLORS = {
  NEW: '#FF3B30', // rouge = pas vu
  VIEWED: '#34C759' // vert = deja vu
};

// ordre qui a un sens pour les steps
const STEP_ORDER = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

// la pastille qui apparait
const BubbleItem = ({ step, index, onPress, isViewed }) => {
  // animation value pour faire joli
  const [animValue] = useState(new Animated.Value(0));
  
  // effet pour animer l'entrée des pastilles une par une
  useEffect(() => {
    // yep springy animation looks better
    Animated.spring(animValue, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true, // perf++
      delay: index * 100 // petit delai progressif, ca fait plus joli
    }).start();
    
    // cleanup quand la pastille disparait
    return () => {
      Animated.timing(animValue, {
        toValue: 0,
        duration: 200, // rapide a disparaitre
        useNativeDriver: true
      }).start();
    };
  }, [animValue, index]);
  
  // style de l'animation pour le fade-in
  const animStyle = {
    transform: [
      { scale: animValue },
      { translateY: animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-30, 0] // ca vient d'en haut
      })}
    ],
    opacity: animValue
  };
  
  // pastille verte ou rouge selon si on l'a deja cliquée
  const bubbleColor = isViewed ? BUBBLE_COLORS.VIEWED : BUBBLE_COLORS.NEW;
  
  return (
    <Animated.View style={[styles.bubble, animStyle, { top: 45 + (index * 50) }]}>
      <TouchableOpacity 
        style={[styles.bubbleTouch, { backgroundColor: bubbleColor }]} 
        onPress={() => onPress(step)}
        activeOpacity={0.7} // feedback tactile
      >
        <Text style={styles.bubbleLetter}>{step}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// composant principal qui gere tout 
export default function DebugOverlay() {
  const { enabled, activeSteps, removeStep, viewedSteps, markStepAsViewed } = useDebug();
  const [visiblePopup, setVisiblePopup] = useState(null); // quelle popup on affiche
  const [timeLeft, setTimeLeft] = useState(AUTO_CLOSE_DELAY / 1000);
  
  // timer pour fermer la popup
  useEffect(() => {
    if (!visiblePopup) return; // rien a faire si pas de popup
    
    // reset compteur
    setTimeLeft(AUTO_CLOSE_DELAY / 1000);
    
    // decremente toutes les secondes
    const countdownInterval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    
    // cleanup
    return () => {
      clearInterval(countdownInterval); // pas de memory leak plz
    };
  }, [visiblePopup]);
  
  // rien a montrer = rien a faire
  if (!enabled || activeSteps.length === 0) return null;

  // quand on clique sur une pastille
  const handleBubblePress = (step) => {
    markStepAsViewed(step); // on note qu'on l'a vue
    setVisiblePopup(step); // on affiche le detail
  };
  
  // fermer la popup
  const handleClosePopup = () => {
    setVisiblePopup(null); // bye popup
  };
  
  // on trie pour que ca ait un sens
  const sortedActiveSteps = [...activeSteps].sort((a, b) => {
    return STEP_ORDER.indexOf(a) - STEP_ORDER.indexOf(b);
  });
  
  return (
    <>
      {/* les pastilles qui s'affichent en haut */}
      {sortedActiveSteps.map((step, index) => (
        <BubbleItem 
          key={step} 
          step={step} 
          index={index} 
          onPress={handleBubblePress}
          isViewed={viewedSteps[step]} 
        />
      ))}
      
      {/* la popup qui explique le code en detail quand on clique */}
      {visiblePopup && SNIPPETS[visiblePopup] && (
        <Modal transparent animationType="fade">
          <View style={styles.bg}>
            <View style={styles.card}>
              <ScrollView>
                <Text style={styles.title}>{SNIPPETS[visiblePopup].title}</Text>
                <Text style={styles.code}>{SNIPPETS[visiblePopup].code}</Text>
                <Text style={styles.explain}>{SNIPPETS[visiblePopup].explain}</Text>
              </ScrollView>

              <View style={styles.footer}>
                <Text style={styles.timer}>Fermeture dans {timeLeft}s</Text>
                <TouchableOpacity onPress={handleClosePopup} style={styles.btn}>
                  <Text style={styles.btnTxt}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

// ptits styles pour que ce soit joli
const styles = StyleSheet.create({
  bg: {flex: 1, backgroundColor: '#0008', justifyContent: 'center', alignItems: 'center'},
  card: {width: '88%', backgroundColor: '#fff', borderRadius: 12, padding: 18, maxHeight: '75%'},
  title: {fontSize: 16, fontWeight: '700', marginBottom: 8},
  code: {fontFamily: 'monospace', backgroundColor: '#f4f4f4', padding: 8, borderRadius: 6},
  explain: {marginTop: 10, fontSize: 14, lineHeight: 20},
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12
  },
  timer: {
    fontSize: 12,
    color: '#777'
  },
  btn: {alignSelf: 'flex-end'},
  btnTxt: {color: '#007AFF', fontWeight: '600'},
  // pour les pastilles
  bubble: {
    position: 'absolute',
    right: 15,
    zIndex: 9999, // toujours au dessus
  },
  bubbleTouch: {
    width: 36, 
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5, // pour android
  },
  bubbleLetter: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  }
}); 