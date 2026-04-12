import { useState } from 'react'
import { Search, Plus, Trash2, Phone, ShoppingCart } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { useOrder } from '../context/OrderContext'
import { useLang } from '../context/LanguageContext'

function ProductCard({ item, onOrder, onAddCart, onView, onDelete, isAdmin, t }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  return (
    <div className="card3d"
      style={{ transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); setTilt({ x: ((e.clientY - r.top) / r.height - .5) * 12, y: -((e.clientX - r.left) / r.width - .5) * 12 }) }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}>
      <div className="card3d-img" style={{ backgroundImage: `url(${item.img || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80'})` }}>
        <div className="card3d-badge">🌿 {t('prod_badge')}</div>
      </div>
      <div className="card3d-body">
        <strong className="card3d-title">{item.title}</strong>
        <p className="card3d-desc">{item.desc}</p>
        {item.price && <span className="card3d-price">{item.price}</span>}
        <div className="card3d-actions">
          <button className="btn-card-view" onClick={() => onView(item)}>{t('prod_detail')}</button>
          <button className="btn3d btn3d-green btn-sm" onClick={() => onAddCart(item)}><ShoppingCart size={14} /> {t('prod_cart')}</button>
          <button className="btn3d btn3d-orange btn-sm" onClick={() => onOrder(item)}>{t('prod_buy')}</button>
          {isAdmin && <button className="btn-card-del" onClick={() => onDelete('product', item.id)}><Trash2 size={14} /></button>}
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const { products } = useData()
  const { deleteItem } = useData()
  const { isMod, isAdmin } = useAuth()
  const { setAdminModal, setDetailItem, showToast } = useUI()
  const { addToCart, submitCartOrder } = useOrder()
  const { t } = useLang()
  const [search, setSearch] = useState('')
  const [orderItem, setOrderItem] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', qty: 1, address: '', note: '' })

  const filtered = products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))

  const submitOrder = (e) => {
    e.preventDefault()
    submitCartOrder(
      { name: form.name, phone: form.phone, address: form.address, note: form.note },
      [{ ...orderItem, qty: Number(form.qty) }]
    )
    setOrderItem(null)
    setForm({ name: '', phone: '', qty: 1, address: '', note: '' })
    showToast(t('prod_success_msg').replace('{title}', orderItem.title))
  }

  return (
    <div className="page-enter">
      <div className="page-hero" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1400&q=80)' }}>
        <div className="ph-overlay" />
        <div className="ph-content">
          <h1>{t('prod_hero_title')}</h1>
          <p>{t('prod_hero_sub')}</p>
        </div>
      </div>

      {orderItem && (
        <div className="modal-backdrop" onClick={() => setOrderItem(null)}>
          <div className="modal modal-large" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOrderItem(null)}>✕</button>
            <h2 className="modal-title">🛒 {t('prod_order_title')}: {orderItem.title}</h2>
            <p className="modal-hint">{orderItem.price}</p>
            <form onSubmit={submitOrder} className="login-form">
              <input className="form-input" placeholder={t('prod_name_ph')} value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input className="form-input" type="tel" placeholder={t('prod_phone_ph')} value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} required />
              <div className="form-2col">
                <input className="form-input" type="number" min="1" placeholder={t('prod_qty_ph')} value={form.qty}
                  onChange={e => setForm({ ...form, qty: e.target.value })} />
                <input className="form-input" placeholder={t('prod_city_ph')} value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
              <textarea className="form-input form-textarea" style={{ minHeight: 60 }} placeholder={t('prod_note_ph')}
                value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
              <button type="submit" className="btn3d btn3d-orange btn-full">{t('prod_confirm_btn')}</button>
              <a href="tel:0385737705" className="btn3d btn3d-blue btn-full" style={{ textAlign: 'center', marginTop: 8 }}>
                <Phone size={15} /> {t('prod_call_btn')}
              </a>
            </form>
          </div>
        </div>
      )}

      <div className="container py-section">
        <div className="page-toolbar">
          <div className="search-box"><Search size={17} color="#94a3b8" />
            <input placeholder={t('prod_search')} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {isMod && <button className="btn3d btn3d-green btn-sm" onClick={() => setAdminModal('product')}><Plus size={15} /> {t('prod_add')}</button>}
        </div>
        <div className="cards-grid mt-6">
          {filtered.map(p => (
            <ProductCard key={p.id} item={p} isAdmin={isAdmin} t={t}
              onOrder={setOrderItem}
              onAddCart={item => { addToCart(item); showToast(t('prod_added_cart').replace('{title}', item.title)) }}
              onView={setDetailItem}
              onDelete={(type, id) => { deleteItem(type, id); showToast(t('prod_deleted')) }} />
          ))}
          {filtered.length === 0 && <p className="empty-state">{t('prod_no_result')}</p>}
        </div>
      </div>
    </div>
  )
}
