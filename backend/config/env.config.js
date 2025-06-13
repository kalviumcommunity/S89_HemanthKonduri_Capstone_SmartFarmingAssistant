// server/config/env.config.js
const dotenv = require('dotenv');
dotenv.config(); // Load .env file

const config = {
    port: process.env.PORT || 5000,
    pexelsApiKey: process.env.PEXELS_API_KEY,
    mongodbUri: process.env.MONGODB_URI,
    sessionSecret: process.env.SESSION_SECRET,
    geminiApiKey: process.env.GEMINI_API_KEY,
    nodeEnv: process.env.NODE_ENV || 'development',
    clientURL: process.env.CLIENT_URL || 'http://localhost:5173', // Add your client URLs
    clientURLs: (process.env.CLIENT_URLS || 'http://localhost:5173,http://localhost:5174,http://localhost:5175').split(','),
};

// Basic validation for critical variables
if (!config.mongodbUri) {
    console.error("FATAL ERROR: MONGODB_URI is not defined in .env file.");
    process.exit(1);
}
if (!config.sessionSecret) {
    console.error("FATAL ERROR: SESSION_SECRET is not defined in .env file.");
    process.exit(1);
}
if (!config.geminiApiKey) {
    console.error("FATAL ERROR: GEMINI_API_KEY is not defined in .env file.");
    // Consider if the app can run without Gemini, or exit: process.exit(1);
}
if (config.geminiApiKey && config.geminiApiKey.startsWith("YOUR_")) {
    console.warn("WARNING: GEMINI_API_KEY seems to be a placeholder.");
}

module.exports = config;