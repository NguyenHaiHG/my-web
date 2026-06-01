import React, { useState } from 'react'
import { useData } from '../context/DataContext'
import { useUI } from '../context/UIContext'

export default function AdminCommunityGallery() {
    const { communityImages, addItem, deleteItem } = useData()
    const { showToast } = useUI()
    const [uploading, setUploading] = useState(false)
    const [file, setFile] = useState(null)
    const [caption, setCaption] = useState('')

    const handleFile = async (e) => {
        const f = e.target.files?.[0]
        if (!f) return
        setFile(f)
    }

    const handleUpload = async () => {
        if (!file) return
        setUploading(true)
        try {
            // Convert to base64
            const reader = new FileReader()
            reader.onload = async (ev) => {
                const url = ev.target.result
                await addItem('communityImage', { url, caption })
                setFile(null)
                setCaption('')
                showToast('✅ Đã thêm ảnh!')
            }
            reader.readAsDataURL(file)
        } catch {
            showToast('❌ Lỗi upload')
        }
        setUploading(false)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Xóa ảnh này?')) return
        await deleteItem('communityImage', id)
        showToast('Đã xóa ảnh')
    }

    return (
        <div style={{ maxWidth: 600, margin: '32px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0001', padding: 24 }}>
            <h2>Quản lý ảnh cộng đồng</h2>
            <div style={{ margin: '16px 0' }}>
                <input type="file" accept="image/*" onChange={handleFile} />
                <input type="text" placeholder="Chú thích (tùy chọn)" value={caption} onChange={e => setCaption(e.target.value)} style={{ marginLeft: 8 }} />
                <button onClick={handleUpload} disabled={uploading || !file} style={{ marginLeft: 8 }}>
                    {uploading ? 'Đang tải...' : 'Thêm ảnh'}
                </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                {communityImages.map(img => (
                    <div key={img.id} style={{ position: 'relative', width: 120, height: 80, borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 6px #0002' }}>
                        <img src={img.url} alt={img.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {img.caption && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#0007', color: '#fff', fontSize: 12, padding: '2px 6px' }}>{img.caption}</div>}
                        <button onClick={() => handleDelete(img.id)} style={{ position: 'absolute', top: 2, right: 2, background: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13, padding: '2px 6px' }}>X</button>
                    </div>
                ))}
            </div>
        </div>
    )
}
