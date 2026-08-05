const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export function isLocalImageData(value) {
    return typeof value === 'string' && value.startsWith('data:image/')
}

export function compressImageFile(file, maxSize = 1600, quality = 0.82) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = reject
        reader.onload = event => {
            const image = new Image()
            image.onerror = reject
            image.onload = () => {
                const scale = Math.min(1, maxSize / Math.max(image.width, image.height))
                const canvas = document.createElement('canvas')
                canvas.width = Math.round(image.width * scale)
                canvas.height = Math.round(image.height * scale)
                canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
                resolve(canvas.toDataURL('image/jpeg', quality))
            }
            image.src = event.target.result
        }
        reader.readAsDataURL(file)
    })
}

export async function uploadImageDataUrl(dataUrl, filename = 'image.jpg') {
    if (!isLocalImageData(dataUrl)) return dataUrl || ''

    let response
    try {
        response = await fetch(`${API}/api/uploads`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataUrl, filename }),
            signal: AbortSignal.timeout(20000),
        })
    } catch {
        throw new Error('Không kết nối được server để đăng tải ảnh')
    }

    if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error || `Không đăng tải được ảnh (${response.status})`)
    }

    const uploaded = await response.json()
    if (!uploaded?.url) throw new Error('Server không trả về địa chỉ ảnh')
    return uploaded.url
}
