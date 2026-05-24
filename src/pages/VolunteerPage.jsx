import { useState } from 'react'
import { Heart, CheckCircle, Leaf, BookOpen, Camera, Hammer, Code } from 'lucide-react'
import { useOrder } from '../context/OrderContext'
import { useUI } from '../context/UIContext'

const SKILL_OPTIONS = [
    { value: 'teaching', label: '📚 Dạy học (tiếng Anh, kỹ năng số)', icon: <BookOpen size={18} /> },
    { value: 'agriculture', label: '🌱 Nông nghiệp & làm vườn', icon: <Leaf size={18} /> },
    { value: 'photography', label: '📷 Nhiếp ảnh / quay phim', icon: <Camera size={18} /> },
    { value: 'construction', label: '🔨 Xây dựng / sửa chữa', icon: <Hammer size={18} /> },
    { value: 'tech', label: '💻 Công nghệ / số hoá tư liệu', icon: <Code size={18} /> },
    { value: 'other', label: '✨ Kỹ năng khác', icon: <Heart size={18} /> },
]

const TESTIMONIALS = [
    {
        name: 'Tom (UK)', duration: '2 tuần', skill: 'Dạy tiếng Anh',
        quote: 'Hai tuần dạy tiếng Anh cho các bạn easyrider là kỷ niệm đẹp nhất chuyến Đông Nam Á của tôi. Người dân nơi đây ấm áp và chân thành.',
        img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80',
    },
    {
        name: 'Mei (Nhật Bản)', duration: '1 tháng', skill: 'Số hoá thư viện',
        quote: 'Tôi đã giúp số hoá hơn 30 mục tư liệu văn hoá. Đây là công việc có ý nghĩa thực sự — kết nối con người và bảo tồn ký ức.',
        img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80',
    },
    {
        name: 'Nguyễn Thành (Hà Nội)', duration: '3 ngày', skill: 'Nhiếp ảnh',
        quote: 'Đi lên bằng xe máy, cảnh vật đẹp đến nghẹt thở. Tôi chụp được bộ ảnh về đời sống 4 thế hệ mà tôi nghĩ sẽ theo tôi cả đời.',
        img: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&q=80',
    },
]

