import React, { useState, useEffect, useRef } from 'react'
import { Upload, Trash2, ImagePlus } from 'lucide-react'
import { useUI } from '../context/UIContext'
import { uploadImageDataUrl } from '../utils/uploadImage'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const CATEGORIES = [
    { id: 'plant', label: '🌱 Thực vật' },
    { id: 'insect', label: '🦋 Côn trùng' },
    { id: 'bird', label: '🐦 Chim' },
    { id: 'mammal', label: '🦊 Thú' },
    { id: 'fish', label: '🐸 Cá/Ếch' },
    { id: 'mushroom', label: '🍄 Nấm' },
    { id: 'other', label: '🔍 Khác' },
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

export default function AdminNatureMemory() {
    const { showToast } = useUI()
    const [images, setImages] = useState([])
    const [queue, setQueue] = useState([]) // [{file, preview, caption, category}]
    const [uploading, setUploading] = useState(false)
    const [dragOver, setDragOver] = useState(false)
    const [loading, setLoading] = useState(true)
    const [serverOnline, setServerOnline] = useState(true)
    const fileRef = useRef()

    useEffect(() => {
        fetch(`${API}/api/nature-memory-images`)
            .then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`)
                return r.json()
            })
            .then(data => { setImages(data); setServerOnline(true); setLoading(false) })
            .catch(() => { setServerOnline(false); setLoading(false) })
    }, [])

    const addFiles = (files) => {
        const valid = [...files].filter(f => f.type.startsWith('image/'))
        valid.forEach(file => {
            const reader = new FileReader()
            reader.onload = ev => {
                setQueue(q => [...q, { file, preview: ev.target.result, caption: '', category: 'plant' }])
            }
            reader.readAsDataURL(file)
        })
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragOver(false)
        addFiles(e.dataTransfer.files)
    }

    const removeQueue = (i) => setQueue(q => q.filter((_, idx) => idx !== i))
    const setCaption = (i, v) => setQueue(q => q.map((item, idx) => idx === i ? { ...item, caption: v } : item))
    const setCategory = (i, v) => setQueue(q => q.map((item, idx) => idx === i ? { ...item, category: v } : item))

    const handleUploadAll = async () => {
        if (!queue.length) return
        setUploading(true)
        let ok = 0
        const failed = []
        for (const item of queue) {
            try {
                const compressed = await compressImage(item.file)
                const url = await uploadImageDataUrl(compressed, item.file.name)
                const res = await fetch(`${API}/api/nature-memory-images`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url, caption: item.caption, category: item.category }),
                })
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                const saved = await res.json()
                setImages(prev => [saved, ...prev])
                ok++
            } catch {
                failed.push(item)
            }
        }
        setQueue(failed)
        setUploading(false)
        setServerOnline(failed.length === 0)
        if (failed.length) {
            showToast(`❌ Không kết nối được server — còn ${failed.length} ảnh chưa đăng tải`)
        } else {
            showToast(`✅ Đã thêm ${ok} ảnh vào Nhật Ký Thiên Nhiên!`)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Xóa ảnh này?')) return
        try {
            await fetch(`${API}/api/nature-memory-images/${id}`, { method: 'DELETE' })
            setImages(prev => prev.filter(img => img._id !== id))
            showToast('Đã xóa ảnh')
        } catch {
            showToast('❌ Lỗi xóa ảnh')
        }
    }

    return (
        <div className="acg-wrap">
            <div className="acg-header">
                <div className="acg-title-row">
                    <h2 className="acg-title">🌿 Ảnh Nhật Ký Thiên Nhiên</h2>
                    <button className="acg-btn-upload" type="button" onClick={() => fileRef.current?.click()}>
                        <Upload size={15} /> Đăng tải ảnh
                    </button>
                </div>
                <p className="acg-sub">Tải ảnh mẫu các loài lên đây. Ảnh sẽ được lưu vào cơ sở dữ liệu.</p>
            </div>

            {!serverOnline && (
                <div className="acg-server-error">
                    Không kết nối được server. Hãy khởi động backend rồi nhấn “Tải lên tất cả” để thử lại.
                </div>
            )}

            {/* DROP ZONE */}
            <div
                className={`acg-dropzone${dragOver ? ' acg-drop-active' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
            >
                <input ref={fileRef} type="file" accept="image/*" multiple hidden
                    onChange={e => addFiles(e.target.files)} />
                <ImagePlus size={32} className="acg-drop-icon" />
                <p><strong>Kéo thả ảnh vào đây</strong> hoặc nhấn để chọn</p>
                <small>PNG · JPG · WEBP — nhiều ảnh cùng lúc</small>
            </div>

            {/* QUEUE */}
            {queue.length > 0 && (
                <div className="acg-queue">
                    <div className="acg-queue-header">
                        <span>{queue.length} ảnh chờ tải lên</span>
                        <button className="acg-btn-upload" onClick={handleUploadAll} disabled={uploading}>
                            {uploading ? '⏳ Đang tải…' : <><Upload size={14} /> Tải lên tất cả</>}
                        </button>
                    </div>
                    <div className="acg-queue-grid">
                        {queue.map((item, i) => (
                            <div key={i} className="acg-queue-item">
                                <img src={item.preview} alt="" />
                                <input className="acg-caption-input" placeholder="Tên / chú thích…"
                                    value={item.caption} onChange={e => setCaption(i, e.target.value)} />
                                <select
                                    style={{ fontSize: 12, padding: '2px 4px', borderRadius: 4, border: '1px solid #e2e8f0', marginTop: 4, width: '100%' }}
                                    value={item.category}
                                    onChange={e => setCategory(i, e.target.value)}
                                >
                                    {CATEGORIES.map(c => (
                                        <option key={c.id} value={c.id}>{c.label}</option>
                                    ))}
                                </select>
                                <button className="acg-queue-remove" onClick={() => removeQueue(i)}>✕</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SAVED IMAGES */}
            <div style={{ marginTop: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: 12 }}>
                    Ảnh đã lưu ({images.length})
                </h3>
                {loading && <p style={{ color: '#94a3b8' }}>Đang tải…</p>}
                {!loading && images.length === 0 && (
                    <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Chưa có ảnh nào. Tải ảnh lên để bắt đầu.</p>
                )}
                <div className="acg-queue-grid">
                    {images.map(img => {
                        const cat = CATEGORIES.find(c => c.id === img.category)
                        return (
                            <div key={img._id} className="acg-queue-item">
                                <img src={img.url} alt={img.caption || ''} />
                                {img.caption && (
                                    <p style={{ fontSize: 12, color: '#374151', margin: '4px 0 2px', fontWeight: 500 }}>
                                        {img.caption}
                                    </p>
                                )}
                                <p style={{ fontSize: 11, color: '#94a3b8', margin: '0 0 4px' }}>
                                    {cat?.label || img.category}
                                </p>
                                <button className="acg-queue-remove" onClick={() => handleDelete(img._id)}
                                    style={{ background: '#fef2f2', color: '#dc2626' }}>
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
