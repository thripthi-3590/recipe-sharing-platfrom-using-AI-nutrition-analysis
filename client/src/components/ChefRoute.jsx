import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const ChefRoute = () => {
  const { user } = useContext(AuthContext);
  
  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is not a chef, redirect to home
  if (user.role !== 'chef') {
    return <Navigate to="/" replace />;
  }

  // If user is a chef, render the child routes
  return <Outlet />;
};

export default ChefRoute;
