import { useState, useEffect, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { useUI } from '../context/UIContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const SLOTS = [
    { slot: 'hg-gallery-1', label: 'Ha Giang Loop #1', fallback: '/hg-city-1.svg' },
    { slot: 'hg-gallery-2', label: 'Ha Giang Loop #2', fallback: '/hg-city-2.svg' },
    { slot: 'hg-gallery-3', label: 'Ha Giang Loop #3', fallback: '/hg-city-3.svg' },
    { slot: 'hg-gallery-4', label: 'Ha Giang Loop #4', fallback: '/hg-city-1.svg' },
    { slot: 'hg-gallery-5', label: 'Ha Giang Loop #5', fallback: '/hg-city-2.svg' },
    { slot: 'hg-gallery-6', label: 'Ha Giang Loop #6', fallback: '/hg-city-3.svg' },
]

function compressImage(file, maxW = 1200, quality = 0.82) {
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

export default function AdminSiteImages() {
    const { showToast } = useUI()
    const [images, setImages] = useState({})
    const [captions, setCaptions] = useState({})
    const [saving, setSaving] = useState(null)
    const fileRefs = useRef({})

    useEffect(() => {
        fetch(`${API}/api/site-images`)
            .then(r => r.json())
            .then(arr => {
                if (!Array.isArray(arr)) return
                const map = {}, caps = {}
                arr.forEach(img => {
                    map[img.slot] = img
                    caps[img.slot] = img.caption || ''
                })
                setImages(map)
                setCaptions(caps)
            })
            .catch(() => { })
    }, [])

    const uploadFile = async (slot, file) => {
        if (!file) return
        setSaving(slot)
        try {
            const url = await compressImage(file)
            const res = await fetch(`${API}/api/site-images/${slot}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, caption: captions[slot] || '' }),
            })
            const data = await res.json()
            setImages(prev => ({ ...prev, [slot]: data }))
            showToast('✅ Đã cập nhật ảnh!')
        } catch {
            showToast('❌ Lỗi upload ảnh')
        }
        setSaving(null)
    }

    const saveCaption = async (slot) => {
        setSaving(slot + '-cap')
        try {
            const img = images[slot] || {}
            await fetch(`${API}/api/site-images/${slot}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: img.url || '', caption: captions[slot] || '' }),
            })
            setImages(prev => ({ ...prev, [slot]: { ...prev[slot], caption: captions[slot] } }))
            showToast('✅ Đã lưu caption!')
        } catch {
            showToast('❌ Lỗi lưu')
        }
        setSaving(null)
    }

    const clearSlot = async (slot) => {
        if (!window.confirm('Xóa ảnh này? Sẽ hiển thị ảnh mặc định.')) return
        setSaving(slot)
        try {
            await fetch(`${API}/api/site-images/${slot}`, { method: 'DELETE' })
            setImages(prev => ({ ...prev, [slot]: { ...prev[slot], url: '' } }))
            showToast('✅ Đã xóa ảnh')
        } catch {
            showToast('❌ Lỗi xóa')
        }
        setSaving(null)
    }

    return (
        <div>
            <h2 className="db-section-title">Ảnh trang web</h2>
            <p style={{ color: '#64748b', marginBottom: 24 }}>
                Upload ảnh thật cho từng vị trí. Ảnh được nén tự động về tối đa 1200px.
                Nhấn vào ảnh để chọn file mới.
            </p>

            <h3 style={{ fontWeight: 700, marginBottom: 12, color: '#1a3a4a', fontSize: 15 }}>
                📸 Ha Giang Loop — Gallery (6 ảnh)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 14, marginBottom: 32 }}>
                {SLOTS.map(({ slot, label, fallback }) => {
                    const img = images[slot]
                    const currentUrl = img?.url || ''
                    const displayUrl = currentUrl || fallback
                    const isSaving = saving === slot

                    return (
                        <div key={slot} style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                            {/* Image preview — click to upload */}
                            <div
                                style={{ position: 'relative', aspectRatio: '4/3', background: '#f1f5f9', cursor: 'pointer' }}
                                onClick={() => fileRefs.current[slot]?.click()}
                            >
                                <img src={displayUrl} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{
                                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.38)',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    opacity: 0, transition: 'opacity 0.2s',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                                >
                                    <Upload size={26} color="#fff" />
                                    <span style={{ color: '#fff', fontSize: 12, marginTop: 5 }}>Thay ảnh</span>
                                </div>
                                {!currentUrl && (
                                    <span style={{ position: 'absolute', bottom: 4, left: 4, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 4 }}>
                                        mặc định
                                    </span>
                                )}
                                {isSaving && (
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>
                                        Đang lưu...
                                    </div>
                                )}
                            </div>

                            {/* Caption + actions */}
                            <div style={{ padding: '10px 10px 12px' }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</div>
                                <input
                                    value={captions[slot] || ''}
                                    onChange={e => setCaptions(p => ({ ...p, [slot]: e.target.value }))}
                                    placeholder="Caption..."
                                    style={{ width: '100%', fontSize: 12, padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: 6, boxSizing: 'border-box', marginBottom: 8 }}
                                    onKeyDown={e => e.key === 'Enter' && saveCaption(slot)}
                                />
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <button className="btn3d btn3d-green btn-xs" style={{ flex: 1 }}
                                        onClick={() => fileRefs.current[slot]?.click()} disabled={isSaving}>
                                        <Upload size={11} /> Upload
                                    </button>
                                    {currentUrl && (
                                        <button className="btn-card-del" style={{ padding: '4px 8px' }} onClick={() => clearSlot(slot)}>
                                            <X size={12} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <input
                                ref={el => fileRefs.current[slot] = el}
                                type="file" accept="image/*"
                                style={{ display: 'none' }}
                                onChange={e => uploadFile(slot, e.target.files?.[0])}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
