import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';


const OrderDetailPage = () => {
    const { id } = useParams();
    const { userData } = useStore();
    const order = userData.orders.find(o => o._id === id);

    if (!order) {
        return (
            <div className="container">
                <h2>Order not found</h2>
                <Link to="/my-orders">Back to My Orders</Link>
            </div>
        );
    }
    
    // Simple timeline logic
    const deliveryDate = new Date(order.estimatedDelivery);
    const today = new Date();
    const daysRemaining = Math.ceil((deliveryDate - today) / (1000 * 60 * 60 * 24));

    return (
        <div className="container order-detail-page">
            <h1>Order Details</h1>
            <div className="order-detail-header">
                <span><strong>Order ID:</strong> {order.orderId}</span>
                <span><strong>Placed on:</strong> {new Date(order.orderDate).toLocaleDateString()}</span>
            </div>

            <div className="order-timeline">
                <div className="timeline-step active">
                    <div className="timeline-icon">✓</div>
                    <p>Order Processed</p>
                </div>
                <div className={`timeline-step ${daysRemaining < 4 ? 'active' : ''}`}>
                    <div className="timeline-icon">✓</div>
                    <p>Shipped</p>
                </div>
                <div className={`timeline-step ${daysRemaining < 2 ? 'active' : ''}`}>
                    <div className="timeline-icon">✓</div>
                    <p>Out for Delivery</p>
                </div>
                <div className={`timeline-step ${order.status === 'Delivered' ? 'active' : ''}`}>
                    <div className="timeline-icon">✓</div>
                    <p>Delivered</p>
                </div>
            </div>

            <div className="order-detail-content">
                <div className="order-items-section">
                    <h3>Items in this order</h3>
                    {order.items.map(item => (
                        <div key={item.productId} className="order-item-detail-card">
                            <img src={item.image} alt={item.name} />
                            <div>
                                <p><strong>{item.name}</strong></p>
                                <p>Quantity: {item.quantity}</p>
                            </div>
                            <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                </div>
                <div className="order-summary-section">
                    <h3>Order Summary</h3>
                    <p><span>Subtotal:</span> <span>₹{order.priceDetails.subtotal.toFixed(2)}</span></p>
                    <p><span>Delivery Fee:</span> <span>₹{order.priceDetails.deliveryFee.toFixed(2)}</span></p>
                    <p><span>Discount:</span> <span>- ₹{order.priceDetails.firstOrderDiscount.toFixed(2)}</span></p>
                    <hr />
                    <p><strong>Total:</strong> <strong>₹{order.priceDetails.finalTotal.toFixed(2)}</strong></p>
                    <hr />
                    <h3>Shipping Address</h3>
                    <p><strong>{order.deliveryAddress.name}</strong></p>
                    <p>{order.deliveryAddress.street}, {order.deliveryAddress.city}</p>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;