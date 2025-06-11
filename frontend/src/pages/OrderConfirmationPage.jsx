import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './OrderConfirmationPage.css';

const OrderConfirmationPage = () => {
    const location = useLocation();
    const { order } = location.state || {};

    if (!order) {
        return (
            <div className="confirmation-container error">
                <h2>Order Not Found</h2>
                <p>We couldn't find the details for this order. Please check 'My Orders' for status.</p>
                <Link to="/my-orders" className="btn-primary">View My Orders</Link>
            </div>
        );
    }
    
    const orderedDate = new Date(order.createdAt).toLocaleString();
    const deliveryDate = new Date(order.estimatedDelivery).toLocaleDateString();

    return (
        <div className="confirmation-container">
            <div className="success-icon">✓</div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for your purchase. Your order is being processed.</p>
            
            <div className="order-summary-box">
                <h3>Order Summary (ID: {order._id})</h3>
                <div className="order-detail"><strong>Order Date:</strong> {orderedDate}</div>
                <div className="order-detail"><strong>Estimated Delivery:</strong> {deliveryDate}</div>
                <div className="order-detail"><strong>Total Amount:</strong> ₹{order.totalPrice.toFixed(2)}</div>
                <div className="order-detail"><strong>Payment Method:</strong> {order.paymentMethod}</div>
                
                <h4>Items Ordered:</h4>
                <ul className="order-items-list-confirm">
                    {order.orderItems.map(item => (
                        <li key={item.product}>
                           <img src={item.image} alt={item.name} />
                           <span>{item.name} (Qty: {item.qty})</span>
                           <span>₹{(item.price * item.qty).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="confirmation-actions">
                <Link to="/saprastore" className="btn-secondary">Continue Shopping</Link>
                <Link to="/my-orders" className="btn-primary">Track My Orders</Link>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;