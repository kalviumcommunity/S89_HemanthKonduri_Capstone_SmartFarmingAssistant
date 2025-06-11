// server/config/db.config.js
const mongoose = require('mongoose');
const { mongodbUri } = require('./env.config');

const connectDB = async () => {
    try {
        await mongoose.connect(mongodbUri);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;