import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import { getSettings } from './settings';
import { createContext, useContext } from 'react';
import toast from 'react-hot-toast';
import Spinner from '../ui/Spinner';

const SchoolContext = createContext();

export const SchoolSettingsProvider = ({ children }) => {
  const {
    data: settings,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  if (error) {
    toast.error(error.message);
    return null;
  }
  if (isLoading) return <Spinner size="medium" />;
  return (
    <SchoolContext.Provider value={settings}>{children}</SchoolContext.Provider>
  );
};

SchoolSettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useSettings = () => useContext(SchoolContext);
