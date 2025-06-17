import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '/src/contexts/StoreContext';
import PriceDetails from '../components/PriceDetails';
import './CartPage.css'; // New CSS

const CartPage = () => {
    const { cart, removeFromCart, updateQuantity } = useStore();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="container empty-cart">
                <img src="/assets/empty-cart.svg" alt="Empty Cart" style={{width: '200px', marginBottom: '2rem'}} />
                <h2>Your Cart is Empty</h2>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <button onClick={() => navigate('/store')} className="btn-primary">Continue Shopping</button>
            </div>
        );
    }

    return (
        <div className="cart-page-container container">
            <div className="cart-items-list">
                <h1>Shopping Cart</h1>
                {cart.map(item => (
                    <div key={item._id} className="cart-item-card">
                        <img src={item.image} alt={item.name} />
                        <div className="item-details">
                            <h3>{item.name}</h3>
                            <p>₹{(item.price - (item.price * item.discount / 100)).toFixed(2)}</p>
                            <div className="quantity-control">
                                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                            </div>
                        </div>
                        <button className="remove-btn" onClick={() => removeFromCart(item._id)} title="Remove Item">×</button>
                    </div>
                ))}
            </div>
            <div className="cart-summary">
                <PriceDetails />
                <Link to="/checkout/address" className="btn-primary checkout-btn">Proceed to Checkout</Link>
            </div>
        </div>
    );
};

export default CartPage;