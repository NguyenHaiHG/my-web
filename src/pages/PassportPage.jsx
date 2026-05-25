import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePassport, STAMP_DEFS } from '../context/PassportContext'
import { Edit2, Check, Download, ArrowLeft } from 'lucide-react'

/* ── Certificate generator (canvas → PNG download) ── */
function drawCertificate(holder, stamps) {
    const W = 1400, H = 900
    const canvas = document.createElement('canvas')
    canvas.width = W; canvas.height = H
    const ctx = canvas.getContext('2d')

    // Parchment background
    const bg = ctx.createLinearGradient(0, 0, 0, H)
    bg.addColorStop(0, '#fef9f0'); bg.addColorStop(1, '#fdf0dc')
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)

    // Outer border — double gold line
    ctx.strokeStyle = '#c8963e'; ctx.lineWidth = 10
    ctx.strokeRect(18, 18, W - 36, H - 36)
    ctx.lineWidth = 3
    ctx.strokeRect(32, 32, W - 64, H - 64)

        // Corner diamonds
        ;[
            [18, 18], [W - 18, 18], [18, H - 18], [W - 18, H - 18],
        ].forEach(([x, y]) => {
            ctx.fillStyle = '#c8963e'
            ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fill()
        })

    // Top header band
    ctx.fillStyle = '#1a3a4a'
    ctx.fillRect(0, 40, W, 130)

    // Header title
    ctx.fillStyle = '#c8963e'
    ctx.font = 'bold 52px Georgia, serif'
    ctx.textAlign = 'center'
    ctx.fillText('CHỨNG NHẬN TRẢI NGHIỆM HÀ GIANG', W / 2, 105)

    ctx.fillStyle = '#fdf9f0'
    ctx.font = '22px Georgia, serif'
    ctx.fillText('HTX Trường Hải · Tuyên Quang · Việt Nam', W / 2, 148)

    // Flower decoration
    ctx.font = '36px serif'
    ctx.fillText('🌸   🌸   🌸', W / 2, 230)

    // "Trân trọng chứng nhận"
    ctx.fillStyle = '#4a4a4a'
    ctx.font = 'italic 26px Georgia, serif'
    ctx.fillText('Trân trọng chứng nhận', W / 2, 290)

    // Holder name — big
    ctx.fillStyle = '#1a3a4a'
    ctx.font = 'bold 80px Georgia, serif'
    ctx.fillText(holder || 'Khách trải nghiệm', W / 2, 395)

    // Underline
    const nameW = ctx.measureText(holder || 'Khách trải nghiệm').width
    ctx.strokeStyle = '#c8963e'; ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(W / 2 - nameW / 2, 410)
    ctx.lineTo(W / 2 + nameW / 2, 410)
    ctx.stroke()

    // Body text
    ctx.fillStyle = '#4a4a4a'
    ctx.font = '24px Georgia, serif'
    ctx.fillText('đã hoàn thành hành trình khám phá và trải nghiệm', W / 2, 455)
    ctx.fillText('tại HTX Trường Hải, Tuyên Quang', W / 2, 490)

    // Stamps
    if (stamps.length > 0) {
        const startX = W / 2 - ((stamps.length - 1) * 180) / 2
        stamps.forEach((stamp, i) => {
            const x = startX + i * 180
            // Circle
            ctx.strokeStyle = stamp.color || '#c8963e'
            ctx.lineWidth = 4
            ctx.beginPath(); ctx.arc(x, 590, 55, 0, Math.PI * 2); ctx.stroke()
            // Icon
            ctx.font = '40px serif'; ctx.textAlign = 'center'
            ctx.fillText(stamp.icon, x, 605)
            // Label
            ctx.fillStyle = '#4a4a4a'
            ctx.font = '13px Georgia, serif'
            const words = stamp.label.split(' ')
            words.forEach((w, wi) => ctx.fillText(w, x, 660 + wi * 18))
            // Date
            ctx.fillStyle = '#94a3b8'
            ctx.font = '11px Georgia, serif'
            ctx.fillText(stamp.earnedAt, x, 700)
        })
    } else {
        ctx.fillStyle = '#94a3b8'
        ctx.font = 'italic 20px Georgia, serif'
        ctx.fillText('— Hành trình đang bắt đầu —', W / 2, 600)
    }

    // Footer line
    ctx.strokeStyle = '#c8963e'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(80, 760); ctx.lineTo(W - 80, 760); ctx.stroke()

    // Date (left)
    ctx.fillStyle = '#4a4a4a'; ctx.font = '18px Georgia, serif'
    ctx.textAlign = 'left'
    ctx.fillText(`Ngày cấp: ${new Date().toLocaleDateString('vi-VN')}`, 100, 795)

    // Seal (center)
    ctx.textAlign = 'center'; ctx.font = '40px serif'
    ctx.fillText('🌸', W / 2, 800)
    ctx.fillStyle = '#1a3a4a'; ctx.font = 'bold 16px Georgia, serif'
    ctx.fillText('HTX TRƯỜNG HẢI', W / 2, 830)
    ctx.fillStyle = '#64748b'; ctx.font = '14px Georgia, serif'
    ctx.fillText('Tổ 5 Quang Trung · Phường Hà Giang 2 · Tuyên Quang', W / 2, 852)

    // Signature (right)
    ctx.textAlign = 'right'
    ctx.fillStyle = '#4a4a4a'; ctx.font = 'italic 18px Georgia, serif'
    ctx.fillText('Trưởng HTX Trường Hải', W - 100, 795)
    ctx.font = 'bold 20px Georgia, serif'
    ctx.fillStyle = '#1a3a4a'
    ctx.fillText('Nguyễn Hải HG', W - 100, 820)

    // Download
    const link = document.createElement('a')
    link.download = `HaGiang-Certificate-${(holder || 'Passport').replace(/\s+/g, '-')}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
}

/* ── Main page ── */
export default function PassportPage() {
    const { passport, setHolderName, addStamp, hasStamp } = usePassport()
    const [editingName, setEditingName] = useState(!passport.holderName)
    const [nameInput, setNameInput] = useState(passport.holderName)
    const [downloaded, setDownloaded] = useState(false)

    const saveName = () => {
        const n = nameInput.trim()
        if (!n) return
        setHolderName(n)
        addStamp('welcome')
        setEditingName(false)
    }

    const handleDownload = () => {
        drawCertificate(passport.holderName, passport.stamps)
        setDownloaded(true)
        setTimeout(() => setDownloaded(false), 3000)
    }

    const progress = (passport.stamps.length / Object.keys(STAMP_DEFS).length) * 100

    return (
        <div className="page-enter pp-page">

            {/* Back nav */}
            <div className="container" style={{ paddingTop: 24, paddingBottom: 0 }}>
                <Link to="/" className="btn-back">
                    <ArrowLeft size={16} /> Trang khám phá
                </Link>
            </div>

            <div className="pp-layout container">

                {/* ══ LEFT: PASSPORT BOOK ══ */}
                <div className="pp-left">
                    {/* Cover */}
                    <div className="pp-cover">
                        <div className="pp-cover-top">
                            <p className="pp-cover-country">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                            <div className="pp-cover-emblem">🌸</div>
                            <h2 className="pp-cover-title">HỘ CHIẾU<br />TRẢI NGHIỆM</h2>
                            <p className="pp-cover-org">HTX Trường Hải · Tuyên Quang</p>
                        </div>
                        <div className="pp-cover-strip">
                            <span>HG-EXPERIENCE-PASSPORT</span>
                        </div>
                    </div>

                    {/* Data page */}
                    <div className="pp-data-page">
                        <h3 className="pp-dp-title">📋 THÔNG TIN NGƯỜI DÙNG</h3>

                        {editingName ? (
                            <div className="pp-name-edit">
                                <input
                                    className="form-input"
                                    placeholder="Nhập tên của bạn..."
                                    value={nameInput}
                                    onChange={e => setNameInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && saveName()}
                                    autoFocus
                                />
                                <button className="btn3d btn3d-orange btn-sm" onClick={saveName}>
                                    <Check size={14} /> Lưu
                                </button>
                            </div>
                        ) : (
                            <div className="pp-name-display">
                                <span className="pp-name-value">{passport.holderName}</span>
                                <button className="pp-name-edit-btn" onClick={() => setEditingName(true)} title="Sửa tên">
                                    <Edit2 size={12} />
                                </button>
                            </div>
                        )}

                        <div className="pp-dp-row"><span>Cấp bởi</span><span>HTX Trường Hải</span></div>
                        <div className="pp-dp-row">
                            <span>Ngày tạo</span>
                            <span>{new Date(passport.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="pp-dp-row">
                            <span>Tem đã có</span>
                            <span><strong>{passport.stamps.length}</strong> / {Object.keys(STAMP_DEFS).length}</span>
                        </div>

                        {/* Progress bar */}
                        <div className="pp-progress-wrap">
                            <div className="pp-progress-bar" style={{ width: `${progress}%` }} />
                        </div>
                        <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                            {progress === 100 ? '🎉 Hoàn thành tất cả tem!' : `${Math.round(progress)}% hành trình`}
                        </p>
                    </div>
                </div>

                {/* ══ RIGHT: STAMPS + CERTIFICATE ══ */}
                <div className="pp-right">

                    {/* Stamps collection */}
                    <h2 className="pp-section-title">🎖️ Bộ sưu tập tem</h2>
                    <div className="pp-stamps-grid">
                        {Object.entries(STAMP_DEFS).map(([type, def]) => {
                            const earned = hasStamp(type)
                            const stamp = earned ? passport.stamps.find(s => s.type === type) : null
                            return (
                                <div
                                    key={type}
                                    className={`pp-stamp ${earned ? 'pp-stamp-earned' : 'pp-stamp-locked'}`}
                                    style={{ '--sc': def.color }}
                                >
                                    <div className="pp-stamp-circle">
                                        <span className="pp-stamp-icon">{def.icon}</span>
                                        {earned && <div className="pp-stamp-check-badge">✓</div>}
                                    </div>
                                    <div className="pp-stamp-label">{def.label}</div>
                                    {earned
                                        ? <div className="pp-stamp-date">{stamp.earnedAt}</div>
                                        : <div className="pp-stamp-how">{def.how}</div>
                                    }
                                </div>
                            )
                        })}
                    </div>

                    {/* How to earn */}
                    <div className="pp-howto">
                        <h3>Cách kiếm tem</h3>
                        <div className="pp-howto-grid">
                            {Object.entries(STAMP_DEFS).map(([type, def]) => (
                                <Link
                                    key={type}
                                    to={type === 'tour' ? '/tours' : type === 'product' ? '/san-pham' : type === 'training' ? '/dao-tao' : type === 'radio' ? '/ho-tro' : '/'}
                                    className={`pp-howto-item ${hasStamp(type) ? 'pp-howto-done' : ''}`}
                                >
                                    <span>{def.icon}</span>
                                    <span>{def.how}</span>
                                    {hasStamp(type) && <span className="pp-howto-check">✓</span>}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Certificate export */}
                    <div className="pp-cert-box">
                        <div className="pp-cert-left">
                            <h3>🏆 Chứng nhận Trải nghiệm</h3>
                            <p>
                                {passport.stamps.length === 0
                                    ? 'Hãy kiếm ít nhất 1 tem để xuất chứng nhận.'
                                    : `Bạn có ${passport.stamps.length} tem. Tải xuống chứng nhận PNG.`}
                            </p>
                        </div>
                        <button
                            className={`pp-cert-btn ${passport.stamps.length === 0 ? 'pp-cert-btn-disabled' : ''}`}
                            onClick={handleDownload}
                            disabled={passport.stamps.length === 0 || !passport.holderName}
                            title={!passport.holderName ? 'Nhập tên trước' : ''}
                        >
                            <Download size={18} />
                            {downloaded ? '✅ Đã tải!' : 'Tải PNG'}
                        </button>
                    </div>

                    {!passport.holderName && passport.stamps.length === 0 && (
                        <p style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', marginTop: 8 }}>
                            💡 Nhập tên của bạn ở trái để nhận tem đầu tiên 🌸
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
