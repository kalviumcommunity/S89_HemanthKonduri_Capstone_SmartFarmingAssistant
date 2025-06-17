import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const discountedPrice = product.price - (product.price * product.discount / 100);

    return (
        <div className="product-card" onClick={() => navigate(`/product/${product._id}`)}>
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">
                    ₹{discountedPrice.toFixed(2)} 
                    {product.discount > 0 && <span className="original-price">₹{product.price.toFixed(2)}</span>}
                </p>
            </div>
        </div>
    );
};

export default ProductCard;