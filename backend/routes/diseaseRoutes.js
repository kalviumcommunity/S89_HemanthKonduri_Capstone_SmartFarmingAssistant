const express = require('express');
const { getDiseaseDetails } = require('../controllers/diseaseController.js');
const router = express.Router();

// A simple POST route to get details for a detected disease
router.post('/details', getDiseaseDetails);

module.exports = router;