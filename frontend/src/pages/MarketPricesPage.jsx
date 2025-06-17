// src/pages/MarketPricesPage.jsx (UPDATED HTML STRUCTURE)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import MarketPriceCard from '../components/MarketPriceCard';
import CropCard from '../components/CropCard';
import '../styles/MarketPrices.css';

const MarketPricesPage = () => {
    const [allCrops, setAllCrops] = useState([]);
    const [allStates, setAllStates] = useState([]);
    const [selectedCropId, setSelectedCropId] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const [cropsResponse, trendsResponse] = await Promise.all([
                    axios.get('/api/crop-price/all-crops'),
                    axios.get(`/api/crop-price/trends/1`)
                ]);
                setAllCrops(cropsResponse.data);
                const uniqueStates = [...new Set(trendsResponse.data.map(t => t.market.state))].sort();
                setAllStates(uniqueStates);
            } catch (err) {
                setError('Failed to load initial data. Please refresh.',err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!selectedCropId || !selectedState) return alert('Please select both a crop and a state.');
        setSearching(true);
        setError('');
        setSearchResults(null);
        try {
            const { data } = await axios.get(`/api/crop-price/trends/${selectedCropId}`);
            const stateResults = data.filter(trend => trend.market.state === selectedState);
            setSearchResults(stateResults);
        } catch (err) {
            setError('Could not fetch price data.',err);
        } finally {
            setSearching(false);
        }
    };

    return (
        <>
            <NavBar />
            {/* The main container with max-width for header and search form */}
            <div className="market-page-container">
                <header className="market-header">
                    <h1>Crop Market Prices</h1>
                    <p>Search directly for prices or explore popular crops below.</p>
                </header>
                <div className="search-form-container">
                    <form onSubmit={handleSearch} className="search-filters">
                        <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} disabled={loading}>
                            <option value="">-- Select State --</option>
                            {allStates.map(state => <option key={state} value={state}>{state}</option>)}
                        </select>
                        <select value={selectedCropId} onChange={(e) => setSelectedCropId(e.target.value)} disabled={loading}>
                            <option value="">-- Select Crop --</option>
                            {allCrops.map(crop => <option key={crop.id} value={crop.id}>{crop.name}</option>)}
                        </select>
                        <button type="submit" disabled={searching || !selectedCropId || !selectedState}>
                            {searching ? 'Searching...' : 'Search Prices'}
                        </button>
                    </form>
                </div>
                {error && <div className="error-message">{error}</div>}
            </div> {/* End of market-page-container for header/search */}

            {/* New wrapper for content that should span full width */}
            <div className="full-width-content-wrapper"> {/* NEW WRAPPER */}
                {searching ? (
                    <div className="loader">Fetching prices...</div>
                ) : searchResults !== null ? (
                    <div className="search-results-container">
                        <h2>Search Results</h2>
                        <div className="market-price-list">
                            {searchResults.length > 0 ? (
                                searchResults.map(trend => <MarketPriceCard key={trend.market.id} marketData={trend} />)
                            ) : (
                                <p className="no-results-message">No market data found for this selection.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="initial-crop-grid-container">
                        <h2>Explore Crops</h2>
                        {loading ? (
                            <div className="loader">Loading crops...</div>
                        ) : (
                            <div className="crop-grid">
                                {allCrops.map(crop => <CropCard key={crop.id} crop={crop} />)}
                            </div>
                        )}
                    </div>
                )}

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
            </div> {/* End of full-width-content-wrapper */}
        </>
    );
};
export default MarketPricesPage;