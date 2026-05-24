const express = require('express')
const router = express.Router()
const WorkshopReg = require('../models/WorkshopReg')

router.get('/', async (req, res) => {
    try {
        const regs = await WorkshopReg.find().sort({ createdAt: -1 })
        res.json(regs)
    } catch (err) { res.status(500).json({ error: err.message }) }
})

router.post('/', async (req, res) => {
    try {
        const reg = await WorkshopReg.create(req.body)
        res.status(201).json(reg)
    } catch (err) { res.status(400).json({ error: err.message }) }
})

router.put('/:id', async (req, res) => {
    try {
        const reg = await WorkshopReg.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!reg) return res.status(404).json({ error: 'Không tìm thấy đăng ký' })
        res.json(reg)
    } catch (err) { res.status(400).json({ error: err.message }) }
})

router.delete('/:id', async (req, res) => {
    try {
        await WorkshopReg.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) { res.status(400).json({ error: err.message }) }
})

module.exports = router
