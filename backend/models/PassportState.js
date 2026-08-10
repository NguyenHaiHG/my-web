const mongoose = require('mongoose')

const PassportStateSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true, index: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true, default: {} },
}, { timestamps: true })

module.exports = mongoose.model('PassportState', PassportStateSchema)
