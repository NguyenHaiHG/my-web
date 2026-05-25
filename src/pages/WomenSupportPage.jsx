import { useState } from 'react'
import { useUI } from '../context/UIContext'
import { useLang } from '../context/LanguageContext'
import { Send, ShieldAlert, Heart, ChevronRight, AlertCircle } from 'lucide-react'

/* ── Đặt URL stream thực tế vào đây ── */

/* ── Emergency hotlines ── */
const HOTLINES = [
    { label: 'Đường dây hỗ trợ bạo lực gia đình', label_en: 'Domestic Violence Helpline', number: '1800 599 920', note: 'Miễn phí · 24/7', note_en: 'Free · 24/7', color: '#dc2626', icon: '🆘' },
    { label: 'Tổng đài bảo vệ trẻ em & phụ nữ', label_en: 'Child & Women Protection Hotline', number: '111', note: 'Miễn phí · 24/7', note_en: 'Free · 24/7', color: '#dc2626', icon: '📞' },
    { label: 'Cảnh sát khẩn cấp', label_en: 'Emergency Police', number: '113', note: 'Miễn phí · 24/7', note_en: 'Free · 24/7', color: '#1d4ed8', icon: '🚔' },
    { label: 'Hội Phụ nữ tỉnh Tuyên Quang', label_en: "Tuyen Quang Women's Union", number: '0207 3822 xxx', note: 'Giờ hành chính', note_en: 'Office hours', color: '#7c3aed', icon: '🌸' },
]

/* ── Support cards ── */
const SUPPORT_ITEMS = [
    {
        id: 'female-tourist',
        icon: '🧳',
        title: 'Du khách nữ', title_en: 'Female Travelers',
        color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe',
        desc: 'Hỗ trợ du khách nữ gặp khó khăn, bị mất đồ, bị quấy rối hoặc cần chỗ an toàn khi du lịch một mình.',
        desc_en: 'Support for female travelers facing difficulties, loss of belongings, harassment, or needing a safe place when traveling alone.',
        helps: [
            'Tìm chỗ nghỉ an toàn khẩn cấp',
            'Kết nối với hướng dẫn viên nữ địa phương',
            'Hỗ trợ liên lạc gia đình / đại sứ quán',
            'Tư vấn lịch trình an toàn cho phụ nữ đi một mình',
        ],
        helps_en: [
            'Find emergency safe accommodation',
            'Connect with female local guides',
            'Help contacting family / embassy',
            'Safe itinerary advice for solo female travelers',
        ],
    },
    {
        id: 'female-worker',
        icon: '👩‍🔧',
        title: 'Lao động nữ cầu cứu', title_en: 'Women Workers in Distress',
        color: '#059669', bg: '#f0fdf4', border: '#bbf7d0',
        desc: 'Hỗ trợ lao động nữ bị bóc lột, quỵt lương, điều kiện làm việc không an toàn hoặc cần tư vấn quyền lợi.',
        desc_en: 'Support for female workers facing exploitation, wage theft, unsafe working conditions, or needing labor rights counseling.',
        helps: [
            'Tư vấn quyền lợi lao động theo luật Việt Nam',
            'Kết nối với tổ chức hỗ trợ pháp lý miễn phí',
            'Hỗ trợ tìm việc làm mới an toàn',
            'Báo cáo nặc danh về vi phạm lao động',
        ],
        helps_en: [
            'Labor rights counseling under Vietnamese law',
            'Connect with free legal aid organizations',
            'Help finding safe new employment',
            'Anonymous reporting of labor violations',
        ],
    },
    {
        id: 'violence',
        icon: '🛡️',
        title: 'Bạo hành gia đình', title_en: 'Domestic Violence',
        color: '#dc2626', bg: '#fef2f2', border: '#fecaca',
        desc: 'Nếu bạn hoặc người thân đang chịu bạo hành — thể chất, tinh thần hoặc kinh tế — chúng tôi ở đây để lắng nghe và hỗ trợ.',
        desc_en: 'If you or someone you know is experiencing physical, emotional, or financial abuse — we are here to listen and help.',
        helps: [
            'Tư vấn bí mật, không phán xét',
            'Hỗ trợ tìm nơi tạm trú an toàn',
            'Kết nối với cơ quan bảo vệ phụ nữ',
            'Hỗ trợ thủ tục pháp lý bảo vệ bản thân',
        ],
        helps_en: [
            'Confidential, non-judgmental counseling',
            'Help finding temporary safe shelter',
            'Connect with women protection agencies',
            'Legal procedure support for self-protection',
        ],
        urgent: true,
    },
    {
        id: 'harassment',
        icon: '🚫',
        title: 'Quấy rối tình dục', title_en: 'Sexual Harassment',
        color: '#9333ea', bg: '#faf5ff', border: '#e9d5ff',
        desc: 'Bạn không cô đơn và bạn không có lỗi. Mọi hành vi quấy rối tình dục đều là vi phạm pháp luật.',
        desc_en: 'You are not alone and it is not your fault. All sexual harassment is a violation of the law.',
        helps: [
            'Lắng nghe và hỗ trợ tâm lý',
            'Hướng dẫn thu thập bằng chứng an toàn',
            'Tư vấn tố cáo qua đường dây pháp lý',
            'Kết nối với mạng lưới hỗ trợ phụ nữ',
        ],
        helps_en: [
            'Listening and psychological support',
            'Guidance on safe evidence collection',
            'Legal reporting consultation',
            'Connect with women support networks',
        ],
        urgent: true,
    },
]


