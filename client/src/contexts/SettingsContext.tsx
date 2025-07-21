import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  cursorEffects: boolean;
  setCursorEffects: (enabled: boolean) => void;
  magnetEffect: boolean;
  setMagnetEffect: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: React.ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [cursorEffects, setCursorEffects] = useState(() => {
    // Load from localStorage on initialization
    const saved = localStorage.getItem('cursorEffects');
    return saved !== null ? JSON.parse(saved) : false; // Default to false (off)
  });

  const [magnetEffect, setMagnetEffect] = useState(() => {
    const saved = localStorage.getItem('magnetEffect');
    return saved !== null ? JSON.parse(saved) : true; // Default to true (on)
  });

  // Save to localStorage whenever the setting changes
  useEffect(() => {
    localStorage.setItem('cursorEffects', JSON.stringify(cursorEffects));
  }, [cursorEffects]);

  useEffect(() => {
    localStorage.setItem('magnetEffect', JSON.stringify(magnetEffect));
  }, [magnetEffect]);

  const value = {
    cursorEffects,
    setCursorEffects,
    magnetEffect,
    setMagnetEffect,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}; 