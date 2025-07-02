// src/routes/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../features/auth/hooks/useAuth';
import Layout from '../component/Layout';

const PrivateRoute = () => {

  const { auth, loading } = useAuth();
  const location = useLocation(); // Use useLocation to get the current location

  if (loading) {
    return <div>Loading...</div>;
  }

  return auth ? (
    // Render child routes if user is authenticated
    <Layout>
      <Outlet />
    </Layout>

  ) : (
    // Redirect to login page, passing the current location in state
    <Navigate to="/login" state={{ from: location }} />
  );
};

export default PrivateRoute;