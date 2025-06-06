// screens/WorldView.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Button, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WorldView({
  decks,
  setDecks,
  setPopupMessage,
  handleSwipeUp, // Reçu en prop pour uniformiser le "Back" & "swipe up"
}) {
  const handleUpload = () => {
    Alert.alert('Upload', 'Decks uploaded to the world!');
    setPopupMessage('Your decks have been uploaded!');
  };

  const handleDownload = () => {
    Alert.alert('Download', 'Downloaded new decks from the world!');
    setPopupMessage('New decks downloaded!');
  };

  // Bouton "Back" => même action que swipe up
  const handleBack = () => {
    handleSwipeUp();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Share with the World</Text>
        <Ionicons name="earth" size={34} color="#333" style={{ marginLeft: 10 }} />
      </View>

      <Text style={styles.description}>
        Upload your decks for everyone to see or download trending decks from around the globe!
      </Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
          <Ionicons name="cloud-upload-outline" size={24} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Upload my Decks</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
          <Ionicons name="cloud-download-outline" size={24} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Download decks</Text>
        </TouchableOpacity>
      </View>

      <Button title="Back" onPress={handleBack} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 20,
    backgroundColor: '#fafafa', alignItems: 'center',
  },
  header: {
    flexDirection: 'row', marginTop: 40, alignItems: 'center',
  },
  title: {
    fontSize: 24, fontWeight: 'bold', color: '#B2AFAF',
  },
  description: {
    marginTop: 20, fontSize: 16, color: '#666',
    textAlign: 'center', paddingHorizontal: 20,
  },
  buttonsContainer: {
    marginTop: 30, marginBottom: 20,
    width: '80%',
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#4B9CD3',
    padding: 15, borderRadius: 8,
    alignItems: 'center', marginBottom: 15,
  },
  downloadButton: {
    flexDirection: 'row',
    backgroundColor: '#FF7043',
    padding: 15, borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', fontSize: 16, fontWeight: '600',
  },
});
