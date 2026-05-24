const express = require('express')
const router = express.Router()
const Workshop = require('../models/Workshop')

router.get('/', async (req, res) => {
    try {
        const workshops = await Workshop.find().sort({ createdAt: -1 })
        res.json(workshops)
    } catch (err) { res.status(500).json({ error: err.message }) }
})

router.post('/', async (req, res) => {
    try {
        const workshop = await Workshop.create(req.body)
        res.status(201).json(workshop)
    } catch (err) { res.status(400).json({ error: err.message }) }
})

router.put('/:id', async (req, res) => {
    try {
        const workshop = await Workshop.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!workshop) return res.status(404).json({ error: 'Không tìm thấy workshop' })
        res.json(workshop)
    } catch (err) { res.status(400).json({ error: err.message }) }
})

router.delete('/:id', async (req, res) => {
    try {
        await Workshop.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) { res.status(400).json({ error: err.message }) }
})

module.exports = router
