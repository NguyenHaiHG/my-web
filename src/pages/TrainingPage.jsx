import { useState } from 'react'
import { useOrder } from '../context/OrderContext'
import { usePassport } from '../context/PassportContext'
import { useUI } from '../context/UIContext'
import { useLang } from '../context/LanguageContext'
import { CheckCircle, Clock, Users, BookOpen, ChevronDown, ChevronUp, Send } from 'lucide-react'

const PROGRAMS = [
    {
        id: 'easyrider',
        icon: '🏍️',
        title: 'Easy Rider',
        titleEn: 'Easy Rider Guide',
        desc: 'Kỹ năng dẫn đường du lịch bằng xe máy, giao tiếp với khách quốc tế, an toàn đường bộ, kỹ năng kể chuyện về văn hoá địa phương.',
        descEn: 'Motorbike tour guiding, communicating with international tourists, road safety, storytelling about local culture.',
        duration: '4 tuần',
        sessions: '3 buổi/tuần',
        level: 'Cơ bản',
        color: '#f97316',
        gradient: 'linear-gradient(135deg,#fed7aa,#fdba74)',
        outcomes: ['Giao tiếp tiếng Anh cơ bản với khách', 'Biết các tuyến đường đẹp tỉnh Tuyên Quang', 'Sơ cứu & xử lý sự cố trên đường', 'Chứng chỉ Easy Rider HTX'],
    },
    {
        id: 'english',
        icon: '🗣️',
        title: 'Tiếng Anh giao tiếp',
        titleEn: 'Conversational English',
        desc: 'Tiếng Anh thực dụng cho người làm du lịch, buôn bán, và sinh hoạt hàng ngày. Phương pháp học qua tình huống thực tế.',
        descEn: 'Practical English for tourism, trade, and daily life. Situational learning method.',
        duration: '8 tuần',
        sessions: '4 buổi/tuần',
        level: 'Mọi trình độ',
        color: '#2563eb',
        gradient: 'linear-gradient(135deg,#bfdbfe,#93c5fd)',
        outcomes: ['Chào hỏi & giới thiệu bản thân', 'Tư vấn sản phẩm & tour bằng tiếng Anh', 'Xử lý tình huống khách hàng', 'Viết mô tả sản phẩm đơn giản'],
    },
    {
        id: 'video',
        icon: '🎬',
        title: 'Quay & dựng video',
        titleEn: 'Video Production',
        desc: 'Quay video bằng điện thoại, kỹ thuật dựng video đơn giản, đăng lên mạng xã hội để quảng bá sản phẩm và làng nghề.',
        descEn: 'Smartphone videography, basic editing, social media promotion for products and crafts.',
        duration: '3 tuần',
        sessions: '2 buổi/tuần',
        level: 'Không cần kinh nghiệm',
        color: '#7c3aed',
        gradient: 'linear-gradient(135deg,#ddd6fe,#c4b5fd)',
        outcomes: ['Quay video ổn định bằng điện thoại', 'Cắt ghép video bằng CapCut', 'Đăng TikTok / Reels / YouTube Shorts', 'Xây dựng kênh giới thiệu làng nghề'],
    },
    {
        id: 'makeup',
        icon: '💄',
        title: 'Trang điểm cơ bản',
        titleEn: 'Basic Makeup',
        desc: 'Trang điểm tự nhiên, chăm sóc da cho khí hậu vùng núi, trang điểm trang phục dân tộc cho lễ hội và dịch vụ chụp ảnh.',
        descEn: 'Natural makeup, skincare for mountain climate, ethnic costume makeup for festivals and photo services.',
        duration: '3 tuần',
        sessions: '2 buổi/tuần',
        level: 'Cơ bản',
        color: '#db2777',
        gradient: 'linear-gradient(135deg,#fbcfe8,#f9a8d4)',
        outcomes: ['Chăm sóc da cơ bản', 'Trang điểm tự nhiên hàng ngày', 'Trang điểm trang phục dân tộc', 'Khởi đầu dịch vụ trang điểm mini'],
    },
    {
        id: 'clothing',
        icon: '👗',
        title: 'May trang phục dân tộc',
        titleEn: 'Ethnic Clothing Making',
        desc: 'Học cắt may trang phục truyền thống của các dân tộc Tày, Dao, Mông trên địa bàn. Kết hợp với thêu thủ công.',
        descEn: 'Learn to make traditional Tay, Dao, Hmong ethnic costumes, combined with hand embroidery.',
        duration: '6 tuần',
        sessions: '3 buổi/tuần',
        level: 'Cơ bản đến nâng cao',
        color: '#059669',
        gradient: 'linear-gradient(135deg,#a7f3d0,#6ee7b7)',
        outcomes: ['Nhận biết hoa văn các dân tộc', 'Cắt may trang phục cơ bản', 'Bảo tồn và kinh doanh trang phục dân tộc', 'Chứng chỉ làng nghề truyền thống'],
    },
    {
        id: 'embroidery',
        icon: '🧵',
        title: 'Thêu thủ công truyền thống',
        titleEn: 'Traditional Hand Embroidery',
        desc: 'Các mũi thêu truyền thống của dân tộc Dao, Tày, Mông. Tạo ra sản phẩm lưu niệm, túi xách, khăn thêu để bán cho du khách.',
        descEn: 'Traditional embroidery stitches of Dao, Tay, Hmong ethnic groups. Create souvenirs, bags, and embroidered items for tourists.',
        duration: '5 tuần',
        sessions: '3 buổi/tuần',
        level: 'Mọi trình độ',
        color: '#b45309',
        gradient: 'linear-gradient(135deg,#fde68a,#fcd34d)',
        outcomes: ['Thêu 6 mũi cơ bản', 'Hoàn thành 1 sản phẩm bán được', 'Hiểu ý nghĩa hoa văn dân tộc', 'Kết nối với chuỗi cung ứng HTX'],
    },
]

