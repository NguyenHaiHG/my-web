import { useNavigate } from 'react-router-dom'
import { ChevronRight, MapPin, Heart, Leaf, Users, ArrowRight, Calendar, User } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useLang } from '../context/LanguageContext'

const PROGRAM_ICONS = ['🪡', '📚', '🌿', '🙋']
const PROGRAM_LINKS = ['/workshop', '/thu-vien', '/tours', '/tinh-nguyen']
const PROGRAM_COLORS = ['#7c3aed', '#1a6b8a', '#2d6a4f', '#c05621']
const STATS_NUMS = ['12+', '3', '4', '200+']
const STAT_KEYS = ['hp_stat1', 'hp_stat2', 'hp_stat3', 'hp_stat4']
const PROG_KEYS = [
  ['hp_prog1_title', 'hp_prog1_desc'],
  ['hp_prog2_title', 'hp_prog2_desc'],
  ['hp_prog3_title', 'hp_prog3_desc'],
  ['hp_prog4_title', 'hp_prog4_desc'],
]

export default function HomePage() {
  const navigate = useNavigate()
  const { posts, reviews } = useData()
  const { t } = useLang()

  const recentPosts = posts.slice(0, 3)
  const approvedReviews = reviews.filter(r => r.approved).slice(0, 3)

  return (
    <div className="page-enter">

      {/* ═══ HERO ═══ */}
      <section className="ng-hero">
        <div className="ng-hero-bg" />
        <div className="ng-hero-overlay" />
        <div className="ng-hero-content">
          <span className="ng-hero-eyebrow">
            <MapPin size={13} /> {t('hp_eyebrow')}
          </span>
          <h1>{t('hp_h1_pre')} <span className="ng-hl">{t('hp_h1_hl')}</span><br />{t('hp_h1_post')}</h1>
          <p>{t('hp_hero_sub')}</p>
          <div className="ng-hero-btns">
            <button className="btn3d btn3d-orange" onClick={() => navigate('/cong-dong')}>
              {t('hp_hero_btn1')} <ArrowRight size={16} />
            </button>
            <button className="btn3d btn3d-outline-white" onClick={() => navigate('/tinh-nguyen')}>
              {t('hp_hero_btn2')}
            </button>
          </div>
        </div>
        <div className="ng-hero-scroll" onClick={() => document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' })}>
          <div className="scroll-arrow" />
        </div>
      </section>

      {/* ═══ IMPACT NUMBERS ═══ */}
      <section id="impact" className="ng-impact">
        <div className="container ng-impact-grid">
          {STATS_NUMS.map((num, i) => (
            <div key={i} className="ng-stat">
              <strong>{num}</strong>
              <span>{t(STAT_KEYS[i])}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ OUR STORY ═══ */}
      <section className="ng-story">
        <div className="container ng-story-inner">
          <div className="ng-story-img">
            <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" alt="Cảnh quan Hà Giang" />
            <div className="ng-story-badge">
              <MapPin size={14} /> {t('hp_story_badge')}
            </div>
          </div>
          <div className="ng-story-text">
            <span className="section-label">{t('hp_story_label')}</span>
            <h2>{t('hp_story_h2')}</h2>
            <p>{t('hp_story_p1')}</p>
            <p>
              {t('hp_story_p2').split(t('hp_story_p2_em1'))[0]}
              <strong>{t('hp_story_p2_em1')}</strong>
              {t('hp_story_p2').split(t('hp_story_p2_em1'))[1]?.split(t('hp_story_p2_em2'))[0]}
              <strong>{t('hp_story_p2_em2')}</strong>
              {t('hp_story_p2').split(t('hp_story_p2_em2'))[1]?.split(t('hp_story_p2_em3'))[0]}
              <strong>{t('hp_story_p2_em3')}</strong>
              {t('hp_story_p2').split(t('hp_story_p2_em3'))[1]}
            </p>
            <button className="btn3d btn3d-green" onClick={() => navigate('/cong-dong')}>
              {t('hp_story_btn')} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ═══ PROGRAMS ═══ */}
      <section className="ng-programs">
        <div className="container">
          <div className="section-header-center">
            <span className="section-label">{t('hp_prog_label')}</span>
            <h2>{t('hp_prog_h2')}</h2>
          </div>
          <div className="ng-programs-grid">
            {PROG_KEYS.map(([tk, dk], i) => (
              <div key={i} className="ng-program-card" onClick={() => navigate(PROGRAM_LINKS[i])}>
                <span className="ng-prog-icon">{PROGRAM_ICONS[i]}</span>
                <h3>{t(tk)}</h3>
                <p>{t(dk)}</p>
                <span className="ng-prog-link">{t('hp_prog_cta')} <ArrowRight size={13} /></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LATEST BLOG ═══ */}
      {recentPosts.length > 0 && (
        <section className="ng-blog">
          <div className="container">
            <div className="row-between">
              <div>
                <span className="section-label">{t('hp_blog_label')}</span>
                <h2 style={{ marginTop: 4 }}>{t('home_recent_posts')}</h2>
              </div>
              <button className="btn-text-link" onClick={() => navigate('/blog')}>
                {t('home_see_all')} <ChevronRight size={16} />
              </button>
            </div>
            <div className="prev-grid mt-6">
              {recentPosts.map(post => (
                <div key={post.id} className="prev-card" onClick={() => navigate(`/blog/${post.id}`)}>
                  {post.img && <div className="prev-img" style={{ backgroundImage: `url(${post.img})` }} />}
                  <div className="prev-body">
                    <strong>{post.title}</strong>
                    <div className="blog-meta" style={{ marginTop: 4 }}>
                      {post.date && <span><Calendar size={11} /> {post.date}</span>}
                      {post.author && <span><User size={11} /> {post.author}</span>}
                    </div>
                    <div className="row-between" style={{ marginTop: 8 }}>
                      <span style={{ fontSize: 13, color: '#64748b' }}>{(post.content || '').slice(0, 60)}...</span>
                      <ChevronRight size={16} color="#f97316" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ REVIEWS ═══ */}
      <section className="ng-reviews">
        <div className="container">
          <div className="section-header-center">
            <span className="section-label">{t('hp_review_label')}</span>
            <h2>{t('hp_review_h2')}</h2>
          </div>
          <div className="ng-reviews-grid">
            {(approvedReviews.length > 0 ? approvedReviews : [
              { id: 'r1', name: 'Tom H. (UK)', rating: 5, content: 'Cảnh quan tuyệt đẹp, người dân ấm áp. Đây là nơi tôi muốn quay lại nhất trong chuyến Đông Nam Á.', country: 'Vương Quốc Anh' },
              { id: 'r2', name: 'Mei T. (Japan)', rating: 5, content: 'Workshop thêu thổ cẩm thực sự thú vị. Tôi học được kỹ thuật mà không nơi nào khác có thể dạy.', country: 'Nhật Bản' },
              { id: 'r3', name: 'Nguyễn A. (Hà Nội)', rating: 5, content: 'Lên đây mới hiểu tại sao người ta nói Hà Giang Loop đẹp nhất Việt Nam. Bản làng này là viên ngọc ẩn.', country: 'Việt Nam' },
            ]).map(r => (
              <div key={r.id} className="ng-review-card">
                <div className="ng-review-stars">{'⭐'.repeat(r.rating || 5)}</div>
                <p>"{r.content}"</p>
                <div className="ng-review-author">
                  <strong>{r.name}</strong>
                  {r.country && <span> · {r.country}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ GET INVOLVED CTA ═══ */}
      <section className="ng-cta">
        <div className="ng-cta-overlay" />
        <div className="container ng-cta-inner">
          <span className="section-label" style={{ color: 'rgba(255,255,255,0.8)' }}>{t('hp_cta_label')}</span>
          <h2>{t('hp_cta_h2')}</h2>
          <p>{t('hp_cta_sub')}</p>
          <div className="ng-cta-btns">
            <button className="btn3d btn3d-orange" onClick={() => navigate('/tinh-nguyen')}>
              <Heart size={16} /> {t('hp_cta_btn1')}
            </button>
            <button className="btn3d btn3d-green" onClick={() => navigate('/workshop')}>
              <Users size={16} /> {t('hp_cta_btn2')}
            </button>
            <button className="btn3d btn3d-blue" onClick={() => navigate('/tours')}>
              <Leaf size={16} /> {t('hp_cta_btn3')}
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}
