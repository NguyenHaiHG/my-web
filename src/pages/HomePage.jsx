import { useNavigate } from 'react-router-dom'
import { ChevronRight, MapPin, Heart, BookOpen, Leaf, Users, Star, ArrowRight, Calendar, User } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useLang } from '../context/LanguageContext'

const PROGRAMS = [
  { icon: '🪡', title: 'Workshop Phụ Nữ', desc: 'May, thêu thổ cẩm, kỹ năng số, tiếng Anh — miễn phí cho phụ nữ dân tộc.', link: '/workshop', color: '#7c3aed' },
  { icon: '📚', title: 'Thư Viện Số', desc: 'Số hoá ngôn ngữ, văn hoá, ẩm thực dân tộc — bảo tồn cho thế hệ mai sau.', link: '/thu-vien', color: '#1a6b8a' },
  { icon: '🌿', title: 'Du Lịch Bảo Tồn', desc: 'Trải nghiệm cuộc sống 4 thế hệ người dân tộc ngay cửa ngõ Hà Giang Loop.', link: '/tours', color: '#2d6a4f' },
  { icon: '🙋', title: 'Tình Nguyện Viên', desc: 'Góp tay cùng cộng đồng — dạy học, số hóa, phát triển du lịch bền vững.', link: '/tinh-nguyen', color: '#c05621' },
]

const STATS = [
  { num: '12+', label: 'Phụ nữ được đào tạo' },
  { num: '3', label: 'Workshop / tháng' },
  { num: '4', label: 'Thế hệ cùng chung sống' },
  { num: '200+', label: 'Du khách ghé thăm' },
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
            <MapPin size={13} /> Tổ 5 Quang Trung · Phường Hà Giang 2 · Tuyên Quang
          </span>
          <h1>Nơi <span className="ng-hl">4 thế hệ</span><br />người dân tộc gìn giữ bản sắc</h1>
          <p>500m khỏi cửa ngõ Hà Giang Loop — workshop phụ nữ,<br className="hero-br" />
            thư viện số, du lịch bảo tồn cảnh quan</p>
          <div className="ng-hero-btns">
            <button className="btn3d btn3d-orange" onClick={() => navigate('/cong-dong')}>
              Khám phá dự án <ArrowRight size={16} />
            </button>
            <button className="btn3d btn3d-outline-white" onClick={() => navigate('/tinh-nguyen')}>
              Trở thành TNV
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
          {STATS.map((s, i) => (
            <div key={i} className="ng-stat">
              <strong>{s.num}</strong>
              <span>{s.label}</span>
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
              <MapPin size={14} /> ~1000m · 500m khỏi Hà Giang Loop
            </div>
          </div>
          <div className="ng-story-text">
            <span className="section-label">📖 Câu chuyện của chúng tôi</span>
            <h2>Bốn thế hệ trên mảnh đất hoang sơ</h2>
            <p>
              Tổ 5 Quang Trung nằm trên sườn núi ~1.000m, cách mặt đường chính 500m —
              chỉ xe máy mới vào được. Vườn cây ăn quả trăm năm tuổi, gia đình người dân tộc
              4 thế hệ, và một cộng đồng đang chủ động bước vào thời đại mới mà không đánh mất chính mình.
            </p>
            <p>
              Trước làn sóng đô thị hoá, chúng tôi chọn <strong>trao quyền cho phụ nữ</strong> qua
              kỹ năng nghề và kỹ năng số, <strong>số hoá di sản</strong> trước khi nó biến mất,
              và <strong>mở cửa đón khách</strong> một cách có trách nhiệm.
            </p>
            <button className="btn3d btn3d-green" onClick={() => navigate('/cong-dong')}>
              Tìm hiểu dự án đầy đủ <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ═══ PROGRAMS ═══ */}
      <section className="ng-programs">
        <div className="container">
          <div className="section-header-center">
            <span className="section-label">🌱 Các chương trình</span>
            <h2>Chúng tôi đang làm gì?</h2>
          </div>
          <div className="ng-programs-grid">
            {PROGRAMS.map((p, i) => (
              <div key={i} className="ng-program-card" onClick={() => navigate(p.link)}>
                <span className="ng-prog-icon">{p.icon}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <span className="ng-prog-link">Tìm hiểu <ArrowRight size={13} /></span>
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
                <span className="section-label">📝 Tin tức & Câu chuyện</span>
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
            <span className="section-label">💬 Cảm nhận</span>
            <h2>Du khách & cộng đồng nói gì?</h2>
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
          <span className="section-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Hành động ngay hôm nay</span>
          <h2>Bạn có thể tạo ra sự khác biệt</h2>
          <p>Dù là tình nguyện viên, du khách, hay người ủng hộ — mỗi sự tham gia đều có ý nghĩa.</p>
          <div className="ng-cta-btns">
            <button className="btn3d btn3d-orange" onClick={() => navigate('/tinh-nguyen')}>
              <Heart size={16} /> Đăng ký tình nguyện
            </button>
            <button className="btn3d btn3d-green" onClick={() => navigate('/workshop')}>
              <Users size={16} /> Tham gia workshop
            </button>
            <button className="btn3d btn3d-blue" onClick={() => navigate('/tours')}>
              <Leaf size={16} /> Đặt tour bảo tồn
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}
