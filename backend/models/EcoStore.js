const mongoose = require('mongoose')

const EcoStoreSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, enum: ['craft', 'food', 'homestay', 'farm-shop', 'wellness', 'souvenir'], default: 'souvenir' },
    district: { type: String, default: 'Ha Giang' },
    address: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    story: {
        title: { type: String, default: '' },
        content: { type: String, default: '' },
    },
    experience: {
        label: { type: String, default: 'Trải nghiệm địa phương' },
        description: { type: String, default: '' },
        durationMinutes: { type: Number, default: 45 },
    },
    stamp: {
        id: { type: String, required: true },
        name: { type: String, default: 'Dấu trải nghiệm' },
        icon: { type: String, default: '🛍️' },
        color: { type: String, default: '#2563eb' },
    },
    reward: {
        visitPoints: { type: Number, default: 12 },
        spendMultiplier: { type: Number, default: 0.15 },
    },
    offers: [{
        title: { type: String, default: '' },
        detail: { type: String, default: '' },
        minPoints: { type: Number, default: 0 },
    }],
    contact: {
        phone: { type: String, default: '' },
        bookingLink: { type: String, default: '' },
    },
    stats: {
        totalVisits: { type: Number, default: 0 },
        uniqueVisitors: { type: Number, default: 0 },
        totalRevenueTracked: { type: Number, default: 0 },
    },
}, { timestamps: true })

module.exports = mongoose.model('EcoStore', EcoStoreSchema)
