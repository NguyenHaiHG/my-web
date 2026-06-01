const mongoose = require('mongoose')

const workshopRegSchema = new mongoose.Schema({
    workshopId: String,
    workshopTitle: String,
    name: { type: String, required: true },
    phone: String,
    email: String,
    note: String,
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
    paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
    price: String, // Phí workshop
    review: {
        rating: Number,
        comment: String,
        createdAt: Date
    },
    ethnicity: String, // Dân tộc
    gender: String, // Giới tính
    isLocal: Boolean, // Người địa phương
}, { timestamps: true })

module.exports = mongoose.model('WorkshopReg', workshopRegSchema)
