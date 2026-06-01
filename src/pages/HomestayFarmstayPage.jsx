import { useMemo, useState } from 'react'
import { BedDouble, Trees, MapPin, Clock } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { useUI } from '../context/UIContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const STAYS = [
    {
        id: 'hs-1',
        type: 'homestay',
        name: 'Tay Valley Homestay',
        area: 'Hà Giang 2',
        price: 550000,
        desc: 'Nhà sàn truyền thống, bữa tối cùng gia đình địa phương, phù hợp nhóm nhỏ.',
        img: '/hg-city-1.svg',
    },
    {
        id: 'fs-1',
        type: 'farmstay',
        name: 'Mountain Orchard Farmstay',
        area: 'Quản Bạ',
        price: 780000,
        desc: 'Trải nghiệm làm vườn, thu hoạch nông sản theo mùa và học nấu món bản địa.',
        img: '/hg-city-2.svg',
    },
    {
        id: 'hs-2',
        type: 'homestay',
        name: 'Stone Plateau Nest',
        area: 'Đồng Văn',
        price: 690000,
        desc: 'Không gian yên tĩnh gần cao nguyên đá, có xe đưa đón theo yêu cầu.',
        img: '/hg-city-3.svg',
    },
]

export default function HomestayFarmstayPage() {
    const { t } = useLang()
    const { showToast } = useUI()
    const [type, setType] = useState('all')
    const [selected, setSelected] = useState(null)
    const [form, setForm] = useState({ date: '', guests: 2, name: '', phone: '', note: '' })

    const list = useMemo(() => {
        if (type === 'all') return STAYS
        return STAYS.filter(s => s.type === type)
    }, [type])

    const submitBooking = async (e) => {
        e.preventDefault()
        if (!selected) return
        const payload = {
            items: [
                {
                    id: Date.now(),
                    name: `[STAY] ${selected.name}`,
                    price: Number(selected.price) || 0,
                    qty: Number(form.guests) || 1,
                    img: selected.img,
                },
            ],
            address: `${selected.area} · ${selected.name} · ${form.date} · KH: ${form.name}${form.note ? ` · Note: ${form.note}` : ''}`,
            phone: form.phone,
            location: selected.area,
            pickup: false,
        }

        try {
            const res = await fetch(`${API}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            if (!res.ok) throw new Error('submit failed')
            showToast(t('stays_sent').replace('{name}', selected.name))
            setForm({ date: '', guests: 2, name: '', phone: '', note: '' })
            setSelected(null)
        } catch {
            showToast(t('stays_sent_fail'))
        }
    }

    return (
        <div className="page-enter">
            <div className="container py-section" style={{ maxWidth: 1080 }}>
                <div className="section-header-center" style={{ marginBottom: 16 }}>
                    <span className="section-label">{t('stays_label')}</span>
                    <h1 style={{ marginTop: 6 }}>{t('stays_title')}</h1>
                    <p style={{ color: '#64748b' }}>{t('stays_sub')}</p>
                </div>

                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 18 }}>
                    <button className={type === 'all' ? 'shop387-tab-active' : 'shop387-tab'} onClick={() => setType('all')}>{t('tours_filter_all')}</button>
                    <button className={type === 'homestay' ? 'shop387-tab-active' : 'shop387-tab'} onClick={() => setType('homestay')}>
                        <BedDouble size={14} /> {t('stays_homestay')}
                    </button>
                    <button className={type === 'farmstay' ? 'shop387-tab-active' : 'shop387-tab'} onClick={() => setType('farmstay')}>
                        <Trees size={14} /> {t('stays_farmstay')}
                    </button>
                </div>

                <div className="cards-grid mt-6">
                    {list.map(stay => (
                        <div key={stay.id} className="card3d" style={{ transform: 'none' }}>
                            <div className="card3d-img" style={{ backgroundImage: `url(${stay.img})` }}>
                                <div className="card3d-badge">{stay.type === 'homestay' ? t('stays_homestay') : t('stays_farmstay')}</div>
                            </div>
                            <div className="card3d-body">
                                <strong className="card3d-title">{stay.name}</strong>
                                <p className="card3d-desc">{stay.desc}</p>
                                <div style={{ color: '#475569', display: 'grid', gap: 6, marginBottom: 10 }}>
                                    <span><MapPin size={13} /> {stay.area}</span>
                                    <span><Clock size={13} /> 14:00 check-in · 12:00 check-out</span>
                                </div>
                                <div className="card3d-price">{stay.price.toLocaleString()}đ / đêm</div>
                                <div className="card3d-actions" style={{ marginTop: 10 }}>
                                    <button className="btn3d btn3d-orange btn-sm" onClick={() => setSelected(stay)}>{t('stays_book')}</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {selected && (
                    <div style={{ marginTop: 20, background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 10px 24px #00000010' }}>
                        <h3 style={{ marginBottom: 8 }}>{t('stays_booking_for')} {selected.name}</h3>
                        <form className="login-form" onSubmit={submitBooking}>
                            <div className="form-2col">
                                <input className="form-input" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                                <input className="form-input" type="number" min="1" value={form.guests} onChange={e => setForm({ ...form, guests: Number(e.target.value) })} required />
                            </div>
                            <div className="form-2col">
                                <input className="form-input" placeholder={t('stays_name')} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                                <input className="form-input" placeholder={t('stays_phone')} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                            </div>
                            <textarea className="form-input form-textarea" placeholder={t('stays_note')} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
                            <button className="btn3d btn3d-green" type="submit">{t('stays_submit')}</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}
