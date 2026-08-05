import { useRef } from 'react'
import { Camera } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useUI } from '../context/UIContext'
import { compressImageFile, uploadImageDataUrl } from '../utils/uploadImage'

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
            showToast('⏳ Đang đăng tải ảnh lên server…')
            const compressed = await compressImageFile(file, 1200)
            const imageUrl = await uploadImageDataUrl(compressed, file.name)
            await updateItem(type, itemId, { img: imageUrl })
            showToast('✅ Đã đổi ảnh!')
        } catch (err) {
            showToast('❌ ' + (err?.message || 'Không đổi được ảnh, thử lại'))
        }
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
