import { useState } from 'react'
import { Routes, Route, NavLink, Link } from 'react-router-dom'
import {
  Phone, User, LogOut, Menu, X,
  Upload, ShoppingCart, Bell, ArrowLeft, Minus, Plus, Edit2
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
   ADMIN MODAL – Thêm nội dung + Upload ảnh
────────────────────────────────────────────────────── */
function AdminModal() {
  const { adminModal: type, setAdminModal } = useUI()
  const { addItem } = useData()
  const { showToast } = useUI()
  const { t } = useLang()
  const [form, setForm] = useState({ title: '', desc: '', price: '', content: '', img: '', author: '' })
  const [preview, setPreview] = useState('')

  const labelKey = { tour: 'admin_type_tour', product: 'admin_type_product', post: 'admin_type_post' }

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
    showToast(t('admin_success').replace('{type}', t(labelKey[type])))
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

          {type !== 'post'
            ? <input className="form-input" placeholder={t('admin_desc_ph')} value={form.desc}
              onChange={e => setForm({ ...form, desc: e.target.value })} required />
            : <textarea className="form-input form-textarea" placeholder={t('admin_content_ph')}
              value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required />
          }

          {type !== 'post' &&
            <input className="form-input" placeholder={t('admin_price_ph')} value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })} />
          }
          {type === 'post' &&
            <input className="form-input" placeholder={t('admin_author_ph')} value={form.author}
              onChange={e => setForm({ ...form, author: e.target.value })} />
          }

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
   EDIT MODAL – Chỉnh sửa tour / sản phẩm / bài viết
