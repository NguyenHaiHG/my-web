// Chạy một lần để nhập dữ liệu mẫu vào MongoDB
// Lệnh: node seed.js

require('dotenv').config()
const mongoose = require('mongoose')
const Tour = require('./models/Tour')
const Product = require('./models/Product')
const Post = require('./models/Post')

const tours = [
    {
        title: 'Tour Hà Giang Trọn Gói 3N2Đ',
        desc: 'Chinh phục Đồng Văn, Mèo Vạc, Mã Pí Lèng hùng vĩ. Ngắm nhìn toàn cảnh cao nguyên đá từ trên cao.',
        price: '2.500.000đ',
        img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&q=80',
        tag: 'tour',
        duration: '3N2Đ',
        maxGuests: 10,
        rating: 4.9,
        reviews: 128,
        category: 'premium',
        departureFrom: 'Hà Nội',
        location: 'Hà Giang',
        includes: ['transport', 'meal', 'guide', 'hotel', 'ticket'],
    },
    {
        title: 'Homestay Núi Đá',
        desc: "Ngủ giữa ruộng bậc thang Hoàng Su Phì, trải nghiệm văn hóa H'Mông bản địa.",
        price: '800.000đ',
        img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
        tag: 'tour',
        duration: '2N1Đ',
        maxGuests: 6,
        rating: 4.7,
        reviews: 85,
        category: 'budget',
        departureFrom: 'Hà Giang',
        location: 'Hoàng Su Phì',
        includes: ['meal', 'hotel'],
    },
    {
        title: 'Tour Trekking Đỉnh Mây',
        desc: 'Chinh phục đỉnh núi cao trên 2000m, ngắm biển mây kỳ ảo tại Tây Côn Lĩnh.',
        price: '1.800.000đ',
        img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
        tag: 'tour',
        duration: '2N1Đ',
        maxGuests: 8,
        rating: 5.0,
        reviews: 42,
        category: 'trek',
        departureFrom: 'Hà Giang',
        location: 'Tây Côn Lĩnh',
        includes: ['transport', 'meal', 'guide', 'ticket'],
    },
]

const products = [
    { title: 'Mật Ong Bạc Hà', desc: 'Mật ong nguyên chất từ hoa bạc hà vùng cao, hũ 500g', price: '280.000đ', img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80', tag: 'product' },
    { title: 'Trà Hoa Vàng Hà Giang', desc: 'Trà hoa vàng cổ thụ quý hiếm, hộp 100g', price: '350.000đ', img: 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?w=400&q=80', tag: 'product' },
    { title: 'Thịt Trâu Gác Bếp', desc: 'Đặc sản thịt trâu truyền thống hun khói, gói 300g', price: '220.000đ', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80', tag: 'product' },
]

const posts = [
    { title: 'Kinh nghiệm du lịch Hà Giang tháng 10', content: 'Tháng 10 là mùa lúa chín vàng trên ruộng bậc thang Hoàng Su Phì, đây là thời điểm đẹp nhất để ghé thăm...', author: 'Admin', date: '10/04/2026', img: 'https://images.unsplash.com/photo-1540975038511-ad92c58acd41?w=400&q=80', tag: 'post' },
    { title: 'Hướng dẫn order Taobao siêu tiết kiệm', content: 'Bí kíp order hàng Taobao giá rẻ, vận chuyển an toàn về Việt Nam chỉ trong 7-10 ngày...', author: 'Mod HTM', date: '08/04/2026', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80', tag: 'post' },
]

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Đã kết nối MongoDB')

    await Tour.deleteMany({})
    await Product.deleteMany({})
    await Post.deleteMany({})

    await Tour.insertMany(tours)
    await Product.insertMany(products)
    await Post.insertMany(posts)

    console.log('Đã nhập dữ liệu mẫu thành công!')
    mongoose.disconnect()
}

seed().catch(err => {
    console.error(err)
    process.exit(1)
})
