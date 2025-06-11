const express = require('express');
const router = express.Router();
const { getProducts, getCategories } = require('../controllers/productController.js');

router.route('/').get(getProducts);
router.route('/categories').get(getCategories);

module.exports = router;