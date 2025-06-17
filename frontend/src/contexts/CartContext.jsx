// src/contexts/CartContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART': {
            const existingProductIndex = state.findIndex(item => item.id === action.payload.id);
            if (existingProductIndex >= 0) {
                const newState = [...state];
                newState[existingProductIndex].quantity += 1;
                return newState;
            } else {
                return [...state, { ...action.payload, quantity: 1 }];
            }
        }
        case 'REMOVE_FROM_CART':
            return state.filter(item => item.id !== action.payload.id);
        case 'UPDATE_QUANTITY': {
            const { id, quantity } = action.payload;
            return state.map(item => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item);
        }
        case 'CLEAR_CART':
            return [];
        case 'LOAD_CART':
            return action.payload;
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [cart, dispatch] = useReducer(cartReducer, [], (initial) => {
        try {
            const localData = localStorage.getItem('sapraCart');
            return localData ? JSON.parse(localData) : initial;
        } catch (error) {
            return initial;
        }
    });

    useEffect(() => {
        localStorage.setItem('sapraCart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => dispatch({ type: 'ADD_TO_CART', payload: product });
    const removeFromCart = (id) => dispatch({ type: 'REMOVE_FROM_CART', payload: { id } });
    const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    const clearCart = () => dispatch({ type: 'CLEAR_CART' });

    const value = { cart, addToCart, removeFromCart, updateQuantity, clearCart };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);