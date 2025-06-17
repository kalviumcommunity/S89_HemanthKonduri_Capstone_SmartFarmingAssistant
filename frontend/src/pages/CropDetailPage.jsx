import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar';
import MarketPriceCard from '../components/MarketPriceCard';
import '../styles/MarketPrices.css';
import { FaArrowLeft } from 'react-icons/fa';

const CropDetailPage = () => {
    const { cropId } = useParams();
    const [allStates, setAllStates] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [cropName, setCropName] = useState('');
    const [marketData, setMarketData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            if (!cropId) return;
            setLoading(true);
            try {
                const [trendsResponse, allCropsResponse] = await Promise.all([
                    axios.get(`/api/crop-price/trends/${cropId}`),
                    axios.get('/api/crop-price/all-crops')
                ]);
                const uniqueStates = [...new Set(trendsResponse.data.map(t => t.market.state))].sort();
                setAllStates(uniqueStates);
                const currentCrop = allCropsResponse.data.find(c => c.id === parseInt(cropId));
                if (currentCrop) setCropName(currentCrop.name);
            } catch (err) {
                setError('Could not load data for this crop.',err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [cropId]);

    useEffect(() => {
        if (!selectedState || !cropId) { setMarketData([]); return; }
        const fetchPrices = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`/api/crop-price/trends/${cropId}`);
                const stateResults = data.filter(trend => trend.market.state === selectedState);
                setMarketData(stateResults);
            } catch (err) {
                setError(`Could not fetch prices for ${selectedState}.`,err);
            } finally {
                setLoading(false);
            }
        };
        fetchPrices();
    }, [selectedState, cropId]);

    return (
        <>
            <NavBar />
            <div className="market-page-container detail-page">
                <header className="detail-header">
                    <Link to="/market-prices" className="back-link"><FaArrowLeft /> Back to Search</Link>
                    <h1>Price Trends for {cropName || '...'}</h1>
                    <div className="state-selector-container">
                        <label htmlFor="state-select">Select a State to View Prices:</label>
                        <select id="state-select" value={selectedState} onChange={(e) => setSelectedState(e.target.value)} disabled={loading || allStates.length === 0}>
                            <option value="">-- Select State --</option>
                            {allStates.map(state => <option key={state} value={state}>{state}</option>)}
                        </select>
                    </div>
                </header>
                {error && <div className="error-message">{error}</div>}
                <div className="market-price-list">
                    {loading && <div className="loader">Loading...</div>}
                    {!loading && marketData.length > 0 && marketData.map(trend => (
                        <MarketPriceCard key={trend.market.id} marketData={trend} />
                    ))}
                    {!loading && marketData.length === 0 && selectedState && (
                        <p className="no-results-message">No market data found for {cropName} in {selectedState}.</p>
                    )}
                </div>
            </div>
        </>
    );
};
export default CropDetailPage;