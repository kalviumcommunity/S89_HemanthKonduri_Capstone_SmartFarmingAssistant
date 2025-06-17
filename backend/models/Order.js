const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    userId: { type: String, required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String, image: String, price: Number, quantity: Number,
    }],
    deliveryAddress: { type: Object, required: true },
    priceDetails: { type: Object, required: true },
    paymentMethod: { type: String, required: true },
    status: { type: String, default: 'Processing' },
    orderDate: { type: Date, default: Date.now },
    estimatedDelivery: { type: Date },
});
module.exports = mongoose.model('Order', OrderSchema);