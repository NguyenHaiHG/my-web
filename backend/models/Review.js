const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    country: String,
    rating: { type: Number, min: 1, max: 5, default: 5 },
    content: { type: String, required: true },
    img: String,
    email: String,
    approved: { type: Boolean, default: false },
    program: String,
}, { timestamps: true })

module.exports = mongoose.model('Review', reviewSchema)
