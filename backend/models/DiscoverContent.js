const mongoose = require('mongoose')

const DiscoverContentSchema = new mongoose.Schema({
    slug: { type: String, default: 'discover-home', unique: true, index: true },
    hero: { type: mongoose.Schema.Types.Mixed, default: {} },
    journeys: { type: [mongoose.Schema.Types.Mixed], default: [] },
    themes: { type: [mongoose.Schema.Types.Mixed], default: [] },
    stories: { type: [mongoose.Schema.Types.Mixed], default: [] },
    recommendations: { type: [mongoose.Schema.Types.Mixed], default: [] },
}, { timestamps: true })

module.exports = mongoose.model('DiscoverContent', DiscoverContentSchema)
