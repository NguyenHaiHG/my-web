import { useState } from 'react'
import { Routes, Route, NavLink, Link, useNavigate } from 'react-router-dom'
import {
  User, LogOut, Menu, X,
  Upload, Plus, LayoutDashboard, WifiOff
} from 'lucide-react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DataProvider, useData } from './context/DataContext'
import { UIProvider, useUI } from './context/UIContext'
import { LanguageProvider, useLang } from './context/LanguageContext'
import { OrderProvider } from './context/OrderContext'
import HomePage from './pages/HomePage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import ContactPage from './pages/ContactPage'
import CommunityPage from './pages/CommunityPage'
import WorkshopPage from './pages/WorkshopPage'
import LibraryPage from './pages/LibraryPage'
import VolunteerPage from './pages/VolunteerPage'
import DashboardPage from './pages/DashboardPage'
import ProductsPage from './pages/ProductsPage'
import ToursPage from './pages/ToursPage'
import ManageCartPage from './pages/ManageCartPage'
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
  const [form, setForm] = useState({ title: '', content: '', img: '', author: '', desc: '', price: '', time: '', date: '' })
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
      if (type === 'workshop') { payload.status = 'upcoming'; payload.isFree = true }
      await addItem(type, payload)
      setAdminModal(null)
      setForm({ title: '', content: '', img: '', author: '', desc: '', price: '', time: '', date: '' })
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
            <div className="form-2col">
              <input className="form-input" placeholder="Ngày diễn ra" value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })} />
              <input className="form-input" placeholder="Giờ (VD: 08:00–11:00)" value={form.time}
                onChange={e => setForm({ ...form, time: e.target.value })} />
            </div>
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
   HEADER
────────────────────────────────────────────────────── */
function Header() {
  const { user, logout, isMod } = useAuth()
  const { setShowLogin } = useUI()
  const { lang, t, toggleLang } = useLang()
  const { offline } = useData()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const links = [
    { to: '/cong-dong', label: t('nav_du_an') },
    { to: '/workshop', label: '🎓 Workshop' },
    { to: '/thu-vien', label: t('nav_thu_vien') },
    { to: '/tours', label: t('nav_kham_pha') },
    { to: '/san-pham', label: t('nav_san_pham') },
    { to: '/blog', label: t('nav_blog') },
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
   APP INNER
────────────────────────────────────────────────────── */
function AppInner() {
  const { toast, showLogin, adminModal } = useUI()
  const { t } = useLang()
  return (
    <div className="app">
      {toast && <div className="toast">{toast}</div>}
      {showLogin && <LoginModal />}
      {adminModal && <AdminModal />}
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cong-dong" element={<CommunityPage />} />
          <Route path="/workshop" element={<WorkshopPage />} />
          <Route path="/thu-vien" element={<LibraryPage />} />
          <Route path="/tinh-nguyen" element={<VolunteerPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/san-pham" element={<ProductsPage />} />
          <Route path="/gio-hang" element={<ManageCartPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="footer-inner">
          <p>🌿 <strong>HTX Trường Hải</strong> – Tổ 5 Quang Trung · Phường Hà Giang 2 · Tuyên Quang</p>
          <div className="footer-links">
            <a href="/cong-dong">Dự án</a>
            <a href="/workshop">Workshop</a>
            <a href="/thu-vien">Thư viện</a>
            <a href="/tinh-nguyen">Tình nguyện</a>
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
  )
}


