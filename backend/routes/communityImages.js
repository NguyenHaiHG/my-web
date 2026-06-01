const express = require('express')
const router = express.Router()
const CommunityImage = require('../models/CommunityImage')

// Get all images (limit 10, newest first)
router.get('/', async (req, res) => {
    try {
        const images = await CommunityImage.find().sort({ createdAt: -1 }).limit(10)
        res.json(images)
    } catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
})

// Admin: Add new image
router.post('/', async (req, res) => {
    try {
        const { url, caption, uploadedBy } = req.body
        if (!url) return res.status(400).json({ error: 'Missing image url' })
        const img = await CommunityImage.create({ url, caption, uploadedBy })
        res.json(img)
    } catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
})

// Admin: Delete image
router.delete('/:id', async (req, res) => {
    try {
        await CommunityImage.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
})

module.exports = router
