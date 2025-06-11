const express = require('express');
// Correct the path if apMarketDataGenerator is in 'utils' not 'controllers'
const { generateAPMarketData } = require('../controllers/apMarketDataGenerator'); // Corrected path
const router = express.Router();

let marketDataCache = null;

router.get('/ap-markets', (req, res) => {
    if (!marketDataCache) {
        console.log("Generating new market data cache for AP Markets...");
        try {
            marketDataCache = generateAPMarketData();
        } catch (error) {
            console.error("Error generating AP Market Data:", error);
            return res.status(500).json({ message: "Failed to generate market data." });
        }
    }
    res.json(marketDataCache);
});

module.exports = router;