const mongoose = require('mongoose')

const libraryItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: String,
    category: {
        type: String,
        enum: ['language', 'food', 'culture', 'craft', 'nature', 'story'],
        default: 'culture',
    },
    ethnic: String,
    img: String,
    tags: [String],
    pronunciation: String, // For language entries
    translation: String,   // For language entries
}, { timestamps: true })

module.exports = mongoose.model('LibraryItem', libraryItemSchema)
