const express = require('express')
const router = express.Router()
const EcoSite = require('../models/EcoSite')
const EcoScan = require('../models/EcoScan')
const EcoStore = require('../models/EcoStore')
const EcoStoreVisit = require('../models/EcoStoreVisit')
const ConservationReport = require('../models/ConservationReport')

const SEED_SITES = [
    {
        code: 'VG-LUNGCAM',
        name: 'Làng văn hóa Lũng Cẩm',
        type: 'village',
        district: 'Đồng Văn',
        location: { lat: 23.266, lng: 105.338 },
        story: {
            title: 'Nhà trình tường và ký ức làng đá',
            content: 'Lũng Cẩm là không gian văn hóa của người Mông với kiến trúc trình tường, hàng rào đá và nhịp sống gắn với nương ngô.',
            language: 'vi',
        },
        badge: { id: 'stone-village', name: 'Ký ức làng đá', icon: '🏘️', color: '#f97316' },
        ecoPoints: 30,
        partnerBusiness: { name: 'Hợp tác xã Lũng Cẩm', offer: 'Giảm 10% tour trải nghiệm thêu lanh' },
    },
    {
        code: 'FM-HSP-TEA',
        name: 'Nông trại chè Shan Tuyết Hoàng Su Phì',
        type: 'farm',
        district: 'Hoàng Su Phì',
        location: { lat: 22.706, lng: 104.713 },
        story: {
            title: 'Cây chè cổ thụ và sinh kế xanh',
            content: 'Vùng chè Shan Tuyết là hệ sinh thái nông nghiệp đặc trưng, nơi cộng đồng chăm sóc cây cổ thụ và phát triển sinh kế bền vững.',
            language: 'vi',
        },
        badge: { id: 'tea-guardian', name: 'Người giữ rừng chè', icon: '🍃', color: '#16a34a' },
        ecoPoints: 35,
        partnerBusiness: { name: 'Nhóm chè bản Phùng', offer: 'Tặng 1 set trà khi đổi 120 điểm xanh' },
    },
    {
        code: 'EZ-NHOQUE',
        name: 'Vành đai sinh thái sông Nho Quế',
        type: 'eco-zone',
        district: 'Mèo Vạc',
        location: { lat: 23.166, lng: 105.367 },
        story: {
            title: 'Dòng sông xanh và quy tắc du lịch có trách nhiệm',
            content: 'Nho Quế là trục cảnh quan quan trọng của Cao nguyên đá. Du khách được khuyến khích giảm rác thải nhựa và tuân thủ tuyến tham quan sinh thái.',
            language: 'vi',
        },
        badge: { id: 'river-protector', name: 'Người bảo vệ Nho Quế', icon: '🌊', color: '#0ea5e9' },
        ecoPoints: 40,
        partnerBusiness: { name: 'Tổ thuyền sinh thái Nho Quế', offer: 'Ưu đãi 15% vé thuyền xanh' },
    },
    {
        code: 'CS-LUNGCU',
        name: 'Không gian văn hóa cột cờ Lũng Cú',
        type: 'cultural-site',
        district: 'Đồng Văn',
        location: { lat: 23.368, lng: 105.331 },
        story: {
            title: 'Cực Bắc và bản sắc biên cương',
            content: 'Lũng Cú không chỉ là điểm đến địa lý mà còn là không gian văn hóa cộng đồng nhiều dân tộc cùng gìn giữ ký ức biên cương.',
            language: 'vi',
        },
        badge: { id: 'north-point', name: 'Dấu ấn cực Bắc', icon: '🚩', color: '#dc2626' },
        ecoPoints: 25,
        partnerBusiness: { name: 'Tổ hợp tác bản Lô Lô Chải', offer: 'Giảm 10% sản phẩm thổ cẩm bản địa' },
    },
    {
        code: 'CS-CHUA-TRIEN-HG1',
        name: 'Điểm lịch sử Chùa Triền Hà Giang 1',
        type: 'cultural-site',
        district: 'Hà Giang 1',
        location: { lat: 22.831, lng: 104.983 },
        story: {
            title: 'Không gian tâm linh và ký ức phố núi',
            content: 'Điểm chùa gắn với lịch sử hình thành cộng đồng địa phương, nơi người dân gìn giữ nghi lễ và văn hóa ứng xử hài hòa với cảnh quan.',
            language: 'vi',
        },
        badge: { id: 'heritage-pagoda', name: 'Dấu ấn Chùa Triền', icon: '🛕', color: '#d97706' },
        ecoPoints: 28,
        partnerBusiness: { name: 'Nhóm hướng dẫn văn hóa Hà Giang 1', offer: 'Giảm 10% tour kể chuyện lịch sử địa phương' },
    },
    {
        code: 'MK-CHO-LON-HG1',
        name: 'Chợ Lớn Hà Giang 1',
        type: 'cultural-site',
        district: 'Hà Giang 1',
        location: { lat: 22.827, lng: 104.986 },
        story: {
            title: 'Nhịp thương hồ phố núi',
            content: 'Chợ Lớn Hà Giang 1 là điểm giao thương truyền thống, kết nối nông sản bản địa và sản phẩm thủ công của nhiều cộng đồng.',
            language: 'vi',
        },
        badge: { id: 'big-market', name: 'Nhịp Chợ Lớn', icon: '🏬', color: '#2563eb' },
        ecoPoints: 24,
        partnerBusiness: { name: 'Tiểu thương Chợ Lớn', offer: 'Ưu đãi combo nông sản sạch cho khách check-in' },
    },
    {
        code: 'MK-CHO-PHIEN-HG2',
        name: 'Chợ Phiên Hà Giang 2',
        type: 'cultural-site',
        district: 'Hà Giang 2',
        location: { lat: 22.835, lng: 104.992 },
        story: {
            title: 'Sắc màu chợ phiên vùng cao',
            content: 'Không gian chợ phiên cuối tuần với ẩm thực, thổ cẩm và âm nhạc dân tộc, phản ánh bản sắc sinh hoạt cộng đồng quanh Hà Giang 2.',
            language: 'vi',
        },
        badge: { id: 'weekend-market', name: 'Dấu Chợ Phiên', icon: '🧺', color: '#0ea5e9' },
        ecoPoints: 26,
        partnerBusiness: { name: 'Ban tổ chức chợ phiên', offer: 'Tặng phiếu trải nghiệm ẩm thực địa phương' },
    },
    {
        code: 'CS-BAOTANG-HG2',
        name: 'Không gian lịch sử cộng đồng Hà Giang 2',
        type: 'cultural-site',
        district: 'Hà Giang 2',
        location: { lat: 22.838, lng: 104.989 },
        story: {
            title: 'Ký ức cộng đồng qua hiện vật',
            content: 'Điểm trưng bày lịch sử địa phương giúp du khách hiểu tiến trình phát triển vùng đất, nghề truyền thống và câu chuyện gìn giữ bản sắc.',
            language: 'vi',
        },
        badge: { id: 'history-memory', name: 'Ký Ức Hà Giang 2', icon: '🏛️', color: '#7c3aed' },
        ecoPoints: 22,
        partnerBusiness: { name: 'Câu lạc bộ lịch sử địa phương', offer: 'Ưu đãi tour giáo dục cộng đồng' },
    },
    {
        code: 'EZ-QUANGTRUNG-T5',
        name: 'Quang Trung Cultural Eco Zone - Tổ 5',
        type: 'eco-zone',
        district: 'Phường Quang Trung',
        location: { lat: 22.825, lng: 104.994 },
        story: {
            title: 'Nông nghiệp trải nghiệm và bảo tồn cảnh quan văn hóa',
            content: 'Không gian thực hành nông nghiệp cộng đồng, bảo tồn cảnh quan văn hóa tổ 5 và hoạt động bảo vệ môi trường với mô hình phân loại rác, trồng cây, tái tạo mảng xanh.',
            language: 'vi',
        },
        badge: { id: 'qt-eco-guardian', name: 'Người Gìn Giữ Quang Trung', icon: '🌱', color: '#16a34a' },
        ecoPoints: 45,
        partnerBusiness: { name: 'Quang Trung Cultural Eco Zone', offer: 'Combo trải nghiệm nông nghiệp + workshop môi trường cho nhóm gia đình' },
    },
]

