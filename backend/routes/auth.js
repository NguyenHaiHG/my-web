const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { rateLimit } = require('express-rate-limit')
const User = require('../models/User')
const { requireAuth } = require('../middleware/auth')

const router = express.Router()
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút.' },
})

function publicUser(user) {
    return {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
    }
}

router.post('/login', loginLimiter, async (req, res) => {
    const { username = '', password = '' } = req.body
    if (!process.env.JWT_SECRET) return res.status(503).json({ error: 'Server chưa cấu hình đăng nhập admin' })

    try {
        const user = await User.findOne({ username: username.trim().toLowerCase() }).select('+passwordHash')
        const valid = user && await bcrypt.compare(password, user.passwordHash)
        if (!valid) return res.status(401).json({ error: 'Sai tên đăng nhập hoặc mật khẩu' })

        user.lastLoginAt = new Date()
        await user.save()
        const token = jwt.sign(
            { sub: user._id.toString(), role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '8h' },
        )
        res.json({ token, user: publicUser(user) })
    } catch (err) {
        res.status(500).json({ error: err.message || 'Không thể đăng nhập' })
    }
})

router.get('/me', requireAuth, (req, res) => {
    res.json({ user: publicUser(req.user) })
})

router.post('/change-password', requireAuth, async (req, res) => {
    const { currentPassword = '', newPassword = '' } = req.body
    if (newPassword.length < 10) return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 10 ký tự' })

    try {
        const user = await User.findById(req.user._id).select('+passwordHash')
        if (!user || !await bcrypt.compare(currentPassword, user.passwordHash)) {
            return res.status(400).json({ error: 'Mật khẩu hiện tại không đúng' })
        }
        user.passwordHash = await bcrypt.hash(newPassword, 12)
        await user.save()
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ error: err.message || 'Không thể đổi mật khẩu' })
    }
})

module.exports = router
