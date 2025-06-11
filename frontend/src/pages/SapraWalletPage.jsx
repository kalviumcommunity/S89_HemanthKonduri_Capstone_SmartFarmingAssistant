import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SapraWalletPage.css';

const SapraWalletPage = () => {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWallet = async () => {
            const userInfo = JSON.parse(localStorage.getItem('currentUser'));
            if (!userInfo || !userInfo.token) {
                navigate('/signin?redirect=/wallet');
                return;
            }

            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/users/wallet', config);
                setBalance(data.walletBalance);
            } catch (err) {
                setError('Could not fetch wallet details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchWallet();
    }, [navigate]);

    return (
        <div className="wallet-page-container">
            <h1>My Sapra Wallet</h1>
            <div className="wallet-card">
                {loading ? (
                    <div className="loader">Loading...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <>
                        <p className="balance-label">Current Balance</p>
                        <p className="balance-amount">₹{balance?.toFixed(2)}</p>
                        <p className="wallet-info">
                            Use your wallet balance to make quick and easy payments for your orders on Sapra Store.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default SapraWalletPage;