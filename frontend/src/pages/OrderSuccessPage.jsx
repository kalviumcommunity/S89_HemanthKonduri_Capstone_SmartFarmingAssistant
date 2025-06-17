import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import './OrderSuccessPage.css'; // Make sure you have this CSS file

const OrderSuccessPage = () => {
    const location = useLocation();
    
    // This is the key: get the order data directly from the navigation state.
    const order = location.state?.order;

    // If a user tries to access this page directly without an order object,
    // redirect them to the homepage. This is a crucial safeguard.
    if (!order) {
        return <Navigate to="/homepage" replace />;
    }

    return (
        <div className="order-success-container">
            <div className="success-card">
                <div className="success-icon">✓</div>
                <h2>Order Placed Successfully!</h2>
                <p>Thank you for your purchase. Your order is confirmed and will be delivered soon.</p>
                <div className="order-summary-box">
                    <p><strong>Order ID:</strong> {order.orderId}</p>
                    <p><strong>Total Amount Paid:</strong> ₹{order.priceDetails.finalTotal.toFixed(2)}</p>
                    <p><strong>Estimated Delivery:</strong> {new Date(order.estimatedDelivery).toDateString()}</p>
                </div>
                <div className="success-actions">
                    <Link to="/my-orders" className="btn-secondary">View My Orders</Link>
                    <Link to="/store" className="btn-primary">Continue Shopping</Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;