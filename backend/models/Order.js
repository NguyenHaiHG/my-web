const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    orderType: { type: String, enum: ['cart', 'taobao', 'tour', 'stay', 'bus', 'other'], default: 'cart' },
    name: String,
    phone: String,
    email: String,
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
    details: mongoose.Schema.Types.Mixed,
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Order', OrderSchema)
