import { useState, useRef } from 'react'
import { useUI } from '../context/UIContext'
import { Send, ShieldAlert, Heart, Radio, Volume2, ChevronRight, AlertCircle, Play, Pause } from 'lucide-react'

/* ── Đặt URL stream thực tế vào đây ── */
const STREAM_URL = '' // ví dụ: 'https://stream.zeno.fm/xxx' hoặc file .mp3

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

/* ── Lịch phát sóng theo ngày ── */
const SCHEDULE = [
    { day: 1, dayLabel: 'Thứ Hai', time: '20:00–20:30', icon: '💌', title: 'Tình cảm đôi lứa', desc: 'Những câu chuyện yêu thương, nhớ nhung và gắn kết.' },
    { day: 2, dayLabel: 'Thứ Ba', time: '20:00–20:30', icon: '👨‍👩‍👧', title: 'Mái ấm gia đình', desc: 'Chuyện bố mẹ, con cái và những khoảnh khắc đáng nhớ.' },
    { day: 3, dayLabel: 'Thứ Tư', time: '20:00–20:30', icon: '🌱', title: 'Vượt khó — Truyền cảm hứng', desc: 'Hành trình vươn lên của những người bình thường.' },
    { day: 4, dayLabel: 'Thứ Năm', time: '20:00–20:30', icon: '🤝', title: 'Tình người', desc: 'Những nghĩa cử cao đẹp và lòng tốt quanh ta.' },
    { day: 5, dayLabel: 'Thứ Sáu', time: '20:00–20:30', icon: '🏔️', title: 'Quê hương & Ký ức', desc: 'Nỗi nhớ quê, tiếng làng, bữa cơm gia đình.' },
    { day: 6, dayLabel: 'Thứ Bảy', time: '19:00–20:00', icon: '🌸', title: 'Phụ nữ & Cuộc sống', desc: 'Chuyên đề đặc biệt: sức mạnh, vẻ đẹp và bản lĩnh phụ nữ.' },
    { day: 0, dayLabel: 'Chủ Nhật', time: '19:00–19:30', icon: '📰', title: 'Tin tức cộng đồng', desc: 'Điểm tin hoạt động, sự kiện và thông báo địa phương.' },
]

function isOnAir(prog) {
    const now = new Date()
    if (now.getDay() !== prog.day) return false
    const [startStr, endStr] = prog.time.split('–')
    const [sh, sm] = startStr.split(':').map(Number)
    const [eh, em] = endStr.split(':').map(Number)
    const mins = now.getHours() * 60 + now.getMinutes()
    return mins >= sh * 60 + sm && mins < eh * 60 + em
}

/* ── Radio section — lịch hẹn giờ + nghe trực tuyến ── */
function RadioSection() {
    const [tab, setTab] = useState('schedule') // 'schedule' | 'listen'
    const [playing, setPlaying] = useState(false)
    const audioRef = useRef(null)
    const now = new Date()
    const todayDow = now.getDay()
    const currentlyOnAir = SCHEDULE.find(isOnAir)

    const togglePlay = () => {
        const audio = audioRef.current
        if (!audio) return
        if (playing) {
            audio.pause()
            setPlaying(false)
        } else {
            audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
        }
    }

    return (
        <div className="radio-section">
            <div className="radio-header">
                <div className="radio-logo">
                    <Radio size={28} />
                    <div>
                        <div className="radio-name">📻 Trường Hải FM</div>
                        <div className="radio-tagline">Phát sóng mỗi tối — Lắng nghe &amp; Đồng hành</div>
                    </div>
                </div>
                {currentlyOnAir ? (
                    <div className="radio-on-air"><Volume2 size={14} /> ON AIR</div>
                ) : (
                    <div className="radio-off-air">📅 Xem lịch phát sóng</div>
                )}
            </div>

            {currentlyOnAir && (
                <div className="radio-now-playing">
                    <span className="radio-live-dot" /> Đang phát: <strong>{currentlyOnAir.icon} {currentlyOnAir.title}</strong>
                    <span style={{ marginLeft: 8, opacity: .8 }}>{currentlyOnAir.time}</span>
                </div>
            )}

            <div className="radio-tabs">
                <button className={`radio-tab ${tab === 'schedule' ? 'radio-tab-active' : ''}`} onClick={() => setTab('schedule')}>
                    📅 Lịch phát sóng
                </button>
                <button className={`radio-tab ${tab === 'listen' ? 'radio-tab-active' : ''}`} onClick={() => setTab('listen')}>
                    <Volume2 size={14} /> Nghe trực tuyến
                </button>
            </div>

            {tab === 'schedule' && (
                <div className="radio-schedule">
                    {SCHEDULE.map(prog => {
                        const onAir = isOnAir(prog)
                        const isToday = prog.day === todayDow
                        return (
                            <div key={prog.day} className={`radio-sched-row${onAir ? ' radio-sched-onair' : ''}${isToday && !onAir ? ' radio-sched-today' : ''}`}>
                                <div className="radio-sched-day">
                                    <span className="radio-sched-daylabel">{prog.dayLabel}</span>
                                    <span className="radio-sched-time">{prog.time}</span>
                                </div>
                                <div className="radio-sched-icon">{prog.icon}</div>
                                <div className="radio-sched-info">
                                    <div className="radio-sched-title">
                                        {prog.title}
                                        {onAir && <span className="radio-live-badge"><span className="radio-live-dot" />ĐANG PHÁT</span>}
                                        {isToday && !onAir && <span className="radio-today-badge">Hôm nay</span>}
                                    </div>
                                    <div className="radio-sched-desc">{prog.desc}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {tab === 'listen' && (
                <div className="radio-listen">
                    <div className="radio-player-wrap">
                        <div className="radio-player-art">
                            <Radio size={36} />
                            {playing && <div className="radio-wave"><span /><span /><span /><span /><span /></div>}
                        </div>
                        <p className="radio-player-title">📻 Trường Hải FM</p>
                        <p className="radio-player-sub">
                            {playing ? <><span className="radio-live-dot" /> Đang phát trực tiếp...</> : 'Nhấn nút ↓ để nghe đài'}
                        </p>
                        <button
                            className={`radio-play-btn${playing ? ' radio-play-btn-active' : ''}`}
                            onClick={togglePlay}
                            aria-label={playing ? 'Dừng' : 'Phát'}
                        >
                            {playing ? <Pause size={38} /> : <Play size={38} />}
                        </button>
                        <audio ref={audioRef} src={STREAM_URL} preload="none" />
                        {!STREAM_URL && (
                            <p style={{ fontSize: 12, color: '#f97316', marginTop: 10, textAlign: 'center' }}>
                                ⚠️ Chưa có URL stream. Cập nhật hằng số <code>STREAM_URL</code> trong file WomenSupportPage.jsx.
                            </p>
                        )}
                        {STREAM_URL && (
                            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 10, textAlign: 'center' }}>
                                💡 Phát sóng theo lịch. Kiểm tra tab <strong>Lịch phát sóng</strong> nếu không có tín hiệu.
                            </p>
                        )}
                    </div>
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
