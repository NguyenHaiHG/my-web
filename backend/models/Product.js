const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: String,
    price: String,
    img: String,
    tag: { type: String, default: 'product' },
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)
