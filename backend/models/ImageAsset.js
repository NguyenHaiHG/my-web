const mongoose = require('mongoose')

const ImageAssetSchema = new mongoose.Schema({
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
    filename: { type: String, default: 'image' },
    size: { type: Number, required: true },
}, { timestamps: true })

module.exports = mongoose.model('ImageAsset', ImageAssetSchema)
