const express = require('express')
const router = express.Router()
const SiteImage = require('../models/SiteImage')
const ImageAsset = require('../models/ImageAsset')
const ASSET_PATTERN = /\/api\/uploads\/([a-f0-9]{24})(?:[/?#]|$)/i

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
        const previous = await SiteImage.findOne({ slot: req.params.slot }).lean()
        const img = await SiteImage.findOneAndUpdate(
            { slot: req.params.slot },
            { url, caption, updatedAt: Date.now() },
            { upsert: true, new: true }
        )
        const oldAssetId = previous?.url?.match(ASSET_PATTERN)?.[1]
        const newAssetId = url?.match?.(ASSET_PATTERN)?.[1]
        if (oldAssetId && oldAssetId !== newAssetId) ImageAsset.findByIdAndDelete(oldAssetId).catch(() => { })
        res.json(img)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// DELETE /:slot — clear image (keep slot, empty url)
router.delete('/:slot', async (req, res) => {
    try {
        const previous = await SiteImage.findOne({ slot: req.params.slot }).lean()
        await SiteImage.findOneAndUpdate(
            { slot: req.params.slot },
            { url: '', updatedAt: Date.now() }
        )
        const oldAssetId = previous?.url?.match(ASSET_PATTERN)?.[1]
        if (oldAssetId) ImageAsset.findByIdAndDelete(oldAssetId).catch(() => { })
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router
