import React, { useState } from 'react';
import './OnlinePaymentModal.css';

const OnlinePaymentModal = ({ onPaymentSuccess, onHide }) => {
    const [processing, setProcessing] = useState(false);

    const handleDummyPayment = (e) => {
        e.preventDefault();
        setProcessing(true);
        // Simulate API call delay
        setTimeout(() => {
            setProcessing(false);
            onPaymentSuccess();
        }, 2500);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <button className="modal-close-btn" onClick={onHide}>×</button>
                <h3>Online Payment</h3>
                <p>This is a dummy payment system. No real card details are needed.</p>
                <form onSubmit={handleDummyPayment}>
                    <div className="form-group">
                        <label htmlFor="cardNumber">Card Number</label>
                        <input type="text" id="cardNumber" placeholder="1234 5678 9101 1121" required />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="expiry">Expiry Date</label>
                            <input type="text" id="expiry" placeholder="MM/YY" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cvv">CVV</label>
                            <input type="text" id="cvv" placeholder="123" required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="cardName">Name on Card</label>
                        <input type="text" id="cardName" placeholder="Hemanth Kumar" required />
                    </div>
                    <button type="submit" className="btn-pay" disabled={processing}>
                        {processing ? 'Processing...' : 'Pay Securely'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OnlinePaymentModal;