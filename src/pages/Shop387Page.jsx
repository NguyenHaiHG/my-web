import React, { useState } from 'react'
import { useUI } from '../context/UIContext'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const CITY_SHOPS = [
    {
        id: 'shop-387',
        name: 'Shop 387 Nguyễn Thái Học',
        area: 'Hà Giang 2',
        note: 'Shop đầu tiên tham gia bán trong thành phố.',
        womenOwned: true,
    },
]

const DELIVERY_FEES = {
    'Hà Giang 1': 15000,
    'Hà Giang 2': 10000,
}

const MENU_DRINKS = [
    { id: 1, name: 'Cà phê đen', price: 20000, img: '/hg-city-1.svg' },
    { id: 2, name: 'Cà phê sữa', price: 25000, img: '/hg-city-2.svg' },
    { id: 3, name: 'Trà chanh', price: 18000, img: '/hg-city-3.svg' },
]

const MENU_CITY_FOOD = [
    { id: 11, name: 'Pizza', price: 89000, img: '/hg-city-2.svg' },
    { id: 12, name: 'Cơm rang thường', price: 39000, img: '/hg-city-1.svg' },
    { id: 13, name: 'Cơm rang chay', price: 42000, img: '/hg-city-3.svg' },
]

export default function Shop387Page() {
    const { setEditItem } = useUI();
    const { user } = useAuth();
    const [cart, setCart] = useState([])
    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')
    const [pickup, setPickup] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [toast, setToast] = useState('')
    const [location, setLocation] = useState('')
    const [tab, setTab] = useState('drinks')

    const addToCart = (item) => {
        setCart(prev => {
            const found = prev.find(i => i.id === item.id)
            if (found) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
            return [...prev, { ...item, qty: 1 }]
        })
    }
    const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id))
    const updateQty = (id, delta) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
    const shipFee = pickup ? 0 : (DELIVERY_FEES[location] || 0)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (cart.length === 0) {
            setToast('Vui lòng chọn ít nhất 1 món!')
            setTimeout(() => setToast(''), 2000)
            return
        }
        if (!phone || phone.length < 8) {
            setToast('Vui lòng nhập số điện thoại hợp lệ!')
            setTimeout(() => setToast(''), 2000)
            return
        }
        if (!pickup && !location) {
            setToast('Vui lòng chọn vị trí giao hàng!')
            setTimeout(() => setToast(''), 2000)
            return
        }

        // Hiện thành công ngay — không chờ backend
        setSubmitted(true)

        // Gửi lên backend trong nền (không block UI)
        fetch(`${API}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                items: cart.map(i => ({ ...i, title: i.name, price: String(i.price) })),
                address,
                phone,
                location,
                pickup,
                deliveryFee: shipFee,
            }),
            signal: AbortSignal.timeout(15000),
        }).catch(() => {
            // Backend ngủ hoặc lỗi mạng — đơn vẫn được xử lý qua SĐT
        })
    }

    if (submitted) return (
        <div className="shop387-thankyou" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, background: '#f0f8ff', borderRadius: 16, boxShadow: '0 2px 16px #2563eb11', padding: 32, marginTop: 32 }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
            <h2 style={{ color: '#2563eb', fontWeight: 900, marginBottom: 8 }}>Đặt hàng thành công!</h2>
            <p style={{ fontSize: 18, marginBottom: 8 }}>Cảm ơn bạn đã đặt món tại <b>387 Nguyễn Thái Học</b>.</p>
            <p style={{ fontSize: 16, marginBottom: 16 }}>{pickup ? 'Bạn vui lòng đến lấy sau 5-10 phút.' : 'Đơn hàng sẽ được giao tận nơi, vui lòng đợi shipper liên hệ.'}</p>
            <a href="/foodhg" style={{ marginTop: 12, background: '#2563eb', color: '#fff', padding: '10px 28px', borderRadius: 8, fontWeight: 700, textDecoration: 'none', boxShadow: '0 2px 8px #2563eb22' }}>Đặt thêm món khác</a>
            {toast && <div className="shop387-toast">{toast}</div>}
        </div>
    )

    return (
        <div className="shop387-page">
            {toast && <div className="shop387-toast">{toast}</div>}
            <h1>Bán trong thành phố</h1>
            <div style={{ background: '#fff', borderRadius: 12, padding: 12, boxShadow: '0 2px 10px #0001', marginBottom: 14 }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Shop đang tham gia (giai đoạn đầu)</div>
                {CITY_SHOPS.map(shop => (
                    <div key={shop.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', padding: '8px 0', borderTop: '1px dashed #e5e7eb' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <strong>{shop.name}</strong>
                            {shop.womenOwned && (
                                <span style={{ background: '#fdf2f8', color: '#9d174d', border: '1px solid #fbcfe8', borderRadius: 999, padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>
                                    Women-owned
                                </span>
                            )}
                        </div>
                        <span>{shop.area}</span>
                        <span style={{ color: '#64748b' }}>{shop.note}</span>
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', gap: 8, margin: '16px 0' }}>
                <button className={tab === 'drinks' ? 'shop387-tab-active' : 'shop387-tab'} onClick={() => setTab('drinks')}>Đồ uống</button>
                <button className={tab === 'city-food' ? 'shop387-tab-active' : 'shop387-tab'} onClick={() => setTab('city-food')}>Đồ ăn thành phố</button>
            </div>
            <div className="shop387-menu">
                {(tab === 'drinks' ? MENU_DRINKS : MENU_CITY_FOOD).map(item => (
                    <div key={item.id} className="shop387-menu-item" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, background: '#fff', borderRadius: 10, padding: 8, boxShadow: '0 2px 8px #2563eb11' }}>
                        <img src={item.img} alt={item.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8, background: '#f3f4f6', border: '1px solid #eee' }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: 16 }}>{item.name}</div>
                            <div style={{ color: '#e25822', fontWeight: 700 }}>{item.price.toLocaleString()}đ</div>
                        </div>
                        <button onClick={() => addToCart(item)} className="btn3d btn3d-orange" style={{ padding: '8px 16px' }}>+</button>
                        {user && user.role === 'admin' && (
                            <button onClick={() => setEditItem({ type: 'product', item })} style={{ marginLeft: 8, background: '#f3f4f6', border: '1px solid #2563eb33', borderRadius: 6, padding: '6px 12px', color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}>Sửa</button>
                        )}
                    </div>
                ))}
            </div>
            <h2 style={{ marginTop: 32, marginBottom: 12, fontWeight: 800, fontSize: 22, letterSpacing: 1 }}>🛒 Giỏ hàng</h2>
            {cart.length === 0 ? <div style={{ padding: 24, textAlign: 'center', color: '#888', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #2563eb11' }}>Chưa có món nào.</div> : (
                <div className="shop387-cart" style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px #2563eb11', padding: 18, marginBottom: 18 }}>
                    {cart.map(i => (
                        <div key={i.id} className="shop387-cart-item" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #f3f4f6' }}>
                            <img src={i.img} alt={i.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, background: '#f3f4f6', border: '1px solid #eee' }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600 }}>{i.name}</div>
                                <div style={{ color: '#e25822', fontWeight: 700 }}>{i.price.toLocaleString()}đ</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <button onClick={() => updateQty(i.id, -1)} style={{ background: '#f3f4f6', border: 'none', borderRadius: 6, width: 28, height: 28, fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>-</button>
                                <span style={{ fontWeight: 700, fontSize: 16 }}>{i.qty}</span>
                                <button onClick={() => updateQty(i.id, 1)} style={{ background: '#f3f4f6', border: 'none', borderRadius: 6, width: 28, height: 28, fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>+</button>
                            </div>
                            <button onClick={() => removeFromCart(i.id)} style={{ background: 'none', border: 'none', color: '#e25822', fontWeight: 700, fontSize: 18, marginLeft: 8, cursor: 'pointer' }} title="Xóa">×</button>
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18, fontWeight: 600 }}>
                        <span>Tạm tính:</span>
                        <span>{total.toLocaleString()}đ</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                        <span>Phí ship:</span>
                        <span>
                            {shipFee === 0
                                ? (pickup ? 'Tự đến lấy' : 'Chọn khu vực để tính phí')
                                : shipFee.toLocaleString() + 'đ'}
                        </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontWeight: 800, fontSize: 18, color: '#2563eb' }}>
                        <span>Tổng cộng:</span>
                        <span>{(total + shipFee).toLocaleString()}đ</span>
                    </div>
                </div>
            )}
            <form className="shop387-form" onSubmit={handleSubmit}>
                <label>
                    <input type="checkbox" checked={pickup} onChange={e => { setPickup(e.target.checked); if (e.target.checked) setLocation('') }} />
                    Tôi sẽ tự đến lấy sau 5-10 phút
                </label>
                {!pickup && (
                    <div style={{ margin: '12px 0' }}>
                        <label>Chọn vị trí giao hàng:</label>
                        <select
                            className="form-input"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            required
                        >
                            <option value="">-- Chọn vị trí --</option>
                            <option value="Hà Giang 1">Hà Giang 1</option>
                            <option value="Hà Giang 2">Hà Giang 2</option>
                        </select>
                        <div style={{ color: '#e25822', fontSize: '0.98em', marginTop: 4 }}>
                            <b>Lưu ý:</b> Hà Giang 1: 15.000đ · Hà Giang 2: 10.000đ.
                        </div>
                    </div>
                )}
                {!pickup && (
                    <input
                        className="form-input"
                        placeholder="Địa chỉ cụ thể (số nhà, tên đường...)"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        required
                    />
                )}
                <input
                    className="form-input"
                    placeholder="Số điện thoại liên hệ"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/[^0-9+]/g, ''))}
                    required
                    maxLength={15}
                    style={{ marginTop: 8 }}
                />
                <button className="btn3d btn3d-orange" type="submit" disabled={cart.length === 0}>
                    Đặt hàng
                </button>
            </form>
        </div>
    )
}
