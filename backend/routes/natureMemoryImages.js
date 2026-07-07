const express = require('express')
const router = express.Router()
const NatureMemoryImage = require('../models/NatureMemoryImage')

// GET all images (newest first)
router.get('/', async (req, res) => {
    try {
        const images = await NatureMemoryImage.find().sort({ createdAt: -1 })
        res.json(images)
    } catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
})

// POST: Admin upload new image
router.post('/', async (req, res) => {
    try {
        const { url, caption, category, uploadedBy } = req.body
        if (!url) return res.status(400).json({ error: 'Missing image url' })
        const img = await NatureMemoryImage.create({ url, caption, category, uploadedBy })
        res.json(img)
    } catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
})

// DELETE: Admin remove image
router.delete('/:id', async (req, res) => {
    try {
        await NatureMemoryImage.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ error: 'Server error' })
    }
})

module.exports = router
