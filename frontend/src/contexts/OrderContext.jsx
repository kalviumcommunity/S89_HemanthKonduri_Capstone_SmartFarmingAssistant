// src/contexts/OrderContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const OrderContext = createContext();

const orderReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ORDER':
            // Add the new order to the beginning of the list
            return [action.payload, ...state];
        case 'LOAD_ORDERS':
            return action.payload;
        default:
            return state;
    }
};

export const OrderProvider = ({ children }) => {
    const [orders, dispatch] = useReducer(orderReducer, [], (initial) => {
        try {
            const localData = localStorage.getItem('sapraOrders');
            return localData ? JSON.parse(localData) : initial;
        } catch (error) {
            return initial;
        }
    });

    useEffect(() => {
        localStorage.setItem('sapraOrders', JSON.stringify(orders));
    }, [orders]);

    const addOrder = (orderData) => {
        const newOrder = {
            id: `SAPRA-${Date.now()}`,
            date: new Date().toISOString(),
            status: 'Ordered', // Initial status
            ...orderData,
        };
        dispatch({ type: 'ADD_ORDER', payload: newOrder });
    };

    const value = { orders, addOrder };

    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrders = () => useContext(OrderContext);