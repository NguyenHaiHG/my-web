import { useState } from 'react'
import { useData } from '../context/DataContext'

const CATEGORY_INFO = {
    sewing:     { icon: '🧵', label: 'May vá' },
    embroidery: { icon: '🌺', label: 'Thêu thùa' },
    english:    { icon: '📚', label: 'Tiếng Anh' },
    digital:    { icon: '💻', label: 'Kỹ năng số' },
    cooking:    { icon: '🍜', label: 'Nấu ăn bản địa' },
    other:      { icon: '🌿', label: 'Khác' },
}

const DEFAULT_WORKSHOPS = [
    {
        id: 'ws-1',
        title: 'Thêu thổ cẩm truyền thống',
        desc: 'Học kỹ thuật thêu hoa văn dân tộc từ nghệ nhân địa phương. Tự tay tạo nên tác phẩm thổ cẩm độc đáo mang về nhà.',
        date: 'Thứ 7 hàng tuần',
        time: '08:00 – 11:00',
        category: 'embroidery',
        isFree: true,
        capacity: 12,
        status: 'upcoming',
    },
    {
        id: 'ws-2',
        title: 'Nấu ăn bản địa Hà Giang',
        desc: 'Chế biến các món đặc sản vùng cao: thắng cố, bánh cuốn Hà Giang, chè shan tuyết. Trải nghiệm văn hóa ẩm thực địa phương.',
        date: 'Chủ nhật hàng tuần',
        time: '09:00 – 12:00',
        category: 'cooking',
        isFree: false,
        price: '150.000đ',
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
]

export default function WorkshopPage() {
    const { workshops } = useData()
    const [filter, setFilter] = useState('all')

    const items = workshops.length > 0 ? workshops : DEFAULT_WORKSHOPS
    const filtered = filter === 'all' ? items : items.filter(w => w.category === filter)
    const categories = ['all', ...new Set(items.map(w => w.category).filter(Boolean))]

    return (
        <div className="page-enter">
            {/* ── Hero ── */}
            <section className="ws-hero">
                <div className="ws-hero-content container">
                    <span className="ws-hero-tag">🌿 HTX Trường Hải · Hà Giang</span>
                    <h1 className="ws-hero-h1">Trải nghiệm<br /><span className="ws-hero-hl">Workshop</span></h1>
                    <p className="ws-hero-sub">
                        Thêu thổ cẩm, nấu ăn bản địa, kỹ năng số — trải nghiệm thực tế
                        do cộng đồng vùng cao tổ chức, miễn phí hoặc chi phí nguyên liệu.
                    </p>
                    <div className="ws-hero-btns">
                        <a href="https://zalo.me/0385737705" target="_blank" rel="noreferrer"
                            className="btn3d btn3d-orange">
                            💬 Đăng ký qua Zalo
                        </a>
                        <a href="/ho-chieu" className="btn3d btn3d-outline-white">
                            🎖️ Nhận tem Hộ chiếu
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Passport stamp note ── */}
            <div className="container">
                <div className="ws-stamp-note">
                    <span className="ws-stamp-icon">🎖️</span>
                    <p>Tham gia workshop sẽ được <strong>đóng dấu Hộ chiếu Hà Giang</strong> và tích điểm trải nghiệm cộng đồng HTX Trường Hải.</p>
                    <a href="/ho-chieu" className="ws-stamp-link">Xem Hộ chiếu →</a>
                </div>
            </div>

            {/* ── Category filter ── */}
            {categories.length > 2 && (
                <div className="container">
                    <div className="ws-filters">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`ws-filter-btn${filter === cat ? ' ws-filter-active' : ''}`}
                                onClick={() => setFilter(cat)}
                            >
                                {cat === 'all'
                                    ? '✦ Tất cả'
                                    : `${CATEGORY_INFO[cat]?.icon ?? '🌿'} ${CATEGORY_INFO[cat]?.label ?? cat}`}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Workshop grid ── */}
            <section className="container py-section">
                {filtered.length === 0 ? (
                    <p className="ws-empty">Chưa có workshop nào trong danh mục này.</p>
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
                    <h2>Muốn tham gia workshop?</h2>
                    <p>Các workshop thường miễn phí hoặc chỉ thu tiền nguyên liệu. Đặt chỗ sớm vì số lượng có hạn.</p>
                    <div className="ng-cta-btns">
                        <a className="btn3d btn3d-orange" href="https://zalo.me/0385737705"
                            target="_blank" rel="noreferrer">💬 Zalo đăng ký</a>
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
    const statusLabel = ws.status === 'upcoming' ? 'Sắp diễn ra'
        : ws.status === 'ongoing' ? 'Đang diễn ra' : 'Đã kết thúc'
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
                <span className="ws-cat-chip">{cat.icon} {cat.label}</span>
                <h3 className="ws-card-title">{ws.title}</h3>
                {ws.desc && <p className="ws-card-desc">{ws.desc}</p>}
                <div className="ws-card-info">
                    {ws.date && <span>📅 {ws.date}</span>}
                    {ws.time && <span>🕐 {ws.time}</span>}
                    {ws.capacity && <span>👥 Tối đa {ws.capacity} người</span>}
                    {ws.instructor && <span>👩‍🏫 {ws.instructor}</span>}
                </div>
                <div className="ws-card-footer">
                    <span className={`ws-price-tag${ws.isFree ? ' ws-free' : ''}`}>
                        {ws.isFree ? '✓ Miễn phí' : ws.price || 'Liên hệ'}
                    </span>
                    <a href="https://zalo.me/0385737705" target="_blank" rel="noreferrer"
                        className="btn3d btn-sm btn3d-orange">
                        Đăng ký
                    </a>
                </div>
            </div>
        </article>
    )
}
