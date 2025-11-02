import { useSettings } from "../context/SettingsContext";

export default function useAjustes() {
  const { settings, toggleTheme, changeFontSize } = useSettings();

  const getFontSizeStyle = (baseSize = 16) => {
    switch (settings.fontSize) {
      case "small":
        return { fontSize: baseSize - 2 };
      case "large":
        return { fontSize: baseSize + 2 };
      default:
        return { fontSize: baseSize };
    }
  };

  const gradientColors =
    settings.theme === "dark" ? ["#5B3AB4", "#7D5FE5"] : ["#8A6DE9", "#A88BFF"];

  const activeColor = settings.theme === "dark" ? "#BB86FC" : "#6200EE";
  const circleBg = settings.theme === "dark" ? "#1E1E1E" : "rgba(98,0,238,0.1)";
  const circleBorder = settings.theme === "dark" ? "#BB86FC" : "#6200EE";

  return {
    settings,
    toggleTheme,
    changeFontSize,
    getFontSizeStyle,
    gradientColors,
    activeColor,
    circleBg,
    circleBorder,
  };
}
