const mongoose = require('mongoose')

const penpalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number },
    country: { type: String, required: true },
    city: { type: String },
    languages: [{ type: String }],
    interests: [{ type: String }],
    bio: { type: String },
    photo: { type: String }, // base64 or URL
    contactEmail: { type: String, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Penpal', penpalSchema)
