import { useState } from 'react'
import { useData } from '../context/DataContext'

const CATEGORY_INFO = {
    sewing: { icon: '🧵', label: 'May vá', labelEn: 'Sewing' },
    embroidery: { icon: '🌺', label: 'Thêu thùa', labelEn: 'Embroidery' },
    english: { icon: '📚', label: 'Tiếng Anh', labelEn: 'English' },
    digital: { icon: '💻', label: 'Kỹ năng số', labelEn: 'Digital Skills' },
    cooking: { icon: '🍜', label: 'Nấu ăn bản địa', labelEn: 'Local Cooking' },
    other: { icon: '🌿', label: 'Khác', labelEn: 'Other' },
}

const HIDDEN_CATEGORIES = new Set(['sewing', 'digital'])

const DEFAULT_WORKSHOPS = [
    {
        id: 'ws-1',
        title: 'Thêu thổ cẩm truyền thống / Traditional Brocade Embroidery',
        desc: 'Học kỹ thuật thêu hoa văn dân tộc từ nghệ nhân địa phương. Tự tay tạo nên tác phẩm thổ cẩm độc đáo mang về nhà. / Learn ethnic embroidery patterns from local artisans and craft your own unique brocade piece to take home.',
        date: 'Thứ 7 hàng tuần / Every Saturday',
        time: '08:00 – 11:00',
        category: 'embroidery',
        isFree: true,
        capacity: 12,
        status: 'upcoming',
    },
    {
        id: 'ws-2',
        title: 'Nấu ăn bản địa Hà Giang / Ha Giang Local Cooking',
        desc: 'Chế biến các món đặc sản vùng cao: bánh cuốn Hà Giang, chè shan tuyết. Trải nghiệm văn hóa ẩm thực địa phương. / Cook highland specialties: Ha Giang rolled rice cake, Shan Tuyet tea dishes. Experience authentic local food culture.',
        date: 'Chủ nhật hàng tuần / Every Sunday',
        time: '09:00 – 12:00',
        category: 'cooking',
        isFree: false,
        price: '150.000đ / ~6 USD',
        capacity: 10,
        status: 'upcoming',
    },
    {
        id: 'ws-3',
        title: 'Kỹ năng số cho phụ nữ vùng cao',
        desc: 'Học dùng smartphone, mạng xã hội, bán hàng online. Dành riêng cho phụ nữ dân tộc thiểu số muốn mở rộng cơ hội kinh tế.',
        date: 'Thứ 4 hàng tuần',
        time: '14:00 – 16:30',
        category: 'digital',
        isFree: true,
        capacity: 15,
        status: 'upcoming',
    },
    {
        id: 'ws-4',
        title: 'May trang phục dân tộc',
        desc: 'Tìm hiểu và thực hành may trang phục truyền thống người Mông, Dao, Tày — kết hợp hoa văn và kỹ thuật cắt may bản địa.',
        date: 'Thứ 3 & Thứ 5',
        time: '07:30 – 11:00',
        category: 'sewing',
        isFree: true,
        capacity: 8,
        status: 'upcoming',
    },
    {
        id: 'ws-5',
        title: 'Tiếng Anh Du Lịch – English for Tourism',
        desc: 'Học giao tiếp cơ bản với khách nước ngoài: chào hỏi, giới thiệu địa danh, mô tả sản phẩm, hỏi giá. Phù hợp cho bà con và các bé muốn nói chuyện với du khách. / Basic English for greeting guests, describing local attractions, products and prices. Suitable for community members and children.',
        date: 'Thứ 2, Thứ 4, Thứ 6',
        time: '08:30 – 10:00',
        category: 'english',
        isFree: true,
        capacity: 20,
        status: 'upcoming',
        instructor: 'Tình nguyện viên / Volunteer teacher',
    },
]

