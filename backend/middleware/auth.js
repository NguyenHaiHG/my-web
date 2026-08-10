const jwt = require('jsonwebtoken')
const User = require('../models/User')

function readBearerToken(req) {
    const header = req.get('Authorization') || ''
    return header.startsWith('Bearer ') ? header.slice(7).trim() : ''
}

async function requireAuth(req, res, next) {
    const token = readBearerToken(req)
    const secret = process.env.JWT_SECRET
    if (!token || !secret) return res.status(401).json({ error: 'Bạn cần đăng nhập admin' })

    try {
        const payload = jwt.verify(token, secret)
        const user = await User.findById(payload.sub).select('_id username displayName role')
        if (!user) return res.status(401).json({ error: 'Phiên đăng nhập không còn hợp lệ' })
        req.user = user
        next()
    } catch {
        res.status(401).json({ error: 'Phiên đăng nhập đã hết hạn' })
    }
}

function requireAdmin(req, res, next) {
    if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Bạn không có quyền thực hiện thao tác này' })
    next()
}

function adminOnly(req, res, next) {
    requireAuth(req, res, () => requireAdmin(req, res, next))
}

function protectAdminMutations(req, res, next) {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next()
    adminOnly(req, res, next)
}

module.exports = { requireAuth, requireAdmin, adminOnly, protectAdminMutations }
