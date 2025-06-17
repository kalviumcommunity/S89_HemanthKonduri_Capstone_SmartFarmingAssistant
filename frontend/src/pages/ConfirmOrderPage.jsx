import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useStore } from '/src/contexts/StoreContext';
import './CheckoutPages.css'; // Use the new CSS file

const ConfirmOrderPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { deliveryAddress, paymentMethod } = location.state || {};
    const { cart, userData, placeOrder } = useStore();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const priceDetails = useMemo(() => {
        // ... same price calculation logic as before
        const subtotal = cart.reduce((acc, item) => acc + (item.price - (item.price * item.discount / 100)) * item.quantity, 0);
        const firstOrderDiscount = userData.user?.hasPlacedFirstOrder ? 0 : subtotal * 0.30;
        const totalAfterDiscount = subtotal - firstOrderDiscount;
        const deliveryFee = totalAfterDiscount > 0 && totalAfterDiscount < 3000 ? 50 : 0;
        const finalTotal = totalAfterDiscount + deliveryFee;
        return { subtotal, firstOrderDiscount, deliveryFee, finalTotal };
    }, [cart, userData.user]);
    
    // Safeguard redirect
    React.useEffect(() => {
        if (!deliveryAddress || !paymentMethod || cart.length === 0) {
            navigate('/store', { replace: true });
        }
    }, [deliveryAddress, paymentMethod, cart, navigate]);

    const handlePlaceOrder = async () => {
        setLoading(true);
        setError('');

        const orderData = {
            items: cart.map(item => ({
                productId: item._id, name: item.name, image: item.image,
                price: item.price - (item.price * item.discount / 100),
                quantity: item.quantity
            })),
            deliveryAddress,
            paymentMethod,
            priceDetails: {
                subtotal: priceDetails.subtotal,
                discount: priceDetails.firstOrderDiscount,
                deliveryFee: priceDetails.deliveryFee,
                finalTotal: priceDetails.finalTotal,
            }
        };

        try {
            // *** CRITICAL CHANGE HERE ***
            // The placeOrder function in the context will update the global state.
            // But we will navigate using the data *it returns*, which is more stable.
            const newOrder = await placeOrder(orderData);
            
            // This ensures we navigate with the confirmed order data,
            // preventing race conditions with state updates.
            navigate('/order-success', { 
                state: { order: newOrder }, 
                replace: true // 'replace: true' prevents user from going "back" to the confirm page
            });
        } catch (err) {
            console.error("Order placement failed on confirmation page:", err);
            setError("Failed to place order. Please try again.");
            setLoading(false);
        }
    };

    if (!deliveryAddress) return null;

    return (
        <div className="checkout-page-container">
            <div className="checkout-card">
                <button onClick={() => navigate('/checkout/payment', { state: { deliveryAddress } })} className="back-link">← Back to Payment</button>
                <h1>Confirm & Place Order</h1>
                <div className="confirm-page-layout">
                    {/* ... The rest of your JSX for this page remains the same ... */}
                    <div className="confirm-details-wrapper">
                        {/* Shipping To Section */}
                        <div className="confirm-section">
                            <div className="section-header">
                                <h3>Shipping To:</h3>
                                <Link to="/checkout/address">Change</Link>
                            </div>
                            <div className="address-card static">
                                <strong>{deliveryAddress.name}</strong>
                                <p>{deliveryAddress.street}, {deliveryAddress.city}</p>
                            </div>
                        </div>
                        {/* Payment Method Section */}
                        <div className="confirm-section">
                            <div className="section-header">
                                <h3>Payment Method:</h3>
                                <Link to="/checkout/payment" state={{ deliveryAddress }}>Change</Link>
                            </div>
                            <p className="payment-method-text">{paymentMethod}</p>
                        </div>
                    </div>
                    {/* Order Summary Section */}
                    <div className="confirm-summary-wrapper">
                        <h3>Order Summary</h3>
                        <div className="confirm-items-list">
                            {cart.map(item => (
                                <div key={item._id} className="confirm-item-mini">
                                    <img src={item.image} alt={item.name} />
                                    <div className="item-info">
                                        <p className="item-name">{item.name}</p>
                                        <p className="item-qty">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="item-price">₹{(item.price - (item.price * item.discount / 100)).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="price-details-final">
                            {/* ... price details JSX ... */}
                        </div>
                        <button onClick={handlePlaceOrder} className="btn-primary proceed-btn" disabled={loading}>
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                        {error && <p className="error-text" style={{textAlign: 'center', marginTop: '1rem'}}>{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmOrderPage;