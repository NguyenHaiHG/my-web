const express = require('express')
const router = express.Router()
const Tour = require('../models/Tour')

// Lấy tất cả tours
router.get('/', async (req, res) => {
    try {
        const tours = await Tour.find().sort({ createdAt: -1 })
        res.json(tours)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Thêm tour mới
router.post('/', async (req, res) => {
    try {
        const tour = await Tour.create(req.body)
        res.status(201).json(tour)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

// Cập nhật tour
router.put('/:id', async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!tour) return res.status(404).json({ error: 'Không tìm thấy tour' })
        res.json(tour)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

// Xoá tour
router.delete('/:id', async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

module.exports = router
