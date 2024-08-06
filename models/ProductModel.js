const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative.'] // Xác thực không âm
    },
    image: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('Product', productSchema);
