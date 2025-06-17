const Product = require('../models/Product');
const StoreUserModel = require('../models/StoreUser'); // Using the correct model name
const Order = require('../models/Order');

// A hardcoded ID for our dummy user, taken from your .env file
const DUMMY_USER_ID = process.env.USER_ID;

// --- PRODUCT LOGIC ---
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (err) { res.status(500).send('Server Error'); }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ msg: 'Product not found' });
        res.json(product);
    } catch (err) { res.status(500).send('Server Error'); }
};

// --- USER & ORDER LOGIC ---
// We use a single endpoint to get all user-related data
exports.getUserData = async (req, res) => {
    try {
        // We now use the hardcoded ID instead of one from the request
        const user = await StoreUserModel.findOne({ authUserId: DUMMY_USER_ID });
        const orders = await Order.find({ userId: DUMMY_USER_ID }).sort({ orderDate: -1 });
        
        if (!user) {
            console.warn(`Warning: StoreUser with authUserId '${DUMMY_USER_ID}' not found in the database.`);
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json({ user, orders });
    } catch (err) { res.status(500).send('Server Error'); }
};

exports.addAddress = async (req, res) => {
    try {
        const user = await StoreUserModel.findOne({ authUserId: DUMMY_USER_ID });
        user.addresses.push(req.body);
        await user.save();
        res.status(201).json(user.addresses);
    } catch (err) { res.status(500).send('Server Error'); }
};

exports.placeOrder = async (req, res) => {
    const { items, deliveryAddress, priceDetails, paymentMethod } = req.body;
    try {
        const newOrder = new Order({
            orderId: `SAPRA-${Date.now()}`,
            userId: DUMMY_USER_ID, // Using hardcoded ID
            items,
            deliveryAddress,
            priceDetails,
            paymentMethod,
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        await newOrder.save();
        await StoreUserModel.findOneAndUpdate({ authUserId: DUMMY_USER_ID }, { hasPlacedFirstOrder: true });
        res.status(201).json(newOrder);
    } catch (err) { res.status(500).send('Server Error'); }
};