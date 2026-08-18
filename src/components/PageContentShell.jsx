import { cloneElement, useCallback, useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, Edit3, ImagePlus, Plus, RotateCcw, Save, Trash2, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { apiFetch, responseError } from '../utils/api'
import { compressImageFile, uploadImageDataUrl } from '../utils/uploadImage'
import './PageContentShell.css'

const EMPTY = { title: '', subtitle: '', body: '', image: '', buttonLabel: '', buttonHref: '' }
const SECTION_LABELS = { hero: 'Hero', intro: 'Giới thiệu', cta: 'Kêu gọi hành động' }
const DEFAULT_FIELDS = [
    { key: 'title', label: 'Tiêu đề' },
    { key: 'subtitle', label: 'Phụ đề' },
    { key: 'body', label: 'Nội dung', type: 'textarea' },
    { key: 'image', label: 'Ảnh', type: 'image' },
    { key: 'buttonLabel', label: 'Nhãn nút' },
    { key: 'buttonHref', label: 'Liên kết nút', type: 'url' },
]

function normalizeFields(fields) {
    if (Array.isArray(fields)) {
        return fields.map(field => typeof field === 'string' ? { key: field, label: field } : field).filter(field => field?.key)
    }
    if (fields && typeof fields === 'object') {
        return Object.entries(fields).map(([key, value]) => {
            if (typeof value === 'string') return { key, label: value }
            return { key, ...(value || {}) }
        })
    }
    return DEFAULT_FIELDS
}

function normalizeSections(sections) {
    const entries = Array.isArray(sections)
        ? sections.map(section => [typeof section === 'string' ? section : section.key, section])
        : Object.entries(sections || {})

    return entries
        .filter(([key]) => key)
        .map(([key, value]) => {
            const config = typeof value === 'string'
                ? { label: value }
                : Array.isArray(value) ? { fields: value } : (value || {})
            return {
                key,
                label: config.label || SECTION_LABELS[key] || key,
                type: config.type === 'list' || config.list ? 'list' : 'object',
                fields: normalizeFields(config.fields),
                itemLabel: config.itemLabel || 'Mục',
                emptyItem: config.emptyItem || {},
            }
        })
}

function contentItems(value) {
    if (Array.isArray(value)) return value
    if (Array.isArray(value?.items)) return value.items
    return []
}

function responseItems(value, fallback) {
    if (Array.isArray(value)) return value
    if (Array.isArray(value?.items)) return value.items
    return fallback
}

function itemId(item) {
    return item?._id || item?.id
}

function FieldInput({ field, value, onChange, onError }) {
    const type = field.type || 'text'

    const pickImage = async event => {
        const file = event.target.files?.[0]
        if (!file) return
        try {
            onChange(await compressImageFile(file))
        } catch {
            onError('Không đọc được ảnh đã chọn')
        }
    }

    if (type === 'textarea') {
        return <textarea className="form-input" rows={field.rows || 5} value={value ?? ''} onChange={e => onChange(e.target.value)} />
    }
    if (type === 'select') {
        return (
            <select className="form-input" value={value ?? ''} onChange={e => onChange(e.target.value)}>
                {(field.options || []).map(option => {
                    const optionValue = typeof option === 'object' ? option.value : option
                    const optionLabel = typeof option === 'object' ? option.label : option
                    return <option key={optionValue} value={optionValue}>{optionLabel}</option>
                })}
            </select>
        )
    }
    if (type === 'checkbox') {
        return <input type="checkbox" checked={Boolean(value)} onChange={e => onChange(e.target.checked)} />
    }
    if (type === 'tags') {
        return (
            <input
                className="form-input"
                value={Array.isArray(value) ? value.join(', ') : (value ?? '')}
                placeholder={field.placeholder || 'Ngăn cách bằng dấu phẩy'}
                onChange={e => onChange(e.target.value.split(',').map(item => item.trim()).filter(Boolean))}
            />
        )
    }
    if (type === 'image') {
        return (
            <>
                <label className="cms-image-picker">
                    <ImagePlus size={17} /> Chọn ảnh mới
                    <input type="file" accept="image/*" onChange={pickImage} hidden />
                </label>
                {value && <img className="cms-image-preview" src={value} alt="" />}
            </>
        )
    }
    return <input className="form-input" type={type} value={value ?? ''} placeholder={field.placeholder || ''} onChange={e => onChange(type === 'number' ? e.target.valueAsNumber : e.target.value)} />
}

function FieldsForm({ fields, value, onChange, onError }) {
    return fields.map(field => (
        <div key={field.key} className={`cms-field ${field.type === 'checkbox' ? 'cms-checkbox-field' : ''}`}>
            <span>{field.label || field.key}</span>
            <FieldInput
                field={field}
                value={value?.[field.key]}
                onChange={nextValue => onChange({ ...value, [field.key]: nextValue })}
                onError={onError}
            />
        </div>
    ))
}

export function ContentEditor({ page, section, initial, onSaved, onClose }) {
    const [form, setForm] = useState({ ...EMPTY, ...initial })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const pickImage = async event => {
        const file = event.target.files?.[0]
        if (!file) return
        setError('')
        try {
            const dataUrl = await compressImageFile(file)
            setForm(prev => ({ ...prev, image: dataUrl }))
        } catch {
            setError('Không đọc được ảnh đã chọn')
        }
    }

    const save = async event => {
        event.preventDefault()
        setSaving(true)
        setError('')
        try {
            const image = await uploadImageDataUrl(form.image, `${page}-${section}.jpg`)
            const payload = { ...form, image }
            const response = await apiFetch(`/api/site-content/${page}/${section}`, {
                method: 'PUT',
                body: JSON.stringify(payload),
            })
            if (!response.ok) throw await responseError(response, 'Không thể lưu nội dung')
            onSaved(section, await response.json())
            onClose()
        } catch (err) {
            setError(err?.message || 'Không thể lưu nội dung')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="modal-backdrop cms-editor-backdrop" onClick={onClose}>
            <form className="modal cms-editor-modal" onSubmit={save} onClick={event => event.stopPropagation()}>
                <button type="button" className="modal-close" onClick={onClose}><X size={18} /></button>
                <h2>Chỉnh {SECTION_LABELS[section]} · {page}</h2>
                <label>Tiêu đề<input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></label>
                <label>Phụ đề<input className="form-input" value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} /></label>
                <label>Nội dung<textarea className="form-input" rows="5" value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} /></label>
                <label>Nhãn nút<input className="form-input" value={form.buttonLabel} onChange={e => setForm({ ...form, buttonLabel: e.target.value })} /></label>
                <label>Liên kết nút<input className="form-input" value={form.buttonHref} onChange={e => setForm({ ...form, buttonHref: e.target.value })} /></label>
                <label className="cms-image-picker">
                    <ImagePlus size={17} /> Chọn ảnh mới
                    <input type="file" accept="image/*" onChange={pickImage} hidden />
                </label>
                {form.image && <img className="cms-image-preview" src={form.image} alt="" />}
                {error && <p className="form-error">{error}</p>}
                <button className="btn3d btn3d-green btn-full" disabled={saving}>
                    <Save size={16} /> {saving ? 'Đang lưu lên server…' : 'Lưu lên server'}
                </button>
            </form>
        </div>
    )
}

