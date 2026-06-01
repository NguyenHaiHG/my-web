const express = require('express')
const router = express.Router()
const HeroSection = require('../models/HeroSection')

// Get hero section
router.get('/', async (req, res) => {
    try {
        const hero = await HeroSection.findOne().sort({ updatedAt: -1 })
        res.json(hero)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Update or create hero section (admin only)
router.post('/', async (req, res) => {
    try {
        const { imageUrl, title, subtitle, titleRich, subtitleRich, buttonLabel, buttonLink } = req.body
        let hero = await HeroSection.findOne()
        if (hero) {
            hero.imageUrl = imageUrl
            hero.title = title
            hero.subtitle = subtitle
            hero.titleRich = titleRich
            hero.subtitleRich = subtitleRich
            hero.buttonLabel = buttonLabel
            hero.buttonLink = buttonLink
            hero.updatedAt = Date.now()
            await hero.save()
        } else {
            hero = await HeroSection.create({ imageUrl, title, subtitle, titleRich, subtitleRich, buttonLabel, buttonLink })
        }
        res.json(hero)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router
