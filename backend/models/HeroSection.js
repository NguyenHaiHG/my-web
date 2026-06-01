const mongoose = require('mongoose')

const HeroSectionSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    title: { type: String, required: true }, // plain text (legacy)
    subtitle: { type: String, required: true }, // plain text (legacy)
    titleRich: { type: String }, // rich text (HTML/Markdown)
    subtitleRich: { type: String }, // rich text (HTML/Markdown)
    buttonLabel: { type: String, default: '🗓️ Đặt lịch' }, // nút booking
    buttonLink: { type: String, default: '/tours' }, // link/action khi click nút
    updatedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('HeroSection', HeroSectionSchema)
