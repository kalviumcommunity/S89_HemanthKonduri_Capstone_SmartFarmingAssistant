const Order = require('../models/orderModel.js');
const User = require('../models/userModel.js');

const addOrderItems = async (req, res) => {
  const { orderItems, paymentMethod, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  const user = await User.findById(req.user._id);

  if (paymentMethod === 'Sapra Wallet') {
    if (user.walletBalance < totalPrice) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }
    user.walletBalance -= totalPrice;
    await user.save();
  }

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  const order = new Order({
    orderItems: orderItems.map(item => ({ ...item, product: item._id })),
    user: req.user._id,
    paymentMethod,
    totalPrice,
    isPaid: paymentMethod !== 'Cash on Delivery',
    paidAt: paymentMethod !== 'Cash on Delivery' ? Date.now() : null,
    estimatedDelivery,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
};

const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
};

module.exports = { addOrderItems, getMyOrders };