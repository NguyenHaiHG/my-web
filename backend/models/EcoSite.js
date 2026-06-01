const mongoose = require('mongoose')

const EcoSiteSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['village', 'farm', 'eco-zone', 'cultural-site'], required: true },
    district: { type: String, default: 'Ha Giang' },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    story: {
        title: { type: String, required: true },
        content: { type: String, required: true },
        audioUrl: { type: String, default: '' },
        language: { type: String, default: 'vi' },
    },
    badge: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        icon: { type: String, default: '🌿' },
        color: { type: String, default: '#16a34a' },
    },
    ecoPoints: { type: Number, default: 20 },
    partnerBusiness: {
        name: { type: String, default: '' },
        offer: { type: String, default: '' },
    },
    stats: {
        totalScans: { type: Number, default: 0 },
        uniqueUsers: { type: Number, default: 0 },
    },
}, { timestamps: true })

module.exports = mongoose.model('EcoSite', EcoSiteSchema)
