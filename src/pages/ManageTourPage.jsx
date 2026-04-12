import { useNavigate } from 'react-router-dom'
import { Trash2, ArrowLeft } from 'lucide-react'
import { useOrder } from '../context/OrderContext'
import { useAuth } from '../context/AuthContext'

const STATUS_OPTS = [
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'done', label: 'Hoàn thành' },
    { value: 'cancelled', label: 'Đã huỷ' },
]

export default function ManageTourPage() {
    const { tourBookings, updateOrderStatus, deleteOrder } = useOrder()
    const { isMod, isAdmin } = useAuth()
    const navigate = useNavigate()

    if (!isMod) return (
        <div className="container py-section text-center">
            <p style={{ color: '#dc2626', fontSize: 18 }}>⛔ Chỉ Admin/Mod mới xem được trang này.</p>
            <button className="btn3d btn3d-blue btn-sm" style={{ marginTop: 16 }} onClick={() => navigate('/')}>← Trang chủ</button>
        </div>
    )

    const pending = tourBookings.filter(o => o.status === 'pending').length

    return (
        <div className="page-enter">
            <div className="manage-hero" style={{ background: 'linear-gradient(135deg,#1e3a5f,#2563eb)' }}>
                <div className="container">
                    <button className="btn-back-white" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Quay lại</button>
                    <h1>🗺️ Quản Lý Đặt Tour</h1>
                    <p>Tổng <strong>{tourBookings.length}</strong> booking &nbsp;·&nbsp; <strong>{pending}</strong> đang chờ xử lý</p>
                </div>
            </div>

            <div className="container py-section">
                {tourBookings.length === 0 ? (
                    <p className="empty-state">Chưa có đặt tour nào 🗺️</p>
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
                                    {bk.date && <span>📅 Khởi hành: <strong>{bk.date}</strong></span>}
                                    {bk.guests && <span>👥 Số người: <strong>{bk.guests}</strong></span>}
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
