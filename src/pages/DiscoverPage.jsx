import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, Sparkles, BedDouble, Bus, Trophy } from 'lucide-react'
import { useData } from '../context/DataContext'
import { usePassport } from '../context/PassportContext'
import { useLang } from '../context/LanguageContext'
import { normalizeDiscoverContent, DISCOVER_DEFAULTS } from '../content/discoverDefaults'
import './DiscoverPage.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function escapeHtml(text = '') {
    return text
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;')
}

function richText(text = '') {
    return escapeHtml(text)
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br />')
}

function SectionHead({ kicker, title, desc }) {
    return (
        <div className="discover-section-head">
            <div>
                <div className="discover-kicker"><Sparkles size={13} /> {kicker}</div>
                <h2>{title}</h2>
            </div>
            <p>{desc}</p>
        </div>
    )
}

function JourneyCard({ item }) {
    return (
        <article className="discover-journal-card">
            <div className="discover-journal-media">
                <img src={item.imageUrl} alt={item.title} />
            </div>
            <div className="discover-journal-body">
                <div className="discover-journal-topline">
                    <span>{item.duration}</span>
                    <span>{item.route}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="discover-tag-row">
                    {(item.tags || []).map(tag => <span key={tag} className="discover-tag">{tag}</span>)}
                </div>
            </div>
        </article>
    )
}

function ThemeCard({ item }) {
    return (
        <article className="discover-theme-card">
            <div className="discover-theme-icon">{item.icon}</div>
            <div className="discover-theme-badge">Theme</div>
            <div className="discover-theme-body">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p style={{ marginTop: 10, fontSize: 14, color: '#7c6b56' }}>{item.note}</p>
            </div>
        </article>
    )
}

function StoryCard({ item, featured = false }) {
    if (!item) return null
    return (
        <article className={`discover-story-card${featured ? ' featured' : ''}`}>
            <div className="discover-story-media">
                <img src={item.imageUrl} alt={item.title} />
            </div>
            <div className="discover-story-body">
                <div className="discover-story-badge">{item.badge}</div>
                <h3>{item.title}</h3>
                <p><strong>{item.subtitle}</strong></p>
                <p dangerouslySetInnerHTML={{ __html: richText(item.body) }} />
                <div className="discover-quote">{item.quote}</div>
            </div>
        </article>
    )
}

function RecommendationCard({ item }) {
    return (
        <article className="discover-rec-card">
            <div className="discover-rec-media">
                <img src={item.imageUrl} alt={item.title} />
            </div>
            <div className="discover-rec-body">
                <div className="discover-rec-badge">{item.badge}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Link to={item.ctaLink} className="discover-inline-btn">
                    {item.ctaLabel} <ArrowRight size={15} />
                </Link>
            </div>
        </article>
    )
}

const FILM_SPEED_SECONDS = {
    slow: 64,
    normal: 42,
    fast: 26,
}

function FilmStrip({ items = [], settings = {}, onOpenImage }) {
    const list = Array.isArray(items) ? items.filter(item => item?.imageUrl) : []
    if (list.length === 0) return null
    const doubled = [...list, ...list]
    const speed = FILM_SPEED_SECONDS[settings.speed] || FILM_SPEED_SECONDS.normal
    const stripClass = `discover-film-strip-track${settings.pauseOnHover ? ' pause-on-hover' : ''}`
    return (
        <section className="discover-film-strip-wrap">
            <div className={stripClass} style={{ animationDuration: `${speed}s` }}>
                {doubled.map((item, index) => (
                    <article
                        key={`${item.id || item.title || 'film'}-${index}`}
                        className={`discover-film-frame${settings.lightboxOnClick ? ' clickable' : ''}`}
                        onClick={() => settings.lightboxOnClick && typeof onOpenImage === 'function' && onOpenImage(item)}
                    >
                        <img src={item.imageUrl} alt={item.title || `film-${index + 1}`} />
                        {settings.watermarkEnabled && (
                            <div className="discover-film-watermark">{settings.watermarkText || 'HTX Truong Hai'}</div>
                        )}
                        {item.title && <span>{item.title}</span>}
                    </article>
                ))}
            </div>
        </section>
    )
}

