const express = require('express')
const router = express.Router()
const Review = require('../models/Review')
const { adminOnly } = require('../middleware/auth')

// Public: only approved reviews
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 })
        res.json(reviews)
    } catch (err) { res.status(500).json({ error: err.message }) }
})

// Admin: all reviews
router.get('/all', adminOnly, async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 })
        res.json(reviews)
    } catch (err) { res.status(500).json({ error: err.message }) }
})

// Submit a review (public)
router.post('/', async (req, res) => {
    try {
        const review = await Review.create({ ...req.body, approved: false })
        res.status(201).json(review)
    } catch (err) { res.status(400).json({ error: err.message }) }
})

// Approve / update review (admin)
router.put('/:id', adminOnly, async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!review) return res.status(404).json({ error: 'Không tìm thấy review' })
        res.json(review)
    } catch (err) { res.status(400).json({ error: err.message }) }
})

router.delete('/:id', adminOnly, async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) { res.status(400).json({ error: err.message }) }
})

module.exports = router
