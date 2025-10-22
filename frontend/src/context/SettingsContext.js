import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings debe ser usado dentro de un SettingsProvider');
  }
  
  // Función helper para obtener estilos de fuente
  const getFontSizeStyle = (baseSize = 16) => {
    switch (context.settings.fontSize) {
      case 'small':
        return { fontSize: baseSize - 2 };
      case 'large':
        return { fontSize: baseSize + 4 };
      default:
        return { fontSize: baseSize };
    }
  };

  // Función helper para obtener el tamaño numérico
  const getFontSize = (baseSize = 16) => {
    switch (context.settings.fontSize) {
      case 'small':
        return baseSize - 2;
      case 'large':
        return baseSize + 4;
      default:
        return baseSize;
    }
  };

  return {
    ...context,
    getFontSizeStyle,
    getFontSize
  };
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    theme: 'light',
    fontSize: 'medium',
  });

  // Cargar configuraciones al iniciar
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem('appSettings');
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('Error cargando configuraciones:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error guardando configuraciones:', error);
    }
  };

  const toggleTheme = () => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        theme: prev.theme === 'light' ? 'dark' : 'light'
      };
      saveSettings(newSettings);
      return newSettings;
    });
  };

  const changeFontSize = (size) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        fontSize: size
      };
      saveSettings(newSettings);
      return newSettings;
    });
  };

  const value = {
    settings,
    toggleTheme,
    changeFontSize,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};