const mongoose = require('mongoose')

const workshopRegSchema = new mongoose.Schema({
    workshopId: String,
    workshopTitle: String,
    name: { type: String, required: true },
    phone: String,
    email: String,
    note: String,
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
}, { timestamps: true })

module.exports = mongoose.model('WorkshopReg', workshopRegSchema)
