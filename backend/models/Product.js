const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
    // Using the fields from your JSON data
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, required: true },
    rating: { type: Number, required: true },
    image: { type: String, required: true },
    stock: { type: Number, default: 100 }
});
module.exports = mongoose.model('Product', ProductSchema);