const express = require('express')
const router = express.Router()
const Penpal = require('../models/Penpal')
const PenpalLetter = require('../models/PenpalLetter')
const nodemailer = require('nodemailer')
const { adminOnly } = require('../middleware/auth')
const {
    submissionLimiter,
    text,
    stringList,
    isEmail,
    isImageReference,
} = require('../middleware/publicSubmission')

const registrationLimiter = submissionLimiter(10, 'Đăng ký quá nhiều. Vui lòng thử lại sau 15 phút.')
const letterLimiter = submissionLimiter(20, 'Gửi thư quá nhiều. Vui lòng thử lại sau 15 phút.')

function profilePayload(body, partial = false) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) return { error: 'Dữ liệu không hợp lệ' }
    const payload = {}
    const textFields = { name: 120, country: 120, city: 120, bio: 3000 }
    for (const [field, maxLength] of Object.entries(textFields)) {
        if (partial && body[field] === undefined) continue
        const value = text(body[field], maxLength, '')
        if (value === null) return { error: `${field} không hợp lệ` }
        payload[field] = value
    }
    for (const field of ['languages', 'interests']) {
        if (partial && body[field] === undefined) continue
        const value = stringList(body[field])
        if (value === null) return { error: `${field} không hợp lệ` }
        payload[field] = value
    }
    if (!partial || body.age !== undefined) {
        if (body.age === '' || body.age === undefined || body.age === null) payload.age = undefined
        else {
            const age = Number(body.age)
            if (!Number.isInteger(age) || age < 1 || age > 120) return { error: 'Tuổi không hợp lệ' }
            payload.age = age
        }
    }
    if (!partial || body.photo !== undefined) {
        const photo = text(body.photo, 2048, '')
        if (photo === null || !isImageReference(photo)) return { error: 'Ảnh không hợp lệ' }
        payload.photo = photo
    }
    if (!partial || body.contactEmail !== undefined) {
        const contactEmail = text(body.contactEmail, 254, '').toLowerCase()
        if (!isEmail(contactEmail)) return { error: 'Email liên hệ không hợp lệ' }
        payload.contactEmail = contactEmail
    }
    if (partial && body.isActive !== undefined) {
        if (typeof body.isActive !== 'boolean') return { error: 'isActive không hợp lệ' }
        payload.isActive = body.isActive
    }
    return { payload }
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[char])
}

/* ── GET all active penpals ── */
router.get('/', async (req, res) => {
    try {
        const penpals = await Penpal.find({ isActive: true }).sort({ createdAt: -1 }).select('-contactEmail')
        res.json(penpals)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.get('/admin/all', adminOnly, async (_req, res) => {
    try {
        const penpals = await Penpal.find().sort({ createdAt: -1 })
        res.json(penpals)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

/* ── POST register as penpal ── */
router.post('/', registrationLimiter, async (req, res) => {
    try {
        const validation = profilePayload(req.body)
        if (validation.error) return res.status(400).json({ error: validation.error })
        const { name, age, country, city, languages, interests, bio, photo, contactEmail } = validation.payload
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
router.post('/:id/letter', letterLimiter, async (req, res) => {
    try {
        const penpal = await Penpal.findById(req.params.id)
        if (!penpal) return res.status(404).json({ error: 'Không tìm thấy penpal' })

        const fromName = text(req.body?.fromName, 120)
        const fromCountry = text(req.body?.fromCountry, 120, '')
        const fromEmail = text(req.body?.fromEmail, 254, '').toLowerCase()
        const message = text(req.body?.message, 5000)
        const photo = text(req.body?.photo, 2048, '')
        if ([fromName, fromCountry, fromEmail, message, photo].includes(null)
            || !isEmail(fromEmail)
            || !isImageReference(photo)) {
            return res.status(400).json({ error: 'Dữ liệu thư không hợp lệ' })
        }
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
                            <p>Xin chào <strong>${escapeHtml(penpal.name)}</strong>,</p>
                            <p>Bạn nhận được một bức thư từ <strong>${escapeHtml(fromName)}</strong>${fromCountry ? ' ở ' + escapeHtml(fromCountry) : ''}.</p>
                            <blockquote style="border-left:3px solid #66bb6a;padding:8px 16px;background:#f1f8e9;border-radius:4px;font-style:italic">
                                "${escapeHtml(message)}"
                            </blockquote>
                            ${hasPhoto ? '<p>📷 Kèm theo 1 ảnh trong thư (xem tại website).</p>' : ''}
                            <p>Liên hệ lại: <a href="mailto:${escapeHtml(fromEmail)}">${escapeHtml(fromEmail)}</a></p>
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

async function updatePenpal(req, res) {
    try {
        const validation = profilePayload(req.body, true)
        if (validation.error) return res.status(400).json({ error: validation.error })
        if (!Object.keys(validation.payload).length) {
            return res.status(400).json({ error: 'Không có trường nào để cập nhật' })
        }
        const penpal = await Penpal.findById(req.params.id)
        if (!penpal) return res.status(404).json({ error: 'Không tìm thấy penpal' })
        Object.assign(penpal, validation.payload)
        if (!penpal.name || !penpal.country || !penpal.contactEmail) {
            return res.status(400).json({ error: 'Thiếu trường bắt buộc: name, country, contactEmail' })
        }
        await penpal.save()
        const result = penpal.toObject()
        delete result.contactEmail
        res.json(result)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

router.put('/:id', adminOnly, updatePenpal)
router.patch('/:id', adminOnly, updatePenpal)

/* ── GET letters for a penpal (admin use) ── */
router.get('/:id/letters', adminOnly, async (req, res) => {
    try {
        const letters = await PenpalLetter.find({ toPenpalId: req.params.id }).sort({ createdAt: -1 })
        res.json(letters)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

/* ── DELETE penpal (admin) ── */
router.delete('/:id', adminOnly, async (req, res) => {
    try {
        await Penpal.findByIdAndDelete(req.params.id)
        res.json({ message: 'Đã xoá penpal' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router
