import { useState } from 'react'
import { Phone, MessageSquare, MessageCircle, MapPin, Clock, Send, Check } from 'lucide-react'
import { useUI } from '../context/UIContext'
import { useLang } from '../context/LanguageContext'

export default function ContactPage() {
  const { showToast } = useUI()
  const { t } = useLang()
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', msg: '' })
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    setSent(true)
    showToast(t('contact_toast'))
    setForm({ name: '', phone: '', email: '', service: '', msg: '' })
  }

  const contactCards = [
    { icon: <Phone size={24} />, labelKey: 'contact_hotline', valueKey: 'contact_hotline_val', link: 'tel:0385737705', color: '#f97316' },
    { icon: <MessageSquare size={24} />, labelKey: 'contact_zalo', valueKey: 'contact_zalo_val', link: 'https://zalo.me/0385737705', color: '#2563eb' },
    { icon: <MessageCircle size={24} />, labelKey: 'contact_whatsapp', valueKey: 'contact_whatsapp_val', link: 'https://wa.me/84385737705', color: '#25d366' },
    { icon: <MapPin size={24} />, labelKey: 'contact_addr', valueKey: 'contact_addr_val', link: '#', color: '#16a34a' },
    { icon: <Clock size={24} />, labelKey: 'contact_hours', valueKey: 'contact_hours_val', link: '#', color: '#7c3aed' },
  ]

  return (
    <div className="page-enter">
      <div className="page-hero" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1540975038511-ad92c58acd41?w=1400&q=80)' }}>
        <div className="ph-overlay" />
        <div className="ph-content">
          <h1>{t('contact_hero_title')}</h1>
          <p>{t('contact_hero_sub')}</p>
        </div>
      </div>

      {/* CONTACT CARDS */}
      <section className="container py-section">
        <div className="contact-cards">
          {contactCards.map((c, i) => (
            <a key={i} href={c.link} target={c.link.startsWith('http') ? '_blank' : '_self'} rel="noreferrer" className="ct-card" style={{ '--cc': c.color }}>
              <div className="ct-icon">{c.icon}</div>
              <div>
                <div className="ct-label">{t(c.labelKey)}</div>
                <div className="ct-value">{t(c.valueKey)}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* FORM + MAP */}
      <section className="container contact-layout">
        <div className="contact-form-card">
          <h2 className="section-heading">{t('contact_form_title')}</h2>
          {sent
            ? <div className="success-box">
              <Check size={48} color="#16a34a" />
              <h3>{t('contact_sent_h')}</h3>
              <p>{t('contact_sent_p')}</p>
              <button className="btn3d btn3d-orange btn-sm mt-6" onClick={() => setSent(false)}>{t('contact_send_more')}</button>
            </div>
            : <form onSubmit={submit} className="login-form">
              <div className="form-2col">
                <input className="form-input" placeholder={t('contact_name_ph')} value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input className="form-input" type="tel" placeholder={t('contact_phone_ph')} value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })} required />
              </div>
              <input className="form-input" type="email" placeholder={t('contact_email_ph')} value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} />
              <select className="form-input" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} required>
                <option value="">{t('contact_svc_ph')}</option>
                <option value="tour">{t('contact_svc1')}</option>
                <option value="order">{t('contact_svc2')}</option>
                <option value="dacsan">{t('contact_svc3')}</option>
                <option value="other">{t('contact_svc4')}</option>
              </select>
              <textarea className="form-input form-textarea" placeholder={t('contact_msg_ph')}
                value={form.msg} onChange={e => setForm({ ...form, msg: e.target.value })} required />
              <button type="submit" className="btn3d btn3d-orange btn-full">
                <Send size={16} /> {t('contact_submit_btn')}
              </button>
              <a href="tel:0385737705" className="btn3d btn3d-blue btn-full" style={{ textAlign: 'center', marginTop: 8 }}>
                <Phone size={15} /> {t('contact_call_btn')}
              </a>
              <a href="https://wa.me/84385737705" target="_blank" rel="noreferrer" className="btn3d btn3d-green btn-full" style={{ textAlign: 'center', marginTop: 8 }}>
                💬 {t('whatsapp_btn')} 0385.737.705
              </a>
            </form>
          }
        </div>

        <div className="map-card">
          <h2 className="section-heading">{t('contact_map_title')}</h2>
          <div className="map-embed">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58890.35985994455!2d104.92685!3d22.82348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x36cc8b2a5ef01d9d%3A0x7d8f8f8f8f8f8f8f!2zSOG6oCBHaWFuZw!5e0!3m2!1svi!2svn!4v1681234567890"
              width="100%" height="300" style={{ border: 0, borderRadius: 12 }} allowFullScreen="" loading="lazy"
              referrerPolicy="no-referrer-when-downgrade" title="Ha Giang Map" />
          </div>
          <div className="map-info">
            <p>🏔️ {t('contact_map1')}</p>
            <p>⏱️ {t('contact_map2')}</p>
            <p>✈️ {t('contact_map3')}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
