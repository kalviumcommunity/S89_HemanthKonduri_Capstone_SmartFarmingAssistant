import React, { useState, useEffect, useMemo } from 'react';
import './MarketPricesPage.css';
import NavBar from '../components/NavBar';


// --- Reusable Components (can be broken into separate files later) ---
// ... (rest of your MarketPricesPage.js code from your paste) ...

const SearchIcon = () => <svg className="mp-search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const LocationIcon = () => <svg className="mp-location-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>;
const ClockIcon = () => <svg className="mp-clock-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path></svg>;

const CropCard = ({ crop, onSelect, isSelected }) => {
    const isPriceUp = crop.priceChangePercent >= 0;
    const priceChangeClass = isPriceUp ? 'mp-price-up' : 'mp-price-down';
    const arrow = isPriceUp ? '▲' : '▼';

    return (
        <div className={`mp-crop-card ${isSelected ? 'selected' : ''}`} onClick={() => onSelect(crop)}>
            <img src={crop.image} alt={crop.cropName} className="mp-crop-card-image" />
            <div className="mp-crop-card-info">
                <h4 className="mp-crop-card-name">{crop.cropName}</h4>
                <p className="mp-crop-card-variety">{crop.variety}</p>
                <div className="mp-crop-card-price-details">
                    <p className="mp-crop-card-price">₹{crop.currentPrice.toFixed(2)}<span className="mp-crop-card-unit">/{crop.unit}</span></p>
                    <p className={`mp-crop-card-change ${priceChangeClass}`}>
                        {arrow} {Math.abs(crop.priceChangePercent).toFixed(1)}%
                    </p>
                </div>
            </div>
        </div>
    );
};

