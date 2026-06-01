import { useState, useEffect, useRef } from 'react'
import { Upload, Save, X, ImagePlus, Sparkles, Eye } from 'lucide-react'
import { useUI } from '../context/UIContext'
import './HeroSectionEditor.css'
import cityPreset1 from '../assets/ha-giang-city-1.svg'
import cityPreset2 from '../assets/ha-giang-city-2.svg'
import cityPreset3 from '../assets/ha-giang-city-3.svg'

const PRESET_IMAGES = [
    { id: 'city1', label: 'Đêm Hà Giang', sub: 'Ánh đèn thành phố và sắc trời biên viễn', src: cityPreset1 },
    { id: 'city2', label: 'Chiều Hà Giang', sub: 'Sắc xanh đô thị và núi đá', src: cityPreset2 },
    { id: 'city3', label: 'Hoàng hôn Hà Giang', sub: 'Không khí ấm và giàu chiều sâu', src: cityPreset3 },
]

export default function HeroSectionEditor() {
    const fileInputRef = useRef(null)
    const [form, setForm] = useState({
        imageUrl: '',
        title: '',
        subtitle: '',
        titleRich: '',
        subtitleRich: '',
        buttonLabel: '🗓️ Đặt lịch',
        buttonLink: '/tours'
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [imageLabel, setImageLabel] = useState('Chưa chọn ảnh')
    const { showToast } = useUI()

    // Lấy dữ liệu hero section hiện tại
    useEffect(() => {
        fetch('/api/hero-section')
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setForm(data)
                }
                setLoading(false)
            })
            .catch(err => {
                console.error('Lỗi khi lấy hero section:', err)
                setLoading(false)
            })
    }, [])

    const handleImageUpload = (file) => {
        if (!file) return
        setImageLabel(file.name)
        const reader = new FileReader()
        reader.onload = (e) => {
            setForm(p => ({ ...p, imageUrl: e.target.result }))
        }
        reader.readAsDataURL(file)
    }

    const openFilePicker = () => {
        fileInputRef.current?.click()
    }

    const handleSave = async () => {
        if (!form.imageUrl || !form.title || !form.subtitle) {
            showToast('❌ Vui lòng nhập đầy đủ ảnh, tiêu đề và phụ đề')
            return
        }

        setSaving(true)
        try {
            const res = await fetch('/api/hero-section', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            })
            const data = await res.json()
            if (data._id || data.id) {
                showToast('✅ Cập nhật hero section thành công!')
                setForm(data)
            } else {
                showToast('❌ Cập nhật thất bại')
            }
        } catch (err) {
            console.error('Lỗi khi cập nhật:', err)
            showToast('❌ Lỗi: ' + err.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="db-loading">Đang tải...</div>

    return (
        <div className="hero-editor">
            <h2 className="db-section-title">⚙️ Chỉnh sửa Hero Section (Trang Discover)</h2>
            <p className="db-section-desc" style={{ marginBottom: 24 }}>
                Tải ảnh Hà Giang thành phố lên, rồi chỉnh tiêu đề, phụ đề và nút booking cho phần đầu trang Discover.
            </p>

            <div className="hero-editor-grid">
                {/* Upload ảnh */}
                <div className="hero-upload-card db-form-group">
                    <div className="hero-upload-header">
                        <div>
                            <label className="db-form-label">📷 Ảnh nền Hà Giang thành phố</label>
                            <p className="hero-upload-note">Tải ảnh từ máy, kéo-thả hoặc chọn nhanh một ảnh đã chụp ở Hà Giang.</p>
                        </div>
                        <span className="hero-upload-badge"><ImagePlus size={14} /> Upload từ máy</span>
                    </div>

                    <div className="hero-dropzone"
                        onClick={openFilePicker}
                        onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('is-dragging') }}
                        onDragLeave={e => { e.currentTarget.classList.remove('is-dragging') }}
                        onDrop={e => {
                            e.preventDefault()
                            e.currentTarget.classList.remove('is-dragging')
                            const file = e.dataTransfer.files[0]
                            if (file) handleImageUpload(file)
                        }}
                    >
                        {form.imageUrl ? (
                            <div className="hero-dropzone-preview">
                                <img src={form.imageUrl} alt="Preview" />
                                <div className="hero-dropzone-overlay">
                                    <span><Eye size={15} /> Xem trước ảnh đã tải</span>
                                </div>
                            </div>
                        ) : (
                            <div className="hero-dropzone-empty">
                                <div className="hero-dropzone-icon"><Upload size={30} /></div>
                                <strong>Kéo ảnh Hà Giang thành phố vào đây</strong>
                                <p>Hoặc bấm để chọn ảnh PNG/JPG từ máy tính.</p>
                            </div>
                        )}
                    </div>
                    <div className="hero-preset-block">
                        <div className="hero-preset-head">
                            <span className="hero-preset-title">Ảnh mẫu Hà Giang thành phố</span>
                            <span className="hero-preset-hint">Chọn nhanh hoặc vẫn upload ảnh riêng của bạn.</span>
                        </div>
                        <div className="hero-preset-grid">
                            {PRESET_IMAGES.map(preset => (
                                <button
                                    key={preset.id}
                                    type="button"
                                    className={`hero-preset-card ${form.imageUrl === preset.src ? 'is-active' : ''}`}
                                    onClick={() => {
                                        setForm(p => ({ ...p, imageUrl: preset.src }))
                                        setImageLabel(preset.label)
                                    }}
                                >
                                    <img src={preset.src} alt={preset.label} />
                                    <span className="hero-preset-card-title">{preset.label}</span>
                                    <span className="hero-preset-card-sub">{preset.sub}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        id="hero-img-input"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={e => handleImageUpload(e.target.files[0])}
                    />
                    <div className="hero-upload-footer">
                        <div className="hero-upload-file">{imageLabel}</div>
                        <div className="hero-upload-actions">
                            <button className="btn-small" type="button" onClick={openFilePicker}>
                                <Upload size={14} /> Đổi ảnh
                            </button>
                            {form.imageUrl && (
                                <button className="btn-small hero-upload-delete" type="button"
                                    onClick={() => { setForm(p => ({ ...p, imageUrl: '' })); setImageLabel('Chưa chọn ảnh') }}>
                                    <X size={14} /> Xóa ảnh
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Preview */}
                <div className="hero-preview-card db-form-group">
                    <label className="db-form-label">👁️ Xem trước</label>
                    <div className="hero-preview-shell" style={{ backgroundImage: 'url(' + (form.imageUrl || '') + ')' }}>
                        <div className="hero-preview-overlay">
                            <div className="hero-preview-kicker"><Sparkles size={14} /> Hero hiện tại</div>
                            <h3>{form.title || 'Hà Giang thành phố'}</h3>
                            <p>{form.subtitle || 'Ảnh, tiêu đề và phụ đề sẽ hiển thị như ngoài trang Discover.'}</p>
                            <div className="hero-preview-chip-row">
                                <span className="hero-preview-chip">📍 Hà Giang</span>
                                <span className="hero-preview-chip">🖼️ Upload từ admin</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form chỉnh sửa */}
            <div className="db-form-group">
                <label className="db-form-label">📝 Tiêu đề (Title)</label>
                <input
                    type="text"
                    className="form-input"
                    placeholder="Tiêu đề chính"
                    value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                />
            </div>

            <div className="db-form-group">
                <label className="db-form-label">📋 Phụ đề (Subtitle)</label>
                <textarea
                    className="form-input form-textarea"
                    placeholder="Phụ đề mô tả"
                    rows="3"
                    value={form.subtitle}
                    onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="db-form-group">
                    <label className="db-form-label">🔘 Văn bản nút (Button Label)</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Ví dụ: 🗓️ Đặt lịch"
                        value={form.buttonLabel}
                        onChange={e => setForm(p => ({ ...p, buttonLabel: e.target.value }))}
                    />
                </div>

                <div className="db-form-group">
                    <label className="db-form-label">🔗 Link nút (Button Link)</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Ví dụ: /tours, /book, /contact"
                        value={form.buttonLink}
                        onChange={e => setForm(p => ({ ...p, buttonLink: e.target.value }))}
                    />
                </div>
            </div>

            <div className="db-form-group">
                <label className="db-form-label">✏️ Rich Text Tiêu đề (Tùy chọn - HTML/Markdown)</label>
                <textarea
                    className="form-input form-textarea"
                    placeholder="Ví dụ: <b>Hà Giang</b> <i>Loop</i> hoặc **Hà Giang** *Loop*"
                    rows="2"
                    value={form.titleRich}
                    onChange={e => setForm(p => ({ ...p, titleRich: e.target.value }))}
                />
            </div>

            <div className="db-form-group">
                <label className="db-form-label">✏️ Rich Text Phụ đề (Tùy chọn - HTML/Markdown)</label>
                <textarea
                    className="form-input form-textarea"
                    placeholder="Ví dụ: Cao nguyên đá <strong>hùng vĩ</strong>"
                    rows="2"
                    value={form.subtitleRich}
                    onChange={e => setForm(p => ({ ...p, subtitleRich: e.target.value }))}
                />
            </div>

            <div className="db-form-actions">
                <button className="btn3d btn3d-green" onClick={handleSave} disabled={saving}>
                    <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
            </div>
        </div>
    )
}
