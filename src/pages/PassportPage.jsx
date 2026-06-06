import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { usePassport, STAMP_DEFS, CERT_TYPES, GPS_LANDMARKS } from '../context/PassportContext'
import { useLang } from '../context/LanguageContext'
import { Edit2, Check, Download, ArrowLeft, MapPin, RefreshCw, Home, BookOpen, Map, Shield, User, Phone, Eye, X, ZoomIn, ZoomOut } from 'lucide-react'
import QRCode from 'qrcode'

const MAP_LINK = 'https://maps.app.goo.gl/Fm26ka14eoToFq68A'

/* ══════════════════════════════════════════════════════
   CERTIFICATE CANVAS GENERATOR
   ══════════════════════════════════════════════════════ */
function drawCircularText(ctx, text, x, y, radius, startAngle, letterSpace = 0.06, reverse = false) {
    const chars = [...text]
    const totalAngle = chars.length * letterSpace
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(startAngle)
    if (reverse) ctx.scale(-1, 1)
    chars.forEach((ch, i) => {
        const angle = (i - (chars.length - 1) / 2) * letterSpace
        ctx.save()
        ctx.rotate(angle)
        ctx.translate(0, -radius)
        ctx.rotate(reverse ? Math.PI : 0)
        ctx.fillText(ch, 0, 0)
        ctx.restore()
    })
    ctx.restore()
}

