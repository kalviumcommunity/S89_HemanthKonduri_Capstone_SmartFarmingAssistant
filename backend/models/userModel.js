const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  // --- Fields from your Google Auth model ---
  googleId: {
    type: String,
    default: null,
  },
  avatar: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    
    required: function () {
      return !this.googleId;
    },
  },
  walletBalance: {
    type: Number,
    required: true,
    default: 5000.00,
  },
}, { 
  timestamps: true 
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function(next) {
   
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);