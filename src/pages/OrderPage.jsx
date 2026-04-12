import { useState } from 'react'
import { Phone, Package, Truck, Shield, Check, ChevronRight } from 'lucide-react'
import { useUI } from '../context/UIContext'
import { useOrder } from '../context/OrderContext'

const PRICE_TABLE = [
  { weight: '0 – 0.5 kg', vn: '45.000đ', cn: '25.000đ' },
  { weight: '0.5 – 1 kg', vn: '65.000đ', cn: '35.000đ' },
  { weight: '1 – 3 kg', vn: '80.000đ', cn: '50.000đ' },
  { weight: '3 – 5 kg', vn: '110.000đ', cn: '70.000đ' },
  { weight: '> 5 kg', vn: 'Liên hệ', cn: 'Liên hệ' },
]

const STEPS = [
  { icon: <Package size={28} />, title: 'Chọn hàng Taobao', desc: 'Tìm sản phẩm yêu thích trên app/web Taobao, sao chép link' },
  { icon: <ChevronRight size={28} />, title: 'Gửi link cho HTM', desc: 'Paste link vào form bên dưới hoặc gửi qua Zalo 0385.737.705' },
  { icon: <Truck size={28} />, title: 'Thanh toán & chờ hàng', desc: 'HTM đặt hàng và vận chuyển về Việt Nam trong 7-10 ngày' },
  { icon: <Check size={28} />, title: 'Nhận hàng tại nhà', desc: 'Hàng được đóng gói cẩn thận, giao tận nơi toàn quốc' },
]

export default function OrderPage() {
  const { showToast } = useUI()
  const { submitTaobaoOrder } = useOrder()
  const [form, setForm] = useState({ name: '', phone: '', link: '', desc: '', qty: 1, note: '' })
  const [submitted, setSubmitted] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    submitTaobaoOrder({ name: form.name, phone: form.phone, link: form.link, desc: form.desc, qty: form.qty, note: form.note })
    setSubmitted(true)
    showToast('✅ Đã gửi đơn! Admin/Mod sẽ liên hệ xác nhận trong 30 phút.')
    setForm({ name: '', phone: '', link: '', desc: '', qty: 1, note: '' })
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <div className="page-enter">
      <div className="page-hero" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80)' }}>
        <div className="ph-overlay" />
        <div className="ph-content">
          <h1>🛒 Order Taobao</h1>
          <p>Đặt hàng Trung Quốc giá gốc – Vận chuyển nhanh – An toàn</p>
        </div>
      </div>

      {/* STEPS */}
      <section className="order-steps-section">
        <div className="container">
          <h2 className="section-heading text-center">Quy Trình Đặt Hàng</h2>
          <div className="order-steps">
            {STEPS.map((s, i) => (
              <div key={i} className="order-step">
                <div className="step-num-wrap">
                  <div className="step-circle">{i + 1}</div>
                  {i < STEPS.length - 1 && <div className="step-line" />}
                </div>
                <div className="step-icon-box">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
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
            <h2 className="section-heading">📋 Gửi Yêu Cầu Đặt Hàng</h2>
            {submitted
              ? <div className="success-box"><Check size={40} color="#16a34a" /><h3>Đã Gửi Thành Công!</h3><p>HTM sẽ liên hệ trong 30 phút qua số {form.phone || 'bạn cung cấp'}.</p></div>
              : <form onSubmit={submit} className="login-form">
                <input className="form-input" placeholder="Họ và tên *" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input className="form-input" type="tel" placeholder="Số điện thoại *" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })} required />
                <input className="form-input" placeholder="Link sản phẩm Taobao *" value={form.link}
                  onChange={e => setForm({ ...form, link: e.target.value })} required />
                <div className="form-2col">
                  <input className="form-input" placeholder="Tên / mô tả hàng" value={form.desc}
                    onChange={e => setForm({ ...form, desc: e.target.value })} />
                  <input className="form-input" type="number" min="1" placeholder="Số lượng" value={form.qty}
                    onChange={e => setForm({ ...form, qty: e.target.value })} />
                </div>
                <textarea className="form-input form-textarea" style={{ minHeight: 70 }}
                  placeholder="Ghi chú (màu sắc, size, yêu cầu đặc biệt...)"
                  value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
                <button type="submit" className="btn3d btn3d-orange btn-full">🚀 Gửi Đơn Hàng</button>
                <a href="tel:0385737705" className="btn3d btn3d-blue btn-full" style={{ textAlign: 'center', marginTop: 8 }}>
                  <Phone size={15} /> Gọi Tư Vấn 0385.737.705
                </a>
              </form>
            }
          </div>

          {/* PRICE TABLE */}
          <div className="price-card">
            <h2 className="section-heading">💰 Bảng Giá Vận Chuyển</h2>
            <table className="price-table">
              <thead>
                <tr><th>Cân nặng</th><th>🇻🇳 Nội địa</th><th>🇨🇳 Trung Quốc</th></tr>
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
              {[{ icon: <Shield size={18} />, text: 'Bảo hiểm hàng hóa 100%' }, { icon: <Truck size={18} />, text: 'Theo dõi đơn hàng realtime' }, { icon: <Check size={18} />, text: 'Hoàn tiền nếu hàng lỗi' }].map((g, i) => (
                <div key={i} className="guarantee-item"><span className="g-icon">{g.icon}</span>{g.text}</div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
