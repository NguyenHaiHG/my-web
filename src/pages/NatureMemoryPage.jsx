import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Plus, ChevronLeft, Trash2, Search, Leaf, Award, Upload, RefreshCw, WifiOff } from 'lucide-react'
import './NatureMemory.css'
import { uploadImageDataUrl } from '../utils/uploadImage'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const CATEGORIES = [
    { id: 'all', label: 'Tất cả', emoji: '🌿' },
    { id: 'plant', label: 'Thực vật', emoji: '🌱' },
    { id: 'insect', label: 'Côn trùng', emoji: '🦋' },
    { id: 'bird', label: 'Chim', emoji: '🐦' },
    { id: 'mammal', label: 'Thú', emoji: '🦊' },
    { id: 'fish', label: 'Cá/Ếch', emoji: '🐸' },
    { id: 'mushroom', label: 'Nấm', emoji: '🍄' },
    { id: 'other', label: 'Khác', emoji: '🔍' },
]

const WEATHERS = [
    { id: 'sunny', label: 'Nắng', emoji: '☀️' },
    { id: 'cloudy', label: 'Mây', emoji: '⛅' },
    { id: 'rainy', label: 'Mưa', emoji: '🌧️' },
    { id: 'foggy', label: 'Sương', emoji: '🌫️' },
    { id: 'windy', label: 'Gió', emoji: '💨' },
]

const SEASONS = [
    { id: 'spring', label: 'Xuân', emoji: '🌸' },
    { id: 'summer', label: 'Hạ', emoji: '☀️' },
    { id: 'autumn', label: 'Thu', emoji: '🍂' },
    { id: 'winter', label: 'Đông', emoji: '❄️' },
]

const MOODS = ['😊', '😮', '🤩', '🧐', '😌', '🥰']

const STORAGE_KEY = 'nature_memories_v1'

/* ─────────────────────────────────────────────
   CERTIFICATE LEVELS
───────────────────────────────────────────── */
const NATURE_LEVELS = [
    {
        id: 'explorer', minEntries: 1, minCategories: 1,
        title: 'Nhà Thám Hiểm Thiên Nhiên',
        titleEn: 'Nature Explorer',
        icon: '🔬', color: '#2e7d32', bg: '#e8f5e9', ribbon: '#66bb6a',
        desc: 'Đã bắt đầu hành trình khám phá thế giới tự nhiên.',
        descEn: 'Has begun the journey of exploring the natural world.',
    },
    {
        id: 'scientist', minEntries: 3, minCategories: 2,
        title: 'Nhà Khoa Học Nhí',
        titleEn: 'Young Scientist',
        icon: '🧪', color: '#1565c0', bg: '#e3f2fd', ribbon: '#42a5f5',
        desc: 'Đã quan sát và ghi chép nhiều loài khác nhau một cách khoa học.',
        descEn: 'Has scientifically observed and recorded multiple species.',
    },
    {
        id: 'naturalist', minEntries: 6, minCategories: 3,
        title: 'Nhà Tự Nhiên Học',
        titleEn: 'Young Naturalist',
        icon: '🏆', color: '#e65100', bg: '#fff3e0', ribbon: '#ffa726',
        desc: 'Đã trở thành nhà tự nhiên học thực thụ với kiến thức đa dạng về sinh vật.',
        descEn: 'Has become a true naturalist with diverse knowledge of living things.',
    },
]

function getLevelFor(memories) {
    const total = memories.length
    const cats = new Set(memories.map(m => m.category)).size
    let best = null
    for (const lv of NATURE_LEVELS) {
        if (total >= lv.minEntries && cats >= lv.minCategories) best = lv
    }
    return best || NATURE_LEVELS[0]
}

