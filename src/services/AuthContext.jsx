import React, { createContext, useContext, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchLoggedInUser } from './apiAuth';

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user'],
    queryFn: fetchLoggedInUser,
  });

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, queryClient }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
