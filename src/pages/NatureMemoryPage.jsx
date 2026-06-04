import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Plus, ChevronLeft, Trash2, Search, Filter, Leaf } from 'lucide-react'
import './NatureMemory.css'

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
            <p>Hãy bắt đầu ghi chép quan sát đầu tiên — cây cối, côn trùng, chim chóc xung quanh bạn.</p>
            <button className="nm-btn-primary" onClick={onAdd}>
                <Plus size={16} /> Ghi chép đầu tiên
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
                    {weather && <span className="nm-card-weather" title={weather.label}>{weather.emoji}</span>}
                    {entry.mood && <span className="nm-card-mood">{entry.mood}</span>}
                </div>
                <h3 className="nm-card-name">{entry.name || '(Chưa đặt tên)'}</h3>
                {entry.scientificName && (
                    <p className="nm-card-sci">{entry.scientificName}</p>
                )}
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
                        {weather && <span className="nm-badge">{weather.emoji} {weather.label}</span>}
                        {season && <span className="nm-badge">{season.emoji} {season.label}</span>}
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

function AddModal({ onClose, onSave }) {
    const [form, setForm] = useState({ ...BLANK, season: getSeason() })
    const [preview, setPreview] = useState('')
    const [saving, setSaving] = useState(false)
    const [imgErr, setImgErr] = useState('')
    const fileRef = useRef()

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

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

    const handleSubmit = (e) => {
        e.preventDefault()
        setSaving(true)
        const now = Date.now()
        const entry = {
            ...form,
            id: uid(),
            createdAt: now,
            time: form.time || new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        }
        onSave(entry)
    }

    return (
        <div className="nm-backdrop" onClick={onClose}>
            <div className="nm-add-modal" onClick={e => e.stopPropagation()}>
                <div className="nm-add-header">
                    <button className="nm-icon-btn" onClick={onClose}><X size={20} /></button>
                    <h2>✏️ Ghi chép mới</h2>
                    <div style={{ width: 36 }} />
                </div>

                <form onSubmit={handleSubmit} className="nm-form" noValidate>
                    {/* PHOTO */}
                    <label className="nm-photo-upload" onClick={() => fileRef.current?.click()}>
                        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
                        {preview
                            ? <div className="nm-photo-preview">
                                <img src={preview} alt="preview" />
                                <div className="nm-photo-overlay"><Plus size={18} /> Đổi ảnh</div>
                            </div>
                            : <div className="nm-photo-placeholder">
                                <span className="nm-photo-icon">📷</span>
                                <span>Chụp / chọn ảnh</span>
                                <small>Tuỳ chọn — PNG, JPG, WEBP</small>
                            </div>
                        }
                    </label>
                    {imgErr && <p className="nm-err">{imgErr}</p>}

                    {/* CATEGORY */}
                    <div className="nm-field">
                        <label className="nm-label">Loài</label>
                        <div className="nm-cat-pills">
                            {CATEGORIES.slice(1).map(c => (
                                <button key={c.id} type="button"
                                    className={`nm-pill${form.category === c.id ? ' nm-pill-active' : ''}`}
                                    onClick={() => set('category', c.id)}>
                                    {c.emoji} {c.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* NAME */}
                    <div className="nm-field">
                        <label className="nm-label">Tên<span className="nm-req"> *</span></label>
                        <input className="nm-input" placeholder="VD: Cây dương xỉ / Bướm vàng / Chào mào"
                            value={form.name} onChange={e => set('name', e.target.value)} required autoFocus />
                    </div>

                    {/* SCIENTIFIC NAME */}
                    <div className="nm-field">
                        <label className="nm-label">Tên khoa học <span className="nm-opt">(tuỳ chọn)</span></label>
                        <input className="nm-input nm-input-sci" placeholder="VD: Nephrolepis exaltata"
                            value={form.scientificName} onChange={e => set('scientificName', e.target.value)} />
                    </div>

                    {/* NOTES */}
                    <div className="nm-field">
                        <label className="nm-label">Quan sát / Ghi chú</label>
                        <textarea className="nm-input nm-textarea"
                            placeholder="Mô tả đặc điểm, hành vi, màu sắc, kích thước… ghi như người Nhật — chi tiết và tỉ mỉ!"
                            value={form.notes} onChange={e => set('notes', e.target.value)} rows={4} />
                    </div>

                    {/* WEATHER + SEASON row */}
                    <div className="nm-row">
                        <div className="nm-field nm-field-half">
                            <label className="nm-label">Thời tiết</label>
                            <div className="nm-toggle-row">
                                {WEATHERS.map(w => (
                                    <button key={w.id} type="button"
                                        className={`nm-toggle${form.weather === w.id ? ' nm-toggle-active' : ''}`}
                                        title={w.label} onClick={() => set('weather', w.id)}>
                                        {w.emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="nm-field nm-field-half">
                            <label className="nm-label">Mùa</label>
                            <div className="nm-toggle-row">
                                {SEASONS.map(s => (
                                    <button key={s.id} type="button"
                                        className={`nm-toggle${form.season === s.id ? ' nm-toggle-active' : ''}`}
                                        title={s.label} onClick={() => set('season', s.id)}>
                                        {s.emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* LOCATION + TIME */}
                    <div className="nm-row">
                        <div className="nm-field nm-field-half">
                            <label className="nm-label">Địa điểm</label>
                            <input className="nm-input" placeholder="VD: Sân trường, Vườn nhà…"
                                value={form.location} onChange={e => set('location', e.target.value)} />
                        </div>
                        <div className="nm-field nm-field-half">
                            <label className="nm-label">Giờ</label>
                            <input className="nm-input" type="time" value={form.time}
                                onChange={e => set('time', e.target.value)} />
                        </div>
                    </div>

                    {/* MOOD */}
                    <div className="nm-field">
                        <label className="nm-label">Cảm xúc</label>
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
                        {saving ? '⏳ Đang lưu…' : '📝 Lưu ghi chép'}
                    </button>
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

    // Persist on every change
    useEffect(() => { saveMemories(memories) }, [memories])

    const handleSave = useCallback((entry) => {
        setMemories(m => [entry, ...m])
        setShowAdd(false)
    }, [])

    const handleDelete = useCallback((id) => {
        if (!window.confirm('Xoá ghi chép này?')) return
        setMemories(m => m.filter(e => e.id !== id))
        setDetail(null)
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
                    <p className="nm-hero-sub">
                        Ghi chép quan sát cây cối, sinh vật — tỉ mỉ như người Nhật
                    </p>
                    {stats.total > 0 && (
                        <div className="nm-hero-stats">
                            <span>📖 {stats.total} ghi chép</span>
                            {stats.plants > 0 && <span>🌱 {stats.plants} cây</span>}
                            {stats.insects > 0 && <span>🦋 {stats.insects} côn trùng</span>}
                            {stats.birds > 0 && <span>🐦 {stats.birds} chim</span>}
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
                            {c.emoji} <span className="nm-filter-label">{c.label}</span>
                        </button>
                    ))}
                </div>
                <div className="nm-toolbar-right">
                    <button className="nm-icon-btn nm-search-toggle"
                        onClick={() => setShowSearch(s => !s)} title="Tìm kiếm">
                        <Search size={18} />
                    </button>
                    <button className="nm-btn-add" onClick={() => setShowAdd(true)}>
                        <Plus size={18} /> Ghi chép
                    </button>
                </div>
            </div>

            {/* SEARCH BAR */}
            {showSearch && (
                <div className="nm-searchbar">
                    <Search size={16} className="nm-search-icon" />
                    <input className="nm-search-input" placeholder="Tìm tên, ghi chú, địa điểm…"
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
                        <p>🔍 Không tìm thấy ghi chép nào phù hợp.</p>
                        <button className="nm-btn-link" onClick={() => { setFilterCat('all'); setSearch('') }}>
                            Xoá bộ lọc
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
                <AddModal onClose={() => setShowAdd(false)} onSave={handleSave} />
            )}
            {detail && (
                <DetailModal
                    entry={detail}
                    onClose={() => setDetail(null)}
                    onDelete={handleDelete}
                />
            )}
        </div>
    )
}
