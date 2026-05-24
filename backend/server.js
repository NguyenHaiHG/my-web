require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const toursRouter = require('./routes/tours')
const productsRouter = require('./routes/products')
const postsRouter = require('./routes/posts')

const app = express()
const PORT = process.env.PORT || 5000

// Cho phép frontend gọi API
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:4173',
        'https://htxtruonghai.com',
        'https://www.htxtruonghai.com',
        'https://nguyenhaiHG.github.io',
        process.env.FRONTEND_URL,
    ].filter(Boolean),
}))

// Parse JSON body, giới hạn 10mb để hỗ trợ ảnh base64
app.use(express.json({ limit: '10mb' }))

// Routes
app.use('/api/tours', toursRouter)
app.use('/api/products', productsRouter)
app.use('/api/posts', postsRouter)

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// Kết nối MongoDB rồi mới lắng nghe request
// Xoá appName rỗng nếu có trong URI (gây lỗi trên Render)
const mongoURI = (process.env.MONGODB_URI || '').replace(/([&?])appName=(?=[&]|$)|[&?]appName=$/, '')
mongoose
    .connect(mongoURI)
    .then(() => {
        console.log('MongoDB connected')
        app.listen(PORT, () => console.log(`Backend đang chạy tại http://localhost:${PORT}`))
    })
    .catch(err => {
        console.error('Kết nối MongoDB thất bại:', err.message)
        process.exit(1)
    })
