const SiteContent = require('../models/SiteContent')

const CONTENT_SEED_VERSION = 1

const defaults = [
    ['home', 'hero', {
        title: 'Hợp tác xã Trường Hải',
        subtitle: 'Bảo tồn văn hoá sống — số hoá di sản cùng cộng đồng Hà Giang',
        buttonLabel: 'Số hoá di sản',
        buttonHref: '/so-hoa-di-san',
    }],
    ['home', 'highlights', {
        title: 'Trải nghiệm nổi bật',
        items: [
            { id: 'home-heritage', emoji: '🏛️', title: 'Số hoá di sản', body: 'Ghi lại ngôn ngữ, thổ cẩm, lễ hội và cảnh quan — thư viện số, nhật ký thiên nhiên và hộ chiếu QR.', buttonLabel: 'Xem chương trình →', buttonHref: '/so-hoa-di-san', highlight: true, sortOrder: 0 },
            { id: 'home-workshop', emoji: '🧵', title: 'Workshop Văn Hoá', body: 'Thêu thổ cẩm, nấu ăn bản địa, nhạc cụ dân tộc — trải nghiệm văn hoá do cộng đồng tổ chức.', buttonLabel: 'Đặt workshop →', buttonHref: '/workshop', highlight: true, sortOrder: 1 },
            { id: 'home-tours', emoji: '🗺️', title: 'Khám phá Hà Giang', body: 'Hà Giang Loop, tour cộng đồng và hộ chiếu số — đi cùng người địa phương.', buttonLabel: 'Xem hành trình →', buttonHref: '/tours', highlight: true, sortOrder: 2 },
            { id: 'home-shop', emoji: '🛍️', title: 'Cửa hàng & lưu trú', body: 'Thổ cẩm, đặc sản địa phương và dorm tại Hà Giang 2, gần thiên nhiên và cộng đồng.', buttonLabel: 'Xem cửa hàng →', buttonHref: '/san-pham', highlight: false, sortOrder: 3 },
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
    ['heritage', 'hero', {
        title: 'Số hoá di sản Hà Giang',
        subtitle: 'Ghi lại ngôn ngữ, nghề thủ công, lễ hội và cảnh quan — để cộng đồng vẫn kể được câu chuyện của mình, không biến di sản thành sân khấu.',
        buttonLabel: 'Mở thư viện số',
        buttonHref: '/thu-vien',
    }],
    ['heritage', 'why', {
        kicker: 'Vấn đề',
        title: 'Di sản đang biến mất nhanh hơn ta kể lại',
        body: 'Tại Hà Giang 1, Hà Giang 2 và Tổ 5 phường Quang Trung, tri thức Tày, H’Mông, Dao, Lô Lô vẫn sống trong lời kể, hoa văn thổ cẩm, bài then và mâm cơm — nhưng phần lớn chưa được ghi lại có hệ thống. Đô thị hoá, thế hệ nghệ nhân già đi, và nhiều tri thức chỉ tồn tại miệng.',
        body2: 'HTX Trường Hải số hoá để cộng đồng làm chủ kho tư liệu của mình: lưu trữ, gắn câu chuyện vào đúng nơi nó thuộc về, rồi đưa tri thức trở lại đời sống qua workshop, nhật ký thiên nhiên và hộ chiếu QR — không đóng khung di sản trong bảo tàng.',
    }],
    ['heritage', 'principles', {
        title: 'Nguyên tắc',
        items: [
            { id: 'hd-pr-consent', emoji: '🤝', title: 'Đồng thuận trước khi ghi', body: 'Thu âm, chụp, quay chỉ khi nghệ nhân và gia đình đồng ý. Người kể được ghi tên, ngữ cảnh và quyền rút tư liệu.', sortOrder: 0 },
            { id: 'hd-pr-own', emoji: '🏠', title: 'Cộng đồng làm chủ dữ liệu', body: 'Kho số không phải của khách du lịch. HTX giữ hộ; cộng đồng quyết định mục nào công khai, mục nào chỉ dùng nội bộ.', sortOrder: 1 },
            { id: 'hd-pr-live', emoji: '🔥', title: 'Di sản sống, không sân khấu', body: 'Số hoá đi cùng thực hành: thêu, nấu, then, xòe. Không tách hoa văn khỏi người làm nghề, không biến lễ hội thành show.', sortOrder: 2 },
            { id: 'hd-pr-open', emoji: '🌐', title: 'Mở, song ngữ, gắn với nơi chốn', body: 'Tư liệu gắn QR tại làng nghề, chợ phiên, chùa và điểm sinh thái. Việt — Anh để thế hệ trẻ và khách hiểu đúng ngữ cảnh.', sortOrder: 3 },
        ],
    }],
    ['heritage', 'communities', {
        title: 'Cộng đồng',
        items: [
            { id: 'hd-c-tay', emoji: '🏡', title: 'Tày', body: 'Then, xòe, nhà sàn, ẩm thực bản địa và câu chuyện gia đình quanh Tổ 5 Quang Trung — Hà Giang 2.', tags: ['Then', 'Xòe', 'Nhà sàn', 'Ẩm thực'], sortOrder: 0 },
            { id: 'hd-c-hmong', emoji: '🧵', title: 'H’Mông', body: 'Thổ cẩm, thêu, khèn và Gầu Tào. Hoa văn, quy trình nhuộm/thêu và người làm nghề được lưu cùng nhau.', tags: ['Thổ cẩm', 'Khèn', 'Gầu Tào'], sortOrder: 1 },
            { id: 'hd-c-dao', emoji: '👘', title: 'Dao', body: 'Lễ cấp sắc, trang phục, bài cúng và tri thức rừng — ghi với sự đồng thuận của già làng và gia đình.', tags: ['Cấp sắc', 'Trang phục', 'Tri thức rừng'], sortOrder: 2 },
            { id: 'hd-c-lolo', emoji: '🥁', title: 'Lô Lô', body: 'Cộng đồng ít người; trang phục, lễ hội và lời kể cần được lưu trước khi khoảng trống thế hệ rộng thêm.', tags: ['Trang phục', 'Lễ hội', 'Lời kể'], sortOrder: 3 },
        ],
    }],
    ['heritage', 'pillars', {
        title: 'Chúng tôi số hoá',
        items: [
            { id: 'home-heritage-lang', emoji: '🗣️', title: 'Ngôn ngữ & lời kể', body: 'Từ ngữ Tày, H’Mông, Dao, Lô Lô; cách phát âm, truyện cổ, câu chuyện gia đình. Mỗi bản ghi kèm người kể, nơi chốn và ngữ cảnh — không tách lời khỏi người.', sortOrder: 0 },
            { id: 'home-heritage-craft', emoji: '🧵', title: 'Nghề & hoa văn', body: 'Thổ cẩm, thêu, khèn, then: hoa văn, quy trình, dụng cụ và nghệ nhân. Thư viện số lưu cả “làm thế nào” chứ không chỉ ảnh đẹp.', sortOrder: 1 },
            { id: 'home-heritage-fest', emoji: '🍜', title: 'Lễ hội & ẩm thực', body: 'Gầu Tào, then, xòe, mâm cơm bản địa: ảnh, video, công thức và thứ tự nghi lễ để thế hệ sau vẫn nấu và tổ chức được.', sortOrder: 2 },
            { id: 'home-heritage-land', emoji: '🌿', title: 'Cảnh quan sống', body: 'Nhật ký thiên nhiên, điểm di sản QR và hộ chiếu số — gắn câu chuyện với làng nghề, chợ phiên, chùa, nương và khu sinh thái Tổ 5.', sortOrder: 3 },
        ],
    }],
    ['heritage', 'tools', {
        title: 'Công cụ',
        items: [
            { id: 'hd-tool-lib', emoji: '📚', title: 'Thư viện số', body: 'Kho tri thức bản địa: ngôn ngữ, văn hoá, thủ công, ẩm thực và truyện cổ — phân loại theo dân tộc, chủ đề và ngữ cảnh.', buttonLabel: 'Vào thư viện', buttonHref: '/thu-vien', sortOrder: 0 },
            { id: 'hd-tool-nature', emoji: '🌿', title: 'Nhật ký thiên nhiên', body: 'Cộng đồng ghi loài cây, chim, côn trùng tại khu di sản. Dữ liệu bảo tồn cảnh quan, không chỉ ảnh du lịch.', buttonLabel: 'Mở nhật ký', buttonHref: '/nhat-ky-thien-nhien', sortOrder: 1 },
            { id: 'hd-tool-pass', emoji: '🎖️', title: 'Hộ chiếu QR', body: 'Quét tem tại làng văn hoá, chợ phiên, chùa, nông trại chè và điểm sinh thái — mở câu chuyện đúng nơi di sản đang sống.', buttonLabel: 'Tạo hộ chiếu', buttonHref: '/ho-chieu', sortOrder: 2 },
            { id: 'hd-tool-ws', emoji: '🎓', title: 'Workshop sống', body: 'Học thêu, nấu, nhạc cụ với nghệ nhân. Số hoá không thay thực hành — khách học, cộng đồng giữ nghề, kho số được bổ sung.', buttonLabel: 'Xem workshop', buttonHref: '/workshop', sortOrder: 3 },
        ],
    }],
    ['heritage', 'steps', {
        title: 'Quy trình',
        items: [
            { id: 'hd-s1', n: '01', icon: '🎙️', title: 'Ghi cùng cộng đồng', body: 'Thu âm, chụp, quay tại chỗ với sự đồng ý. Ghi rõ người kể, dân tộc, địa điểm và mục đích sử dụng.', sortOrder: 0 },
            { id: 'hd-s2', n: '02', icon: '📚', title: 'Lưu vào thư viện', body: 'Phân loại theo dân tộc, chủ đề, phát âm và ngữ cảnh. Mục nhạy cảm có thể chỉ dùng nội bộ.', sortOrder: 1 },
            { id: 'hd-s3', n: '03', icon: '🔳', title: 'Gắn QR tại điểm', body: 'Du khách và người dân mở tư liệu tại làng nghề, chợ, chùa, điểm sinh thái — không tách di sản khỏi nơi chốn.', sortOrder: 2 },
            { id: 'hd-s4', n: '04', icon: '🤝', title: 'Mời đóng góp tiếp', body: 'Nhật ký, penpal, tình nguyện viên và gia đình tiếp tục bổ sung. Kho số là việc làm dài hạn, không phải dự án một lần.', sortOrder: 3 },
        ],
    }],
    ['heritage', 'impact', {
        title: 'Tác động',
        items: [
            { id: 'hd-i1', value: '4', title: 'Dân tộc cùng lưu giữ', body: 'Tày, H’Mông, Dao, Lô Lô — mỗi cộng đồng được ghi với ngữ cảnh riêng, không gộp thành “văn hoá vùng cao”.', sortOrder: 0 },
            { id: 'hd-i2', value: '7+', title: 'Điểm di sản gắn QR', body: 'Làng văn hoá Lũng Cẩm, chè Shan Tuyết Hoàng Su Phì, chùa Triện, chợ lớn, chợ phiên, không gian Hà Giang 2 và Tổ 5 Quang Trung.', sortOrder: 1 },
            { id: 'hd-i3', value: '4', title: 'Lớp công cụ trên web', body: 'Thư viện số, nhật ký thiên nhiên, hộ chiếu QR và workshop — một hệ sinh thái, không phải trang giới thiệu.', sortOrder: 2 },
            { id: 'hd-i4', value: 'Cộng đồng', title: 'Làm chủ kho tư liệu', body: 'HTX giữ hộ; nghệ nhân và gia đình quyết định công khai. Minh chứng cho mô hình bảo tồn do người địa phương dẫn dắt.', sortOrder: 3 },
        ],
    }],
    ['heritage', 'closing', {
        title: 'Bạn có tư liệu cần giữ lại?',
        body: 'Ảnh gia đình, bài then, hoa văn thổ cẩm, câu chuyện ông bà — gửi cho HTX Trường Hải để cùng số hoá tử tế, có đồng thuận và gắn đúng nơi chốn.',
        buttonLabel: 'Liên hệ gửi tư liệu',
        buttonHref: '/lien-he',
        button2Label: 'Kết nối penpal',
        button2Href: '/penpal',
    }],
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

    await SiteContent.updateOne(
        { page: 'home', section: 'hero', 'content.buttonLabel': { $in: ['Khám phá ngay', 'Kham pha ngay'] } },
        { $set: { 'content.buttonLabel': 'Số hoá di sản', 'content.buttonHref': '/so-hoa-di-san' } },
    )
}

module.exports = { seedSiteContent, CONTENT_SEED_VERSION }
