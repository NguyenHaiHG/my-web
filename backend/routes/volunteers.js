const express = require('express')
const router = express.Router()
const VolunteerApp = require('../models/VolunteerApp')

router.get('/', async (req, res) => {
    try {
        const apps = await VolunteerApp.find().sort({ createdAt: -1 })
        res.json(apps)
    } catch (err) { res.status(500).json({ error: err.message }) }
})

router.post('/', async (req, res) => {
    try {
        const app = await VolunteerApp.create(req.body)
        res.status(201).json(app)
    } catch (err) { res.status(400).json({ error: err.message }) }
})

router.put('/:id', async (req, res) => {
    try {
        const app = await VolunteerApp.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!app) return res.status(404).json({ error: 'Không tìm thấy đơn' })
        res.json(app)
    } catch (err) { res.status(400).json({ error: err.message }) }
})

router.delete('/:id', async (req, res) => {
    try {
        await VolunteerApp.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) { res.status(400).json({ error: err.message }) }
})

module.exports = router
