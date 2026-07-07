const mongoose = require('mongoose')

const penpalLetterSchema = new mongoose.Schema({
    toPenpalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Penpal', required: true },
    fromName: { type: String, required: true },
    fromCountry: { type: String },
    fromEmail: { type: String, required: true },
    message: { type: String, required: true },
    photo: { type: String }, // base64 or URL — ảnh đính kèm trong thư
    isRead: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('PenpalLetter', penpalLetterSchema)
