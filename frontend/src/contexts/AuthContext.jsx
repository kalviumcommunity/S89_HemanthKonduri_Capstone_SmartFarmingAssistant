import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [loading, setLoading] = useState(true); // To handle initial auth check

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('currentUser');

        if (storedToken && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
                // Set the auth token for all future axios requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            } catch (error) {
                console.error("Failed to parse user data from localStorage", error);
                // Clear corrupted data
                localStorage.removeItem('authToken');
                localStorage.removeItem('currentUser');
            }
        }
        setLoading(false); // Finished loading initial auth state
    }, []);

    const login = (userData, authToken) => {
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('authToken', authToken);
        setUser(userData);
        setToken(authToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    };

    const logout = () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        setUser(null);
        setToken(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    const value = { user, token, loading, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};