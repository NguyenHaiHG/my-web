import { useState } from 'react'
import { Routes, Route, NavLink, Link } from 'react-router-dom'
import {
  User, LogOut, Menu, X,
  Upload, Plus
} from 'lucide-react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DataProvider, useData } from './context/DataContext'
import { UIProvider, useUI } from './context/UIContext'
import { LanguageProvider, useLang } from './context/LanguageContext'
import HomePage from './pages/HomePage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import ContactPage from './pages/ContactPage'
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
        <p className="modal-hint">
          <strong>admin</strong>/admin123 &nbsp;·&nbsp;
          <strong>mod</strong>/mod123 &nbsp;·&nbsp;
          <strong>user</strong>/user123
        </p>
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
   ADMIN MODAL – Thêm bài viết
────────────────────────────────────────────────────── */
function AdminModal() {
  const { adminModal: type, setAdminModal } = useUI()
  const { addItem } = useData()
  const { showToast } = useUI()
  const { t } = useLang()
  const [form, setForm] = useState({ title: '', content: '', img: '', author: '' })
  const [preview, setPreview] = useState('')

  const labelKey = { post: 'admin_type_post' }

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPreview(ev.target.result)
      setForm(f => ({ ...f, img: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleUrlChange = (e) => {
    setForm(f => ({ ...f, img: e.target.value }))
    setPreview(e.target.value)
  }

  const submit = async (e) => {
    e.preventDefault()
    try {
      await addItem(type, { ...form, date: new Date().toLocaleDateString('vi-VN'), tag: type })
      setAdminModal(null)
      setForm({ title: '', content: '', img: '', author: '' })
      setPreview('')
      showToast(t('admin_success').replace('{type}', t(labelKey[type] || type)))
    } catch (err) {
      showToast('❌ Lỗi: ' + (err.message || 'Không thể lưu, thử lại!'))
    }
  }

  if (!type) return null
  return (
    <div className="modal-backdrop" onClick={() => setAdminModal(null)}>
      <div className="modal modal-large" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setAdminModal(null)}><X size={16} /></button>
        <h2 className="modal-title">{t('admin_add')} {t(labelKey[type])}</h2>
        <form onSubmit={submit} className="login-form">
          <input className="form-input" placeholder={t('admin_title_ph')} value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })} required />
          <textarea className="form-input form-textarea" placeholder={t('admin_content_ph')}
            value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required />
          <input className="form-input" placeholder={t('admin_author_ph')} value={form.author}
            onChange={e => setForm({ ...form, author: e.target.value })} />

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
  const { user, logout } = useAuth()
  const { setShowLogin } = useUI()
  const { lang, t, toggleLang } = useLang()
  const [open, setOpen] = useState(false)

  const links = [
    { to: '/', label: t('nav_home') },
    { to: '/blog', label: t('nav_blog') },
    { to: '/lien-he', label: t('nav_contact') },
  ]

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo" onClick={() => setOpen(false)}>
          <div className="logo-top">
            <span className="logo-htm">HTM</span>
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
              <button className="btn-logout" onClick={logout}><LogOut size={12} /> {t('btn_logout')}</button>
            </div>
          ) : null}
        </nav>

        <div className="header-actions">
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
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="footer-inner">
          <p>📝 <strong>HTM Trường Hải</strong> – {t('logo_sub')}</p>
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
            <AppInner />
          </UIProvider>
        </DataProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}


