import React, { createContext, useReducer, useEffect, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import localStorageAPI, { STORAGE_KEYS } from './services/localStorageAPI';

// mes écrans
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import DeckListScreen from './screens/DeckListScreen';
import DeckDetailScreen from './screens/DeckDetailScreen';
import CreateFlashcardScreen from './screens/CreateFlashcardScreen';
import CreateDeckScreen from './screens/CreateDeckScreen';
import ReminderView from './screens/ReminderView';
import TikTokViewScreen from './screens/TikTokViewScreen';
import { ActivityIndicator, View } from 'react-native';

// trucs pour le debug (pour montrer le token)
import { DebugProvider, DebugOverlay, DebugButton, useDebug } from './debug';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
export const AuthContext = createContext();

// stack pour la partie auth
const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Inscription' }} />
  </Stack.Navigator>
);

// tabs pour la partie principale
const AppStack = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Decks') iconName = focused ? 'albums' : 'albums-outline';
        else if (route.name === 'Créer') iconName = focused ? 'add-circle' : 'add-circle-outline';
        else if (route.name === 'Rappels') iconName = focused ? 'notifications' : 'notifications-outline';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Decks" component={DeckListScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Créer" component={CreateFlashcardScreen} />
    <Tab.Screen name="Rappels" component={ReminderView} />
  </Tab.Navigator>
);

// le composant principal
function MainApp() {
  const { enabled, setStep } = useDebug();
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return { ...prevState, userToken: action.token, isLoading: false };
        case 'SIGN_IN':
          return { ...prevState, isSignout: false, userToken: action.token };
        case 'SIGN_OUT':
          return { ...prevState, isSignout: true, userToken: null };
      }
    },
    { isLoading: true, isSignout: false, userToken: null }
  );

  useEffect(() => {
    // au démarrage, check si y'a un token 
    const bootstrapAsync = async () => {
      let userToken;
      try {
        // ÉTAPE C - récup token au démarrage
        userToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
        if (enabled) setStep('C');
      } catch (e) {
        // oops erreur
      }
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };
    bootstrapAsync();
  }, [enabled, setStep]);

  const authContext = useMemo(
    () => ({
      signIn: async (data) => {
        const result = await localStorageAPI.login(data.username, data.password);
        if (result.success) {
          dispatch({ type: 'SIGN_IN', token: result.token });
          if (enabled) setStep('B');
        }
        return result;
      },
      signOut: async () => {
        await localStorageAPI.logout();
        dispatch({ type: 'SIGN_OUT' });
      },
      signUp: async (data) => {
        const result = await localStorageAPI.register(data.username, data.password);
        if (result.success && enabled) setStep('A');
        return result;
      },
    }),
    [enabled, setStep]
  );

  if (state.isLoading) {
    return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><ActivityIndicator size="large"/></View>;
  }

  // montre l'étape D - bloqué sans token
  if (enabled && state.userToken == null) {
    setTimeout(() => setStep('D'), 100);
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {/* ÉTAPE D - blocage sans token - soit login soit app protégée */}
          {state.userToken == null ? (
            <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />
          ) : (
            <>
              <Stack.Screen name="App" component={AppStack} options={{ headerShown: false }} />
              <Stack.Screen name="DeckDetail" component={DeckDetailScreen} />
              <Stack.Screen name="CreateDeck" component={CreateDeckScreen} />
              <Stack.Screen name="TikTokView" component={TikTokViewScreen} options={{ headerShown: false, presentation: 'modal' }}/>
            </>
          )}
        </Stack.Navigator>
        <DebugButton />
        <DebugOverlay />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

// wrapper avec le provider de debug
export default function App() {
  return (
    <DebugProvider>
      <MainApp />
    </DebugProvider>
  );
}
