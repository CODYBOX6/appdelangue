import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useDebug } from './DebugContext';

export default function DebugButton() {
  const { toggleDebug, enabled } = useDebug();

  // En production, on pourrait conditionner l'affichage avec __DEV__
  if (!__DEV__) return null;

  return (
    <TouchableOpacity 
      onPress={toggleDebug} 
      style={[styles.button, enabled && styles.enabled]}
      activeOpacity={0.7}
    >
      <View style={styles.inner} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
    zIndex: 9999,
  },
  enabled: {
    backgroundColor: '#34C759',
    opacity: 0.8,
  },
  inner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  }
}); 