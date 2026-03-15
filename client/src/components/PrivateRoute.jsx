import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  
  if (loading) {
    return (
      <div className="p-8 min-h-screen flex justify-center items-center">
        <p className="text-lg text-gray-500">Authenticating...</p>
      </div>
    );
  }

  
  if (isAuthenticated) {
    return children;
  }

  
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;