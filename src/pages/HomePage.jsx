import { useNavigate } from 'react-router-dom'
import { ChevronRight, Phone, Star, MapPin } from 'lucide-react'
import { useUI } from '../context/UIContext'

export default function HomePage() {
  const navigate = useNavigate()
  const { showToast } = useUI()

  const services = [
    { icon:'🗺️', title:'Tour Hà Giang',   desc:'Trọn gói 2-4 ngày, ruộng bậc thang, đỉnh núi huyền ảo', to:'/tours',   color:'#f97316' },
    { icon:'🛒', title:'Order Taobao',     desc:'Đặt hàng Trung Quốc giá gốc, vận chuyển 7-10 ngày', to:'/order',   color:'#2563eb' },
    { icon:'🍯', title:'Đặc Sản Hà Giang', desc:'Mật ong bạc hà, trà hoa vàng, thịt trâu gác bếp', to:'/dac-san', color:'#16a34a' },
    { icon:'📝', title:'Blog & Tin Tức',   desc:'Kinh nghiệm du lịch, hướng dẫn order, tin tức mới', to:'/blog',    color:'#7c3aed' },
  ]

  const featured = [
    { img:'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&q=80', title:'Tour Đồng Văn – Mã Pí Lèng', price:'2.500.000đ', stars:5 },
    { img:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', title:'Homestay Hoàng Su Phì',    price:'800.000đ/đêm', stars:5 },
    { img:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', title:'Trekking Đỉnh Mây',        price:'1.800.000đ',   stars:4 },
  ]

  return (
    <div className="page-enter">
      {/* HERO */}
      <section className="hero">
        <div className="hero-particles">
          {[...Array(20)].map((_,i) => <div key={i} className="particle" style={{'--i':i}}/>)}
        </div>
        <div className="hero-overlay"/>
        <div className="hero-content">
          <div className="hero-badge">🏔️ Khám Phá Vùng Cao</div>
          <h1>Khám Phá <span className="highlight">Hà Giang</span><br/>Đặt Hàng <span className="highlight-gold">Taobao</span></h1>
          <p className="hero-sub">HTM Trường Hải – Đồng hành cùng bạn!</p>
          <div className="hero-buttons">
            <button className="btn3d btn3d-orange" onClick={() => navigate('/tours')}>🗺️ Tour Hà Giang</button>
            <button className="btn3d btn3d-blue"   onClick={() => navigate('/order')}>🛒 Order Taobao</button>
          </div>
          <div className="hero-stats">
            <div className="stat"><strong>500+</strong><span>Khách hài lòng</span></div>
            <div className="stat-div"/>
            <div className="stat"><strong>50+</strong><span>Tour đã tổ chức</span></div>
            <div className="stat-div"/>
            <div className="stat"><strong>5★</strong><span>Đánh giá</span></div>
          </div>
        </div>
        <div className="hero-scroll-hint" onClick={() => document.getElementById('svc')?.scrollIntoView({behavior:'smooth'})}>
          <div className="scroll-arrow"/>
        </div>
      </section>

      {/* DỊCH VỤ */}
      <section id="svc" className="home-section">
        <div className="container">
          <h2 className="section-heading text-center">Dịch Vụ Của Chúng Tôi</h2>
          <p className="section-sub text-center">Tất cả trong một nền tảng – du lịch, mua sắm, đặc sản</p>
          <div className="svc-grid">
            {services.map(s => (
              <button key={s.to} className="svc-card" onClick={() => navigate(s.to)} style={{'--c': s.color}}>
                <div className="svc-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span className="svc-arrow"><ChevronRight size={18}/></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TOUR NỔI BẬT */}
      <section className="home-section home-section-gray">
        <div className="container">
          <div className="row-between">
            <h2 className="section-heading">🗺️ Tour Nổi Bật</h2>
            <button className="btn-text-link" onClick={() => navigate('/tours')}>Xem tất cả <ChevronRight size={16}/></button>
          </div>
          <div className="prev-grid">
            {featured.map((t,i) => (
              <div key={i} className="prev-card" onClick={() => navigate('/tours')}>
                <div className="prev-img" style={{backgroundImage:`url(${t.img})`}}>
                  <div className="prev-stars">
                    {[...Array(t.stars)].map((_,j) => <Star key={j} size={12} fill="#fbbf24" color="#fbbf24"/>)}
                  </div>
                </div>
                <div className="prev-body">
                  <strong>{t.title}</strong>
                  <div className="row-between"><span className="prev-price">{t.price}</span><ChevronRight size={16} color="#f97316"/></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <div className="home-cta-overlay"/>
        <div className="container cta-inner">
          <h2>Sẵn Sàng Khám Phá <span className="highlight">Hà Giang</span>?</h2>
          <p>Liên hệ ngay để được tư vấn miễn phí và nhận ưu đãi đặc biệt</p>
          <div className="cta-btns">
            <a href="tel:0385737705" className="btn3d btn3d-orange"><Phone size={16}/> Gọi 0385.737.705</a>
            <button className="btn3d btn3d-blue" onClick={() => navigate('/lien-he')}>📋 Yêu Cầu Tư Vấn</button>
          </div>
        </div>
      </section>
    </div>
  )
}
