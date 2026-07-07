const express = require('express')
const router = express.Router()
const Penpal = require('../models/Penpal')
const PenpalLetter = require('../models/PenpalLetter')
const nodemailer = require('nodemailer')

/* ── GET all active penpals ── */
router.get('/', async (req, res) => {
    try {
        const penpals = await Penpal.find({ isActive: true }).sort({ createdAt: -1 }).select('-contactEmail')
        res.json(penpals)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

/* ── POST register as penpal ── */
router.post('/', async (req, res) => {
    try {
        const { name, age, country, city, languages, interests, bio, photo, contactEmail } = req.body
        if (!name || !country || !contactEmail) {
            return res.status(400).json({ error: 'Thiếu trường bắt buộc: name, country, contactEmail' })
        }
        const penpal = new Penpal({ name, age, country, city, languages, interests, bio, photo, contactEmail })
        await penpal.save()
        res.status(201).json({ message: 'Đăng ký penpal thành công!', id: penpal._id })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

/* ── POST send a letter to a penpal ── */
router.post('/:id/letter', async (req, res) => {
    try {
        const penpal = await Penpal.findById(req.params.id)
        if (!penpal) return res.status(404).json({ error: 'Không tìm thấy penpal' })

        const { fromName, fromCountry, fromEmail, message, photo } = req.body
        if (!fromName || !fromEmail || !message) {
            return res.status(400).json({ error: 'Thiếu trường bắt buộc: fromName, fromEmail, message' })
        }

        // Lưu thư vào DB
        const letter = new PenpalLetter({
            toPenpalId: penpal._id,
            fromName, fromCountry, fromEmail, message, photo,
        })
        await letter.save()

        // Gửi email thông báo cho penpal nếu có cấu hình email
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS && penpal.contactEmail) {
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
                })

                const hasPhoto = !!photo

                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: penpal.contactEmail,
                    subject: `✉️ Bạn có thư penpal mới từ ${fromName}${fromCountry ? ' (' + fromCountry + ')' : ''}!`,
                    html: `
                        <div style="font-family:sans-serif;max-width:560px;margin:auto">
                            <h2 style="color:#2e7d32">✉️ Thư từ Penpal mới!</h2>
                            <p>Xin chào <strong>${penpal.name}</strong>,</p>
                            <p>Bạn nhận được một bức thư từ <strong>${fromName}</strong>${fromCountry ? ' ở ' + fromCountry : ''}.</p>
                            <blockquote style="border-left:3px solid #66bb6a;padding:8px 16px;background:#f1f8e9;border-radius:4px;font-style:italic">
                                "${message}"
                            </blockquote>
                            ${hasPhoto ? '<p>📷 Kèm theo 1 ảnh trong thư (xem tại website).</p>' : ''}
                            <p>Liên hệ lại: <a href="mailto:${fromEmail}">${fromEmail}</a></p>
                            <hr/>
                            <p style="font-size:12px;color:#999">BookHaGiang Penpal · htxtruonghai.com</p>
                        </div>
                    `,
                })
            } catch (_emailErr) {
                // Email lỗi không chặn response
                console.error('Email error:', _emailErr.message)
            }
        }

        res.status(201).json({ message: 'Gửi thư thành công!' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

/* ── GET letters for a penpal (admin use) ── */
router.get('/:id/letters', async (req, res) => {
    try {
        const letters = await PenpalLetter.find({ toPenpalId: req.params.id }).sort({ createdAt: -1 })
        res.json(letters)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

/* ── DELETE penpal (admin) ── */
router.delete('/:id', async (req, res) => {
    try {
        await Penpal.findByIdAndDelete(req.params.id)
        res.json({ message: 'Đã xoá penpal' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router
