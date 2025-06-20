// backend/server.js

const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

// Load configurations
const config = require('./config/env.config');
const connectDB = require('./config/db.config');

require('./controllers/googleAuthControllers.js');

// --- Your Route Imports ---
const chatRoutes = require('./routes/chatRoutes');
const diseaseRoutes = require('./routes/diseaseRoutes.js');

const authRoutes = require('./routes/authRoute.js');


// --- Data Generator and Module Imports ---

// THIS IS THE MOST IMPORTANT PART FOR THIS FILE.
// It correctly points to the 'controllers' folder and pulls 'generateData' from the exported object.




const app = express();

// --- Initialize Database and Generate Mock Data ---
connectDB();


app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin && config.nodeEnv !== 'production') {
        return callback(null, true);
      }
      if (Array.isArray(config.clientURLs) && config.clientURLs.includes(origin)) {
        callback(null, true);
      } else if (!origin) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Standard Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session setup
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

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// --- MOUNT YOUR ROUTES ---
app.use('/api/users', authRoutes);
app.use('/api/disease', diseaseRoutes);
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});
app.get('/api/categories', (req, res) => {
  try {
    res.json(dataModule.categoriesFromData);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching categories" });
  }
});

app.use('/api/chat', chatRoutes);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/', (req, res) => {
  res.send(`Server is running in ${config.nodeEnv} mode.`);
});

// Not Found and Global Error Handlers (Unchanged)
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.status = 404;
    next(error);
});
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err.message);
    if (config.nodeEnv === 'development') {
        console.error(err.stack);
    }
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `File upload error: ${err.message}` });
    }
    if (err.message === 'Not an image! Please upload an image file.') {
        return res.status(400).json({ error: err.message });
    }
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        error: err.message || 'An unexpected internal server error occurred.',
    });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
  if (!config.geminiApiKey || config.geminiApiKey.startsWith("YOUR_")) {
    console.warn(
      "\n***********************************************************************\n" +
      "WARNING: GEMINI_API_KEY is not set correctly or is a placeholder.\n" +
      "AI features might not work as expected.\n" +
      "***********************************************************************\n"
    );
  }
});