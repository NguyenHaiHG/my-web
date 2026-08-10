const mongoose = require('mongoose')

const HomeFilmStripItemSchema = new mongoose.Schema({
    url: { type: String, required: true, trim: true },
    caption: { type: String, default: '', trim: true },
    type: { type: String, enum: ['editorial', 'community', 'nature'], default: 'editorial' },
    enabled: { type: Boolean, default: true },
    sortOrder: { type: Number, required: true, default: 0, min: 0 },
    sourceKey: { type: String, trim: true, unique: true, sparse: true },
    legacyCommunityImageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CommunityImage',
        unique: true,
        sparse: true,
    },
}, { timestamps: true })

HomeFilmStripItemSchema.index({ sortOrder: 1, createdAt: 1 })

module.exports = mongoose.model('HomeFilmStripItem', HomeFilmStripItemSchema)
