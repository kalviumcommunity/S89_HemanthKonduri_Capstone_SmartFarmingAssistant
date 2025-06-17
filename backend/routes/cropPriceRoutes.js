// backend/routes/cropPriceRoutes.js
const express = require('express');

// CORRECTED PATH: Make sure this points to where you saved the file.
// Since you put it in 'controllers', this path is now correct.
const { getData } = require('../controllers/cropPriceDataGenerator'); 
const router = express.Router();

// Helper to find the latest price for a crop in a market
const getLatestPrice = (cropId, marketId, allPrices) => {
    return allPrices
        .filter(p => p.cropId === cropId && p.marketId === marketId)
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0]; // Most recent
};

// Endpoint 1: Get all unique crops for the initial grid view
// Let's make this one safer too.
router.get('/all-crops', (req, res) => {
    try {
        const { allCrops } = getData();
        if (!allCrops || allCrops.length === 0) {
            console.error("[/all-crops] Data not generated or empty.");
            return res.status(500).json({ error: "Crop data is not available on the server." });
        }
        res.json(allCrops);
    } catch (error) {
        console.error("[/all-crops] Error fetching all crops:", error);
        res.status(500).json({ error: "An unexpected error occurred." });
    }
});

// Endpoint 2: Get price TRENDS for a specific crop (already safe)
router.get('/trends/:cropId', (req, res) => {
    const { cropId } = req.params;
    const { allMarkets, allPrices } = getData();
    const trendData = allMarkets.map(market => {
        const history = allPrices
            .filter(p => p.cropId == cropId && p.marketId == market.id)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        return { market, history };
    }).filter(m => m.history.length > 0);
    res.json(trendData);
});

// Endpoint 3: SEARCH for a crop's CURRENT price
// THIS IS THE MOST IMPORTANT UPDATE - NOW WITH ERROR HANDLING AND LOGGING
router.get('/search', (req, res) => {
    try {
        const { cropName, state } = req.query;
        console.log(`[SEARCH] Received request for crop: "${cropName}", state: "${state}"`);

        if (!cropName || !state) {
            return res.status(400).json({ error: 'Crop name and state are required.' });
        }

        const { allCrops, allMarkets, allPrices } = getData();

        const targetCrop = allCrops.find(c => c.name.toLowerCase() === cropName.toLowerCase());
        
        if (!targetCrop) {
            console.warn(`[SEARCH] Crop not found in our database: "${cropName}"`);
            return res.status(404).json({ error: `Crop '${cropName}' not found.` });
        }
        
        console.log(`[SEARCH] Found target crop object:`, targetCrop);

        const results = allMarkets
            .filter(m => m.state === state)
            .map(market => {
                const latestPrice = getLatestPrice(targetCrop.id, market.id, allPrices);
                return { market, priceDetails: latestPrice };
            })
            .filter(r => r.priceDetails); // Ensure there's a price

        console.log(`[SEARCH] Found ${results.length} market results for "${cropName}" in "${state}".`);
        res.json({ crop: targetCrop, results });

    } catch (error) {
        // This will catch any unexpected crash and prevent the server from stopping.
        console.error("[SEARCH] An unexpected error occurred in the search endpoint:", error);
        res.status(500).json({ error: "An unexpected error occurred on the server while searching." });
    }
});

module.exports = router;