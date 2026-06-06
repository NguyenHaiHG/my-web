import { useState } from 'react'
import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom'
import {
  User, LogOut, Menu, X, MessageCircle, House, BookOpen, Phone,
  Upload, Plus, LayoutDashboard, WifiOff, Save, GraduationCap, Map, Leaf, MoreHorizontal
} from 'lucide-react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DataProvider, useData } from './context/DataContext'
import { UIProvider, useUI } from './context/UIContext'
import { LanguageProvider, useLang } from './context/LanguageContext'
import { OrderProvider } from './context/OrderContext'
import { PassportProvider, usePassport } from './context/PassportContext'
import PassportPage from './pages/PassportPage'
import HomePage from './pages/HomePage'
import ContactPage from './pages/ContactPage'
import DashboardPage from './pages/DashboardPage'
import WorkshopPage from './pages/WorkshopPage'
import HaGiangLoopPage from './pages/HaGiangLoopPage'
import VerifyCertificatePage from './pages/VerifyCertificatePage'
import NatureMemoryPage from './pages/NatureMemoryPage'
import LibraryPage from './pages/LibraryPage'
import './App.css'

/* ──────────────────────────────────────────────────────
   LOGIN MODAL
────────────────────────────────────────────────────── */
function LoginModal() {
  const { login, loginError, setLoginError } = useAuth()
  const { setShowLogin } = useUI()
  const { t } = useLang()
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const close = () => { setLoginError(''); setShowLogin(false) }
  const submit = (e) => { e.preventDefault(); if (login(u, p)) close() }

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={close}><X size={16} /></button>
        <div className="modal-logo">🏔️</div>
        <h2 className="modal-title">{t('login_title')}</h2>

        <form onSubmit={submit} className="login-form">
          <input className="form-input" placeholder={t('login_username_ph')} value={u}
            onChange={e => setU(e.target.value)} required autoFocus />
          <input className="form-input" type="password" placeholder={t('login_password_ph')} value={p}
            onChange={e => setP(e.target.value)} required />
          {loginError && <p className="login-error">{loginError}</p>}
          <button type="submit" className="btn3d btn3d-orange btn-full">{t('login_btn')}</button>
        </form>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────
   ADMIN MODAL – Thêm nội dung
────────────────────────────────────────────────────── */
/* Nén ảnh bằng Canvas trước khi base64 — tránh vượt giới hạn 10MB */
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

function AdminModal() {
  const { adminModal: type, setAdminModal } = useUI()
  const { addItem } = useData()
  const { showToast } = useUI()
  const { t } = useLang()
  const [form, setForm] = useState({ title: '', content: '', img: '', author: '', desc: '', price: '', time: '', date: '', category: '', capacity: '', instructor: '', isFree: true })
  const [preview, setPreview] = useState('')

  const labelKey = { post: 'Bài viết', product: 'Sản phẩm', tour: 'Discover', workshop: 'Workshop', library: 'Thư viện' }

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 20 * 1024 * 1024) { showToast('❌ Ảnh quá lớn (tối đa 20MB)'); return }
    try {
      const compressed = await compressImage(file)
      setPreview(compressed)
      setForm(f => ({ ...f, img: compressed }))
    } catch {
      showToast('❌ Không đọc được ảnh, thử file khác')
    }
  }

  const handleUrlChange = (e) => {
    setForm(f => ({ ...f, img: e.target.value }))
    setPreview(e.target.value)
  }

  const submit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form, tag: type }
      if (!payload.date) payload.date = new Date().toLocaleDateString('vi-VN')
      if (type === 'workshop') { payload.status = 'upcoming' }
      // Strip empty strings so Mongoose uses model defaults (avoids enum validation errors)
      Object.keys(payload).forEach(k => { if (payload[k] === '') delete payload[k] })
      await addItem(type, payload)
      setAdminModal(null)
      setForm({ title: '', content: '', img: '', author: '', desc: '', price: '', time: '', date: '', category: '', capacity: '', instructor: '', isFree: true })
      setPreview('')
      showToast(`✅ Đã thêm ${labelKey[type] || type} thành công!`)
    } catch (err) {
      showToast('❌ Lỗi: ' + (err.message || 'Không thể lưu, thử lại!'))
    }
  }

  if (!type) return null
  return (
    <div className="modal-backdrop" onClick={() => setAdminModal(null)}>
      <div className="modal modal-large" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setAdminModal(null)}><X size={16} /></button>
        <h2 className="modal-title">➕ Thêm {labelKey[type] || type}</h2>
        <form onSubmit={submit} className="login-form">
          <input className="form-input" placeholder={t('admin_title_ph')} value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })} required />
          {(type === 'post' || type === 'workshop' || type === 'library') && (
            <textarea className="form-input form-textarea" placeholder={t('admin_content_ph')}
              value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
          )}
          {(type === 'product' || type === 'tour') && (
            <>
              <textarea className="form-input form-textarea" placeholder="Mô tả ngắn"
                value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} />
              <input className="form-input" placeholder="Giá (VD: 500.000đ)" value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })} />
            </>
          )}
          {type === 'workshop' && (
            <>
              <textarea className="form-input form-textarea" placeholder="Mô tả ngắn về workshop"
                value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} />
              <div className="form-2col">
                <select className="form-input" value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="">— Loại workshop —</option>
                  <option value="embroidery">🌺 Thêu thùa</option>
                  <option value="sewing">🧵 May vá</option>
                  <option value="cooking">🍜 Nấu ăn bản địa</option>
                  <option value="digital">💻 Kỹ năng số</option>
                  <option value="english">📚 Tiếng Anh</option>
                  <option value="other">🌿 Khác</option>
                </select>
                <input className="form-input" type="number" placeholder="Sức chứa (người)"
                  value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} />
              </div>
              <input className="form-input" placeholder="Giảng viên / Nghệ nhân"
                value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} />
              <div className="form-2col">
                <input className="form-input" placeholder="Ngày diễn ra"
                  value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                <input className="form-input" placeholder="Giờ (VD: 08:00–11:00)"
                  value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 14 }}>
                  <input type="checkbox" checked={form.isFree}
                    onChange={e => setForm({ ...form, isFree: e.target.checked })} />
                  Miễn phí
                </label>
                {!form.isFree && (
                  <input className="form-input" placeholder="Giá (VD: 150.000đ)"
                    value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                    style={{ flex: 1, minWidth: 140 }} />
                )}
              </div>
            </>
          )}
          {type === 'post' && (
            <input className="form-input" placeholder={t('admin_author_ph')} value={form.author}
              onChange={e => setForm({ ...form, author: e.target.value })} />
          )}

          {/* IMAGE UPLOAD */}
          <div className="img-upload-area">
            <p className="img-upload-title"><Upload size={14} /> {t('admin_img_label')}</p>
            <label className="img-upload-box">
              <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={handleFile} />
              {preview
                ? <div className="img-preview-wrap">
                  <img src={preview} alt="preview" className="img-preview" />
                  <div className="img-preview-overlay"><Upload size={18} /> {t('admin_change_img')}</div>
                </div>
                : <div className="img-upload-placeholder">
                  <Upload size={32} color="#94a3b8" />
                  <span>{t('admin_img_click')}</span>
                  <small>PNG · JPG · WEBP</small>
                </div>
              }
            </label>
            <div className="img-or">{t('admin_img_or')}</div>
            <input className="form-input" placeholder="https://example.com/image.jpg"
              value={form.img} onChange={handleUrlChange} />
          </div>

          <button type="submit" className="btn3d btn3d-orange btn-full">{t('admin_save_btn')}</button>
        </form>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────
   EDIT MODAL – Sửa nội dung (global, dùng ở mọi trang)
