import PropTypes from 'prop-types';
import { createContext, useContext, useEffect } from 'react';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

const DarkModeContext = createContext();

function DarkModeProvider({ children }) {
  const [isDarkMode, setDarkMode] = useLocalStorageState(false, 'isDarkMode');

  useEffect(
    function () {
      if (isDarkMode === true || isDarkMode === 'dark') {
        document.documentElement.classList.remove('light-mode');
        document.documentElement.classList.add('dark-mode');
      } else if (!isDarkMode || isDarkMode === 'light') {
        document.documentElement.classList.remove('dark-mode');
        document.documentElement.classList.add('light-mode');
      } else if (!isDarkMode || isDarkMode === 'default') {
        document.documentElement.classList.remove('dark-mode');
        document.documentElement.classList.add('light-mode');
      }
    },
    [isDarkMode]
  );

  function toggleDarkMode() {
    setDarkMode(!isDarkMode);
  }
  function setMode(mode) {
    setDarkMode(mode);
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode, setMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

DarkModeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) throw new Error(' something went wrong');
  return context;
}
export { DarkModeProvider, useDarkMode };