/* ── Support card ── */
function SupportCard({ item, onContact }) {
    const [open, setOpen] = useState(false)
    const { t, lang } = useLang()
    return (
        <div className="supp-card" style={{ '--supp-color': item.color, background: item.bg, borderColor: item.border }}>
            {item.urgent && (
                <div className="supp-urgent-badge"><AlertCircle size={12} /> {t('ws_urgent_badge')}</div>
            )}
            <div className="supp-card-top">
                <span className="supp-icon">{item.icon}</span>
                <h3 className="supp-title" style={{ color: item.color }}>{lang === 'en' ? item.title_en : item.title}</h3>
            </div>
            <p className="supp-desc">{lang === 'en' ? item.desc_en : item.desc}</p>
            <button className="supp-toggle" onClick={() => setOpen(o => !o)}>
                {t('ws_what_help')} <ChevronRight size={13} style={{ transform: open ? 'rotate(90deg)' : 'none', transition: '.2s' }} />
            </button>
            {open && (
                <ul className="supp-helps">
                    {(lang === 'en' ? item.helps_en : item.helps).map((h, i) => <li key={i}><Heart size={12} color={item.color} /> {h}</li>)}
                </ul>
            )}
            <button className="supp-btn" style={{ background: item.color }} onClick={() => onContact(item)}>
                {t('ws_contact_btn')}
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
    const { t, lang } = useLang()

    return (
        <div className="page-enter">
            {/* Hero */}
            <div className="page-hero" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1400&q=80)', minHeight: 320 }}>
                <div className="ph-overlay" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,.7), rgba(219,39,119,.6))' }} />
                <div className="ph-content">
                    <h1>{t('ws_hero_title')}</h1>
                    <p>{t('ws_hero_sub')}</p>
                </div>
            </div>

            <div className="container py-section">
                {/* Emergency banner */}
                <div className="supp-emergency-bar">
                    <ShieldAlert size={20} color="#dc2626" />
                    <span><strong>{t('ws_emergency_label')}</strong></span>
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
                                <div className="supp-hl-label">{lang === 'en' ? h.label_en : h.label}</div>
                                <div className="supp-hl-number" style={{ color: h.color }}>{h.number}</div>
                                <div className="supp-hl-note">{lang === 'en' ? h.note_en : h.note}</div>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Support cards */}
                <h2 className="section-title" style={{ marginTop: 48 }}>{t('ws_our_services')}</h2>
                <div className="supp-grid">
                    {SUPPORT_ITEMS.map(item => (
                        <SupportCard key={item.id} item={item} onContact={setContact} />
                    ))}
                </div>


            </div>

            {contact && <ContactModal item={contact} onClose={() => setContact(null)} />}
        </div>
    )
}