export default function DiscoverPage() {
    const [content, setContent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [lightboxImage, setLightboxImage] = useState(null)
    const { tours = [], products = [], reviews = [] } = useData()
    const { passport, getEcoPoints } = usePassport()
    const { t } = useLang()

    useEffect(() => {
        fetch(`${API}/api/discover-content`)
            .then(res => res.json())
            .then(data => setContent(normalizeDiscoverContent(data || {})))
            .catch(() => setContent(DISCOVER_DEFAULTS))
            .finally(() => setLoading(false))
    }, [])

    const discover = normalizeDiscoverContent(content || {})
    const ecoPoints = typeof getEcoPoints === 'function' ? getEcoPoints() : 0

    if (loading) {
        return <div className="discover-loading">Đang tải trải nghiệm Discover...</div>
    }

    return (
        <div className="discover-page">
            <main className="discover-shell">
                <section className="discover-hero">
                    <img className="discover-hero-image" src={discover.hero.imageUrl} alt={discover.hero.title} />
                    <div className="discover-hero-content">
                        <div className="discover-eyebrow"><Leaf size={13} /> {discover.hero.eyebrow}</div>
                        <h1 className="discover-hero-title">
                            {String(discover.hero.title || '').split('\n').map((line, index) => (
                                <span key={index} style={{ display: 'block' }}>{line}</span>
                            ))}
                        </h1>
                        {discover.hero.titleAccent && <div className="discover-hero-accent">{discover.hero.titleAccent}</div>}
                        <p className="discover-hero-copy">{discover.hero.subtitle}</p>
                        <div className="discover-hero-note">{discover.hero.note}</div>
                        <div className="discover-hero-actions">
                            <Link to={discover.hero.primaryCtaLink} className="discover-btn">{discover.hero.primaryCtaLabel} <ArrowRight size={16} /></Link>
                            <Link to={discover.hero.secondaryCtaLink} className="discover-btn-secondary">{discover.hero.secondaryCtaLabel}</Link>
                        </div>
                        <div className="discover-hero-meta">
                            <div className="discover-meta-card">
                                <strong>{passport.stamps.length}</strong>
                                <span>tem đã thu trong hộ chiếu số</span>
                            </div>
                            <div className="discover-meta-card">
                                <strong>{ecoPoints}</strong>
                                <span>eco points từ QR và trải nghiệm cộng đồng</span>
                            </div>
                            <div className="discover-meta-card">
                                <strong>{tours.length + products.length + reviews.length}</strong>
                                <span>điểm chạm nội dung đang được quản lý trong hệ thống</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="discover-quick-hub">
                    <div className="discover-section-head" style={{ marginBottom: 12 }}>
                        <div>
                            <div className="discover-kicker"><Sparkles size={13} /> {t('discover_quick_kicker')}</div>
                            <h2>{t('discover_quick_title')}</h2>
                        </div>
                        <p>{t('discover_quick_desc')}</p>
                    </div>
                    <div className="discover-quick-grid">
                        <Link to="/homestay-farmstay" className="discover-quick-card">
                            <div className="discover-quick-icon"><BedDouble size={18} /></div>
                            <h3>{t('discover_quick_stays_title')}</h3>
                            <p>{t('discover_quick_stays_desc')}</p>
                            <span>{t('discover_quick_cta')} <ArrowRight size={14} /></span>
                        </Link>
                        <Link to="/bus-station" className="discover-quick-card">
                            <div className="discover-quick-icon"><Bus size={18} /></div>
                            <h3>{t('discover_quick_bus_title')}</h3>
                            <p>{t('discover_quick_bus_desc')}</p>
                            <span>{t('discover_quick_cta')} <ArrowRight size={14} /></span>
                        </Link>
                        <Link to="/xep-hang-sao" className="discover-quick-card">
                            <div className="discover-quick-icon"><Trophy size={18} /></div>
                            <h3>{t('discover_quick_rank_title')}</h3>
                            <p>{t('discover_quick_rank_desc')}</p>
                            <span>{t('discover_quick_cta')} <ArrowRight size={14} /></span>
                        </Link>
                    </div>
                </section>

                <section className="discover-section">
                    <SectionHead
                        kicker="Featured journeys"
                        title="Những hành trình nổi bật"
                        desc="Các tuyến được kể như những chương nhỏ: thành phố, loop, eco zone và di sản. Nội dung này có thể thay đổi ngay từ Dashboard."
                    />
                    <div className="discover-journal-strip">
                        {discover.journeys.map(item => <JourneyCard key={item.id || item.title} item={item} />)}
                    </div>
                </section>

                <section className="discover-section">
                    <SectionHead
                        kicker="Journey themes"
                        title="Chủ đề hành trình"
                        desc="Những lớp nội dung để ghép tour, bài viết, hay chiến dịch cộng đồng mà vẫn giữ ngôn ngữ mềm, chậm và đậm bản sắc."
                    />
                    <div className="discover-theme-grid">
                        {discover.themes.map(item => <ThemeCard key={item.id || item.name} item={item} />)}
                    </div>
                </section>

                <section className="discover-section">
                    <SectionHead
                        kicker="Stories from the field"
                        title="Câu chuyện từ Hà Giang"
                        desc="Một story dài và các ghi chú ngắn để đội ngũ có thể kể lại trải nghiệm bằng giọng văn điện ảnh, không giống catalogue du lịch."
                    />
                    {discover.stories?.length > 0 ? (
                        <div className="discover-story-grid">
                            <StoryCard item={discover.stories[0]} featured />
                            <div style={{ display: 'grid', gap: 12 }}>
                                {discover.stories.slice(1).map(item => <StoryCard key={item.id || item.title} item={item} />)}
                            </div>
                        </div>
                    ) : (
                        <div className="discover-empty-note">Chưa có story nào. Admin có thể thêm trong Discover CMS.</div>
                    )}
                </section>

                <section className="discover-section">
                    <SectionHead
                        kicker="Featured editorial"
                        title="Bài viết nổi bật"
                        desc="Một bài viết dài để kể sâu hơn về văn hoá, lịch sử và trải nghiệm địa phương. Nội dung có thể cập nhật trực tiếp từ admin."
                    />
                    <article className="discover-article-card">
                        <div className="discover-article-media">
                            <img src={discover.featureArticle?.imageUrl} alt={discover.featureArticle?.title} />
                        </div>
                        <div className="discover-article-body">
                            <div className="discover-story-badge">{discover.featureArticle?.badge || 'Editorial story'}</div>
                            <h3>{discover.featureArticle?.title}</h3>
                            <p className="discover-article-subtitle">{discover.featureArticle?.subtitle}</p>
                            <p dangerouslySetInnerHTML={{ __html: richText(discover.featureArticle?.body || '') }} />
                            <div className="discover-quote">{discover.featureArticle?.quote}</div>
                        </div>
                    </article>
                </section>

                <section className="discover-section">
                    <SectionHead
                        kicker="Film roll"
                        title="Khoảnh khắc chạy ngang"
                        desc="Admin có thể upload ảnh mới trong Discover CMS và ảnh sẽ tự chạy ngang như cuộn phim trên trang."
                    />
                    <FilmStrip items={discover.filmStrip} settings={discover.filmStripSettings} onOpenImage={setLightboxImage} />
                </section>

                <section className="discover-section">
                    <SectionHead
                        kicker="Recommendations"
                        title="Bạn có thể đi tiếp ở đâu"
                        desc="Các nút dẫn rất ít, chỉ đủ để người xem biết bước kế tiếp. Không biến Discover thành trang booking."
                    />
                    <div className="discover-recommend-grid">
                        {discover.recommendations.map(item => <RecommendationCard key={item.id || item.title} item={item} />)}
                    </div>
                </section>

                <section className="discover-footer-note">
                    <p style={{ margin: 0 }}>
                        <strong>Gợi ý vận hành:</strong> trang này đang đọc từ CMS riêng, nên admin có thể đổi ảnh, tiêu đề, story và CTA mà không cần sửa code. Nếu backend không phản hồi, trang vẫn rơi về nội dung mặc định để demo không bị trắng.
                    </p>
                </section>

                {lightboxImage && (
                    <div className="discover-lightbox" onClick={() => setLightboxImage(null)}>
                        <div className="discover-lightbox-inner" onClick={e => e.stopPropagation()}>
                            <button type="button" className="discover-lightbox-close" onClick={() => setLightboxImage(null)}>×</button>
                            <img src={lightboxImage.imageUrl} alt={lightboxImage.title || 'film-detail'} />
                            {lightboxImage.title && <p>{lightboxImage.title}</p>}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
