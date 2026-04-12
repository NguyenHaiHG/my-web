import { useNavigate } from 'react-router-dom'
import { Trash2, ArrowLeft } from 'lucide-react'
import { useOrder } from '../context/OrderContext'
import { useAuth } from '../context/AuthContext'

const STATUS_OPTS = [
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'shipped', label: 'Đang vận chuyển' },
    { value: 'done', label: 'Hoàn thành' },
    { value: 'cancelled', label: 'Đã huỷ' },
]

export default function ManageTaobaoPage() {
    const { taobaoOrders, updateOrderStatus, deleteOrder } = useOrder()
    const { isMod, isAdmin } = useAuth()
    const navigate = useNavigate()

    if (!isMod) return (
        <div className="container py-section text-center">
            <p style={{ color: '#dc2626', fontSize: 18 }}>⛔ Chỉ Admin/Mod mới xem được trang này.</p>
            <button className="btn3d btn3d-blue btn-sm" style={{ marginTop: 16 }} onClick={() => navigate('/')}>← Trang chủ</button>
        </div>
    )

    const pending = taobaoOrders.filter(o => o.status === 'pending').length

    return (
        <div className="page-enter">
            <div className="manage-hero" style={{ background: 'linear-gradient(135deg,#dc2626,#f97316)' }}>
                <div className="container">
                    <button className="btn-back-white" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Quay lại</button>
                    <h1>📦 Quản Lý Kho Taobao</h1>
                    <p>Tổng <strong>{taobaoOrders.length}</strong> đơn &nbsp;·&nbsp; <strong>{pending}</strong> đang chờ xử lý</p>
                </div>
            </div>

            <div className="container py-section">
                {taobaoOrders.length === 0 ? (
                    <p className="empty-state">Chưa có đơn Taobao nào 📦</p>
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
                                    {ord.desc && <span>🏷️ Mặt hàng: <strong>{ord.desc}</strong></span>}
                                    {ord.qty && <span>📦 Số lượng: <strong>{ord.qty}</strong></span>}
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