export function ObjectSectionEditor({ page, config, initial, onSaved, onClose }) {
    const [form, setForm] = useState({ ...(initial || {}) })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const save = async event => {
        event.preventDefault()
        setSaving(true)
        setError('')
        try {
            const payload = { ...form }
            for (const field of config.fields) {
                if (field.type === 'image' && payload[field.key]) {
                    payload[field.key] = await uploadImageDataUrl(payload[field.key], `${page}-${config.key}-${field.key}.jpg`)
                }
            }
            const response = await apiFetch(`/api/site-content/${page}/${config.key}`, {
                method: 'PUT',
                body: JSON.stringify(payload),
            })
            if (!response.ok) throw await responseError(response, 'Không thể lưu nội dung')
            onSaved(config.key, await response.json())
            onClose()
        } catch (err) {
            setError(err?.message || 'Không thể lưu nội dung')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="modal-backdrop cms-editor-backdrop" onClick={onClose}>
            <form className="modal cms-editor-modal" onSubmit={save} onClick={event => event.stopPropagation()}>
                <button type="button" className="modal-close" onClick={onClose}><X size={18} /></button>
                <h2>Chỉnh {config.label} · {page}</h2>
                <FieldsForm fields={config.fields} value={form} onChange={setForm} onError={setError} />
                {error && <p className="form-error">{error}</p>}
                <button className="btn3d btn3d-green btn-full" disabled={saving}>
                    <Save size={16} /> {saving ? 'Đang lưu lên server…' : 'Lưu lên server'}
                </button>
            </form>
        </div>
    )
}

export function ListSectionEditor({ page, config, initial, onSaved, onClose, initialEditId = '', openNewInitially = false }) {
    const initialItems = contentItems(initial)
    const initialIndex = initialEditId ? initialItems.findIndex(item => itemId(item) === initialEditId) : -1
    const emptyItem = typeof config.emptyItem === 'function' ? config.emptyItem() : config.emptyItem
    const [items, setItems] = useState(initialItems)
    const [draft, setDraft] = useState(() => initialIndex >= 0 ? { ...initialItems[initialIndex] } : openNewInitially ? { ...emptyItem } : null)
    const [draftIndex, setDraftIndex] = useState(initialIndex)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const endpoint = `/api/site-content/${page}/${config.key}`

    const commitItems = nextItems => {
        setItems(nextItems)
        onSaved(config.key, Array.isArray(initial) ? nextItems : { ...(initial || {}), items: nextItems })
    }

    const openNew = () => {
        const empty = typeof config.emptyItem === 'function' ? config.emptyItem() : config.emptyItem
        setDraft({ ...empty })
        setDraftIndex(-1)
        setError('')
    }

    const saveItem = async event => {
        event.preventDefault()
        setSaving(true)
        setError('')
        try {
            const payload = { ...draft }
            for (const field of config.fields) {
                if (field.type === 'image' && payload[field.key]) {
                    payload[field.key] = await uploadImageDataUrl(payload[field.key], `${page}-${config.key}-${field.key}.jpg`)
                }
            }
            const current = draftIndex >= 0 ? items[draftIndex] : null
            const id = itemId(current)
            const response = await apiFetch(`${endpoint}/items${id ? `/${id}` : ''}`, {
                method: id ? 'PUT' : 'POST',
                body: JSON.stringify(payload),
            })
            if (!response.ok) throw await responseError(response, 'Không thể lưu mục')
            const result = await response.json()
            const savedItem = result?.item || result
            const fallback = draftIndex >= 0
                ? items.map((item, index) => index === draftIndex ? savedItem : item)
                : [...items, savedItem]
            commitItems(responseItems(result, fallback))
            setDraft(null)
        } catch (err) {
            setError(err?.message || 'Không thể lưu mục')
        } finally {
            setSaving(false)
        }
    }

    const removeItem = async index => {
        const item = items[index]
        const id = itemId(item)
        if (!id || !window.confirm(`Xoá ${config.itemLabel.toLowerCase()} này?`)) return
        setError('')
        try {
            const response = await apiFetch(`${endpoint}/items/${id}`, { method: 'DELETE' })
            if (!response.ok) throw await responseError(response, 'Không thể xoá mục')
            const result = await response.json().catch(() => ({}))
            commitItems(responseItems(result, items.filter((_, itemIndex) => itemIndex !== index)))
        } catch (err) {
            setError(err?.message || 'Không thể xoá mục')
        }
    }

    const moveItem = async (from, to) => {
        if (to < 0 || to >= items.length) return
        const nextItems = [...items]
        const [moved] = nextItems.splice(from, 1)
        nextItems.splice(to, 0, moved)
        const ids = nextItems.map(itemId)
        if (ids.some(id => !id)) {
            setError('Không thể sắp xếp mục chưa có mã định danh')
            return
        }
        setError('')
        try {
            const response = await apiFetch(`${endpoint}/items/reorder`, {
                method: 'PATCH',
                body: JSON.stringify({ ids }),
            })
            if (!response.ok) throw await responseError(response, 'Không thể đổi thứ tự')
            const result = await response.json()
            commitItems(responseItems(result, nextItems))
        } catch (err) {
            setError(err?.message || 'Không thể đổi thứ tự')
        }
    }

    return (
        <div className="modal-backdrop cms-editor-backdrop" onClick={onClose}>
            <div className="modal cms-editor-modal cms-list-editor" onClick={event => event.stopPropagation()}>
                <button type="button" className="modal-close" onClick={onClose}><X size={18} /></button>
                <div className="cms-list-editor-head">
                    <h2>{config.label} · {page}</h2>
                    <button type="button" className="cms-add-item" onClick={openNew}><Plus size={15} /> Thêm {config.itemLabel.toLowerCase()}</button>
                </div>
                {items.length === 0 && <p className="cms-empty-list">Chưa có dữ liệu.</p>}
                <div className="cms-list-editor-items">
                    {items.map((item, index) => (
                        <div className="cms-list-editor-item" key={itemId(item) || index}>
                            <strong>{item.title || item.name || `${config.itemLabel} ${index + 1}`}</strong>
                            <div>
                                <button type="button" onClick={() => moveItem(index, index - 1)} disabled={index === 0} title="Chuyển lên"><ArrowUp size={15} /></button>
                                <button type="button" onClick={() => moveItem(index, index + 1)} disabled={index === items.length - 1} title="Chuyển xuống"><ArrowDown size={15} /></button>
                                <button type="button" onClick={() => { setDraft({ ...item }); setDraftIndex(index); setError('') }}><Edit3 size={15} /> Sửa</button>
                                <button type="button" className="cms-delete-item" onClick={() => removeItem(index)}><Trash2 size={15} /> Xoá</button>
                            </div>
                        </div>
                    ))}
                </div>
                {error && !draft && <p className="form-error">{error}</p>}
                {draft && (
                    <form className="cms-item-form" onSubmit={saveItem}>
                        <h3>{draftIndex >= 0 ? `Sửa ${config.itemLabel.toLowerCase()}` : `Thêm ${config.itemLabel.toLowerCase()}`}</h3>
                        <FieldsForm fields={config.fields} value={draft} onChange={setDraft} onError={setError} />
                        {error && <p className="form-error">{error}</p>}
                        <div className="cms-item-form-actions">
                            <button type="button" onClick={() => setDraft(null)}>Huỷ</button>
                            <button className="btn3d btn3d-green" disabled={saving}><Save size={15} /> {saving ? 'Đang lưu…' : 'Lưu mục'}</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

function ManagedSection({ content, className }) {
    if (!content || !Object.values(content).some(Boolean)) return null
    return (
        <section className={`cms-managed-section ${className || ''}`} style={content.image ? { backgroundImage: `linear-gradient(#092e1fcf,#092e1fcf),url("${content.image}")` } : undefined}>
            <div className="container">
                {content.title && <h2>{content.title}</h2>}
                {content.subtitle && <p className="cms-section-subtitle">{content.subtitle}</p>}
                {content.body && <p>{content.body}</p>}
                {content.buttonLabel && <a className="btn3d btn3d-orange" href={content.buttonHref || '#'}>{content.buttonLabel}</a>}
            </div>
        </section>
    )
}

export function ManagedListSection({ content, items: inputItems, className = '', title, empty = null, renderItem }) {
    const items = inputItems || contentItems(content)
    if (!items.length) return empty

    return (
        <section className={`cms-managed-list-section ${className}`}>
            <div className="container">
                {title && <h2>{title}</h2>}
                <div className="cms-managed-list">
                    {items.map((item, index) => (
                        <article className="cms-managed-list-card" key={itemId(item) || index}>
                            {renderItem ? renderItem(item, index) : (
                                <>
                                    {(item.image || item.imageUrl) && <img src={item.image || item.imageUrl} alt={item.title || item.name || ''} />}
                                    {(item.title || item.name) && <h3>{item.title || item.name}</h3>}
                                    {item.subtitle && <p className="cms-section-subtitle">{item.subtitle}</p>}
                                    {(item.body || item.description) && <p>{item.body || item.description}</p>}
                                    {(item.buttonLabel || item.linkLabel) && (
                                        <a className="btn3d btn3d-orange" href={item.buttonHref || item.linkHref || '#'}>
                                            {item.buttonLabel || item.linkLabel}
                                        </a>
                                    )}
                                </>
                            )}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

export function PageContentAdminPanel({ page, sections, title, publicPath }) {
    const [content, setContent] = useState({})
    const [editing, setEditing] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const customSections = normalizeSections(sections)
    const availableSections = [
        ...Object.keys(SECTION_LABELS).map(key => ({ key, label: SECTION_LABELS[key], legacy: true, type: 'object' })),
        ...customSections.filter(section => !SECTION_LABELS[section.key]),
    ]
    const editingConfig = customSections.find(section => section.key === editing)

    const load = useCallback(() => {
        setLoading(true)
        setError('')
        apiFetch(`/api/site-content/${page}`, { auth: false })
            .then(async response => {
                if (!response.ok) throw await responseError(response, 'Không thể tải nội dung trang')
                setContent(await response.json())
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, [page])

    useEffect(load, [load])

    const removeSection = async section => {
        const label = availableSections.find(item => item.key === section)?.label || section
        if (!window.confirm(`Xóa nội dung ${label} khỏi server và dùng lại nội dung mặc định?`)) return
        try {
            const response = await apiFetch(`/api/site-content/${page}/${section}`, { method: 'DELETE' })
            if (!response.ok) throw await responseError(response, 'Không thể xóa section')
            setContent(current => {
                const next = { ...current }
                delete next[section]
                return next
            })
        } catch (err) {
            setError(err.message)
        }
    }

    const onSaved = (section, value) => setContent(current => ({ ...current, [section]: value }))

    return (
        <section className="cms-dashboard-panel">
            <div className="cms-dashboard-panel-head">
                <div>
                    <h3>{title || page}</h3>
                    <p>Chỉnh trực tiếp các section đang hiển thị và lưu vào MongoDB.</p>
                </div>
                {publicPath && <a className="btn3d btn3d-blue btn-sm" href={publicPath}>Xem trang</a>}
            </div>
            {error && <p className="form-error">{error}</p>}
            {loading ? <p>Đang tải nội dung…</p> : (
                <div className="cms-dashboard-section-grid">
                    {availableSections.map(section => {
                        const value = content[section.key]
                        const count = section.type === 'list' ? contentItems(value).length : null
                        return (
                            <article key={section.key} className="cms-dashboard-section-card">
                                <div>
                                    <strong>{section.label}</strong>
                                    <small>{section.type === 'list' ? `${count} mục` : value ? 'Đã cấu hình' : 'Đang dùng mặc định'}</small>
                                </div>
                                <div>
                                    <button type="button" onClick={() => setEditing(section.key)}>
                                        {section.type === 'list' ? <><Plus size={14} /> Quản lý</> : <><Edit3 size={14} /> Sửa</>}
                                    </button>
                                    {value && <button type="button" className="cms-delete-item" onClick={() => removeSection(section.key)}><Trash2 size={14} /> Xóa</button>}
                                </div>
                            </article>
                        )
                    })}
                </div>
            )}
            {editing && editingConfig?.type === 'list' && (
                <ListSectionEditor page={page} config={editingConfig} initial={content[editing]} onSaved={onSaved} onClose={() => setEditing('')} />
            )}
            {editing && editingConfig?.type === 'object' && (
                <ObjectSectionEditor page={page} config={editingConfig} initial={content[editing]} onSaved={onSaved} onClose={() => setEditing('')} />
            )}
            {editing && !editingConfig && (
                <ContentEditor page={page} section={editing} initial={content[editing]} onSaved={onSaved} onClose={() => setEditing('')} />
            )}
        </section>
    )
}

export default function PageContentShell({ page, children, sections }) {
    const { isAdmin } = useAuth()
    const [content, setContent] = useState({})
    const [editing, setEditing] = useState('')
    const customSections = normalizeSections(sections)
    const toolbarSections = [
        ...Object.keys(SECTION_LABELS).map(key => ({ key, label: SECTION_LABELS[key], legacy: true, type: 'object' })),
        ...customSections.filter(section => !SECTION_LABELS[section.key]),
    ]
    const editingConfig = customSections.find(section => section.key === editing)

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/site-content/${page}`)
            .then(response => response.ok ? response.json() : {})
            .then(setContent)
            .catch(() => setContent({}))
    }, [page])

    const resetSection = async section => {
        const label = toolbarSections.find(item => item.key === section)?.label || section
        if (!window.confirm(`Khôi phục ${label} về nội dung mặc định?`)) return
        const response = await apiFetch(`/api/site-content/${page}/${section}`, { method: 'DELETE' })
        if (response.ok) setContent(prev => {
            const next = { ...prev }
            delete next[section]
            return next
        })
    }

    return (
        <>
            {isAdmin && (
                <div className="admin-page-toolbar">
                    <strong><Edit3 size={16} /> Chỉnh trực tiếp:</strong>
                    {toolbarSections.map(section => (
                        <span key={section.key}>
                            <button onClick={() => setEditing(section.key)}>{section.label}</button>
                            {content[section.key] && <button className="cms-reset" title="Khôi phục mặc định" onClick={() => resetSection(section.key)}><RotateCcw size={13} /></button>}
                        </span>
                    ))}
                </div>
            )}
            <ManagedSection content={content.intro} className="cms-intro-section" />
            {cloneElement(children, { siteContent: content })}
            <ManagedSection content={content.cta} className="cms-cta-section" />
            {editing && editingConfig?.type === 'list' && (
                <ListSectionEditor
                    page={page}
                    config={editingConfig}
                    initial={content[editing]}
                    onSaved={(section, value) => setContent(prev => ({ ...prev, [section]: value }))}
                    onClose={() => setEditing('')}
                />
            )}
            {editing && editingConfig?.type === 'object' && (
                <ObjectSectionEditor
                    page={page}
                    config={editingConfig}
                    initial={content[editing]}
                    onSaved={(section, value) => setContent(prev => ({ ...prev, [section]: value }))}
                    onClose={() => setEditing('')}
                />
            )}
            {editing && !editingConfig && (
                <ContentEditor
                    page={page}
                    section={editing}
                    initial={content[editing]}
                    onSaved={(section, value) => setContent(prev => ({ ...prev, [section]: value }))}
                    onClose={() => setEditing('')}
                />
            )}
        </>
    )
}
