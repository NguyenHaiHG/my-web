const express = require('express')
const router = express.Router()
const WorkshopReg = require('../models/WorkshopReg')
const { sendThankYouAndCertificate } = require('../utils/email')

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
        const prev = await WorkshopReg.findById(req.params.id)
        const reg = await WorkshopReg.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!reg) return res.status(404).json({ error: 'Không tìm thấy đăng ký' })
        // Nếu trạng thái chuyển sang completed thì gửi email cảm ơn và chứng nhận
        if (req.body.status === 'completed' && prev && prev.status !== 'completed') {
            sendThankYouAndCertificate({
                email: reg.email,
                name: reg.name,
                workshopTitle: reg.workshopTitle
            }).catch(console.error)
        }
        res.json(reg)
    } catch (err) { res.status(400).json({ error: err.message }) }
})

router.delete('/:id', async (req, res) => {
    try {
        await WorkshopReg.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) { res.status(400).json({ error: err.message }) }
})

// Gửi review cho workshop
router.post('/:id/review', async (req, res) => {
    try {
        const { rating, comment } = req.body
        const reg = await WorkshopReg.findById(req.params.id)
        if (!reg) return res.status(404).json({ error: 'Không tìm thấy đăng ký' })
        if (reg.status !== 'completed') return res.status(400).json({ error: 'Chỉ review sau khi đã hoàn thành workshop' })
        reg.review = { rating, comment, createdAt: new Date() }
        await reg.save()
        res.json({ success: true })
    } catch (err) { res.status(400).json({ error: err.message }) }
})

module.exports = router
