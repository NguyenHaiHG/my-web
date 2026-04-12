import { useState } from 'react'
import { Routes, Route, NavLink, Link } from 'react-router-dom'
import {
  Phone, User, LogOut, Menu, X,
  Upload, ShoppingCart, Bell, ArrowLeft, Minus, Plus
} from 'lucide-react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DataProvider, useData } from './context/DataContext'
import { UIProvider, useUI } from './context/UIContext'
import { OrderProvider, useOrder } from './context/OrderContext'
import { LanguageProvider, useLang } from './context/LanguageContext'
import HomePage from './pages/HomePage'
import ToursPage from './pages/ToursPage'
import OrderPage from './pages/OrderPage'
import ProductsPage from './pages/ProductsPage'
import BlogPage from './pages/BlogPage'
import ContactPage from './pages/ContactPage'
import ManageCartPage from './pages/ManageCartPage'
import ManageTourPage from './pages/ManageTourPage'
import ManageTaobaoPage from './pages/ManageTaobaoPage'
import './App.css'

/* ──────────────────────────────────────────────────────
   LOGIN MODAL
────────────────────────────────────────────────────── */
function LoginModal() {
  const { login, loginError, setLoginError } = useAuth()
  const { setShowLogin } = useUI()
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const close = () => { setLoginError(''); setShowLogin(false) }
  const submit = (e) => { e.preventDefault(); if (login(u, p)) close() }
  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={close}><X size={16} /></button>
        <div className="modal-logo">🏔️</div>
        <h2 className="modal-title">Đăng Nhập</h2>
        <p className="modal-hint">
          <strong>admin</strong>/admin123 &nbsp;·&nbsp;
          <strong>mod</strong>/mod123 &nbsp;·&nbsp;
          <strong>user</strong>/user123
        </p>
        <form onSubmit={submit} className="login-form">
          <input className="form-input" placeholder="Tên đăng nhập" value={u}
            onChange={e => setU(e.target.value)} required autoFocus />
          <input className="form-input" type="password" placeholder="Mật khẩu" value={p}
            onChange={e => setP(e.target.value)} required />
          {loginError && <p className="login-error">{loginError}</p>}
          <button type="submit" className="btn3d btn3d-orange btn-full">Đăng Nhập</button>
        </form>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────
   ADMIN MODAL – Thêm nội dung + Upload ảnh
────────────────────────────────────────────────────── */
function AdminModal() {
  const { adminModal: type, setAdminModal } = useUI()
  const { addItem } = useData()
  const { showToast } = useUI()
  const [form, setForm] = useState({ title: '', desc: '', price: '', content: '', img: '', author: '' })
  const [preview, setPreview] = useState('')

  const LABELS = { tour: 'Tour Du Lịch', product: 'Sản Phẩm', post: 'Bài Viết' }

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

  const submit = (e) => {
    e.preventDefault()
    addItem(type, { ...form, date: new Date().toLocaleDateString('vi-VN'), tag: type })
    setAdminModal(null)
    setForm({ title: '', desc: '', price: '', content: '', img: '', author: '' })
    setPreview('')
    showToast(`✅ Đã thêm ${LABELS[type]} thành công!`)
  }

  if (!type) return null
  return (
    <div className="modal-backdrop" onClick={() => setAdminModal(null)}>
      <div className="modal modal-large" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setAdminModal(null)}><X size={16} /></button>
        <h2 className="modal-title">➕ Thêm {LABELS[type]}</h2>
        <form onSubmit={submit} className="login-form">
          <input className="form-input" placeholder="Tiêu đề / Tên" value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })} required />

          {type !== 'post'
            ? <input className="form-input" placeholder="Mô tả ngắn" value={form.desc}
              onChange={e => setForm({ ...form, desc: e.target.value })} required />
            : <textarea className="form-input form-textarea" placeholder="Nội dung bài viết"
              value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required />
          }

          {type !== 'post' &&
            <input className="form-input" placeholder="Giá (VD: 500.000đ)" value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })} />
          }
          {type === 'post' &&
            <input className="form-input" placeholder="Tên tác giả" value={form.author}
              onChange={e => setForm({ ...form, author: e.target.value })} />
          }

          {/* IMAGE UPLOAD */}
          <div className="img-upload-area">
            <p className="img-upload-title"><Upload size={14} /> Ảnh bài đăng</p>
            <label className="img-upload-box">
              <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={handleFile} />
              {preview
                ? <div className="img-preview-wrap">
                  <img src={preview} alt="preview" className="img-preview" />
                  <div className="img-preview-overlay"><Upload size={18} /> Đổi ảnh</div>
                </div>
                : <div className="img-upload-placeholder">
                  <Upload size={32} color="#94a3b8" />
                  <span>Click để tải ảnh lên</span>
                  <small>PNG · JPG · WEBP</small>
                </div>
              }
            </label>
            <div className="img-or">— hoặc nhập URL ảnh —</div>
            <input className="form-input" placeholder="https://example.com/image.jpg"
              value={form.img} onChange={handleUrlChange} />
          </div>

          <button type="submit" className="btn3d btn3d-orange btn-full">✅ Lưu</button>
        </form>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────
   DETAIL MODAL
