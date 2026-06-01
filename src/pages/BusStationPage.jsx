import { useState } from 'react'
import { Bus, Clock3, MapPin, Ticket } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { useUI } from '../context/UIContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function parsePriceToNumber(priceText = '') {
    return Number(String(priceText).replace(/[^\d]/g, '')) || 0
}

const BUS_ROUTES = [
    {
        id: 'bus-1',
        route: 'Hà Giang ↔ Hà Nội',
        duration: '6.5 - 7 giờ',
        price: '320.000đ',
        departures: ['06:30', '12:30', '21:00'],
    },
    {
        id: 'bus-2',
        route: 'Hà Giang ↔ Lào Cai',
        duration: '4.5 - 5 giờ',
        price: '250.000đ',
        departures: ['07:30', '14:00'],
    },
    {
        id: 'bus-3',
        route: 'Hà Giang ↔ Sa Pa',
        duration: '5 - 5.5 giờ',
        price: '280.000đ',
        departures: ['08:00', '20:00'],
    },
]

export default function BusStationPage() {
    const { t } = useLang()
    const { showToast } = useUI()
    const [selected, setSelected] = useState(null)
    const [form, setForm] = useState({ name: '', phone: '', passengers: 1, departure: '', note: '' })

    const submit = async (e) => {
        e.preventDefault()
        if (!selected) return
        const payload = {
            items: [
                {
                    id: Date.now(),
                    name: `[BUS] ${selected.route}`,
                    price: parsePriceToNumber(selected.price),
                    qty: Number(form.passengers) || 1,
                    img: '/hg-city-1.svg',
                },
            ],
            address: `${selected.route} · ${form.departure || selected.departures[0]} · KH: ${form.name}${form.note ? ` · Note: ${form.note}` : ''}`,
            phone: form.phone,
            location: selected.route,
            pickup: false,
        }

        try {
            const res = await fetch(`${API}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            if (!res.ok) throw new Error('submit failed')
            showToast(t('bus_sent').replace('{route}', selected.route))
            setForm({ name: '', phone: '', passengers: 1, departure: '', note: '' })
            setSelected(null)
        } catch {
            showToast(t('bus_sent_fail'))
        }
    }

    return (
        <div className="page-enter">
            <div className="container py-section" style={{ maxWidth: 980 }}>
                <div className="section-header-center" style={{ marginBottom: 18 }}>
                    <span className="section-label">{t('bus_label')}</span>
                    <h1 style={{ marginTop: 6 }}>{t('bus_title')}</h1>
                    <p style={{ color: '#64748b' }}>{t('bus_sub')}</p>
                </div>

                <div className="cards-grid mt-6">
                    {BUS_ROUTES.map(item => (
                        <div key={item.id} className="card3d" style={{ transform: 'none' }}>
                            <div className="card3d-body">
                                <strong className="card3d-title" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                    <Bus size={16} /> {item.route}
                                </strong>
                                <div style={{ color: '#475569', display: 'grid', gap: 6, marginTop: 8 }}>
                                    <span><Clock3 size={13} /> {t('bus_duration')}: {item.duration}</span>
                                    <span><Ticket size={13} /> {t('bus_price')}: {item.price}</span>
                                    <span><MapPin size={13} /> {t('bus_departures')}: {item.departures.join(' · ')}</span>
                                </div>
                                <div className="card3d-actions" style={{ marginTop: 12 }}>
                                    <button
                                        className="btn3d btn3d-orange btn-sm"
                                        onClick={() => {
                                            setSelected(item)
                                            setForm(prev => ({ ...prev, departure: item.departures[0] || '' }))
                                        }}
                                    >
                                        {t('bus_book')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {selected && (
                    <div style={{ marginTop: 20, background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 10px 24px #00000010' }}>
                        <h3 style={{ marginBottom: 8 }}>{t('bus_booking_for')} {selected.route}</h3>
                        <form className="login-form" onSubmit={submit}>
                            <div className="form-2col">
                                <input className="form-input" placeholder={t('bus_name')} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                                <input className="form-input" placeholder={t('bus_phone')} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                            </div>
                            <div className="form-2col">
                                <input className="form-input" type="number" min="1" value={form.passengers} onChange={e => setForm({ ...form, passengers: Number(e.target.value) })} required />
                                <select
                                    className="form-input"
                                    value={form.departure}
                                    onChange={e => setForm({ ...form, departure: e.target.value })}
                                    required
                                >
                                    {selected.departures.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                                </select>
                            </div>
                            <textarea className="form-input form-textarea" placeholder={t('bus_note')} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
                            <button className="btn3d btn3d-green" type="submit">{t('bus_submit')}</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}