const SEED_STORES = [
    {
        code: 'ST-HG-LANH-01',
        name: 'Nhà lanh bản Lô Lô Chải',
        category: 'craft',
        district: 'Đồng Văn',
        address: 'Bản Lô Lô Chải, Lũng Cú, Đồng Văn',
        imageUrl: 'https://images.unsplash.com/photo-1578852604046-0a8f59f4d4f0?auto=format&fit=crop&w=1200&q=80',
        story: {
            title: 'Xưởng lanh thủ công',
            content: 'Du khách tự tay se sợi lanh, nhuộm chàm và in sáp ong cùng nghệ nhân địa phương.',
        },
        experience: {
            label: 'Mini workshop dệt lanh',
            description: 'Trải nghiệm 60 phút cùng nghệ nhân và nhận postcard họa tiết Mông.',
            durationMinutes: 60,
        },
        stamp: { id: 'stamp-lanh', name: 'Dấu Lanh Biên Cương', icon: '🧵', color: '#0ea5e9' },
        reward: { visitPoints: 16, spendMultiplier: 0.18 },
        offers: [
            { title: 'Ưu đãi workshop', detail: 'Giảm 10% vé workshop dệt lanh', minPoints: 30 },
            { title: 'Quà tặng postcard', detail: 'Tặng postcard khi check-in lần đầu', minPoints: 0 },
        ],
        contact: {
            phone: '0385 737 705',
            bookingLink: 'https://wa.me/84385737705',
        },
    },
    {
        code: 'ST-HG-TEA-02',
        name: 'Tea Bar Shan Tuyết Hoàng Su Phì',
        category: 'food',
        district: 'Hoàng Su Phì',
        address: 'Bản Phùng, Hoàng Su Phì',
        imageUrl: 'https://images.unsplash.com/photo-1464306076886-debede6cb52b?auto=format&fit=crop&w=1200&q=80',
        story: {
            title: 'Không gian trà cao nguyên',
            content: 'Nếm 5 dòng trà Shan Tuyết và học nghi thức pha trà bản địa.',
        },
        experience: {
            label: 'Tea tasting bản địa',
            description: 'Set nếm trà theo mùa, kết hợp kể chuyện về cây chè cổ thụ.',
            durationMinutes: 45,
        },
        stamp: { id: 'stamp-tea', name: 'Dấu Người Giữ Chè', icon: '🍵', color: '#16a34a' },
        reward: { visitPoints: 14, spendMultiplier: 0.15 },
        offers: [
            { title: 'Tea flight', detail: 'Giảm 12% combo nếm trà', minPoints: 40 },
            { title: 'Tea souvenir', detail: 'Tặng sample trà 25g', minPoints: 20 },
        ],
        contact: {
            phone: '0832 311 689',
            bookingLink: 'https://zalo.me/0832311689',
        },
    },
    {
        code: 'ST-HG-HOMESTAY-03',
        name: 'Đá Nở Eco Homestay',
        category: 'homestay',
        district: 'Mèo Vạc',
        address: 'Thung lũng Nho Quế, Mèo Vạc',
        imageUrl: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
        story: {
            title: 'Lưu trú gắn với cảnh quan',
            content: 'Nghỉ tại nhà trình tường cải tạo theo hướng bền vững, giảm nhựa dùng một lần.',
        },
        experience: {
            label: 'Đêm bản địa xanh',
            description: 'Chương trình ngắm sao, đốt lửa nhỏ và kể chuyện địa phương.',
            durationMinutes: 120,
        },
        stamp: { id: 'stamp-night', name: 'Dấu Đêm Cao Nguyên', icon: '🌌', color: '#7c3aed' },
        reward: { visitPoints: 22, spendMultiplier: 0.1 },
        offers: [
            { title: 'Giảm phòng', detail: 'Giảm 8% phòng nghỉ khi đủ 80 điểm', minPoints: 80 },
            { title: 'Bữa tối bản địa', detail: 'Tặng món đặc sản theo mùa', minPoints: 50 },
        ],
        contact: {
            phone: '0944 555 222',
            bookingLink: '',
        },
    },
]

