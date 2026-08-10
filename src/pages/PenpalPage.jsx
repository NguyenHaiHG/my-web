import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Mail, Camera, Plus, Globe, Heart, Send, Trash2, Edit2 } from 'lucide-react'
import { uploadImageDataUrl } from '../utils/uploadImage'
import { useAuth } from '../context/AuthContext'
import { apiFetch, responseError } from '../utils/api'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const FLAG_MAP = {
    'Việt Nam': '🇻🇳', 'Vietnam': '🇻🇳',
    'Japan': '🇯🇵', 'Nhật Bản': '🇯🇵',
    'Korea': '🇰🇷', 'Hàn Quốc': '🇰🇷',
    'France': '🇫🇷', 'Pháp': '🇫🇷',
    'USA': '🇺🇸', 'United States': '🇺🇸', 'Mỹ': '🇺🇸',
    'Germany': '🇩🇪', 'Đức': '🇩🇪',
    'Australia': '🇦🇺', 'Úc': '🇦🇺',
    'Thailand': '🇹🇭', 'Thái Lan': '🇹🇭',
    'China': '🇨🇳', 'Trung Quốc': '🇨🇳',
    'UK': '🇬🇧', 'England': '🇬🇧',
    'Canada': '🇨🇦',
    'Spain': '🇪🇸', 'Tây Ban Nha': '🇪🇸',
    'Italy': '🇮🇹', 'Ý': '🇮🇹',
    'India': '🇮🇳', 'Ấn Độ': '🇮🇳',
}

function getFlag(country) {
    return FLAG_MAP[country] || '🌍'
}

