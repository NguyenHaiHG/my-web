import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ArrowRight, Calendar, ChevronRight, Phone } from 'lucide-react'
import { useData } from '../context/DataContext'

const SERVICES = [
    { icon: '🖨️', name: 'In ấn', desc: 'In tài liệu, ảnh, bản đồ', price: 'Từ 2k/trang' },
    { icon: '🚿', name: 'Tắm nhanh', desc: 'Nước nóng 24/7', price: '20k/lượt' },
    { icon: '🛏️', name: 'Dorm', desc: 'Phòng ngủ tập thể, an toàn', price: 'Từ 80k/đêm' },
    { icon: '👕', name: 'Giặt lấy nhanh', desc: 'Xong trong 2–3 tiếng', price: '25k/kg' },
    { icon: '🔋', name: 'Sạc pin', desc: 'Điện thoại & laptop', price: 'Miễn phí' },
    { icon: '☕', name: 'Coffee & Trà', desc: 'Cà phê, trà, nước ép tươi', price: 'Từ 15k' },
    { icon: '🍔', name: 'Đồ ăn nhanh', desc: 'Mì, bánh mì, snack', price: 'Từ 20k' },
    { icon: '🍲', name: 'Mâm cơm địa phương', desc: 'Đặt trước 2h · Cơm lam, thắng cố, rau rừng', price: 'Từ 80k/người' },
]

const DISCOVER_DAYS = [
    { day: 'Ngày 1', title: 'Hà Giang → Đồng Văn', desc: 'Cột cờ Lũng Cú · Dinh Vua Mèo · Phố cổ Đồng Văn' },
    { day: 'Ngày 2', title: 'Mã Pí Lèng → Mèo Vạc', desc: 'Đèo Mã Pí Lèng huyền thoại · Sông Nho Quế' },
    { day: 'Ngày 3', title: 'Quản Bạ → Về nhà', desc: 'Núi đôi Quản Bạ · Cổng trời · Hà Giang 2' },
]

const WORKSHOPS_SAMPLE = [
    { icon: '🪡', name: 'May & Thêu thổ cẩm', sub: 'Học từ nghệ nhân dân gian' },
    { icon: '🗣️', name: 'Tiếng Anh giao tiếp', sub: 'Cho easyrider & hướng dẫn viên' },
    { icon: '💻', name: 'Kỹ năng số', sub: 'Điện thoại, bán hàng online' },
    { icon: '🍲', name: 'Ẩm thực dân tộc', sub: 'Nấu ăn cùng gia đình 4 thế hệ' },
]

const PRODUCTS_SAMPLE = [
    { id: 'p1', title: 'Khăn thêu thổ cẩm', price: '120.000đ' },
    { id: 'p2', title: 'Túi vải dân tộc', price: '85.000đ' },
    { id: 'p3', title: 'Mật ong rừng Hà Giang', price: '150.000đ/hũ' },
    { id: 'p4', title: 'Rượu ngô Men Lá', price: '80.000đ/chai' },
]

const TABS = [
    { id: 'discover', label: 'Discover', icon: '🗺️' },
    { id: 'create', label: 'Create', icon: '🎨' },
    { id: 'shop', label: 'Shop', icon: '🛍️' },
    { id: 'service', label: 'Service', icon: '🛎️' },
    { id: 'blog', label: 'Blog', icon: '📝' },
]

