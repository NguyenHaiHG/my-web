import { useState } from 'react'
import { Phone, Package, Truck, Shield, Check, ChevronRight } from 'lucide-react'
import { useUI } from '../context/UIContext'
import { useOrder } from '../context/OrderContext'
import { useLang } from '../context/LanguageContext'

const PRICE_TABLE = [
  { weight: '0 – 0.5 kg', vn: '45.000đ', cn: '25.000đ' },
  { weight: '0.5 – 1 kg', vn: '65.000đ', cn: '35.000đ' },
  { weight: '1 – 3 kg', vn: '80.000đ', cn: '50.000đ' },
  { weight: '3 – 5 kg', vn: '110.000đ', cn: '70.000đ' },
  { weight: '> 5 kg', vn: 'Liên hệ', cn: 'Liên hệ' },
]

export default function OrderPage() {
  const { showToast } = useUI()
  const { submitTaobaoOrder } = useOrder()
  const { t } = useLang()
  const [form, setForm] = useState({ name: '', phone: '', link: '', desc: '', qty: 1, note: '' })
  const [submitted, setSubmitted] = useState(false)

  const STEPS = [
    { icon: <Package size={28} />, titleKey: 'order_s1_title', descKey: 'order_s1_desc' },
    { icon: <ChevronRight size={28} />, titleKey: 'order_s2_title', descKey: 'order_s2_desc' },
    { icon: <Truck size={28} />, titleKey: 'order_s3_title', descKey: 'order_s3_desc' },
    { icon: <Check size={28} />, titleKey: 'order_s4_title', descKey: 'order_s4_desc' },
  ]

  const GUARANTEES = [
    { icon: <Shield size={18} />, key: 'guarantee1' },
    { icon: <Truck size={18} />, key: 'guarantee2' },
    { icon: <Check size={18} />, key: 'guarantee3' },
  ]

  const submit = (e) => {
    e.preventDefault()
    submitTaobaoOrder({ name: form.name, phone: form.phone, link: form.link, desc: form.desc, qty: form.qty, note: form.note })
    setSubmitted(true)
    showToast(t('order_toast'))
    setForm({ name: '', phone: '', link: '', desc: '', qty: 1, note: '' })
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <div className="page-enter">
      <div className="page-hero" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80)' }}>
        <div className="ph-overlay" />
        <div className="ph-content">
          <h1>{t('order_hero_title')}</h1>
          <p>{t('order_hero_sub')}</p>
        </div>
      </div>

      {/* STEPS */}
      <section className="order-steps-section">
        <div className="container">
          <h2 className="section-heading text-center">{t('order_process_title')}</h2>
          <div className="order-steps">
            {STEPS.map((s, i) => (
              <div key={i} className="order-step">
                <div className="step-num-wrap">
                  <div className="step-circle">{i + 1}</div>
                  {i < STEPS.length - 1 && <div className="step-line" />}
                </div>
                <div className="step-icon-box">{s.icon}</div>
                <h3>{t(s.titleKey)}</h3>
                <p>{t(s.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ORDER FORM + PRICE TABLE */}
      <section className="container order-main">
        <div className="order-layout">
          {/* FORM */}
          <div className="order-form-card">
            <h2 className="section-heading">{t('order_form_title')}</h2>
            {submitted
              ? <div className="success-box">
                <Check size={40} color="#16a34a" />
                <h3>{t('order_success_h')}</h3>
                <p>{t('order_success_p')}</p>
              </div>
              : <form onSubmit={submit} className="login-form">
                <input className="form-input" placeholder={t('order_name_ph')} value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input className="form-input" type="tel" placeholder={t('order_phone_ph')} value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })} required />
                <input className="form-input" placeholder={t('order_link_ph')} value={form.link}
                  onChange={e => setForm({ ...form, link: e.target.value })} required />
                <div className="form-2col">
                  <input className="form-input" placeholder={t('order_desc_ph')} value={form.desc}
                    onChange={e => setForm({ ...form, desc: e.target.value })} />
                  <input className="form-input" type="number" min="1" placeholder={t('order_qty_ph')} value={form.qty}
                    onChange={e => setForm({ ...form, qty: e.target.value })} />
                </div>
                <textarea className="form-input form-textarea" style={{ minHeight: 70 }}
                  placeholder={t('order_note_ph')}
                  value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
                <button type="submit" className="btn3d btn3d-orange btn-full">{t('order_submit_btn')}</button>
                <a href="tel:0385737705" className="btn3d btn3d-blue btn-full" style={{ textAlign: 'center', marginTop: 8 }}>
                  <Phone size={15} /> {t('order_call_btn')}
                </a>
              </form>
            }
          </div>

          {/* PRICE TABLE */}
          <div className="price-card">
            <h2 className="section-heading">{t('order_price_title')}</h2>
            <table className="price-table">
              <thead>
                <tr><th>{t('price_weight')}</th><th>🇻🇳 {t('price_domestic')}</th><th>🇨🇳 {t('price_china')}</th></tr>
              </thead>
              <tbody>
                {PRICE_TABLE.map(r => (
                  <tr key={r.weight}>
                    <td>{r.weight}</td><td>{r.vn}</td><td>{r.cn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="guarantee-list">
              {GUARANTEES.map((g, i) => (
                <div key={i} className="guarantee-item"><span className="g-icon">{g.icon}</span>{t(g.key)}</div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
