import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    X, ArrowRight, Calendar, ChevronRight, Phone,
    MapPin, Clock, Users, Star, Check,
} from 'lucide-react'
import { useData } from '../context/DataContext'
import { useOrder } from '../context/OrderContext'
import { useUI } from '../context/UIContext'

/* ── constants ── */
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

const INC_LABELS = {
    transport: '🚌 Xe', meal: '🍱 Bữa ăn', guide: '🎙️ HDV',
    hotel: '🏨 Khách sạn', ticket: '🎫 Vé tham quan',
}

/* ════════════════════════════════════════════
   MINI BOOKING MODAL (3 bước)
════════════════════════════════════════════ */
function MiniBookingModal({ tour, onClose }) {
    const { submitTourBooking } = useOrder()
    const { showToast } = useUI()
    const [step, setStep] = useState(1)
    const [form, setForm] = useState({
        date: '', adults: 1, children: 0,
        name: '', phone: '', email: '', note: '',
    })

    const totalGuests = form.adults + form.children

    const adj = (field, delta) =>
        setForm(p => ({ ...p, [field]: Math.max(field === 'adults' ? 1 : 0, p[field] + delta) }))

    const goNext = () => {
        if (step === 1) {
            if (!form.date) { showToast('Vui lòng chọn ngày khởi hành'); return }
            setStep(2)
        } else if (step === 2) {
            if (!form.name.trim() || !form.phone.trim()) { showToast('Cần nhập họ tên và số điện thoại'); return }
            setStep(3)
        }
    }

    const confirm = () => {
        submitTourBooking({
            tourTitle: tour.title, tourPrice: tour.price,
            name: form.name, phone: form.phone,
            date: form.date, guests: totalGuests, note: form.note,
        })
        onClose()
        showToast('✅ Đặt lịch "' + tour.title + '" thành công! Chúng tôi sẽ liên hệ xác nhận.')
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal modal-large booking-modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>
                <h2 className="modal-title">🗓️ Đặt lịch khám phá</h2>
                <p className="modal-hint">{tour.title} · {tour.price}/người</p>

                <div className="booking-steps">
                    {['Chọn ngày', 'Thông tin', 'Xác nhận'].map((label, i) => {
                        const s = i + 1
                        return (
                            <div key={s} className={`booking-step${step === s ? ' bstep-active' : ''}${step > s ? ' bstep-done' : ''}`}>
                                <div className="bstep-circle">
                                    {step > s ? <Check size={12} /> : s}
                                </div>
                                <span className="bstep-label">{label}</span>
                                {s < 3 && <div className="bstep-line" />}
                            </div>
                        )
                    })}
                </div>

                {step === 1 && (
                    <div className="booking-body">
                        <div className="book-field">
                            <label className="book-label"><Calendar size={14} /> Ngày khởi hành</label>
                            <input className="form-input" type="date"
                                value={form.date}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={e => setForm({ ...form, date: e.target.value })} />
                        </div>
                        <div className="book-field">
                            <label className="book-label"><Users size={14} /> Số khách</label>
                            <div className="guest-row">
                                {[['adults', 'Người lớn'], ['children', 'Trẻ em']].map(([field, lbl]) => (
                                    <div key={field} className="guest-item">
                                        <span className="guest-type">{lbl}</span>
                                        <div className="guest-counter">
                                            <button className="gc-btn" onClick={() => adj(field, -1)}>−</button>
                                            <span className="gc-val">{form[field]}</span>
                                            <button className="gc-btn" onClick={() => adj(field, 1)}>+</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button className="btn3d btn3d-orange btn-full" onClick={goNext}>Tiếp theo →</button>
                    </div>
                )}

                {step === 2 && (
                    <div className="booking-body">
                        <div className="login-form">
                            <input className="form-input" placeholder="Họ và tên *"
                                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            <input className="form-input" type="tel" placeholder="Số điện thoại *"
                                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                            <input className="form-input" type="email" placeholder="Email (không bắt buộc)"
                                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            <textarea className="form-input form-textarea" style={{ minHeight: 70 }}
                                placeholder="Ghi chú (yêu cầu đặc biệt...)"
                                value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button className="btn3d btn3d-blue" style={{ flex: 1 }} onClick={() => setStep(1)}>← Quay lại</button>
                                <button className="btn3d btn3d-orange" style={{ flex: 2 }} onClick={goNext}>Tiếp theo →</button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="booking-body">
                        <div className="book-summary">
                            {[
                                ['Tour', tour.title],
                                ['Ngày đi', form.date],
                                ['Số khách', form.adults + ' người lớn' + (form.children > 0 ? ' & ' + form.children + ' trẻ em' : '')],
                                ['Giá/người', tour.price],
                                ['Liên hệ', form.name + ' · ' + form.phone],
                            ].map(([k, v]) => (
                                <div key={k} className="book-sum-row">
                                    <span>{k}</span><strong>{v}</strong>
                                </div>
                            ))}
                            {form.note && (
                                <div className="book-sum-row">
                                    <span>Ghi chú</span><span className="book-note-txt">{form.note}</span>
                                </div>
                            )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button className="btn3d btn3d-blue" style={{ flex: 1 }} onClick={() => setStep(2)}>← Quay lại</button>
                                <button className="btn3d btn3d-orange" style={{ flex: 2 }} onClick={confirm}>✅ Xác nhận đặt lịch</button>
                            </div>
                            <a href="tel:0385737705" className="btn3d btn3d-green btn-full"
                                style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                                <Phone size={15} /> Gọi ngay: 0385.737.705
                            </a>
                            <a href="https://wa.me/84385737705" target="_blank" rel="noreferrer"
                                className="btn3d btn3d-blue btn-full"
                                style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                                💬 WhatsApp / Zalo: 0385.737.705
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

/* ════════════════════════════════════════════
   MINI TOUR CARD
════════════════════════════════════════════ */
function MiniTourCard({ tour, onBook }) {
    const includes = tour.includes || ['transport', 'meal', 'guide']
    const duration = tour.duration || '3N2Đ'
    const maxGuests = tour.maxGuests || 10
    const location = tour.location || 'Hà Giang'
    const category = tour.category || 'budget'
    const rating = tour.rating ?? 5.0
    const reviews = tour.reviews ?? 0

    const catLabel = { premium: '⭐ Cao cấp', trek: '🥾 Trekking', budget: '💰 Tiết kiệm' }[category] ?? '💰 Tiết kiệm'

    return (
        <div className="qm-tour-card">
            <div className="qm-tour-card-img"
                style={{ backgroundImage: 'url(' + (tour.img || 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&q=80') + ')' }}>
                <span className={'tour-bcard-cat tour-bcard-cat-' + category}>{catLabel}</span>
                <div className="tour-bcard-rating">
                    <Star size={11} fill="#fbbf24" color="#fbbf24" />
                    <span>{typeof rating === 'number' ? rating.toFixed(1) : rating}</span>
                    {reviews > 0 && <span className="tour-bcard-reviews">({reviews})</span>}
                </div>
            </div>
            <div className="qm-tour-card-body">
                <h3 className="qm-tour-card-title">{tour.title}</h3>
                {tour.desc && <p className="qm-tour-card-desc">{tour.desc}</p>}
                <div className="tour-bcard-meta">
                    <span><MapPin size={12} /> {location}</span>
                    <span><Clock size={12} /> {duration}</span>
                    <span><Users size={12} /> ≤{maxGuests} khách</span>
                </div>
                <div className="tour-bcard-includes" style={{ marginTop: 6 }}>
                    <span className="tour-inc-label">Bao gồm:</span>
                    {includes.map(key => (
                        <span key={key} className="tour-inc-chip" title={INC_LABELS[key] || key}>
                            {(INC_LABELS[key] || key).split(' ')[0]}
                        </span>
                    ))}
                </div>
                <div className="tour-bcard-footer" style={{ marginTop: 10 }}>
                    <div className="tour-bcard-price-wrap">
                        <span className="tour-bcard-from">Từ</span>
                        <span className="tour-bcard-price">{tour.price}</span>
                        <span className="tour-bcard-unit">/người</span>
                    </div>
                    <button className="btn3d btn3d-orange btn-sm" onClick={() => onBook(tour)}>
                        🗓️ Đặt lịch
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ════════════════════════════════════════════
   MAIN QUICK MENU
════════════════════════════════════════════ */
export default function QuickMenu() {
    const [open, setOpen] = useState(false)
    const [tab, setTab] = useState('discover')
    const [booking, setBooking] = useState(null)
    const navigate = useNavigate()
    const { tours, products, posts } = useData()

    const go = (path) => { navigate(path); setOpen(false) }

    const displayTours = tours.length > 0 ? tours : [
        {
            id: 's1', title: 'Hà Giang Loop 3N2Đ', price: '1.200.000đ',
            desc: 'Chinh phục đèo Mã Pí Lèng, thăm Đồng Văn & Lũng Cú, ngủ homestay bản địa.',
            duration: '3N2Đ', maxGuests: 8, location: 'Hà Giang', category: 'budget',
            rating: 5.0, includes: ['transport', 'meal', 'guide', 'hotel'],
        },
        {
            id: 's2', title: 'Hà Giang Premium 4N3Đ', price: '2.800.000đ',
            desc: 'Trải nghiệm cao cấp: xe riêng, khách sạn 3 sao, hướng dẫn viên song ngữ.',
            duration: '4N3Đ', maxGuests: 6, location: 'Hà Giang', category: 'premium',
            rating: 5.0, includes: ['transport', 'meal', 'guide', 'hotel', 'ticket'],
        },
        {
            id: 's3', title: 'Trekking Tây Côn Lĩnh', price: '950.000đ',
            desc: 'Leo núi Tây Côn Lĩnh — đỉnh cao nhất Hà Giang. Cắm trại dưới rừng nguyên sinh.',
            duration: '2N1Đ', maxGuests: 10, location: 'Hà Giang', category: 'trek',
            rating: 4.9, includes: ['guide', 'meal'],
        },
    ]
    const displayProducts = products.length > 0 ? products : PRODUCTS_SAMPLE

    return (
        <>
            <button className="qm-float-btn" onClick={() => setOpen(true)} aria-label="Quick menu">
                <span className="qm-hamburger">
                    <span /><span /><span />
                </span>
            </button>

            {open && <div className="qm-backdrop" onClick={() => setOpen(false)} />}

            <div className={'qm-sheet ' + (open ? 'qm-sheet-open' : '')}>
                <div className="qm-sheet-handle" />
                <div className="qm-sheet-header">
                    <div className="qm-tabs">
                        {TABS.map(tb => (
                            <button key={tb.id}
                                className={'qm-tab ' + (tab === tb.id ? 'qm-tab-active' : '')}
                                onClick={() => setTab(tb.id)}>
                                <span className="qm-tab-icon">{tb.icon}</span>
                                <span className="qm-tab-label">{tb.label}</span>
                            </button>
                        ))}
                    </div>
                    <button className="qm-close" onClick={() => setOpen(false)}><X size={18} /></button>
                </div>

                <div className="qm-content">

                    {/* ─── DISCOVER ─── */}
                    {tab === 'discover' && (
                        <div className="qm-panel">
                            <div className="qm-panel-hero"
                                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=900&q=80)' }}>
                                <div className="qm-panel-hero-overlay" />
                                <div className="qm-panel-hero-text">
                                    <h3>🗺️ Hà Giang Loop</h3>
                                    <p>Cao nguyên đá huyền thoại · Ruộng bậc thang · Mã Pí Lèng</p>
                                </div>
                            </div>
                            <div className="qm-tour-list">
                                {displayTours.map((tour, i) => (
                                    <MiniTourCard key={tour.id || i} tour={tour} onBook={setBooking} />
                                ))}
                            </div>
                            <button className="btn3d btn3d-green btn-full" style={{ marginTop: 4 }}
                                onClick={() => go('/tours')}>
                                Xem tất cả hành trình <ArrowRight size={15} />
                            </button>
                        </div>
                    )}

                    {/* ─── CREATE ─── */}
                    {tab === 'create' && (
                        <div className="qm-panel">
                            <p className="qm-panel-desc">
                                🎓 Workshop miễn phí — dành cho phụ nữ dân tộc &amp; du khách yêu thích trải nghiệm thực
                            </p>
                            <div className="qm-create-grid">
                                {WORKSHOPS_SAMPLE.map((w, i) => (
                                    <div key={i} className="qm-create-card" onClick={() => go('/workshop')}>
                                        <span className="qm-create-icon">{w.icon}</span>
                                        <div><strong>{w.name}</strong><p>{w.sub}</p></div>
                                        <ChevronRight size={14} color="#f97316" />
                                    </div>
                                ))}
                            </div>
                            <button className="btn3d btn3d-green btn-full" onClick={() => go('/workshop')}>
                                Xem tất cả workshop <ArrowRight size={15} />
                            </button>
                        </div>
                    )}

                    {/* ─── SHOP ─── */}
                    {tab === 'shop' && (
                        <div className="qm-panel">
                            <p className="qm-panel-desc">🛍️ Sản phẩm thổ cẩm &amp; đặc sản địa phương Hà Giang</p>
                            <div className="qm-shop-grid">
                                {displayProducts.slice(0, 4).map((p, i) => (
                                    <div key={p.id || i} className="qm-shop-card" onClick={() => go('/san-pham')}>
                                        <div className="qm-shop-img"
                                            style={p.img ? { backgroundImage: 'url(' + p.img + ')' } : undefined}>
                                            {!p.img && <span>🏪</span>}
                                        </div>
                                        <div className="qm-shop-info">
                                            <strong>{p.title}</strong>
                                            <span className="qm-shop-price">{p.price || (p.desc || '').slice(0, 20)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="btn3d btn3d-orange btn-full" onClick={() => go('/san-pham')}>
                                Xem tất cả sản phẩm <ArrowRight size={15} />
                            </button>
                        </div>
                    )}

                    {/* ─── SERVICE ─── */}
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
                            <a href="tel:0385737705" className="btn3d btn3d-blue btn-full"
                                style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                                <Phone size={15} /> Đặt dịch vụ: 0385.737.705
                            </a>
                        </div>
                    )}

                    {/* ─── BLOG ─── */}
                    {tab === 'blog' && (
                        <div className="qm-panel">
                            <p className="qm-panel-desc">📝 Câu chuyện &amp; hành trình từ cộng đồng</p>
                            {posts.length > 0 ? posts.slice(0, 5).map(post => (
                                <div key={post.id} className="qm-blog-card"
                                    onClick={() => go('/blog/' + post.id)}>
                                    {post.img
                                        ? <div className="qm-blog-img" style={{ backgroundImage: 'url(' + post.img + ')' }} />
                                        : <div className="qm-blog-img qm-blog-img-empty">📝</div>
                                    }
                                    <div className="qm-blog-body">
                                        <strong>{post.title}</strong>
                                        {post.date && (
                                            <span className="qm-blog-date">
                                                <Calendar size={11} /> {post.date}{post.author ? ' · ' + post.author : ''}
                                            </span>
                                        )}
                                        <p>{(post.content || '').slice(0, 140)}{(post.content || '').length > 140 ? '…' : ''}</p>
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

            {booking && <MiniBookingModal tour={booking} onClose={() => setBooking(null)} />}
        </>
    )
}
