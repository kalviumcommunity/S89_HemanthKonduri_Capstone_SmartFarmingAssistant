const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    phone: { type: String, required: true },
});

const StoreUserSchema = new mongoose.Schema({
    // This links to your main application's user ID from AuthContext
    // This could be a mongoose.Schema.Types.ObjectId if you store your main users in Mongo
    authUserId: {
        type: String,
        required: true,
        unique: true,
    },
    addresses: [AddressSchema],
    hasPlacedFirstOrder: {
        type: Boolean,
        default: false,
    },
});

// This is the most important line. It exports the compiled model.
module.exports = mongoose.model('StoreUser', StoreUserSchema);