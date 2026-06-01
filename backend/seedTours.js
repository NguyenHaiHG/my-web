// Seed script for Hagiangloop & Thiện nguyện tours
const mongoose = require('mongoose')
const Tour = require('./models/Tour')

const tours = [
    {
        title: 'Hagiangloop 3 ngày 2 đêm (Easyrider)',
        desc: 'Khám phá Hà Giang Loop cùng easyrider bản địa, trải nghiệm 3 ngày 2 đêm với cung đường đẹp nhất miền núi phía Bắc. Bao gồm xe máy, hướng dẫn viên, ăn nghỉ, bảo hiểm.',
        price: '4.500.000đ',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
        duration: '3N2Đ',
        maxGuests: 12,
        category: 'premium',
        location: 'Hà Giang',
        includes: ['transport', 'meal', 'guide', 'hotel'],
        departureFrom: 'Hà Nội/Hà Giang',
        tag: 'loop',
    },
    {
        title: 'Hagiangloop 2 ngày 1 đêm (Easyrider)',
        desc: 'Tour ngắn ngày cho khách ít thời gian, vẫn đủ trải nghiệm các điểm nổi bật của Hà Giang Loop cùng easyrider bản địa.',
        price: '3.500.000đ',
        img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&q=80',
        duration: '2N1Đ',
        maxGuests: 12,
        category: 'budget',
        location: 'Hà Giang',
        includes: ['transport', 'meal', 'guide', 'hotel'],
        departureFrom: 'Hà Nội/Hà Giang',
        tag: 'loop',
    },
    {
        title: 'Hagiangloop 4 ngày 3 đêm (Easyrider)',
        desc: 'Hành trình dài hơn, khám phá sâu hơn các bản làng, trải nghiệm văn hóa, cảnh quan và ẩm thực Hà Giang.',
        price: '5.500.000đ',
        img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80',
        duration: '4N3Đ',
        maxGuests: 12,
        category: 'premium',
        location: 'Hà Giang',
        includes: ['transport', 'meal', 'guide', 'hotel'],
        departureFrom: 'Hà Nội/Hà Giang',
        tag: 'loop',
    },
    {
        title: 'Tour thiện nguyện 5 ngày',
        desc: 'Tham gia hành trình thiện nguyện 5 ngày cùng người bản địa: trồng cây gây rừng, hỗ trợ trường học, trải nghiệm cuộc sống vùng cao. Lịch trình linh hoạt, kết nối cộng đồng.',
        price: 'Liên hệ',
        img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
        duration: '5N4Đ',
        maxGuests: 15,
        category: 'trek',
        location: 'Hà Giang & các bản làng',
        includes: ['transport', 'meal', 'guide', 'hotel'],
        departureFrom: 'Hà Nội/Hà Giang',
        tag: 'volunteer',
    },
    {
        title: 'Tour thiện nguyện 10 ngày',
        desc: 'Hành trình thiện nguyện dài ngày: trồng rừng, xây dựng, hỗ trợ cộng đồng, trải nghiệm sâu sắc văn hóa bản địa. Dẫn dắt bởi người bản địa, kết nối bền vững.',
        price: 'Liên hệ',
        img: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=800&q=80',
        duration: '10N9Đ',
        maxGuests: 15,
        category: 'trek',
        location: 'Hà Giang & các bản làng',
        includes: ['transport', 'meal', 'guide', 'hotel'],
        departureFrom: 'Hà Nội/Hà Giang',
        tag: 'volunteer',
    },
    {
        title: 'Tour trải nghiệm 3N2Đ tại thành phố Hà Giang: Trekking',
        desc: 'Leo núi, trekking, ăn uống và nấu nướng kiểu tự nhiên, khám phá thiên nhiên và văn hóa bản địa ngay tại thành phố Hà Giang.',
        price: '2.500.000đ',
        img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        duration: '3N2Đ',
        maxGuests: 10,
        category: 'trek',
        location: 'Thành phố Hà Giang',
        includes: ['transport', 'meal', 'guide'],
        departureFrom: 'Hà Giang',
        tag: 'city',
    },
    {
        title: 'Tour trải nghiệm 3N2Đ tại thành phố Hà Giang: Workshop',
        desc: 'Đi chợ, nấu nướng, vẽ tranh, thêu, tạo trang phục truyền thống, học tiếng Việt cùng người bản địa. Trải nghiệm văn hóa sâu sắc.',
        price: '2.800.000đ',
        img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80',
        duration: '3N2Đ',
        maxGuests: 10,
        category: 'premium',
        location: 'Thành phố Hà Giang',
        includes: ['meal', 'guide', 'ticket'],
        departureFrom: 'Hà Giang',
        tag: 'city',
    },
]

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/webblog')
    await Tour.deleteMany({})
    await Tour.insertMany(tours)
    console.log('Seeded tours!')
    process.exit()
}

seed()