function compressImage(file, maxW = 900, quality = 0.80) {
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

/* ─────────────────── SEND LETTER MODAL ─────────────────── */
function LetterModal({ penpal, onClose }) {
    const [form, setForm] = useState({ fromName: '', fromCountry: '', fromEmail: '', message: '' })
    const [photo, setPhoto] = useState(null)
    const [photoPreview, setPhotoPreview] = useState(null)
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState('')
    const fileRef = useRef()

    const handlePhoto = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > 15 * 1024 * 1024) { setError('Ảnh quá lớn (tối đa 15MB)'); return }
        try {
            const compressed = await compressImage(file)
            setPhoto(compressed)
            setPhotoPreview(compressed)
            setError('')
        } catch {
            setError('Không đọc được ảnh, thử file khác')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSending(true)
        setError('')
        try {
            const photoUrl = await uploadImageDataUrl(photo, `penpal-letter-${Date.now()}.jpg`)
            const res = await fetch(`${API}/api/penpals/${penpal._id}/letter`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, photo: photoUrl }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Gửi thất bại')
            setSent(true)
        } catch (err) {
            setError(err.message)
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="pp-modal-backdrop" onClick={onClose}>
            <div className="pp-modal" onClick={e => e.stopPropagation()}>
                <button className="pp-modal-close" onClick={onClose}><X size={18} /></button>

                {sent ? (
                    <div className="pp-sent-ok">
                        <div className="pp-sent-icon">✉️</div>
                        <h3>Thư đã gửi!</h3>
                        <p>Thư của bạn đã được gửi đến <strong>{penpal.name}</strong>.<br />
                            Họ sẽ liên hệ lại qua email của bạn.</p>
                        <button className="btn3d btn3d-orange" onClick={onClose}>Đóng</button>
                    </div>
                ) : (
                    <>
                        <div className="pp-modal-header">
                            <div className="pp-modal-avatar">
                                {penpal.photo
                                    ? <img src={penpal.photo} alt={penpal.name} />
                                    : <span>{penpal.name[0]}</span>}
                            </div>
                            <div>
                                <p className="pp-modal-kicker">✉️ Gửi thư cho</p>
                                <h3>{penpal.name} <span>{getFlag(penpal.country)}</span></h3>
                            </div>
                        </div>

                        <form className="pp-letter-form" onSubmit={handleSubmit}>
                            <div className="pp-form-row">
                                <div className="pp-field">
                                    <label>Tên bạn *</label>
                                    <input
                                        placeholder="Tên của bạn / Your name"
                                        value={form.fromName}
                                        onChange={e => setForm(f => ({ ...f, fromName: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="pp-field">
                                    <label>Quốc gia</label>
                                    <input
                                        placeholder="Việt Nam, Japan..."
                                        value={form.fromCountry}
                                        onChange={e => setForm(f => ({ ...f, fromCountry: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="pp-field">
                                <label>Email của bạn * <span className="pp-field-note">(để penpal liên hệ lại)</span></label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={form.fromEmail}
                                    onChange={e => setForm(f => ({ ...f, fromEmail: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="pp-field">
                                <label>Nội dung thư *</label>
                                <textarea
                                    rows={5}
                                    placeholder={`Chào ${penpal.name}! Mình là... / Hello ${penpal.name}! I am...`}
                                    value={form.message}
                                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                    required
                                />
                            </div>

                            {/* Đính kèm ảnh */}
                            <div className="pp-field">
                                <label>📷 Đính kèm ảnh <span className="pp-field-note">(tùy chọn)</span></label>
                                <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhoto} />
                                {photoPreview ? (
                                    <div className="pp-letter-photo-preview">
                                        <img src={photoPreview} alt="preview" />
                                        <button type="button" className="pp-photo-remove"
                                            onClick={() => { setPhoto(null); setPhotoPreview(null) }}>
                                            <X size={14} /> Xoá ảnh
                                        </button>
                                    </div>
                                ) : (
                                    <button type="button" className="pp-photo-pick"
                                        onClick={() => fileRef.current?.click()}>
                                        <Camera size={16} /> Chọn ảnh đính kèm
                                    </button>
                                )}
                            </div>

                            {error && <p className="pp-error">{error}</p>}

                            <button type="submit" className="btn3d btn3d-orange pp-send-btn" disabled={sending}>
                                <Send size={16} />
                                {sending ? 'Đang gửi...' : 'Gửi thư ✉️'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}

/* ─────────────────── REGISTER MODAL ─────────────────── */
function RegisterModal({ onClose, onSuccess, initial }) {
    const [form, setForm] = useState({
        name: initial?.name || '', age: initial?.age || '', country: initial?.country || '', city: initial?.city || '',
        languages: initial?.languages?.join(', ') || '', interests: initial?.interests?.join(', ') || '',
        bio: initial?.bio || '', contactEmail: initial?.contactEmail || '',
    })
    const [photo, setPhoto] = useState(initial?.photo || null)
    const [photoPreview, setPhotoPreview] = useState(initial?.photo || null)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const fileRef = useRef()

    const handlePhoto = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > 15 * 1024 * 1024) { setError('Ảnh quá lớn (tối đa 15MB)'); return }
        try {
            const compressed = await compressImage(file)
            setPhoto(compressed)
            setPhotoPreview(compressed)
            setError('')
        } catch {
            setError('Không đọc được ảnh')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        try {
            const photoUrl = await uploadImageDataUrl(photo, `penpal-profile-${Date.now()}.jpg`)
            const payload = {
                ...form,
                age: form.age ? Number(form.age) : undefined,
                languages: form.languages.split(',').map(s => s.trim()).filter(Boolean),
                interests: form.interests.split(',').map(s => s.trim()).filter(Boolean),
                photo: photoUrl,
            }
            const res = initial ? await apiFetch(`/api/penpals/${initial._id}`, {
                method: 'PUT',
                body: JSON.stringify(payload),
            }) : await fetch(`${API}/api/penpals`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Lỗi')
            onSuccess(data)
            onClose()
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="pp-modal-backdrop" onClick={onClose}>
            <div className="pp-modal pp-modal-lg" onClick={e => e.stopPropagation()}>
                <button className="pp-modal-close" onClick={onClose}><X size={18} /></button>
                <h3 className="pp-modal-title">{initial ? '✏️ Sửa hồ sơ Penpal' : '🌏 Đăng ký làm Penpal'}</h3>
                <p className="pp-modal-sub">{initial ? 'Cập nhật hồ sơ và lưu thay đổi trên server.' : 'Giới thiệu bản thân để kết bạn với người dùng toàn thế giới.'}</p>

                <form className="pp-letter-form" onSubmit={handleSubmit}>
                    {/* Upload ảnh đại diện */}
                    <div className="pp-avatar-upload">
                        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhoto} />
                        {photoPreview ? (
                            <div className="pp-avatar-preview-wrap">
                                <img src={photoPreview} alt="avatar" className="pp-avatar-preview" />
                                <button type="button" className="pp-avatar-change"
                                    onClick={() => fileRef.current?.click()}>
                                    <Camera size={14} /> Đổi ảnh
                                </button>
                            </div>
                        ) : (
                            <button type="button" className="pp-avatar-pick"
                                onClick={() => fileRef.current?.click()}>
                                <Camera size={24} />
                                <span>Tải ảnh đại diện lên</span>
                                <span className="pp-avatar-sub">Upload your photo</span>
                            </button>
                        )}
                    </div>

                    <div className="pp-form-row">
                        <div className="pp-field">
                            <label>Tên *</label>
                            <input placeholder="Tên / Name" value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                        </div>
                        <div className="pp-field pp-field-sm">
                            <label>Tuổi</label>
                            <input type="number" placeholder="22" min={10} max={99} value={form.age}
                                onChange={e => setForm(f => ({ ...f, age: e.target.value }))} />
                        </div>
                    </div>
                    <div className="pp-form-row">
                        <div className="pp-field">
                            <label>Quốc gia *</label>
                            <input placeholder="Việt Nam / Japan..." value={form.country}
                                onChange={e => setForm(f => ({ ...f, country: e.target.value }))} required />
                        </div>
                        <div className="pp-field">
                            <label>Thành phố</label>
                            <input placeholder="Hà Giang / Tokyo..." value={form.city}
                                onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
                        </div>
                    </div>
                    <div className="pp-field">
                        <label>Ngôn ngữ <span className="pp-field-note">(cách nhau bằng dấu phẩy)</span></label>
                        <input placeholder="Tiếng Việt, English, 日本語..." value={form.languages}
                            onChange={e => setForm(f => ({ ...f, languages: e.target.value }))} />
                    </div>
                    <div className="pp-field">
                        <label>Sở thích <span className="pp-field-note">(cách nhau bằng dấu phẩy)</span></label>
                        <input placeholder="Du lịch, Nấu ăn, Âm nhạc..." value={form.interests}
                            onChange={e => setForm(f => ({ ...f, interests: e.target.value }))} />
                    </div>
                    <div className="pp-field">
                        <label>Giới thiệu bản thân</label>
                        <textarea rows={4}
                            placeholder="Xin chào! Mình là... / Hi! I'm a..."
                            value={form.bio}
                            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
                    </div>
                    <div className="pp-field">
                        <label>Email liên hệ * <span className="pp-field-note">(nhận thư từ penpal)</span></label>
                        <input type="email" placeholder="your@email.com" value={form.contactEmail}
                            onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} required />
                    </div>

                    {error && <p className="pp-error">{error}</p>}

                    <button type="submit" className="btn3d btn3d-orange pp-send-btn" disabled={saving}>
                        {saving ? 'Đang lưu...' : initial ? '💾 Lưu thay đổi' : '🌏 Đăng ký ngay'}
                    </button>
                </form>
            </div>
        </div>
    )
}

/* ─────────────────── PENPAL CARD ─────────────────── */
function PenpalCard({ penpal, onWrite, canDelete, onDelete, onEdit }) {
    return (
        <div className="pp-card">
            <div className="pp-card-photo">
                {penpal.photo
                    ? <img src={penpal.photo} alt={penpal.name} loading="lazy" />
                    : <div className="pp-card-photo-placeholder">{penpal.name[0]}</div>}
                <span className="pp-card-flag">{getFlag(penpal.country)}</span>
            </div>
            <div className="pp-card-body">
                <h3 className="pp-card-name">{penpal.name}{penpal.age ? <span className="pp-card-age">, {penpal.age}</span> : ''}</h3>
                <p className="pp-card-location">
                    <Globe size={12} /> {penpal.city ? `${penpal.city}, ` : ''}{penpal.country}
                </p>
                {penpal.languages?.length > 0 && (
                    <div className="pp-card-langs">
                        {penpal.languages.map(l => (
                            <span key={l} className="pp-lang-chip">{l}</span>
                        ))}
                    </div>
                )}
                {penpal.interests?.length > 0 && (
                    <div className="pp-card-interests">
                        <Heart size={11} className="pp-interests-icon" />
                        {penpal.interests.slice(0, 3).join(' · ')}
                        {penpal.interests.length > 3 && ` +${penpal.interests.length - 3}`}
                    </div>
                )}
                {penpal.bio && <p className="pp-card-bio">{penpal.bio}</p>}
            </div>
            <div className="pp-card-footer">
                <button className="btn3d btn3d-orange pp-write-btn" onClick={() => onWrite(penpal)}>
                    <Mail size={14} /> Gửi thư ✉️
                </button>
                {canDelete && (
                    <>
                        <button className="btn-card-edit" title="Sửa hồ sơ" onClick={() => onEdit(penpal)}><Edit2 size={14} /></button>
                        <button className="btn-card-del" title="Xóa hồ sơ" onClick={() => onDelete(penpal)}>
                            <Trash2 size={14} />
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

/* ─────────────────── MAIN PAGE ─────────────────── */
export default function PenpalPage({ siteContent = {} }) {
    const { isAdmin } = useAuth()
    const [penpals, setPenpals] = useState([])
    const [loading, setLoading] = useState(true)
    const [showRegister, setShowRegister] = useState(false)
    const [editingPenpal, setEditingPenpal] = useState(null)
    const [selectedPenpal, setSelectedPenpal] = useState(null)
    const [toast, setToast] = useState('')
    const cmsHero = siteContent.hero || {}

    const fetchPenpals = useCallback(async () => {
        try {
            const res = isAdmin
                ? await apiFetch('/api/penpals/admin/all')
                : await fetch(`${API}/api/penpals`)
            if (res.ok) {
                const data = await res.json()
                setPenpals(data)
            }
        } catch {
            // offline — show empty state
        } finally {
            setLoading(false)
        }
    }, [isAdmin])

    useEffect(() => { fetchPenpals() }, [fetchPenpals])

    const showSuccess = () => {
        setToast('🎉 Hồ sơ penpal của bạn đã được đăng!')
        fetchPenpals()
        setTimeout(() => setToast(''), 4000)
    }

    const showUpdated = updated => {
        if (updated?._id) setPenpals(current => current.map(item => item._id === updated._id ? { ...item, ...updated } : item))
        else fetchPenpals()
        setEditingPenpal(null)
        setToast('Đã sửa hồ sơ Penpal trên server')
        setTimeout(() => setToast(''), 4000)
    }

    const deletePenpal = async penpal => {
        if (!window.confirm(`Xóa hồ sơ ${penpal.name}?`)) return
        try {
            const response = await apiFetch(`/api/penpals/${penpal._id}`, { method: 'DELETE' })
            if (!response.ok) throw await responseError(response, 'Không thể xóa hồ sơ')
            setPenpals(prev => prev.filter(item => item._id !== penpal._id))
            setToast('Đã xóa hồ sơ trên server')
        } catch (err) {
            setToast('❌ ' + err.message)
        }
    }

    return (
        <div className="page-enter">
            {/* ── Hero ── */}
            <section className="pp-hero" style={cmsHero.image ? { backgroundImage: `linear-gradient(#1f365dcc,#1f365dcc),url("${cmsHero.image}")`, backgroundSize: 'cover' } : undefined}>
                <div className="pp-hero-content container">
                    <span className="pp-hero-tag">🌏 BookHaGiang · Penpal Community</span>
                    <h1 className="pp-hero-h1">{cmsHero.title || <>Kết bạn Quốc Tế<br /><span className="pp-hero-hl">Penpal</span></>}</h1>
                    <p className="pp-hero-sub">
                        {cmsHero.subtitle || cmsHero.body || 'Giao lưu với bạn bè khắp nơi trên thế giới. Gửi thư kèm ảnh, chia sẻ câu chuyện, học ngôn ngữ mới.'}
                    </p>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', fontStyle: 'italic', marginTop: -4 }}>
                        Connect with friends around the world. Write letters with photos, share stories, learn new languages.
                    </p>
                    <div className="pp-hero-btns">
                        <button className="btn3d btn3d-orange" onClick={() => setShowRegister(true)}>
                            <Plus size={16} /> {cmsHero.buttonLabel || 'Đăng ký làm Penpal'}
                        </button>
                    </div>
                </div>
            </section>

            {/* ── How it works ── */}
            <section className="container">
                <div className="pp-steps">
                    {(siteContent.guide?.items?.length ? siteContent.guide.items : [
                        { icon: '📸', title: 'Đăng ký & Upload ảnh', desc: 'Tạo hồ sơ với ảnh đại diện và giới thiệu bản thân' },
                        { icon: '🔍', title: 'Tìm penpal', desc: 'Duyệt qua danh sách và tìm người phù hợp sở thích' },
                        { icon: '✉️', title: 'Gửi thư kèm ảnh', desc: 'Viết thư tay kỹ thuật số, đính kèm ảnh và gửi đi' },
                    ]).map(step => (
                        <div key={step.title} className="pp-step">
                            <span className="pp-step-icon">{step.icon || '🌏'}</span>
                            <h4>{step.title}</h4>
                            <p>{step.desc || step.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Penpal grid ── */}
            <section className="container py-section">
                <div className="section-header-center" style={{ marginBottom: 24 }}>
                    <h2>Penpal đang tìm bạn ✈️</h2>
                    <p style={{ color: '#64748b', margin: 0 }}>
                        {penpals.length > 0
                            ? `${penpals.length} người đang chờ thư từ bạn`
                            : 'Hãy là người đầu tiên đăng ký!'}
                    </p>
                </div>

                {loading ? (
                    <div className="pp-loading">
                        <div className="pp-spinner" />
                        <p>Đang tải...</p>
                    </div>
                ) : penpals.length === 0 ? (
                    <div className="pp-empty">
                        <span>🌏</span>
                        <h3>Chưa có penpal nào</h3>
                        <p>Hãy là người đầu tiên đăng ký và bắt đầu kết bạn quốc tế!</p>
                        <button className="btn3d btn3d-orange" onClick={() => setShowRegister(true)}>
                            <Plus size={16} /> Đăng ký ngay
                        </button>
                    </div>
                ) : (
                    <div className="pp-grid">
                        {penpals.map(p => (
                            <PenpalCard key={p._id} penpal={p} onWrite={setSelectedPenpal} canDelete={isAdmin} onDelete={deletePenpal} onEdit={setEditingPenpal} />
                        ))}
                    </div>
                )}
            </section>

            {/* ── CTA ── */}
            <section className="ng-cta">
                <div className="ng-cta-overlay" />
                <div className="container ng-cta-inner">
                    <h2>Muốn kết bạn quốc tế?<span style={{ display: 'block', fontSize: '0.6em', fontWeight: 400, opacity: 0.85 }}>Want to make international friends?</span></h2>
                    <p>Đăng ký hồ sơ Penpal miễn phí, nhận thư từ bạn bè khắp nơi trên thế giới.</p>
                    <div className="ng-cta-btns">
                        <button className="btn3d btn3d-orange" onClick={() => setShowRegister(true)}>
                            🌏 Đăng ký Penpal ngay
                        </button>
                    </div>
                </div>
            </section>

            {/* ── Modals ── */}
            {showRegister && (
                <RegisterModal onClose={() => setShowRegister(false)} onSuccess={showSuccess} />
            )}
            {editingPenpal && (
                <RegisterModal initial={editingPenpal} onClose={() => setEditingPenpal(null)} onSuccess={showUpdated} />
            )}
            {selectedPenpal && (
                <LetterModal penpal={selectedPenpal} onClose={() => setSelectedPenpal(null)} />
            )}

            {/* ── Toast ── */}
            {toast && (
                <div className="pp-toast">{toast}</div>
            )}
        </div>
    )
}
