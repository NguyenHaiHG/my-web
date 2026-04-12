import { useState } from 'react'
import { Phone, MessageSquare, MapPin, Clock, Send, Check } from 'lucide-react'
import { useUI } from '../context/UIContext'

export default function ContactPage() {
  const { showToast } = useUI()
  const [form, setForm] = useState({name:'',phone:'',email:'',service:'',msg:''})
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    setSent(true)
    showToast('✅ Đã nhận yêu cầu tư vấn! HTM sẽ phản hồi trong 30 phút.')
    setForm({name:'',phone:'',email:'',service:'',msg:''})
  }

  const contactCards = [
    { icon:<Phone size={24}/>, label:'Hotline', value:'0385.737.705', link:'tel:0385737705', color:'#f97316' },
    { icon:<MessageSquare size={24}/>, label:'Zalo', value:'Chat ngay 0385.737.705', link:'https://zalo.me/0385737705', color:'#2563eb' },
    { icon:<MapPin size={24}/>, label:'Địa chỉ', value:'Hà Giang, Việt Nam', link:'#', color:'#16a34a' },
    { icon:<Clock size={24}/>, label:'Giờ làm việc', value:'7:00 – 22:00 hằng ngày', link:'#', color:'#7c3aed' },
  ]

  return (
    <div className="page-enter">
      <div className="page-hero" style={{backgroundImage:'url(https://images.unsplash.com/photo-1540975038511-ad92c58acd41?w=1400&q=80)'}}>
        <div className="ph-overlay"/>
        <div className="ph-content">
          <h1>📞 Liên Hệ HTM Trường Hải</h1>
          <p>Luôn sẵn sàng tư vấn và đồng hành cùng bạn</p>
        </div>
      </div>

      {/* CONTACT CARDS */}
      <section className="container py-section">
        <div className="contact-cards">
          {contactCards.map((c,i)=>(
            <a key={i} href={c.link} target={c.link.startsWith('http')?'_blank':'_self'} rel="noreferrer" className="ct-card" style={{'--cc': c.color}}>
              <div className="ct-icon">{c.icon}</div>
              <div>
                <div className="ct-label">{c.label}</div>
                <div className="ct-value">{c.value}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* FORM + MAP */}
      <section className="container contact-layout">
        <div className="contact-form-card">
          <h2 className="section-heading">💬 Gửi Yêu Cầu Tư Vấn</h2>
          {sent
            ? <div className="success-box">
                <Check size={48} color="#16a34a"/>
                <h3>Đã Gửi Thành Công!</h3>
                <p>HTM Trường Hải sẽ liên hệ bạn trong 30 phút làm việc.</p>
                <button className="btn3d btn3d-orange btn-sm mt-6" onClick={()=>setSent(false)}>Gửi Tiếp</button>
              </div>
            : <form onSubmit={submit} className="login-form">
                <div className="form-2col">
                  <input className="form-input" placeholder="Họ và tên *" value={form.name}
                    onChange={e=>setForm({...form,name:e.target.value})} required/>
                  <input className="form-input" type="tel" placeholder="Điện thoại *" value={form.phone}
                    onChange={e=>setForm({...form,phone:e.target.value})} required/>
                </div>
                <input className="form-input" type="email" placeholder="Email (không bắt buộc)" value={form.email}
                  onChange={e=>setForm({...form,email:e.target.value})}/>
                <select className="form-input" value={form.service} onChange={e=>setForm({...form,service:e.target.value})} required>
                  <option value="">-- Chọn dịch vụ tư vấn --</option>
                  <option value="tour">Tour Du Lịch Hà Giang</option>
                  <option value="order">Order Taobao</option>
                  <option value="dacsan">Đặc Sản Hà Giang</option>
                  <option value="other">Khác</option>
                </select>
                <textarea className="form-input form-textarea" placeholder="Nội dung cần tư vấn *"
                  value={form.msg} onChange={e=>setForm({...form,msg:e.target.value})} required/>
                <button type="submit" className="btn3d btn3d-orange btn-full">
                  <Send size={16}/> Gửi Yêu Cầu
                </button>
                <a href="tel:0385737705" className="btn3d btn3d-blue btn-full" style={{textAlign:'center',marginTop:8}}>
                  <Phone size={15}/> Gọi Ngay 0385.737.705
                </a>
              </form>
          }
        </div>

        <div className="map-card">
          <h2 className="section-heading">📍 Vị Trí</h2>
          <div className="map-embed">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58890.35985994455!2d104.92685!3d22.82348!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x36cc8b2a5ef01d9d%3A0x7d8f8f8f8f8f8f8f!2zSOG6oCBHaWFuZw!5e0!3m2!1svi!2svn!4v1681234567890"
              width="100%" height="300" style={{border:0,borderRadius:12}} allowFullScreen="" loading="lazy"
              referrerPolicy="no-referrer-when-downgrade" title="Ha Giang Map"/>
          </div>
          <div className="map-info">
            <p>🏔️ <strong>Hà Giang</strong> – Vùng cực Bắc Tổ Quốc</p>
            <p>⏱️ Cách Hà Nội khoảng 300km (6-7 tiếng lái xe)</p>
            <p>✈️ Bay đến Nội Bài rồi đi xe về Hà Giang</p>
          </div>
        </div>
      </section>
    </div>
  )
}
