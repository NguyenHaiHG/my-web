const express = require('express')
const SiteContent = require('../models/SiteContent')
const ImageAsset = require('../models/ImageAsset')
const { adminOnly } = require('../middleware/auth')

const router = express.Router()
const KEY_PATTERN = /^[a-z0-9-]{1,80}$/
const ASSET_PATTERN = /\/api\/uploads\/([a-f0-9]{24})(?:[/?#]|$)/i

function assetId(value) {
    if (typeof value !== 'string') return null
    return value.match(ASSET_PATTERN)?.[1] || null
}

router.get('/:page', async (req, res) => {
    if (!KEY_PATTERN.test(req.params.page)) return res.status(400).json({ error: 'Page key không hợp lệ' })
    try {
        const rows = await SiteContent.find({ page: req.params.page }).lean()
        res.json(Object.fromEntries(rows.map(row => [row.section, row.content])))
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.put('/:page/:section', adminOnly, async (req, res) => {
    const { page, section } = req.params
    if (!KEY_PATTERN.test(page) || !KEY_PATTERN.test(section)) {
        return res.status(400).json({ error: 'Page/section key không hợp lệ' })
    }
    try {
        const previous = await SiteContent.findOne({ page, section }).lean()
        const row = await SiteContent.findOneAndUpdate(
            { page, section },
            { content: req.body, updatedBy: req.user._id },
            { upsert: true, new: true, runValidators: true },
        )
        const oldImageId = assetId(previous?.content?.image)
        const newImageId = assetId(req.body?.image)
        if (oldImageId && oldImageId !== newImageId) {
            ImageAsset.findByIdAndDelete(oldImageId).catch(() => { })
        }
        res.json(row.content)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.delete('/:page/:section', adminOnly, async (req, res) => {
    try {
        await SiteContent.findOneAndDelete({ page: req.params.page, section: req.params.section })
        res.json({ success: true })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

module.exports = router
