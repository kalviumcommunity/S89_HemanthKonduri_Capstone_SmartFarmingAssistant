import React from 'react';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
    const navigate = useNavigate();
    const { 
        cartItems, 
        removeFromCart, 
        updateQuantity, 
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        totalQuantity,
    } = useCart();

    const handleCheckout = () => {
        // You might want to check if user is logged in first
        navigate('/payment');
    };

    return (
        <div className="cart-page-container">
            <h1>Your Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div className="cart-empty">
                    <p>Your cart is empty.</p>
                    <Link to="/saprastore" className="btn-primary">Go Shopping</Link>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-items-list">
                        {cartItems.map(item => {
                            const finalPrice = item.price - (item.price * (item.discount / 100));
                            return (
                                <div key={item._id} className="cart-item">
                                    <img src={item.image} alt={item.name} className="cart-item-image" />
                                    <div className="cart-item-details">
                                        <Link to={`/product/${item._id}`} className="cart-item-name">{item.name}</Link>
                                        <p className="cart-item-price">₹{finalPrice.toFixed(2)}</p>
                                        <div className="cart-item-actions">
                                            <select 
                                                value={item.qty} 
                                                onChange={(e) => updateQuantity(item._id, e.target.value)}
                                                className="qty-select"
                                            >
                                                {[...Array(item.countInStock).keys()].map(x => (
                                                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                ))}
                                            </select>
                                            <button onClick={() => removeFromCart(item._id)} className="delete-btn">Remove</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Items ({totalQuantity})</span>
                            <span>₹{itemsPrice.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice.toFixed(2)}`}</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax (5%)</span>
                            <span>₹{taxPrice.toFixed(2)}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>₹{totalPrice.toFixed(2)}</span>
                        </div>
                        <button 
                            className="btn-checkout" 
                            onClick={handleCheckout}
                            disabled={cartItems.length === 0}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;