export default function VolunteerPage() {
    const { submitVolunteerApp } = useOrder()
    const { showToast } = useUI()
    const [form, setForm] = useState({ name: '', phone: '', email: '', skills: '', availability: '', motivation: '' })
    const [done, setDone] = useState(false)

    const submit = (e) => {
        e.preventDefault()
        submitVolunteerApp(form)
        setDone(true)
        showToast('✅ Đã gửi đơn tình nguyện!')
    }

    return (
        <div className="page-enter">
            {/* HERO */}
            <div className="page-hero" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1593113630400-ea4288922559?w=1400&q=80)' }}>
                <div className="ph-overlay" />
                <div className="ph-content">
                    <h1>Trở Thành Tình Nguyện Viên</h1>
                    <p>Góp tay bảo tồn văn hoá · Dạy học · Phát triển cộng đồng bền vững</p>
                </div>
            </div>

            <div className="container py-section">
                <div className="vol-layout">
                    {/* LEFT: Info */}
                    <div className="vol-info">
                        <span className="section-label">🙋 Chúng tôi cần bạn</span>
                        <h2>Bạn có thể đóng góp gì?</h2>
                        <p style={{ color: '#64748b', lineHeight: 1.7 }}>
                            Dự án luôn chào đón tình nguyện viên — không cần kinh nghiệm, chỉ cần nhiệt huyết.
                            Bạn có thể ở lại vài ngày, vài tuần, hoặc đóng góp từ xa.
                        </p>

                        <div className="vol-skills-grid">
                            {SKILL_OPTIONS.map(s => (
                                <div key={s.value} className="vol-skill-chip">
                                    {s.icon} <span>{s.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="vol-logistics">
                            <h3>Thông tin thực tế</h3>
                            <ul>
                                <li>📍 <strong>Địa điểm:</strong> Tổ 5 Quang Trung, Phường Hà Giang 2 — chỉ xe máy vào được</li>
                                <li>🏕️ <strong>Chỗ ở:</strong> Homestay tại gia đình — trải nghiệm cuộc sống dân tộc thực thụ</li>
                                <li>🍲 <strong>Ăn uống:</strong> Bữa ăn gia đình dân tộc (đặc sản vùng cao)</li>
                                <li>📡 <strong>Internet:</strong> Sóng 4G ổn định, WiFi tại nhà chính</li>
                                <li>🕐 <strong>Thời gian tối thiểu:</strong> 3 ngày (khuyến khích 1-4 tuần)</li>
                                <li>💰 <strong>Chi phí:</strong> Chỗ ở và ăn uống miễn phí với TNV dài hạn (từ 2 tuần)</li>
                            </ul>
                        </div>

                        {/* Testimonials */}
                        <div className="vol-testimonials">
                            <h3>TNV nói gì?</h3>
                            {TESTIMONIALS.map((t, i) => (
                                <div key={i} className="vol-quote">
                                    <img src={t.img} alt={t.name} className="vol-quote-img" />
                                    <div>
                                        <p className="vol-quote-text">"{t.quote}"</p>
                                        <span className="vol-quote-meta">{t.name} · {t.duration} · {t.skill}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Form */}
                    <div className="vol-form-wrap">
                        <div className="vol-form-card">
                            {done ? (
                                <div className="text-center" style={{ padding: '40px 0' }}>
                                    <CheckCircle size={64} color="#40916c" style={{ margin: '0 auto 16px' }} />
                                    <h3>Cảm ơn bạn!</h3>
                                    <p style={{ color: '#64748b', marginTop: 8 }}>
                                        Chúng tôi sẽ liên hệ với bạn trong vòng 24–48 giờ để trao đổi chi tiết.
                                    </p>
                                    <button className="btn3d btn3d-orange btn-sm" style={{ marginTop: 20 }}
                                        onClick={() => { setDone(false); setForm({ name: '', phone: '', email: '', skills: '', availability: '', motivation: '' }) }}>
                                        Gửi thêm đơn khác
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h2>📋 Đơn Tình Nguyện</h2>
                                    <p style={{ color: '#64748b', marginBottom: 20 }}>Điền thông tin bên dưới — chúng tôi sẽ liên hệ trong 24h.</p>
                                    <form onSubmit={submit} className="login-form">
                                        <input className="form-input" placeholder="Họ và tên *" value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })} required />
                                        <div className="form-2col">
                                            <input className="form-input" type="tel" placeholder="Số điện thoại" value={form.phone}
                                                onChange={e => setForm({ ...form, phone: e.target.value })} />
                                            <input className="form-input" type="email" placeholder="Email" value={form.email}
                                                onChange={e => setForm({ ...form, email: e.target.value })} />
                                        </div>
                                        <select className="form-input" value={form.skills}
                                            onChange={e => setForm({ ...form, skills: e.target.value })} required>
                                            <option value="">Kỹ năng bạn muốn đóng góp *</option>
                                            {SKILL_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                        </select>
                                        <input className="form-input" placeholder="Thời gian có thể tham gia (VD: 2 tuần tháng 6)"
                                            value={form.availability} onChange={e => setForm({ ...form, availability: e.target.value })} />
                                        <textarea className="form-input form-textarea" placeholder="Bạn muốn đóng góp điều gì cho cộng đồng? *"
                                            value={form.motivation} onChange={e => setForm({ ...form, motivation: e.target.value })} required />
                                        <button type="submit" className="btn3d btn3d-orange btn-full">
                                            <Heart size={16} /> Gửi đơn tình nguyện
                                        </button>
                                        <a href="tel:0385737705" className="btn3d btn3d-blue btn-full" style={{ textAlign: 'center', marginTop: 8 }}>
                                            📞 Gọi trực tiếp: 0385.737.705
                                        </a>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
