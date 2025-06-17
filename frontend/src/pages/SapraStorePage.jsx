// src/pages/SapraStorePage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import StoreTopBar from '../components/StoreTopBar';
import ProductCard from '../components/ProductCard';
import '../styles/SapraStore.css';

const SapraStorePage = () => {
    const [storeData, setStoreData] = useState({ categories: [], products: [] });
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const { data } = await axios.get('/api/store/all');
                setStoreData(data);
                setFilteredProducts(data.products);
            } catch (err) {
                setError('Failed to load store data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchStoreData();
    }, []);

    useEffect(() => {
        const results = storeData.products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(results);
    }, [searchTerm, storeData.products]);


    return (
        <div className="store-page-wrapper">
            <NavBar />
            <StoreTopBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <main className="store-container">
                {/* Banner Section */}
                <section className="store-banner">
                    <div className="banner-content">
                        <h2>Upto 40% Off on Gardening Tools</h2>
                        <p>Get your farm ready with our high-quality, durable tools. Limited time offer!</p>
                        <button className="banner-button">Shop Now</button>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="categories-section">
                    <h2 className="section-title">Shop by Category</h2>
                    <div className="category-grid">
                        {storeData.categories.map(category => (
                            <div key={category.name} className="category-card">
                                <div className="category-image-wrapper">
                                    <img src={category.image} alt={category.name} />
                                </div>
                                <h3>{category.name}</h3>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Products Section */}
                <section className="products-section">
                    <h2 className="section-title">All Products</h2>
                    {loading && <div className="loader">Loading Products...</div>}
                    {error && <div className="error-message">{error}</div>}
                    {!loading && !error && (
                        <div className="product-grid">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                            ) : (
                                <p className="no-results-message">No products found matching your search.</p>
                            )}
                        </div>
                    )}
                </section>
            </main>
            <footer className="home-footer">
                <div className="footer-container">
        {/* Column 1 */}
        <div className="footer-column">
          <h3>Smart Farming Assistant</h3>
          <p>
            Empowering farmers with technology – from AI tools to real-time
            support.
          </p>
        </div>

        {/* Column 2 */}
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/market-prices">Market Prices</a></li>
            <li><a href="/ai-chat">AI Chat</a></li>
            <li><a href="/products">Products</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="footer-column">
          <h4>Contact Us</h4>
          <p>Email: support@smartfarming.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Location: Rajahmundry, India</p>
        </div>

        {/* Column 4 */}
        <div className="footer-column">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/1384/1384005.png" alt="Facebook" /></a>
            <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/1384/1384017.png" alt="Twitter" /></a>
            <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/1384/1384012.png" alt="Instagram" /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Smart Farming Assistant. All rights reserved.</p>
      </div>
            </footer>
        </div>
    );
};

export default SapraStorePage;