async function ensureSeedSites() {
    await EcoSite.bulkWrite(
        SEED_SITES.map(site => ({
            updateOne: {
                filter: { code: site.code },
                update: { $setOnInsert: site },
                upsert: true,
            },
        }))
    )
}

async function ensureSeedStores() {
    const count = await EcoStore.countDocuments()
    if (count === 0) {
        await EcoStore.insertMany(SEED_STORES)
    }
}

router.get('/sites', async (req, res) => {
    try {
        await ensureSeedSites()
        const sites = await EcoSite.find().sort({ district: 1, name: 1 })
        res.json(sites)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.post('/sites', async (req, res) => {
    try {
        const created = await EcoSite.create(req.body)
        res.json(created)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.put('/sites/:id', async (req, res) => {
    try {
        const updated = await EcoSite.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!updated) return res.status(404).json({ error: 'Site not found' })
        res.json(updated)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.delete('/sites/:id', async (req, res) => {
    try {
        await EcoSite.findByIdAndDelete(req.params.id)
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.post('/scan', async (req, res) => {
    try {
        const { userKey, siteCode } = req.body
        if (!userKey || !siteCode) {
            return res.status(400).json({ error: 'userKey và siteCode là bắt buộc' })
        }

        await ensureSeedSites()
        const site = await EcoSite.findOne({ code: siteCode })
        if (!site) {
            return res.status(404).json({ error: 'Không tìm thấy điểm scan' })
        }

        const existing = await EcoScan.findOne({ userKey, siteCode })
        if (existing) {
            return res.json({
                alreadyCollected: true,
                pointsEarned: 0,
                site,
                story: site.story,
                badge: site.badge,
                message: 'Bạn đã mở khóa điểm này trước đó.',
            })
        }

        await EcoScan.create({
            userKey,
            siteCode,
            earnedPoints: site.ecoPoints,
            badgeId: site.badge.id,
        })

        site.stats.totalScans += 1
        site.stats.uniqueUsers += 1
        await site.save()

        res.json({
            alreadyCollected: false,
            pointsEarned: site.ecoPoints,
            site,
            story: site.story,
            badge: site.badge,
            message: `Đã mở khóa ${site.badge.name} và nhận ${site.ecoPoints} điểm xanh!`,
        })
    } catch (err) {
        if (err.code === 11000) {
            return res.json({
                alreadyCollected: true,
                pointsEarned: 0,
                message: 'Bạn đã mở khóa điểm này trước đó.',
            })
        }
        res.status(500).json({ error: err.message })
    }
})

router.get('/leaderboard', async (req, res) => {
    try {
        const rows = await EcoScan.aggregate([
            {
                $group: {
                    _id: '$userKey',
                    totalPoints: { $sum: '$earnedPoints' },
                    badges: { $sum: 1 },
                    lastScanAt: { $max: '$scannedAt' },
                },
            },
            { $sort: { totalPoints: -1, lastScanAt: 1 } },
            { $limit: 30 },
        ])

        res.json(rows.map((r, idx) => ({
            rank: idx + 1,
            userKey: r._id,
            totalPoints: r.totalPoints,
            badges: r.badges,
            lastScanAt: r.lastScanAt,
        })))
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.get('/business-dashboard', async (req, res) => {
    try {
        await ensureSeedSites()
        const sites = await EcoSite.find().sort({ 'stats.totalScans': -1 })

        const scansBySite = await EcoScan.aggregate([
            { $group: { _id: '$siteCode', totalPointsIssued: { $sum: '$earnedPoints' }, totalBadgeUnlocks: { $sum: 1 } } },
        ])
        const scanMap = Object.fromEntries(scansBySite.map(s => [s._id, s]))

        const data = sites.map(site => ({
            code: site.code,
            name: site.name,
            type: site.type,
            partnerBusiness: site.partnerBusiness,
            totalScans: site.stats.totalScans,
            uniqueUsers: site.stats.uniqueUsers,
            totalPointsIssued: scanMap[site.code]?.totalPointsIssued || 0,
            totalBadgeUnlocks: scanMap[site.code]?.totalBadgeUnlocks || 0,
        }))

        res.json(data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.get('/stores', async (req, res) => {
    try {
        await ensureSeedStores()
        const stores = await EcoStore.find().sort({ district: 1, name: 1 })
        res.json(stores)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.post('/stores', async (req, res) => {
    try {
        const created = await EcoStore.create(req.body)
        res.json(created)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.post('/store-visit', async (req, res) => {
    try {
        const { userKey, storeCode, spendAmount, notes } = req.body
        if (!userKey || !storeCode) {
            return res.status(400).json({ error: 'userKey và storeCode là bắt buộc' })
        }

        await ensureSeedStores()
        const store = await EcoStore.findOne({ code: storeCode })
        if (!store) {
            return res.status(404).json({ error: 'Không tìm thấy cửa hàng' })
        }

        const safeSpend = Number(spendAmount) > 0 ? Number(spendAmount) : 0
        const date = new Date()
        const visitDateKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`
        const variablePoints = Math.floor(safeSpend * (store.reward?.spendMultiplier || 0))
        const totalPoints = (store.reward?.visitPoints || 0) + variablePoints

        const existing = await EcoStoreVisit.findOne({ userKey, storeCode, visitDateKey })
        if (existing) {
            return res.json({
                alreadyCheckedInToday: true,
                pointsEarned: 0,
                store,
                stamp: store.stamp,
                message: 'Bạn đã check-in cửa hàng này hôm nay.',
            })
        }

        await EcoStoreVisit.create({
            userKey,
            storeCode,
            visitDateKey,
            spendAmount: safeSpend,
            earnedPoints: totalPoints,
            stampId: store.stamp.id,
            notes: notes || '',
            visitedAt: date,
        })

        const totalUniqueVisitors = await EcoStoreVisit.distinct('userKey', { storeCode }).then(v => v.length)
        store.stats.totalVisits += 1
        store.stats.uniqueVisitors = totalUniqueVisitors
        store.stats.totalRevenueTracked += safeSpend
        await store.save()

        res.json({
            alreadyCheckedInToday: false,
            pointsEarned: totalPoints,
            store,
            stamp: store.stamp,
            message: `Check-in thành công tại ${store.name}. Bạn nhận ${totalPoints} điểm trải nghiệm!`,
        })
    } catch (err) {
        if (err.code === 11000) {
            return res.json({
                alreadyCheckedInToday: true,
                pointsEarned: 0,
                message: 'Bạn đã check-in cửa hàng này hôm nay.',
            })
        }
        res.status(500).json({ error: err.message })
    }
})

router.get('/store-leaderboard', async (req, res) => {
    try {
        const rows = await EcoStoreVisit.aggregate([
            {
                $group: {
                    _id: '$userKey',
                    totalStorePoints: { $sum: '$earnedPoints' },
                    totalStoreVisits: { $sum: 1 },
                    lastVisitAt: { $max: '$visitedAt' },
                },
            },
            { $sort: { totalStorePoints: -1, lastVisitAt: 1 } },
            { $limit: 30 },
        ])

        res.json(rows.map((r, idx) => ({
            rank: idx + 1,
            userKey: r._id,
            totalStorePoints: r.totalStorePoints,
            totalStoreVisits: r.totalStoreVisits,
            lastVisitAt: r.lastVisitAt,
        })))
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.get('/store-insights', async (req, res) => {
    try {
        await ensureSeedStores()
        const stores = await EcoStore.find().sort({ 'stats.totalVisits': -1, name: 1 })

        const visitAgg = await EcoStoreVisit.aggregate([
            {
                $group: {
                    _id: '$storeCode',
                    totalPointsIssued: { $sum: '$earnedPoints' },
                    totalSpendTracked: { $sum: '$spendAmount' },
                    todayVisits: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        '$visitDateKey',
                                        `${new Date().getUTCFullYear()}-${String(new Date().getUTCMonth() + 1).padStart(2, '0')}-${String(new Date().getUTCDate()).padStart(2, '0')}`,
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
        ])
        const visitMap = Object.fromEntries(visitAgg.map(v => [v._id, v]))

        res.json(stores.map(store => ({
            code: store.code,
            name: store.name,
            district: store.district,
            category: store.category,
            experienceLabel: store.experience?.label || '',
            totalVisits: store.stats.totalVisits,
            uniqueVisitors: store.stats.uniqueVisitors,
            totalRevenueTracked: store.stats.totalRevenueTracked,
            totalPointsIssued: visitMap[store.code]?.totalPointsIssued || 0,
            todayVisits: visitMap[store.code]?.todayVisits || 0,
            topOffer: store.offers?.[0]?.title || '',
        })))
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.post('/reports', async (req, res) => {
    try {
        const { siteCode, category, severity, description, reporter } = req.body
        if (!siteCode || !description) {
            return res.status(400).json({ error: 'siteCode và description là bắt buộc' })
        }

        await ensureSeedSites()
        const site = await EcoSite.findOne({ code: siteCode })
        if (!site) return res.status(404).json({ error: 'Site không tồn tại' })

        const created = await ConservationReport.create({
            siteCode,
            siteName: site.name,
            category: category || 'other',
            severity: severity || 'medium',
            description,
            reporter: reporter || 'Community member',
        })
        res.json(created)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.get('/reports', async (req, res) => {
    try {
        const status = req.query.status
        const query = status ? { status } : {}
        const reports = await ConservationReport.find(query).sort({ createdAt: -1 }).limit(120)
        res.json(reports)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.get('/conservation-summary', async (req, res) => {
    try {
        const summary = await ConservationReport.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    open: { $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] } },
                    inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
                    resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
                    highSeverity: { $sum: { $cond: [{ $eq: ['$severity', 'high'] }, 1, 0] } },
                },
            },
        ])

        const bySite = await ConservationReport.aggregate([
            {
                $group: {
                    _id: '$siteCode',
                    siteName: { $first: '$siteName' },
                    openIssues: { $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] } },
                    resolvedIssues: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
                    total: { $sum: 1 },
                },
            },
            { $sort: { openIssues: -1, total: -1 } },
        ])

        res.json({
            overview: summary[0] || { total: 0, open: 0, inProgress: 0, resolved: 0, highSeverity: 0 },
            bySite,
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router
