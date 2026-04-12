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

export default function ManageCartPage() {
    const { cartOrders, updateOrderStatus, deleteOrder } = useOrder()
    const { isMod, isAdmin } = useAuth()
    const navigate = useNavigate()

    if (!isMod) return (
        <div className="container py-section text-center">
            <p style={{ color: '#dc2626', fontSize: 18 }}>⛔ Chỉ Admin/Mod mới xem được trang này.</p>
            <button className="btn3d btn3d-blue btn-sm" style={{ marginTop: 16 }} onClick={() => navigate('/')}>← Trang chủ</button>
        </div>
    )

    const pending = cartOrders.filter(o => o.status === 'pending').length

    return (
        <div className="page-enter">
            <div className="manage-hero">
                <div className="container">
                    <button className="btn-back-white" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Quay lại</button>
                    <h1>🛒 Quản Lý Giỏ Hàng</h1>
                    <p>Tổng <strong>{cartOrders.length}</strong> đơn &nbsp;·&nbsp; <strong>{pending}</strong> đang chờ xử lý</p>
                </div>
            </div>

            <div className="container py-section">
                {cartOrders.length === 0 ? (
                    <p className="empty-state">Chưa có đơn giỏ hàng nào 📦</p>
                ) : (
                    <div className="manage-list">
                        {cartOrders.map(order => (
                            <div key={order.id} className="manage-card">
                                <div className="manage-card-top">
                                    <div className="manage-card-info">
                                        <strong className="manage-name">{order.name}</strong>
                                        <span className="manage-phone">📞 {order.phone}</span>
                                        <span className="manage-date">🕐 {order.date}</span>
                                        {order.address && <span className="manage-addr">📍 {order.address}</span>}
                                    </div>
                                    <div className="manage-card-actions">
                                        <select
                                            className={`status-select status-${order.status}`}
                                            value={order.status}
                                            onChange={e => updateOrderStatus('cart', order.id, e.target.value)}>
                                            {STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                        </select>
                                        {isAdmin && (
                                            <button className="btn-card-del" onClick={() => deleteOrder('cart', order.id)}>
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {order.note && <p className="manage-note">📝 {order.note}</p>}

                                <div className="manage-items">
                                    <p className="manage-items-title">Sản phẩm:</p>
                                    {order.items.map((item, i) => (
                                        <div key={i} className="manage-item-row">
                                            {item.img && <img src={item.img} alt={item.title} className="manage-item-img" />}
                                            <div className="manage-item-detail">
                                                <strong>{item.title}</strong>
                                                <span> × {item.qty}</span>
                                                {item.price && <span className="manage-item-price"> — {item.price}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