/* ─────────────────────────────────────────────
   CERTIFICATE CANVAS
───────────────────────────────────────────── */
async function buildNatureCertCanvas({ holderName, memories }) {
    const W = 1400, H = 980
    const canvas = document.createElement('canvas')
    canvas.width = W; canvas.height = H
    const ctx = canvas.getContext('2d')

    const level = getLevelFor(memories)
    const total = memories.length
    const cats = [...new Set(memories.map(m => m.category))]
    const catLabels = cats.map(c => {
        const found = CATEGORIES.find(x => x.id === c)
        return found ? `${found.emoji} ${found.label}` : c
    }).join('  ·  ')

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, W, H)
    bg.addColorStop(0, '#f0fdf4')
    bg.addColorStop(0.5, '#fefce8')
    bg.addColorStop(1, '#f0f9ff')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)

    // Outer border double
    ctx.strokeStyle = level.color; ctx.lineWidth = 12
    ctx.strokeRect(18, 18, W - 36, H - 36)
    ctx.strokeStyle = level.ribbon; ctx.lineWidth = 3
    ctx.strokeRect(34, 34, W - 68, H - 68)

    // Corner decorations
    const corners = [[60, 60], [W - 60, 60], [60, H - 60], [W - 60, H - 60]]
    corners.forEach(([x, y]) => {
        ctx.font = '44px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText('🌿', x, y)
    })

    // Top ribbon band
    ctx.fillStyle = level.color
    ctx.fillRect(0, 52, W, 130)

    // Main title in band
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 52px Georgia, serif'
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'
    ctx.fillText('CHỨNG NHẬN KHÁM PHÁ THIÊN NHIÊN', W / 2, 118)
    ctx.font = '20px Georgia, serif'
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.fillText('Certificate of Nature Exploration  ·  HTX Trường Hải · Tuyên Quang', W / 2, 150)

    // Level badge area
    ctx.font = '72px serif'; ctx.textAlign = 'center'
    ctx.fillText(level.icon, W / 2, 260)

    // Level title
    ctx.fillStyle = level.color
    ctx.font = 'bold 48px Georgia, serif'
    ctx.fillText(level.title, W / 2, 320)
    ctx.fillStyle = '#64748b'; ctx.font = 'italic 26px Georgia, serif'
    ctx.fillText(level.titleEn, W / 2, 360)

    // Decorative divider
    ctx.strokeStyle = level.ribbon; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(200, 385); ctx.lineTo(W - 200, 385); ctx.stroke()

    // "Trân trọng chứng nhận"
    ctx.fillStyle = '#4a4a4a'; ctx.font = 'italic 24px Georgia, serif'
    ctx.fillText('Trân trọng chứng nhận em / This is to certify that', W / 2, 430)

    // Holder name
    ctx.fillStyle = '#1a3a4a'; ctx.font = 'bold 82px Georgia, serif'
    ctx.fillText(holderName || 'Nhà Khám Phá Nhí', W / 2, 535)
    const nW = ctx.measureText(holderName || 'Nhà Khám Phá Nhí').width
    ctx.strokeStyle = level.ribbon; ctx.lineWidth = 3
    ctx.beginPath(); ctx.moveTo(W / 2 - nW / 2, 552); ctx.lineTo(W / 2 + nW / 2, 552); ctx.stroke()

    // Description
    ctx.fillStyle = '#374151'; ctx.font = '24px Georgia, serif'
    ctx.fillText(level.desc, W / 2, 600)
    ctx.fillStyle = '#6b7280'; ctx.font = 'italic 20px Georgia, serif'
    ctx.fillText(level.descEn, W / 2, 634)

    // Stats row
    ctx.fillStyle = level.color; ctx.font = 'bold 22px Georgia, serif'
    ctx.fillText(`📖 ${total} ghi chép / entries`, W / 2 - 200, 690)
    ctx.fillText(`🌿 ${cats.length} loài / categories`, W / 2 + 200, 690)

    // Category list
    if (catLabels) {
        ctx.fillStyle = '#374151'; ctx.font = '18px Georgia, serif'
        ctx.fillText(catLabels, W / 2, 724)
    }

    // Decorative nature row
    ctx.font = '32px serif'
    const deco = ['🌱', '🦋', '🐦', '🍄', '🌸', '🦊', '🐸', '🌿']
    deco.forEach((em, i) => {
        ctx.fillText(em, 160 + i * 160, 780)
    })

    // Footer line
    ctx.strokeStyle = level.ribbon; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(80, 820); ctx.lineTo(W - 80, 820); ctx.stroke()
    ctx.fillStyle = '#4a4a4a'; ctx.font = '16px Georgia, serif'; ctx.textAlign = 'left'
    ctx.fillText(`Ngày cấp: ${new Date().toLocaleDateString('vi-VN')}`, 100, 848)
    ctx.fillText('HTX Trường Hải – Trải nghiệm sinh thái', 100, 872)
    ctx.textAlign = 'right'
    ctx.fillText('htxtruonghai.com', W - 100, 848)
    ctx.fillStyle = '#9ca3af'; ctx.font = '13px Georgia, serif'
    ctx.fillText('Nhật Ký Thiên Nhiên / Nature Memory Journal', W - 100, 872)

    return canvas
}

