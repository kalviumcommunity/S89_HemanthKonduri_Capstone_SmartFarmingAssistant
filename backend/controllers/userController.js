const User = require('../models/userModel.js');

const getWalletBalance = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({ walletBalance: user.walletBalance });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { getWalletBalance };