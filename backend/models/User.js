const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    displayName: { type: String, required: true, trim: true, default: 'Admin' },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin'], default: 'admin' },
    lastLoginAt: { type: Date },
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)