export default function QuickMenu() {
    const [open, setOpen] = useState(false)
    const [tab, setTab] = useState('discover')
    const navigate = useNavigate()
    const { tours, products, posts } = useData()

    const go = (path) => { navigate(path); setOpen(false) }

    const displayProducts = products.length > 0 ? products : PRODUCTS_SAMPLE

    return (
        <>
            {/* ── Floating hamburger button ── */}
            <button
                className="qm-float-btn"
                onClick={() => setOpen(true)}
                aria-label="Quick menu"
            >
                <span className="qm-hamburger">
                    <span /><span /><span />
                </span>
            </button>

            {/* ── Backdrop ── */}
            {open && <div className="qm-backdrop" onClick={() => setOpen(false)} />}

            {/* ── Bottom sheet ── */}
            <div className={`qm-sheet ${open ? 'qm-sheet-open' : ''}`}>
                <div className="qm-sheet-handle" />

                {/* Tab row + close */}
                <div className="qm-sheet-header">
                    <div className="qm-tabs">
                        {TABS.map(tb => (
                            <button
                                key={tb.id}
                                className={`qm-tab ${tab === tb.id ? 'qm-tab-active' : ''}`}
                                onClick={() => setTab(tb.id)}
                            >
                                <span className="qm-tab-icon">{tb.icon}</span>
                                <span className="qm-tab-label">{tb.label}</span>
                            </button>
                        ))}
                    </div>
                    <button className="qm-close" onClick={() => setOpen(false)}>
                        <X size={18} />
                    </button>
                </div>

                {/* ── Panel content ── */}
                <div className="qm-content">

                    {/* DISCOVER */}
                    {tab === 'discover' && (
                        <div className="qm-panel">
                            <div className="qm-panel-hero" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=900&q=80)' }}>
                                <div className="qm-panel-hero-overlay" />
                                <div className="qm-panel-hero-text">
                                    <h3>🗺️ Hà Giang Loop</h3>
                                    <p>Hành trình khám phá cao nguyên đá huyền thoại</p>
                                </div>
                            </div>
                            <div className="qm-discover-days">
                                {DISCOVER_DAYS.map((d, i) => (
                                    <div key={i} className="qm-day-card">
                                        <span className="qm-day-badge">{d.day}</span>
                                        <div>
                                            <strong>{d.title}</strong>
                                            <p>{d.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {tours.length > 0 && (
                                <div className="qm-tour-chips">
                                    {tours.slice(0, 3).map(tour => (
                                        <span key={tour.id} className="qm-tour-chip" onClick={() => go('/tours')}>
                                            🏔️ {tour.title}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <button className="btn3d btn3d-orange btn-full" onClick={() => go('/tours')}>
                                Đặt lịch Hà Giang Loop <ArrowRight size={15} />
                            </button>
                        </div>
                    )}

                    {/* CREATE */}
                    {tab === 'create' && (
                        <div className="qm-panel">
                            <p className="qm-panel-desc">
                                🎓 Workshop miễn phí — dành cho phụ nữ dân tộc & du khách yêu thích trải nghiệm thực
                            </p>
                            <div className="qm-create-grid">
                                {WORKSHOPS_SAMPLE.map((w, i) => (
                                    <div key={i} className="qm-create-card" onClick={() => go('/workshop')}>
                                        <span className="qm-create-icon">{w.icon}</span>
                                        <div>
                                            <strong>{w.name}</strong>
                                            <p>{w.sub}</p>
                                        </div>
                                        <ChevronRight size={14} color="#f97316" />
                                    </div>
                                ))}
                            </div>
                            <button className="btn3d btn3d-green btn-full" onClick={() => go('/workshop')}>
                                Xem tất cả workshop <ArrowRight size={15} />
                            </button>
                        </div>
                    )}

                    {/* SHOP */}
                    {tab === 'shop' && (
                        <div className="qm-panel">
                            <p className="qm-panel-desc">🛍️ Sản phẩm thổ cẩm & đặc sản địa phương Hà Giang</p>
                            <div className="qm-shop-grid">
                                {displayProducts.slice(0, 4).map((p, i) => (
                                    <div key={p.id || i} className="qm-shop-card" onClick={() => go('/san-pham')}>
                                        <div className="qm-shop-img" style={p.img ? { backgroundImage: `url(${p.img})` } : undefined}>
                                            {!p.img && <span>🏪</span>}
                                        </div>
                                        <div className="qm-shop-info">
                                            <strong>{p.title}</strong>
                                            <span className="qm-shop-price">{p.price || (p.desc?.slice(0, 20))}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="btn3d btn3d-orange btn-full" onClick={() => go('/san-pham')}>
                                Xem tất cả sản phẩm <ArrowRight size={15} />
                            </button>
                        </div>
                    )}

                    {/* SERVICE */}
                    {tab === 'service' && (
                        <div className="qm-panel">
                            <div className="qm-service-notice">
                                📍 Chỉ phục vụ tại <strong>Hà Giang 1</strong> &amp; <strong>Hà Giang 2</strong>
                            </div>
                            <div className="qm-service-grid">
                                {SERVICES.map((s, i) => (
                                    <div key={i} className="qm-service-card">
                                        <span className="qm-service-icon">{s.icon}</span>
                                        <div className="qm-service-info">
                                            <strong>{s.name}</strong>
                                            <p>{s.desc}</p>
                                            <span className="qm-service-price">{s.price}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <a href="tel:0385737705" className="btn3d btn3d-blue btn-full" style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                                <Phone size={15} /> Đặt dịch vụ: 0385.737.705
                            </a>
                        </div>
                    )}

                    {/* BLOG */}
                    {tab === 'blog' && (
                        <div className="qm-panel">
                            <p className="qm-panel-desc">📝 Câu chuyện & hành trình từ cộng đồng</p>
                            {posts.length > 0 ? posts.slice(0, 4).map(post => (
                                <div key={post.id} className="qm-blog-card" onClick={() => go(`/blog/${post.id}`)}>
                                    {post.img && <div className="qm-blog-img" style={{ backgroundImage: `url(${post.img})` }} />}
                                    <div className="qm-blog-body">
                                        <strong>{post.title}</strong>
                                        {post.date && <span className="qm-blog-date"><Calendar size={11} /> {post.date}</span>}
                                        <p>{(post.content || '').slice(0, 80)}…</p>
                                    </div>
                                    <ChevronRight size={16} color="#f97316" style={{ flexShrink: 0 }} />
                                </div>
                            )) : (
                                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '24px 0' }}>
                                    Chưa có bài viết nào. Admin có thể đăng bài từ Dashboard.
                                </p>
                            )}
                            <button className="btn3d btn3d-green btn-full" onClick={() => go('/blog')}>
                                Xem tất cả bài viết <ArrowRight size={15} />
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </>
    )
}
