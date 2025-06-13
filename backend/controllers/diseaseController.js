const { createClient } = require('pexels');
// const Product = require('../models/Product.js'); // REMOVED - No longer needed

// --- SELF-CONTAINED PRODUCT RECOMMENDATIONS ---
// This object replaces the need for a database for this feature.
const recommendedProductsStore = {
    'Fungal': [
        {
            _id: 'prod_fung_01',
            name: "Bio-Fungicide (Neem-Based)",
            imageUrl: "https://i.imgur.com/2cZ2eB3.jpeg" // A generic bio-fungicide image
        },
        {
            _id: 'prod_fung_02',
            name: "Sulphur Dust",
            imageUrl: "https://i.imgur.com/uRkuL7x.jpeg" // A generic pesticide/fungicide image
        },
        {
            _id: 'prod_fung_03',
            name: "Organic Fungus Control Spray",
            imageUrl: "https://i.imgur.com/bW3g4Xg.jpeg" // A generic spray bottle image
        }
    ],
    'Bacterial': [
        {
            _id: 'prod_bact_01',
            name: "Copper-Based Bactericide",
            imageUrl: "https://i.imgur.com/bW3g4Xg.jpeg"
        },
        {
            _id: 'prod_bact_02',
            name: "Organic Disease Control",
            imageUrl: "https://i.imgur.com/2cZ2eB3.jpeg"
        }
    ],
    'Viral': [
        {
            _id: 'prod_viral_01',
            name: "Insecticidal Soap for Pests",
            imageUrl: "https://i.imgur.com/uRkuL7x.jpeg"
        },
        {
            _id: 'prod_viral_02',
            name: "Aphid & Mite Control Spray",
            imageUrl: "https://i.imgur.com/bW3g4Xg.jpeg"
        }
    ]
};


// @desc    Fetch disease details (images & products) based on a name
// @route   POST /api/disease/details
// @access  Public
const getDiseaseDetails = async (req, res) => {
    const { diseaseName, diseaseType } = req.body;

    if (!diseaseName || !diseaseType) {
        return res.status(400).json({ message: 'Disease name and type are required.' });
    }

    try {
        // 1. Fetch related images from Pexels (this part is unchanged and correct)
        const pexelsClient = createClient(process.env.PEXELS_API_KEY);
        const pexelsQuery = `${diseaseName} plant`;
        const pexelsResponse = await pexelsClient.photos.search({ query: pexelsQuery, per_page: 6 });
        const pexelsImages = pexelsResponse.photos.map(photo => ({
            id: photo.id,
            url: photo.src.large,
            photographer: photo.photographer
        }));

        // 2. ***FIXED: Get recommended products from our hardcoded object***
        const recommendedProducts = recommendedProductsStore[diseaseType] || [];

        // 3. Send the complete response back to the frontend
        res.json({
            success: true,
            pexelsImages,
            recommendedProducts
        });

    } catch (error) {
        // This catch block will now mostly handle errors from the Pexels API
        console.error("Error fetching disease details:", error);
        res.status(500).json({ message: 'Server error while fetching details from Pexels.' });
    }
};

module.exports = { getDiseaseDetails };