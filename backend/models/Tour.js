const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: String,
    price: String,
    img: String,
    tag: { type: String, default: 'tour' },
    duration: String,
    maxGuests: Number,
    rating: Number,
    reviews: Number,
    category: String,
    departureFrom: String,
    location: String,
    includes: [String],
}, { timestamps: true })

module.exports = mongoose.model('Tour', tourSchema)
