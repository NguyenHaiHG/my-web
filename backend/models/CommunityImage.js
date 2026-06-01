const mongoose = require('mongoose')

const CommunityImageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    caption: { type: String },
    createdAt: { type: Date, default: Date.now },
    uploadedBy: { type: String }, // admin email or id
})

module.exports = mongoose.model('CommunityImage', CommunityImageSchema)
