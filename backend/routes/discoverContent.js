const express = require('express')
const router = express.Router()
const DiscoverContent = require('../models/DiscoverContent')

const defaultDiscoverContent = {
    slug: 'discover-home',
    hero: {
        eyebrow: 'Discover Hà Giang · Travel Journal',
        title: 'Một cuốn nhật ký hành trình\ncho Hà Giang thành phố',
        titleAccent: 'Cinematic, editorial, mobile-first',
        subtitle: 'Khám phá Hà Giang bằng nhịp kể chậm, hình ảnh lớn và những lớp nội dung có thể cập nhật trực tiếp từ Dashboard.',
        note: 'Không phải một app booking. Đây là nơi kể chuyện, chọn hành trình, và dẫn người xem vào bản sắc văn hoá địa phương.',
        imageUrl: '/hg-city-1.svg',
        primaryCtaLabel: 'Mở hộ chiếu số',
        primaryCtaLink: '/ho-chieu',
        secondaryCtaLabel: 'Xem Eco System',
        secondaryCtaLink: '/eco-system',
    },
    journeys: [
        {
            id: 'journey-city-layers',
            title: 'Hà Giang 1 · Thành phố nhiều lớp',
            route: 'Nghệ thuật phố chợ · kiến trúc cũ · quán nhỏ · nhịp sống buổi sớm',
            duration: '2 ngày · 1 đêm',
            description: 'Một hành trình nhẹ, phù hợp mở đầu chuyến đi: chợ lớn, chùa, không gian phố và các câu chuyện đời thường quanh trung tâm.',
            highlight: 'Khởi động chậm, chụp ảnh đẹp, dễ đi cùng gia đình',
            imageUrl: '/hg-city-1.svg',
            tags: ['City', 'Culture', 'Family'],
            accent: 'amber',
        },
        {
            id: 'journey-stone-loop',
            title: 'Hà Giang 2 · Vòng đá và chợ phiên',
            route: 'Đồng Văn · Mã Pí Lèng · chợ phiên · bản làng đá',
            duration: '3 ngày · 2 đêm',
            description: 'Cao nguyên đá, đèo cao và chợ phiên tạo nên nhịp ký ức rất Hà Giang. Tối giản các điểm dừng, tập trung trải nghiệm thật.',
            highlight: 'Hành trình biểu tượng để giới thiệu với du khách quốc tế',
            imageUrl: '/hg-city-2.svg',
            tags: ['Loop', 'Market', 'Landscape'],
            accent: 'slate',
        },
        {
            id: 'journey-eco-zone',
            title: 'Quang Trung Cultural Eco Zone',
            route: 'Nông nghiệp trải nghiệm · bảo tồn cảnh quan văn hoá · bảo vệ môi trường',
            duration: 'Nửa ngày · linh hoạt',
            description: 'Điểm dừng để học, trồng, thu hoạch, làm sạch và tham gia các hoạt động cộng đồng quanh tổ 5 phường Quang Trung.',
            highlight: 'Phù hợp trường học, nhóm nữ, và các chương trình ESG',
            imageUrl: '/hg-city-3.svg',
            tags: ['Eco', 'Community', 'Learning'],
            accent: 'emerald',
        },
        {
            id: 'journey-heritage-trail',
            title: 'Dấu ấn lịch sử · chùa · chợ lớn',
            route: 'Tuyến kể chuyện về lịch sử địa phương, tín ngưỡng, thương mại và đời sống văn hoá',
            duration: '1 ngày',
            description: 'Một tuyến kể chuyện cho người muốn hiểu Hà Giang qua di sản, chùa chiền, chợ và các mạch giao thương cũ.',
            highlight: 'Dùng làm tour dẫn chuyện, giáo dục, và trải nghiệm học sinh',
            imageUrl: '/hg-city-1.svg',
            tags: ['Heritage', 'Education', 'Story'],
            accent: 'rose',
        },
    ],
    themes: [
        { id: 'theme-heritage', name: 'Heritage trails', icon: '🏯', description: 'Chùa, chợ, phố cũ và những lớp ký ức sống trong sinh hoạt hằng ngày.', note: 'Đặt trọng tâm vào văn hoá sống, không biến điểm đến thành sân khấu.' },
        { id: 'theme-eco', name: 'Eco learning', icon: '🌾', description: 'Trải nghiệm nông nghiệp, bảo tồn cảnh quan và hoạt động xanh cho nhóm nhỏ.', note: 'Phù hợp trường học, gia đình, đội nhóm CSR/ESG.' },
        { id: 'theme-female-safe', name: 'Female-safe travel', icon: '💜', description: 'Nhịp đi chậm, hỗ trợ rõ ràng, ưu tiên an toàn và cảm giác yên tâm.', note: 'Dành cho người đi một mình, nhóm bạn nữ, và khách cần hỗ trợ đặc biệt.' },
        { id: 'theme-craft', name: 'Craft & market', icon: '🧵', description: 'Thổ cẩm, đồ thủ công, chợ địa phương và câu chuyện từ người làm ra sản phẩm.', note: 'Có thể gắn với mua sắm có trách nhiệm và quà tặng địa phương.' },
    ],
    stories: [
        {
            id: 'story-city-morning', badge: 'Morning note', title: 'Buổi sớm ở thành phố Hà Giang', subtitle: 'Chậm lại để nhìn thấy nhịp chợ, ánh đèn tắt dần, và tiếng gọi nhau rất nhẹ từ các góc phố.', body: 'Bắt đầu hành trình bằng một bước chân thật chậm. Đi qua chợ sớm, những biển hiệu cũ, quán trà nhỏ, và các mặt tiền nơi người dân đã quen nhau từ lâu. Đây là lớp Hà Giang dễ bỏ qua nếu chỉ lao thẳng lên loop, nhưng lại là lớp làm người ta nhớ.', quote: 'Một thành phố đẹp không chỉ vì cảnh, mà vì cách nó cho mình thời gian để quan sát.', imageUrl: '/hg-city-2.svg',
        },
        {
            id: 'story-eco-zone', badge: 'Field story', title: 'Quang Trung Cultural Eco Zone', subtitle: 'Một tuyến trải nghiệm nông nghiệp gắn với cảnh quan văn hoá, giáo dục môi trường và cộng đồng địa phương.', body: 'Khu trải nghiệm được thiết kế để khách không chỉ xem, mà còn làm cùng: trồng, thu hái, phân loại rác, chăm cảnh quan và hiểu giá trị của từng mảng đất. Đây là nơi phù hợp cho chương trình học tập, nhóm bạn trẻ và các hoạt động cộng đồng có tác động thật.', quote: 'Chúng tôi muốn khách rời đi với một cảm giác: mình đã để lại điều tốt hơn trước khi đến.', imageUrl: '/hg-city-3.svg',
        },
        {
            id: 'story-stone-market', badge: 'Journey note', title: 'Đồng Văn, chợ phiên và đèo đá', subtitle: 'Tuyến dành cho người muốn đọc Hà Giang như một bản đồ sống của thương mại, di cư và ký ức.', body: 'Không chỉ là cảnh quan. Chợ phiên, chùa, đường đèo, và những quán hàng nhỏ tạo nên một mạng lưới văn hoá rất riêng. Khi trình bày lại bằng ngôn ngữ điện ảnh, mỗi điểm dừng có thể là một khung hình đủ mạnh để người xem muốn đi tiếp.', quote: 'Cảnh đẹp giữ mắt, còn câu chuyện giữ người ở lại.', imageUrl: '/hg-city-1.svg',
        },
    ],
    featureArticle: {
        badge: 'Editorial story',
        title: 'Hà Giang không chỉ để đi qua, mà để đọc thật chậm',
        subtitle: 'Một ghi chép về thành phố Hà Giang 2, chợ lớn, chùa và những tuyến trải nghiệm nông nghiệp quanh Quang Trung Cultural Eco Zone.',
        body: 'Nếu coi Hà Giang chỉ là những khúc cua, ta sẽ bỏ lỡ phần đẹp nhất: đời sống văn hoá nằm ngay trong nhịp chợ sáng, mái chùa cũ, mùi bếp sớm và những cuộc trò chuyện ngắn giữa người bản địa với du khách. Hành trình mới của HTX Trường Hải không đặt mục tiêu đi thật nhanh, mà đặt mục tiêu giúp người xem hiểu địa phương theo từng lớp.\n\nTừ tuyến Hà Giang 1 đến Hà Giang 2, từ dấu tích lịch sử đến trải nghiệm nông nghiệp và bảo tồn cảnh quan, mỗi điểm dừng đều được kể như một khung hình có chiều sâu. Du khách có thể chụp ảnh, học làm cùng cộng đồng, và rời đi với cảm giác mình vừa đi qua một vùng văn hoá sống, không phải một bối cảnh tạm thời.\n\nĐó là lý do Discover được thiết kế như một tạp chí hành trình: ít nút, nhiều câu chuyện, và để admin có thể liên tục cập nhật ảnh cùng nội dung thật từ hiện trường.',
        quote: 'Du lịch bền vững bắt đầu từ cách ta nhìn địa phương: với sự tôn trọng, tò mò và đủ thời gian để lắng nghe.',
        imageUrl: '/hg-city-2.svg',
    },
    filmStrip: [
        { id: 'film-1', title: 'Chợ sớm Hà Giang', imageUrl: '/hg-city-1.svg' },
        { id: 'film-2', title: 'Nhịp sống phố núi', imageUrl: '/hg-city-2.svg' },
        { id: 'film-3', title: 'Dấu ấn di sản', imageUrl: '/hg-city-3.svg' },
        { id: 'film-4', title: 'Quang Trung Eco Zone', imageUrl: '/hg-city-1.svg' },
        { id: 'film-5', title: 'Bản sắc Hà Giang 2', imageUrl: '/hg-city-2.svg' },
    ],
    filmStripSettings: {
        speed: 'normal',
        pauseOnHover: true,
        lightboxOnClick: true,
        watermarkEnabled: true,
        watermarkText: 'HTX Truong Hai',
    },
    recommendations: [
        { id: 'rec-passport', badge: 'Start here', title: 'Bắt đầu bằng hộ chiếu số', description: 'Tạo hồ sơ trải nghiệm, thu tem, nhận chứng nhận và lưu lại hành trình của bạn.', ctaLabel: 'Mở hộ chiếu', ctaLink: '/ho-chieu', imageUrl: '/hg-city-1.svg' },
        { id: 'rec-eco', badge: 'Explore next', title: 'Đi tiếp sang Eco System', description: 'Xem điểm trải nghiệm, QR storytelling, và các điểm cộng đồng quanh Hà Giang.', ctaLabel: 'Mở Eco System', ctaLink: '/eco-system', imageUrl: '/hg-city-2.svg' },
        { id: 'rec-contact', badge: 'Need a guide?', title: 'Muốn được dẫn chuyện trực tiếp', description: 'Liên hệ đội ngũ để được tư vấn hành trình phù hợp với trường học, nhóm nữ hoặc đoàn nhỏ.', ctaLabel: 'Liên hệ ngay', ctaLink: '/contact', imageUrl: '/hg-city-3.svg' },
    ],
}

router.get('/', async (req, res) => {
    try {
        const content = await DiscoverContent.findOne({ slug: 'discover-home' }).sort({ updatedAt: -1 })
        if (!content) return res.json(defaultDiscoverContent)
        res.json(content)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const payload = { ...req.body, slug: 'discover-home' }
        const content = await DiscoverContent.findOneAndUpdate(
            { slug: 'discover-home' },
            payload,
            { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
        )
        res.json(content)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

module.exports = router
