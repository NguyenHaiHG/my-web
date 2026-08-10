import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, ImagePlus, RefreshCw, Save, Trash2, Upload, X } from 'lucide-react'
import { apiFetch, responseError } from '../utils/api'
import { compressImageFile, uploadImageDataUrl } from '../utils/uploadImage'
import './AdminHomeFilmStrip.css'

function asItems(data) {
    return Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []
}

function itemId(item) {
    return item._id || item.id
}

export function AdminHomeFilmStrip({ onChange, compact = false, onClose }) {
    const [items, setItems] = useState([])
    const [captions, setCaptions] = useState({})
    const [newCaption, setNewCaption] = useState('')
    const [newFile, setNewFile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState('')
    const [error, setError] = useState('')
    const addFileRef = useRef(null)
    const replaceFileRefs = useRef({})

    const publishItems = (nextItems) => {
        setItems(nextItems)
        setCaptions(Object.fromEntries(nextItems.map(item => [itemId(item), item.caption || ''])))
        onChange?.(nextItems)
    }

    const loadItems = async () => {
        setLoading(true)
        setError('')
        try {
            const response = await apiFetch('/api/home-film-strip')
            if (!response.ok) throw await responseError(response, 'Không thể tải dải ảnh')
            publishItems(asItems(await response.json()))
        } catch (err) {
            setError(err.message || 'Không thể tải dải ảnh')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadItems()
        // The initial request should only run when the editor opens.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const request = async (path, options, fallback) => {
        const response = await apiFetch(path, options)
        if (!response.ok) throw await responseError(response, fallback)
        return response
    }

    const addItem = async (event) => {
        event.preventDefault()
        if (!newFile) {
            setError('Vui lòng chọn ảnh để thêm.')
            return
        }

        setSaving('new')
        setError('')
        try {
            const dataUrl = await compressImageFile(newFile, 1400)
            const url = await uploadImageDataUrl(dataUrl, newFile.name)
            await request('/api/home-film-strip', {
                method: 'POST',
                body: JSON.stringify({ url, caption: newCaption.trim(), enabled: true }),
            }, 'Không thể thêm ảnh')
            setNewCaption('')
            setNewFile(null)
            if (addFileRef.current) addFileRef.current.value = ''
            await loadItems()
        } catch (err) {
            setError(err.message || 'Không thể thêm ảnh')
        } finally {
            setSaving('')
        }
    }

    const updateItem = async (item, changes, action) => {
        const id = itemId(item)
        setSaving(`${id}-${action}`)
        setError('')
        try {
            await request(`/api/home-film-strip/${id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    url: item.url,
                    caption: item.caption || '',
                    enabled: item.enabled !== false,
                    type: item.type || 'editorial',
                    ...changes,
                }),
            }, 'Không thể cập nhật ảnh')
            await loadItems()
        } catch (err) {
            setError(err.message || 'Không thể cập nhật ảnh')
        } finally {
            setSaving('')
        }
    }

    const replaceImage = async (item, file) => {
        if (!file) return
        const id = itemId(item)
        setSaving(`${id}-image`)
        setError('')
        try {
            const dataUrl = await compressImageFile(file, 1400)
            const url = await uploadImageDataUrl(dataUrl, file.name)
            await request(`/api/home-film-strip/${id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    url,
                    caption: item.caption || '',
                    enabled: item.enabled !== false,
                    type: item.type || 'editorial',
                }),
            }, 'Không thể thay ảnh')
            await loadItems()
        } catch (err) {
            setError(err.message || 'Không thể thay ảnh')
        } finally {
            setSaving('')
            if (replaceFileRefs.current[id]) replaceFileRefs.current[id].value = ''
        }
    }

    const deleteItem = async (item) => {
        if (!window.confirm('Xóa ảnh này khỏi dải ảnh?')) return
        const id = itemId(item)
        setSaving(`${id}-delete`)
        setError('')
        try {
            await request(`/api/home-film-strip/${id}`, { method: 'DELETE' }, 'Không thể xóa ảnh')
            await loadItems()
        } catch (err) {
            setError(err.message || 'Không thể xóa ảnh')
        } finally {
            setSaving('')
        }
    }

    const moveItem = async (index, direction) => {
        const target = index + direction
        if (target < 0 || target >= items.length) return

        const reordered = [...items]
        ;[reordered[index], reordered[target]] = [reordered[target], reordered[index]]
        const previous = items
        publishItems(reordered)
        setSaving('reorder')
        setError('')
        try {
            await request('/api/home-film-strip/reorder', {
                method: 'PATCH',
                body: JSON.stringify({ ids: reordered.map(itemId) }),
            }, 'Không thể sắp xếp ảnh')
            await loadItems()
        } catch (err) {
            publishItems(previous)
            setError(err.message || 'Không thể sắp xếp ảnh')
        } finally {
            setSaving('')
        }
    }

    return (
        <section className={`admin-film-strip${compact ? ' admin-film-strip--compact' : ''}`} aria-label="Quản lý dải ảnh trang chủ">
            <div className="admin-film-strip__header">
                <div>
                    <strong>Quản lý dải ảnh</strong>
                    <span>Thêm, sửa và sắp xếp ảnh chạy trên trang chủ.</span>
                </div>
                <div className="admin-film-strip__header-actions">
                    <button type="button" className="admin-film-strip__icon-btn" onClick={loadItems} disabled={loading} title="Tải lại">
                        <RefreshCw size={15} />
                    </button>
                    {onClose && (
                        <button type="button" className="admin-film-strip__icon-btn" onClick={onClose} title="Đóng">
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {error && <p className="admin-film-strip__error" role="alert">{error}</p>}

            <form className="admin-film-strip__add" onSubmit={addItem}>
                <label className="admin-film-strip__file">
                    <ImagePlus size={16} />
                    <span>{newFile?.name || 'Chọn ảnh mới'}</span>
                    <input ref={addFileRef} type="file" accept="image/*" onChange={event => setNewFile(event.target.files?.[0] || null)} />
                </label>
                <input
                    value={newCaption}
                    onChange={event => setNewCaption(event.target.value)}
                    placeholder="Chú thích ảnh"
                    aria-label="Chú thích ảnh mới"
                />
                <button type="submit" className="admin-film-strip__primary" disabled={saving === 'new'}>
                    <Upload size={14} /> {saving === 'new' ? 'Đang tải...' : 'Thêm'}
                </button>
            </form>

            {loading && !items.length ? (
                <p className="admin-film-strip__status">Đang tải dải ảnh...</p>
            ) : (
                <div className="admin-film-strip__list">
                    {items.map((item, index) => {
                        const id = itemId(item)
                        const busy = saving.startsWith(`${id}-`) || saving === 'reorder'
                        return (
                            <article className="admin-film-strip__item" key={id}>
                                <img src={item.url} alt={item.caption || 'Ảnh dải trang chủ'} />
                                <div className="admin-film-strip__fields">
                                    <input
                                        value={captions[id] ?? ''}
                                        onChange={event => setCaptions(current => ({ ...current, [id]: event.target.value }))}
                                        onKeyDown={event => {
                                            if (event.key === 'Enter') updateItem(item, { caption: captions[id] || '' }, 'caption')
                                        }}
                                        placeholder="Chú thích"
                                        aria-label={`Chú thích ảnh ${index + 1}`}
                                    />
                                    <div className="admin-film-strip__controls">
                                        <select
                                            value={item.type || 'editorial'}
                                            onChange={event => updateItem(item, { type: event.target.value }, 'type')}
                                            disabled={busy}
                                            aria-label={`Loại ảnh ${index + 1}`}
                                        >
                                            <option value="editorial">Biên tập</option>
                                            <option value="community">Cộng đồng</option>
                                            <option value="nature">Thiên nhiên</option>
                                        </select>
                                        <button type="button" onClick={() => updateItem(item, { caption: captions[id] || '' }, 'caption')} disabled={busy} title="Lưu chú thích">
                                            <Save size={13} />
                                        </button>
                                        <button type="button" onClick={() => replaceFileRefs.current[id]?.click()} disabled={busy} title="Thay ảnh">
                                            <Upload size={13} />
                                        </button>
                                        <label className="admin-film-strip__toggle">
                                            <input
                                                type="checkbox"
                                                checked={item.enabled !== false}
                                                onChange={event => updateItem(item, { enabled: event.target.checked }, 'enabled')}
                                                disabled={busy}
                                            />
                                            <span>Hiện</span>
                                        </label>
                                        <button type="button" onClick={() => moveItem(index, -1)} disabled={busy || index === 0} title="Chuyển lên">
                                            <ArrowUp size={13} />
                                        </button>
                                        <button type="button" onClick={() => moveItem(index, 1)} disabled={busy || index === items.length - 1} title="Chuyển xuống">
                                            <ArrowDown size={13} />
                                        </button>
                                        <button type="button" className="admin-film-strip__delete" onClick={() => deleteItem(item)} disabled={busy} title="Xóa">
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>
                                <input
                                    ref={element => { replaceFileRefs.current[id] = element }}
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={event => replaceImage(item, event.target.files?.[0])}
                                />
                            </article>
                        )
                    })}
                    {!items.length && <p className="admin-film-strip__status">Chưa có ảnh nào.</p>}
                </div>
            )}
        </section>
    )
}

export default AdminHomeFilmStrip
