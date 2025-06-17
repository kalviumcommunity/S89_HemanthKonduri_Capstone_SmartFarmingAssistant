import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/MarketPrices.css'; // Import the dedicated CSS

const PriceHistoryChart = ({ data }) => {
    // Get the last 7 days of data. Assumes data is sorted oldest to newest.
    const chartData = data
        .slice(-7)
        .map(item => ({
            date: new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            price: item.price
        }));

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

export default PriceHistoryChart;