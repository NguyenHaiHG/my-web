const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: String,
    author: String,
    date: String,
    img: String,
    tag: { type: String, default: 'post' },
}, { timestamps: true })

module.exports = mongoose.model('Post', postSchema)
