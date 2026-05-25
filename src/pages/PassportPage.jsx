import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePassport, STAMP_DEFS, CERT_TYPES } from '../context/PassportContext'
import { useLang } from '../context/LanguageContext'
import { Edit2, Check, Download, ArrowLeft, Star } from 'lucide-react'

/* ══════════════════════════════════════════════════════
   CERTIFICATE CANVAS GENERATOR
   ══════════════════════════════════════════════════════ */
function drawCertificate({ certDef, holder, earnedStamps, isBasic = false }) {
    const W = 1400, H = 960
    const canvas = document.createElement('canvas')
    canvas.width = W; canvas.height = H
    const ctx = canvas.getContext('2d')

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, H)
    bg.addColorStop(0, '#fef9f0'); bg.addColorStop(1, '#fdf0dc')
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)

    // Outer border – double gold
    ctx.strokeStyle = '#c8963e'; ctx.lineWidth = 10
    ctx.strokeRect(18, 18, W - 36, H - 36)
    ctx.lineWidth = 3
    ctx.strokeRect(32, 32, W - 64, H - 64)

        // Corner ornaments
        ;[[18, 18], [W - 18, 18], [18, H - 18], [W - 18, H - 18]].forEach(([x, y]) => {
            ctx.fillStyle = '#c8963e'
            ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fill()
        })

    // Top header band (use cert color or default deep green)
    const headerColor = certDef?.color ? certDef.color : '#1a3a4a'
    ctx.fillStyle = '#1a3a4a'
    ctx.fillRect(0, 40, W, 140)

    // Colored accent strip if cert type
    if (certDef?.color && certDef.color !== '#1a3a4a') {
        ctx.fillStyle = certDef.color
        ctx.fillRect(0, 40, W, 8)
        ctx.fillRect(0, 172, W, 8)
    }

    // Title
    const certTitle = isBasic ? 'CHỨNG NHẬN TRẢI NGHIỆM HÀ GIANG' : (certDef?.certTitle || 'CHỨNG NHẬN HÀ GIANG')
    ctx.fillStyle = '#c8963e'
    ctx.font = 'bold 46px Georgia, serif'
    ctx.textAlign = 'center'
    ctx.fillText(certTitle, W / 2, 100)

    ctx.fillStyle = '#fdf9f0'
    ctx.font = '20px Georgia, serif'
    ctx.fillText('HTX Trường Hải · Tuyên Quang · Việt Nam', W / 2, 138)

    // Cert type icon
    const typeIcon = certDef?.icon || '🌸'
    ctx.font = '38px serif'
    ctx.fillText(`${typeIcon}  🌸  ${typeIcon}`, W / 2, 220)

    ctx.fillStyle = '#4a4a4a'
    ctx.font = 'italic 24px Georgia, serif'
    ctx.fillText('Trân trọng chứng nhận', W / 2, 270)

    // Holder name
    ctx.fillStyle = '#1a3a4a'
    ctx.font = 'bold 76px Georgia, serif'
    ctx.fillText(holder || 'Khách trải nghiệm', W / 2, 375)
    const nameW = ctx.measureText(holder || 'Khách trải nghiệm').width
    ctx.strokeStyle = '#c8963e'; ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(W / 2 - nameW / 2, 390); ctx.lineTo(W / 2 + nameW / 2, 390); ctx.stroke()

    // Body description
    ctx.fillStyle = '#4a4a4a'; ctx.font = '22px Georgia, serif'; ctx.textAlign = 'center'
    if (isBasic) {
        ctx.fillText('đã hoàn thành hành trình khám phá và trải nghiệm', W / 2, 435)
        ctx.fillText('tại HTX Trường Hải, Tuyên Quang', W / 2, 465)
    } else {
        ctx.fillText(`đã hoàn thành trải nghiệm "${certDef.title}"`, W / 2, 435)
        ctx.fillText('tại vùng đất Hà Giang – Di sản địa chất UNESCO', W / 2, 465)
    }

    // Stamps
    const stamps = earnedStamps
    if (stamps.length > 0) {
        const perRow = Math.min(stamps.length, 7)
        const startX = W / 2 - ((perRow - 1) * 170) / 2
        stamps.forEach((stamp, i) => {
            const row = Math.floor(i / 7)
            const col = i % 7
            const x = W / 2 - ((Math.min(stamps.length - row * 7, 7) - 1) * 170) / 2 + col * 170
            const y = 570 + row * 120

            ctx.strokeStyle = stamp.color || '#c8963e'; ctx.lineWidth = 4
            ctx.beginPath(); ctx.arc(x, y, 48, 0, Math.PI * 2); ctx.stroke()
            ctx.fillStyle = '#fef3c7'
            ctx.beginPath(); ctx.arc(x, y, 46, 0, Math.PI * 2); ctx.fill()
            ctx.font = '32px serif'; ctx.textAlign = 'center'
            ctx.fillText(stamp.icon || '🌸', x, y + 12)
            ctx.fillStyle = '#4a4a4a'; ctx.font = '11px Georgia, serif'
            const lbl = stamp.label || stamp.type
            const words = lbl.split(' ')
            words.forEach((w, wi) => ctx.fillText(w, x, y + 64 + wi * 14))
        })
    } else {
        ctx.fillStyle = '#94a3b8'
        ctx.font = 'italic 20px Georgia, serif'
        ctx.fillText('— Hành trình đang bắt đầu —', W / 2, 580)
    }

    // Footer
    ctx.strokeStyle = '#c8963e'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(80, 858); ctx.lineTo(W - 80, 858); ctx.stroke()
    ctx.fillStyle = '#4a4a4a'; ctx.font = '16px Georgia, serif'; ctx.textAlign = 'left'
    ctx.fillText(`Ngày cấp: ${new Date().toLocaleDateString('vi-VN')}`, 100, 892)
    ctx.textAlign = 'center'
    ctx.font = '36px serif'; ctx.fillText('🌸', W / 2, 898)
    ctx.fillStyle = '#1a3a4a'; ctx.font = 'bold 14px Georgia, serif'
    ctx.fillText('HTX TRƯỜNG HẢI', W / 2, 922)
    ctx.fillStyle = '#64748b'; ctx.font = '12px Georgia, serif'
    ctx.fillText('Tổ 5 Quang Trung · Phường Hà Giang 2 · Tuyên Quang', W / 2, 942)
    ctx.textAlign = 'right'; ctx.fillStyle = '#4a4a4a'
    ctx.font = 'italic 16px Georgia, serif'
    ctx.fillText('Trưởng HTX Trường Hải', W - 100, 892)
    ctx.font = 'bold 18px Georgia, serif'; ctx.fillStyle = '#1a3a4a'
    ctx.fillText('Nguyễn Hải HG', W - 100, 916)

    const label = certDef ? certDef.shortTitle || certDef.id : 'Passport'
    const link = document.createElement('a')
    link.download = `HaGiang-${label}-${(holder || 'User').replace(/\s+/g, '-')}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
}

/* ══════════════════════════════════════════════════════
   STAR RATING COMPONENT
   ══════════════════════════════════════════════════════ */
function StarRating({ value, onChange }) {
    const [hover, setHover] = useState(0)
    return (
        <div className="pp-stars">
            {[1, 2, 3, 4, 5].map(n => (
                <button
                    key={n}
                    className={`pp-star-btn ${(hover || value) >= n ? 'pp-star-on' : ''}`}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => onChange(n)}
                    type="button"
                >★</button>
            ))}
        </div>
    )
}

/* ══════════════════════════════════════════════════════
   BASIC TAB — 6 original stamps
   ══════════════════════════════════════════════════════ */
function BasicTab({ passport, hasStamp, handleDownloadBasic }) {
    const { t, lang } = useLang()
    const progress = (passport.stamps.length / Object.keys(STAMP_DEFS).length) * 100
    return (
        <div>
            <h2 className="pp-section-title">{t('pp_basic_title')}</h2>
            <div className="pp-stamps-grid">
                {Object.entries(STAMP_DEFS).map(([type, def]) => {
                    const earned = hasStamp(type)
                    const stamp = earned ? passport.stamps.find(s => s.type === type) : null
                    return (
                        <div key={type} className={`pp-stamp ${earned ? 'pp-stamp-earned' : 'pp-stamp-locked'}`} style={{ '--sc': def.color }}>
                            <div className="pp-stamp-circle">
                                <span className="pp-stamp-icon">{def.icon}</span>
                                {earned && <div className="pp-stamp-check-badge">✓</div>}
                            </div>
                            <div className="pp-stamp-label">{lang === 'en' ? (def.label_en || def.label) : def.label}</div>
                            {earned ? <div className="pp-stamp-date">{stamp.earnedAt}</div> : <div className="pp-stamp-how">{lang === 'en' ? (def.how_en || def.how) : def.how}</div>}
                        </div>
                    )
                })}
            </div>
            {/* howto list */}
            <div className="pp-howto">
                <h3>{t('pp_howto_title')}</h3>
                <div className="pp-howto-grid">
                    {Object.entries(STAMP_DEFS).map(([type, def]) => (
                        <Link key={type}
                            to={type === 'tour' ? '/tours' : type === 'product' ? '/san-pham' : type === 'training' ? '/dao-tao' : type === 'radio' ? '/ho-tro' : '/'}
                            className={`pp-howto-item ${hasStamp(type) ? 'pp-howto-done' : ''}`}
                        >
                            <span>{def.icon}</span><span>{lang === 'en' ? (def.how_en || def.how) : def.how}</span>
                            {hasStamp(type) && <span className="pp-howto-check">✓</span>}
                        </Link>
                    ))}
                </div>
            </div>
            <div className="pp-cert-box">
                <div className="pp-cert-left">
                    <h3>{t('pp_cert_title_basic')}</h3>
                    <p>{passport.stamps.length === 0 ? t('pp_cert_no_stamps') : t('pp_cert_has').replace('{n}', passport.stamps.length)}</p>
                </div>
                <button className={`pp-cert-btn ${passport.stamps.length === 0 ? 'pp-cert-btn-disabled' : ''}`}
                    onClick={handleDownloadBasic} disabled={passport.stamps.length === 0 || !passport.holderName}>
                    <Download size={18} /> {t('pp_cert_dl')}
                </button>
            </div>
        </div>
    )
}

/* ══════════════════════════════════════════════════════
   CERT TAB — Loop / Culture / Volunteer / Products
   ══════════════════════════════════════════════════════ */
function CertTab({ certDef, passport, hasCertStamp, addCertStamp, getCertStampCount, addReview, getReviews, holderName, addStamp }) {
    const { t, lang } = useLang()
    const earnedCount = getCertStampCount(certDef.id)
    const totalCount = Object.keys(certDef.stamps).length
    const progress = (earnedCount / totalCount) * 100
    const canDownload = earnedCount >= certDef.minStamps

    const [downloading, setDownloading] = useState(false)
    const [reviewForm, setReviewForm] = useState({ rating: 0, location: '', comment: '' })
    const [reviewSent, setReviewSent] = useState(false)
    const reviews = getReviews(certDef.id)

    const handleDownload = () => {
        const stamps = Object.entries(certDef.stamps)
            .filter(([type]) => hasCertStamp(certDef.id, type))
            .map(([, def]) => def)
        drawCertificate({ certDef, holder: holderName, earnedStamps: stamps })
        setDownloading(true)
        setTimeout(() => setDownloading(false), 3000)
    }

    const handleClaim = (type) => {
        addCertStamp(certDef.id, type)
        // For loop cert, also award the base 'tour' stamp
        if (certDef.id === 'loop') addStamp('tour')
        if (certDef.id === 'products') addStamp('product')
        if (certDef.id === 'volunteer') addStamp('training')
    }

    const handleReviewSubmit = (e) => {
        e.preventDefault()
        if (reviewForm.rating === 0 || !reviewForm.comment.trim()) return
        addReview(certDef.id, reviewForm)
        addStamp('review')
        setReviewSent(true)
        setReviewForm({ rating: 0, location: '', comment: '' })
        setTimeout(() => setReviewSent(false), 3000)
    }

    return (
        <div>
            {/* Header banner */}
            <div className="pp-cert-tab-header" style={{ background: certDef.bgGrad }}>
                <span className="pp-ct-icon">{certDef.icon}</span>
                <div>
                    <h2 className="pp-ct-title">{lang === 'en' ? (certDef.title_en || certDef.title) : certDef.title}</h2>
                    <p className="pp-ct-sub">{t('pp_ct_need').replace('{min}', certDef.minStamps).replace('{total}', totalCount)}</p>
                </div>
                <div className="pp-ct-count">{earnedCount}<span>/{totalCount}</span></div>
            </div>

            {/* Progress */}
            <div className="pp-progress-wrap" style={{ margin: '16px 0' }}>
                <div className="pp-progress-bar" style={{ width: `${progress}%`, background: `linear-gradient(90deg,${certDef.color},#f59e0b)` }} />
            </div>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
                {canDownload ? t('pp_ct_enough') : t('pp_ct_more').replace('{n}', certDef.minStamps - earnedCount)}
            </p>

            {/* Stamps grid with claim buttons */}
            <div className="pp-cert-stamps-grid">
                {Object.entries(certDef.stamps).map(([type, def]) => {
                    const earned = hasCertStamp(certDef.id, type)
                    const earnedData = passport.certs[certDef.id]?.stamps?.[type]
                    return (
                        <div key={type} className={`pp-cs-card ${earned ? 'pp-cs-earned' : 'pp-cs-locked'}`} style={{ '--cc': def.color }}>
                            <div className="pp-cs-circle">
                                <span>{def.icon}</span>
                                {earned && <div className="pp-cs-check">✓</div>}
                            </div>
                            <div className="pp-cs-label">{lang === 'en' ? (def.label_en || def.label) : def.label}</div>
                            {earned
                                ? <div className="pp-cs-date">{earnedData?.earnedAt}</div>
                                : (
                                    <div>
                                        <div className="pp-cs-how">{lang === 'en' ? (def.how_en || def.how) : def.how}</div>
                                        <button className="pp-claim-btn" style={{ borderColor: def.color, color: def.color }} onClick={() => handleClaim(type)}>
                                            {t('pp_ct_claim')}
                                        </button>
                                    </div>
                                )
                            }
                        </div>
                    )
                })}
            </div>

            {/* Certificate download */}
            <div className="pp-cert-box" style={{ marginTop: 24 }}>
                <div className="pp-cert-left">
                    <h3>🏆 {lang === 'en' ? (certDef.certTitle_en || certDef.certTitle) : certDef.certTitle}</h3>
                    <p>{canDownload ? t('pp_ct_cert_ready') : t('pp_ct_cert_locked').replace('{n}', Math.max(0, certDef.minStamps - earnedCount))}</p>
                </div>
                <button className={`pp-cert-btn ${!canDownload ? 'pp-cert-btn-disabled' : ''}`}
                    onClick={handleDownload} disabled={!canDownload || !holderName}
                    title={!holderName ? t('pp_ct_name_req') : ''}>
                    <Download size={18} /> {downloading ? t('pp_ct_downloaded') : t('pp_ct_dl')}
                </button>
            </div>

            {/* ── Reviews section (all cert types) ── */}
            <div className="pp-reviews-section">
                <h3 className="pp-section-title" style={{ fontSize: 18, marginTop: 32 }}>{t('pp_rev_title')}</h3>

                {/* Review form */}
                {reviewSent ? (
                    <div className="pp-review-sent">{t('pp_rev_sent')} <span style={{ color: '#7c3aed' }}>+1 tem 🗣️</span></div>
                ) : (
                    <form className="pp-review-form" onSubmit={handleReviewSubmit}>
                        <div className="pp-rf-row">
                            <label className="pp-rf-label">{t('pp_rev_rating_label')}</label>
                            <StarRating value={reviewForm.rating} onChange={r => setReviewForm(p => ({ ...p, rating: r }))} />
                        </div>
                        <input className="form-input" placeholder={t('pp_rev_loc_ph')}
                            value={reviewForm.location} onChange={e => setReviewForm(p => ({ ...p, location: e.target.value }))} />
                        <textarea className="form-input form-textarea" rows={3}
                            placeholder={t('pp_rev_comment_ph')}
                            value={reviewForm.comment} onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))} />
                        <button type="submit" className="btn3d btn3d-orange"
                            disabled={reviewForm.rating === 0 || !reviewForm.comment.trim()}>
                            {t('pp_rev_submit')}
                        </button>
                    </form>
                )}

                {/* Reviews list */}
                {reviews.length > 0 && (
                    <div className="pp-reviews-list">
                        {[...reviews].reverse().map(rv => (
                            <div key={rv.id} className="pp-review-item">
                                <div className="pp-ri-header">
                                    <strong>{rv.author}</strong>
                                    <span className="pp-ri-stars">{'★'.repeat(rv.rating)}{'☆'.repeat(5 - rv.rating)}</span>
                                    <span className="pp-ri-date">{rv.date}</span>
                                </div>
                                {rv.location && <div className="pp-ri-location">📍 {rv.location}</div>}
                                <p className="pp-ri-comment">{rv.comment}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════ */
export default function PassportPage() {
    const {
        passport, setHolderName,
        addStamp, hasStamp,
        addCertStamp, hasCertStamp, getCertStamps, getCertStampCount,
        addReview, getReviews,
    } = usePassport()
    const { t, lang } = useLang()

    const [activeTab, setActiveTab] = useState('basic')
    const [editingName, setEditingName] = useState(!passport.holderName)
    const [nameInput, setNameInput] = useState(passport.holderName)

    const saveName = () => {
        const n = nameInput.trim()
        if (!n) return
        setHolderName(n)
        addStamp('welcome')
        setEditingName(false)
    }

    const handleDownloadBasic = () => {
        drawCertificate({ isBasic: true, holder: passport.holderName, earnedStamps: passport.stamps })
    }

    const totalBasicProgress = (passport.stamps.length / Object.keys(STAMP_DEFS).length) * 100

    const TABS = [
        { id: 'basic', icon: '🎖️', label: t('pp_tab_basic') },
        ...Object.values(CERT_TYPES).map(c => ({ id: c.id, icon: c.icon, label: lang === 'en' ? (c.shortTitle_en || c.shortTitle) : c.shortTitle, color: c.color })),
    ]

    return (
        <div className="page-enter pp-page">
            <div className="container" style={{ paddingTop: 24, paddingBottom: 0 }}>
                <Link to="/" className="btn-back"><ArrowLeft size={16} /> {t('pp_back')}</Link>
            </div>

            <div className="pp-layout container">

                {/* ══ LEFT: PASSPORT BOOK ══ */}
                <div className="pp-left">
                    <div className="pp-cover">
                        <div className="pp-cover-top">
                            <p className="pp-cover-country">{t('pp_cover_country')}</p>
                            <div className="pp-cover-emblem">🌸</div>
                            <h2 className="pp-cover-title">{t('pp_cover_title1')}<br />{t('pp_cover_title2')}</h2>
                            <p className="pp-cover-org">{t('pp_cover_org')}</p>
                        </div>
                        <div className="pp-cover-strip"><span>HG-EXPERIENCE-PASSPORT</span></div>
                    </div>

                    <div className="pp-data-page">
                        <h3 className="pp-dp-title">{t('pp_dp_title')}</h3>
                        {editingName ? (
                            <div className="pp-name-edit">
                                <input className="form-input" placeholder={t('pp_name_ph')}
                                    value={nameInput} onChange={e => setNameInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && saveName()} autoFocus />
                                <button className="btn3d btn3d-orange btn-sm" onClick={saveName}><Check size={14} /> {t('pp_save')}</button>
                            </div>
                        ) : (
                            <div className="pp-name-display">
                                <span className="pp-name-value">{passport.holderName}</span>
                                <button className="pp-name-edit-btn" onClick={() => setEditingName(true)} title="Sửa tên"><Edit2 size={12} /></button>
                            </div>
                        )}
                        <div className="pp-dp-row"><span>{t('pp_dp_issued')}</span><span>HTX Trường Hải</span></div>
                        <div className="pp-dp-row"><span>{t('pp_dp_created')}</span><span>{new Date(passport.createdAt).toLocaleDateString('vi-VN')}</span></div>
                        <div className="pp-dp-row"><span>{t('pp_dp_stamps')}</span><span><strong>{passport.stamps.length}</strong> / {Object.keys(STAMP_DEFS).length}</span></div>
                        <div className="pp-progress-wrap"><div className="pp-progress-bar" style={{ width: `${totalBasicProgress}%` }} /></div>
                        <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                            {totalBasicProgress === 100 ? t('pp_progress_done') : `${Math.round(totalBasicProgress)}${t('pp_progress_pct')}`}
                        </p>

                        {/* Summary of cert progress */}
                        <div style={{ marginTop: 16, borderTop: '1px solid #f0e8d8', paddingTop: 12 }}>
                            <p style={{ fontSize: 10, color: '#94a3b8', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>{t('pp_cert_spec')}</p>
                            {Object.values(CERT_TYPES).map(ct => {
                                const n = getCertStampCount(ct.id)
                                const total = Object.keys(ct.stamps).length
                                return (
                                    <div key={ct.id} className="pp-cert-mini-row" onClick={() => setActiveTab(ct.id)}>
                                        <span>{ct.icon}</span>
                                        <span style={{ flex: 1, fontSize: 12, color: '#475569' }}>{lang === 'en' ? (ct.shortTitle_en || ct.shortTitle) : ct.shortTitle}</span>
                                        <span style={{ fontSize: 12, color: n >= ct.minStamps ? '#059669' : '#94a3b8', fontWeight: 600 }}>
                                            {n >= ct.minStamps ? '🏆' : `${n}/${total}`}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* ══ RIGHT: TABS + CONTENT ══ */}
                <div className="pp-right">
                    {/* Tab bar */}
                    <div className="pp-tabs">
                        {TABS.map(tab => (
                            <button key={tab.id}
                                className={`pp-tab ${activeTab === tab.id ? 'pp-tab-active' : ''}`}
                                style={activeTab === tab.id && tab.color ? { borderBottomColor: tab.color, color: tab.color } : {}}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span>{tab.icon}</span>
                                <span className="pp-tab-label">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Tab content */}
                    <div className="pp-tab-content">
                        {activeTab === 'basic' && (
                            <BasicTab passport={passport} hasStamp={hasStamp} handleDownloadBasic={handleDownloadBasic} />
                        )}
                        {Object.values(CERT_TYPES).map(certDef =>
                            activeTab === certDef.id && (
                                <CertTab key={certDef.id}
                                    certDef={certDef}
                                    passport={passport}
                                    hasCertStamp={hasCertStamp}
                                    addCertStamp={addCertStamp}
                                    getCertStampCount={getCertStampCount}
                                    addReview={addReview}
                                    getReviews={getReviews}
                                    holderName={passport.holderName}
                                    addStamp={addStamp}
                                />
                            )
                        )}
                    </div>

                    {!passport.holderName && (
                        <p style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', marginTop: 16 }}>
                            {t('pp_no_name_hint')}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