/* ─────────────────────────────────────────────
   CERTIFICATE MODAL
───────────────────────────────────────────── */
function CertModal({ memories, onClose }) {
    const [name, setName] = useState('')
    const [preview, setPreview] = useState(null)
    const [loading, setLoading] = useState(false)
    const level = getLevelFor(memories)

    const handlePreview = async () => {
        if (!name.trim()) return
        setLoading(true)
        const canvas = await buildNatureCertCanvas({ holderName: name.trim(), memories })
        setPreview(canvas.toDataURL('image/png'))
        setLoading(false)
    }

    const handleDownload = () => {
        if (!preview) return
        const a = document.createElement('a')
        a.href = preview
        a.download = `chung-nhan-${name.trim().replace(/\s+/g, '-').toLowerCase() || 'kham-pha'}-${Date.now()}.png`
        a.click()
    }

    return (
        <div className="nm-backdrop" onClick={onClose}>
            <div className="nm-cert-modal" onClick={e => e.stopPropagation()}>
                <div className="nm-add-header">
                    <button className="nm-icon-btn" onClick={onClose}><X size={20} /></button>
                    <h2>🏅 Chứng Nhận Khám Phá <span style={{ fontWeight: 400, fontSize: 13, opacity: .6 }}>/ Certificate</span></h2>
                    <div style={{ width: 36 }} />
                </div>

                {/* Level display */}
                <div className="nm-cert-level" style={{ background: level.bg, borderColor: level.color }}>
                    <span className="nm-cert-level-icon">{level.icon}</span>
                    <div>
                        <div className="nm-cert-level-title" style={{ color: level.color }}>{level.title}</div>
                        <div className="nm-cert-level-en">{level.titleEn}</div>
                        <div className="nm-cert-level-stats">
                            📖 {memories.length} ghi chép &nbsp;·&nbsp; 🌿 {new Set(memories.map(m => m.category)).size} loài
                        </div>
                    </div>
                </div>

                {/* Name input */}
                <div className="nm-field" style={{ padding: '0 20px' }}>
                    <label className="nm-label">Tên của bé <span style={{ color: '#94a3b8', fontWeight: 400 }}>/ Child's name</span></label>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <input
                            className="nm-input"
                            placeholder="Nhập tên bé để in lên chứng nhận…"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handlePreview()}
                            autoFocus
                        />
                        <button className="nm-btn-primary" onClick={handlePreview} disabled={!name.trim() || loading}
                            style={{ whiteSpace: 'nowrap', minWidth: 110 }}>
                            {loading ? '⏳' : '👁 Xem trước'}
                        </button>
                    </div>
                </div>

                {/* Preview */}
                {preview && (
                    <div className="nm-cert-preview">
                        <img src={preview} alt="Certificate preview" style={{ width: '100%', borderRadius: 8, border: `2px solid ${level.ribbon}` }} />
                        <button className="nm-btn-primary nm-btn-full" onClick={handleDownload}
                            style={{ marginTop: 12, background: level.color }}>
                            ⬇️ Tải chứng nhận (PNG) / Download Certificate
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function getSeason() {
    const m = new Date().getMonth() + 1
    if (m >= 2 && m <= 4) return 'spring'
    if (m >= 5 && m <= 7) return 'summer'
    if (m >= 8 && m <= 10) return 'autumn'
    return 'winter'
}

function loadMemories() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : []
    } catch { return [] }
}

function saveMemories(list) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) } catch { /* quota */ }
}

function normalizeMemory(entry) {
    if (!entry) return null
    return {
        ...entry,
        id: entry.id || entry._id || entry.clientId,
        clientId: entry.clientId || entry.id || '',
    }
}

async function fetchRemoteMemories() {
    const res = await fetch(`${API}/api/nature-memories`)
    if (!res.ok) throw new Error('fetch nature memories failed')
    return res.json()
}

async function createRemoteMemory(entry) {
    const imageUrl = await uploadImageDataUrl(entry.img || '', `${entry.name || 'nature-memory'}.jpg`)
    const payload = {
        clientId: entry.clientId || entry.id || '',
        name: entry.name || '',
        scientificName: entry.scientificName || '',
        category: entry.category || 'other',
        notes: entry.notes || '',
        location: entry.location || '',
        weather: entry.weather || '',
        season: entry.season || '',
        mood: entry.mood || '',
        img: imageUrl,
        time: entry.time || '',
        createdAt: entry.createdAt || Date.now(),
    }

    const res = await fetch(`${API}/api/nature-memories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('create nature memory failed')
    return res.json()
}

async function deleteRemoteMemory(id) {
    const res = await fetch(`${API}/api/nature-memories/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('delete nature memory failed')
}

function compressImage(file, maxW = 1000, quality = 0.78) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = reject
        reader.onload = ev => {
            const img = new Image()
            img.onerror = reject
            img.onload = () => {
                const scale = Math.min(1, maxW / Math.max(img.width, img.height))
                const canvas = document.createElement('canvas')
                canvas.width = Math.round(img.width * scale)
                canvas.height = Math.round(img.height * scale)
                canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
                resolve(canvas.toDataURL('image/jpeg', quality))
            }
            img.src = ev.target.result
        }
        reader.readAsDataURL(file)
    })
}

