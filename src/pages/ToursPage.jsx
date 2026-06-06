import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Clock, Users, Plus, Trash2, Phone, Star, Check, Calendar, Edit2, ArrowRight } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { useLang } from '../context/LanguageContext'
import { usePassport } from '../context/PassportContext'
import AdminImgBtn from '../components/AdminImgBtn'

function parsePrice(str) {
    if (!str) return 0
    return parseInt(String(str).replace(/[^\d]/g, ''), 10) || 0
}

const INC_KEYS = {
    transport: 'inc_transport',
    meal: 'inc_meal',
    guide: 'inc_guide',
    hotel: 'inc_hotel',
    ticket: 'inc_ticket',
}

const DEFAULT_TOURS = [
    {
        id: 'local-tour-1',
        title: 'Hà Giang Loop 3N2Đ',
        desc: 'Khám phá Mã Pí Lèng, Đồng Văn và văn hóa bản địa cùng hướng dẫn viên địa phương.',
        price: '2.490.000đ',
        duration: '3N2Đ',
        location: 'Đồng Văn - Mèo Vạc',
        category: 'premium',
        rating: 4.9,
        groupSize: '2-8 khách',
        includes: ['transport', 'meal', 'guide', 'hotel'],
        img: '/hg-city-1.svg',
    },
    {
        id: 'local-tour-2',
        title: 'Trekking Núi Đôi & Quản Bạ',
        desc: 'Cung trekking nhẹ cho nhóm bạn và gia đình, kèm picnic và chụp ảnh ruộng bậc thang.',
        price: '1.290.000đ',
        duration: '2N1Đ',
        location: 'Quản Bạ',
        category: 'trek',
        rating: 4.7,
        groupSize: '4-12 khách',
        includes: ['transport', 'guide', 'ticket'],
        img: '/hg-city-2.svg',
    },
    {
        id: 'local-tour-3',
        title: 'City & Culture Day Tour',
        desc: 'Đi chợ địa phương, workshop ẩm thực, trải nghiệm văn hóa và không gian phố Hà Giang.',
        price: '790.000đ',
        duration: '1 ngày',
        location: 'TP Hà Giang',
        category: 'budget',
        rating: 4.6,
        groupSize: '2-10 khách',
        includes: ['meal', 'guide'],
        img: '/hg-city-3.svg',
    },
]

const PROMO_LOOP_TOUR = {
    id: 'promo-tour-hagiang-loop-3d2n',
    title: 'HaGiang Loop 3D2N',
    desc: 'Tour trọn gói Hà Giang Loop 3 ngày 2 đêm, đi cùng hướng dẫn viên bản địa và trải nghiệm văn hóa vùng cao.',
    price: '4.500.000đ',
    originalPrice: '5.000.000đ',
    saleAmount: '500.000đ',
    duration: '3D2N',
    location: 'Hà Giang Loop',
    category: 'premium',
    rating: 5,
    groupSize: '2-8 khách',
    includes: ['transport', 'meal', 'guide', 'hotel', 'ticket'],
    img: '/hg-city-1.svg',
}

function BookingModal({ tour, onClose, addStampFn }) {
    const { showToast } = useUI()
    const [form, setForm] = useState({
        name: '',
        phone: '',
        date: '',
        adults: 1,
        children: 0,
        note: '',
    })

    const submit = (e) => {
        e.preventDefault()
        addStampFn('tour')
        showToast(`✅ Đã nhận yêu cầu đặt tour: ${tour.title}`)
        onClose()
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal modal-large" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>
                <h2 className="modal-title">Đặt tour: {tour.title}</h2>
                <p className="modal-hint">
                    {tour.price} · {tour.duration} · {tour.location}
                    {tour.saleAmount ? ` · Giảm ${tour.saleAmount}` : ''}
                </p>

                <form onSubmit={submit} className="login-form">
                    <input
                        className="form-input"
                        placeholder="Họ và tên"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        required
                    />
                    <input
                        className="form-input"
                        placeholder="Số điện thoại"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value.replace(/[^0-9+]/g, '') })}
                        required
                    />
                    <div className="form-2col">
                        <input
                            className="form-input"
                            type="date"
                            value={form.date}
                            onChange={e => setForm({ ...form, date: e.target.value })}
                            required
                        />
                        <input
                            className="form-input"
                            value={`${form.adults + form.children} khách`}
                            readOnly
                        />
                    </div>
                    <div className="form-2col">
                        <input
                            className="form-input"
                            type="number"
                            min="1"
                            value={form.adults}
                            onChange={e => setForm({ ...form, adults: Number(e.target.value) })}
                        />
                        <input
                            className="form-input"
                            type="number"
                            min="0"
                            value={form.children}
                            onChange={e => setForm({ ...form, children: Number(e.target.value) })}
                        />
                    </div>
                    <textarea
                        className="form-input form-textarea"
                        placeholder="Ghi chú thêm"
                        value={form.note}
                        onChange={e => setForm({ ...form, note: e.target.value })}
                    />
                    <button type="submit" className="btn3d btn3d-orange btn-full">
                        <Calendar size={15} /> Gửi yêu cầu đặt tour
                    </button>
                    <a href="tel:0385737705" className="btn3d btn3d-blue btn-full" style={{ textAlign: 'center', marginTop: 8 }}>
                        <Phone size={15} /> Gọi tư vấn nhanh
                    </a>
                </form>
            </div>
        </div>
    )
}

