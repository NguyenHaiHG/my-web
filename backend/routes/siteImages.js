const express = require('express')
const router = express.Router()
const SiteImage = require('../models/SiteImage')

// GET all slots
router.get('/', async (req, res) => {
    try {
        const imgs = await SiteImage.find()
        res.json(imgs)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// PUT /:slot — create or update
router.put('/:slot', async (req, res) => {
    try {
        const { url, caption } = req.body
        const img = await SiteImage.findOneAndUpdate(
            { slot: req.params.slot },
            { url, caption, updatedAt: Date.now() },
            { upsert: true, new: true }
        )
        res.json(img)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// DELETE /:slot — clear image (keep slot, empty url)
router.delete('/:slot', async (req, res) => {
    try {
        await SiteImage.findOneAndUpdate(
            { slot: req.params.slot },
            { url: '', updatedAt: Date.now() }
        )
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router
