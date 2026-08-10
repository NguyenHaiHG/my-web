import { cloneElement, useEffect, useState } from 'react'
import { Edit3, ImagePlus, RotateCcw, Save, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { apiFetch, responseError } from '../utils/api'
import { compressImageFile, uploadImageDataUrl } from '../utils/uploadImage'

const EMPTY = { title: '', subtitle: '', body: '', image: '', buttonLabel: '', buttonHref: '' }
const SECTION_LABELS = { hero: 'Hero', intro: 'Giới thiệu', cta: 'Kêu gọi hành động' }

function ContentEditor({ page, section, initial, onSaved, onClose }) {
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

export default function PageContentShell({ page, children }) {
    const { isAdmin } = useAuth()
    const [content, setContent] = useState({})
    const [editing, setEditing] = useState('')

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/site-content/${page}`)
            .then(response => response.ok ? response.json() : {})
            .then(setContent)
            .catch(() => setContent({}))
    }, [page])

    const resetSection = async section => {
        if (!window.confirm(`Khôi phục ${SECTION_LABELS[section]} về nội dung mặc định?`)) return
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
                    {Object.keys(SECTION_LABELS).map(section => (
                        <span key={section}>
                            <button onClick={() => setEditing(section)}>{SECTION_LABELS[section]}</button>
                            {content[section] && <button className="cms-reset" title="Khôi phục mặc định" onClick={() => resetSection(section)}><RotateCcw size={13} /></button>}
                        </span>
                    ))}
                </div>
            )}
            <ManagedSection content={content.intro} className="cms-intro-section" />
            {cloneElement(children, { siteContent: content })}
            <ManagedSection content={content.cta} className="cms-cta-section" />
            {editing && (
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
