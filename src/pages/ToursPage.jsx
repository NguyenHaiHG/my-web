import { useState } from 'react'
import { Search, MapPin, Clock, Users, Plus, Trash2, Phone } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { useOrder } from '../context/OrderContext'

function TourCard({ tour, onBook, onView, onDelete, isAdmin }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  return (
    <div className="card3d"
      style={{ transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); setTilt({ x: ((e.clientY - r.top) / r.height - .5) * 12, y: -((e.clientX - r.left) / r.width - .5) * 12 }) }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}>
      <div className="card3d-img" style={{ backgroundImage: `url(${tour.img || 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&q=80'})` }}>
        <div className="card3d-badge">⭐ 5.0</div>
      </div>
      <div className="card3d-body">
        <strong className="card3d-title">{tour.title}</strong>
        <p className="card3d-desc">{tour.desc}</p>
        <div className="card3d-meta">
          <span><MapPin size={12} /> Hà Giang</span>
          <span><Clock size={12} /> 3N2Đ</span>
          <span><Users size={12} /> ≤10</span>
        </div>
        {tour.price && <span className="card3d-price">{tour.price}</span>}
        <div className="card3d-actions">
          <button className="btn-card-view" onClick={() => onView(tour)}>Chi Tiết</button>
          <button className="btn3d btn3d-orange btn-sm" onClick={() => onBook(tour)}>Đặt Ngay</button>
          {isAdmin && <button className="btn-card-del" onClick={() => onDelete('tour', tour.id)}><Trash2 size={14} /></button>}
        </div>
      </div>
    </div>
  )
}

export default function ToursPage() {
  const { tours } = useData()
  const { deleteItem } = useData()
  const { isMod, isAdmin } = useAuth()
  const { setAdminModal, setDetailItem, showToast } = useUI()
  const { submitTourBooking } = useOrder()
  const [search, setSearch] = useState('')
  const [booking, setBooking] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', date: '', guests: 1, note: '' })

  const filtered = tours.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))

  const submitBook = (e) => {
    e.preventDefault()
    submitTourBooking({
      tourTitle: booking.title,
      tourPrice: booking.price,
      name: form.name,
      phone: form.phone,
      date: form.date,
      guests: form.guests,
      note: form.note,
    })
    setBooking(null)
    setForm({ name: '', phone: '', date: '', guests: 1, note: '' })
    showToast(`✅ Đặt tour "${booking.title}" thành công! Admin/Mod sẽ liên hệ sớm.`)
  }

  return (
    <div className="page-enter">
      <div className="page-hero" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1400&q=80)' }}>
        <div className="ph-overlay" />
        <div className="ph-content">
          <h1>🗺️ Tour Du Lịch Hà Giang</h1>
          <p>Ruộng bậc thang, đỉnh Mã Pí Lèng, bình nguyên đá Đồng Văn hùng vĩ</p>
        </div>
      </div>

      {booking && (
        <div className="modal-backdrop" onClick={() => setBooking(null)}>
          <div className="modal modal-large" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setBooking(null)}>✕</button>
            <h2 className="modal-title">🗺️ Đặt Tour</h2>
            <p className="modal-hint">{booking.title} – {booking.price}</p>
            <form onSubmit={submitBook} className="login-form">
              <input className="form-input" placeholder="Họ và tên *" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input className="form-input" type="tel" placeholder="Số điện thoại *" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} required />
              <div className="form-2col">
                <input className="form-input" type="date" placeholder="Ngày khởi hành" value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })} required />
                <input className="form-input" type="number" min="1" max="20" placeholder="Số người" value={form.guests}
                  onChange={e => setForm({ ...form, guests: e.target.value })} />
              </div>
              <textarea className="form-input form-textarea" style={{ minHeight: 70 }} placeholder="Ghi chú (yêu cầu đặc biệt...)"
                value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
              <button type="submit" className="btn3d btn3d-orange btn-full">✅ Xác Nhận Đặt Tour</button>
              <a href="tel:0385737705" className="btn3d btn3d-blue btn-full" style={{ textAlign: 'center', marginTop: 8 }}>
                <Phone size={15} /> Gọi Ngay 0385.737.705
              </a>
            </form>
          </div>
        </div>
      )}

      <div className="container py-section">
        <div className="page-toolbar">
          <div className="search-box"><Search size={17} color="#94a3b8" />
            <input placeholder="Tìm tour..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {isMod && <button className="btn3d btn3d-green btn-sm" onClick={() => setAdminModal('tour')}><Plus size={15} /> Thêm Tour</button>}
        </div>
        <div className="cards-grid mt-6">
          {filtered.map(t => (
            <TourCard key={t.id} tour={t} isAdmin={isAdmin}
              onBook={setBooking} onView={setDetailItem}
              onDelete={(type, id) => { deleteItem(type, id); showToast('Đã xoá!') }} />
          ))}
          {filtered.length === 0 && <p className="empty-state">Không tìm thấy tour nào 😢</p>}
        </div>
      </div>
    </div>
  )
}
