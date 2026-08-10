const { rateLimit } = require('express-rate-limit')

function submissionLimiter(limit, message) {
    return rateLimit({
        windowMs: 15 * 60 * 1000,
        limit,
        standardHeaders: 'draft-7',
        legacyHeaders: false,
        message: { error: message },
    })
}

function text(value, maxLength, fallback = '') {
    if (value === undefined || value === null) return fallback
    if (typeof value !== 'string') return null
    const trimmed = value.trim()
    return trimmed.length <= maxLength ? trimmed : null
}

function stringList(value, maxItems = 20, maxItemLength = 80) {
    if (value === undefined || value === null || value === '') return []
    if (!Array.isArray(value) || value.length > maxItems) return null
    const values = value.map(item => text(item, maxItemLength))
    return values.some(item => item === null) ? null : values.filter(Boolean)
}

function isEmail(value) {
    return typeof value === 'string'
        && value.length <= 254
        && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isImageReference(value) {
    return value === ''
        || (typeof value === 'string'
            && value.length <= 2048
            && (/^https?:\/\//i.test(value) || value.startsWith('/api/uploads/')))
}

module.exports = {
    submissionLimiter,
    text,
    stringList,
    isEmail,
    isImageReference,
}
