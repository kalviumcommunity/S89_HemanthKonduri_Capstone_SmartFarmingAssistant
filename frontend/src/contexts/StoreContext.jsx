import React, { createContext, useState, useEffect, useContext } from 'react';
import * as api from '/src/api';
import { useAuth } from './AuthContext';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState(() => {
        try {
            const localCart = window.localStorage.getItem('sapraStoreCart');
            return localCart ? JSON.parse(localCart) : [];
        } catch (error) { return []; }
    });
    const [userData, setUserData] = useState({ user: null, orders: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.localStorage.setItem('sapraStoreCart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        const isLoggedIn = !!user;
        const loadInitialData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [{ data: productsData }, { data: allUserData }] = await Promise.all([
                    api.fetchProducts(),
                    api.fetchUserData()
                ]);
                setProducts(productsData);
                setUserData(allUserData);
            } catch (err) {
                console.error("!!! StoreContext: CRITICAL ERROR fetching initial data:", err);
                setError("Failed to load store data. Is the backend server running?");
            } finally {
                setLoading(false);
            }
        };

        if (isLoggedIn) {
            loadInitialData();
        } else {
            setLoading(false);
        }
    }, [user]);

    // --- The rest of the functions ---
    const addToCart = (product, quantity = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item._id === product._id);
            if (existingItem) {
                return prevCart.map(item =>
                    item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prevCart, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item._id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        setCart(prevCart => prevCart.map(item =>
            item._id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
        ));
    };

    const clearCart = () => setCart([]);

    // *** THIS IS THE CRITICAL FIX FOR THE ADDRESS PAGE ***
    const addAddress = async (addressData) => {
        try {
            // The backend should return the *entire updated list* of addresses.
            const { data: updatedAddresses } = await api.addNewAddress(addressData);
            // Now, we update the local state correctly.
            setUserData(prev => ({
                ...prev,
                user: {
                    ...prev.user,
                    addresses: updatedAddresses // Replace the old list with the new one
                }
            }));
        } catch (error) {
            console.error("Failed to add address:", error);
            // Optionally, re-throw the error to be handled in the component
            throw error;
        }
    };

    const placeOrder = async (orderData) => {
        const { data: newOrder } = await api.createOrder(orderData);
        setUserData(prev => ({ 
            ...prev,
            orders: [newOrder, ...prev.orders],
            user: { ...prev.user, hasPlacedFirstOrder: true } 
        }));
        clearCart();
        return newOrder;
    };

    const value = {
        products, cart, userData, loading, error,
        addToCart, removeFromCart, updateQuantity, addAddress, placeOrder,
    };

    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};