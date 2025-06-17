import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/MarketPrices.css'; // Import the dedicated CSS

const CropCard = ({ crop }) => (
    <Link to={`/market-prices/${crop.id}`} className="crop-card-link">
        <div className="crop-card">
            <img src={crop.imageUrl} alt={crop.name} className="crop-card-image" />
            <div className="crop-card-overlay">
                <h3 className="crop-card-name">{crop.name}</h3>
            </div>
        </div>
    </Link>
);

export default CropCard;