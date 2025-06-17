// backend/server.js (Final, Corrected Startup Logic)

const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// --- STEP 1: DEFINE AND RUN DATA GENERATION LOGIC ON STARTUP ---
const initializeDataFiles = () => {
    console.log("INITIALIZING SERVER: Checking for data files...");
    const dataDir = path.join(__dirname, 'data');
    
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
        console.log(" -> Created 'data' directory.");
    }

    // --- Product Data Generation ---
    const productsDataPath = path.join(dataDir, 'products.json');
    if (!fs.existsSync(productsDataPath)) {
        console.log(" -> products.json not found. Generating now...");
        try {
            const generateProductData = require('./generateProductsData.js');
            generateProductData(); // Execute the function to create the file
        } catch (error) {
            console.error("FATAL: Failed to generate product data. The store will not work.", error);
        }
    } else {
        console.log(" -> products.json already exists. Skipping generation.");
    }

    // --- Crop Price Data Generation ---
    const cropPriceDataPath = path.join(dataDir, 'market_data.json');
    if (!fs.existsSync(cropPriceDataPath)) {
        console.log(" -> market_data.json not found. Generating now...");
        try {
            const { generateData } = require('./controllers/cropPriceDataGenerator.js');
            generateData();
        } catch (error) {
            console.error("FATAL: Failed to generate crop price data. The market page will not work.", error);
        }
    } else {
        console.log(" -> market_data.json already exists. Skipping generation.");
    }
    console.log("INITIALIZATION: Data file check complete.");
};

// RUN THE INITIALIZATION SCRIPT SYNCHRONOUSLY
initializeDataFiles();


// --- STEP 2: LOAD CONFIGS AND ROUTES (now that data is guaranteed to exist) ---
const config = require('./config/env.config');
const connectDB = require('./config/db.config');
require('./controllers/googleAuthControllers.js');

// Route Imports
const authRoutes = require('./routes/authRoute.js');

const cropPriceRoutes = require('./routes/cropPriceRoutes');
const diseaseRoutes = require('./routes/diseaseRoutes.js');
const chatRoutes = require('./routes/chatRoutes');
const storeRoutes = require('./routes/storeRoutes.js');

// --- Initialize Express App ---
const app = express();
connectDB();

// --- Core Middleware ---
app.use(cors({ origin: config.clientURLs, methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- Session & Auth Middleware ---
app.use(session({ secret: config.sessionSecret, resave: false, saveUninitialized: false, cookie: { secure: config.nodeEnv === 'production', httpOnly: true, sameSite: 'lax' }}));
app.use(passport.initialize());
app.use(passport.session());

// --- API Routes ---
app.get('/api/health', (req, res) => res.status(200).json({ status: 'UP' }));
app.use('/api/users', authRoutes);

app.use('/api/crop-price', cropPriceRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/store', storeRoutes)


// --- Base Route ---
app.get('/', (req, res) => res.send(`Server is running in ${config.nodeEnv} mode.`));

// --- Error Handling Middleware ---
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.status = 404;
    next(error);
});
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err.message);
    const statusCode = err.status || 500;
    res.status(statusCode).json({ success: false, message: err.message || 'An unexpected internal server error occurred.' });
});

// --- Start Server ---
app.listen(config.port, () => {
  console.log(`SERVER LISTENING on port ${config.port} in ${config.nodeEnv} mode`);
});