────────────────────────────────────────────────────── */
const EDIT_FIELDS = {
  post: ['title', 'content', 'author', 'img'],
  product: ['title', 'desc', 'price', 'img'],
  tour: ['title', 'desc', 'price', 'duration', 'img'],
  workshop: ['title', 'content', 'date', 'time', 'category', 'capacity', 'status', 'instructor', 'img'],
  library: ['title', 'content', 'category', 'ethnic', 'pronunciation', 'translation', 'img'],
  review: ['name', 'country', 'rating', 'content'],
}
const EDIT_META = {
  title: { label: 'Tiêu đề', type: 'text', required: true },
  content: { label: 'Nội dung', type: 'textarea' },
  desc: { label: 'Mô tả', type: 'textarea' },
  author: { label: 'Tác giả', type: 'text' },
  date: { label: 'Ngày', type: 'text' },
  time: { label: 'Giờ', type: 'text' },
  category: { label: 'Danh mục', type: 'text' },
  capacity: { label: 'Sức chứa', type: 'number' },
  status: { label: 'Trạng thái', type: 'text' },
  instructor: { label: 'Giảng viên', type: 'text' },
  ethnic: { label: 'Dân tộc', type: 'text' },
  pronunciation: { label: 'Phát âm', type: 'text' },
  translation: { label: 'Dịch nghĩa', type: 'text' },
  price: { label: 'Giá', type: 'text' },
  duration: { label: 'Thời gian', type: 'text' },
  name: { label: 'Tên', type: 'text' },
  country: { label: 'Quốc gia', type: 'text' },
  rating: { label: 'Đánh giá (1–5)', type: 'number' },
  img: { label: 'Ảnh', type: 'image' },
}
const EDIT_LABEL = { post: 'Bài viết', product: 'Sản phẩm', tour: 'Discover', workshop: 'Workshop', library: 'Thư viện', review: 'Review' }

