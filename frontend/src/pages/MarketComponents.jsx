// src/components/MarketComponents.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaMapMarkerAlt, FaRupeeSign, FaChevronDown, FaChevronUp } from 'react-icons/fa';

// --- Component 1: CropCard ---
export const CropCard = ({ crop }) => (
    <Link to={`/market-prices/${crop.id}`} className="crop-card-link">
        <div className="crop-card">
            <img src={crop.imageUrl} alt={crop.name} className="crop-card-image" />
            <div className="crop-card-overlay">
                <h3 className="crop-card-name">{crop.name}</h3>
            </div>
        </div>
    </Link>
);

// --- Component 2: PriceHistoryChart ---
export const PriceHistoryChart = ({ data }) => {
    // Show only the last 7 days of data, sorted chronologically
    const chartData = data
        .map(item => ({
            date: new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            price: item.price
        }))
        .slice(0, 7)
        .reverse();

    return (
        <div className="price-history-chart-container">
            <h4 className="chart-title">Last 7-Day Price Trend</h4>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="date" stroke="#555" />
                    <YAxis
                        stroke="#555"
                        domain={['dataMin - 100', 'dataMax + 100']}
                        tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip
                        formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Price']}
                        labelStyle={{ color: '#333' }}
                        itemStyle={{ color: '#27ae60' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="price" name="Price (per Quintal)" stroke="#27ae60" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

// --- Component 3: MarketPriceCard ---
export const MarketPriceCard = ({ trend }) => {
    const [showHistory, setShowHistory] = useState(false);
    // The history from your backend is already sorted, newest first
    const latestPriceData = trend.history.length > 0 ? trend.history[0] : null;

    if (!latestPriceData) return null;

    return (
        <div className="market-price-card">
            <div className="market-price-main" onClick={() => setShowHistory(!showHistory)}>
                <div className="market-info">
                    <FaMapMarkerAlt className="market-icon" />
                    <div>
                        <p className="market-name">{trend.market.name}</p>
                        <p className="state-name">{trend.market.state}</p>
                    </div>
                </div>
                <div className="price-info">
                    <p className="current-price"><FaRupeeSign />{latestPriceData.price.toLocaleString('en-IN')}</p>
                    <p className="price-unit">per {latestPriceData.unit}</p>
                </div>
                <div className="toggle-icon">{showHistory ? <FaChevronUp /> : <FaChevronDown />}</div>
            </div>
            {showHistory && <PriceHistoryChart data={trend.history} />}
        </div>
    );
};