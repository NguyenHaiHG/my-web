const mongoose = require('mongoose')

const EcoScanSchema = new mongoose.Schema({
    userKey: { type: String, required: true, index: true },
    siteCode: { type: String, required: true, index: true },
    earnedPoints: { type: Number, default: 0 },
    badgeId: { type: String, default: '' },
    scannedAt: { type: Date, default: Date.now },
}, { timestamps: true })

EcoScanSchema.index({ userKey: 1, siteCode: 1 }, { unique: true })

module.exports = mongoose.model('EcoScan', EcoScanSchema)
