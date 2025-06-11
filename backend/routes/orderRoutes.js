const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders } = require('../controllers/orderController.js');
const { protect } = require('../middlewares/authMiddleware.js');

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);

module.exports = router;