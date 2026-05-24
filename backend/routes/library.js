const express = require('express')
const router = express.Router()
const LibraryItem = require('../models/LibraryItem')

router.get('/', async (req, res) => {
    try {
        const items = await LibraryItem.find().sort({ createdAt: -1 })
        res.json(items)
    } catch (err) { res.status(500).json({ error: err.message }) }
})

router.post('/', async (req, res) => {
    try {
        const item = await LibraryItem.create(req.body)
        res.status(201).json(item)
    } catch (err) { res.status(400).json({ error: err.message }) }
})

router.put('/:id', async (req, res) => {
    try {
        const item = await LibraryItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!item) return res.status(404).json({ error: 'Không tìm thấy mục' })
        res.json(item)
    } catch (err) { res.status(400).json({ error: err.message }) }
})

router.delete('/:id', async (req, res) => {
    try {
        await LibraryItem.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) { res.status(400).json({ error: err.message }) }
})

module.exports = router
