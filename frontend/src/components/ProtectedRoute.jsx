import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // You can show a loading spinner here while checking auth status
        return <div>Loading...</div>;
    }

    if (!user) {
        // Redirect them to the /signin page, but save the current location they were
        // trying to go to. This allows us to send them back after they sign in.
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;