import PropTypes from 'prop-types';
import Spinner from './Spinner';
import React from 'react';

import { Navigate } from 'react-router-dom';
import { useUser } from '../services/apiAuth';

function ProtectedRoute({ children }) {
  const { user, isLoading, isFetching } = useUser();

  if (isLoading || isFetching) return <Spinner />;
  if (!isFetching && !isLoading && !user) return <Navigate to="/" replace />;
  return React.cloneElement(children, { user });
}
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
export default ProtectedRoute;
