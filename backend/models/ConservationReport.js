const mongoose = require('mongoose')

const ConservationReportSchema = new mongoose.Schema({
    siteCode: { type: String, required: true, index: true },
    siteName: { type: String, required: true },
    category: { type: String, enum: ['waste', 'water', 'trail', 'biodiversity', 'other'], default: 'other' },
    severity: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    description: { type: String, required: true },
    reporter: { type: String, default: 'Community member' },
    status: { type: String, enum: ['open', 'in-progress', 'resolved'], default: 'open' },
}, { timestamps: true })

module.exports = mongoose.model('ConservationReport', ConservationReportSchema)