const PriceTrendGraph = ({ selectedCrop }) => {
    if (!selectedCrop || !selectedCrop.priceHistory || selectedCrop.priceHistory.length === 0) {
        return <div className="mp-price-trend-placeholder"><p>Select a crop to see its 7-day price trend.</p></div>;
    }
    const history = selectedCrop.priceHistory;
    const prices = history.map(h => h.price);
    const maxPriceValue = Math.max(...prices);
    const minPriceValue = Math.min(...prices);
    const graphMinY = Math.max(0, minPriceValue - (maxPriceValue - minPriceValue) * 0.1); 
    const graphMaxY = maxPriceValue + (maxPriceValue - minPriceValue) * 0.1; 

    const getDayLabel = (dateString) => new Date(dateString).toLocaleDateString(undefined, { weekday: 'short' });

    return (
        <div className="mp-price-trend-graph-section">
            <h3 className="mp-section-title">Price Trend: {selectedCrop.cropName} ({selectedCrop.variety})</h3>
            <p className="mp-graph-market-info">Last 7 days in {selectedCrop.marketName}</p>
            <div className="mp-graph-area">
                <div className="mp-graph-y-axis">
                    <span>₹{graphMaxY.toFixed(0)}</span>
                    <span>₹{((graphMaxY + graphMinY) / 2).toFixed(0)}</span>
                    <span>₹{graphMinY.toFixed(0)}</span>
                </div>
                <div className="mp-graph-bars-container">
                    {history.map((day, index) => {
                        const range = graphMaxY - graphMinY;
                        const barHeightPercent = range > 0 ? ((day.price - graphMinY) / range) * 100 : 0;
                        return (
                            <div key={index} className="mp-graph-bar-item">
                                <div className="mp-graph-bar" style={{ height: `${Math.max(0, Math.min(100,barHeightPercent))}%` }} title={`₹${day.price.toFixed(2)}`}>
                                    <span className="mp-bar-value-tooltip">₹{day.price.toFixed(0)}</span>
                                </div>
                                <div className="mp-graph-day-label">{getDayLabel(day.date)}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


const MarketPricesPage = () => {
    const [allMarkets, setAllMarkets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMarket, setSelectedMarket] = useState(null);
    const [selectedCropForGraph, setSelectedCropForGraph] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMarketData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Ensure backend is running on port 5000 or update this URL
                const response = await fetch('http://localhost:5000/api/market-data/ap-markets'); // Updated path based on server.js change
                if (!response.ok) {
                    const errorData = await response.text(); // Try to get more error info
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
                }
                const data = await response.json();
                setAllMarkets(data);
                if (data && data.length > 0) {
                    setSelectedMarket(data[0]); 
                    if (data[0].crops && data[0].crops.length > 0) {
                        setSelectedCropForGraph(data[0].crops[0]);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch market data:", e);
                setError(`Failed to load market data: ${e.message}. Please try again later.`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMarketData();
    }, []);

    const filteredMarkets = useMemo(() => {
        if (!searchTerm.trim()) return allMarkets;
        const lowerSearch = searchTerm.toLowerCase();
        return allMarkets.filter(market =>
            market.name.toLowerCase().includes(lowerSearch) ||
            market.town.toLowerCase().includes(lowerSearch) ||
            market.district.toLowerCase().includes(lowerSearch)
        );
    }, [allMarkets, searchTerm]);

    const handleMarketSelect = (market) => {
        setSelectedMarket(market);
        if (market.crops && market.crops.length > 0) {
            setSelectedCropForGraph(market.crops[0]); 
        } else {
            setSelectedCropForGraph(null);
        }
    };

    const handleCropSelectForGraph = (crop) => {
        setSelectedCropForGraph(crop);
    };

    if (isLoading) {
        return <div className="mp-loading-state">Loading market data... Please wait.</div>;
    }
    if (error) {
        return <div className="mp-error-state">Error: {error}</div>;
    }

    return (
        <>
       <NavBar/>
        <div className="mp-page-container">
            
            <aside className="mp-sidebar">
                <div className="mp-sidebar-header">
                    <span className="mp-app-logo">🌿</span>
                    <h2>AP Market Prices</h2>
                </div>
                <div className="mp-market-selector-area">
                    <div className="mp-search-bar-wrapper">
                        <SearchIcon />
                        <input
                            type="text"
                            className="mp-search-input"
                            placeholder="Search market by name or town..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="mp-market-list">
                        {filteredMarkets.length > 0 ? filteredMarkets.map(market => (
                            <button
                                key={market.id}
                                className={`mp-market-list-item ${selectedMarket?.id === market.id ? 'selected' : ''}`}
                                onClick={() => handleMarketSelect(market)}
                            >
                                <h4>{market.name}</h4>
                                <p>{market.town}, {market.district}</p>
                            </button>
                        )) : <p className="mp-no-results">No markets found matching "{searchTerm}".</p>}
                    </div>
                </div>
                <footer className="mp-sidebar-footer">
                    <p>AgriData © {new Date().getFullYear()}</p>
                </footer>
            </aside>

            <main className="mp-main-content">
                {!selectedMarket && allMarkets.length > 0 && ( // Show only if markets loaded but none selected
                    <div className="mp-welcome-message">
                        <h2>Welcome!</h2>
                        <p>Select a market from the left to view detailed crop prices and trends.</p>
                    </div>
                )}
                {!selectedMarket && allMarkets.length === 0 && !isLoading && !error && (
                     <div className="mp-welcome-message">
                        <h2>No Market Data Available</h2>
                        <p>Could not load any market data at this time.</p>
                    </div>
                )}
                {selectedMarket && (
                    <div className="mp-market-details-view">
                        <header className="mp-selected-market-info">
                            <h1>{selectedMarket.name}</h1>
                            <p className="mp-market-address"><LocationIcon /> {selectedMarket.address}</p>
                            <div className="mp-market-meta">
                                <span><ClockIcon /> {selectedMarket.timings}</span>
                            </div>
                        </header>

                        <section className="mp-crops-display-section">
                            <h2 className="mp-section-title">Crop Prices in Market</h2>
                            {selectedMarket.crops && selectedMarket.crops.length > 0 ? (
                                <div className="mp-crop-scroller">
                                    {selectedMarket.crops.map(crop => (
                                        <CropCard
                                            key={crop.id}
                                            crop={crop}
                                            onSelect={handleCropSelectForGraph}
                                            isSelected={selectedCropForGraph?.id === crop.id}
                                        />
                                    ))}
                                </div>
                            ) : <p className="mp-no-results">No crop data available for this market.</p>}
                        </section>

                        {selectedCropForGraph && <PriceTrendGraph selectedCrop={selectedCropForGraph} />}
                        {!selectedCropForGraph && selectedMarket.crops && selectedMarket.crops.length > 0 && (
                            <div className="mp-price-trend-placeholder"><p>Select a crop above to see its price trend.</p></div>
                        )}


                        <section className="mp-farmer-tips-section">
                            <h2 className="mp-section-title">Farmer's Corner</h2>
                            <div className="mp-tips-grid">
                                <div className="mp-tip-card"><h4>🌱 Soil Health</h4><p>Regular soil testing can significantly improve yield. Consider organic manures.</p></div>
                                <div className="mp-tip-card"><h4>💧 Water Management</h4><p>Explore drip irrigation or sprinklers for efficient water use, especially for cash crops.</p></div>
                                <div className="mp-tip-card"><h4>☀️ Weather Advisory</h4><p>Stay updated with local weather forecasts to plan irrigation and harvesting.</p></div>
                                <div className="mp-tip-card"><h4>💰 Market Links</h4><p>Connect with local traders or FPOs for better price realization.</p></div>
                            </div>
                        </section>
                    </div>
                )}
            </main>
        </div>
        </>
    );
};

export default MarketPricesPage;