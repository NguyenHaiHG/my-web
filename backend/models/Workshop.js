const mongoose = require('mongoose')

const workshopSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: String,
    date: String,
    time: String,
    location: { type: String, default: 'Tổ 5 Quang Trung, Phường Hà Giang 2, Tuyên Quang' },
    capacity: { type: Number, default: 20 },
    registered: { type: Number, default: 0 },
    category: {
        type: String,
        enum: ['sewing', 'embroidery', 'english', 'digital', 'cooking', 'other'],
        default: 'other',
    },
    img: String,
    isFree: { type: Boolean, default: true },
    price: String,
    status: { type: String, enum: ['upcoming', 'ongoing', 'done'], default: 'upcoming' },
    instructor: String,
    tags: [String],
}, { timestamps: true })

module.exports = mongoose.model('Workshop', workshopSchema)
