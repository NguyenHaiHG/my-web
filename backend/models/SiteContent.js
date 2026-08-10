const mongoose = require('mongoose')

const SiteContentSchema = new mongoose.Schema({
    page: { type: String, required: true, trim: true, lowercase: true },
    section: { type: String, required: true, trim: true, lowercase: true },
    content: { type: mongoose.Schema.Types.Mixed, required: true, default: {} },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

SiteContentSchema.index({ page: 1, section: 1 }, { unique: true })

module.exports = mongoose.model('SiteContent', SiteContentSchema)
