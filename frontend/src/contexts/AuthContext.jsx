import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const checkAuthStatus = useCallback(() => {
        try {
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
            } else {
                setCurrentUser(null);
            }
        } catch (error) {
            console.error("Failed to parse user data from localStorage", error);
            setCurrentUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuthStatus();
        // Listen for changes in other tabs
        window.addEventListener('storage', checkAuthStatus);
        return () => {
            window.removeEventListener('storage', checkAuthStatus);
        };
    }, [checkAuthStatus]);

    const login = (userData) => {
        // This function would be called from your Signin page after a successful login
        localStorage.setItem('currentUser', JSON.stringify(userData));
        setCurrentUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken'); // Also clear the token
        setCurrentUser(null);
        // Optionally navigate to home or signin page
        navigate('/signin');
    };

    const value = { currentUser, login, logout, loading };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};