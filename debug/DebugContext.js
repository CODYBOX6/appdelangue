import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { ToastAndroid, Platform, Alert } from 'react-native';

// mon ptit contexte de debug
const DebugContext = createContext();

// temps mini entre deux affichages du meme popup
const POPUP_COOLDOWN = 30000; // 30sec, assez long pour pas spammer

// temps d'affichage des pastilles a l'ecran
const DISPLAY_DURATION = 20000; // 20sec pour avoir le temps de cliquer

// Provider qui gere tout le bordel du debug
export const DebugProvider = ({ children }) => {
  const [enabled, setEnabled] = useState(false); // on/off
  const [activeSteps, setActiveSteps] = useState([]); // toutes les etapes actives
  const [viewedSteps, setViewedSteps] = useState({}); // celles qu'on a deja vues
  
  // ref pour savoir quand on a montré chaque etape pour la derniere fois
  const lastShownRef = useRef({});
  
  // fonction pour gerer le cooldown entre les affichages
  const setStepWithCooldown = (step) => {
    if (!enabled || !step) {
      // si null, on vire tout
      if (step === null) {
        setActiveSteps([]);
      }
      return;
    }
    
    const now = Date.now();
    const lastShown = lastShownRef.current[step] || 0;
    
    // check si on respecte le cooldown
    if (now - lastShown > POPUP_COOLDOWN) {
      // maj timestamp dernier affichage
      lastShownRef.current[step] = now;
      
      // ajoute l'etape si elle y est pas deja
      setActiveSteps(prev => {
        if (prev.includes(step)) return prev;
        return [...prev, step]; // nouvel array pour trigger le rerender
      });
      
      // timer pour auto-remove après le temps d'affichage
      setTimeout(() => {
        setActiveSteps(prev => prev.filter(s => s !== step));
      }, DISPLAY_DURATION);
    } else {
      // ptit message dans la console pour debug du debug lol
      console.log(`Popup ${step} en cooldown (${Math.round((POPUP_COOLDOWN - (now - lastShown))/1000)}s restantes)`);
    }
  };

  // virer une etape specifique (genre quand on clique sur fermer)
  const removeStep = (step) => {
    setActiveSteps(prev => prev.filter(s => s !== step));
  };
  
  // marquer une etape comme deja vue = pastille verte
  const markStepAsViewed = (step) => {
    setViewedSteps(prev => ({
      ...prev,
      [step]: true
    }));
  };

  // activer/desactiver le mode debug
  const toggleDebug = () => {
    const newState = !enabled;
    setEnabled(newState);
    
    // reset quand on active/desactive
    if (newState) {
      lastShownRef.current = {}; // reset cooldowns
      setActiveSteps([]);        // vide les pastilles
      if (Platform.OS === 'android') {
        ToastAndroid.show(
          'Mode debug ON - C\'est juste pour la vidéo pour montrer comment marche le token, ça sera pas dans l\'app finale !',
          ToastAndroid.LONG
        );
      } else {
        Alert.alert(
          'Mode Debug ON',
          'Hey ! C\'est juste un truc que j\'ai rajouté pour la vidéo qui explique comment le token fonctionne... Ça fait pas partie de l\'app pour de vrai ! ',
          [{ text: 'OK cool', style: 'default' }]
        );
      }
    } else {
      setActiveSteps([]); // nettoyage
    }
  };

  // tout ce qu'on expose aux components qui utilisent ce context
  return (
    <DebugContext.Provider value={{ 
      enabled, 
      toggleDebug, 
      activeSteps, 
      viewedSteps,
      setStep: setStepWithCooldown,
      removeStep,
      markStepAsViewed
    }}>
      {children}
    </DebugContext.Provider>
  );
};

// hook pour utiliser le context facilement
export const useDebug = () => {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error('useDebug doit être utilisé à l\'intérieur d\'un DebugProvider');
  }
  return context;
}; 