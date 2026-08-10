require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const { MongoMemoryServer } = require('mongodb-memory-server')

const toursRouter = require('./routes/tours')
const productsRouter = require('./routes/products')
const postsRouter = require('./routes/posts')
const workshopsRouter = require('./routes/workshops')
const ordersRouter = require('./routes/orders')
const libraryRouter = require('./routes/library')
const reviewsRouter = require('./routes/reviews')
const workshopRegsRouter = require('./routes/workshopRegs')

const volunteersRouter = require('./routes/volunteers')
const communityImagesRouter = require('./routes/communityImages')
const heroSectionRouter = require('./routes/heroSection')
const discoverContentRouter = require('./routes/discoverContent')
const ecoSystemRouter = require('./routes/ecoSystem')
const siteImagesRouter = require('./routes/siteImages')
const natureMemoryImagesRouter = require('./routes/natureMemoryImages')
const natureMemoriesRouter = require('./routes/natureMemories')
const penpalsRouter = require('./routes/penpals')
const uploadsRouter = require('./routes/uploads')
const authRouter = require('./routes/auth')
const passportsRouter = require('./routes/passports')
const siteContentRouter = require('./routes/siteContent')
const homeFilmStripRouter = require('./routes/homeFilmStrip')
const ensureAdminUser = require('./utils/ensureAdmin')
const { seedSiteContent } = require('./utils/seedSiteContent')
const { protectAdminMutations } = require('./middleware/auth')

const app = express()
app.set('trust proxy', 1)
const PORT = process.env.PORT || 5000
let dbConnected = false
let memoryMongo = null

// Khi DB offline, trả lỗi ngay thay vì treo request.
mongoose.set('bufferCommands', false)

// Cho phép frontend gọi API
app.use(cors({
    origin: (origin, cb) => {
        const allowed = [
            'http://localhost:5173',
            'http://localhost:4173',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:4173',
            'https://htxtruonghai.com',
            'https://www.htxtruonghai.com',
            'https://nguyenhaiHG.github.io',
            process.env.FRONTEND_URL,
        ].filter(Boolean)
        // Cho phép request không có origin (Postman, health check...)
        if (!origin || allowed.includes(origin)) return cb(null, true)
        cb(new Error('CORS blocked: ' + origin))
    },
    credentials: true,
}))

// Parse JSON body, giới hạn 10mb để hỗ trợ ảnh base64
app.use(express.json({ limit: '10mb' }))

// Routes
app.use('/api/auth', authRouter)
app.use('/api/passports', passportsRouter)
app.use('/api/site-content', siteContentRouter)
app.use('/api/home-film-strip', homeFilmStripRouter)
app.use('/api/tours', protectAdminMutations, toursRouter)
app.use('/api/products', protectAdminMutations, productsRouter)
app.use('/api/posts', protectAdminMutations, postsRouter)
app.use('/api/workshops', protectAdminMutations, workshopsRouter)
app.use('/api/library', protectAdminMutations, libraryRouter)
app.use('/api/reviews', reviewsRouter)

app.use('/api/workshop-regs', workshopRegsRouter)
app.use('/api/orders', ordersRouter)

app.use('/api/volunteers', volunteersRouter)
app.use('/api/community-images', protectAdminMutations, communityImagesRouter)
app.use('/api/hero-section', protectAdminMutations, heroSectionRouter)
app.use('/api/discover-content', protectAdminMutations, discoverContentRouter)
app.use('/api/eco-system', ecoSystemRouter)
app.use('/api/site-images', protectAdminMutations, siteImagesRouter)
app.use('/api/nature-memory-images', protectAdminMutations, natureMemoryImagesRouter)
app.use('/api/nature-memories', natureMemoriesRouter)
app.use('/api/penpals', penpalsRouter)
app.use('/api/uploads', uploadsRouter)

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', dbConnected })
})

// Lắng nghe request trước để frontend không bị CORS/network block khi DB đang khởi động.
app.listen(PORT, () => console.log(`Backend đang chạy tại http://localhost:${PORT}`))

async function connectDatabase() {
    // Xoá appName rỗng nếu có trong URI (gây lỗi trên Render)
    const mongoURI = (process.env.MONGODB_URI || '').replace(/([&?])appName=(?=[&]|$)|[&?]appName=$/, '')

    try {
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 1500,
            connectTimeoutMS: 1500,
        })
        dbConnected = true
        console.log('MongoDB connected')
        await ensureAdminUser()
        await seedSiteContent()
        return
    } catch (err) {
        console.warn('MongoDB local chưa sẵn sàng:', err.message)
    }

    if (process.env.NODE_ENV === 'production') {
        dbConnected = false
        console.error('MongoDB production không kết nối được; từ chối lưu tạm để tránh mất dữ liệu.')
        return
    }

    try {
        memoryMongo = await MongoMemoryServer.create()
        await mongoose.connect(memoryMongo.getUri(), {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000,
        })
        dbConnected = true
        console.log('Mongo Memory Server connected for local development')
        await ensureAdminUser()
        await seedSiteContent()
    } catch (err) {
        dbConnected = false
        console.error('Không thể khởi động Mongo Memory Server:', err.message)
    }
}

connectDatabase()

process.on('SIGINT', async () => {
    if (memoryMongo) await memoryMongo.stop()
    process.exit(0)
})
