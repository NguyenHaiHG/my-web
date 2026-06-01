const mongoose = require('mongoose')

const EcoStoreVisitSchema = new mongoose.Schema({
    userKey: { type: String, required: true, index: true },
    storeCode: { type: String, required: true, index: true },
    visitDateKey: { type: String, required: true, index: true },
    spendAmount: { type: Number, default: 0 },
    earnedPoints: { type: Number, default: 0 },
    stampId: { type: String, default: '' },
    notes: { type: String, default: '' },
    visitedAt: { type: Date, default: Date.now },
}, { timestamps: true })

EcoStoreVisitSchema.index({ userKey: 1, storeCode: 1, visitDateKey: 1 }, { unique: true })

module.exports = mongoose.model('EcoStoreVisit', EcoStoreVisitSchema)
