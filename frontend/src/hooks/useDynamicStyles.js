import { useSettings } from '../context/SettingsContext';

export const useDynamicStyles = () => {
  const { settings } = useSettings();

  const getThemeStyles = () => {
    return settings.theme === 'dark' ? {
      backgroundColor: '#121212',
      color: '#FFFFFF',
      cardBackground: '#1E1E1E',
      borderColor: '#333333',
    } : {
      backgroundColor: '#FFFFFF',
      color: '#000000',
      cardBackground: '#FFFFFF',
      borderColor: '#f0f0f0',
    };
  };

  const getFontSizeMultiplier = () => {
    switch (settings.fontSize) {
      case 'small': return 0.9;
      case 'large': return 1.2;
      default: return 1;
    }
  };

  const dynamicTextStyle = (baseSize) => ({
    fontSize: baseSize * getFontSizeMultiplier(),
    color: getThemeStyles().color,
  });

  const dynamicContainerStyle = {
    backgroundColor: getThemeStyles().backgroundColor,
  };

  const dynamicCardStyle = {
    backgroundColor: getThemeStyles().cardBackground,
  };

  return {
    theme: settings.theme,
    fontSize: settings.fontSize,
    getThemeStyles,
    dynamicTextStyle,
    dynamicContainerStyle,
    dynamicCardStyle,
  };
};