────────────────────────────────────────────────────── */
function DetailModal() {
  const { detailItem, setDetailItem } = useUI()
  if (!detailItem) return null
  const item = detailItem
  return (
    <div className="modal-backdrop" onClick={() => setDetailItem(null)}>
      <div className="modal modal-large" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setDetailItem(null)}><X size={16} /></button>
        {item.img && <img src={item.img} alt={item.title} className="detail-img" />}
        <h2 className="modal-title">{item.title}</h2>
        {item.price && <p className="detail-price">{item.price}</p>}
        {item.date && <p className="detail-meta">📅 {item.date}{item.author ? ` · ✍️ ${item.author}` : ''}</p>}
        <p className="detail-body">{item.desc || item.content}</p>
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <a href="tel:0385737705" className="btn3d btn3d-orange" style={{ flex: 1, textAlign: 'center' }}>
            <Phone size={15} /> Đặt / Mua Ngay
          </a>
          <button className="btn3d btn3d-blue" style={{ flex: 1 }} onClick={() => setDetailItem(null)}>
            ← Quay Lại
          </button>
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────
   CART DRAWER
────────────────────────────────────────────────────── */
function CartDrawer() {
  const { cart, removeFromCart, updateQty, clearCart, totalCount, submitCartOrder } = useOrder()
  const { showCart, setShowCart, showToast } = useUI()
  const [checkout, setCheckout] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' })
  if (!showCart) return null
  const handleSubmit = (e) => {
    e.preventDefault()
    submitCartOrder(form, cart)
    setShowCart(false); setCheckout(false)
    setForm({ name: '', phone: '', address: '', note: '' })
    showToast('✅ Đã gửi đơn! Admin/Mod sẽ liên hệ xác nhận sớm.')
  }
  return (
    <>
      <div className="cart-backdrop" onClick={() => { setShowCart(false); setCheckout(false) }} />
      <div className="cart-drawer">
        <div className="cart-header">
          <h3 className="cart-title">
            <ShoppingCart size={20} /> Giỏ Hàng
            {totalCount > 0 && <span className="cart-count-badge">{totalCount}</span>}
          </h3>
          <button className="modal-close" onClick={() => { setShowCart(false); setCheckout(false) }}><X size={16} /></button>
        </div>
        {!checkout ? (
          <>
            {cart.length === 0 ? (
              <div className="cart-empty">
                <ShoppingCart size={52} color="#cbd5e1" />
                <p>Giỏ hàng đang trống</p>
                <button className="btn3d btn3d-orange btn-sm" onClick={() => setShowCart(false)}>Mua Sắm Ngay →</button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      {item.img && <img src={item.img} alt={item.title} className="cart-item-img" />}
                      <div className="cart-item-info">
                        <strong>{item.title}</strong>
                        {item.price && <span className="cart-item-price">{item.price}</span>}
                      </div>
                      <div className="cart-qty">
                        <button onClick={() => updateQty(item.id, item.qty - 1)}><Minus size={12} /></button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)}><Plus size={12} /></button>
                      </div>
                      <button className="cart-item-del" onClick={() => removeFromCart(item.id)}><X size={13} /></button>
                    </div>
                  ))}
                </div>
                <div className="cart-footer">
                  <button className="btn-text-link" onClick={clearCart}>🗑️ Xóa tất cả</button>
                  <button className="btn3d btn3d-orange" style={{ width: '100%', marginTop: 10 }} onClick={() => setCheckout(true)}>
                    Đặt Hàng → ({totalCount} sp)
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="cart-checkout">
            <button className="btn-back" style={{ marginBottom: 16 }} onClick={() => setCheckout(false)}>
              <ArrowLeft size={15} /> Giỏ hàng
            </button>
            <h4 className="checkout-title">📋 Thông tin nhận hàng</h4>
            <form onSubmit={handleSubmit} className="login-form">
              <input className="form-input" placeholder="Họ và tên *" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input className="form-input" type="tel" placeholder="Số điện thoại *" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} required />
              <input className="form-input" placeholder="Địa chỉ nhận hàng" value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })} />
              <textarea className="form-input form-textarea" style={{ minHeight: 70 }} placeholder="Ghi chú..."
                value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
              <button type="submit" className="btn3d btn3d-orange btn-full">✅ Xác Nhận Đặt Hàng</button>
            </form>
          </div>
        )}
      </div>
    </>
  )
}

