import React from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '/src/contexts/StoreContext';
import './StoreNavbar.css';

const StoreNavbar = () => {
    const { cart } = useStore();
    const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <nav className="store-navbar">
            <div className="container store-nav-container">
                <div className="store-nav-brand">
                    <NavLink to="/store">Sapra Store</NavLink>
                </div>
                <div className="store-nav-search">
                    <input type="text" placeholder="Search in store..." />
                    <button>Search</button>
                </div>
                <div className="store-nav-links">
                    <NavLink to="/store">Home</NavLink>
                    <NavLink to="/my-orders">My Orders</NavLink>
                    <NavLink to="/cart" className="store-cart-link">
                        Cart
                        {cartItemCount > 0 && <span className="store-cart-badge">{cartItemCount}</span>}
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default StoreNavbar;