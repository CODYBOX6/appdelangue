import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import localStorageAPI from '../services/localStorageAPI';

// ÉCRAN 2 : DeckListScreen - Liste des decks avec persistance locale
export default function DeckListScreen({ navigation }) {
  // useState pour gérer la liste des decks et le chargement
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // useEffect pour charger les decks au montage du composant
  useEffect(() => {
    fetchDecks();
    
    // Vérifier si le token existe, sinon retour au login
    checkToken();

    // Listener pour rafraîchir quand on revient sur cet écran
    const unsubscribe = navigation.addListener('focus', () => {
      fetchDecks();
    });

    return unsubscribe;
  }, [navigation]);

  // Vérifier la présence du token
  const checkToken = async () => {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      navigation.replace('Login');
    }
  };

  // Récupérer la liste des decks depuis le stockage local
  const fetchDecks = async () => {
    try {
      const decksList = await localStorageAPI.getDecks();
      setDecks(decksList);
      
      // Animation de feedback
      if (refreshing) {
        Alert.alert('✅ Actualisé', 'Liste mise à jour avec succès');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les decks');
      console.error('Erreur fetch:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Rafraîchir la liste (pull to refresh)
  const onRefresh = () => {
    setRefreshing(true);
    fetchDecks();
  };

  // Navigation vers le détail avec passage de props
  const handleDeckPress = (deck) => {
    // Passage du deck sélectionné via navigation params (props)
    navigation.navigate('DeckDetail', { deck });
  };

  // Déconnexion
  const handleLogout = async () => {
    Alert.alert(
      '🔓 Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await localStorageAPI.logout();
            navigation.replace('Login');
          }
        }
      ]
    );
  };

  // Rendu d'un deck dans la liste
  const renderDeck = ({ item }) => (
    <TouchableOpacity
      style={styles.deckItem}
      onPress={() => handleDeckPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.deckHeader}>
        <Text style={styles.deckTitle}>{item.title}</Text>
        <View style={styles.deckMeta}>
          <Text style={[styles.levelBadge, item.level === 'Débutant' ? styles.levelBeginner : styles.levelIntermediate]}>
            {item.level}
          </Text>
          <Text style={styles.cardCount}>{item.flashcards?.length || 0} cartes</Text>
        </View>
      </View>
      <Text style={styles.deckDescription}>{item.description}</Text>
      <View style={styles.deckFooter}>
        <Text style={styles.deckCategory}>🌍 {item.language?.charAt(0).toUpperCase() + item.language?.slice(1)}</Text>
        <TouchableOpacity 
          style={styles.learnButton}
          onPress={() => navigation.navigate('TikTokView', { deck: item })}
        >
          <Text style={styles.learnButtonText}>🔥 Lancer</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement des decks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header avec bouton déconnexion */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Mes Decks de Langues</Text>
          <Text style={styles.headerSubtitle}>
            {decks.length} deck{decks.length > 1 ? 's' : ''} disponible{decks.length > 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      {/* Bouton de création de deck */}
      <TouchableOpacity
        style={styles.createDeckButton}
        onPress={() => navigation.navigate('CreateDeck')}
        activeOpacity={0.8}
      >
        <Text style={styles.createDeckButtonText}>+ Créer un nouveau Deck</Text>
      </TouchableOpacity>

      {/* Message si aucun deck */}
      {decks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>😢 Aucun deck disponible</Text>
          <Text style={styles.emptySubtext}>Créez votre premier deck dans l'onglet "Créer"</Text>
        </View>
      ) : (
        /* Liste des decks avec pull to refresh */
        <FlatList
          data={decks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDeck}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007AFF']}
              tintColor="#007AFF"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  logoutButton: {
    padding: 10,
  },
  logoutText: {
    color: '#ff3b30',
    fontWeight: '600',
  },
  createDeckButton: {
    backgroundColor: '#34C759',
    padding: 15,
    marginHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  createDeckButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
  },
  deckItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    // Pour iOS et Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    // Pour le web
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  deckHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  deckTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  deckMeta: {
    alignItems: 'flex-end',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  levelBeginner: {
    backgroundColor: '#4CAF50',
    color: '#fff',
  },
  levelIntermediate: {
    backgroundColor: '#FF9800',
    color: '#fff',
  },
  cardCount: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  deckDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  deckFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    borderTopWidth: 1,
    paddingTop: 10,
    borderColor: '#f0f0f0',
  },
  deckCategory: {
    fontSize: 12,
    color: '#666',
  },
  learnButton: {
    backgroundColor: '#ff9500',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  learnButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 24,
    color: '#333',
    marginBottom: 10,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 