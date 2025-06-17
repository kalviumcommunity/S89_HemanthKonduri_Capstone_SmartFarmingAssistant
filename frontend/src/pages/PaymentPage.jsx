import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PriceDetails from '../components/PriceDetails';
import './CheckoutPages.css';

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { deliveryAddress } = location.state || {};
    
    const [paymentMethod, setPaymentMethod] = useState('Online');
    const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvv: '' });

    React.useEffect(() => { if (!deliveryAddress) navigate('/checkout/address') }, [deliveryAddress, navigate]);

    const handlePaymentProceed = (e) => {
        e.preventDefault();
        if (paymentMethod === 'Online') {
            if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
                alert('Please fill in all card details.');
                return;
            }
        }
        navigate('/checkout/confirm', { state: { deliveryAddress, paymentMethod } });
    };

    return (
        <div className="checkout-page container">
            <button onClick={() => navigate('/checkout/address')} className="back-link">← Back to Address</button>
            <h1>Payment Method</h1>
            <div className="payment-content-wrapper">
                <div className="payment-options">
                    <div className={`payment-method-card ${paymentMethod === 'Online' ? 'selected' : ''}`} onClick={() => setPaymentMethod('Online')}>
                        <div className="radio-icon"></div>
                        <div className="method-details">
                           <h3>Credit / Debit Card / UPI</h3>
                           <p>Pay securely with Visa, Mastercard, RuPay, and more.</p>
                        </div>
                    </div>
                    <div className={`payment-method-card ${paymentMethod === 'COD' ? 'selected' : ''}`} onClick={() => setPaymentMethod('COD')}>
                        <div className="radio-icon"></div>
                        <div className="method-details">
                           <h3>Cash on Delivery</h3>
                           <p>Pay with cash upon delivery.</p>
                        </div>
                    </div>

                    {paymentMethod === 'Online' && (
                        <div className="online-payment-form">
                            <h4>Enter Card Details (Dummy Form)</h4>
                            <div className="card-input-wrapper">
                                <input type="text" placeholder="Card Number" value={cardDetails.number} onChange={e => setCardDetails({...cardDetails, number: e.target.value})} />
                                <img src="/assets/visa_mastercard.png" alt="cards" className="card-logos"/>
                            </div>
                            <input type="text" placeholder="Name on Card" value={cardDetails.name} onChange={e => setCardDetails({...cardDetails, name: e.target.value})} />
                            <div className="card-details-row">
                                <input type="text" placeholder="Expiry (MM / YY)" value={cardDetails.expiry} onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})} />
                                <div className="cvv-wrapper">
                                    <input type="text" placeholder="CVV" value={cardDetails.cvv} onChange={e => setCardDetails({...cardDetails, cvv: e.target.value})} />
                                    <span className="cvv-tooltip">?</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="payment-summary">
                    <PriceDetails />
                    <button onClick={handlePaymentProceed} className="btn-primary proceed-btn">Review Your Order</button>
                </div>
            </div>
        </div>
    );
};
export default PaymentPage;