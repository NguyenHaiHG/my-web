import { useState } from 'react'
import { Heart, CheckCircle, Leaf, BookOpen, Camera, Hammer, Code } from 'lucide-react'
import { useOrder } from '../context/OrderContext'
import { useUI } from '../context/UIContext'
import { useLang } from '../context/LanguageContext'

const SKILL_VALUES = ['teaching', 'agriculture', 'photography', 'construction', 'tech', 'other']
const SKILL_ICONS = [<BookOpen size={18} />, <Leaf size={18} />, <Camera size={18} />, <Hammer size={18} />, <Code size={18} />, <Heart size={18} />]
const SKILL_EMOJIS = ['📚', '🌱', '📷', '🔨', '💻', '✨']
const SKILL_TKEYS = ['vol_skill1', 'vol_skill2', 'vol_skill3', 'vol_skill4', 'vol_skill5', 'vol_skill6']

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
    const { t } = useLang()
    const [form, setForm] = useState({ name: '', phone: '', email: '', skills: '', availability: '', motivation: '' })
    const [done, setDone] = useState(false)

    const skillOptions = SKILL_VALUES.map((v, i) => ({
        value: v, label: `${SKILL_EMOJIS[i]} ${t(SKILL_TKEYS[i])}`, icon: SKILL_ICONS[i]
    }))

    const submit = (e) => {
        e.preventDefault()
        submitVolunteerApp(form)
        setDone(true)
        showToast(`✅ ${t('vol_done_h')}`)
    }

    return (
        <div className="page-enter">
            {/* HERO */}
            <div className="page-hero" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1593113630400-ea4288922559?w=1400&q=80)' }}>
                <div className="ph-overlay" />
                <div className="ph-content">
                    <h1>{t('vol_h1')}</h1>
                    <p>{t('vol_sub')}</p>
                </div>
            </div>

            <div className="container py-section">
                <div className="vol-layout">
                    {/* LEFT: Info */}
                    <div className="vol-info">
                        <span className="section-label">{t('vol_section_label')}</span>
                        <h2>{t('vol_h2')}</h2>
                        <p style={{ color: '#64748b', lineHeight: 1.7 }}>{t('vol_intro')}</p>

                        <div className="vol-skills-grid">
                            {skillOptions.map(s => (
                                <div key={s.value} className="vol-skill-chip">
                                    {s.icon} <span>{s.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="vol-logistics">
                            <h3>{t('vol_logistics_h')}</h3>
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
                            <h3>{t('vol_testimonials_h')}</h3>
                            {TESTIMONIALS.map((tm, i) => (
                                <div key={i} className="vol-quote">
                                    <img src={tm.img} alt={tm.name} className="vol-quote-img" />
                                    <div>
                                        <p className="vol-quote-text">"{tm.quote}"</p>
                                        <span className="vol-quote-meta">{tm.name} · {tm.duration} · {tm.skill}</span>
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
                                    <h3>{t('vol_done_h')}</h3>
                                    <p style={{ color: '#64748b', marginTop: 8 }}>{t('vol_done_p')}</p>
                                    <button className="btn3d btn3d-orange btn-sm" style={{ marginTop: 20 }}
                                        onClick={() => { setDone(false); setForm({ name: '', phone: '', email: '', skills: '', availability: '', motivation: '' }) }}>
                                        {t('vol_done_btn')}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h2>📋 {t('vol_form_h')}</h2>
                                    <p style={{ color: '#64748b', marginBottom: 20 }}>{t('vol_form_p')}</p>
                                    <form onSubmit={submit} className="login-form">
                                        <input className="form-input" placeholder={t('vol_name_ph')} value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })} required />
                                        <div className="form-2col">
                                            <input className="form-input" type="tel" placeholder={t('vol_phone_ph')} value={form.phone}
                                                onChange={e => setForm({ ...form, phone: e.target.value })} />
                                            <input className="form-input" type="email" placeholder={t('vol_email_ph')} value={form.email}
                                                onChange={e => setForm({ ...form, email: e.target.value })} />
                                        </div>
                                        <select className="form-input" value={form.skills}
                                            onChange={e => setForm({ ...form, skills: e.target.value })} required>
                                            <option value="">{t('vol_skills_ph')}</option>
                                            {skillOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                        </select>
                                        <input className="form-input" placeholder={t('vol_avail_ph')}
                                            value={form.availability} onChange={e => setForm({ ...form, availability: e.target.value })} />
                                        <textarea className="form-input form-textarea" placeholder={t('vol_motivation_ph')}
                                            value={form.motivation} onChange={e => setForm({ ...form, motivation: e.target.value })} required />
                                        <button type="submit" className="btn3d btn3d-orange btn-full">
                                            <Heart size={16} /> {t('vol_submit_btn')}
                                        </button>
                                        <a href="tel:0385737705" className="btn3d btn3d-blue btn-full" style={{ textAlign: 'center', marginTop: 8 }}>
                                            {t('vol_call_btn')}
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
