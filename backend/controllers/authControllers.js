// backend/controllers/authControllers.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const mongoose = require("mongoose");

// Helper to create a user object for responses
const formatUserResponse = (user) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  };
};

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // ... (validation remains the same)
    if (!name || !email || !password || password.length < 6) {
        return res.status(400).json({ success: false, message: "Please provide valid name, email, and password (min 6 chars)." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User with this email already exists." });
    }

    // No need to hash password here, the userModel pre-save hook does it
    const newUser = new User({ name, email, password });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: formatUserResponse(newUser), // <-- Send back consistent user object
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        // Handle case where user registered with Google and has no password
        if (!user.password) {
            return res.status(401).json({ success: false, message: "This account uses Google Sign-In. Please sign in with Google." });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: formatUserResponse(user), // <-- Send back consistent user object
        });
    } catch (error) {
        console.error("Signin Error:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// ... forgotPassword and getUser can remain as they were in your original file

const forgotPassword = async (req, res) => {
    // ... your logic here ...
    // Make sure to return { success: true, ... } on success
};

const getUser = async (req, res) => {
    // ... your logic here ...
};


module.exports = { signup, signin, getUser, forgotPassword };