import { useNavigate } from 'react-router-dom'
import { ChevronRight, Phone, Calendar, User } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useLang } from '../context/LanguageContext'

export default function HomePage() {
  const navigate = useNavigate()
  const { posts } = useData()
  const { t } = useLang()

  const recentPosts = posts.slice(0, 3)

  return (
    <div className="page-enter">
      {/* HERO */}
      <section className="hero">
        <div className="hero-particles">
          {[...Array(20)].map((_, i) => <div key={i} className="particle" style={{ '--i': i }} />)}
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">📝 {t('hero_badge')}</div>
          <h1>{t('hero_h1_blog')} <span className="highlight">{t('hero_blog_name')}</span></h1>
          <p className="hero-sub">{t('hero_sub')}</p>
          <div className="hero-buttons">
            <button className="btn3d btn3d-orange" onClick={() => navigate('/blog')}>📝 {t('hero_btn_blog')}</button>
            <button className="btn3d btn3d-blue" onClick={() => navigate('/lien-he')}>📞 {t('hero_btn_contact')}</button>
          </div>
        </div>
        <div className="hero-scroll-hint" onClick={() => document.getElementById('recent')?.scrollIntoView({ behavior: 'smooth' })}>
          <div className="scroll-arrow" />
        </div>
      </section>

      {/* RECENT POSTS */}
      <section id="recent" className="home-section">
        <div className="container">
          <div className="row-between">
            <h2 className="section-heading">📝 {t('home_recent_posts')}</h2>
            <button className="btn-text-link" onClick={() => navigate('/blog')}>{t('home_see_all')} <ChevronRight size={16} /></button>
          </div>
          <div className="prev-grid">
            {recentPosts.length > 0 ? recentPosts.map(post => (
              <div key={post.id} className="prev-card" onClick={() => navigate(`/blog/${post.id}`)}>
                {post.img && <div className="prev-img" style={{ backgroundImage: `url(${post.img})` }} />}
                <div className="prev-body">
                  <strong>{post.title}</strong>
                  <div className="blog-meta" style={{ marginTop: 4 }}>
                    {post.date && <span><Calendar size={11} /> {post.date}</span>}
                    {post.author && <span><User size={11} /> {post.author}</span>}
                  </div>
                  <div className="row-between" style={{ marginTop: 8 }}>
                    <span className="prev-price" style={{ fontSize: 13, color: '#64748b' }}>
                      {(post.content || '').slice(0, 60)}...
                    </span>
                    <ChevronRight size={16} color="#f97316" />
                  </div>
                </div>
              </div>
            )) : (
              <p style={{ color: '#94a3b8' }}>{t('blog_empty')}</p>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <div className="home-cta-overlay" />
        <div className="container cta-inner">
          <h2>{t('cta_title')}</h2>
          <p>{t('cta_sub')}</p>
          <div className="cta-btns">
            <a href="tel:0385737705" className="btn3d btn3d-orange"><Phone size={16} /> {t('cta_call')}</a>
            <a href="https://wa.me/84385737705" target="_blank" rel="noreferrer" className="btn3d btn3d-green">💬 WhatsApp</a>
            <button className="btn3d btn3d-blue" onClick={() => navigate('/lien-he')}>📋 {t('cta_consult')}</button>
          </div>
        </div>
      </section>
    </div>
  )
}
