const bcrypt = require('bcryptjs')
const User = require('../models/User')

async function ensureAdminUser() {
    const username = (process.env.ADMIN_USERNAME || 'haihg').trim().toLowerCase()
    const displayName = (process.env.ADMIN_DISPLAY_NAME || 'Admin').trim()
    const password = process.env.ADMIN_PASSWORD
    const configuredHash = process.env.ADMIN_PASSWORD_HASH

    const existing = await User.findOne({ username })
    if (existing) {
        if (existing.displayName !== displayName) {
            existing.displayName = displayName
            await existing.save()
        }
        return existing
    }

    if (!password && !configuredHash) {
        console.warn('Chưa tạo admin: cần ADMIN_PASSWORD hoặc ADMIN_PASSWORD_HASH trong biến môi trường.')
        return null
    }

    const passwordHash = configuredHash || await bcrypt.hash(password, 12)
    const user = await User.create({ username, displayName, passwordHash, role: 'admin' })
    console.log(`Admin "${user.username}" đã được khởi tạo an toàn trong MongoDB.`)
    return user
}

module.exports = ensureAdminUser
