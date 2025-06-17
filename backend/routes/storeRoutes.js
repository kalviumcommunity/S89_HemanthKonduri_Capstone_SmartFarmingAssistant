const express = require('express');
const router = express.Router();
const { getProducts, getProductById, getUserData, addAddress, placeOrder } = require('../controllers/storeController');

router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.get('/data', getUserData); // Gets user and order data
router.post('/address', addAddress);
router.post('/order', placeOrder);

module.exports = router;