const express = require('express')
const PassportState = require('../models/PassportState')

const router = express.Router()
const KEY_PATTERN = /^[A-Za-z0-9_-]{16,160}$/

router.get('/verify/:certCode', async (req, res) => {
    try {
        const state = await PassportState.findOne({ 'data.certRegistry.certCode': req.params.certCode }).lean()
        const record = state?.data?.certRegistry?.find(item => item.certCode === req.params.certCode)
        if (!record) return res.status(404).json({ error: 'Không tìm thấy chứng nhận' })
        res.json(record)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.get('/:key', async (req, res) => {
    if (!KEY_PATTERN.test(req.params.key)) return res.status(400).json({ error: 'Passport key không hợp lệ' })
    try {
        const state = await PassportState.findOne({ key: req.params.key }).lean()
        res.json(state?.data || null)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.put('/:key', async (req, res) => {
    if (!KEY_PATTERN.test(req.params.key)) return res.status(400).json({ error: 'Passport key không hợp lệ' })
    try {
        const state = await PassportState.findOneAndUpdate(
            { key: req.params.key },
            { data: req.body },
            { upsert: true, new: true, runValidators: true },
        )
        res.json(state.data)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

module.exports = router
