const express = require('express')
const { randomUUID } = require('crypto')
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

function collectAssetIds(value, ids = new Set()) {
    if (typeof value === 'string') {
        const id = assetId(value)
        if (id) ids.add(id)
        return ids
    }
    if (Array.isArray(value)) {
        value.forEach(item => collectAssetIds(item, ids))
        return ids
    }
    if (value && typeof value === 'object') {
        Object.values(value).forEach(item => collectAssetIds(item, ids))
    }
    return ids
}

async function cleanupRemovedAssets(previous, next) {
    const previousIds = collectAssetIds(previous)
    const nextIds = collectAssetIds(next)
    const removed = [...previousIds].filter(id => !nextIds.has(id))
    if (removed.length) await ImageAsset.deleteMany({ _id: { $in: removed } })
}

function listFromContent(content) {
    if (Array.isArray(content)) return { items: content, wrap: items => items }
    if (content && Array.isArray(content.items)) {
        return { items: content.items, wrap: items => ({ ...content, items }) }
    }
    return { items: [], wrap: items => ({ ...(content || {}), items }) }
}

function normalizeItems(items) {
    const seen = new Set()
    let changed = false
    const normalized = items.map(item => {
        const object = item && typeof item === 'object' ? item : { value: item }
        let id = typeof object.id === 'string' && object.id && object.id.length <= 100 ? object.id : ''
        if (!id || seen.has(id)) {
            id = randomUUID()
            changed = true
        }
        seen.add(id)
        return object.id === id ? object : { ...object, id }
    })
    return { items: normalized, changed }
}

async function getList(page, section) {
    const row = await SiteContent.findOne({ page, section })
    const { items, wrap } = listFromContent(row?.content)
    const normalized = normalizeItems(items)
    if (row && normalized.changed) {
        row.content = wrap(normalized.items)
        await row.save()
    }
    return { row, items: normalized.items, wrap }
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
        await cleanupRemovedAssets(previous?.content, req.body)
        res.json(row.content)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.get('/:page/:section/items', async (req, res) => {
    const { page, section } = req.params
    if (!KEY_PATTERN.test(page) || !KEY_PATTERN.test(section)) {
        return res.status(400).json({ error: 'Page/section key không hợp lệ' })
    }
    try {
        const { items } = await getList(page, section)
        res.json(items)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.post('/:page/:section/items', adminOnly, async (req, res) => {
    const { page, section } = req.params
    if (!KEY_PATTERN.test(page) || !KEY_PATTERN.test(section)) {
        return res.status(400).json({ error: 'Page/section key không hợp lệ' })
    }
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        return res.status(400).json({ error: 'Dữ liệu item không hợp lệ' })
    }
    try {
        const { row, items, wrap } = await getList(page, section)
        const highestSortOrder = items.reduce(
            (highest, current, index) => Math.max(highest, Number.isFinite(current?.sortOrder) ? current.sortOrder : index),
            -1,
        )
        const item = {
            ...req.body,
            id: randomUUID(),
            sortOrder: Number.isFinite(req.body.sortOrder) ? req.body.sortOrder : highestSortOrder + 1,
        }
        const content = wrap([...items, item])
        if (row) {
            row.content = content
            row.updatedBy = req.user._id
            await row.save()
        } else {
            await SiteContent.create({ page, section, content, updatedBy: req.user._id })
        }
        res.status(201).json(item)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.put('/:page/:section/items/:itemId', adminOnly, async (req, res) => {
    const { page, section, itemId } = req.params
    if (!KEY_PATTERN.test(page) || !KEY_PATTERN.test(section) || !itemId || itemId.length > 100) {
        return res.status(400).json({ error: 'Page/section/item key không hợp lệ' })
    }
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        return res.status(400).json({ error: 'Dữ liệu item không hợp lệ' })
    }
    try {
        const { row, items, wrap } = await getList(page, section)
        if (!row) return res.status(404).json({ error: 'Không tìm thấy section' })
        const index = items.findIndex(item => item?.id === itemId)
        if (index < 0) return res.status(404).json({ error: 'Không tìm thấy item' })

        const updated = {
            ...req.body,
            id: itemId,
            sortOrder: Number.isFinite(req.body.sortOrder)
                ? req.body.sortOrder
                : (items[index].sortOrder ?? index),
        }
        const nextItems = items.slice()
        nextItems[index] = updated
        const previousContent = row.content
        row.content = wrap(nextItems)
        row.updatedBy = req.user._id
        await row.save()
        await cleanupRemovedAssets(previousContent, row.content)
        res.json(updated)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.delete('/:page/:section/items/:itemId', adminOnly, async (req, res) => {
    const { page, section, itemId } = req.params
    if (!KEY_PATTERN.test(page) || !KEY_PATTERN.test(section) || !itemId || itemId.length > 100) {
        return res.status(400).json({ error: 'Page/section/item key không hợp lệ' })
    }
    try {
        const { row, items, wrap } = await getList(page, section)
        if (!row) return res.status(404).json({ error: 'Không tìm thấy section' })
        const index = items.findIndex(item => item?.id === itemId)
        if (index < 0) return res.status(404).json({ error: 'Không tìm thấy item' })
        const nextItems = items.slice()
        nextItems.splice(index, 1)
        const reordered = nextItems.map((item, sortOrder) => ({ ...item, sortOrder }))
        const previousContent = row.content
        row.content = wrap(reordered)
        row.updatedBy = req.user._id
        await row.save()
        await cleanupRemovedAssets(previousContent, row.content)
        res.json({ success: true })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.patch('/:page/:section/items/reorder', adminOnly, async (req, res) => {
    const { page, section } = req.params
    const ids = req.body?.ids
    if (!KEY_PATTERN.test(page) || !KEY_PATTERN.test(section)) {
        return res.status(400).json({ error: 'Page/section key không hợp lệ' })
    }
    if (!Array.isArray(ids) || ids.some(id => typeof id !== 'string') || new Set(ids).size !== ids.length) {
        return res.status(400).json({ error: 'Danh sách thứ tự không hợp lệ' })
    }
    try {
        const { row, items, wrap } = await getList(page, section)
        if (!row) return res.status(404).json({ error: 'Không tìm thấy section' })
        const byId = new Map(items.map(item => [item.id, item]))
        if (ids.length !== items.length || ids.some(id => !byId.has(id))) {
            return res.status(400).json({ error: 'Danh sách thứ tự phải chứa đầy đủ item' })
        }
        const reordered = ids.map((id, sortOrder) => ({ ...byId.get(id), sortOrder }))
        row.content = wrap(reordered)
        row.updatedBy = req.user._id
        await row.save()
        res.json(reordered)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.delete('/:page/:section', adminOnly, async (req, res) => {
    try {
        const deleted = await SiteContent.findOneAndDelete({ page: req.params.page, section: req.params.section })
        await cleanupRemovedAssets(deleted?.content, null)
        res.json({ success: true })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

module.exports = router
