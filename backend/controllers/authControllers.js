// backend/controllers/authControllers.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const mongoose = require("mongoose");
 // Ensure this path is correct


 
// --- SIGNUP ---
const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Basic Validation (can be enhanced)
    if (!name || name.trim().length < 3) {
      return res.status(400).json({ success: false, message: "Name must be at least 3 characters long" });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name.trim(), // Trim whitespace
      email,
      password: hashedPassword
      // avatar: `https://api.dicebear.com/6.x/initials/svg?seed=${name.trim()}` // Example: default avatar
    });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h" // Or your preferred expiration
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: { // Send back user details
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar // Will be null or default if set above
      }
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ success: false, message: "Internal server error during signup" });
  }
};

// --- SIGNIN ---
const signin = async (req, res) => {
  const { email, password } = req.body;
 
  try {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" }); // Generic message
    }

    // If user was created via Google and has no password (common pattern)
    if (!user.password && user.googleId) {
        return res.status(401).json({ success: false, message: "Please sign in using Google."});
    }
    if (!user.password) { // Should not happen if not Google user, but defensive check
        return res.status(401).json({ success: false, message: "Account error. Please contact support."})
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" }); // Generic message
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h" // Or your preferred expiration
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { // Send back user details
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error("Signin Error:", error);
    res.status(500).json({ success: false, message: "Internal server error during signin" });
  }
};


// --- FORGOT PASSWORD ---
const forgotPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Basic Validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters long" });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found with this email" });
    }

    // If user signed up with Google and doesn't have a password, they can't use this flow
    if (!user.password && user.googleId) {
        return res.status(400).json({ success: false, message: "This account uses Google Sign-In. Password reset is not applicable." });
    }


    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Security Note: This flow directly resets the password without email verification.
    // A more secure approach involves sending a unique, time-limited reset token to the user's email.
    // The user then clicks a link with this token to a page where they can set a new password.

    res.status(200).json({ success: true, message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ success: false, message: "Server error during password reset" });
  }
};

// --- GET USER (for fetching profile details) ---
const getUser = async (req, res) => {
  // This should ideally be protected, e.g., only the logged-in user can fetch their own details
  // or an admin role. For now, assuming ID is passed.
  // A better approach for "get my profile" would be to use the JWT to identify the user.
  // const userIdFromToken = req.user.userId; // If using JWT middleware to populate req.user

  const userId = req.params.id; 
  try {
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID format" });
    }
    const user = await User.findById(userId).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ 
        success: true, 
        user: { // Ensure consistent user object structure
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
            // include other non-sensitive fields if needed
        }
    });
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { signup, signin, getUser, forgotPassword };