function catFor(id) {
    return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1]
}

function weatherFor(id) {
    return WEATHERS.find(w => w.id === id) || null
}

/* ─────────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────────── */
function EmptyState({ onAdd }) {
    return (
        <div className="nm-empty">
            <div className="nm-empty-art">
                <span className="nm-empty-leaf">🌿</span>
                <span className="nm-empty-leaf nm-leaf2">🍃</span>
                <span className="nm-empty-leaf nm-leaf3">🌸</span>
            </div>
            <h3>Nhật ký thiên nhiên của bạn trống</h3>
            <p style={{ marginBottom: 4 }}>Hãy bắt đầu ghi chép quan sát đầu tiên — cây cối, côn trùng, chim chóc xung quanh bạn.</p>
            <p style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic', marginBottom: 16 }}>Start recording your first nature observation — plants, insects, birds around you.</p>
            <button className="nm-btn-primary" onClick={onAdd}>
                <Plus size={16} /> Ghi chép đầu tiên &nbsp;<span style={{ opacity: .7, fontWeight: 400 }}>/ First note</span>
            </button>
        </div>
    )
}

/* ─────────────────────────────────────────────
   ENTRY CARD
───────────────────────────────────────────── */
function EntryCard({ entry, onClick }) {
    const cat = catFor(entry.category)
    const weather = weatherFor(entry.weather)
    const d = new Date(entry.createdAt)
    const day = d.getDate().toString().padStart(2, '0')
    const mon = d.toLocaleString('vi-VN', { month: 'short' })
    const yr = d.getFullYear()

    return (
        <article className="nm-card" onClick={onClick} tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onClick()}>
            {entry.img && (
                <div className="nm-card-photo">
                    <img src={entry.img} alt={entry.name} loading="lazy" />
                    <span className="nm-card-cat-badge">{cat.emoji}</span>
                </div>
            )}
            {!entry.img && (
                <div className="nm-card-no-photo">
                    <span className="nm-card-cat-big">{cat.emoji}</span>
                </div>
            )}
            <div className="nm-card-body">
                <div className="nm-card-meta">
                    <span className="nm-card-date-tag">
                        <span className="nm-date-day">{day}</span>
                        <span className="nm-date-mon">{mon} {yr}</span>
                    </span>
                    {weather && <span className="nm-card-weather" title={`${weather.label} / ${weather.labelEn}`}>{weather.emoji}</span>}
                    {entry.mood && <span className="nm-card-mood">{entry.mood}</span>}
                </div>
                <h3 className="nm-card-name">{entry.name || '(Chưa đặt tên)'}</h3>
                {entry.scientificName && (
                    <p className="nm-card-sci">{entry.scientificName}</p>
                )}
                <p className="nm-card-cat-label" style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0' }}>
                    {cat.emoji} {cat.label} / {cat.labelEn}
                </p>
                {entry.notes && (
                    <p className="nm-card-notes">{entry.notes}</p>
                )}
                {entry.location && (
                    <p className="nm-card-loc">📍 {entry.location}</p>
                )}
            </div>
        </article>
    )
}

