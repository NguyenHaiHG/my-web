const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const NatureMemoryEntry = require('../models/NatureMemoryEntry')
const { adminOnly } = require('../middleware/auth')
const { submissionLimiter, text, isImageReference } = require('../middleware/publicSubmission')

const createLimiter = submissionLimiter(30, 'Gửi kỷ niệm quá nhiều. Vui lòng thử lại sau 15 phút.')
const TEXT_LIMITS = {
    clientId: 120,
    name: 120,
    scientificName: 160,
    category: 50,
    notes: 4000,
    location: 300,
    weather: 100,
    season: 100,
    mood: 100,
    time: 100,
}

function pickPayload(body = {}) {
    return {
        clientId: body.clientId || '',
        name: body.name || '',
        scientificName: body.scientificName || '',
        category: body.category || 'other',
        notes: body.notes || '',
        location: body.location || '',
        weather: body.weather || '',
        season: body.season || '',
        mood: body.mood || '',
        img: body.img || '',
        time: body.time || '',
        createdAt: body.createdAt || Date.now(),
    }
}

function validatePayload(body, partial = false) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) return { error: 'Dữ liệu không hợp lệ' }
    const payload = {}
    for (const [field, maxLength] of Object.entries(TEXT_LIMITS)) {
        if (partial && body[field] === undefined) continue
        const value = text(body[field], maxLength, '')
        if (value === null) return { error: `${field} không hợp lệ` }
        payload[field] = value
    }
    if (!partial || body.img !== undefined) {
        const img = text(body.img, 2048, '')
        if (img === null || !isImageReference(img)) return { error: 'Ảnh không hợp lệ' }
        payload.img = img
    }
    if (!partial || body.createdAt !== undefined) {
        const createdAt = body.createdAt ? new Date(body.createdAt) : new Date()
        if (Number.isNaN(createdAt.getTime())) return { error: 'Ngày tạo không hợp lệ' }
        payload.createdAt = createdAt
    }
    return { payload }
}

// GET all nature memories (newest first)
router.get('/', async (req, res) => {
    try {
        const entries = await NatureMemoryEntry.find().sort({ createdAt: -1 }).limit(1000)
        res.json(entries)
    } catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
})

// POST one nature memory; dedupe by clientId when provided
router.post('/', createLimiter, async (req, res) => {
    try {
        const validation = validatePayload(req.body)
        if (validation.error) return res.status(400).json({ error: validation.error })
        const payload = pickPayload(validation.payload)
        if (!payload.name.trim()) return res.status(400).json({ error: 'Missing name' })

        if (payload.clientId) {
            const existing = await NatureMemoryEntry.findOne({ clientId: payload.clientId })
            if (existing) return res.json(existing)
        }

        const created = await NatureMemoryEntry.create(payload)
        res.status(201).json(created)
    } catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
})

async function updateEntry(req, res) {
    try {
        const validation = validatePayload(req.body, true)
        if (validation.error) return res.status(400).json({ error: validation.error })
        if (!Object.keys(validation.payload).length) {
            return res.status(400).json({ error: 'Không có trường nào để cập nhật' })
        }

        const { id } = req.params
        const entry = mongoose.Types.ObjectId.isValid(id)
            ? await NatureMemoryEntry.findById(id)
            : await NatureMemoryEntry.findOne({ clientId: id })
        if (!entry) return res.status(404).json({ error: 'Entry not found' })

        Object.assign(entry, validation.payload)
        if (!entry.name.trim()) return res.status(400).json({ error: 'Missing name' })
        await entry.save()
        res.json(entry)
    } catch (err) {
        res.status(400).json({ error: err.message || 'Không cập nhật được kỷ niệm' })
    }
}

router.put('/:id', adminOnly, updateEntry)
router.patch('/:id', adminOnly, updateEntry)

// DELETE by Mongo _id or by clientId
router.delete('/:id', adminOnly, async (req, res) => {
    try {
        const { id } = req.params

        if (mongoose.Types.ObjectId.isValid(id)) {
            const deleted = await NatureMemoryEntry.findByIdAndDelete(id)
            if (deleted) return res.json({ success: true })
        }

        const deletedByClientId = await NatureMemoryEntry.findOneAndDelete({ clientId: id })
        if (deletedByClientId) return res.json({ success: true })

        res.status(404).json({ error: 'Entry not found' })
    } catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
})

module.exports = router
