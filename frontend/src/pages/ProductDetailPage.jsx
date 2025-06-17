import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '/src/contexts/StoreContext';
import * as api from '/src/api';
import './ProductDetailPage.css'; // We'll update this CSS file

const ProductDetailPage = () => {
    const { id } = useParams();
    const { cart, addToCart } = useStore();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // *** NEW: Check if the product is already in the cart ***
    const isInCart = cart.some(item => item._id === id);

    useEffect(() => {
        const getProduct = async () => {
            setLoading(true);
            try {
                const { data } = await api.fetchProductById(id);
                setProduct(data);
            } catch (error) { console.error("Failed to fetch product", error); }
            setLoading(false);
        };
        getProduct();
    }, [id]);

    const handleButtonClick = () => {
        if (isInCart) {
            navigate('/cart'); // If already in cart, the button navigates to the cart
        } else if (product) {
            addToCart(product, 1); // If not, it adds the product
        }
    };

    if (loading) return <div className="loader">Loading Product...</div>;
    if (!product) return <div className="container"><h2>Product not found</h2></div>;
    
    const discountedPrice = product.price - (product.price * product.discount / 100);

    return (
        <div className="product-detail-page container">
            <div className="product-detail-image">
                <img src={product.image} alt={product.name} />
            </div>
            <div className="product-detail-info">
                <span className="category-tag">{product.category}</span>
                <h1>{product.name}</h1>
                <p className="description">{product.description}</p>
                <div className="rating">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))} ({product.rating})</div>
                <div className="price-section">
                    <span className="current-price">₹{discountedPrice.toFixed(2)}</span>
                    <span className="original-price">₹{product.price.toFixed(2)}</span>
                    <span className="discount-badge">{product.discount}% OFF</span>
                </div>
                <p className="stock">In Stock: {product.stock > 0 ? `${product.stock} units` : 'Out of Stock'}</p>
                
                <button 
                    onClick={handleButtonClick} 
                    // *** NEW: Dynamically change button class and text ***
                    className={`add-to-cart-btn ${isInCart ? 'in-cart' : ''}`}
                    disabled={product.stock === 0}
                >
                    {product.stock === 0 ? 'Out of Stock' : (isInCart ? '✓ Go to Cart' : 'Add to Cart')}
                </button>
            </div>
        </div>
    );
};

export default ProductDetailPage;