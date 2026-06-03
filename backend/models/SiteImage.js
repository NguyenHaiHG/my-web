const mongoose = require('mongoose')

const siteImageSchema = new mongoose.Schema({
    slot: { type: String, required: true, unique: true },
    url: { type: String, default: '' },
    caption: { type: String, default: '' },
    updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('SiteImage', siteImageSchema)
