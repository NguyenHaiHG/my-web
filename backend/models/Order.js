const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    name: String,
    phone: String,
    address: String,
    note: String,
    location: String,
    pickup: Boolean,
    items: [
        {
            id: mongoose.Schema.Types.Mixed,
            title: String,
            price: String,
            qty: Number,
            img: String
        }
    ],
    isTest: { type: Boolean, default: false },
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Order', OrderSchema)