export default function WorkshopPage() {
    const { workshops } = useData()
    const [filter, setFilter] = useState('all')

    const sourceItems = workshops.length > 0 ? workshops : DEFAULT_WORKSHOPS
    const items = sourceItems.filter(w => !HIDDEN_CATEGORIES.has(w.category))
    const filtered = filter === 'all' ? items : items.filter(w => w.category === filter)
    const categories = ['all', ...new Set(items.map(w => w.category).filter(Boolean))]
    return (
        <div className="page-enter">
            {/* ── Hero ── */}
            <section className="ws-hero">
                <div className="ws-hero-content container">
                    <span className="ws-hero-tag">🌿 BookHaGiang · Workshop & Experiences</span>
                    <h1 className="ws-hero-h1">Trải nghiệm<br /><span className="ws-hero-hl">Workshop</span></h1>
                    <p className="ws-hero-sub">
                        Khám phá văn hóa bản địa qua các lớp học thực hành cùng người dân địa phương.
                    </p>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', marginTop: -4, marginBottom: 8 }}>
                        Discover local culture through hands-on classes with community members.
                    </p>
                    <div className="ws-hero-btns">
                        <a href="https://zalo.me/0385737705" target="_blank" rel="noreferrer"
                            className="btn3d btn3d-orange">
                            💬 Đặt workshop qua Zalo / Book via Zalo
                        </a>
                        <a href="https://wa.me/84385737705" className="btn3d btn3d-outline-white" target="_blank" rel="noreferrer">
                            WhatsApp
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Workshop schedule ── */}
            {categories.length > 2 && (
                <div className="container">
                    <div className="section-header-center" style={{ marginBottom: 10 }}>
                        <h2 style={{ marginBottom: 6 }}>Lịch workshop mở / Open Workshops</h2>
                        <p style={{ color: '#64748b', margin: 0 }}>Danh sách lớp đang mở theo chủ đề để bạn chọn nhanh. / Browse open classes by topic.</p>
                    </div>
                    <div className="ws-filters">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`ws-filter-btn${filter === cat ? ' ws-filter-active' : ''}`}
                                onClick={() => setFilter(cat)}
                            >
                                {cat === 'all'
                                    ? '✦ Tất cả / All'
                                    : `${CATEGORY_INFO[cat]?.icon ?? '🌿'} ${CATEGORY_INFO[cat]?.label ?? cat}${CATEGORY_INFO[cat]?.labelEn ? ' / ' + CATEGORY_INFO[cat].labelEn : ''}`}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Workshop grid ── */}
            <section className="container py-section">
                {filtered.length === 0 ? (
                    <p className="ws-empty">Chưa có workshop nào trong danh mục này. / No workshops in this category yet.</p>
                ) : (
                    <div className="ws-grid">
                        {filtered.map(ws => (
                            <WorkshopCard key={ws.id || ws._id} ws={ws} />
                        ))}
                    </div>
                )}
            </section>

            {/* ── CTA ── */}
            <section className="ng-cta">
                <div className="ng-cta-overlay" />
                <div className="container ng-cta-inner">
                    <h2>Cần tư vấn báo giá nhóm?<span style={{ display: 'block', fontSize: '0.6em', fontWeight: 400, opacity: 0.85 }}>Need a custom quote for your group?</span></h2>
                    <p>BookHaGiang hỗ trợ lịch trình riêng cho gia đình, nhóm bạn và tour học đường.</p>
                    <p style={{ fontSize: 14, opacity: 0.8, fontStyle: 'italic', marginTop: -8 }}>Custom schedules are available for families, friends, and school groups.</p>
                    <div className="ng-cta-btns">
                        <a className="btn3d btn3d-orange" href="https://zalo.me/0385737705"
                            target="_blank" rel="noreferrer">💬 Đặt qua Zalo</a>
                        <a className="btn3d btn3d-outline-white" href="https://wa.me/84385737705"
                            target="_blank" rel="noreferrer">WhatsApp</a>
                    </div>
                </div>
            </section>
        </div>
    )
}

function WorkshopCard({ ws }) {
    const cat = CATEGORY_INFO[ws.category] ?? CATEGORY_INFO.other
    const statusLabel = ws.status === 'upcoming' ? 'Sắp diễn ra / Upcoming'
        : ws.status === 'ongoing' ? 'Đang diễn ra / Ongoing' : 'Đã kết thúc / Ended'
    const statusCls = ws.status === 'upcoming' ? 'ws-status-soon'
        : ws.status === 'ongoing' ? 'ws-status-live' : 'ws-status-done'

    return (
        <article className="ws-card">
            <div className={`ws-card-img${!ws.img ? ' ws-card-img-empty' : ''}`}>
                {ws.img
                    ? <img src={ws.img} alt={ws.title} loading="lazy" />
                    : <span className="ws-card-emoji">{cat.icon}</span>
                }
                <span className={`ws-status-badge ${statusCls}`}>{statusLabel}</span>
            </div>
            <div className="ws-card-body">
                <span className="ws-cat-chip">{cat.icon} {cat.label}{cat.labelEn ? <span style={{ opacity: .6, fontSize: 11, marginLeft: 3 }}>/ {cat.labelEn}</span> : ''}</span>
                <h3 className="ws-card-title">{ws.title}</h3>
                {ws.desc && <p className="ws-card-desc">{ws.desc}</p>}
                <div className="ws-card-info">
                    {ws.date && <span>📅 {ws.date}</span>}
                    {ws.time && <span>🕐 {ws.time}</span>}
                    {ws.capacity && <span>👥 Tối đa {ws.capacity} người / {ws.capacity} spots</span>}
                    {ws.instructor && <span>👩‍🏫 {ws.instructor}</span>}
                </div>
                <div className="ws-card-footer">
                    <span className={`ws-price-tag${ws.isFree ? ' ws-free' : ''}`}>
                        {ws.isFree ? '✓ Miễn phí / Free' : ws.price || 'Liên hệ / Contact'}
                    </span>
                    <a href="https://zalo.me/0385737705" target="_blank" rel="noreferrer"
                        className="btn3d btn-sm btn3d-orange">
                        Đặt lịch / Book
                    </a>
                </div>
            </div>
        </article>
    )
}