function TourBookCard({ tour, onBook, onView, onDelete, onEdit, isMod, isAdmin }) {
    const { t } = useLang()

    return (
        <div className="card3d">
            <div className="card3d-img" style={{ backgroundImage: `url(${tour.img || '/hg-city-1.svg'})` }}>
                {isMod && <AdminImgBtn type="tour" itemId={tour.id} />}
                <div className="card3d-badge">🗺️ Discover</div>
            </div>

            <div className="card3d-body">
                <strong className="card3d-title">{tour.title}</strong>
                <p className="card3d-desc">{tour.desc}</p>

                <div style={{ display: 'grid', gap: 6, marginBottom: 8, color: '#475569', fontSize: 13 }}>
                    <span><MapPin size={13} /> {tour.location || 'Hà Giang'}</span>
                    <span><Clock size={13} /> {tour.duration || '1 ngày'}</span>
                    <span><Users size={13} /> {tour.groupSize || '2-8 khách'}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span className="card3d-price">{tour.price || 'Liên hệ'}</span>
                    {tour.originalPrice && (
                        <span style={{ color: '#94a3b8', textDecoration: 'line-through', fontWeight: 600, fontSize: 13 }}>
                            {tour.originalPrice}
                        </span>
                    )}
                    {tour.saleAmount && (
                        <span style={{ color: '#dc2626', fontWeight: 800, fontSize: 12, background: '#fee2e2', borderRadius: 999, padding: '2px 8px' }}>
                            Giảm {tour.saleAmount}
                        </span>
                    )}
                    <span style={{ color: '#f59e0b', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Star size={13} fill="currentColor" /> {tour.rating || 5}
                    </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                    {(tour.includes || []).map((inc) => (
                        <span key={inc} style={{ fontSize: 12, padding: '4px 8px', borderRadius: 999, background: '#eef2ff', color: '#3730a3', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <Check size={11} /> {t(INC_KEYS[inc] || inc)}
                        </span>
                    ))}
                </div>

                <div className="card3d-actions">
                    <button className="btn-card-view" onClick={() => onView(tour)}>Chi tiết</button>
                    <button className="btn3d btn3d-orange btn-sm" onClick={() => onBook(tour)}>
                        Đặt tour
                    </button>
                    {isMod && (
                        <button className="btn3d btn3d-blue btn-sm" onClick={() => onEdit(tour)}>
                            <Edit2 size={13} /> Sửa
                        </button>
                    )}
                    {isAdmin && (
                        <button className="btn-card-del" onClick={() => onDelete('tour', tour.id)}>
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function ToursPage() {
    const { tours, deleteItem } = useData()
    const { isMod, isAdmin } = useAuth()
    const { addStamp } = usePassport()
    const { setAdminModal, setDetailItem, setEditItem, showToast } = useUI()
    const { t } = useLang()

    const [search, setSearch] = useState('')
    const [filterCat, setFilterCat] = useState('all')
    const [sortBy, setSortBy] = useState('default')
    const [booking, setBooking] = useState(null)

    const toursSourceRaw = tours.length > 0 ? tours : DEFAULT_TOURS

    const toursSource = useMemo(() => {
        const loopIdx = toursSourceRaw.findIndex(t =>
            String(t.title || '').toLowerCase().includes('hagiang loop 3d2n') ||
            String(t.title || '').toLowerCase().includes('hà giang loop 3n2đ')
        )

        if (loopIdx >= 0) {
            return toursSourceRaw.map((t, idx) => idx === loopIdx
                ? { ...t, ...PROMO_LOOP_TOUR, id: t.id || t._id || PROMO_LOOP_TOUR.id }
                : t
            )
        }

        return [PROMO_LOOP_TOUR, ...toursSourceRaw]
    }, [toursSourceRaw])

    const filtered = useMemo(() => {
        let list = toursSource.filter(tour =>
            (tour.title || '').toLowerCase().includes(search.toLowerCase()) ||
            (tour.location || '').toLowerCase().includes(search.toLowerCase())
        )
        if (filterCat !== 'all') list = list.filter(tour => (tour.category || 'budget') === filterCat)
        if (sortBy === 'price_asc') list = [...list].sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
        if (sortBy === 'price_desc') list = [...list].sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
        if (sortBy === 'rating') list = [...list].sort((a, b) => (b.rating ?? 5) - (a.rating ?? 5))
        return list
    }, [toursSource, search, filterCat, sortBy])

    const FILTERS = [
        { key: 'all', label: t('tours_filter_all') },
        { key: 'budget', label: t('tours_filter_budget') },
        { key: 'premium', label: t('tours_filter_premium') },
        { key: 'trek', label: t('tours_filter_trek') },
    ]

    return (
        <div className="page-enter">
            <div className="page-hero tours-hero" style={{ backgroundImage: 'url(/hg-city-1.svg)' }}>
                <div className="ph-overlay" />
                <div className="ph-content">
                    <h1>{t('tours_hero_title')}</h1>
                    <p>{t('tours_hero_sub')}</p>
                    <div className="tours-hero-search">
                        <Search size={18} color="#94a3b8" />
                        <input
                            placeholder={t('tours_search')}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="container py-section">

                {/* ── Hà Giang Loop Featured Banner ── */}
                <div style={{
                    background: 'linear-gradient(135deg, #064e3b 0%, #065f46 60%, #1a3a2a 100%)',
                    borderRadius: 20, padding: '28px 32px', marginBottom: 28,
                    display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20,
                    boxShadow: '0 4px 24px rgba(6,78,59,0.25)',
                    position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                    <div style={{ flex: 1, minWidth: 220 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <span style={{ background: '#dc2626', color: '#fff', borderRadius: 999, padding: '3px 10px', fontSize: 12, fontWeight: 800 }}>🔥 Nổi bật</span>
                            <span style={{ color: '#6ee7b7', fontSize: 13, fontWeight: 700 }}>Tour trọn gói · Giảm 500k</span>
                        </div>
                        <h3 style={{ color: '#fff', fontWeight: 900, fontSize: 22, margin: '0 0 6px' }}>Hà Giang Loop 3N2Đ</h3>
                        <p style={{ color: '#a7f3d0', fontSize: 14, margin: '0 0 12px', lineHeight: 1.6 }}>
                            Mã Pí Lèng · Đồng Văn · Núi Đôi · Ruộng bậc thang — xe + ăn + ngủ + HDV bản địa
                        </p>
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13, color: '#d1fae5', marginBottom: 16 }}>
                            <span>⏱ 3 ngày 2 đêm</span>
                            <span>👥 2–7 khách</span>
                            <span>⭐ 4.9/5</span>
                        </div>
                        <Link to="/ha-giang-loop" className="btn3d btn3d-orange" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            Xem chi tiết & Đặt tour <ArrowRight size={15} />
                        </Link>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#9ca3af', textDecoration: 'line-through', fontSize: 14 }}>5.000.000đ</div>
                        <div style={{ color: '#34d399', fontSize: 36, fontWeight: 900, lineHeight: 1 }}>4.500.000đ</div>
                        <div style={{ color: '#a7f3d0', fontSize: 13 }}>/người</div>
                    </div>
                </div>

                {tours.length === 0 && (
                    <div style={{ marginBottom: 12, color: '#92400e', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 12px', fontSize: 14 }}>
                        Đang hiển thị tour gợi ý local vì backend chưa có dữ liệu.
                    </div>
                )}

                <div className="tours-filter-bar">
                    <div className="filter-tabs">
                        {FILTERS.map(f => (
                            <button
                                key={f.key}
                                className={`filter-tab${filterCat === f.key ? ' filter-tab-active' : ''}`}
                                onClick={() => setFilterCat(f.key)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                    <div className="tours-filter-right">
                        <select
                            className="form-input sort-select"
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                        >
                            <option value="default">{t('tours_sort_default')}</option>
                            <option value="price_asc">{t('tours_sort_price_asc')}</option>
                            <option value="price_desc">{t('tours_sort_price_desc')}</option>
                            <option value="rating">{t('tours_sort_rating')}</option>
                        </select>
                        {isMod && (
                            <button className="btn3d btn3d-green btn-sm" onClick={() => setAdminModal('tour')}>
                                <Plus size={15} /> {t('tours_add')}
                            </button>
                        )}
                    </div>
                </div>

                <p className="tours-result-count">{filtered.length} {t('tours_results')}</p>

                <div className="cards-grid mt-6">
                    {filtered.map(tour => (
                        <TourBookCard
                            key={tour.id}
                            tour={tour}
                            isMod={isMod}
                            isAdmin={isAdmin}
                            onBook={setBooking}
                            onView={setDetailItem}
                            onEdit={item => setEditItem({ type: 'tour', item })}
                            onDelete={(type, id) => { deleteItem(type, id); showToast(t('book_deleted')) }}
                        />
                    ))}
                    {filtered.length === 0 && <p className="empty-state">{t('tours_no_result')}</p>}
                </div>
            </div>

            {booking && <BookingModal tour={booking} onClose={() => setBooking(null)} addStampFn={addStamp} />}
        </div>
    )
}
