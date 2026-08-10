import { ImagePlus } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { apiFetch, responseError } from '../utils/api'
import { compressImageFile, uploadImageDataUrl } from '../utils/uploadImage'

export default function InlineSiteImage({ slot, onChanged, caption = '' }) {
    const { isAdmin } = useAuth()
    const [saving, setSaving] = useState(false)
    if (!isAdmin) return null

    const pick = async event => {
        const file = event.target.files?.[0]
        if (!file) return
        setSaving(true)
        try {
            const dataUrl = await compressImageFile(file)
            const url = await uploadImageDataUrl(dataUrl, `${slot}.jpg`)
            const response = await apiFetch(`/api/site-images/${encodeURIComponent(slot)}`, {
                method: 'PUT',
                body: JSON.stringify({ url, caption }),
            })
            if (!response.ok) throw await responseError(response, 'Không thể thay ảnh')
            onChanged?.(url)
        } catch (err) {
            window.alert(err?.message || 'Không thể thay ảnh')
        } finally {
            setSaving(false)
            event.target.value = ''
        }
    }

    return (
        <label className="inline-site-image-btn" title="Thay ảnh và lưu trên server" onClick={event => event.stopPropagation()}>
            <ImagePlus size={15} /> {saving ? 'Đang tải…' : 'Thay ảnh'}
            <input type="file" accept="image/*" onChange={pick} hidden disabled={saving} />
        </label>
    )
}
