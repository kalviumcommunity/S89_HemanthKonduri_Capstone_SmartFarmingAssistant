import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('cartItems');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, qty) => {
        const exist = cartItems.find((x) => x._id === product._id);
        if (exist) {
            setCartItems(
                cartItems.map((x) =>
                    x._id === exist._id ? { ...x, qty: x.qty + qty } : x
                )
            );
        } else {
            setCartItems([...cartItems, { ...product, qty }]);
        }
    };
    
    const updateQuantity = (productId, qty) => {
      setCartItems(
        cartItems.map((x) => (x._id === productId ? { ...x, qty: Number(qty) } : x))
      );
    };

    const removeFromCart = (productId) => {
        setCartItems(cartItems.filter((x) => x._id !== productId));
    };
    
    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
    }

    const itemsPrice = cartItems.reduce((acc, item) => acc + item.qty * (item.price - (item.price * (item.discount / 100))), 0);
    const taxPrice = itemsPrice * 0.05;
    const shippingPrice = itemsPrice > 1000 ? 0 : 100;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;
    const totalQuantity = cartItems.reduce((acc, item) => acc + item.qty, 0);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        totalQuantity,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};