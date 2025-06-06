import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Écrans principaux
import LoginScreen from './screens/LoginScreen';
import DeckListScreen from './screens/DeckListScreen';
import DeckDetailScreen from './screens/DeckDetailScreen';

// Écrans bonus pour montrer l'évolutivité
import CreateFlashcardScreen from './screens/CreateFlashcardScreen';
import CreateDeckScreen from './screens/CreateDeckScreen';
import ReminderView from './screens/ReminderView';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// TabNavigator principal après connexion
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Decks') {
            iconName = focused ? 'albums' : 'albums-outline';
          } else if (route.name === 'Créer') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Rappels') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Decks" 
        component={DeckListScreen} 
        options={{ 
          title: 'Mes Decks',
          headerTitle: 'Mes Decks de Langues'
        }} 
      />
      <Tab.Screen 
        name="Créer" 
        component={CreateFlashcardScreen} 
        options={{ 
          title: 'Créer',
          headerTitle: 'Nouvelle Flashcard'
        }} 
      />
      <Tab.Screen 
        name="Rappels" 
        component={ReminderView} 
        options={{ 
          title: 'Rappels',
          headerTitle: 'Mes Rappels'
        }} 
      />
    </Tab.Navigator>
  );
}



// Navigation principale avec authentification
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false, // On cache le header du Stack pour utiliser celui des Tabs
        }}
      >
        {/* ÉCRAN 1 : Connexion avec authentification */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ 
            headerShown: true,
            title: 'Connexion',
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        
        {/* Navigation principale avec tabs après connexion */}
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabs} 
        />
        
        {/* ÉCRAN 3 : Détail du deck (hors tabs) */}
        <Stack.Screen 
          name="DeckDetail" 
          component={DeckDetailScreen} 
          options={({ route }) => ({ 
            headerShown: true,
            title: route.params.deck.title, // Titre dynamique
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        />

        {/* ÉCRAN de création de Deck */}
        <Stack.Screen 
          name="CreateDeck" 
          component={CreateDeckScreen} 
          options={{ 
            headerShown: true,
            title: 'Créer un nouveau Deck',
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
