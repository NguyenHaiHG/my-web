const express = require('express')
const router = express.Router()
const Review = require('../models/Review')
const { adminOnly } = require('../middleware/auth')
const {
    submissionLimiter,
    text,
    isEmail,
    isImageReference,
} = require('../middleware/publicSubmission')

const reviewLimiter = submissionLimiter(10, 'Gửi đánh giá quá nhiều. Vui lòng thử lại sau 15 phút.')

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
router.post('/', reviewLimiter, async (req, res) => {
    try {
        const name = text(req.body?.name, 120)
        const country = text(req.body?.country, 120, '')
        const content = text(req.body?.content, 5000)
        const img = text(req.body?.img, 2048, '')
        const email = text(req.body?.email, 254, '').toLowerCase()
        const program = text(req.body?.program, 200, '')
        const rating = Number(req.body?.rating ?? 5)
        if ([name, country, content, img, email, program].includes(null)
            || !name
            || !content
            || !Number.isInteger(rating)
            || rating < 1
            || rating > 5
            || (email && !isEmail(email))
            || !isImageReference(img)) {
            return res.status(400).json({ error: 'Dữ liệu đánh giá không hợp lệ' })
        }
        const review = await Review.create({
            name, country, content, img, email, program, rating, approved: false,
        })
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
