const mongoose = require('mongoose')

const NatureMemoryImageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    caption: { type: String, default: '' },
    category: { type: String, default: 'other' },
    createdAt: { type: Date, default: Date.now },
    uploadedBy: { type: String },
})

module.exports = mongoose.model('NatureMemoryImage', NatureMemoryImageSchema)
