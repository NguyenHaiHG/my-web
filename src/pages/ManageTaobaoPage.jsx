import { useNavigate } from 'react-router-dom'
import { Trash2, ArrowLeft } from 'lucide-react'
import { useOrder } from '../context/OrderContext'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'

export default function ManageTaobaoPage() {
    const { taobaoOrders, updateOrderStatus, deleteOrder } = useOrder()
    const { isMod, isAdmin } = useAuth()
    const navigate = useNavigate()
    const { t } = useLang()

    const STATUS_OPTS = [
        { value: 'pending', label: t('status_pending') },
        { value: 'confirmed', label: t('status_confirmed') },
        { value: 'shipped', label: t('status_shipped') },
        { value: 'done', label: t('status_done') },
        { value: 'cancelled', label: t('status_cancelled') },
    ]

    if (!isMod) return (
        <div className="container py-section text-center">
            <p style={{ color: '#dc2626', fontSize: 18 }}>{t('mgmt_access_denied')}</p>
            <button className="btn3d btn3d-blue btn-sm" style={{ marginTop: 16 }} onClick={() => navigate('/')}>{t('mgmt_back_home')}</button>
        </div>
    )

    const pending = taobaoOrders.filter(o => o.status === 'pending').length

    return (
        <div className="page-enter">
            <div className="manage-hero" style={{ background: 'linear-gradient(135deg,#dc2626,#f97316)' }}>
                <div className="container">
                    <button className="btn-back-white" onClick={() => navigate(-1)}><ArrowLeft size={16} /> {t('mgmt_back')}</button>
                    <h1>{t('mgmt_taobao_title')}</h1>
                    <p>{t('mgmt_total')} <strong>{taobaoOrders.length}</strong> {t('mgmt_orders')} &nbsp;·&nbsp; <strong>{pending}</strong> {t('mgmt_pending_count')}</p>
                </div>
            </div>

            <div className="container py-section">
                {taobaoOrders.length === 0 ? (
                    <p className="empty-state">{t('mgmt_taobao_empty')}</p>
                ) : (
                    <div className="manage-list">
                        {taobaoOrders.map(ord => (
                            <div key={ord.id} className="manage-card">
                                <div className="manage-card-top">
                                    <div className="manage-card-info">
                                        <strong className="manage-name">{ord.name}</strong>
                                        <span className="manage-phone">📞 {ord.phone}</span>
                                        <span className="manage-date">🕐 {ord.date}</span>
                                    </div>
                                    <div className="manage-card-actions">
                                        <select
                                            className={`status-select status-${ord.status}`}
                                            value={ord.status}
                                            onChange={e => updateOrderStatus('taobao', ord.id, e.target.value)}>
                                            {STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                        </select>
                                        {isAdmin && (
                                            <button className="btn-card-del" onClick={() => deleteOrder('taobao', ord.id)}>
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {ord.link && (
                                    <div className="manage-taobao-link">
                                        🔗 <a href={ord.link} target="_blank" rel="noopener noreferrer" className="taobao-link"
                                            onClick={e => e.stopPropagation()}>{ord.link}</a>
                                    </div>
                                )}

                                <div className="manage-meta-row">
                                    {ord.desc && <span>🏷️ {t('mgmt_taobao_item')} <strong>{ord.desc}</strong></span>}
                                    {ord.qty && <span>📦 {t('mgmt_taobao_qty')} <strong>{ord.qty}</strong></span>}
                                </div>

                                {ord.note && <p className="manage-note">💬 {ord.note}</p>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
