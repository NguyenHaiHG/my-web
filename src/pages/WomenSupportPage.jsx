import { useState } from 'react'
import { useData } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import { Phone, ShieldAlert, Heart, Radio, Send, Mic, Volume2, ChevronRight, AlertCircle } from 'lucide-react'

/* ── Emergency hotlines ── */
const HOTLINES = [
    { label: 'Đường dây hỗ trợ bạo lực gia đình', number: '1800 599 920', note: 'Miễn phí · 24/7', color: '#dc2626', icon: '🆘' },
    { label: 'Tổng đài bảo vệ trẻ em & phụ nữ', number: '111', note: 'Miễn phí · 24/7', color: '#dc2626', icon: '📞' },
    { label: 'Cảnh sát khẩn cấp', number: '113', note: 'Miễn phí · 24/7', color: '#1d4ed8', icon: '🚔' },
    { label: 'Hội Phụ nữ tỉnh Tuyên Quang', number: '0207 3822 xxx', note: 'Giờ hành chính', color: '#7c3aed', icon: '🌸' },
]

/* ── Support cards ── */
const SUPPORT_ITEMS = [
    {
        id: 'female-tourist',
        icon: '🧳',
        title: 'Du khách nữ',
        color: '#2563eb',
        bg: '#eff6ff',
        border: '#bfdbfe',
        desc: 'Hỗ trợ du khách nữ gặp khó khăn, bị mất đồ, bị quấy rối hoặc cần chỗ an toàn khi du lịch một mình.',
        helps: [
            'Tìm chỗ nghỉ an toàn khẩn cấp',
            'Kết nối với hướng dẫn viên nữ địa phương',
            'Hỗ trợ liên lạc gia đình / đại sứ quán',
            'Tư vấn lịch trình an toàn cho phụ nữ đi một mình',
        ],
    },
    {
        id: 'female-worker',
        icon: '👩‍🔧',
        title: 'Lao động nữ cầu cứu',
        color: '#059669',
        bg: '#f0fdf4',
        border: '#bbf7d0',
        desc: 'Hỗ trợ lao động nữ bị bóc lột, quỵt lương, điều kiện làm việc không an toàn hoặc cần tư vấn quyền lợi.',
        helps: [
            'Tư vấn quyền lợi lao động theo luật Việt Nam',
            'Kết nối với tổ chức hỗ trợ pháp lý miễn phí',
            'Hỗ trợ tìm việc làm mới an toàn',
            'Báo cáo nặc danh về vi phạm lao động',
        ],
    },
    {
        id: 'violence',
        icon: '🛡️',
        title: 'Bạo hành gia đình',
        color: '#dc2626',
        bg: '#fef2f2',
        border: '#fecaca',
        desc: 'Nếu bạn hoặc người thân đang chịu bạo hành — thể chất, tinh thần hoặc kinh tế — chúng tôi ở đây để lắng nghe và hỗ trợ.',
        helps: [
            'Tư vấn bí mật, không phán xét',
            'Hỗ trợ tìm nơi tạm trú an toàn',
            'Kết nối với cơ quan bảo vệ phụ nữ',
            'Hỗ trợ thủ tục pháp lý bảo vệ bản thân',
        ],
        urgent: true,
    },
    {
        id: 'harassment',
        icon: '🚫',
        title: 'Quấy rối tình dục',
        color: '#9333ea',
        bg: '#faf5ff',
        border: '#e9d5ff',
        desc: 'Bạn không cô đơn và bạn không có lỗi. Mọi hành vi quấy rối tình dục đều là vi phạm pháp luật.',
        helps: [
            'Lắng nghe và hỗ trợ tâm lý',
            'Hướng dẫn thu thập bằng chứng an toàn',
            'Tư vấn tố cáo qua đường dây pháp lý',
            'Kết nối với mạng lưới hỗ trợ phụ nữ',
        ],
        urgent: true,
    },
]

