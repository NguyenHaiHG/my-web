import { useState, useMemo } from 'react'
import { Search, MapPin, Clock, Users, Plus, Trash2, Phone, Star, Check, Calendar, Edit2 } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { useOrder } from '../context/OrderContext'
import { useLang } from '../context/LanguageContext'

/* ── helper ── */
function parsePrice(str) {
  if (!str) return 0
  return parseInt(str.replace(/[^\d]/g, '')) || 0
}

const INC_KEYS = {
  transport: 'inc_transport',
  meal: 'inc_meal',
  guide: 'inc_guide',
  hotel: 'inc_hotel',
  ticket: 'inc_ticket',
}

/* ════════════════════════════════════════════════════
   TOUR BOOKING CARD
════════════════════════════════════════════════════ */
function TourBookCard({ tour, onBook, onView, onDelete, onEdit, isMod, isAdmin }) {
  const { t } = useLang()
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const includes = tour.includes || ['transport', 'meal', 'guide']
  const duration = tour.duration || '3N2Đ'
  const maxGuests = tour.maxGuests || 10
  const location = tour.location || 'Hà Giang'
  const category = tour.category || 'budget'
  const rating = tour.rating ?? 5.0
  const reviews = tour.reviews ?? 0

  const catLabel = {
    premium: `⭐ ${t('tours_filter_premium').replace(/^⭐\s*/, '')}`,
    trek: `🥾 Trekking`,
    budget: `💰 ${t('tours_filter_budget').replace(/^💰\s*/, '')}`,
  }[category] ?? '💰'

  return (
    <div
      className="tour-bcard"
      style={{ transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      onMouseMove={e => {
        const r = e.currentTarget.getBoundingClientRect()
        setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * 8, y: -((e.clientX - r.left) / r.width - 0.5) * 8 })
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      {/* Image */}
      <div
        className="tour-bcard-img"
        style={{ backgroundImage: `url(${tour.img || 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&q=80'})` }}
      >
        <span className={`tour-bcard-cat tour-bcard-cat-${category}`}>{catLabel}</span>
        <div className="tour-bcard-rating">
          <Star size={11} fill="#fbbf24" color="#fbbf24" />
          <span>{rating.toFixed(1)}</span>
          {reviews > 0 && <span className="tour-bcard-reviews">({reviews})</span>}
        </div>
        {isAdmin && (
          <button className="tour-bcard-del" title={t('delete_tooltip')} onClick={() => onDelete('tour', tour.id)}>
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="tour-bcard-body">
        <h3 className="tour-bcard-title" onClick={() => onView(tour)}>{tour.title}</h3>
        <p className="tour-bcard-desc">{tour.desc}</p>

        <div className="tour-bcard-meta">
          <span><MapPin size={12} /> {location}</span>
          <span><Clock size={12} /> {duration}</span>
          <span><Users size={12} /> ≤{maxGuests} {t('card_people')}</span>
        </div>

        <div className="tour-bcard-includes">
          <span className="tour-inc-label">{t('card_includes')}</span>
          {includes.map(key => (
            <span key={key} className="tour-inc-chip" title={t(INC_KEYS[key] || key)}>
              {t(INC_KEYS[key] || key).split(' ')[0] || '✓'}
            </span>
          ))}
        </div>

        <div className="tour-bcard-footer">
          <div className="tour-bcard-price-wrap">
            <span className="tour-bcard-from">{t('card_from')}</span>
            <span className="tour-bcard-price">{tour.price}</span>
            <span className="tour-bcard-unit">{t('card_per_person')}</span>
          </div>
          <div className="tour-bcard-actions">
            <button className="btn-tour-detail" onClick={() => onView(tour)}>
              {t('card_detail')}
            </button>
            {isMod && (
              <button className="btn3d btn3d-blue btn-sm" onClick={() => onEdit(tour)}>
                <Edit2 size={12} /> {t('blog_edit')}
              </button>
            )}
            <button className="btn3d btn3d-orange btn-sm" onClick={() => onBook(tour)}>
              {t('card_book')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════
   BOOKING MODAL – 3 steps
════════════════════════════════════════════════════ */
function BookingModal({ tour, onClose }) {
  const { t } = useLang()
  const { submitTourBooking } = useOrder()
  const { showToast } = useUI()

  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    date: '', adults: 1, children: 0,
    name: '', phone: '', email: '', note: '',
  })

  const totalGuests = form.adults + form.children

  const adjGuest = (field, delta) =>
    setForm(prev => ({ ...prev, [field]: Math.max(field === 'adults' ? 1 : 0, prev[field] + delta) }))

  const goNext = () => {
    if (step === 1) {
      if (!form.date) { showToast(t('book_no_date')); return }
      setStep(2)
    } else if (step === 2) {
      if (!form.name.trim() || !form.phone.trim()) { showToast(t('book_required_msg')); return }
      setStep(3)
    }
  }

  const handleConfirm = () => {
    submitTourBooking({
      tourTitle: tour.title,
      tourPrice: tour.price,
      name: form.name,
      phone: form.phone,
      date: form.date,
      guests: totalGuests,
      note: form.note,
    })
    onClose()
    showToast('✅ ' + t('book_success_msg').replace('{title}', tour.title))
  }

  const STEPS = [t('book_step1'), t('book_step2'), t('book_step3')]

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-large booking-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <h2 className="modal-title">{t('book_title')}</h2>
        <p className="modal-hint">{tour.title} · {tour.price}{t('card_per_person')}</p>

        {/* Step indicator */}
        <div className="booking-steps">
          {STEPS.map((label, i) => {
            const s = i + 1
            return (
              <div key={s} className={`booking-step${step === s ? ' bstep-active' : ''}${step > s ? ' bstep-done' : ''}`}>
                <div className="bstep-circle">
                  {step > s ? <Check size={12} /> : s}
                </div>
                <span className="bstep-label">{label}</span>
                {s < 3 && <div className="bstep-line" />}
              </div>
            )
          })}
        </div>

        {/* ── Step 1 ── */}
        {step === 1 && (
          <div className="booking-body">
            <div className="book-field">
              <label className="book-label">
                <Calendar size={14} /> {t('book_departure_date')}
              </label>
              <input
                className="form-input"
                type="date"
                value={form.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div className="book-field">
              <label className="book-label">
                <Users size={14} /> {t('book_guest_count')}
              </label>
              <div className="guest-row">
                <div className="guest-item">
                  <span className="guest-type">{t('book_adults')}</span>
                  <div className="guest-counter">
                    <button className="gc-btn" onClick={() => adjGuest('adults', -1)}>−</button>
                    <span className="gc-val">{form.adults}</span>
                    <button className="gc-btn" onClick={() => adjGuest('adults', 1)}>+</button>
                  </div>
                </div>
                <div className="guest-item">
                  <span className="guest-type">{t('book_children')}</span>
                  <div className="guest-counter">
                    <button className="gc-btn" onClick={() => adjGuest('children', -1)}>−</button>
                    <span className="gc-val">{form.children}</span>
                    <button className="gc-btn" onClick={() => adjGuest('children', 1)}>+</button>
                  </div>
                </div>
              </div>
            </div>
            <button className="btn3d btn3d-orange btn-full" onClick={goNext}>
              {t('book_next')}
            </button>
          </div>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <div className="booking-body">
            <div className="login-form">
              <input className="form-input" placeholder={t('book_full_name')}
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input className="form-input" type="tel" placeholder={t('book_phone')}
                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <input className="form-input" type="email" placeholder={t('book_email')}
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <textarea className="form-input form-textarea" style={{ minHeight: 80 }}
                placeholder={t('book_notes_ph')}
                value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn3d btn3d-blue" style={{ flex: 1 }} onClick={() => setStep(1)}>
                  {t('book_back')}
                </button>
                <button className="btn3d btn3d-orange" style={{ flex: 2 }} onClick={goNext}>
                  {t('book_next')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3 ── */}
        {step === 3 && (
          <div className="booking-body">
            <div className="book-summary">
              <div className="book-sum-row">
                <span>{t('book_tour_label')}</span>
                <strong>{tour.title}</strong>
              </div>
              <div className="book-sum-row">
                <span>{t('book_date_label')}</span>
                <strong>{form.date}</strong>
              </div>
              <div className="book-sum-row">
                <span>{t('book_total_guests')}</span>
                <strong>
                  {form.adults} {t('book_adults_label')}
                  {form.children > 0 && ` ${t('book_and')} ${form.children} ${t('book_children_label')}`}
                </strong>
              </div>
              <div className="book-sum-row">
                <span>{t('book_price_per')}</span>
                <strong className="book-price-hl">{tour.price}</strong>
              </div>
              <div className="book-sum-row">
                <span>{t('book_contact_label')}</span>
                <strong>{form.name} · {form.phone}</strong>
              </div>
              {form.note && (
                <div className="book-sum-row">
                  <span>{t('book_note_label')}</span>
                  <span className="book-note-txt">{form.note}</span>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn3d btn3d-blue" style={{ flex: 1 }} onClick={() => setStep(2)}>
                  {t('book_back')}
                </button>
                <button className="btn3d btn3d-orange" style={{ flex: 2 }} onClick={handleConfirm}>
                  {t('book_confirm')}
                </button>
              </div>
              <a href="tel:0385737705" className="btn3d btn3d-green btn-full" style={{ textAlign: 'center' }}>
                <Phone size={15} /> {t('book_call')}
              </a>
              <a href="https://wa.me/84385737705" target="_blank" rel="noreferrer" className="btn3d btn3d-blue btn-full" style={{ textAlign: 'center' }}>
                💬 {t('whatsapp_btn')} 0385.737.705
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════
   TOURS PAGE
════════════════════════════════════════════════════ */
export default function ToursPage() {
  const { tours, deleteItem } = useData()
  const { isMod, isAdmin } = useAuth()
  const { setAdminModal, setDetailItem, setEditItem, showToast } = useUI()
  const { t } = useLang()

  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [booking, setBooking] = useState(null)

  const filtered = useMemo(() => {
    let list = tours.filter(tour =>
      tour.title.toLowerCase().includes(search.toLowerCase()) ||
      (tour.location || '').toLowerCase().includes(search.toLowerCase())
    )
    if (filterCat !== 'all') list = list.filter(tour => (tour.category || 'budget') === filterCat)
    if (sortBy === 'price_asc') list = [...list].sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
    if (sortBy === 'price_desc') list = [...list].sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
    if (sortBy === 'rating') list = [...list].sort((a, b) => (b.rating ?? 5) - (a.rating ?? 5))
    return list
  }, [tours, search, filterCat, sortBy])

  const FILTERS = [
    { key: 'all', label: t('tours_filter_all') },
    { key: 'budget', label: t('tours_filter_budget') },
    { key: 'premium', label: t('tours_filter_premium') },
    { key: 'trek', label: t('tours_filter_trek') },
  ]

  return (
    <div className="page-enter">
      {/* Hero */}
      <div
        className="page-hero tours-hero"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1400&q=90)' }}
      >
        <div className="ph-overlay" />
        <div className="ph-content">
          <h1>{t('tours_hero_title')}</h1>
          <p>{t('tours_hero_sub')}</p>
          <div className="tours-hero-search">
            <Search size={18} color="#94a3b8" />
            <input
              placeholder={t('tours_search')}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container py-section">
        {/* Filter bar */}
        <div className="tours-filter-bar">
          <div className="filter-tabs">
            {FILTERS.map(f => (
              <button
                key={f.key}
                className={`filter-tab${filterCat === f.key ? ' filter-tab-active' : ''}`}
                onClick={() => setFilterCat(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="tours-filter-right">
            <select
              className="form-input sort-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="default">{t('tours_sort_default')}</option>
              <option value="price_asc">{t('tours_sort_price_asc')}</option>
              <option value="price_desc">{t('tours_sort_price_desc')}</option>
              <option value="rating">{t('tours_sort_rating')}</option>
            </select>
            {isMod && (
              <button className="btn3d btn3d-green btn-sm" onClick={() => setAdminModal('tour')}>
                <Plus size={15} /> {t('tours_add')}
              </button>
            )}
          </div>
        </div>

        <p className="tours-result-count">{filtered.length} {t('tours_results')}</p>

        <div className="cards-grid mt-6">
          {filtered.map(tour => (
            <TourBookCard
              key={tour.id}
              tour={tour}
              isMod={isMod}
              isAdmin={isAdmin}
              onBook={setBooking}
              onView={setDetailItem}
              onEdit={tour => setEditItem({ type: 'tour', item: tour })}
              onDelete={(type, id) => { deleteItem(type, id); showToast(t('book_deleted')) }}
            />
          ))}
          {filtered.length === 0 && <p className="empty-state">{t('tours_no_result')}</p>}
        </div>
      </div>

      {booking && <BookingModal tour={booking} onClose={() => setBooking(null)} />}
    </div>
  )
}
