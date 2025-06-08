import React, { useState, useEffect, useContext } from 'react';
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
import { AuthContext } from '../App';
import localStorageAPI, { STORAGE_KEYS } from '../services/localStorageAPI';
import DeckCard from '../components/DeckCard';
import { useDebug } from '../debug';

// l'écran principal ou je vois tous mes decks
export default function DeckListScreen({ navigation }) {
  // les variables pour la liste des decks et le chargement
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { signOut } = useContext(AuthContext);
  const { enabled, setStep } = useDebug();

  // ca charge les decks quand on arrive sur la page
  useEffect(() => {
    fetchDecks();
    
    // pour que la liste se mette a jour quand on y revient
    const unsubscribe = navigation.addListener('focus', () => {
      fetchDecks();
    });

    return unsubscribe;
  }, [navigation]);

  // Étape E – Utilisation : on relit le token avant tout appel protégé (ex. fetch, CRUD)
  // la fonction qui va chercher les decks (implicitement protégée par le contexte d'auth)
  const fetchDecks = async () => {
    try {
      if (enabled) setStep('E');
      const decksList = await localStorageAPI.getDecks();
      setDecks(decksList);
      
      // petite alerte pour dire que c'est bon
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

  // pour le pull to refresh, pratique
  const onRefresh = () => {
    setRefreshing(true);
    fetchDecks();
  };

  // pour aller voir les cartes d'un deck
  const handleDeckPress = (deck) => {
    navigation.navigate('DeckDetail', { deck });
  };

  // pour lancer le mode 'tiktok'
  const handleLaunchTikTokView = (deck) => {
    navigation.navigate('TikTokView', { deck });
  };

  // pour se deconnecter
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
            // Afficher l'étape F avant de se déconnecter
            if (enabled) setStep('F');
            
            // Appliquer la déconnexion
            await signOut();
            
            // Afficher l'étape G après la déconnexion
            if (enabled) setTimeout(() => setStep('G'), 100);
          }
        }
      ]
    );
  };

  // comment on affiche un deck dans la liste
  const renderDeck = ({ item }) => (
    <DeckCard
      deck={item}
      onPress={handleDeckPress}
      onLaunch={handleLaunchTikTokView}
    />
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
      {/* le haut de la page */}
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

      {/* le gros bouton vert pour creer un deck */}
      <TouchableOpacity
        style={styles.createDeckButton}
        onPress={() => navigation.navigate('CreateDeck')}
        activeOpacity={0.8}
      >
        <Text style={styles.createDeckButtonText}>+ Créer un nouveau Deck</Text>
      </TouchableOpacity>

      {/* si la liste est vide */}
      {decks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>😢 Aucun deck disponible</Text>
          <Text style={styles.emptySubtext}>Créez votre premier deck dans l'onglet "Créer"</Text>
        </View>
      ) : (
        /* la liste des decks */
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
    paddingTop: 50,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
}); 