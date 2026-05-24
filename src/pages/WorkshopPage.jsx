import { useState } from 'react'
import { Calendar, Clock, Users, MapPin, Tag, CheckCircle, X } from 'lucide-react'
import { useOrder } from '../context/OrderContext'
import { useData } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import { useLang } from '../context/LanguageContext'

const CAT_LABELS = {
    sewing: { label: 'May mặc', color: '#7c3aed', emoji: '🪡' },
    embroidery: { label: 'Thêu thổ cẩm', color: '#db2777', emoji: '🌸' },
    english: { label: 'Tiếng Anh', color: '#2563eb', emoji: '🗣️' },
    digital: { label: 'Kỹ năng số', color: '#0891b2', emoji: '💻' },
    cooking: { label: 'Ẩm thực dân tộc', color: '#d97706', emoji: '🍲' },
    other: { label: 'Khác', color: '#6b7280', emoji: '📌' },
}

// Sample data shown when backend is offline
const SAMPLE_WORKSHOPS = [
    {
        id: 's1', title: 'Thêu Thổ Cẩm Cơ Bản', category: 'embroidery',
        desc: 'Học các mẫu thêu truyền thống của người H\'Mông và Tày. Phù hợp cho người mới bắt đầu.',
        date: '01/06/2026', time: '08:00 – 11:00', capacity: 15, registered: 8,
        isFree: true, status: 'upcoming', instructor: 'Chị Lan (Nghệ nhân dân gian)',
        img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    },
    {
        id: 's2', title: 'Tiếng Anh Giao Tiếp cho Easyrider', category: 'english',
        desc: 'Lớp tiếng Anh miễn phí, tập trung vào hội thoại du lịch, hướng dẫn tuyến đường Hà Giang Loop.',
        date: 'Thứ 2 & Thứ 4', time: '19:00 – 20:30', capacity: 20, registered: 14,
        isFree: true, status: 'ongoing', instructor: 'TNV quốc tế',
        img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80',
    },
    {
        id: 's3', title: 'Kỹ Năng Số Cho Phụ Nữ', category: 'digital',
        desc: 'Smartphone, mạng xã hội, bán hàng online — từ cơ bản đến thực hành kiếm thu nhập.',
        date: '15/06/2026', time: '14:00 – 17:00', capacity: 12, registered: 5,
        isFree: true, status: 'upcoming', instructor: 'Đội hỗ trợ số HTX',
        img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
    },
    {
        id: 's4', title: 'May Trang Phục Dân Tộc', category: 'sewing',
        desc: 'Học cắt may trang phục truyền thống, tạo sản phẩm bán cho du khách.',
        date: '20/06/2026', time: '08:30 – 11:30', capacity: 10, registered: 3,
        isFree: true, status: 'upcoming', instructor: 'Chị Hoa (Thợ may 20 năm)',
        img: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80',
    },
]

function WorkshopCard({ ws, onRegister }) {
    const cat = CAT_LABELS[ws.category] || CAT_LABELS.other
    const pct = Math.min(100, Math.round((ws.registered / ws.capacity) * 100))
    const full = ws.registered >= ws.capacity

    return (
        <div className="ws-card">
            {ws.img && (
                <div className="ws-card-img" style={{ backgroundImage: `url(${ws.img})` }}>
                    <span className="ws-badge" style={{ background: cat.color }}>
                        {cat.emoji} {cat.label}
                    </span>
                    {ws.isFree && <span className="ws-free-badge">MIỄN PHÍ</span>}
                </div>
            )}
            <div className="ws-card-body">
                <span className={`ws-status ws-status-${ws.status}`}>
                    {ws.status === 'upcoming' ? '🔔 Sắp diễn ra' : ws.status === 'ongoing' ? '🟢 Đang diễn ra' : '✅ Đã kết thúc'}
                </span>
                <h3>{ws.title}</h3>
                <p className="ws-desc">{ws.desc}</p>

                <div className="ws-meta">
                    {ws.date && <span><Calendar size={13} /> {ws.date}</span>}
                    {ws.time && <span><Clock size={13} /> {ws.time}</span>}
                    <span><MapPin size={13} /> Tổ 5, Hà Giang 2</span>
                    {ws.instructor && <span><Tag size={13} /> {ws.instructor}</span>}
                </div>

                <div className="ws-capacity">
                    <div className="ws-cap-row">
                        <span><Users size={13} /> {ws.registered}/{ws.capacity} người đăng ký</span>
                        <span>{pct}%</span>
                    </div>
                    <div className="ws-progress"><div className="ws-progress-fill" style={{ width: `${pct}%`, background: full ? '#dc2626' : '#40916c' }} /></div>
                </div>

                {ws.status !== 'done' && (
                    <button
                        className={`btn3d ${full ? 'btn3d-gray' : 'btn3d-orange'} btn-full`}
                        onClick={() => !full && onRegister(ws)}
                        disabled={full}
                    >
                        {full ? 'Đã đủ chỗ' : 'Đăng ký tham gia'}
                    </button>
                )}
            </div>
        </div>
    )
}

