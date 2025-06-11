const Product = require('../models/productModel.js');

const getProducts = async (req, res) => {
    // Match frontend query parameters: limit, page, q (search), category
    const pageSize = Number(req.query.limit) || 12; // Use 'limit' from query, default to 12
    const page = Number(req.query.page) || 1;
    const keyword = req.query.q // Use 'q' for search term
        ? { name: { $regex: req.query.q, $options: 'i' } }
        : {};
    const categoryFilter = req.query.category && req.query.category.toLowerCase() !== 'all'
        ? { category: req.query.category }
        : {};

    try {
        const count = await Product.countDocuments({ ...keyword, ...categoryFilter });
        const products = await Product.find({ ...keyword, ...categoryFilter })
            .limit(pageSize)
            .skip(pageSize * (page - 1));
        
        // Respond with the exact structure the new frontend expects
        res.json({ 
            products: products, 
            currentPage: page, 
            totalPages: Math.ceil(count / pageSize) 
        });
    } catch (error) {
        console.error("Error in getProducts:", error);
        res.status(500).json({ message: 'Server Error while fetching products.' });
    }
};

const getCategories = async (req, res) => {
    try {
        // The new frontend adds "All" itself, so we just send the raw categories
        const categories = await Product.find().distinct('category');
        res.json(categories);
    } catch (error) {
        console.error("Error in getCategories:", error);
        res.status(500).json({ message: 'Server Error while fetching categories.' });
    }
};

module.exports = { getProducts, getCategories };