/* ─────────────────────────────────────────────
   DETAIL MODAL
───────────────────────────────────────────── */
function DetailModal({ entry, onClose, onDelete }) {
    const cat = catFor(entry.category)
    const weather = weatherFor(entry.weather)
    const season = SEASONS.find(s => s.id === entry.season)
    const d = new Date(entry.createdAt)
    const dateStr = d.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

    return (
        <div className="nm-backdrop" onClick={onClose}>
            <div className="nm-detail-modal" onClick={e => e.stopPropagation()}>
                <div className="nm-detail-header">
                    <button className="nm-icon-btn" onClick={onClose}><ChevronLeft size={20} /></button>
                    <span className="nm-detail-cat">{cat.emoji} {cat.label}</span>
                    <button className="nm-icon-btn nm-delete-btn" onClick={() => onDelete(entry.id)}
                        title="Xoá ghi chép này">
                        <Trash2 size={18} />
                    </button>
                </div>

                {entry.img && (
                    <div className="nm-detail-photo">
                        <img src={entry.img} alt={entry.name} />
                    </div>
                )}

                <div className="nm-detail-body">
                    <div className="nm-detail-badges">
                        {weather && <span className="nm-badge">{weather.emoji} {weather.label} <span style={{ opacity: .6, fontSize: 11 }}>/ {weather.labelEn}</span></span>}
                        {season && <span className="nm-badge">{season.emoji} {season.label} <span style={{ opacity: .6, fontSize: 11 }}>/ {season.labelEn}</span></span>}
                        {entry.mood && <span className="nm-badge nm-badge-mood">{entry.mood}</span>}
                    </div>

                    <h2 className="nm-detail-name">{entry.name || '(Chưa đặt tên)'}</h2>
                    {entry.scientificName && (
                        <p className="nm-detail-sci">{entry.scientificName}</p>
                    )}

                    <p className="nm-detail-date">{dateStr}</p>
                    {entry.time && <p className="nm-detail-time">🕐 {entry.time}</p>}
                    {entry.location && <p className="nm-detail-loc">📍 {entry.location}</p>}

                    {entry.notes && (
                        <div className="nm-detail-notes">
                            <div className="nm-notes-rule" />
                            <p>{entry.notes}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

/* ─────────────────────────────────────────────
   ADD MODAL
───────────────────────────────────────────── */
const BLANK = {
    name: '', scientificName: '', category: 'plant', notes: '',
    location: '', weather: 'sunny', season: getSeason(), mood: '😊',
    img: '', time: '',
}

function AddModal({ onClose, onSave, initialFile }) {
    const [form, setForm] = useState({ ...BLANK, season: getSeason() })
    const [preview, setPreview] = useState('')
    const [saving, setSaving] = useState(false)
    const [imgErr, setImgErr] = useState('')
    const [saveErr, setSaveErr] = useState('')
    const fileRef = useRef()

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    useEffect(() => {
        if (!initialFile) return

        let cancelled = false
        compressImage(initialFile)
            .then(compressed => {
                if (cancelled) return
                setPreview(compressed)
                setForm(current => ({ ...current, img: compressed }))
            })
            .catch(() => {
                if (!cancelled) setImgErr('Không đọc được ảnh, thử file khác')
            })

        return () => { cancelled = true }
    }, [initialFile])

    const handleFile = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > 25 * 1024 * 1024) { setImgErr('Ảnh quá lớn (tối đa 25MB)'); return }
        setImgErr('')
        try {
            const compressed = await compressImage(file)
            setPreview(compressed)
            set('img', compressed)
        } catch { setImgErr('Không đọc được ảnh, thử file khác') }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setSaveErr('')
        const now = Date.now()
        const entry = {
            ...form,
            id: uid(),
            createdAt: now,
            time: form.time || new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        }
        try {
            await onSave(entry)
        } catch (err) {
            setSaveErr(err?.message || 'Không lưu được ghi chép lên server')
            setSaving(false)
        }
    }

    return (
        <div className="nm-backdrop" onClick={onClose}>
            <div className="nm-add-modal" onClick={e => e.stopPropagation()}>
                <div className="nm-add-header">
                    <button className="nm-icon-btn" onClick={onClose}><X size={20} /></button>
                    <h2>✏️ Ghi chép mới <span style={{ fontWeight: 400, fontSize: 14, opacity: .6 }}>/ New Entry</span></h2>
                    <div style={{ width: 36 }} />
                </div>

                <form onSubmit={handleSubmit} className="nm-form" noValidate>
                    {/* PHOTO */}
                    <label className="nm-photo-upload" onClick={() => fileRef.current?.click()}>
                        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
                        {preview
                            ? <div className="nm-photo-preview">
                                <img src={preview} alt="preview" />
                                <div className="nm-photo-overlay"><Plus size={18} /> Đổi ảnh / Change photo</div>
                            </div>
                            : <div className="nm-photo-placeholder">
                                <span className="nm-photo-icon">📷</span>
                                <span>Chụp / chọn ảnh <span style={{ opacity: .6 }}>/ Take or upload photo</span></span>
                                <small>Tuỳ chọn — PNG, JPG, WEBP</small>
                            </div>
                        }
                    </label>
                    {imgErr && <p className="nm-err">{imgErr}</p>}

                    {/* CATEGORY */}
                    <div className="nm-field">
                        <label className="nm-label">Loài <span style={{ color: '#94a3b8', fontWeight: 400 }}>/ Category</span></label>
                        <div className="nm-cat-pills">
                            {CATEGORIES.slice(1).map(c => (
                                <button key={c.id} type="button"
                                    className={`nm-pill${form.category === c.id ? ' nm-pill-active' : ''}`}
                                    onClick={() => set('category', c.id)}>
                                    {c.emoji} {c.label}<span style={{ fontSize: 10, opacity: .65, marginLeft: 2 }}>/{c.labelEn}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* NAME */}
                    <div className="nm-field">
                        <label className="nm-label">Tên <span style={{ color: '#94a3b8', fontWeight: 400 }}>/ Name</span><span className="nm-req"> *</span></label>
                        <input className="nm-input" placeholder="VD: Cây dương xỉ / Bướm vàng / Chào mào"
                            value={form.name} onChange={e => set('name', e.target.value)} required autoFocus />
                    </div>

                    {/* SCIENTIFIC NAME */}
                    <div className="nm-field">
                        <label className="nm-label">Tên khoa học <span style={{ color: '#94a3b8', fontWeight: 400 }}>/ Scientific name</span> <span className="nm-opt">(tuỳ chọn)</span></label>
                        <input className="nm-input nm-input-sci" placeholder="VD: Nephrolepis exaltata"
                            value={form.scientificName} onChange={e => set('scientificName', e.target.value)} />
                    </div>

                    {/* NOTES */}
                    <div className="nm-field">
                        <label className="nm-label">Quan sát / Ghi chú <span style={{ color: '#94a3b8', fontWeight: 400 }}>/ Observations & notes</span></label>
                        <textarea className="nm-input nm-textarea"
                            placeholder="Mô tả đặc điểm, hành vi, màu sắc, kích thước… / Describe features, behaviour, colour, size…"
                            value={form.notes} onChange={e => set('notes', e.target.value)} rows={4} />
                    </div>

                    {/* WEATHER + SEASON row */}
                    <div className="nm-row">
                        <div className="nm-field nm-field-half">
                            <label className="nm-label">Thời tiết <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: 11 }}>/ Weather</span></label>
                            <div className="nm-toggle-row">
                                {WEATHERS.map(w => (
                                    <button key={w.id} type="button"
                                        className={`nm-toggle${form.weather === w.id ? ' nm-toggle-active' : ''}`}
                                        title={`${w.label} / ${w.labelEn}`} onClick={() => set('weather', w.id)}>
                                        {w.emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="nm-field nm-field-half">
                            <label className="nm-label">Mùa <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: 11 }}>/ Season</span></label>
                            <div className="nm-toggle-row">
                                {SEASONS.map(s => (
                                    <button key={s.id} type="button"
                                        className={`nm-toggle${form.season === s.id ? ' nm-toggle-active' : ''}`}
                                        title={`${s.label} / ${s.labelEn}`} onClick={() => set('season', s.id)}>
                                        {s.emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* LOCATION + TIME */}
                    <div className="nm-row">
                        <div className="nm-field nm-field-half">
                            <label className="nm-label">Địa điểm <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: 11 }}>/ Location</span></label>
                            <input className="nm-input" placeholder="VD: Sân trường / School garden…"
                                value={form.location} onChange={e => set('location', e.target.value)} />
                        </div>
                        <div className="nm-field nm-field-half">
                            <label className="nm-label">Giờ <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: 11 }}>/ Time</span></label>
                            <input className="nm-input" type="time" value={form.time}
                                onChange={e => set('time', e.target.value)} />
                        </div>
                    </div>

                    {/* MOOD */}
                    <div className="nm-field">
                        <label className="nm-label">Cảm xúc <span style={{ color: '#94a3b8', fontWeight: 400, fontSize: 11 }}>/ Mood</span></label>
                        <div className="nm-toggle-row">
                            {MOODS.map(m => (
                                <button key={m} type="button"
                                    className={`nm-toggle nm-toggle-lg${form.mood === m ? ' nm-toggle-active' : ''}`}
                                    onClick={() => set('mood', m)}>
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="nm-btn-primary nm-btn-full" disabled={saving}>
                        {saving ? '⏳ Đang đăng tải lên server…' : '📝 Đăng tải ghi chép  /  Upload entry'}
                    </button>
                    {saveErr && <p className="nm-err">{saveErr}. Vui lòng kiểm tra server và thử lại.</p>}
                </form>
            </div>
        </div>
    )
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function NatureMemoryPage() {
    const [memories, setMemories] = useState(loadMemories)
    const [filterCat, setFilterCat] = useState('all')
    const [search, setSearch] = useState('')
    const [showAdd, setShowAdd] = useState(false)
    const [detail, setDetail] = useState(null)
    const [showSearch, setShowSearch] = useState(false)
    const [showCert, setShowCert] = useState(false)
    const [uploadFile, setUploadFile] = useState(null)
    const [serverStatus, setServerStatus] = useState('checking')
    const [saveNotice, setSaveNotice] = useState('')
    const uploadRef = useRef()

    const checkServer = useCallback(async () => {
        setServerStatus('checking')
        const controller = new AbortController()
        const timeout = window.setTimeout(() => controller.abort(), 6000)
        try {
            const res = await fetch(`${API}/api/health`, { signal: controller.signal })
            const health = res.ok ? await res.json() : null
            setServerStatus(health?.status === 'ok' && health?.dbConnected !== false ? 'online' : 'offline')
        } catch {
            setServerStatus('offline')
        } finally {
            window.clearTimeout(timeout)
        }
    }, [])

    useEffect(() => { checkServer() }, [checkServer])

    // Persist on every change
    useEffect(() => { saveMemories(memories) }, [memories])

    // Load from backend first; if unavailable, keep localStorage fallback.
    useEffect(() => {
        let cancelled = false

        const syncMemories = async () => {
            const local = loadMemories()
            try {
                let remote = await fetchRemoteMemories()
                if (cancelled) return

                const remoteNormalized = remote.map(normalizeMemory).filter(Boolean)
                const remoteClientIds = new Set(remoteNormalized.map(e => e.clientId).filter(Boolean))
                const remoteIds = new Set(remoteNormalized.map(e => e.id).filter(Boolean))

                const missingLocal = local.filter(e => {
                    const localId = e.id || e.clientId || ''
                    if (!localId) return true
                    return !remoteClientIds.has(localId) && !remoteIds.has(localId)
                })

                if (missingLocal.length > 0) {
                    for (const item of missingLocal) {
                        try {
                            await createRemoteMemory(item)
                        } catch {
                            // Keep local fallback if one entry cannot sync.
                        }
                    }
                    remote = await fetchRemoteMemories()
                }

                if (cancelled) return
                const synced = remote.map(normalizeMemory).filter(Boolean)
                if (synced.length > 0) {
                    setMemories(synced)
                    saveMemories(synced)
                } else {
                    setMemories(local)
                }
            } catch {
                if (!cancelled) setMemories(local)
            }
        }

        syncMemories()
        return () => { cancelled = true }
    }, [])

    const handleSave = useCallback(async (entry) => {
        setSaveNotice('')
        try {
            const created = await createRemoteMemory(entry)
            const normalized = normalizeMemory(created)
            if (normalized) {
                setMemories(m => [normalized, ...m.filter(x => x.id !== normalized.id && x.clientId !== normalized.clientId)])
                setServerStatus('online')
                setSaveNotice('Đã đăng tải ảnh và ghi chép lên server.')
                setShowAdd(false)
                setUploadFile(null)
                return
            }
            throw new Error('Server không trả về ghi chép đã lưu')
        } catch (err) {
            setServerStatus('offline')
            throw err
        }
    }, [])

    const handleUploadPick = useCallback((event) => {
        const file = event.target.files?.[0]
        if (!file) return
        if (file.size > 25 * 1024 * 1024) {
            setSaveNotice('Ảnh quá lớn — vui lòng chọn ảnh dưới 25MB.')
            event.target.value = ''
            return
        }
        setUploadFile(file)
        setShowAdd(true)
        event.target.value = ''
    }, [])

    const handleDelete = useCallback(async (id) => {
        if (!window.confirm('Xoá ghi chép này?')) return
        setMemories(m => m.filter(e => e.id !== id && e.clientId !== id))
        setDetail(null)
        try {
            await deleteRemoteMemory(id)
        } catch {
            // Ignore network errors; local removal still succeeds.
        }
    }, [])

    const filtered = memories.filter(e => {
        const matchCat = filterCat === 'all' || e.category === filterCat
        const q = search.toLowerCase()
        const matchQ = !q || e.name?.toLowerCase().includes(q) ||
            e.scientificName?.toLowerCase().includes(q) ||
            e.notes?.toLowerCase().includes(q) ||
            e.location?.toLowerCase().includes(q)
        return matchCat && matchQ
    })

    const stats = {
        total: memories.length,
        plants: memories.filter(e => e.category === 'plant').length,
        insects: memories.filter(e => e.category === 'insect').length,
        birds: memories.filter(e => e.category === 'bird').length,
    }

    return (
        <div className="nm-page page-enter">
            {/* HEADER */}
            <div className="nm-hero">
                <div className="nm-hero-deco" aria-hidden="true">
                    <span>🌿</span><span>🍃</span><span>🌸</span><span>🦋</span><span>🌱</span>
                </div>
                <div className="nm-hero-content">
                    <div className="nm-hero-badge">
                        <Leaf size={14} /> 自然ノート
                    </div>
                    <h1 className="nm-hero-title">Nhật Ký Thiên Nhiên</h1>
                    <p className="nm-hero-sub" style={{ marginBottom: 2 }}>
                        Quan sát cây cối và sinh vật xung quanh — để biết nhiều hơn về thiên nhiên
                    </p>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', fontStyle: 'italic', marginBottom: 8 }}>
                        Observe plants &amp; creatures around you — learn more about the natural world
                    </p>
                    {stats.total > 0 && (
                        <div className="nm-hero-stats">
                            <span>📖 {stats.total} ghi chép / entries</span>
                            {stats.plants > 0 && <span>🌱 {stats.plants} cây / plants</span>}
                            {stats.insects > 0 && <span>🦋 {stats.insects} côn trùng / insects</span>}
                            {stats.birds > 0 && <span>🐦 {stats.birds} chim / birds</span>}
                        </div>
                    )}
                </div>
            </div>

            {/* TOOLBAR */}
            <div className="nm-toolbar">
                <div className="nm-cat-filter">
                    {CATEGORIES.map(c => (
                        <button key={c.id}
                            className={`nm-filter-pill${filterCat === c.id ? ' nm-filter-active' : ''}`}
                            onClick={() => setFilterCat(c.id)}>
                            {c.emoji} <span className="nm-filter-label">{c.label}<span style={{ fontSize: 10, opacity: .6 }}>/{c.labelEn}</span></span>
                        </button>
                    ))}
                </div>
                <div className="nm-toolbar-right">
                    <input ref={uploadRef} type="file" accept="image/*" hidden onChange={handleUploadPick} />
                    <button className="nm-icon-btn nm-search-toggle"
                        onClick={() => setShowSearch(s => !s)} title="Tìm kiếm / Search">
                        <Search size={18} />
                    </button>
                    {memories.length > 0 && (
                        <button className="nm-btn-cert" onClick={() => setShowCert(true)} title="Tạo chứng nhận">
                            <Award size={16} /> Chứng nhận
                        </button>
                    )}
                    <button className="nm-btn-upload" onClick={() => uploadRef.current?.click()}>
                        <Upload size={17} /> Đăng tải ảnh
                    </button>
                    <button className="nm-btn-add" onClick={() => setShowAdd(true)}>
                        <Plus size={18} /> Ghi chép <span style={{ opacity: .7, fontWeight: 400, fontSize: 12 }}>/ New</span>
                    </button>
                </div>
            </div>

            {serverStatus === 'offline' && (
                <div className="nm-server-notice nm-server-offline">
                    <WifiOff size={16} />
                    <span>Không kết nối được server. Chưa thể đăng tải ảnh hoặc ghi chép.</span>
                    <button type="button" onClick={checkServer}><RefreshCw size={14} /> Thử lại</button>
                </div>
            )}
            {serverStatus === 'checking' && (
                <div className="nm-server-notice">
                    <RefreshCw className="nm-spin" size={15} />
                    <span>Đang kiểm tra kết nối server…</span>
                </div>
            )}
            {saveNotice && (
                <div className={`nm-save-notice${serverStatus === 'offline' ? ' nm-save-local' : ''}`}>
                    {saveNotice}
                </div>
            )}

            {/* SEARCH BAR */}
            {showSearch && (
                <div className="nm-searchbar">
                    <Search size={16} className="nm-search-icon" />
                    <input className="nm-search-input" placeholder="Tìm tên, ghi chú, địa điểm… / Search name, notes, location…"
                        value={search} onChange={e => setSearch(e.target.value)} autoFocus />
                    {search && (
                        <button className="nm-icon-btn" onClick={() => setSearch('')}><X size={16} /></button>
                    )}
                </div>
            )}

            {/* GRID / EMPTY */}
            <div className="nm-container">
                {memories.length === 0 ? (
                    <EmptyState onAdd={() => setShowAdd(true)} />
                ) : filtered.length === 0 ? (
                    <div className="nm-no-result">
                        <p>🔍 Không tìm thấy ghi chép nào. / No matching entries found.</p>
                        <button className="nm-btn-link" onClick={() => { setFilterCat('all'); setSearch('') }}>
                            Xoá bộ lọc / Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="nm-grid">
                        {filtered.map(e => (
                            <EntryCard key={e.id} entry={e} onClick={() => setDetail(e)} />
                        ))}
                    </div>
                )}
            </div>

            {/* FAB (mobile) */}
            <button className="nm-fab" onClick={() => setShowAdd(true)} title="Ghi chép mới">
                <Plus size={24} />
            </button>

            {/* MODALS */}
            {showAdd && (
                <AddModal
                    initialFile={uploadFile}
                    onClose={() => { setShowAdd(false); setUploadFile(null) }}
                    onSave={handleSave}
                />
            )}
            {detail && (
                <DetailModal
                    entry={detail}
                    onClose={() => setDetail(null)}
                    onDelete={handleDelete}
                />
            )}
            {showCert && (
                <CertModal memories={memories} onClose={() => setShowCert(false)} />
            )}
        </div>
    )
}
