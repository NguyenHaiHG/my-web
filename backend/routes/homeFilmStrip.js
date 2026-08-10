const express = require('express')
const mongoose = require('mongoose')
const HomeFilmStripItem = require('../models/HomeFilmStripItem')
const CommunityImage = require('../models/CommunityImage')
const ImageAsset = require('../models/ImageAsset')
const { adminOnly } = require('../middleware/auth')

const router = express.Router()
const ASSET_PATTERN = /\/api\/uploads\/([a-f0-9]{24})(?:[/?#]|$)/i
const FALLBACK_ITEMS = [
    { url: 'https://images.pexels.com/photos/36582384/pexels-photo-36582384.jpeg?auto=compress&cs=tinysrgb&w=900', caption: 'Phụ nữ H’Mông — Hà Giang' },
    { url: 'https://images.pexels.com/photos/10077653/pexels-photo-10077653.jpeg?auto=compress&cs=tinysrgb&w=900', caption: 'Ruộng bậc thang Hà Giang nhìn từ trên cao' },
    { url: 'https://images.pexels.com/photos/6713502/pexels-photo-6713502.jpeg?auto=compress&cs=tinysrgb&w=900', caption: 'Nông dân trên thửa bậc thang' },
    { url: 'https://images.pexels.com/photos/18012109/pexels-photo-18012109.jpeg?auto=compress&cs=tinysrgb&w=900', caption: 'Đường uốn lượn Hà Giang nhìn từ trên' },
    { url: 'https://images.pexels.com/photos/15997684/pexels-photo-15997684.jpeg?auto=compress&cs=tinysrgb&w=900', caption: 'Cột cờ Lũng Cú — cực Bắc Việt Nam' },
    { url: 'https://images.pexels.com/photos/27568660/pexels-photo-27568660.jpeg?auto=compress&cs=tinysrgb&w=900', caption: 'Thung lũng Hà Giang xanh mướt' },
]

function assetId(value) {
    if (typeof value !== 'string') return null
    return value.match(ASSET_PATTERN)?.[1] || null
}

function validUrl(value) {
    return typeof value === 'string'
        && value.length <= 2048
        && (/^https?:\/\//i.test(value) || value.startsWith('/api/uploads/'))
}

function itemPayload(body = {}) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) return null
    return {
        url: String(body.url ?? body.imageUrl ?? '').trim(),
        caption: String(body.caption ?? body.title ?? '').trim().slice(0, 300),
        enabled: body.enabled !== false,
        type: ['editorial', 'community', 'nature'].includes(body.type) ? body.type : 'editorial',
    }
}

async function cleanupReplacedAsset(oldUrl, newUrl = '') {
    const oldId = assetId(oldUrl)
    const newId = assetId(newUrl)
    if (oldId && oldId !== newId) await ImageAsset.findByIdAndDelete(oldId)
}

async function ensureSeed() {
    const count = await HomeFilmStripItem.countDocuments()
    if (count === 0) {
        const operations = FALLBACK_ITEMS.map((item, index) => ({
            updateOne: {
                filter: { sourceKey: `home-fallback-${index + 1}` },
                update: { $setOnInsert: { ...item, enabled: true, type: 'editorial', sortOrder: index, sourceKey: `home-fallback-${index + 1}` } },
                upsert: true,
            },
        }))
        await HomeFilmStripItem.bulkWrite(operations, { ordered: false })
    }

    const legacyItems = await CommunityImage.find().sort({ createdAt: 1 }).lean()
    if (!legacyItems.length) return
    const nextOrder = await HomeFilmStripItem.countDocuments()
    await HomeFilmStripItem.bulkWrite(legacyItems.map((item, index) => ({
        updateOne: {
            filter: {
                $or: [
                    { legacyCommunityImageId: item._id },
                    { url: item.url },
                ],
            },
            update: {
                $setOnInsert: {
                    url: item.url,
                    caption: item.caption || '',
                    enabled: true,
                    type: 'community',
                    sortOrder: nextOrder + index,
                    sourceKey: `community-image-${item._id}`,
                    legacyCommunityImageId: item._id,
                },
            },
            upsert: true,
        },
    })), { ordered: false })
}

router.get('/', async (_req, res) => {
    try {
        await ensureSeed()
        const items = await HomeFilmStripItem.find().sort({ sortOrder: 1, createdAt: 1 })
        res.json(items)
    } catch (err) {
        res.status(500).json({ error: err.message || 'Không tải được film strip' })
    }
})

router.post('/', adminOnly, async (req, res) => {
    const payload = itemPayload(req.body)
    if (!payload) return res.status(400).json({ error: 'Dữ liệu ảnh không hợp lệ' })
    if (!validUrl(payload.url)) return res.status(400).json({ error: 'URL ảnh không hợp lệ' })
    try {
        const last = await HomeFilmStripItem.findOne().sort({ sortOrder: -1 }).select('sortOrder').lean()
        const item = await HomeFilmStripItem.create({ ...payload, sortOrder: (last?.sortOrder ?? -1) + 1 })
        res.status(201).json(item)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.patch('/reorder', adminOnly, async (req, res) => {
    const ids = req.body?.ids
    if (!Array.isArray(ids) || ids.some(id => !mongoose.Types.ObjectId.isValid(id)) || new Set(ids).size !== ids.length) {
        return res.status(400).json({ error: 'Danh sách thứ tự không hợp lệ' })
    }
    try {
        const existing = await HomeFilmStripItem.find().select('_id').lean()
        const existingIds = new Set(existing.map(item => item._id.toString()))
        if (ids.length !== existingIds.size || ids.some(id => !existingIds.has(id))) {
            return res.status(400).json({ error: 'Danh sách thứ tự phải chứa đầy đủ ảnh' })
        }
        await HomeFilmStripItem.bulkWrite(ids.map((id, sortOrder) => ({
            updateOne: { filter: { _id: id }, update: { $set: { sortOrder } } },
        })))
        const items = await HomeFilmStripItem.find().sort({ sortOrder: 1, createdAt: 1 })
        res.json(items)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.put('/:id', adminOnly, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'ID ảnh không hợp lệ' })
    }
    const payload = itemPayload(req.body)
    if (!payload) return res.status(400).json({ error: 'Dữ liệu ảnh không hợp lệ' })
    if (!validUrl(payload.url)) return res.status(400).json({ error: 'URL ảnh không hợp lệ' })
    try {
        const item = await HomeFilmStripItem.findById(req.params.id)
        if (!item) return res.status(404).json({ error: 'Không tìm thấy ảnh' })
        const oldUrl = item.url
        item.url = payload.url
        item.caption = payload.caption
        item.enabled = payload.enabled
        item.type = payload.type
        await item.save()
        await cleanupReplacedAsset(oldUrl, item.url)
        res.json(item)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.delete('/:id', adminOnly, async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'ID ảnh không hợp lệ' })
    }
    try {
        const item = await HomeFilmStripItem.findByIdAndDelete(req.params.id)
        if (!item) return res.status(404).json({ error: 'Không tìm thấy ảnh' })
        await cleanupReplacedAsset(item.url)
        res.json({ success: true })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

module.exports = router
