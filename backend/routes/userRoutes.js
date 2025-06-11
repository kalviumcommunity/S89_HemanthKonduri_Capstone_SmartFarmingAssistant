const express = require('express');
const router = express.Router();
const { getWalletBalance } = require('../controllers/userController.js');
const { protect } = require('../middlewares/authMiddleware.js');

// Assuming you have login routes defined elsewhere. This sets up the protected wallet route.
router.route('/wallet').get(protect, getWalletBalance);

module.exports = router;