function ProgramCard({ prog, onRegister }) {
    const [open, setOpen] = useState(false)
    return (
        <div className="tp-card" style={{ '--tp-color': prog.color }}>
            <div className="tp-card-top" style={{ background: prog.gradient }}>
                <span className="tp-icon">{prog.icon}</span>
                <div className="tp-badge">{prog.level}</div>
            </div>
            <div className="tp-card-body">
                <h3 className="tp-title">{prog.title}</h3>
                <p className="tp-desc">{prog.desc}</p>
                <div className="tp-meta">
                    <span><Clock size={13} /> {prog.duration}</span>
                    <span><Users size={13} /> {prog.sessions}</span>
                </div>
                <button className="tp-toggle" onClick={() => setOpen(o => !o)}>
                    <BookOpen size={13} /> Mục tiêu khoá học {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>
                {open && (
                    <ul className="tp-outcomes">
                        {prog.outcomes.map((o, i) => (
                            <li key={i}><CheckCircle size={13} color={prog.color} /> {o}</li>
                        ))}
                    </ul>
                )}
                <button className="tp-btn" style={{ background: prog.color }} onClick={() => onRegister(prog)}>
                    Đăng ký miễn phí
                </button>
            </div>
        </div>
    )
}

function RegisterModal({ prog, onClose }) {
    const { addWorkshopReg } = useOrder()
    const { addStamp } = usePassport()
    const { showToast } = useUI()
    const [form, setForm] = useState({ name: '', phone: '', age: '', note: '' })
    const [done, setDone] = useState(false)

    const submit = (e) => {
        e.preventDefault()
        addWorkshopReg({
            ...form,
            workshopTitle: prog.title,
            workshopId: prog.id,
            date: new Date().toLocaleDateString('vi-VN'),
            status: 'pending',
            type: 'training',
        })
        setDone(true)
        showToast('✅ Đăng ký thành công! HTX sẽ liên hệ sớm.')
        addStamp('training')
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal modal-large" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>
                {done ? (
                    <div className="tp-success">
                        <div className="tp-success-icon">🎉</div>
                        <h3>Đăng ký thành công!</h3>
                        <p>HTX Trường Hải sẽ liên hệ với bạn trong vòng <strong>1–2 ngày</strong> để xác nhận lịch học.</p>
                        <p style={{ color: '#64748b', fontSize: 14 }}>📞 Hotline: <strong>0984 XXX XXX</strong></p>
                        <button className="btn3d btn3d-green" onClick={onClose}>Đóng</button>
                    </div>
                ) : (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: 16 }}>
                            <span style={{ fontSize: 40 }}>{prog.icon}</span>
                            <h2 className="modal-title">Đăng ký: {prog.title}</h2>
                            <p style={{ color: '#64748b', fontSize: 14 }}>Khoá học <strong>miễn phí hoàn toàn</strong> — {prog.duration} · {prog.sessions}</p>
                        </div>
                        <form onSubmit={submit} className="login-form">
                            <input className="form-input" placeholder="Họ và tên *" value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                            <input className="form-input" placeholder="Số điện thoại *" value={form.phone}
                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
                            <input className="form-input" placeholder="Tuổi" value={form.age}
                                onChange={e => setForm(f => ({ ...f, age: e.target.value }))} />
                            <textarea className="form-input form-textarea" placeholder="Ghi chú thêm (kinh nghiệm, mong muốn…)"
                                value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
                            <button type="submit" className="btn3d btn3d-orange btn-full">
                                <Send size={15} /> Gửi đăng ký
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}

export default function TrainingPage() {
    const [selected, setSelected] = useState(null)
    const [filter, setFilter] = useState('all')

    const filters = [
        { key: 'all', label: '🗂️ Tất cả' },
        { key: 'tourism', label: '🏍️ Du lịch', ids: ['easyrider', 'english', 'video'] },
        { key: 'craft', label: '🧵 Nghề thủ công', ids: ['clothing', 'embroidery'] },
        { key: 'skill', label: '💄 Kỹ năng mềm', ids: ['makeup', 'video'] },
    ]

    const visible = filter === 'all'
        ? PROGRAMS
        : PROGRAMS.filter(p => filters.find(f => f.key === filter)?.ids?.includes(p.id))

    return (
        <div className="page-enter">
            {/* Hero */}
            <div className="page-hero" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=1400&q=80)' }}>
                <div className="ph-overlay" />
                <div className="ph-content">
                    <h1>🎓 Đào tạo miễn phí</h1>
                    <p>Trao kỹ năng — Mở cơ hội — Nâng cao thu nhập</p>
                </div>
            </div>

            <div className="container py-section">
                {/* Info banner */}
                <div className="tp-banner">
                    <div className="tp-banner-item">
                        <span className="tp-banner-num">6</span>
                        <span>Chương trình đào tạo</span>
                    </div>
                    <div className="tp-banner-item">
                        <span className="tp-banner-num">100%</span>
                        <span>Miễn phí</span>
                    </div>
                    <div className="tp-banner-item">
                        <span className="tp-banner-num">∞</span>
                        <span>Cơ hội việc làm</span>
                    </div>
                    <div className="tp-banner-item">
                        <span className="tp-banner-num">🏔️</span>
                        <span>Tuyên Quang · Hà Giang</span>
                    </div>
                </div>

                {/* Filter */}
                <div className="tp-filters">
                    {filters.map(f => (
                        <button key={f.key} className={`tp-filter-btn ${filter === f.key ? 'tp-filter-active' : ''}`}
                            onClick={() => setFilter(f.key)}>
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Cards */}
                <div className="tp-grid">
                    {visible.map(prog => (
                        <ProgramCard key={prog.id} prog={prog} onRegister={setSelected} />
                    ))}
                </div>

                {/* CTA */}
                <div className="tp-cta">
                    <h3>Không tìm thấy khoá học phù hợp?</h3>
                    <p>Liên hệ HTX Trường Hải để đề xuất chương trình đào tạo theo nhu cầu của bạn.</p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a href="tel:0984000000" className="btn3d btn3d-green">📞 Gọi ngay</a>
                        <a href="/lien-he" className="btn3d btn3d-orange">✉️ Nhắn tin</a>
                    </div>
                </div>
            </div>

            {selected && <RegisterModal prog={selected} onClose={() => setSelected(null)} />}
        </div>
    )
}