function RegisterModal({ ws, onClose }) {
    const { submitWorkshopReg } = useOrder()
    const { showToast } = useUI()
    const [form, setForm] = useState({ name: '', phone: '', email: '', note: '' })
    const [done, setDone] = useState(false)

    const submit = (e) => {
        e.preventDefault()
        submitWorkshopReg({ ...form, workshopId: ws.id, workshopTitle: ws.title })
        setDone(true)
        showToast(`✅ Đã đăng ký "${ws.title}"!`)
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal modal-large" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}><X size={16} /></button>
                {done ? (
                    <div className="text-center" style={{ padding: '32px 0' }}>
                        <CheckCircle size={56} color="#40916c" style={{ margin: '0 auto 16px' }} />
                        <h3>Đăng ký thành công!</h3>
                        <p style={{ color: '#64748b', marginTop: 8 }}>Chúng tôi sẽ liên hệ với bạn trước ngày diễn ra workshop.</p>
                        <button className="btn3d btn3d-orange btn-sm" style={{ marginTop: 20 }} onClick={onClose}>Đóng</button>
                    </div>
                ) : (
                    <>
                        <h2 className="modal-title">🎓 Đăng ký Workshop</h2>
                        <p className="modal-hint">{ws.title} · {ws.date || 'Xem lịch'} · {ws.isFree ? 'MIỄN PHÍ' : ws.price}</p>
                        <form onSubmit={submit} className="login-form">
                            <input className="form-input" placeholder="Họ và tên *" value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })} required />
                            <input className="form-input" type="tel" placeholder="Số điện thoại *" value={form.phone}
                                onChange={e => setForm({ ...form, phone: e.target.value })} required />
                            <input className="form-input" type="email" placeholder="Email (không bắt buộc)" value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })} />
                            <textarea className="form-input form-textarea" placeholder="Ghi chú (bạn muốn học gì, kinh nghiệm trước...)"
                                value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
                            <button type="submit" className="btn3d btn3d-orange btn-full">Xác nhận đăng ký</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}

export default function WorkshopPage() {
    const { workshops } = useData()
    const [filter, setFilter] = useState('all')
    const [regWs, setRegWs] = useState(null)

    const list = (workshops.length > 0 ? workshops : SAMPLE_WORKSHOPS)
        .filter(w => filter === 'all' || w.category === filter)

    return (
        <div className="page-enter">
            {/* HERO */}
            <div className="page-hero" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1400&q=80)' }}>
                <div className="ph-overlay" />
                <div className="ph-content">
                    <h1>Workshop Cộng Đồng</h1>
                    <p>Miễn phí · Thực hành · Dành cho phụ nữ dân tộc & người học tiếng Anh</p>
                </div>
            </div>

            <div className="container py-section">
                {/* INFO BANNER */}
                <div className="ws-info-banner">
                    <div className="ws-info-item">📍 <strong>Địa điểm:</strong> Tổ 5 Quang Trung, Phường Hà Giang 2 (chỉ xe máy)</div>
                    <div className="ws-info-item">🆓 <strong>Học phí:</strong> Miễn phí hoàn toàn</div>
                    <div className="ws-info-item">📱 <strong>Liên hệ:</strong> 0385.737.705</div>
                </div>

                {/* FILTER */}
                <div className="ws-filter-row">
                    {[['all', '🌟 Tất cả'], ['sewing', '🪡 May'], ['embroidery', '🌸 Thêu'],
                    ['english', '🗣️ Tiếng Anh'], ['digital', '💻 Kỹ năng số'], ['cooking', '🍲 Ẩm thực']
                    ].map(([val, label]) => (
                        <button key={val} className={`filter-chip ${filter === val ? 'filter-chip-active' : ''}`}
                            onClick={() => setFilter(val)}>{label}</button>
                    ))}
                </div>

                {/* GRID */}
                <div className="ws-grid mt-6">
                    {list.map(ws => (
                        <WorkshopCard key={ws.id} ws={ws} onRegister={setRegWs} />
                    ))}
                    {list.length === 0 && <p className="empty-state">Không có workshop nào.</p>}
                </div>
            </div>

            {regWs && <RegisterModal ws={regWs} onClose={() => setRegWs(null)} />}
        </div>
    )
}
