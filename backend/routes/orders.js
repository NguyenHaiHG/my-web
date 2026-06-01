const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Order = require('../models/Order')

function isDbReady() {
    return mongoose.connection.readyState === 1
}

function isLegacyTestOrderFilter() {
    return {
        $or: [
            { 'items.name': /\[(STAY|BUS|E2E)\]/i },
            { address: /\b(KH:\s*Test|Demo stay|E2E)\b/i }
        ]
    }
}

// Tạo đơn hàng mới
router.post('/', async (req, res) => {
    if (!isDbReady()) {
        return res.status(503).json({ error: 'Database is offline' })
    }
    try {
        const order = new Order(req.body)
        await order.save()
        res.status(201).json(order)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

// Lấy tất cả đơn hàng (admin)
router.get('/', async (req, res) => {
    if (!isDbReady()) {
        return res.json([])
    }
    try {
        const orders = await Order.find().sort({ createdAt: -1 })
        res.json(orders)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Xóa toàn bộ đơn test (dùng cho môi trường dev/admin)
router.delete('/test', async (req, res) => {
    if (!isDbReady()) {
        return res.status(503).json({ error: 'Database is offline' })
    }

    try {
        const result = await Order.deleteMany({
            $or: [
                { isTest: true },
                isLegacyTestOrderFilter()
            ]
        })
        res.json({ deletedCount: result.deletedCount || 0 })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Cập nhật trạng thái đơn hàng
router.patch('/:id', async (req, res) => {
    if (!isDbReady()) {
        return res.status(503).json({ error: 'Database is offline' })
    }
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json(order)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

// Xóa một đơn hàng
router.delete('/:id', async (req, res) => {
    if (!isDbReady()) {
        return res.status(503).json({ error: 'Database is offline' })
    }
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

module.exports = router
