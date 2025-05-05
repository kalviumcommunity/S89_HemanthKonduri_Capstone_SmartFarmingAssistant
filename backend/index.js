const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const router = require("./routes/authRoute");
const cors = require("cors");
 // <-- Added this for Gemini API

dotenv.config();

const app = express();

// CORS setup
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5175', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Database connected"))
  .catch((error) => console.log("Database connection error: ", error));

// User routes
app.use("/api/users", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
