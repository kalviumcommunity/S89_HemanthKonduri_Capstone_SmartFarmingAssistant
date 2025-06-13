// backend/server.js

const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const multer = require('multer');


const config = require('./config/env.config');
const connectDB = require('./config/db.config');
require('./controllers/googleAuthControllers.js'); // Initializes Google Passport strategy

// --- Route Imports ---
const authRoutes = require('./routes/authRoute.js');
const chatRoutes = require('./routes/chatRoutes');
const diseaseRoutes = require('./routes/diseaseRoutes.js');

const app = express();

// --- Initialize Database ---
connectDB();

// --- Core Middleware ---
app.use(
  cors({
    origin: config.clientURLs, // Use the array from config for flexibility
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Session & Authentication Middleware ---
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.nodeEnv === 'production',
      httpOnly: true,
      sameSite: 'lax'
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());


// --- API Routes ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

app.use('/api/users', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/disease', diseaseRoutes);


// --- Base Route ---
app.get('/', (req, res) => {
  res.send(`Server is running in ${config.nodeEnv} mode.`);
});


// --- Error Handling Middleware (Keep at the end) ---
// 404 Not Found Handler
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.status = 404;
    next(error);
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err.message);
    if (config.nodeEnv === 'development') {
        console.error(err.stack);
    }
    
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ success: false, message: `File upload error: ${err.message}` });
    }

    const statusCode = err.status || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'An unexpected internal server error occurred.',
    });
});


// --- Start Server ---
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
});