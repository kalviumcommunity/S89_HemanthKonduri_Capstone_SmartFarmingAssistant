import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '/src/contexts/StoreContext';
import './MyOrdersPage.css'; // New CSS

const MyOrdersPage = () => {
    const { userData, loading } = useStore();
    const navigate = useNavigate();

    if (loading) return <div className="loader">Loading your orders...</div>;
    
    return (
        <div className="container my-orders-page">
            <h1>My Orders</h1>
            {userData.orders.length > 0 ? (
                <div className="orders-list">
                    {userData.orders.map(order => (
                        <div key={order._id} className="order-card-new" onClick={() => navigate(`/order/${order._id}`)}>
                            <div className="order-card-header">
                                <div>
                                    <h4>Order ID: {order.orderId}</h4>
                                    <p>Placed on {new Date(order.orderDate).toLocaleDateString()}</p>
                                </div>
                                <div className="order-card-total">
                                    <span>Total</span>
                                    <h4>₹{order.priceDetails.finalTotal.toFixed(2)}</h4>
                                </div>
                            </div>
                            <div className="order-card-body">
                                <div className="order-card-items-preview">
                                    {order.items.slice(0, 4).map(item => (
                                        <img key={item.productId} src={item.image} alt={item.name} />
                                    ))}
                                </div>
                                <div className="order-card-status">
                                    <span className={`status-dot status-${order.status.toLowerCase()}`}></span>
                                    {order.status}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-orders">
                    <p>You have not placed any orders yet.</p>
                    <button onClick={() => navigate('/store')} className="btn-primary">Start Shopping</button>
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;