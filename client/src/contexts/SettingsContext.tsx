import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  cursorEffects: boolean;
  setCursorEffects: (enabled: boolean) => void;
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
    return saved !== null ? JSON.parse(saved) : true; // Default to true
  });

  // Save to localStorage whenever the setting changes
  useEffect(() => {
    localStorage.setItem('cursorEffects', JSON.stringify(cursorEffects));
  }, [cursorEffects]);

  const value = {
    cursorEffects,
    setCursorEffects,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}; 