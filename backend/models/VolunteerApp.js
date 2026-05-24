const mongoose = require('mongoose')

const volunteerAppSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: String,
    email: String,
    skills: String,
    availability: String,
    motivation: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true })

module.exports = mongoose.model('VolunteerApp', volunteerAppSchema)
