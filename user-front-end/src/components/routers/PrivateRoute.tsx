import React, { JSX } from "react";
import { Navigate } from "react-router-dom";
import { RootState } from '../../store';
import { useSelector } from 'react-redux';

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
    
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return isAuthenticated ? element : <Navigate to="/login" replace />;

};

export default PrivateRoute;