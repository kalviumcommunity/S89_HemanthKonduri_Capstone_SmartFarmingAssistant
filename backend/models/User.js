const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
 
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: function () {
      // Name is required for both normal and Google users
      return true;
    },
  },
  password: {
    type: String,
    // Required only for non-Google users
    required: function () {
      return !this.googleId;
    },
  },
  
  googleId: {
    type: String,
    default: null,
  },
  avatar: {
    type: String, // Google profile picture or default
    default: null,
  },
 
}, {
  timestamps: true,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
