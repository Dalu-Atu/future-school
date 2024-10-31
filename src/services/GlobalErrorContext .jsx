import React, { createContext, useContext, useState } from 'react';

const GlobalErrorContext = createContext();

export const useGlobalError = () => useContext(GlobalErrorContext);

export const GlobalErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  const triggerError = (error) => {
    setError(error);
  };

  return (
    <GlobalErrorContext.Provider value={{ error, triggerError }}>
      {children}
    </GlobalErrorContext.Provider>
  );
};