function EditModal() {
  const { editItem, setEditItem, showToast } = useUI()
  const { updateItem } = useData()
  const { type, item } = editItem
  const fields = EDIT_FIELDS[type] || Object.keys(item).filter(k => k !== 'id' && k !== '_id')
  const [form, setForm] = useState(() => {
    const f = {}; fields.forEach(k => { f[k] = item[k] ?? '' }); return f
  })
  const [preview, setPreview] = useState(item.img || '')
  const [saving, setSaving] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 20 * 1024 * 1024) { showToast('❌ Ảnh quá lớn (tối đa 20MB)'); return }
    try {
      const compressed = await compressImage(file)
      setPreview(compressed)
      setForm(f => ({ ...f, img: compressed }))
    } catch { showToast('❌ Không đọc được ảnh, thử file khác') }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateItem(type, item.id, form)
      showToast(`✅ Đã lưu ${EDIT_LABEL[type] || type}!`)
      setEditItem(null)
    } catch (err) {
      showToast('❌ Lỗi: ' + (err?.message || 'Không lưu được'))
    }
    setSaving(false)
  }

  return (
    <div className="modal-backdrop" onClick={() => setEditItem(null)}>
      <div className="modal modal-large edit-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setEditItem(null)}><X size={16} /></button>
        <h2 className="modal-title">✏️ Chỉnh sửa {EDIT_LABEL[type] || type}</h2>
        <form onSubmit={handleSubmit} className="login-form">
          {fields.map(key => {
            const meta = EDIT_META[key] || { label: key, type: 'text' }
            if (meta.type === 'image') return (
              <div key={key} className="img-upload-area">
                <p className="img-upload-title"><Upload size={14} /> Ảnh</p>
                {preview && (
                  <div className="edit-img-current">
                    <img src={preview} alt="preview" />
                    <button type="button" className="edit-img-remove"
                      onClick={() => { setPreview(''); setForm(f => ({ ...f, img: '' })) }}>
                      <X size={12} /> Xoá ảnh
                    </button>
                  </div>
                )}
                <label className="img-upload-box">
                  <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={handleFile} />
                  <div className="img-upload-placeholder" style={{ padding: '14px' }}>
                    <Upload size={22} color="#94a3b8" />
                    <span style={{ fontSize: 13 }}>{preview ? 'Thay ảnh mới' : 'Tải ảnh lên'}</span>
                    <small>PNG · JPG · WEBP</small>
                  </div>
                </label>
                <div className="img-or">hoặc dán URL</div>
                <input className="form-input" placeholder="https://…" value={form.img}
                  onChange={e => { setForm(f => ({ ...f, img: e.target.value })); setPreview(e.target.value) }} />
              </div>
            )
            if (meta.type === 'textarea') return (
              <div key={key}>
                <label className="edit-field-label">{meta.label}</label>
                <textarea className="form-input form-textarea" value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
              </div>
            )
            return (
              <div key={key}>
                <label className="edit-field-label">{meta.label}</label>
                <input className="form-input" type={meta.type || 'text'} required={!!meta.required}
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
              </div>
            )
          })}
          <button type="submit" className="btn3d btn3d-green btn-full" disabled={saving}>
            <Save size={15} /> {saving ? 'Đang lưu…' : 'Lưu thay đổi'}
          </button>
        </form>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────
   HEADER
────────────────────────────────────────────────────── */
function Header() {
  const { user, logout, isMod } = useAuth()
  const { setShowLogin } = useUI()
  const { lang, t, toggleLang } = useLang()
  const { offline } = useData()
  const [open, setOpen] = useState(false)

  const links = [
    { to: '/workshop', label: 'Workshop' },
    { to: '/lien-he', label: t('nav_contact') },
  ]

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo" onClick={() => setOpen(false)}>
          <div className="logo-top">
            <span className="logo-htm">HTX</span>
            <span className="logo-name"> TRƯỜNG HẢI</span>
          </div>
          <div className="logo-sub">{t('logo_sub')}</div>
        </Link>

        <nav className={`nav ${open ? 'nav-open' : ''}`}>
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              className={({ isActive }) => isActive ? 'nav-active' : ''}
              onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          {user ? (
            <div className="nav-user">
              <span className={`role-badge role-${user.role}`}>{user.role.toUpperCase()}</span>
              <span className="nav-username">{user.name}</span>
              {isMod && (
                <NavLink to="/dashboard" className={({ isActive }) => `nav-dashboard ${isActive ? 'nav-active' : ''}`}
                  onClick={() => setOpen(false)}>
                  <LayoutDashboard size={14} /> Dashboard
                </NavLink>
              )}
              <button className="btn-logout" onClick={logout}><LogOut size={12} /> {t('btn_logout')}</button>
            </div>
          ) : null}
        </nav>

        <div className="header-actions">
          {offline && (
            <span className="offline-badge" title="Backend không kết nối — đang lưu dữ liệu local">
              <WifiOff size={13} /> Local
            </span>
          )}
          <a href="https://zalo.me/0385737705" target="_blank" rel="noreferrer"
            className="btn-contact-header" title="Liên hệ Zalo">
            <Phone size={13} /> Liên hệ
          </a>
          <PassportBtn />
          <button className="lang-toggle" onClick={toggleLang} title={lang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}>
            {lang === 'vi' ? '🇺🇸 EN' : '🇻🇳 VI'}
          </button>
          {!user && (
            <button className="btn-login-nav" onClick={() => setShowLogin(true)}>
              <User size={14} /> {t('btn_login')}
            </button>
          )}
          <button className="hamburger" onClick={() => setOpen(o => !o)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  )
}

/* ──────────────────────────────────────────────────────
   PASSPORT HEADER BUTTON
────────────────────────────────────────────────────── */
function PassportBtn() {
  const { passport } = usePassport()
  const count = passport.stamps.length
  return (
    <Link to="/ho-chieu" className="pp-header-btn" title="Hộ chiếu trải nghiệm Hà Giang">
      🌸
      {count > 0 && <span className="pp-header-count">{count}</span>}
    </Link>
  )
}

/* ──────────────────────────────────────────────────────
   FLOATING CONTACT
────────────────────────────────────────────────────── */
function FloatingContact() {
  const [open, setOpen] = useState(false)
  const CONTACTS = [
    {
      href: 'https://wa.me/84385737705', label: 'WhatsApp', sub: '+84 385 737 705', cls: 'float-btn-wa',
      icon: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
    },
    {
      href: 'https://zalo.me/0385737705', label: 'Zalo', sub: '0385.737.705', cls: 'float-btn-zalo',
      icon: <span className="float-z">Z</span>
    },
    {
      href: 'https://zalo.me/0832311689', label: 'Zalo', sub: '0832.311.689', cls: 'float-btn-zalo',
      icon: <span className="float-z">Z</span>
    },
  ]
  return (
    <div className={`float-contact${open ? ' float-open' : ''}`}>
      <div className="float-options">
        {CONTACTS.map(c => (
          c.internal ? (
            <Link key={c.href} to={c.href} className={`float-btn ${c.cls}`} onClick={() => setOpen(false)}>
              <span className="float-btn-icon">{c.icon}</span>
              <span className="float-btn-text">
                <strong>{c.label}</strong>
                <span>{c.sub}</span>
              </span>
            </Link>
          ) : (
            <a key={c.href} href={c.href} target="_blank" rel="noreferrer" className={`float-btn ${c.cls}`} onClick={() => setOpen(false)}>
              <span className="float-btn-icon">{c.icon}</span>
              <span className="float-btn-text">
                <strong>{c.label}</strong>
                <span>{c.sub}</span>
              </span>
            </a>
          )
        ))}
      </div>
      <button className="float-main" onClick={() => setOpen(o => !o)} aria-label="Liên hệ">
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  )
}

function SOSButton() {
  const [open, setOpen] = useState(false)
  const contacts = [
    { label: '🚨 Công an', number: '113', desc: 'Police / Cảnh sát' },
    { label: '🚑 Cấp cứu', number: '115', desc: 'Ambulance / Y tế' },
    { label: '🏠 HTX Trường Hải', number: '0385737705', desc: 'Hỗ trợ phụ nữ & du khách' },
    { label: '📞 Hỗ trợ khác', number: '0832311689', desc: 'Support line 2' },
  ]
  return (
    <>
      {open && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
          zIndex: 9998, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start',
          padding: '0 0 90px 16px',
        }} onClick={() => setOpen(false)}>
          <div style={{
            background: '#fff', borderRadius: 18, padding: 20, minWidth: 270,
            boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 22 }}>🆘</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: '#dc2626' }}>Hỗ trợ khẩn cấp</div>
                <div style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic' }}>Emergency support for women & travellers</div>
              </div>
            </div>
            {contacts.map(c => (
              <a key={c.number} href={`tel:${c.number}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 12, marginBottom: 8,
                  background: '#fef2f2', border: '1.5px solid #fecaca',
                  textDecoration: 'none', color: '#0f172a',
                  transition: 'background 0.15s',
                }}
                onClick={() => setOpen(false)}>
                <span style={{ fontSize: 22, lineHeight: 1 }}>{c.label.split(' ')[0]}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{c.label.slice(c.label.indexOf(' ') + 1)}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{c.desc}</div>
                </div>
                <span style={{ fontWeight: 800, fontSize: 15, color: '#dc2626', letterSpacing: 0.5 }}>{c.number}</span>
              </a>
            ))}
            <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', margin: '8px 0 0', fontStyle: 'italic' }}>
              Bạn không đơn độc — chúng tôi luôn ở đây hỗ trợ.<br />You are not alone — we are here to help.
            </p>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="SOS khẩn cấp"
        style={{
          position: 'fixed', bottom: 90, left: 16, zIndex: 9997,
          width: 52, height: 52, borderRadius: '50%',
          background: open ? '#dc2626' : 'linear-gradient(135deg,#dc2626,#991b1b)',
          color: '#fff', border: '3px solid #fff',
          boxShadow: '0 4px 18px rgba(220,38,38,0.55)',
          cursor: 'pointer', fontWeight: 900, fontSize: 13, letterSpacing: 0.5,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: open ? 'none' : 'sos-pulse 2s infinite',
        }}
      >
        {open ? <X size={20} /> : 'SOS'}
      </button>
    </>
  )
}

function MobileAppDock() {
  const { pathname } = useLocation()
  const [showMore, setShowMore] = useState(false)
  if (pathname === '/dashboard') return null

  const mainItems = [
    { to: '/', label: 'Home', icon: <House size={18} />, match: p => p === '/' },
    { to: '/workshop', label: 'Workshop', icon: <GraduationCap size={18} />, match: p => p === '/workshop' },
    { to: '/ha-giang-loop', label: 'Loop Tour', icon: <Map size={18} />, match: p => p === '/ha-giang-loop' },
    { to: '/ho-chieu', label: 'Passport', icon: <BookOpen size={18} />, match: p => p === '/ho-chieu' },
  ]

  const moreItems = [
    { to: '/thu-vien', label: 'Thư viện', icon: <BookOpen size={18} /> },
    { to: '/nhat-ky-thien-nhien', label: 'Nhật Ký TN', icon: <Leaf size={18} /> },
    { to: '/lien-he', label: 'Liên hệ', icon: <Phone size={18} /> },
  ]

  const isMoreActive = moreItems.some(i => i.to === pathname)

  return (
    <>
      {showMore && (
        <div className="app-dock-more-menu" onClick={() => setShowMore(false)}>
          {moreItems.map(item => (
            <Link key={item.to} to={item.to} className={`app-dock-more-item${pathname === item.to ? ' is-active' : ''}`}
              onClick={() => setShowMore(false)}>
              {item.icon} <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
      <nav className="app-dock" aria-label="App navigation">
        {mainItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={`app-dock-item ${item.match(pathname) ? 'is-active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
        <button
          className={`app-dock-item${isMoreActive ? ' is-active' : ''}`}
          onClick={() => setShowMore(s => !s)}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <MoreHorizontal size={18} />
          <span>Thêm</span>
        </button>
      </nav>
    </>
  )
}

/* ──────────────────────────────────────────────────────
   APP INNER
────────────────────────────────────────────────────── */
function AppInner() {
  const { toast, showLogin, adminModal, editItem } = useUI()
  const { t } = useLang()
  return (
    <div className="app app-shell">
      {toast && <div className="toast">{toast}</div>}
      {showLogin && <LoginModal />}
      {adminModal && <AdminModal />}
      {editItem && <EditModal />}
      <FloatingContact />
      <SOSButton />
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ho-chieu" element={<PassportPage />} />
          <Route path="/workshop" element={<WorkshopPage />} />
          <Route path="/ha-giang-loop" element={<HaGiangLoopPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/verify/:certCode" element={<VerifyCertificatePage />} />
          <Route path="/nhat-ky-thien-nhien" element={<NatureMemoryPage />} />
          <Route path="/thu-vien" element={<LibraryPage />} />
        </Routes>
      </main>
      <MobileAppDock />
      <footer className="footer app-footer">
        <div className="footer-inner">
          <p>🌿 <strong>HTX Trường Hải</strong> – Tổ 5 Quang Trung · Phường Hà Giang 2 · Tuyên Quang</p>
          <div className="footer-links">
            <a href="/workshop">Workshop</a>
            <a href="/ha-giang-loop">Loop Tour</a>
            <a href="/ho-chieu">Hộ chiếu</a>
            <a href="/thu-vien">Thư viện</a>
            <a href="/nhat-ky-thien-nhien">Nhật Ký TN</a>
            <a href="/lien-he">Liên hệ</a>
          </div>
          <p>📞 <a href="tel:0385737705">0385.737.705</a> &nbsp;·&nbsp; <a href="https://wa.me/84385737705" target="_blank" rel="noreferrer">💬 WhatsApp</a> &nbsp;·&nbsp; {t('footer_copy')}</p>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <PassportProvider>
      <LanguageProvider>
        <AuthProvider>
          <DataProvider>
            <UIProvider>
              <OrderProvider>
                <AppInner />
              </OrderProvider>
            </UIProvider>
          </DataProvider>
        </AuthProvider>
      </LanguageProvider>
    </PassportProvider>
  )
}


