const SiteContent = require('../models/SiteContent')

const CONTENT_SEED_VERSION = 1

const defaults = [
    ['home', 'hero', {
        title: 'Hợp tác xã Trường Hải',
        subtitle: 'Chạm vào thiên nhiên, sống cùng bản sắc Hà Giang',
        buttonLabel: 'Khám phá ngay',
        buttonHref: '/ha-giang-loop',
    }],
    ['home', 'highlights', {
        title: 'Trải nghiệm nổi bật',
        items: [
            { id: 'home-workshop', emoji: '🧵', title: 'Workshop Văn Hoá', body: 'Thêu thổ cẩm, nấu ăn bản địa, nhạc cụ dân tộc — trải nghiệm văn hoá do cộng đồng tổ chức.', buttonLabel: 'Đặt workshop →', buttonHref: '/workshop', highlight: true, sortOrder: 0 },
            { id: 'home-nature', emoji: '🌿', title: 'Học Bảo Tồn Thiên Nhiên', body: 'Quan sát hệ sinh thái, ghi nhật ký và lưu giữ những khoảnh khắc xanh của Hà Giang.', buttonLabel: 'Mở nhật ký →', buttonHref: '/nhat-ky-thien-nhien', highlight: true, sortOrder: 1 },
            { id: 'home-stay', emoji: '🛏️', title: 'Dorm Lưu Trú', body: 'Phòng dorm sạch sẽ, giá tốt tại Hà Giang, gần thiên nhiên và cộng đồng.', buttonLabel: 'Đặt phòng →', buttonHref: '/lien-he', highlight: true, sortOrder: 2 },
            { id: 'home-passport', emoji: '🎖️', title: 'Hộ Chiếu Hà Giang', body: 'Tạo hộ chiếu số, quét QR tại các điểm sinh thái, nhận tem và tải chứng nhận hành trình.', buttonLabel: 'Tạo hộ chiếu →', buttonHref: '/ho-chieu', highlight: false, sortOrder: 3 },
        ],
    }],
    ['workshop', 'hero', { title: 'Workshop bản địa', subtitle: 'Học từ người dân, làm bằng đôi tay và mang về một câu chuyện' }],
    ['ha-giang-loop', 'hero', { title: 'Hà Giang Loop', subtitle: 'Hành trình qua miền đá nở hoa' }],
    ['ha-giang-loop', 'faq', {
        title: 'Câu hỏi thường gặp',
        items: [
            { id: 'loop-faq-license', q: 'Có cần bằng lái xe máy không?', a: 'Bạn có thể chọn tự lái hoặc đi cùng tài xế địa phương.', sortOrder: 0 },
            { id: 'loop-faq-weather', q: 'Nên đi Hà Giang mùa nào?', a: 'Mỗi mùa đều có nét đẹp riêng; tháng 9 đến tháng 11 thường có lúa chín và hoa tam giác mạch.', sortOrder: 1 },
        ],
    }],
    ['blog', 'hero', { title: 'Câu chuyện từ Hà Giang', subtitle: 'Con người, văn hóa và những hành trình bền vững' }],
    ['library', 'hero', { title: 'Thư viện xanh', subtitle: 'Tài liệu và câu chuyện dành cho cộng đồng' }],
    ['nature', 'hero', { title: 'Nhật ký thiên nhiên', subtitle: 'Chia sẻ khoảnh khắc và ghi chép xanh của bạn' }],
    ['nature', 'guidelines', {
        title: 'Gợi ý ghi chép',
        items: [
            { id: 'nature-observe', title: 'Quan sát kỹ', body: 'Ghi lại tên loài, màu sắc, hành vi và môi trường xung quanh.', sortOrder: 0 },
            { id: 'nature-location', title: 'Thêm địa điểm', body: 'Địa điểm và thời tiết giúp ký ức thiên nhiên có thêm bối cảnh.', sortOrder: 1 },
            { id: 'nature-respect', title: 'Tôn trọng tự nhiên', body: 'Không làm tổn thương sinh vật hoặc môi trường chỉ để chụp ảnh.', sortOrder: 2 },
        ],
    }],
    ['penpal', 'hero', { title: 'Green Penpal', subtitle: 'Kết nối những người bạn yêu thiên nhiên trên toàn thế giới' }],
    ['penpal', 'guide', {
        title: 'Cách tham gia',
        items: [
            { id: 'penpal-register', icon: '📸', title: 'Đăng ký & Upload ảnh', body: 'Tạo hồ sơ với ảnh đại diện và giới thiệu bản thân', sortOrder: 0 },
            { id: 'penpal-find', icon: '🔍', title: 'Tìm penpal', body: 'Duyệt qua danh sách và tìm người phù hợp sở thích', sortOrder: 1 },
            { id: 'penpal-letter', icon: '✉️', title: 'Gửi thư kèm ảnh', body: 'Viết thư kỹ thuật số, đính kèm ảnh và gửi đi', sortOrder: 2 },
        ],
    }],
    ['passport', 'hero', { title: 'Green Passport', subtitle: 'Mỗi hành động xanh là một dấu chân đẹp trên hành trình' }],
    ['passport', 'steps', {
        title: 'Cách sử dụng Passport',
        items: [
            { id: 'passport-name', icon: '✍️', title: 'Tạo hộ chiếu', body: 'Nhập tên để tạo hộ chiếu', sortOrder: 0 },
            { id: 'passport-scan', icon: '📸', title: 'Check-in xanh', body: 'Quét QR tại điểm sinh thái hoặc tham gia hoạt động', sortOrder: 1 },
            { id: 'passport-points', icon: '🏅', title: 'Tích điểm', body: 'Thu thập tem và tích điểm hành trình', sortOrder: 2 },
            { id: 'passport-certificate', icon: '🎓', title: 'Nhận chứng nhận', body: 'Tải chứng nhận làm kỷ niệm', sortOrder: 3 },
        ],
    }],
    ['contact', 'hero', { title: 'Liên hệ với chúng tôi', subtitle: 'Hãy cùng tạo nên một hành trình tử tế tại Hà Giang' }],
    ['contact', 'details', {
        title: 'Thông tin liên hệ',
        items: [
            { id: 'contact-hotline', type: 'phone', title: 'Hotline', body: '0385.737.705', buttonHref: 'tel:0385737705', color: '#f97316', sortOrder: 0 },
            { id: 'contact-zalo', type: 'message', title: 'Zalo', body: '0385.737.705', buttonHref: 'https://zalo.me/0385737705', color: '#2563eb', sortOrder: 1 },
            { id: 'contact-whatsapp', type: 'chat', title: 'WhatsApp', body: '0385.737.705', buttonHref: 'https://wa.me/84385737705', color: '#25d366', sortOrder: 2 },
            { id: 'contact-address', type: 'map', title: 'Địa chỉ', body: 'Tổ 5 Quang Trung, Hà Giang', buttonHref: 'https://maps.app.goo.gl/Fm26ka14eoToFq68A', color: '#16a34a', sortOrder: 3 },
            { id: 'contact-hours', type: 'clock', title: 'Giờ làm việc', body: '08:00 – 18:00 hằng ngày', buttonHref: '#', color: '#7c3aed', sortOrder: 4 },
        ],
    }],
    ['global', 'header', { title: 'HTX Trường Hải', subtitle: 'Hà Giang' }],
    ['global', 'footer', { title: 'HTX Trường Hải', body: 'Du lịch cộng đồng và phát triển bền vững tại Hà Giang.' }],
]

async function seedSiteContent() {
    const operations = defaults.map(([page, section, content]) => ({
        updateOne: {
            filter: { page, section },
            update: { $setOnInsert: { page, section, content, seedVersion: CONTENT_SEED_VERSION } },
            upsert: true,
        },
    }))
    if (operations.length) await SiteContent.bulkWrite(operations, { ordered: false })
}

module.exports = { seedSiteContent, CONTENT_SEED_VERSION }