────────────────────────────────────────────────────── */
function EditModal() {
  const { editItem, setEditItem } = useUI()
  const { updateItem } = useData()
  const { showToast } = useUI()
  const { t } = useLang()

  const type = editItem?.type
  const labelKey = { tour: 'admin_type_tour', product: 'admin_type_product', post: 'admin_type_post' }

  const [form, setForm] = useState(() => ({
    title: editItem?.item.title || '',
    desc: editItem?.item.desc || '',
    price: editItem?.item.price || '',
    content: editItem?.item.content || '',
    img: editItem?.item.img || '',
    author: editItem?.item.author || '',
  }))
  const [preview, setPreview] = useState(editItem?.item.img || '')

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

  const submit = (e) => {
    e.preventDefault()
    updateItem(type, editItem.item.id, form)
    setEditItem(null)
    showToast(t('admin_update_btn') + ' ' + t(labelKey[type] || type))
  }

  if (!editItem) return null
  return (
    <div className="modal-backdrop" onClick={() => setEditItem(null)}>
      <div className="modal modal-large" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setEditItem(null)}><X size={16} /></button>
        <h2 className="modal-title"><Edit2 size={16} style={{ marginRight: 6 }} />{t('admin_edit_title_prefix')} {t(labelKey[type])}</h2>
        <form onSubmit={submit} className="login-form">
          <input className="form-input" placeholder={t('admin_title_ph')} value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })} required />

          {type !== 'post'
            ? <input className="form-input" placeholder={t('admin_desc_ph')} value={form.desc}
              onChange={e => setForm({ ...form, desc: e.target.value })} />
            : <textarea className="form-input form-textarea" placeholder={t('admin_content_ph')}
              value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required />
          }

          {type !== 'post' &&
            <input className="form-input" placeholder={t('admin_price_ph')} value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })} />
          }
          {type === 'post' &&
            <input className="form-input" placeholder={t('admin_author_ph')} value={form.author}
              onChange={e => setForm({ ...form, author: e.target.value })} />
          }

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
              value={form.img} onChange={e => { setForm({ ...form, img: e.target.value }); setPreview(e.target.value) }} />
          </div>

          <button type="submit" className="btn3d btn3d-orange btn-full">{t('admin_update_btn')}</button>
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
  const { t } = useLang()
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
            <Phone size={15} /> {t('detail_book_btn')}
          </a>
          <button className="btn3d btn3d-blue" style={{ flex: 1 }} onClick={() => setDetailItem(null)}>
            {t('detail_back_btn')}
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
  const { t } = useLang()
  const [checkout, setCheckout] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' })
  if (!showCart) return null
  const handleSubmit = (e) => {
    e.preventDefault()
    submitCartOrder(form, cart)
    setShowCart(false); setCheckout(false)
    setForm({ name: '', phone: '', address: '', note: '' })
    showToast(t('cart_toast'))
  }
  return (
    <>
      <div className="cart-backdrop" onClick={() => { setShowCart(false); setCheckout(false) }} />
      <div className="cart-drawer">
        <div className="cart-header">
          <h3 className="cart-title">
            <ShoppingCart size={20} /> {t('cart_title')}
            {totalCount > 0 && <span className="cart-count-badge">{totalCount}</span>}
          </h3>
          <button className="modal-close" onClick={() => { setShowCart(false); setCheckout(false) }}><X size={16} /></button>
        </div>
        {!checkout ? (
          <>
            {cart.length === 0 ? (
              <div className="cart-empty">
                <ShoppingCart size={52} color="#cbd5e1" />
                <p>{t('cart_empty_msg')}</p>
                <button className="btn3d btn3d-orange btn-sm" onClick={() => setShowCart(false)}>{t('cart_shop_btn')}</button>
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
                  <button className="btn-text-link" onClick={clearCart}>{t('cart_clear_btn')}</button>
                  <button className="btn3d btn3d-orange" style={{ width: '100%', marginTop: 10 }} onClick={() => setCheckout(true)}>
                    {t('cart_checkout_btn')} ({totalCount} {t('cart_items_suffix')})
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="cart-checkout">
            <button className="btn-back" style={{ marginBottom: 16 }} onClick={() => setCheckout(false)}>
              <ArrowLeft size={15} /> {t('cart_back_btn')}
            </button>
            <h4 className="checkout-title">{t('cart_info_title')}</h4>
            <form onSubmit={handleSubmit} className="login-form">
              <input className="form-input" placeholder={t('cart_name_ph')} value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input className="form-input" type="tel" placeholder={t('cart_phone_ph')} value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} required />
              <input className="form-input" placeholder={t('cart_addr_ph')} value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })} />
              <textarea className="form-input form-textarea" style={{ minHeight: 70 }} placeholder={t('cart_note_ph')}
                value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
              <button type="submit" className="btn3d btn3d-orange btn-full">{t('cart_confirm_btn')}</button>
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
  const { t } = useLang()
  return (
    <div className="notif-panel" onClick={e => e.stopPropagation()}>
      <div className="notif-head">
        <strong>{t('notif_title')} {unread > 0 && <span className="notif-new">{unread} {t('notif_new_suffix')}</span>}</strong>
        {unread > 0 && <button className="btn-text-link" style={{ fontSize: 12 }} onClick={markAllRead}>{t('notif_read_all')}</button>}
      </div>
      {notifications.length === 0 ? (
        <p className="notif-empty">{t('notif_empty')}</p>
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
          <button className="header-icon-btn" onClick={() => setShowCart(true)} title={t('header_cart_title')}>
            <ShoppingCart size={20} />
            {totalCount > 0 && <span className="header-badge">{totalCount}</span>}
          </button>
          {isMod && (
            <div className="notif-wrap">
              <button className="header-icon-btn" title={t('header_notif_title')}
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
  const { toast, showLogin, adminModal, editItem, detailItem } = useUI()
  const { t } = useLang()
  return (
    <div className="app">
      {toast && <div className="toast">{toast}</div>}
      {showLogin && <LoginModal />}
      {adminModal && <AdminModal />}
      {editItem && <EditModal />}
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
          <p>🏔️ <strong>HTM Trường Hải</strong> – {t('logo_sub')}</p>
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


