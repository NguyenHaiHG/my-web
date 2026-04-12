import { useNavigate } from 'react-router-dom'
import { Trash2, ArrowLeft } from 'lucide-react'
import { useOrder } from '../context/OrderContext'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'

export default function ManageTourPage() {
    const { tourBookings, updateOrderStatus, deleteOrder } = useOrder()
    const { isMod, isAdmin } = useAuth()
    const navigate = useNavigate()
    const { t } = useLang()

    const STATUS_OPTS = [
        { value: 'pending', label: t('status_pending') },
        { value: 'confirmed', label: t('status_confirmed') },
        { value: 'done', label: t('status_done') },
        { value: 'cancelled', label: t('status_cancelled') },
    ]

    if (!isMod) return (
        <div className="container py-section text-center">
            <p style={{ color: '#dc2626', fontSize: 18 }}>{t('mgmt_access_denied')}</p>
            <button className="btn3d btn3d-blue btn-sm" style={{ marginTop: 16 }} onClick={() => navigate('/')}>{t('mgmt_back_home')}</button>
        </div>
    )

    const pending = tourBookings.filter(o => o.status === 'pending').length

    return (
        <div className="page-enter">
            <div className="manage-hero" style={{ background: 'linear-gradient(135deg,#1e3a5f,#2563eb)' }}>
                <div className="container">
                    <button className="btn-back-white" onClick={() => navigate(-1)}><ArrowLeft size={16} /> {t('mgmt_back')}</button>
                    <h1>{t('mgmt_tour_title')}</h1>
                    <p>{t('mgmt_total')} <strong>{tourBookings.length}</strong> {t('mgmt_bookings')} &nbsp;·&nbsp; <strong>{pending}</strong> {t('mgmt_pending_count')}</p>
                </div>
            </div>

            <div className="container py-section">
                {tourBookings.length === 0 ? (
                    <p className="empty-state">{t('mgmt_tour_empty')}</p>
                ) : (
                    <div className="manage-list">
                        {tourBookings.map(bk => (
                            <div key={bk.id} className="manage-card">
                                <div className="manage-card-top">
                                    <div className="manage-card-info">
                                        <strong className="manage-name">{bk.name}</strong>
                                        <span className="manage-phone">📞 {bk.phone}</span>
                                        <span className="manage-date">🕐 {bk.date_submitted}</span>
                                    </div>
                                    <div className="manage-card-actions">
                                        <select
                                            className={`status-select status-${bk.status}`}
                                            value={bk.status}
                                            onChange={e => updateOrderStatus('tour', bk.id, e.target.value)}>
                                            {STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                        </select>
                                        {isAdmin && (
                                            <button className="btn-card-del" onClick={() => deleteOrder('tour', bk.id)}>
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="manage-tour-info">
                                    <span className="manage-tour-title">🗺️ {bk.tourTitle}</span>
                                    {bk.tourPrice && <span className="manage-item-price">{bk.tourPrice}</span>}
                                </div>

                                <div className="manage-meta-row">
                                    {bk.date && <span>📅 {t('mgmt_tour_departure')} <strong>{bk.date}</strong></span>}
                                    {bk.guests && <span>👥 {t('mgmt_tour_guests')} <strong>{bk.guests}</strong></span>}
                                </div>

                                {bk.note && <p className="manage-note">📝 {bk.note}</p>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
