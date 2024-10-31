import PropTypes from 'prop-types';
import { createContext, useContext, useState } from 'react';
import { useSettings } from './settingContext';

const SchoolContext = createContext();

export const ThemeContext = ({ children }) => {
  const settings = useSettings();
  const [currSettings, setCurrentSettings] = useState(settings);
  const { primaryColor: pri, theme, secondaryColor: sec } = currSettings;
  const [activeTheme, setActiveTheme] = useState(theme); // Default active theme
  const [secondaryColor, setSecondaryColour] = useState(sec);
  const [primaryColor, setPrimaryColor] = useState(pri);

  function handlePrimaryColour(colour) {
    setPrimaryColor(colour.hex);
    const updating = { ...currSettings, primaryColor: colour.hex };
    setCurrentSettings(updating);
  }
  function handleSecondaryColour(colour) {
    setSecondaryColour(colour.hex);
    const updating = { ...currSettings, secondaryColor: colour.hex };
    setCurrentSettings(updating);
  }

  const handleSettingsOnChanges = (updatedSettings) => {
    const { name, value } = updatedSettings;
    const updating = { ...currSettings, [name]: value };
    setCurrentSettings(updating);
  };

  return (
    <SchoolContext.Provider
      value={{
        handleSettingsOnChanges,
        currSettings,
        activeTheme,
        secondaryColor,
        primaryColor,
        handlePrimaryColour,
        handleSecondaryColour,
        setActiveTheme,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

ThemeContext.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTheme = () => useContext(SchoolContext);
