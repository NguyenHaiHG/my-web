import { useRef } from 'react'
import { Camera } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useUI } from '../context/UIContext'

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

/**
 * Overlay xuất hiện khi admin hover lên ảnh — click để đổi ảnh ngay.
 * Đặt bên trong container ảnh có position:relative.
 */
export default function AdminImgBtn({ type, itemId }) {
    const { updateItem } = useData()
    const { showToast } = useUI()
    const inputRef = useRef()

    const handleFile = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        e.target.value = ''
        if (file.size > 20 * 1024 * 1024) { showToast('❌ Ảnh quá lớn (tối đa 20MB)'); return }
        try {
            showToast('⏳ Đang nén ảnh…')
            const compressed = await compressImage(file)
            await updateItem(type, itemId, { img: compressed })
            showToast('✅ Đã đổi ảnh!')
        } catch { showToast('❌ Không đổi được ảnh, thử lại') }
    }

    return (
        <div
            className="admin-img-btn"
            title="Đổi ảnh"
            onClick={e => { e.stopPropagation(); inputRef.current?.click() }}
        >
            <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={handleFile} />
            <Camera size={18} />
            <span>Đổi ảnh</span>
        </div>
    )
}
