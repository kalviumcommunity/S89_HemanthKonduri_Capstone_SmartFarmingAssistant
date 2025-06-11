const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    // Renamed 'image' to 'imageUrl' to match the new frontend code
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    // Storing discount as a decimal (e.g., 0.1 for 10%) as implied by frontend logic
    discount: { type: Number, required: true, default: 0 }, 
    rating: { type: Number, required: true, default: 0 },
    // Renamed 'countInStock' to 'stock'
    stock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

// Using the robust singleton pattern
module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);