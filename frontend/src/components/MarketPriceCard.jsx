import React, { useState } from 'react';
import PriceHistoryChart from './PriceHistoryChart';
import { FaMapMarkerAlt, FaRupeeSign, FaChevronDown, FaChevronUp, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import '../styles/MarketPrices.css'; // Import the dedicated CSS

const MarketPriceCard = ({ marketData }) => {
    const [showHistory, setShowHistory] = useState(false);
    const { market, history } = marketData;

    if (!history || history.length < 2) return null;

    const latestPrice = history[history.length - 1].price;
    const previousPrice = history[history.length - 2].price;
    const priceChange = latestPrice - previousPrice;

    let TrendIcon = FaMinus;
    let trendColor = 'text-gray-500';

    if (priceChange > 0) {
        TrendIcon = FaArrowUp;
        trendColor = 'text-green-500';
    } else if (priceChange < 0) {
        TrendIcon = FaArrowDown;
        trendColor = 'text-red-500';
    }

    return (
        <div className="market-price-card">
            <div className="market-price-main" onClick={() => setShowHistory(!showHistory)}>
                <div className="market-info">
                    <FaMapMarkerAlt className="market-icon" />
                    <div>
                        <p className="market-name">{market.name}</p>
                        <p className="state-name">{market.state}</p>
                    </div>
                </div>
                <div className="price-trend-info">
                    <div className={`price-change ${trendColor}`}>
                        <TrendIcon />
                        <span>₹{Math.abs(priceChange)}</span>
                    </div>
                    <div className="price-info">
                        <p className="current-price"><FaRupeeSign />{latestPrice.toLocaleString('en-IN')}</p>
                        <p className="price-unit">per Quintal</p>
                    </div>
                </div>
                <div className="toggle-icon">{showHistory ? <FaChevronUp /> : <FaChevronDown />}</div>
            </div>
            {showHistory && <PriceHistoryChart data={history} />}
        </div>
    );
};

export default MarketPriceCard;