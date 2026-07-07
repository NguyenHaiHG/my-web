const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const NatureMemoryEntry = require('../models/NatureMemoryEntry')

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
router.post('/', async (req, res) => {
    try {
        const payload = pickPayload(req.body)
        if (!payload.name.trim()) return res.status(400).json({ error: 'Missing name' })

        if (payload.clientId) {
            const existing = await NatureMemoryEntry.findOne({ clientId: payload.clientId })
            if (existing) return res.json(existing)
        }

        const created = await NatureMemoryEntry.create(payload)
        res.json(created)
    } catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
})

// DELETE by Mongo _id or by clientId
router.delete('/:id', async (req, res) => {
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
