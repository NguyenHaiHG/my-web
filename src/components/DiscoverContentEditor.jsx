import { useEffect, useRef, useState } from 'react'
import Cropper from 'react-easy-crop'
import { ArrowDown, ArrowUp, Plus, Save, Trash2, Upload, X, WandSparkles } from 'lucide-react'
import { useUI } from '../context/UIContext'
import { createEmptyDiscoverContent, normalizeDiscoverContent } from '../content/discoverDefaults'
import { apiFetch, responseError } from '../utils/api'
import { compressImageFile, uploadImageDataUrl } from '../utils/uploadImage'
import './DiscoverContentEditor.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function parseRatio(ratio = '16:9') {
    const [w, h] = String(ratio).split(':').map(Number)
    if (!w || !h) return 16 / 9
    return w / h
}

function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = reject
        reader.onload = (ev) => resolve(ev.target.result)
        reader.readAsDataURL(file)
    })
}

function createImage(src) {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = () => resolve(image)
        image.onerror = reject
        image.src = src
    })
}

async function cropImageDataUrl(imageSrc, cropPixels, options = {}) {
    const { maxW = 1400, quality = 0.82 } = options
    const image = await createImage(imageSrc)
    const safeCrop = cropPixels || { x: 0, y: 0, width: image.width, height: image.height }
    const scale = Math.min(1, maxW / Math.max(safeCrop.width, safeCrop.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(safeCrop.width * scale)
    canvas.height = Math.round(safeCrop.height * scale)
    canvas.getContext('2d').drawImage(
        image,
        safeCrop.x,
        safeCrop.y,
        safeCrop.width,
        safeCrop.height,
        0,
        0,
        canvas.width,
        canvas.height
    )
    return canvas.toDataURL('image/jpeg', quality)
}

const EMPTY_JOURNEY = () => ({ id: '', title: '', route: '', duration: '', description: '', highlight: '', imageUrl: '', tags: '', accent: 'amber' })
const EMPTY_THEME = () => ({ id: '', name: '', icon: '✨', description: '', note: '' })
const EMPTY_STORY = () => ({ id: '', badge: '', title: '', subtitle: '', body: '', quote: '', imageUrl: '' })
const EMPTY_FILM = () => ({ id: '', title: '', imageUrl: '' })
const EMPTY_REC = () => ({ id: '', badge: '', title: '', description: '', ctaLabel: '', ctaLink: '', imageUrl: '' })

function parseList(text) {
    return text.split(',').map(v => v.trim()).filter(Boolean)
}

function listToText(list = []) {
    return Array.isArray(list) ? list.join(', ') : ''
}

function SectionCard({ title, children, onAdd, addLabel }) {
    return (
        <section className="discover-editor-card">
            <div className="discover-editor-card-head">
                <div>
                    <h3>{title}</h3>
                </div>
                {onAdd && (
                    <button type="button" className="discover-editor-add" onClick={onAdd}>
                        <Plus size={15} /> {addLabel || 'Thêm'}
                    </button>
                )}
            </div>
            {children}
        </section>
    )
}

function ItemHeader({ label, onRemove, onMoveUp, onMoveDown, disableUp, disableDown }) {
    return (
        <div className="discover-item-head">
            <span>{label}</span>
            <div className="discover-item-head-actions">
                {onMoveUp && (
                    <button type="button" className="discover-item-order" onClick={onMoveUp} disabled={disableUp}>
                        <ArrowUp size={14} /> Lên
                    </button>
                )}
                {onMoveDown && (
                    <button type="button" className="discover-item-order" onClick={onMoveDown} disabled={disableDown}>
                        <ArrowDown size={14} /> Xuống
                    </button>
                )}
                <button type="button" className="discover-item-remove" onClick={onRemove}>
                    <Trash2 size={14} /> Xoá
                </button>
            </div>
        </div>
    )
}

function FileInput({ onChange, preview, clearPreview, placeholder, onDropFile }) {
    const inputRef = useRef(null)
    const [dragging, setDragging] = useState(false)

    const handleDrop = (e) => {
        e.preventDefault()
        setDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file && typeof onDropFile === 'function') onDropFile(file)
    }

    return (
        <div className="discover-upload-block">
            <div
                className={`discover-upload-preview ${dragging ? 'dragging' : ''}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
            >
                {preview ? <img src={preview} alt="preview" /> : <div className="discover-upload-empty"><Upload size={20} /> {placeholder || 'Tải ảnh'}<small>Kéo-thả ảnh vào đây</small></div>}
            </div>
            <div className="discover-upload-actions">
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    hidden
                    onChange={onChange}
                />
                <button type="button" className="discover-mini-btn" onClick={() => inputRef.current?.click()}><Upload size={13} /> Chọn ảnh</button>
                {preview && <button type="button" className="discover-mini-btn danger" onClick={clearPreview}><X size={13} /> Xoá</button>}
            </div>
        </div>
    )
}

export default function DiscoverContentEditor() {
    const { showToast } = useUI()
    const [content, setContent] = useState(createEmptyDiscoverContent())
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeImage, setActiveImage] = useState(null)
    const [cropPreset, setCropPreset] = useState('16:9')
    const [cropOpen, setCropOpen] = useState(false)
    const [cropSource, setCropSource] = useState('')
    const [cropRatio, setCropRatio] = useState('16:9')
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [pendingTarget, setPendingTarget] = useState(null)

    useEffect(() => {
        fetch(`${API}/api/discover-content`)
            .then(res => res.json())
            .then(data => setContent(normalizeDiscoverContent(data || {})))
            .catch(() => setContent(createEmptyDiscoverContent()))
            .finally(() => setLoading(false))
    }, [])

    const updateHero = (key, value) => setContent(prev => ({ ...prev, hero: { ...prev.hero, [key]: value } }))
    const updateFilmSettings = (key, value) => setContent(prev => ({
        ...prev,
        filmStripSettings: { ...prev.filmStripSettings, [key]: value },
    }))
    const updateArrayItem = (section, index, key, value) => setContent(prev => {
        const next = prev[section].map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item)
        return { ...prev, [section]: next }
    })
    const addArrayItem = (section, makeItem) => setContent(prev => ({ ...prev, [section]: [...prev[section], makeItem()] }))
    const removeArrayItem = (section, index) => setContent(prev => ({ ...prev, [section]: prev[section].filter((_, itemIndex) => itemIndex !== index) }))
    const moveArrayItem = (section, from, to) => setContent(prev => {
        const list = [...prev[section]]
        if (to < 0 || to >= list.length) return prev
        const [picked] = list.splice(from, 1)
        list.splice(to, 0, picked)
        return { ...prev, [section]: list }
    })

    const applyImageValue = (section, index, imageValue) => {
        setContent(prev => {
            if (section === 'hero') return { ...prev, hero: { ...prev.hero, imageUrl: imageValue } }
            if (section === 'featureArticleWrap') return { ...prev, featureArticle: { ...prev.featureArticle, imageUrl: imageValue } }
            const next = prev[section].map((item, itemIndex) => itemIndex === index ? { ...item, imageUrl: imageValue } : item)
            return { ...prev, [section]: next }
        })
        setActiveImage(imageValue)
    }

    const openCropper = async (section, index, file, ratio = cropPreset) => {
        if (!file) return
        try {
            const source = await fileToDataUrl(file)
            setCropSource(source)
            setCropRatio(ratio)
            setCrop({ x: 0, y: 0 })
            setZoom(1)
            setCroppedAreaPixels(null)
            setPendingTarget({ section, index })
            setCropOpen(true)
        } catch {
            showToast('❌ Không đọc được ảnh này')
        }
    }

    const handleQuickCrop = async (section, index, file) => {
        if (!file) return
        try {
            const compressed = await compressImageFile(file, 1400)
            const imageUrl = await uploadImageDataUrl(compressed, file.name)
            applyImageValue(section, index, imageUrl)
        } catch (err) {
            showToast(`❌ ${err.message || 'Không tải được ảnh này'}`)
        }
    }

    const confirmManualCrop = async () => {
        if (!pendingTarget || !cropSource) return
        try {
            const cropped = await cropImageDataUrl(cropSource, croppedAreaPixels)
            const imageUrl = await uploadImageDataUrl(cropped, `discover-${pendingTarget.section}-${Date.now()}.jpg`)
            applyImageValue(pendingTarget.section, pendingTarget.index, imageUrl)
            setCropOpen(false)
            setCropSource('')
            setPendingTarget(null)
        } catch (err) {
            showToast(`❌ ${err.message || 'Không thể crop và tải ảnh'}`)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const payload = {
                ...content,
                journeys: content.journeys.map(item => ({ ...item, tags: parseList(item.tags) })),
            }
            const res = await apiFetch('/api/discover-content', {
                method: 'POST',
                body: JSON.stringify(payload),
            })
            if (!res.ok) throw await responseError(res, 'Không thể lưu nội dung Discover')
            const data = await res.json()
            setContent(normalizeDiscoverContent(data))
            showToast('✅ Đã lưu nội dung Discover')
        } catch (err) {
            showToast('❌ Lỗi: ' + err.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="db-loading">Đang tải CMS Discover...</div>

    return (
        <div className="discover-editor">
            <div className="discover-editor-hero">
                <div>
                    <p className="discover-editor-eyebrow"><WandSparkles size={14} /> CMS Discover</p>
                    <h2 className="db-section-title">Chỉnh nội dung trang Discover</h2>
                    <p className="discover-editor-desc">Sửa hero, hành trình nổi bật, chủ đề, story và recommendation ngay trong Dashboard. Ảnh có thể tải từ máy hoặc dán URL.</p>
                    <div className="discover-tools-row">
                        <label htmlFor="discover-crop-preset">Tỉ lệ crop ảnh mặc định</label>
                        <select id="discover-crop-preset" className="form-input" value={cropPreset} onChange={e => setCropPreset(e.target.value)}>
                            <option value="16:9">16:9 (hero, landscape)</option>
                            <option value="4:3">4:3 (journal cards)</option>
                            <option value="3:2">3:2 (story)</option>
                            <option value="1:1">1:1 (square)</option>
                        </select>
                    </div>
                </div>
                <button type="button" className="discover-save-btn" onClick={handleSave} disabled={saving}>
                    <Save size={15} /> {saving ? 'Đang lưu...' : 'Lưu Discover'}
                </button>
            </div>

            <SectionCard title="Hero" >
                <div className="discover-grid-2">
                    <div className="discover-form-stack">
                        <label>Eyebrow</label>
                        <input className="form-input" value={content.hero.eyebrow || ''} onChange={e => updateHero('eyebrow', e.target.value)} />
                        <label>Tiêu đề</label>
                        <textarea className="form-input form-textarea" rows="3" value={content.hero.title || ''} onChange={e => updateHero('title', e.target.value)} />
                        <label>Dòng nhấn</label>
                        <input className="form-input" value={content.hero.titleAccent || ''} onChange={e => updateHero('titleAccent', e.target.value)} />
                        <label>Phụ đề</label>
                        <textarea className="form-input form-textarea" rows="3" value={content.hero.subtitle || ''} onChange={e => updateHero('subtitle', e.target.value)} />
                        <label>Ghi chú</label>
                        <textarea className="form-input form-textarea" rows="2" value={content.hero.note || ''} onChange={e => updateHero('note', e.target.value)} />
                        <div className="discover-grid-2 tight">
                            <div>
                                <label>Nút chính</label>
                                <input className="form-input" value={content.hero.primaryCtaLabel || ''} onChange={e => updateHero('primaryCtaLabel', e.target.value)} />
                            </div>
                            <div>
                                <label>Link</label>
                                <input className="form-input" value={content.hero.primaryCtaLink || ''} onChange={e => updateHero('primaryCtaLink', e.target.value)} />
                            </div>
                            <div>
                                <label>Nút phụ</label>
                                <input className="form-input" value={content.hero.secondaryCtaLabel || ''} onChange={e => updateHero('secondaryCtaLabel', e.target.value)} />
                            </div>
                            <div>
                                <label>Link</label>
                                <input className="form-input" value={content.hero.secondaryCtaLink || ''} onChange={e => updateHero('secondaryCtaLink', e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <FileInput
                            preview={content.hero.imageUrl}
                            placeholder="Ảnh hero Hà Giang"
                            clearPreview={() => updateHero('imageUrl', '')}
                            onChange={e => openCropper('hero', 0, e.target.files?.[0], '16:9')}
                            onDropFile={file => openCropper('hero', 0, file, '16:9')}
                        />
                        <div className="discover-upload-inline-actions">
                            <button type="button" className="discover-mini-btn" onClick={() => document.getElementById('hero-quick-upload')?.click()}>Upload nhanh</button>
                            <input id="hero-quick-upload" type="file" hidden accept="image/png,image/jpeg,image/webp,image/gif" onChange={e => handleQuickCrop('hero', 0, e.target.files?.[0], '16:9')} />
                        </div>
                        <label>URL ảnh</label>
                        <input className="form-input" value={content.hero.imageUrl || ''} onChange={e => updateHero('imageUrl', e.target.value)} />
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="Featured journeys" onAdd={() => addArrayItem('journeys', EMPTY_JOURNEY)} addLabel="Thêm hành trình">
                <div className="discover-list">
                    {content.journeys.map((journey, index) => (
                        <article key={journey.id || index} className="discover-list-item">
                            <ItemHeader
                                label={journey.title || `Hành trình ${index + 1}`}
                                onRemove={() => removeArrayItem('journeys', index)}
                                onMoveUp={() => moveArrayItem('journeys', index, index - 1)}
                                onMoveDown={() => moveArrayItem('journeys', index, index + 1)}
                                disableUp={index === 0}
                                disableDown={index === content.journeys.length - 1}
                            />
                            <div className="discover-grid-2">
                                <div className="discover-form-stack">
                                    <label>Tiêu đề</label>
                                    <input className="form-input" value={journey.title || ''} onChange={e => updateArrayItem('journeys', index, 'title', e.target.value)} />
                                    <label>Route</label>
                                    <input className="form-input" value={journey.route || ''} onChange={e => updateArrayItem('journeys', index, 'route', e.target.value)} />
                                    <div className="discover-grid-2 tight">
                                        <div>
                                            <label>Thời lượng</label>
                                            <input className="form-input" value={journey.duration || ''} onChange={e => updateArrayItem('journeys', index, 'duration', e.target.value)} />
                                        </div>
                                        <div>
                                            <label>Màu</label>
                                            <input className="form-input" value={journey.accent || ''} onChange={e => updateArrayItem('journeys', index, 'accent', e.target.value)} />
                                        </div>
                                    </div>
                                    <label>Mô tả</label>
                                    <textarea className="form-input form-textarea" rows="3" value={journey.description || ''} onChange={e => updateArrayItem('journeys', index, 'description', e.target.value)} />
                                    <label>Điểm nhấn</label>
                                    <input className="form-input" value={journey.highlight || ''} onChange={e => updateArrayItem('journeys', index, 'highlight', e.target.value)} />
                                    <label>Tags, ngăn bằng dấu phẩy</label>
                                    <input className="form-input" value={listToText(journey.tags)} onChange={e => updateArrayItem('journeys', index, 'tags', e.target.value)} />
                                </div>
                                <div>
                                    <FileInput
                                        preview={journey.imageUrl}
                                        placeholder="Ảnh hành trình"
                                        clearPreview={() => updateArrayItem('journeys', index, 'imageUrl', '')}
                                        onChange={e => openCropper('journeys', index, e.target.files?.[0], '4:3')}
                                        onDropFile={file => openCropper('journeys', index, file, '4:3')}
                                    />
                                    <label>URL ảnh</label>
                                    <input className="form-input" value={journey.imageUrl || ''} onChange={e => updateArrayItem('journeys', index, 'imageUrl', e.target.value)} />
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </SectionCard>

            <SectionCard title="Journey themes" onAdd={() => addArrayItem('themes', EMPTY_THEME)} addLabel="Thêm theme">
                <div className="discover-list compact">
                    {content.themes.map((theme, index) => (
                        <article key={theme.id || index} className="discover-mini-card">
                            <ItemHeader
                                label={theme.name || `Theme ${index + 1}`}
                                onRemove={() => removeArrayItem('themes', index)}
                                onMoveUp={() => moveArrayItem('themes', index, index - 1)}
                                onMoveDown={() => moveArrayItem('themes', index, index + 1)}
                                disableUp={index === 0}
                                disableDown={index === content.themes.length - 1}
                            />
                            <div className="discover-grid-2 tight">
                                <div>
                                    <label>Tên</label>
                                    <input className="form-input" value={theme.name || ''} onChange={e => updateArrayItem('themes', index, 'name', e.target.value)} />
                                </div>
                                <div>
                                    <label>Icon</label>
                                    <input className="form-input" value={theme.icon || ''} onChange={e => updateArrayItem('themes', index, 'icon', e.target.value)} />
                                </div>
                            </div>
                            <label>Mô tả</label>
                            <textarea className="form-input form-textarea" rows="2" value={theme.description || ''} onChange={e => updateArrayItem('themes', index, 'description', e.target.value)} />
                            <label>Ghi chú</label>
                            <textarea className="form-input form-textarea" rows="2" value={theme.note || ''} onChange={e => updateArrayItem('themes', index, 'note', e.target.value)} />
                        </article>
                    ))}
                </div>
            </SectionCard>

            <SectionCard title="Stories" onAdd={() => addArrayItem('stories', EMPTY_STORY)} addLabel="Thêm story">
                <div className="discover-list">
                    {content.stories.map((story, index) => (
                        <article key={story.id || index} className="discover-list-item">
                            <ItemHeader
                                label={story.title || `Story ${index + 1}`}
                                onRemove={() => removeArrayItem('stories', index)}
                                onMoveUp={() => moveArrayItem('stories', index, index - 1)}
                                onMoveDown={() => moveArrayItem('stories', index, index + 1)}
                                disableUp={index === 0}
                                disableDown={index === content.stories.length - 1}
                            />
                            <div className="discover-grid-2">
                                <div className="discover-form-stack">
                                    <label>Badge</label>
                                    <input className="form-input" value={story.badge || ''} onChange={e => updateArrayItem('stories', index, 'badge', e.target.value)} />
                                    <label>Tiêu đề</label>
                                    <input className="form-input" value={story.title || ''} onChange={e => updateArrayItem('stories', index, 'title', e.target.value)} />
                                    <label>Phụ đề</label>
                                    <input className="form-input" value={story.subtitle || ''} onChange={e => updateArrayItem('stories', index, 'subtitle', e.target.value)} />
                                    <label>Nội dung</label>
                                    <textarea className="form-input form-textarea" rows="5" value={story.body || ''} onChange={e => updateArrayItem('stories', index, 'body', e.target.value)} />
                                    <label>Quote</label>
                                    <textarea className="form-input form-textarea" rows="3" value={story.quote || ''} onChange={e => updateArrayItem('stories', index, 'quote', e.target.value)} />
                                </div>
                                <div>
                                    <FileInput
                                        preview={story.imageUrl}
                                        placeholder="Ảnh story"
                                        clearPreview={() => updateArrayItem('stories', index, 'imageUrl', '')}
                                        onChange={e => openCropper('stories', index, e.target.files?.[0], '3:2')}
                                        onDropFile={file => openCropper('stories', index, file, '3:2')}
                                    />
                                    <label>URL ảnh</label>
                                    <input className="form-input" value={story.imageUrl || ''} onChange={e => updateArrayItem('stories', index, 'imageUrl', e.target.value)} />
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </SectionCard>

            <SectionCard title="Feature article">
                <div className="discover-grid-2">
                    <div className="discover-form-stack">
                        <label>Badge</label>
                        <input className="form-input" value={content.featureArticle?.badge || ''} onChange={e => setContent(prev => ({ ...prev, featureArticle: { ...prev.featureArticle, badge: e.target.value } }))} />
                        <label>Tiêu đề</label>
                        <input className="form-input" value={content.featureArticle?.title || ''} onChange={e => setContent(prev => ({ ...prev, featureArticle: { ...prev.featureArticle, title: e.target.value } }))} />
                        <label>Phụ đề</label>
                        <textarea className="form-input form-textarea" rows="3" value={content.featureArticle?.subtitle || ''} onChange={e => setContent(prev => ({ ...prev, featureArticle: { ...prev.featureArticle, subtitle: e.target.value } }))} />
                        <label>Nội dung bài viết</label>
                        <textarea className="form-input form-textarea" rows="8" value={content.featureArticle?.body || ''} onChange={e => setContent(prev => ({ ...prev, featureArticle: { ...prev.featureArticle, body: e.target.value } }))} />
                        <label>Quote</label>
                        <textarea className="form-input form-textarea" rows="3" value={content.featureArticle?.quote || ''} onChange={e => setContent(prev => ({ ...prev, featureArticle: { ...prev.featureArticle, quote: e.target.value } }))} />
                    </div>
                    <div>
                        <FileInput
                            preview={content.featureArticle?.imageUrl}
                            placeholder="Ảnh bài viết"
                            clearPreview={() => setContent(prev => ({ ...prev, featureArticle: { ...prev.featureArticle, imageUrl: '' } }))}
                            onChange={e => openCropper('featureArticleWrap', 0, e.target.files?.[0], '3:2')}
                            onDropFile={file => openCropper('featureArticleWrap', 0, file, '3:2')}
                        />
                        <label>URL ảnh</label>
                        <input className="form-input" value={content.featureArticle?.imageUrl || ''} onChange={e => setContent(prev => ({ ...prev, featureArticle: { ...prev.featureArticle, imageUrl: e.target.value } }))} />
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="Film strip images" onAdd={() => addArrayItem('filmStrip', EMPTY_FILM)} addLabel="Thêm ảnh phim">
                <div className="discover-grid-2 tight" style={{ marginTop: 0 }}>
                    <div>
                        <label>Tốc độ chạy</label>
                        <select className="form-input" value={content.filmStripSettings?.speed || 'normal'} onChange={e => updateFilmSettings('speed', e.target.value)}>
                            <option value="slow">Chậm</option>
                            <option value="normal">Vừa</option>
                            <option value="fast">Nhanh</option>
                        </select>
                    </div>
                    <div>
                        <label>Watermark text</label>
                        <input className="form-input" value={content.filmStripSettings?.watermarkText || ''} onChange={e => updateFilmSettings('watermarkText', e.target.value)} placeholder="HTX Truong Hai" />
                    </div>
                </div>
                <div className="discover-checkbox-row">
                    <label className="discover-checkbox-item">
                        <input type="checkbox" checked={Boolean(content.filmStripSettings?.pauseOnHover)} onChange={e => updateFilmSettings('pauseOnHover', e.target.checked)} />
                        <span>Pause khi hover</span>
                    </label>
                    <label className="discover-checkbox-item">
                        <input type="checkbox" checked={Boolean(content.filmStripSettings?.lightboxOnClick)} onChange={e => updateFilmSettings('lightboxOnClick', e.target.checked)} />
                        <span>Mở full ảnh khi click</span>
                    </label>
                    <label className="discover-checkbox-item">
                        <input type="checkbox" checked={Boolean(content.filmStripSettings?.watermarkEnabled)} onChange={e => updateFilmSettings('watermarkEnabled', e.target.checked)} />
                        <span>Hiện watermark</span>
                    </label>
                </div>
                <div className="discover-list compact">
                    {(content.filmStrip || []).map((film, index) => (
                        <article key={film.id || index} className="discover-mini-card">
                            <ItemHeader
                                label={film.title || `Ảnh phim ${index + 1}`}
                                onRemove={() => removeArrayItem('filmStrip', index)}
                                onMoveUp={() => moveArrayItem('filmStrip', index, index - 1)}
                                onMoveDown={() => moveArrayItem('filmStrip', index, index + 1)}
                                disableUp={index === 0}
                                disableDown={index === content.filmStrip.length - 1}
                            />
                            <label>Tiêu đề ảnh</label>
                            <input className="form-input" value={film.title || ''} onChange={e => updateArrayItem('filmStrip', index, 'title', e.target.value)} />
                            <label>URL ảnh</label>
                            <input className="form-input" value={film.imageUrl || ''} onChange={e => updateArrayItem('filmStrip', index, 'imageUrl', e.target.value)} />
                            <FileInput
                                preview={film.imageUrl}
                                placeholder="Ảnh cuộn phim"
                                clearPreview={() => updateArrayItem('filmStrip', index, 'imageUrl', '')}
                                onChange={e => openCropper('filmStrip', index, e.target.files?.[0], '16:9')}
                                onDropFile={file => openCropper('filmStrip', index, file, '16:9')}
                            />
                        </article>
                    ))}
                </div>
            </SectionCard>

            <SectionCard title="Recommendations" onAdd={() => addArrayItem('recommendations', EMPTY_REC)} addLabel="Thêm recommendation">
                <div className="discover-list compact">
                    {content.recommendations.map((rec, index) => (
                        <article key={rec.id || index} className="discover-mini-card">
                            <ItemHeader
                                label={rec.title || `Recommendation ${index + 1}`}
                                onRemove={() => removeArrayItem('recommendations', index)}
                                onMoveUp={() => moveArrayItem('recommendations', index, index - 1)}
                                onMoveDown={() => moveArrayItem('recommendations', index, index + 1)}
                                disableUp={index === 0}
                                disableDown={index === content.recommendations.length - 1}
                            />
                            <div className="discover-grid-2 tight">
                                <div>
                                    <label>Badge</label>
                                    <input className="form-input" value={rec.badge || ''} onChange={e => updateArrayItem('recommendations', index, 'badge', e.target.value)} />
                                </div>
                                <div>
                                    <label>Nút</label>
                                    <input className="form-input" value={rec.ctaLabel || ''} onChange={e => updateArrayItem('recommendations', index, 'ctaLabel', e.target.value)} />
                                </div>
                            </div>
                            <label>Tiêu đề</label>
                            <input className="form-input" value={rec.title || ''} onChange={e => updateArrayItem('recommendations', index, 'title', e.target.value)} />
                            <label>Mô tả</label>
                            <textarea className="form-input form-textarea" rows="2" value={rec.description || ''} onChange={e => updateArrayItem('recommendations', index, 'description', e.target.value)} />
                            <div className="discover-grid-2 tight">
                                <div>
                                    <label>Link</label>
                                    <input className="form-input" value={rec.ctaLink || ''} onChange={e => updateArrayItem('recommendations', index, 'ctaLink', e.target.value)} />
                                </div>
                                <div>
                                    <label>URL ảnh</label>
                                    <input className="form-input" value={rec.imageUrl || ''} onChange={e => updateArrayItem('recommendations', index, 'imageUrl', e.target.value)} />
                                </div>
                            </div>
                            <FileInput
                                preview={rec.imageUrl}
                                placeholder="Ảnh recommendation"
                                clearPreview={() => updateArrayItem('recommendations', index, 'imageUrl', '')}
                                onChange={e => openCropper('recommendations', index, e.target.files?.[0], '4:3')}
                                onDropFile={file => openCropper('recommendations', index, file, '4:3')}
                            />
                        </article>
                    ))}
                </div>
            </SectionCard>

            {activeImage && <p className="discover-editor-hint">Ảnh vừa tải đã được nén, upload lên server, và lưu URL vào form hiện tại.</p>}

            {cropOpen && (
                <div className="discover-crop-backdrop" onClick={() => setCropOpen(false)}>
                    <div className="discover-crop-modal" onClick={e => e.stopPropagation()}>
                        <div className="discover-crop-head">
                            <h3>Crop ảnh thủ công</h3>
                            <button type="button" className="discover-item-remove" onClick={() => setCropOpen(false)}>
                                <X size={14} /> Đóng
                            </button>
                        </div>
                        <div className="discover-crop-wrap">
                            <Cropper
                                image={cropSource}
                                crop={crop}
                                zoom={zoom}
                                aspect={parseRatio(cropRatio)}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
                            />
                        </div>
                        <div className="discover-crop-controls">
                            <label htmlFor="discover-zoom">Zoom</label>
                            <input id="discover-zoom" type="range" min="1" max="3" step="0.05" value={zoom} onChange={e => setZoom(Number(e.target.value))} />
                            <span>{zoom.toFixed(2)}x</span>
                        </div>
                        <div className="discover-crop-actions">
                            <button type="button" className="discover-mini-btn" onClick={() => setCropOpen(false)}>Huỷ</button>
                            <button type="button" className="discover-save-btn" onClick={confirmManualCrop}>Lưu crop</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