function drawHaGiangSeal(ctx, { x, y, r = 48, color = '#c8963e', icon = '🌸', label = 'HA GIANG' }) {
    const rimColor = color
    const sealRed = '#9f1d1d'
    const innerBg = ctx.createRadialGradient(x - r * 0.15, y - r * 0.2, 8, x, y, r)
    innerBg.addColorStop(0, '#fff7e3')
    innerBg.addColorStop(.62, '#fbe2b3')
    innerBg.addColorStop(1, '#f4c774')

    // Outer wax ring
    ctx.save()
    ctx.beginPath()
    ctx.arc(x, y, r + 5, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(17,34,53,0.08)'
    ctx.fill()

    // Decorative dots around ring
    for (let i = 0; i < 18; i += 1) {
        const a = (Math.PI * 2 * i) / 18
        const dx = x + Math.cos(a) * (r - 2)
        const dy = y + Math.sin(a) * (r - 2)
        ctx.beginPath()
        ctx.arc(dx, dy, 2.2, 0, Math.PI * 2)
        ctx.fillStyle = rimColor
        ctx.fill()
    }

    // Ring and core
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.strokeStyle = sealRed
    ctx.lineWidth = 4.5
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(x, y, r - 6, 0, Math.PI * 2)
    ctx.fillStyle = innerBg
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'
    ctx.lineWidth = 1
    ctx.stroke()

    // Local motif: stone mountains + terraced fields
    ctx.strokeStyle = 'rgba(121, 27, 27, 0.2)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x - 24, y + 8)
    ctx.lineTo(x - 12, y - 6)
    ctx.lineTo(x - 2, y + 2)
    ctx.lineTo(x + 7, y - 12)
    ctx.lineTo(x + 18, y + 8)
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(x, y + 16, 18, Math.PI * 1.05, Math.PI * 1.95)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(x - 2, y + 18, 12, Math.PI * 1.05, Math.PI * 1.9)
    ctx.stroke()

    // Center icon
    ctx.font = '28px serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = sealRed
    ctx.fillText(icon, x, y - 7)

    // Circular seal text
    ctx.fillStyle = sealRed
    ctx.font = 'bold 7px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    drawCircularText(ctx, 'HÀ GIANG', x, y, r - 8, Math.PI * 0.92, 0.11)
    drawCircularText(ctx, 'HTX TRƯỜNG HẢI', x, y, r - 8, Math.PI * 1.9, 0.095, true)

    // Stamp text lines
    ctx.font = 'bold 8px Arial, sans-serif'
    ctx.fillStyle = rimColor
    const shortLabel = (label || 'HA GIANG').toUpperCase().slice(0, 18)
    ctx.fillText(shortLabel, x, y + 21)
    ctx.fillText('UNESCO GEOPARK STYLE', x, y - 24)
    ctx.restore()
}

function makeCertCode(prefix = 'HG') {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    const rnd = Math.random().toString(36).slice(2, 7).toUpperCase()
    return `${prefix}-${y}${m}${d}-${rnd}`
}

async function buildCertificateCanvas({ certDef, holder, earnedStamps, isBasic = false, passportPoints = 0 }) {
    const W = 1400, H = 960
    const canvas = document.createElement('canvas')
    canvas.width = W; canvas.height = H
    const ctx = canvas.getContext('2d')
    const certCode = makeCertCode(certDef?.id || 'BASIC')
    const verifyUrl = `${window.location.origin}/verify/${encodeURIComponent(certCode)}`

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
        stamps.forEach((stamp, i) => {
            const row = Math.floor(i / 7)
            const col = i % 7
            const x = W / 2 - ((Math.min(stamps.length - row * 7, 7) - 1) * 170) / 2 + col * 170
            const y = 570 + row * 120

            drawHaGiangSeal(ctx, {
                x,
                y,
                r: 48,
                color: stamp.color || '#c8963e',
                icon: stamp.icon || '🌸',
                label: stamp.label || stamp.type,
            })

            ctx.fillStyle = '#4a4a4a'; ctx.font = '11px Georgia, serif'; ctx.textAlign = 'center'
            const lbl = stamp.label || stamp.type
            const lblWords = lbl.split(' ')
            if (lblWords.length <= 2) {
                ctx.fillText(lbl, x, y + 64)
            } else {
                const mid = Math.ceil(lblWords.length / 2)
                ctx.fillText(lblWords.slice(0, mid).join(' '), x, y + 64)
                ctx.fillText(lblWords.slice(mid).join(' '), x, y + 78)
            }
        })
    } else {
        ctx.fillStyle = '#94a3b8'
        ctx.font = 'italic 20px Georgia, serif'
        ctx.fillText('— Hành trình đang bắt đầu —', W / 2, 580)
    }

    // Footer
    ctx.strokeStyle = '#c8963e'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(80, 858); ctx.lineTo(W - 80, 858); ctx.stroke()
    ctx.fillStyle = '#4a4a4a'; ctx.font = '15px Georgia, serif'; ctx.textAlign = 'left'
    ctx.fillText(`Ngày cấp: ${new Date().toLocaleDateString('vi-VN')}`, 100, 880)
    ctx.fillText(`Mã chứng nhận: ${certCode}`, 100, 900)
    ctx.font = '12px Georgia, serif'; ctx.fillStyle = '#64748b'
    ctx.fillText(`Điểm hộ chiếu: ${passportPoints}`, 100, 918)

    // Competition submission wax-style mark
    ctx.save()
    ctx.translate(1130, 205)
    ctx.rotate(-0.16)
    ctx.fillStyle = 'rgba(155,44,44,0.10)'
    ctx.beginPath()
    ctx.arc(0, 0, 92, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#9b2c2c'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(0, 0, 82, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(0, 0, 66, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(155,44,44,0.45)'
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = '#9b2c2c'
    ctx.font = 'bold 13px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('COMPETITION', 0, -10)
    ctx.fillText('SUBMISSION 2026', 0, 12)
    ctx.restore()

    let qrData = null
    try {
        qrData = await QRCode.toDataURL(verifyUrl, { width: 130, margin: 1 })
    } catch {
        qrData = null
    }
    if (qrData) {
        const qrImg = new Image()
        qrImg.src = qrData
        await new Promise(resolve => {
            qrImg.onload = resolve
            qrImg.onerror = resolve
        })
        // QR — fits entirely in footer zone (below y=858 line), bottom-right corner
        ctx.drawImage(qrImg, W - 98, 866, 80, 80)
        ctx.fillStyle = '#94a3b8'
        ctx.font = '10px Georgia, serif'
        ctx.textAlign = 'right'
        ctx.fillText('Quét để xác thực', W - 18, 958)
    }

    // Footer: Center — org block
    ctx.textAlign = 'center'
    ctx.font = '28px serif'; ctx.fillText('🌸', W / 2, 880)
    ctx.fillStyle = '#1a3a4a'; ctx.font = 'bold 13px Georgia, serif'
    ctx.fillText('HTX TRƯỜNG HẢI', W / 2, 900)
    ctx.fillStyle = '#64748b'; ctx.font = '11px Georgia, serif'
    ctx.fillText('Tổ 5 Quang Trung · Phường Hà Giang 2 · Tuyên Quang', W / 2, 918)

    // Footer: Signature — right-aligned, left of QR (QR starts at W-98)
    ctx.textAlign = 'right'; ctx.fillStyle = '#4a4a4a'
    ctx.font = 'italic 14px Georgia, serif'
    ctx.fillText('Trưởng HTX Trường Hải', W - 108, 880)
    ctx.font = 'bold 16px Georgia, serif'; ctx.fillStyle = '#1a3a4a'
    ctx.fillText('Nguyễn Hải HG', W - 108, 900)

    const label = certDef ? certDef.shortTitle || certDef.id : 'Passport'
    return { canvas, label, certCode, verifyUrl }
}

/* ══════════════════════════════════════════════════════
   PREVIEW MODAL
   ══════════════════════════════════════════════════════ */
function PreviewModal({ imgSrc, title, onClose }) {
    const [zoom, setZoom] = useState(1)
    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: 'rgba(0,0,0,0.88)', display: 'flex',
                flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
                overflow: 'auto', padding: '24px 16px 40px',
            }}
            onClick={onClose}
        >
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 900 }}>
                {/* Toolbar */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 14, color: '#fff',
                }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: '#fde68a' }}>👁 Xem trước: {title}</span>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button onClick={() => setZoom(z => Math.max(0.4, z - 0.2))}
                            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <ZoomOut size={14} /> Thu nhỏ
                        </button>
                        <span style={{ color: '#94a3b8', fontSize: 13, minWidth: 40, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
                        <button onClick={() => setZoom(z => Math.min(2, z + 0.2))}
                            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <ZoomIn size={14} /> Phóng to
                        </button>
                        <button onClick={() => setZoom(1)}
                            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#cbd5e1', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 12 }}>
                            100%
                        </button>
                        <button onClick={onClose}
                            style={{ background: '#dc2626', border: 'none', color: '#fff', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <X size={14} /> Đóng
                        </button>
                    </div>
                </div>

                {/* Certificate image */}
                <div style={{ overflow: 'auto', borderRadius: 12 }}>
                    <img
                        src={imgSrc}
                        alt={title}
                        style={{
                            width: `${Math.round(zoom * 100)}%`,
                            maxWidth: '100%',
                            display: 'block',
                            borderRadius: 10,
                            boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
                            transition: 'width 0.2s',
                        }}
                    />
                </div>

                <p style={{ color: '#94a3b8', fontSize: 12, textAlign: 'center', marginTop: 10 }}>
                    Nhấn bên ngoài hoặc nút Đóng để thoát • Tải về bằng nút PNG / PDF bên dưới
                </p>
            </div>
        </div>
    )
}

async function downloadCertificatePng(opts) {
    const { holder } = opts
    const { canvas, label, certCode, verifyUrl } = await buildCertificateCanvas(opts)
    const link = document.createElement('a')
    link.download = `HaGiang-${label}-${(holder || 'User').replace(/\s+/g, '-')}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    return { certCode, verifyUrl, label }
}

async function downloadCertificatePdf(opts) {
    const { holder } = opts
    const { canvas, label, certCode, verifyUrl } = await buildCertificateCanvas(opts)
    const { jsPDF } = await import('jspdf')
    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
    })
    const image = canvas.toDataURL('image/png')
    pdf.addImage(image, 'PNG', 0, 0, canvas.width, canvas.height)
    pdf.save(`HaGiang-${label}-${(holder || 'User').replace(/\s+/g, '-')}.pdf`)
    return { certCode, verifyUrl, label }
}

/* ══════════════════════════════════════════════════════
   SHARE CARD GENERATOR — Instagram Story 1080×1920
   ══════════════════════════════════════════════════════ */
function rrect(ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
}

async function generateShareCard({ holder, passportNumber, stamps = [], gpsCount = 0, passportPoints = 0, issuedCertCount = 0, rareBadges = [] }) {
    const W = 1080, H = 1920
    const canvas = document.createElement('canvas')
    canvas.width = W; canvas.height = H
    const ctx = canvas.getContext('2d')

    // Sky background
    const sky = ctx.createLinearGradient(0, 0, 0, H)
    sky.addColorStop(0, '#030712')
    sky.addColorStop(0.28, '#0c1445')
    sky.addColorStop(0.52, '#7c2d12')
    sky.addColorStop(0.74, '#c2410c')
    sky.addColorStop(0.90, '#f97316')
    sky.addColorStop(1, '#fbbf24')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, W, H)

    // Stars (deterministic, seeded by holder name)
    const seed = [...(holder || 'HG')].reduce((a, c, i) => a + c.charCodeAt(0) * (i + 1), 0)
    const rng = (n) => { const v = Math.sin(seed + n) * 10000; return v - Math.floor(v) }
    for (let i = 0; i < 130; i++) {
        ctx.globalAlpha = 0.3 + rng(i * 3) * 0.6
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(rng(i) * W, rng(i + 1) * H * 0.38, rng(i + 2) * 1.8 + 0.4, 0, Math.PI * 2)
        ctx.fill()
    }
    ctx.globalAlpha = 1

    // Mountain back layer
    ctx.fillStyle = '#111827'
    ctx.beginPath()
    ctx.moveTo(0, H); ctx.lineTo(0, H * 0.68)
    ctx.lineTo(90, H * 0.55); ctx.lineTo(180, H * 0.63); ctx.lineTo(270, H * 0.46)
    ctx.bezierCurveTo(310, H * 0.40, 350, H * 0.40, 390, H * 0.46)
    ctx.lineTo(490, H * 0.57); ctx.lineTo(570, H * 0.43)
    ctx.bezierCurveTo(610, H * 0.38, 650, H * 0.38, 690, H * 0.43)
    ctx.lineTo(780, H * 0.54); ctx.lineTo(870, H * 0.45)
    ctx.lineTo(960, H * 0.58); ctx.lineTo(W, H * 0.50)
    ctx.lineTo(W, H); ctx.closePath(); ctx.fill()

    // Mountain front layer
    ctx.fillStyle = '#0a0f1a'
    ctx.beginPath()
    ctx.moveTo(0, H); ctx.lineTo(0, H * 0.82)
    ctx.lineTo(100, H * 0.74); ctx.lineTo(200, H * 0.83); ctx.lineTo(310, H * 0.70)
    ctx.bezierCurveTo(350, H * 0.65, 390, H * 0.65, 430, H * 0.70)
    ctx.lineTo(540, H * 0.79); ctx.lineTo(640, H * 0.68)
    ctx.bezierCurveTo(680, H * 0.64, 720, H * 0.64, 760, H * 0.68)
    ctx.lineTo(860, H * 0.78); ctx.lineTo(960, H * 0.72)
    ctx.lineTo(W, H * 0.81); ctx.lineTo(W, H); ctx.closePath(); ctx.fill()

    // Gold accent lines
    ctx.fillStyle = '#c8963e'
    ctx.fillRect(0, 52, W, 3)
    ctx.globalAlpha = 0.45; ctx.fillRect(0, 61, W, 1); ctx.globalAlpha = 1

    // Emblem + Title
    ctx.font = '82px serif'; ctx.textAlign = 'center'; ctx.fillText('🌸', W / 2, 174)
    ctx.fillStyle = '#fde68a'; ctx.font = 'bold 54px Georgia, serif'
    ctx.fillText('HA GIANG LOOP', W / 2, 256)
    ctx.fillStyle = '#c8963e'; ctx.font = '30px Georgia, serif'
    ctx.fillText('EXPERIENCE PASSPORT', W / 2, 298)
    ctx.globalAlpha = 0.5; ctx.fillStyle = '#c8963e'
    ctx.fillRect(100, 318, W - 200, 2); ctx.globalAlpha = 1

    // Main card panel
    const cardX = 52, cardY = 346, cardW = W - 104, cardH = 930
    ctx.save(); ctx.globalAlpha = 0.16; ctx.fillStyle = '#fef3c7'
    rrect(ctx, cardX, cardY, cardW, cardH, 28); ctx.fill(); ctx.restore()
    ctx.strokeStyle = 'rgba(200,150,62,0.5)'; ctx.lineWidth = 1.5
    rrect(ctx, cardX, cardY, cardW, cardH, 28); ctx.stroke()

    // Holder label
    ctx.fillStyle = 'rgba(253,230,138,0.75)'; ctx.font = 'italic 26px Georgia, serif'
    ctx.textAlign = 'center'; ctx.fillText('HÀNH TRÌNH CỦA', W / 2, cardY + 68)

    // Holder name (auto-size)
    const nameFontSize = Math.max(42, Math.min(72, Math.floor(800 / Math.max((holder || 'Traveler').length, 7))))
    ctx.fillStyle = '#ffffff'; ctx.font = `bold ${nameFontSize}px Georgia, serif`
    const nameY = cardY + 68 + nameFontSize + 8
    ctx.fillText(holder || 'Traveler', W / 2, nameY)
    const nW = ctx.measureText(holder || 'Traveler').width
    ctx.strokeStyle = '#c8963e'; ctx.lineWidth = 3
    ctx.beginPath(); ctx.moveTo(W / 2 - nW / 2, nameY + 14); ctx.lineTo(W / 2 + nW / 2, nameY + 14); ctx.stroke()

    // Passport number
    ctx.fillStyle = 'rgba(253,230,138,0.6)'; ctx.font = '18px monospace'
    ctx.fillText(passportNumber || 'HGLP-000000-HG', W / 2, nameY + 48)

    // Stats row
    const statsTop = nameY + 88
    const statItems = [
        { icon: '🎖️', value: stamps.length, label: 'Stamps' },
        { icon: '✨', value: passportPoints, label: 'Points' },
        { icon: '📍', value: gpsCount, label: 'GPS' },
        { icon: '🏆', value: issuedCertCount, label: 'Certs' },
    ]
    const colW = cardW / 4
    statItems.forEach((s, i) => {
        const sx = cardX + colW * i + colW / 2
        ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = '#fde68a'
        rrect(ctx, cardX + colW * i + 12, statsTop, colW - 24, 118, 14)
        ctx.fill(); ctx.restore()
        ctx.font = '32px serif'; ctx.textAlign = 'center'; ctx.fillText(s.icon, sx, statsTop + 42)
        ctx.fillStyle = '#fde68a'; ctx.font = `bold ${s.value > 999 ? 30 : 40}px Georgia, serif`
        ctx.fillText(String(s.value), sx, statsTop + 86)
        ctx.fillStyle = 'rgba(255,255,255,0.65)'; ctx.font = '16px Arial, sans-serif'
        ctx.fillText(s.label, sx, statsTop + 108)
    })

    // Stamps section
    const divY1 = statsTop + 146
    ctx.fillStyle = 'rgba(200,150,62,0.5)'; ctx.fillRect(cardX + 50, divY1, cardW - 100, 1)
    ctx.fillStyle = 'rgba(253,230,138,0.75)'; ctx.font = 'bold 20px Arial, sans-serif'
    ctx.textAlign = 'center'; ctx.fillText('✦  TEM ĐÃ THU THẬP  ✦', W / 2, divY1 + 36)

    const perRow = 5
    if (stamps.length > 0) {
        const maxShow = Math.min(stamps.length, 9)
        const stampRows = Math.ceil(maxShow / perRow)
        const circSpacing = (cardW - 80) / perRow
        const circR = 36
        for (let row = 0; row < stampRows; row++) {
            const rowCount = Math.min(perRow, maxShow - row * perRow)
            const rowStartX = cardX + 40 + ((perRow - rowCount) * circSpacing) / 2
            for (let col = 0; col < rowCount; col++) {
                const stamp = stamps[row * perRow + col]; if (!stamp) break
                const sx = rowStartX + col * circSpacing + circSpacing / 2
                const sy = divY1 + 80 + row * 100
                ctx.save(); ctx.globalAlpha = 0.8; ctx.fillStyle = (stamp.color || '#c8963e') + '33'
                ctx.beginPath(); ctx.arc(sx, sy, circR + 5, 0, Math.PI * 2); ctx.fill(); ctx.restore()
                ctx.strokeStyle = stamp.color || '#c8963e'; ctx.lineWidth = 2
                ctx.beginPath(); ctx.arc(sx, sy, circR, 0, Math.PI * 2); ctx.stroke()
                ctx.font = '28px serif'; ctx.fillText(stamp.icon || '🌸', sx, sy + 10)
            }
        }
        if (stamps.length > 9) {
            ctx.fillStyle = 'rgba(253,230,138,0.6)'; ctx.font = '15px Georgia, serif'
            ctx.fillText(`+${stamps.length - 9} stamps`, W / 2, divY1 + 80 + Math.ceil(9 / perRow) * 100 + 20)
        }
    } else {
        ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = 'italic 22px Georgia, serif'
        ctx.fillText('Hành trình đang bắt đầu…', W / 2, divY1 + 70)
    }

    // Badges section
    const unlockedBadges = rareBadges.filter(b => b.unlocked)
    const BADGE_ICONS_MAP = { sunrise: '🌅', supporter: '🤝', 'full-loop': '🏍️', rain: '🌧️', market: '🧺' }
    const stampRows2 = stamps.length > 0 ? Math.ceil(Math.min(stamps.length, 9) / perRow) : 1
    const divY2 = divY1 + 80 + stampRows2 * 100 + 30
    if (unlockedBadges.length > 0 && divY2 < cardY + cardH - 130) {
        ctx.fillStyle = 'rgba(200,150,62,0.5)'; ctx.fillRect(cardX + 50, divY2, cardW - 100, 1)
        ctx.fillStyle = 'rgba(253,230,138,0.75)'; ctx.font = 'bold 20px Arial, sans-serif'
        ctx.fillText('✦  BADGES ĐẶC BIỆT  ✦', W / 2, divY2 + 36)
        const badgeCount = Math.min(unlockedBadges.length, 5)
        unlockedBadges.slice(0, badgeCount).forEach((badge, i) => {
            const bx = cardX + (i + 0.5) * (cardW / badgeCount)
            ctx.font = '36px serif'; ctx.fillText(BADGE_ICONS_MAP[badge.key] || '🏅', bx, divY2 + 82)
            ctx.fillStyle = 'rgba(253,230,138,0.7)'; ctx.font = '13px Arial, sans-serif'
            ctx.fillText(badge.name.split(' ').slice(0, 2).join(' '), bx, divY2 + 116)
        })
    }

    // Date stamp
    ctx.fillStyle = 'rgba(253,230,138,0.5)'; ctx.font = '17px Georgia, serif'
    ctx.fillText(`📅 ${new Date().toLocaleDateString('vi-VN')} · htxtruonghai.com`, W / 2, cardY + cardH - 44)

    // QR code
    const qrStartY = 1346
    try {
        const qrData = await QRCode.toDataURL('https://htxtruonghai.com/ho-chieu', {
            width: 180, margin: 1,
            color: { dark: '#1a1a2e', light: '#fef9f0' },
        })
        const qrImg = new Image()
        qrImg.src = qrData
        await new Promise(r => { qrImg.onload = r; qrImg.onerror = r })
        ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = '#fef9f0'
        rrect(ctx, W / 2 - 104, qrStartY - 12, 208, 208, 18); ctx.fill(); ctx.restore()
        ctx.drawImage(qrImg, W / 2 - 95, qrStartY, 190, 190)
    } catch { /* noop */ }

    ctx.fillStyle = 'rgba(253,230,138,0.9)'; ctx.font = 'bold 28px Georgia, serif'
    ctx.fillText('HTX TRƯỜNG HẢI', W / 2, qrStartY + 214)
    ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '20px Georgia, serif'
    ctx.fillText('Quét QR để tạo hộ chiếu của bạn! 🌸', W / 2, qrStartY + 252)

    // Bottom gold lines
    ctx.globalAlpha = 0.55; ctx.fillStyle = '#c8963e'; ctx.fillRect(0, H - 64, W, 1); ctx.globalAlpha = 1
    ctx.fillStyle = '#c8963e'; ctx.fillRect(0, H - 54, W, 3)

    return canvas
}

async function downloadShareCard(opts) {
    const canvas = await generateShareCard(opts)
    const link = document.createElement('a')
    link.download = `HaGiang-ShareCard-${(opts.holder || 'My').replace(/\s+/g, '-')}.png`
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
   GPS CHECK-IN TAB — real-location stamps
   ══════════════════════════════════════════════════════ */
function haversineMeters(lat1, lng1, lat2, lng2) {
    const R = 6371000
    const φ1 = lat1 * Math.PI / 180, φ2 = lat2 * Math.PI / 180
    const Δφ = (lat2 - lat1) * Math.PI / 180
    const Δλ = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function GpsCheckInTab({ passport, addGpsStamp, hasGpsStamp }) {
    const { t, lang } = useLang()
    const [gps, setGps] = useState(null) // null | 'loading' | { lat, lng } | 'error'
    const [justDone, setJustDone] = useState(null) // landmark id just stamped

    const requestGps = () => {
        setGps('loading')
        if (!navigator.geolocation) { setGps('error'); return }
        navigator.geolocation.getCurrentPosition(
            pos => setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => setGps('error'),
            { enableHighAccuracy: true, timeout: 12000 }
        )
    }

    const doCheckIn = (lm) => {
        addGpsStamp(lm.id)
        setJustDone(lm.id)
        setTimeout(() => setJustDone(null), 3000)
    }

    const gpsStamps = passport.gpsStamps || []
    const collected = gpsStamps.length

    return (
        <div className="ci-wrap">
            <div className="ci-header">
                <h2 className="ci-title">
                    {lang === 'en' ? '📍 Real-Location Check-in' : '📍 Check in thực địa'}
                </h2>
                <p className="ci-sub">
                    {lang === 'en'
                        ? 'Travel to each landmark, enable GPS, and collect your stamp!'
                        : 'Đến tận địa điểm, bật GPS và nhận stamp kỷ niệm!'}
                </p>
            </div>

            {/* GPS Control Bar */}
            <div className="ci-gps-bar">
                {gps === null && (
                    <button className="ci-gps-btn" onClick={requestGps}>
                        <MapPin size={15} />
                        {lang === 'en' ? 'Enable GPS' : 'Bật GPS định vị'}
                    </button>
                )}
                {gps === 'loading' && (
                    <div className="ci-gps-status ci-gps-loading">
                        <span className="ci-spinner">⏳</span>
                        {lang === 'en' ? 'Getting your location…' : 'Đang xác định vị trí…'}
                    </div>
                )}
                {gps === 'error' && (
                    <div className="ci-gps-status ci-gps-error">
                        ❌ {lang === 'en'
                            ? 'Location access denied. Allow in browser settings and try again.'
                            : 'Không lấy được GPS. Hãy cho phép truy cập vị trí trong trình duyệt.'}
                        <button className="ci-retry-btn" onClick={requestGps} title="Thử lại">
                            <RefreshCw size={13} />
                        </button>
                    </div>
                )}
                {gps && gps.lat && (
                    <div className="ci-gps-status ci-gps-ok">
                        ✅ {lang === 'en' ? 'Location found' : 'Đã có vị trí'}
                        <span className="ci-coords">{gps.lat.toFixed(4)}°N {gps.lng.toFixed(4)}°E</span>
                        <button className="ci-retry-btn" onClick={requestGps} title="Làm mới GPS">
                            <RefreshCw size={13} />
                        </button>
                    </div>
                )}
            </div>

            {/* Landmarks List */}
            <div className="ci-list">
                {GPS_LANDMARKS.map(lm => {
                    const earned = hasGpsStamp(lm.id)
                    const dist = gps && gps.lat ? haversineMeters(gps.lat, gps.lng, lm.lat, lm.lng) : null
                    const inRange = dist !== null && dist <= lm.radius
                    const isDone = justDone === lm.id
                    const distLabel = dist === null ? null
                        : dist < 1000 ? `${Math.round(dist)} m`
                            : `${(dist / 1000).toFixed(1)} km`

                    return (
                        <div key={lm.id}
                            className={`ci-item${earned ? ' ci-earned' : ''}${inRange && !earned ? ' ci-inrange' : ''}`}
                        >
                            <div className="ci-item-icon" style={{ background: earned ? lm.color + '22' : '#f8fafc', borderColor: earned ? lm.color : '#e2e8f0' }}>
                                <span className="ci-icon-emoji">{lm.icon}</span>
                                {earned && <span className="ci-icon-check" style={{ color: lm.color }}>✓</span>}
                            </div>
                            <div className="ci-item-body">
                                <div className="ci-item-name">{lang === 'en' ? lm.label_en : lm.label}</div>
                                {distLabel && (
                                    <div className={`ci-item-dist${inRange ? ' ci-dist-near' : ''}`}>
                                        {inRange ? `✅ ${distLabel} — ${lang === 'en' ? 'You\'re here!' : 'Bạn đang ở đây!'}` : `📍 ${distLabel} ${lang === 'en' ? 'away' : 'nữa'}`}
                                    </div>
                                )}
                                {!distLabel && (
                                    <div className="ci-item-hint">
                                        {lang === 'en' ? 'Enable GPS to see distance' : 'Bật GPS để xem khoảng cách'}
                                    </div>
                                )}
                            </div>
                            <div className="ci-item-cta">
                                {earned ? (
                                    <span className="ci-collected" style={{ color: lm.color }}>🏅 {lang === 'en' ? 'Collected' : 'Đã có'}</span>
                                ) : inRange ? (
                                    <button
                                        className={`ci-checkin-btn${isDone ? ' ci-done' : ''}`}
                                        style={{ '--lm-color': lm.color }}
                                        onClick={() => doCheckIn(lm)}
                                    >
                                        {isDone ? '🎉' : <><MapPin size={13} /> {lang === 'en' ? 'Check in' : 'Nhận stamp'}</>}
                                    </button>
                                ) : (
                                    <span className="ci-go-label">{lang === 'en' ? 'Go there' : 'Đến đây'} →</span>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Progress footer */}
            <div className="ci-footer">
                <div className="ci-footer-stat">
                    <span className="ci-footer-count">{collected}</span>
                    <span className="ci-footer-total"> / {GPS_LANDMARKS.length}</span>
                    <span className="ci-footer-label"> {lang === 'en' ? 'locations visited' : 'địa điểm đã đến'}</span>
                </div>
                <div className="ci-progress-track">
                    <div className="ci-progress-fill" style={{ width: `${(collected / GPS_LANDMARKS.length) * 100}%` }} />
                </div>
                {collected === GPS_LANDMARKS.length && (
                    <div className="ci-complete-msg">
                        🏆 {lang === 'en' ? 'You conquered all Ha Giang landmarks!' : 'Bạn đã chinh phục tất cả địa điểm Hà Giang!'}
                    </div>
                )}
            </div>
        </div>
    )
}

/* ══════════════════════════════════════════════════════
   BASIC TAB — 6 original stamps
   ══════════════════════════════════════════════════════ */
function BasicTab({ passport, hasStamp, handleDownloadBasicPng, handleDownloadBasicPdf, passportPoints }) {
    const { t, lang } = useLang()
    const [previewSrc, setPreviewSrc] = useState(null)
    const [previewing, setPreviewing] = useState(false)

    const handlePreview = async () => {
        setPreviewing(true)
        try {
            const { canvas } = await buildCertificateCanvas({ isBasic: true, holder: passport.holderName || 'Tên của bạn', earnedStamps: passport.stamps, passportPoints })
            setPreviewSrc(canvas.toDataURL('image/png'))
        } finally {
            setPreviewing(false)
        }
    }
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
            <div className="pp-howto-chips">
                {Object.entries(STAMP_DEFS).map(([type, def]) => (
                    <Link key={type}
                        to={type === 'tour' ? '/tours' : type === 'product' ? '/tours' : type === 'training' ? '/lien-he' : type === 'radio' ? '/lien-he' : '/'}
                        className={`pp-chip ${hasStamp(type) ? 'pp-chip-done' : ''}`}
                        style={{ '--sc': def.color }}
                    >
                        {def.icon} {hasStamp(type) ? '✓' : ''}
                    </Link>
                ))}
            </div>
            <div className="pp-cert-box">
                <div className="pp-cert-left">
                    <h3>{t('pp_cert_title_basic')}</h3>
                    <p>{passport.stamps.length === 0 ? t('pp_cert_no_stamps') : t('pp_cert_has').replace('{n}', passport.stamps.length)}</p>
                </div>
                <div className="pp-cert-actions">
                    <button className="pp-cert-btn pp-cert-btn-preview"
                        onClick={handlePreview} disabled={previewing}>
                        <Eye size={18} /> {previewing ? '⏳' : 'Xem trước'}
                    </button>
                    <button className={`pp-cert-btn ${passport.stamps.length === 0 ? 'pp-cert-btn-disabled' : ''}`}
                        onClick={handleDownloadBasicPng} disabled={passport.stamps.length === 0 || !passport.holderName}>
                        <Download size={18} /> PNG
                    </button>
                    <button className={`pp-cert-btn pp-cert-btn-pdf ${passport.stamps.length === 0 ? 'pp-cert-btn-disabled' : ''}`}
                        onClick={handleDownloadBasicPdf} disabled={passport.stamps.length === 0 || !passport.holderName}>
                        <Download size={18} /> PDF
                    </button>
                </div>
            </div>
            {previewSrc && <PreviewModal imgSrc={previewSrc} title="Chứng nhận Trải nghiệm" onClose={() => setPreviewSrc(null)} />}
        </div>
    )
}

/* ══════════════════════════════════════════════════════
   CERT TAB — Loop / Culture / Volunteer / Products
   ══════════════════════════════════════════════════════ */
function CertTab({ certDef, passport, hasCertStamp, addCertStamp, getCertStampCount, addReview, getReviews, holderName, addStamp, passportPoints, registerCertificate }) {
    const { t, lang } = useLang()
    const earnedCount = getCertStampCount(certDef.id)
    const totalCount = Object.keys(certDef.stamps).length
    const progress = (earnedCount / totalCount) * 100
    const minPoints = certDef.minPoints || (certDef.minStamps * 25)
    const issuedAt = passport.certs[certDef.id]?.issuedAt
    const canDownload = Boolean(issuedAt)

    const [downloading, setDownloading] = useState(false)
    const [downloadingPdf, setDownloadingPdf] = useState(false)
    const [previewSrc, setPreviewSrc] = useState(null)
    const [previewing, setPreviewing] = useState(false)
    const [reviewForm, setReviewForm] = useState({ rating: 0, location: '', comment: '' })
    const [reviewSent, setReviewSent] = useState(false)

    const handlePreview = async () => {
        setPreviewing(true)
        try {
            const stamps = Object.entries(certDef.stamps)
                .filter(([type]) => hasCertStamp(certDef.id, type))
                .map(([, def]) => def)
            const { canvas } = await buildCertificateCanvas({ certDef, holder: holderName || 'Tên của bạn', earnedStamps: stamps, passportPoints })
            setPreviewSrc(canvas.toDataURL('image/png'))
        } finally {
            setPreviewing(false)
        }
    }
    const reviews = getReviews(certDef.id)

    const handleDownloadPng = async () => {
        const stamps = Object.entries(certDef.stamps)
            .filter(([type]) => hasCertStamp(certDef.id, type))
            .map(([, def]) => def)
        const meta = await downloadCertificatePng({ certDef, holder: holderName, earnedStamps: stamps, passportPoints })
        registerCertificate({
            certCode: meta.certCode,
            verifyUrl: meta.verifyUrl,
            certId: certDef.id,
            certTitle: certDef.certTitle,
            holder: holderName,
            points: passportPoints,
            stampsCount: stamps.length,
            format: 'png',
            issuedAt: new Date().toISOString(),
        })
        setDownloading(true)
        setTimeout(() => setDownloading(false), 3000)
    }

    const handleDownloadPdf = async () => {
        const stamps = Object.entries(certDef.stamps)
            .filter(([type]) => hasCertStamp(certDef.id, type))
            .map(([, def]) => def)
        const meta = await downloadCertificatePdf({ certDef, holder: holderName, earnedStamps: stamps, passportPoints })
        registerCertificate({
            certCode: meta.certCode,
            verifyUrl: meta.verifyUrl,
            certId: certDef.id,
            certTitle: certDef.certTitle,
            holder: holderName,
            points: passportPoints,
            stampsCount: stamps.length,
            format: 'pdf',
            issuedAt: new Date().toISOString(),
        })
        setDownloadingPdf(true)
        setTimeout(() => setDownloadingPdf(false), 3000)
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
                {canDownload
                    ? `${t('pp_ct_enough')} • ${lang === 'en' ? 'Issued:' : 'Cấp:'} ${new Date(issuedAt).toLocaleDateString('vi-VN')}`
                    : `${t('pp_ct_more').replace('{n}', Math.max(0, certDef.minStamps - earnedCount))} • ${lang === 'en' ? 'Need points:' : 'Cần điểm:'} ${Math.max(0, minPoints - passportPoints)}`}
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
                    <p>
                        {canDownload
                            ? `${t('pp_ct_cert_ready')} (${lang === 'en' ? 'Auto issued' : 'Tự động cấp'})`
                            : `${t('pp_ct_cert_locked').replace('{n}', Math.max(0, certDef.minStamps - earnedCount))} • ${lang === 'en' ? 'Need' : 'Cần'} ${Math.max(0, minPoints - passportPoints)} ${lang === 'en' ? 'points' : 'điểm'}`}
                    </p>
                </div>
                <div className="pp-cert-actions">
                    <button className="pp-cert-btn pp-cert-btn-preview"
                        onClick={handlePreview} disabled={previewing}>
                        <Eye size={18} /> {previewing ? '⏳' : 'Xem trước'}
                    </button>
                    <button className={`pp-cert-btn ${!canDownload ? 'pp-cert-btn-disabled' : ''}`}
                        onClick={handleDownloadPng} disabled={!canDownload || !holderName}
                        title={!holderName ? t('pp_ct_name_req') : ''}>
                        <Download size={18} /> {downloading ? 'PNG ✓' : 'PNG'}
                    </button>
                    <button className={`pp-cert-btn pp-cert-btn-pdf ${!canDownload ? 'pp-cert-btn-disabled' : ''}`}
                        onClick={handleDownloadPdf} disabled={!canDownload || !holderName}
                        title={!holderName ? t('pp_ct_name_req') : ''}>
                        <Download size={18} /> {downloadingPdf ? 'PDF ✓' : 'PDF'}
                    </button>
                </div>
            </div>
            {previewSrc && <PreviewModal imgSrc={previewSrc} title={certDef.certTitle} onClose={() => setPreviewSrc(null)} />}

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
        markCertIssued,
        addReview, getReviews,
        addGpsStamp, hasGpsStamp,
        getEcoPoints,
        registerCertificate,
    } = usePassport()
    const { t, lang } = useLang()

    const [activeTab, setActiveTab] = useState('basic')
    const [editingName, setEditingName] = useState(!passport.holderName)
    const [nameInput, setNameInput] = useState(passport.holderName)
    const [sharingCard, setSharingCard] = useState(false)

    const saveName = () => {
        const n = nameInput.trim()
        if (!n) return
        setHolderName(n)
        addStamp('welcome')
        setEditingName(false)
    }

    const totalCertStamps = useMemo(
        () => Object.values(passport.certs || {}).reduce((sum, cert) => sum + Object.keys(cert.stamps || {}).length, 0),
        [passport.certs]
    )
    const ecoPoints = useMemo(() => getEcoPoints(), [passport.eco, getEcoPoints])
    const totalReviews = useMemo(
        () => Object.values(passport.certs || {}).reduce((sum, cert) => sum + (cert.reviews?.length || 0), 0),
        [passport.certs]
    )
    const passportPoints = useMemo(
        () => ecoPoints + (passport.stamps.length * 8) + (totalCertStamps * 10) + ((passport.gpsStamps || []).length * 15) + (totalReviews * 5),
        [ecoPoints, passport.stamps.length, totalCertStamps, passport.gpsStamps, totalReviews]
    )

    useEffect(() => {
        Object.values(CERT_TYPES).forEach(certDef => {
            const stampCount = getCertStampCount(certDef.id)
            const minPoints = certDef.minPoints || (certDef.minStamps * 25)
            const alreadyIssued = Boolean(passport.certs?.[certDef.id]?.issuedAt)
            if (!alreadyIssued && stampCount >= certDef.minStamps && passportPoints >= minPoints) {
                markCertIssued(certDef.id, {
                    auto: true,
                    pointsAtIssue: passportPoints,
                    stampsAtIssue: stampCount,
                })
            }
        })
    }, [passport.certs, passportPoints, getCertStampCount, markCertIssued])

    const issuedCertCount = useMemo(
        () => Object.values(passport.certs || {}).filter(cert => cert.issuedAt).length,
        [passport.certs]
    )

    const passportNumber = useMemo(() => {
        const dt = new Date(passport.createdAt)
        const y = dt.getFullYear()
        const m = String(dt.getMonth() + 1).padStart(2, '0')
        const d = String(dt.getDate()).padStart(2, '0')
        const initials = (passport.holderName || 'TRAVELER').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('') || 'HG'
        return `HGLP-${y}${m}${d}-${initials}`
    }, [passport.createdAt, passport.holderName])

    const rareBadges = useMemo(() => {
        const ecoScans = passport.eco?.scanEvents || []
        const hasLoopIssued = Boolean(passport.certs?.loop?.issuedAt)
        const hasEcoIssued = Boolean(passport.certs?.ecozone?.issuedAt)
        return [
            { key: 'sunrise', name: 'Sunrise Hunter', unlocked: (passport.gpsStamps || []).length >= 1 },
            { key: 'supporter', name: 'Women Supporter', unlocked: hasEcoIssued || totalReviews >= 1 },
            { key: 'full-loop', name: 'Full Loop Rider', unlocked: hasLoopIssued },
            { key: 'rain', name: 'Rain Survivor', unlocked: (passport.gpsStamps || []).length >= 3 },
            { key: 'market', name: 'Local Market Explorer', unlocked: ecoScans.some(e => e.siteCode === 'MK-CHO-LON-HG1' || e.siteCode === 'MK-CHO-PHIEN-HG2') },
        ]
    }, [passport.gpsStamps, passport.certs, passport.eco, totalReviews])

    const handleDownloadBasicPng = async () => {
        const meta = await downloadCertificatePng({ isBasic: true, holder: passport.holderName, earnedStamps: passport.stamps, passportPoints })
        registerCertificate({
            certCode: meta.certCode,
            verifyUrl: meta.verifyUrl,
            certId: 'basic',
            certTitle: 'CHỨNG NHẬN TRẢI NGHIỆM HÀ GIANG',
            holder: passport.holderName,
            points: passportPoints,
            stampsCount: passport.stamps.length,
            format: 'png',
            issuedAt: new Date().toISOString(),
        })
    }

    const handleDownloadBasicPdf = async () => {
        const meta = await downloadCertificatePdf({ isBasic: true, holder: passport.holderName, earnedStamps: passport.stamps, passportPoints })
        registerCertificate({
            certCode: meta.certCode,
            verifyUrl: meta.verifyUrl,
            certId: 'basic',
            certTitle: 'CHỨNG NHẬN TRẢI NGHIỆM HÀ GIANG',
            holder: passport.holderName,
            points: passportPoints,
            stampsCount: passport.stamps.length,
            format: 'pdf',
            issuedAt: new Date().toISOString(),
        })
    }

    const handleShareCard = async () => {
        setSharingCard(true)
        try {
            await downloadShareCard({
                holder: passport.holderName,
                passportNumber,
                stamps: passport.stamps,
                gpsCount: (passport.gpsStamps || []).length,
                passportPoints,
                issuedCertCount,
                rareBadges,
            })
        } finally {
            setSharingCard(false)
        }
    }

    const totalBasicProgress = (passport.stamps.length / Object.keys(STAMP_DEFS).length) * 100

    const LEVEL_MAP = [
        { min: 0, max: 49, icon: '🌱', name: 'Tân binh', nameEn: 'Newcomer', color: '#64748b' },
        { min: 50, max: 149, icon: '🌿', name: 'Lữ khách', nameEn: 'Traveler', color: '#16a34a' },
        { min: 150, max: 299, icon: '🏔️', name: 'Phượt thủ', nameEn: 'Adventurer', color: '#d97706' },
        { min: 300, max: 499, icon: '🦅', name: 'Chinh phục', nameEn: 'Explorer', color: '#7c3aed' },
        { min: 500, max: Infinity, icon: '🏆', name: 'Huyền thoại', nameEn: 'Legend', color: '#c8963e' },
    ]
    const currentLevel = LEVEL_MAP.findLast(l => passportPoints >= l.min) || LEVEL_MAP[0]
    const nextLevel = LEVEL_MAP[LEVEL_MAP.indexOf(currentLevel) + 1]

    const TABS = [
        { id: 'basic', icon: '🎖️', label: t('pp_tab_basic') },
        ...Object.values(CERT_TYPES).map(c => ({ id: c.id, icon: c.icon, label: lang === 'en' ? (c.shortTitle_en || c.shortTitle) : c.shortTitle, color: c.color })),
        { id: 'checkin', icon: '📍', label: lang === 'en' ? 'Check-in' : 'Thực địa', color: '#0ea5e9' },
    ]

    // Chia sẻ link passport
    const handleShare = () => {
        const url = window.location.href
        if (navigator.share) {
            navigator.share({ title: 'Hà Giang Passport', url })
        } else {
            navigator.clipboard.writeText(url)
            alert('Đã sao chép link, hãy gửi cho bạn bè!')
        }
    }

    // Đặt in hộ chiếu (mở link hoặc popup, có thể thay đổi sau)
    const handleOrderPrint = () => {
        window.open('/lien-he', '_blank')
    }

    return (
        <div className="page-enter pp-page">
            <div className="container" style={{ paddingTop: 24, paddingBottom: 0 }}>
                <Link to="/" className="btn-back"><ArrowLeft size={16} /> {t('pp_back')}</Link>
            </div>

            <section className="hgp-hero container">
                <div className="hgp-hero-overlay" />
                <div className="hgp-hero-content">
                    <p className="hgp-overline">WELCOME TO</p>
                    <h1>HA GIANG LOOP PASSPORT</h1>
                    <p>Collect memories, stamps and sisterhood across the mountains.</p>
                    <div className="hgp-hero-actions">
                        <Link className="hgp-btn hgp-btn-primary" to="/tours"><MapPin size={16} /> Đặt tour ngay</Link>
                        <button className="hgp-btn hgp-btn-secondary" onClick={() => document.querySelector('.pp-layout')?.scrollIntoView({ behavior: 'smooth' })}><BookOpen size={16} /> Tạo hộ chiếu</button>
                    </div>
                </div>
            </section>

            {/* ══ HOW IT WORKS ══ */}
            <section className="pp-intro container">
                <p className="pp-intro-desc">
                    {lang === 'en'
                        ? 'Ha Giang Passport is your digital travel diary. Complete activities, collect stamps, and earn a verified certificate of your journey.'
                        : 'Hộ chiếu Hà Giang là nhật ký hành trình số của bạn. Hoàn thành trải nghiệm, thu thập tem và nhận chứng nhận hành trình thực tế.'}
                </p>
                <div className="pp-intro-steps">
                    <div className="pp-intro-step">
                        <div className="pp-is-num">1</div>
                        <span className="pp-is-icon">✍️</span>
                        <p>{lang === 'en' ? 'Enter your name to create your passport' : 'Nhập tên để tạo hộ chiếu'}</p>
                    </div>
                    <div className="pp-intro-arrow">›</div>
                    <div className="pp-intro-step">
                        <div className="pp-is-num">2</div>
                        <span className="pp-is-icon">📸</span>
                        <p>{lang === 'en' ? 'Scan QR at eco-sites or join activities' : 'Quét QR tại điểm sinh thái hoặc tham gia hoạt động'}</p>
                    </div>
                    <div className="pp-intro-arrow">›</div>
                    <div className="pp-intro-step">
                        <div className="pp-is-num">3</div>
                        <span className="pp-is-icon">🏅</span>
                        <p>{lang === 'en' ? 'Collect stamps & earn points' : 'Thu thập tem & tích điểm hành trình'}</p>
                    </div>
                    <div className="pp-intro-arrow">›</div>
                    <div className="pp-intro-step">
                        <div className="pp-is-num">4</div>
                        <span className="pp-is-icon">🎓</span>
                        <p>{lang === 'en' ? 'Download your certificate' : 'Tải chứng nhận làm kỷ niệm'}</p>
                    </div>
                </div>
            </section>





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

                        {/* Passport number */}
                        <div style={{
                            fontFamily: 'monospace', fontSize: 11, letterSpacing: 2,
                            color: '#94a3b8', marginBottom: 10, background: '#f8f4ec',
                            padding: '4px 8px', borderRadius: 6, display: 'inline-block',
                        }}>
                            {passportNumber}
                        </div>

                        {/* Level badge */}
                        {passport.holderName && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                background: `${currentLevel.color}12`,
                                border: `1.5px solid ${currentLevel.color}40`,
                                borderRadius: 12, padding: '8px 12px', marginBottom: 12,
                            }}>
                                <span style={{ fontSize: 26 }}>{currentLevel.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 800, fontSize: 14, color: currentLevel.color }}>
                                        {lang === 'en' ? currentLevel.nameEn : currentLevel.name}
                                    </div>
                                    <div style={{ fontSize: 11, color: '#94a3b8' }}>
                                        {passportPoints} {lang === 'en' ? 'pts' : 'điểm'}
                                        {nextLevel && ` · còn ${nextLevel.min - passportPoints} → ${lang === 'en' ? nextLevel.nameEn : nextLevel.name}`}
                                    </div>
                                </div>
                                <div style={{
                                    background: currentLevel.color, color: '#fff',
                                    borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700,
                                }}>Lv.{LEVEL_MAP.indexOf(currentLevel) + 1}</div>
                            </div>
                        )}

                        <div className="pp-dp-row"><span>{t('pp_dp_issued')}</span><span>HTX Trường Hải</span></div>
                        <div className="pp-dp-row"><span>{t('pp_dp_created')}</span><span>{new Date(passport.createdAt).toLocaleDateString('vi-VN')}</span></div>
                        <div className="pp-dp-row">
                            <span>{t('pp_dp_stamps')}</span>
                            <span>
                                <strong style={{ color: '#c8963e', fontSize: 15 }}>{passport.stamps.length}</strong>
                                <span style={{ color: '#94a3b8' }}> / {Object.keys(STAMP_DEFS).length}</span>
                            </span>
                        </div>
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
                    <div className="pp-kpi-row">
                        <div className="pp-kpi-card">
                            <span>✨</span>
                            <div>
                                <strong>{passportPoints}</strong>
                                <p>{lang === 'en' ? 'Passport Points' : 'Điểm hộ chiếu'}</p>
                            </div>
                        </div>
                        <div className="pp-kpi-card">
                            <span>🌐</span>
                            <div>
                                <strong>{ecoPoints}</strong>
                                <p>{lang === 'en' ? 'Eco QR Points' : 'Điểm QR hệ sinh thái'}</p>
                            </div>
                        </div>
                        <div className="pp-kpi-card">
                            <span>🏆</span>
                            <div>
                                <strong>{issuedCertCount}</strong>
                                <p>{lang === 'en' ? 'Auto Issued Certificates' : 'Chứng nhận tự cấp'}</p>
                            </div>
                        </div>
                        <div className="pp-kpi-card">
                            <span>📍</span>
                            <div>
                                <strong>{(passport.gpsStamps || []).length}</strong>
                                <p>{lang === 'en' ? 'Real Check-ins' : 'Check-in thực địa'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Share Card */}
                    <div className="pp-share-row">
                        <button
                            className="pp-share-btn"
                            onClick={handleShareCard}
                            disabled={sharingCard || !passport.holderName}
                            title={!passport.holderName ? 'Nhập tên trước để tạo Share Card' : 'Tải ảnh chia sẻ Instagram/TikTok'}
                        >
                            {sharingCard ? '⏳ Đang tạo ảnh…' : '📤 Chia sẻ hành trình'}
                        </button>
                        {!passport.holderName && <span className="pp-share-hint">Nhập tên trước để tạo Share Card</span>}
                    </div>

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
                            <BasicTab
                                passport={passport}
                                hasStamp={hasStamp}
                                handleDownloadBasicPng={handleDownloadBasicPng}
                                handleDownloadBasicPdf={handleDownloadBasicPdf}
                                passportPoints={passportPoints}
                            />
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
                                    passportPoints={passportPoints}
                                    registerCertificate={registerCertificate}
                                />
                            )
                        )}
                        {activeTab === 'checkin' && (
                            <GpsCheckInTab
                                passport={passport}
                                addGpsStamp={addGpsStamp}
                                hasGpsStamp={hasGpsStamp}
                            />
                        )}
                    </div>



                    {!passport.holderName && (
                        <p className="pp-no-name-hint">
                            {t('pp_no_name_hint')}
                        </p>
                    )}
                </div>
            </div>

            <nav className="hgp-bottom-nav" aria-label="Passport mobile navigation">
                <Link to="/" className="hgp-nav-item"><Home size={16} /><span>Home</span></Link>
                <Link to="/ho-chieu" className="hgp-nav-item is-active"><BookOpen size={16} /><span>Passport</span></Link>
                <Link to="/tours" className="hgp-nav-item"><Map size={16} /><span>Tours</span></Link>
                <Link to="/lien-he" className="hgp-nav-item"><Phone size={16} /><span>Liên hệ</span></Link>
                <button type="button" className="hgp-nav-item" onClick={handleShareCard} disabled={sharingCard}><User size={16} /><span>Share</span></button>
            </nav>
        </div>
    )
}
