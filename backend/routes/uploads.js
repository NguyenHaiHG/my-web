const express = require('express')
const ImageAsset = require('../models/ImageAsset')
const { adminOnly } = require('../middleware/auth')

const router = express.Router()
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const DATA_URL_PATTERN = /^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=\s]+)$/

router.post('/', async (req, res) => {
    try {
        const { dataUrl, filename = 'image' } = req.body
        const match = typeof dataUrl === 'string' ? dataUrl.match(DATA_URL_PATTERN) : null
        if (!match) return res.status(400).json({ error: 'Ảnh không hợp lệ' })

        const data = Buffer.from(match[2].replace(/\s/g, ''), 'base64')
        if (!data.length) return res.status(400).json({ error: 'Ảnh rỗng' })
        if (data.length > MAX_IMAGE_BYTES) {
            return res.status(413).json({ error: 'Ảnh sau khi nén vượt quá 5MB' })
        }

        const image = await ImageAsset.create({
            data,
            contentType: match[1],
            filename: String(filename).slice(0, 180),
            size: data.length,
        })

        const configuredOrigin = process.env.PUBLIC_API_URL?.replace(/\/$/, '')
        const requestOrigin = `${req.protocol}://${req.get('host')}`
        res.status(201).json({
            id: image._id,
            url: `${configuredOrigin || requestOrigin}/api/uploads/${image._id}`,
        })
    } catch (err) {
        res.status(500).json({ error: err.message || 'Không lưu được ảnh' })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const image = await ImageAsset.findById(req.params.id).lean()
        if (!image) return res.status(404).json({ error: 'Không tìm thấy ảnh' })
        const data = Buffer.isBuffer(image.data)
            ? image.data
            : Buffer.from(image.data?.buffer || image.data)

        res.set({
            'Content-Type': image.contentType,
            'Content-Length': data.length,
            'Cache-Control': 'public, max-age=31536000, immutable',
            'X-Content-Type-Options': 'nosniff',
        })
        res.end(data)
    } catch {
        res.status(404).json({ error: 'Không tìm thấy ảnh' })
    }
})

router.delete('/:id', adminOnly, async (req, res) => {
    try {
        await ImageAsset.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch {
        res.status(400).json({ error: 'Không xóa được ảnh' })
    }
})

module.exports = router
