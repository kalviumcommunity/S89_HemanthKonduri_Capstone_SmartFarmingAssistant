import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './MyOrdersPage.css';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            const userInfo = JSON.parse(localStorage.getItem('currentUser'));
            if (!userInfo || !userInfo.token) {
                navigate('/signin?redirect=/my-orders');
                return;
            }

            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);
                setOrders(data);
            } catch (err) {
                setError('Failed to fetch orders.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [navigate]);

    return (
        <div className="my-orders-container">
            <h1>My Orders</h1>
            {loading ? <div className="loader">Loading...</div> : 
             error ? <div className="error-message">{error}</div> :
             orders.length === 0 ? (
                <div className="no-orders">
                    <p>You have not placed any orders yet.</p>
                    <Link to="/saprastore" className="btn-primary">Start Shopping</Link>
                </div>
             ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order._id} className="order-card">
                            <div className="order-header">
                                <div>
                                    <span className="order-label">ORDER PLACED</span>
                                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div>
                                    <span className="order-label">TOTAL</span>
                                    <span>₹{order.totalPrice.toFixed(2)}</span>
                                </div>
                                <div>
                                    <span className="order-label">ORDER #</span>
                                    <span>{order._id}</span>
                                </div>
                            </div>
                            <div className="order-body">
                                <h4>Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</h4>
                                {order.orderItems.map(item => (
                                    <div key={item.product} className="order-item-detail">
                                        <img src={item.image} alt={item.name}/>
                                        <div>
                                            <p className="item-name">{item.name}</p>
                                            <p className="item-qty">Qty: {item.qty}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
             )}
        </div>
    );
};

export default MyOrdersPage;