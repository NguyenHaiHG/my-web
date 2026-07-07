const mongoose = require('mongoose')

const NatureMemoryEntrySchema = new mongoose.Schema({
    clientId: { type: String, index: true, sparse: true },
    name: { type: String, required: true, trim: true },
    scientificName: { type: String, default: '', trim: true },
    category: { type: String, default: 'other', trim: true },
    notes: { type: String, default: '' },
    location: { type: String, default: '' },
    weather: { type: String, default: '' },
    season: { type: String, default: '' },
    mood: { type: String, default: '' },
    img: { type: String, default: '' },
    time: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true })

NatureMemoryEntrySchema.index({ clientId: 1 }, { unique: true, sparse: true })

module.exports = mongoose.model('NatureMemoryEntry', NatureMemoryEntrySchema)