/* ──────────────────────────────────────────────────────
   NOTIFICATION PANEL
────────────────────────────────────────────────────── */
function NotifPanel({ onClose }) {
  const { notifications, unread, markRead, markAllRead } = useOrder()
  return (
    <div className="notif-panel" onClick={e => e.stopPropagation()}>
      <div className="notif-head">
        <strong>🔔 Thông báo {unread > 0 && <span className="notif-new">{unread} mới</span>}</strong>
        {unread > 0 && <button className="btn-text-link" style={{ fontSize: 12 }} onClick={markAllRead}>Đọc tất cả</button>}
      </div>
      {notifications.length === 0 ? (
        <p className="notif-empty">Chưa có thông báo nào</p>
      ) : (
        <div className="notif-list">
          {notifications.map(n => (
            <div key={n.id} className={`notif-item${n.read ? '' : ' notif-unread'}`} onClick={() => markRead(n.id)}>
              <p className="notif-msg">{n.message}</p>
              <span className="notif-time">{n.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────────────
   HEADER
────────────────────────────────────────────────────── */
function Header() {
  const { user, logout, isMod } = useAuth()
  const { setShowLogin, setShowCart } = useUI()
  const { totalCount, unread } = useOrder()
  const { lang, t, toggleLang } = useLang()
  const [open, setOpen] = useState(false)
  const [showNotif, setShowNotif] = useState(false)

  const links = [
    { to: '/', label: t('nav_home') },
    { to: '/tours', label: t('nav_tours') },
    { to: '/order', label: t('nav_order') },
    { to: '/dac-san', label: t('nav_products') },
    { to: '/blog', label: t('nav_blog') },
    { to: '/lien-he', label: t('nav_contact') },
  ]
  const mgmtLinks = [
    { to: '/quan-ly-gio-hang', label: t('nav_mgmt_cart') },
    { to: '/quan-ly-tour', label: t('nav_mgmt_tour') },
    { to: '/quan-ly-taobao', label: t('nav_mgmt_taobao') },
  ]

  return (
    <header className="header" onClick={() => setShowNotif(false)}>
      <div className="header-inner">
        <Link to="/" className="logo" onClick={() => setOpen(false)}>
          <div className="logo-top">
            <span className="logo-htm">HTM</span>
            <span className="logo-name"> TRƯỜNG HẢI</span>
          </div>
          <div className="logo-sub">Du lịch &amp; Order Quốc tế</div>
        </Link>

        <nav className={`nav ${open ? 'nav-open' : ''}`}>
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              className={({ isActive }) => isActive ? 'nav-active' : ''}
              onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          {isMod && <div className="nav-divider" />}
          {isMod && mgmtLinks.map(l => (
            <NavLink key={l.to} to={l.to}
              className={({ isActive }) => `nav-mgmt${isActive ? ' nav-active' : ''}`}
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
          <button className="header-icon-btn" onClick={() => setShowCart(true)} title="Giỏ hàng">
            <ShoppingCart size={20} />
            {totalCount > 0 && <span className="header-badge">{totalCount}</span>}
          </button>
          {isMod && (
            <div className="notif-wrap">
              <button className="header-icon-btn" title="Thông báo"
                onClick={e => { e.stopPropagation(); setShowNotif(v => !v) }}>
                <Bell size={20} />
                {unread > 0 && <span className="header-badge notif-badge">{unread}</span>}
              </button>
              {showNotif && <NotifPanel onClose={() => setShowNotif(false)} />}
            </div>
          )}
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
  const { toast, showLogin, adminModal, detailItem } = useUI()
  return (
    <div className="app">
      {toast && <div className="toast">{toast}</div>}
      {showLogin && <LoginModal />}
      {adminModal && <AdminModal />}
      {detailItem && <DetailModal />}
      <CartDrawer />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/dac-san" element={<ProductsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
          <Route path="/quan-ly-gio-hang" element={<ManageCartPage />} />
          <Route path="/quan-ly-tour" element={<ManageTourPage />} />
          <Route path="/quan-ly-taobao" element={<ManageTaobaoPage />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="footer-inner">
          <p>🏔️ <strong>HTM Trường Hải</strong> – Du lịch &amp; Order Quốc tế</p>
          <p>📞 <a href="tel:0385737705">0385.737.705</a> &nbsp;·&nbsp; © 2026</p>
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


