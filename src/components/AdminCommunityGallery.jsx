import React, { useState, useRef } from 'react'
import { Upload, Trash2, ImagePlus } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import { compressImageFile, uploadImageDataUrl } from '../utils/uploadImage'

export default function AdminCommunityGallery() {
    const { communityImages, addItem, deleteItem } = useData()
    const { showToast } = useUI()
    const [queue, setQueue] = useState([])   // [{file, preview, caption}]
    const [uploading, setUploading] = useState(false)
    const [dragOver, setDragOver] = useState(false)
    const fileRef = useRef()

    const addFiles = (files) => {
        const valid = [...files].filter(f => f.type.startsWith('image/'))
        valid.forEach(file => {
            const reader = new FileReader()
            reader.onload = ev => {
                setQueue(q => [...q, { file, preview: ev.target.result, caption: '' }])
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

    const handleUploadAll = async () => {
        if (!queue.length) return
        setUploading(true)
        let ok = 0
        const failed = []
        for (const item of queue) {
            try {
                const compressed = await compressImageFile(item.file, 1200)
                const url = await uploadImageDataUrl(compressed, item.file.name)
                await addItem('communityImage', { url, caption: item.caption })
                ok++
            } catch (err) {
                failed.push(item)
                showToast(`❌ ${item.file.name}: ${err.message || 'Không thể tải ảnh'}`)
            }
        }
        setQueue(failed)
        setUploading(false)
        if (ok > 0) showToast(`✅ Đã thêm ${ok} ảnh vào film strip!`)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Xóa ảnh này khỏi film strip?')) return
        try {
            await deleteItem('communityImage', id)
            showToast('Đã xóa ảnh')
        } catch (err) {
            showToast(`❌ ${err.message || 'Không thể xóa ảnh'}`)
        }
    }

    return (
        <div className="acg-wrap">
            <div className="acg-header">
                <h2 className="acg-title">📸 Ảnh Film Strip Trang Chủ</h2>
                <p className="acg-sub">Ảnh bạn tải lên sẽ cuộn trên đầu trang chủ. Tải nhiều ảnh cùng lúc.</p>
            </div>

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
                                <input className="acg-caption-input" placeholder="Chú thích…"
                                    value={item.caption} onChange={e => setCaption(i, e.target.value)} />
                                <button className="acg-queue-remove" onClick={() => removeQueue(i)}>✕</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* CURRENT IMAGES */}
            <div className="acg-gallery-header">
                <span className="acg-gallery-count">{communityImages.length} ảnh hiện có</span>
            </div>
            {communityImages.length === 0 ? (
                <div className="acg-empty">Chưa có ảnh nào — tải lên để hiển thị trên film strip.</div>
            ) : (
                <div className="acg-gallery">
                    {communityImages.map(img => (
                        <div key={img.id} className="acg-thumb">
                            <img src={img.url} alt={img.caption || ''} />
                            {img.caption && <div className="acg-thumb-caption">{img.caption}</div>}
                            <button className="acg-thumb-delete" onClick={() => handleDelete(img.id)} title="Xóa">
                                <Trash2 size={13} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
