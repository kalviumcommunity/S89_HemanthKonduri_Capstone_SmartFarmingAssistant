import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import OnlinePaymentModal from '../components/OnlinePaymentModal';
import './PaymentPage.css';

const PaymentPage = () => {
    const navigate = useNavigate();
    const { cartItems, totalPrice, clearCart } = useCart();
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
    const [walletBalance, setWalletBalance] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    useEffect(() => {
        const fetchWallet = async () => {
            const userInfo = JSON.parse(localStorage.getItem('currentUser'));
            if (!userInfo || !userInfo.token) {
                navigate('/signin?redirect=/payment');
                return;
            }

            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/users/wallet', config);
                setWalletBalance(data.walletBalance);
            } catch (err) {
                console.error("Failed to fetch wallet balance", err);
                setError('Could not fetch wallet balance.');
            }
        };
        fetchWallet();
    }, [navigate]);

    const placeOrderHandler = async (finalPaymentMethod) => {
        setLoading(true);
        setError('');
        try {
            const userInfo = JSON.parse(localStorage.getItem('currentUser'));
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };

            const order = {
                orderItems: cartItems.map(item => ({...item, product: item._id})),
                paymentMethod: finalPaymentMethod,
                totalPrice: totalPrice,
            };

            const { data } = await axios.post('http://localhost:5000/api/orders', order, config);
            
            clearCart();
            navigate('/order-confirmation', { state: { order: data } });

        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while placing the order.');
            setLoading(false);
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (paymentMethod === 'Online Payment') {
            setShowPaymentModal(true);
        } else {
            placeOrderHandler(paymentMethod);
        }
    };

    const handleOnlinePaymentSuccess = () => {
        setShowPaymentModal(false);
        placeOrderHandler('Online Payment');
    };

    const isWalletDisabled = totalPrice > walletBalance;

    return (
        <div className="payment-container">
            <h1>Payment Method</h1>
            {error && <div className="error-box">{error}</div>}
            <form onSubmit={submitHandler}>
                <div className="payment-options">
                    <div className="payment-option">
                        <input type="radio" id="cod" name="paymentMethod" value="Cash on Delivery" checked={paymentMethod === 'Cash on Delivery'} onChange={(e) => setPaymentMethod(e.target.value)} />
                        <label htmlFor="cod">Cash on Delivery</label>
                    </div>
                    <div className={`payment-option ${isWalletDisabled ? 'disabled' : ''}`}>
                        <input type="radio" id="wallet" name="paymentMethod" value="Sapra Wallet" disabled={isWalletDisabled} onChange={(e) => setPaymentMethod(e.target.value)} />
                        <label htmlFor="wallet">Sapra Wallet (Balance: ₹{walletBalance.toFixed(2)})</label>
                        {isWalletDisabled && <small className="wallet-error">Insufficient balance</small>}
                    </div>
                    <div className="payment-option">
                        <input type="radio" id="online" name="paymentMethod" value="Online Payment" onChange={(e) => setPaymentMethod(e.target.value)} />
                        <label htmlFor="online">Online Payment (UPI, Cards)</label>
                    </div>
                </div>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Placing Order...' : 'Place Order'}
                </button>
            </form>
            {showPaymentModal && <OnlinePaymentModal onPaymentSuccess={handleOnlinePaymentSuccess} onHide={() => setShowPaymentModal(false)} />}
        </div>
    );
};

export default PaymentPage;