/* ── Radio section ── */
function RadioSection() {
    const { addItem, reviews } = useData()
    const { showToast } = useUI()
    const [tab, setTab] = useState('listen') // 'listen' | 'share'
    const [form, setForm] = useState({ name: '', content: '', category: 'radio', anonymous: false })
    const [sent, setSent] = useState(false)

    // Radio stories are reviews with category='radio'
    const stories = (reviews || []).filter(r => r.category === 'radio' && r.approved)

    const categories = [
        { icon: '💌', label: 'Tình cảm đôi lứa' },
        { icon: '👨‍👩‍👧', label: 'Gia đình' },
        { icon: '🌱', label: 'Vượt khó' },
        { icon: '🤝', label: 'Tình người' },
        { icon: '🏔️', label: 'Quê hương' },
    ]

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await addItem('review', {
                ...form,
                name: form.anonymous ? 'Ẩn danh 🎭' : (form.name || 'Người chia sẻ'),
                category: 'radio',
                approved: false,
                date: new Date().toLocaleDateString('vi-VN'),
                program: 'radio',
            })
            setSent(true)
            showToast('📻 Câu chuyện của bạn đã được gửi! Sẽ lên sóng sau khi duyệt.')
        } catch { showToast('❌ Gửi thất bại, thử lại nhé') }
    }

    return (
        <div className="radio-section">
            <div className="radio-header">
                <div className="radio-logo">
                    <Radio size={28} />
                    <div>
                        <div className="radio-name">📻 Đài phát thanh Trường Hải FM</div>
                        <div className="radio-tagline">Nơi những câu chuyện được lắng nghe</div>
                    </div>
                </div>
                <div className="radio-on-air">
                    <Volume2 size={14} /> ON AIR
                </div>
            </div>

            <div className="radio-tabs">
                <button className={`radio-tab ${tab === 'listen' ? 'radio-tab-active' : ''}`} onClick={() => setTab('listen')}>
                    🎧 Nghe câu chuyện
                </button>
                <button className={`radio-tab ${tab === 'share' ? 'radio-tab-active' : ''}`} onClick={() => setTab('share')}>
                    <Mic size={14} /> Chia sẻ câu chuyện
                </button>
            </div>

            {tab === 'listen' && (
                <div className="radio-stories">
                    {stories.length === 0 ? (
                        <div className="radio-empty">
                            <p>📭 Chưa có câu chuyện nào lên sóng.</p>
                            <p style={{ fontSize: 14, color: '#94a3b8' }}>Hãy là người đầu tiên chia sẻ — câu chuyện của bạn có thể chạm đến trái tim ai đó.</p>
                        </div>
                    ) : (
                        stories.map((s, i) => (
                            <div key={i} className="radio-story-card">
                                <div className="radio-story-ep">Tập {stories.length - i}</div>
                                <p className="radio-story-content">"{s.content}"</p>
                                <div className="radio-story-meta">
                                    <span>— {s.name}</span>
                                    <span>{s.date}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {tab === 'share' && (
                <div className="radio-share">
                    {sent ? (
                        <div className="radio-sent">
                            <div style={{ fontSize: 48 }}>🎙️</div>
                            <h4>Câu chuyện đã được gửi!</h4>
                            <p>Ban biên tập sẽ xem xét và lên sóng trong 1–2 ngày. Cảm ơn bạn đã tin tưởng chia sẻ.</p>
                            <button className="btn3d btn3d-green" onClick={() => { setSent(false); setForm({ name: '', content: '', category: 'radio', anonymous: false }) }}>
                                Chia sẻ thêm
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="radio-share-intro">
                                Câu chuyện của bạn — dù buồn hay vui, dù về tình yêu hay cuộc sống — đều có giá trị.<br />
                                <strong>Bạn có thể ẩn danh hoàn toàn.</strong>
                            </p>
                            <div className="radio-cats">
                                {categories.map(c => (
                                    <button key={c.label} className="radio-cat-btn" onClick={() =>
                                        setForm(f => ({ ...f, content: f.content + (f.content ? ' ' : '') + `[${c.label}] ` }))}>
                                        {c.icon} {c.label}
                                    </button>
                                ))}
                            </div>
                            <form onSubmit={handleSubmit} className="login-form">
                                <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, cursor: 'pointer' }}>
                                    <input type="checkbox" checked={form.anonymous}
                                        onChange={e => setForm(f => ({ ...f, anonymous: e.target.checked }))} />
                                    <span style={{ fontSize: 14 }}>🎭 Ẩn danh (không hiển thị tên)</span>
                                </label>
                                {!form.anonymous && (
                                    <input className="form-input" placeholder="Tên của bạn (hoặc bút danh)"
                                        value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                                )}
                                <textarea className="form-input form-textarea" style={{ minHeight: 120 }}
                                    placeholder="Kể câu chuyện của bạn… Tình cảm, gia đình, vượt khó, hay bất cứ điều gì bạn muốn chia sẻ."
                                    value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required />
                                <button type="submit" className="btn3d btn3d-orange btn-full">
                                    <Send size={15} /> Gửi lên sóng
                                </button>
                            </form>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

/* ── Support card ── */
function SupportCard({ item, onContact }) {
    const [open, setOpen] = useState(false)
    return (
        <div className="supp-card" style={{ '--supp-color': item.color, background: item.bg, borderColor: item.border }}>
            {item.urgent && (
                <div className="supp-urgent-badge"><AlertCircle size={12} /> Khẩn cấp — Gọi ngay 1800 599 920</div>
            )}
            <div className="supp-card-top">
                <span className="supp-icon">{item.icon}</span>
                <h3 className="supp-title" style={{ color: item.color }}>{item.title}</h3>
            </div>
            <p className="supp-desc">{item.desc}</p>
            <button className="supp-toggle" onClick={() => setOpen(o => !o)}>
                Chúng tôi có thể giúp gì <ChevronRight size={13} style={{ transform: open ? 'rotate(90deg)' : 'none', transition: '.2s' }} />
            </button>
            {open && (
                <ul className="supp-helps">
                    {item.helps.map((h, i) => <li key={i}><Heart size={12} color={item.color} /> {h}</li>)}
                </ul>
            )}
            <button className="supp-btn" style={{ background: item.color }} onClick={() => onContact(item)}>
                Liên hệ hỗ trợ
            </button>
        </div>
    )
}

/* ── Contact modal ── */
function ContactModal({ item, onClose }) {
    const { showToast } = useUI()
    const [form, setForm] = useState({ name: '', phone: '', message: '', anonymous: false })
    const [sent, setSent] = useState(false)

    const submit = (e) => {
        e.preventDefault()
        setSent(true)
        showToast('💌 Tin nhắn đã được gửi. Chúng tôi sẽ liên hệ bạn sớm nhất có thể.')
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal modal-large" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>
                {sent ? (
                    <div className="tp-success">
                        <div className="tp-success-icon">💜</div>
                        <h3>Tin nhắn đã gửi thành công</h3>
                        <p>Đội hỗ trợ HTX Trường Hải sẽ liên hệ bạn <strong>trong vòng 2–4 giờ</strong>.</p>
                        <p style={{ color: '#dc2626', fontWeight: 600, fontSize: 14 }}>
                            🆘 Nếu khẩn cấp: gọi ngay <strong>1800 599 920</strong> (miễn phí)
                        </p>
                        <button className="btn3d btn3d-green" onClick={onClose}>Đóng</button>
                    </div>
                ) : (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: 16 }}>
                            <span style={{ fontSize: 36 }}>{item.icon}</span>
                            <h2 className="modal-title" style={{ color: item.color }}>{item.title}</h2>
                            <p style={{ color: '#64748b', fontSize: 13 }}>Thông tin của bạn được bảo mật tuyệt đối</p>
                        </div>
                        {item.urgent && (
                            <div className="supp-urgent-banner">
                                🆘 Khẩn cấp? Gọi ngay <a href="tel:1800599920"><strong>1800 599 920</strong></a> (miễn phí, 24/7)
                            </div>
                        )}
                        <form onSubmit={submit} className="login-form">
                            <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, cursor: 'pointer' }}>
                                <input type="checkbox" checked={form.anonymous}
                                    onChange={e => setForm(f => ({ ...f, anonymous: e.target.checked }))} />
                                <span style={{ fontSize: 14 }}>🎭 Liên hệ ẩn danh</span>
                            </label>
                            {!form.anonymous && (
                                <>
                                    <input className="form-input" placeholder="Tên của bạn" value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                                    <input className="form-input" placeholder="Số điện thoại (để chúng tôi gọi lại)"
                                        value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                                </>
                            )}
                            <textarea className="form-input form-textarea" style={{ minHeight: 100 }}
                                placeholder="Mô tả tình huống của bạn… (bảo mật hoàn toàn)"
                                value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required />
                            <button type="submit" className="btn3d btn3d-orange btn-full">
                                <Send size={15} /> Gửi yêu cầu hỗ trợ
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}

export default function WomenSupportPage() {
    const [contact, setContact] = useState(null)

    return (
        <div className="page-enter">
            {/* Hero */}
            <div className="page-hero" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1400&q=80)', minHeight: 320 }}>
                <div className="ph-overlay" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,.7), rgba(219,39,119,.6))' }} />
                <div className="ph-content">
                    <h1>💜 Hỗ trợ Phụ nữ &amp; Cộng đồng</h1>
                    <p>Không ai phải đối mặt một mình — Chúng tôi ở đây, lắng nghe và đồng hành</p>
                </div>
            </div>

            <div className="container py-section">
                {/* Emergency banner */}
                <div className="supp-emergency-bar">
                    <ShieldAlert size={20} color="#dc2626" />
                    <span><strong>Đường dây khẩn cấp — Miễn phí 24/7:</strong></span>
                    {HOTLINES.slice(0, 2).map(h => (
                        <a key={h.number} href={`tel:${h.number.replace(/\s/g, '')}`} className="supp-hotline-btn" style={{ background: h.color }}>
                            {h.icon} {h.number}
                        </a>
                    ))}
                </div>

                {/* Hotlines grid */}
                <div className="supp-hotlines">
                    {HOTLINES.map(h => (
                        <a key={h.number} href={`tel:${h.number.replace(/\s/g, '')}`} className="supp-hotline-card" style={{ borderTopColor: h.color }}>
                            <span className="supp-hl-icon">{h.icon}</span>
                            <div>
                                <div className="supp-hl-label">{h.label}</div>
                                <div className="supp-hl-number" style={{ color: h.color }}>{h.number}</div>
                                <div className="supp-hl-note">{h.note}</div>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Support cards */}
                <h2 className="section-title" style={{ marginTop: 48 }}>Các hỗ trợ của chúng tôi</h2>
                <div className="supp-grid">
                    {SUPPORT_ITEMS.map(item => (
                        <SupportCard key={item.id} item={item} onContact={setContact} />
                    ))}
                </div>

                {/* Radio */}
                <h2 className="section-title" style={{ marginTop: 56 }}>
                    <Radio size={22} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                    Đài phát thanh cộng đồng
                </h2>
                <p style={{ color: '#64748b', marginBottom: 24, maxWidth: 560 }}>
                    Một không gian ấm áp để chia sẻ câu chuyện cuộc sống — tình yêu, gia đình, vượt khó.
                    Câu chuyện của bạn có thể là nguồn cảm hứng cho người khác.
                </p>
                <RadioSection />
            </div>

            {contact && <ContactModal item={contact} onClose={() => setContact(null)} />}
        </div>
    )
}
