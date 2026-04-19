import { useNavigate } from 'react-router-dom'
import { ChevronRight, Phone, Star } from 'lucide-react'
import { useUI } from '../context/UIContext'
import { useLang } from '../context/LanguageContext'

export default function HomePage() {
  const navigate = useNavigate()
  const { showToast } = useUI()
  const { t } = useLang()

  const services = [
    { icon: '🗺️', titleKey: 'home_svc_tour_title', descKey: 'home_svc_tour_desc', to: '/tours', color: '#f97316' },
    { icon: '🛒', titleKey: 'home_svc_order_title', descKey: 'home_svc_order_desc', to: '/order', color: '#2563eb' },
    { icon: '🍯', titleKey: 'home_svc_prod_title', descKey: 'home_svc_prod_desc', to: '/dac-san', color: '#16a34a' },
    { icon: '📝', titleKey: 'home_svc_blog_title', descKey: 'home_svc_blog_desc', to: '/blog', color: '#7c3aed' },
  ]

  const featured = [
    { img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&q=80', titleKey: 'featured_t1', priceKey: 'featured_t1_price', stars: 5 },
    { img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', titleKey: 'featured_t2', priceKey: 'featured_t2_price', stars: 5 },
    { img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', titleKey: 'featured_t3', priceKey: 'featured_t3_price', stars: 4 },
  ]

  return (
    <div className="page-enter">
      {/* HERO */}
      <section className="hero">
        <div className="hero-particles">
          {[...Array(20)].map((_, i) => <div key={i} className="particle" style={{ '--i': i }} />)}
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">🏔️ {t('hero_badge')}</div>
          <h1>{t('hero_h1_explore')} <span className="highlight">{t('hero_hagiang')}</span><br />{t('hero_h1_order')} <span className="highlight-gold">Taobao</span></h1>
          <p className="hero-sub">{t('hero_sub')}</p>
          <div className="hero-buttons">
            <button className="btn3d btn3d-orange" onClick={() => navigate('/tours')}>🗺️ {t('hero_btn_tour')}</button>
            <button className="btn3d btn3d-blue" onClick={() => navigate('/order')}>🛒 {t('hero_btn_order')}</button>
          </div>
          <div className="hero-stats">
            <div className="stat"><strong>500+</strong><span>{t('stat_customers')}</span></div>
            <div className="stat-div" />
            <div className="stat"><strong>50+</strong><span>{t('stat_tours')}</span></div>
            <div className="stat-div" />
            <div className="stat"><strong>5★</strong><span>{t('stat_rating')}</span></div>
          </div>
        </div>
        <div className="hero-scroll-hint" onClick={() => document.getElementById('svc')?.scrollIntoView({ behavior: 'smooth' })}>
          <div className="scroll-arrow" />
        </div>
      </section>

      {/* SERVICES */}
      <section id="svc" className="home-section">
        <div className="container">
          <h2 className="section-heading text-center">{t('home_svc_title')}</h2>
          <p className="section-sub text-center">{t('home_svc_sub')}</p>
          <div className="svc-grid">
            {services.map(s => (
              <button key={s.to} className="svc-card" onClick={() => navigate(s.to)} style={{ '--c': s.color }}>
                <div className="svc-icon">{s.icon}</div>
                <h3>{t(s.titleKey)}</h3>
                <p>{t(s.descKey)}</p>
                <span className="svc-arrow"><ChevronRight size={18} /></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED TOURS */}
      <section className="home-section home-section-gray">
        <div className="container">
          <div className="row-between">
            <h2 className="section-heading">🗺️ {t('home_featured')}</h2>
            <button className="btn-text-link" onClick={() => navigate('/tours')}>{t('home_see_all')} <ChevronRight size={16} /></button>
          </div>
          <div className="prev-grid">
            {featured.map((item, i) => (
              <div key={i} className="prev-card" onClick={() => navigate('/tours')}>
                <div className="prev-img" style={{ backgroundImage: `url(${item.img})` }}>
                  <div className="prev-stars">
                    {[...Array(item.stars)].map((_, j) => <Star key={j} size={12} fill="#fbbf24" color="#fbbf24" />)}
                  </div>
                </div>
                <div className="prev-body">
                  <strong>{t(item.titleKey)}</strong>
                  <div className="row-between"><span className="prev-price">{t(item.priceKey)}</span><ChevronRight size={16} color="#f97316" /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <div className="home-cta-overlay" />
        <div className="container cta-inner">
          <h2>{t('cta_title')} <span className="highlight">{t('hero_hagiang')}</span>?</h2>
          <p>{t('cta_sub')}</p>
          <div className="cta-btns">
            <a href="tel:0385737705" className="btn3d btn3d-orange"><Phone size={16} /> {t('cta_call')}</a>
            <a href="https://wa.me/84385737705" target="_blank" rel="noreferrer" className="btn3d btn3d-green">💬 {t('whatsapp_btn')}</a>
            <button className="btn3d btn3d-blue" onClick={() => navigate('/lien-he')}>📋 {t('cta_consult')}</button>
          </div>
        </div>
      </section>
    </div>
  )
}
