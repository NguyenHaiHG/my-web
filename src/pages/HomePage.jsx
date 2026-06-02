import { useNavigate } from 'react-router-dom'
import { ArrowRight, Heart, Leaf } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { useData } from '../context/DataContext'

const QUICK_CARDS = [
    {
        emoji: '🎖️',
        title: 'Hộ chiếu Hà Giang',
        desc: 'Tạo hộ chiếu số miễn phí, quét QR tại điểm sinh thái, nhận tem & tải chứng nhận hành trình thực tế.',
        path: '/ho-chieu',
        cta: 'Tạo hộ chiếu →',
        highlight: true,
    },
    {
        emoji: '🧵',
        title: 'Trải nghiệm Workshop',
        desc: 'Thêu thổ cẩm, nấu ăn bản địa, kỹ năng số — trải nghiệm thực tế do cộng đồng vùng cao tổ chức.',
        path: '/workshop',
        cta: 'Xem Workshop →',
        highlight: true,
    },
]

const FARMER_FALLBACK_IMAGES = [
    { url: '/hg-city-1.svg', caption: 'Nông dân vùng cao - mùa thu hoạch' },
    { url: '/hg-city-2.svg', caption: 'Phụ nữ vùng cao chăm sóc nông trại' },
    { url: '/hg-city-3.svg', caption: 'Sản vật bản địa từ nương rẫy' },
]

export default function HomePage() {
    const navigate = useNavigate()
    const { t } = useLang()
    const { communityImages } = useData()

    const farmerImages = (communityImages.length ? communityImages : FARMER_FALLBACK_IMAGES)
        .map((img, i) => {
            if (typeof img === 'string') {
                return {
                    url: img,
                    caption: `Khoảnh khắc nông dân vùng cao ${i + 1}`,
                }
            }
            return {
                url: img.url,
                caption: img.caption || `Khoảnh khắc nông dân vùng cao ${i + 1}`,
            }
        })
        .filter(img => Boolean(img.url))

    const filmStripImages = [...farmerImages, ...farmerImages]

    return (
        <div className="page-enter">
            <section className="farmer-film" aria-label="Ảnh người nông dân vùng cao">
                <div className="container">
                    <div className="farmer-film-head">
                        <strong>Nông dân vùng cao Hà Giang</strong>
                        <p>Ảnh do admin cập nhật, hiển thị dạng cuộn phim ở đầu trang.</p>
                    </div>
                </div>
                <div className="farmer-film-window">
                    <div className="farmer-film-track">
                        {filmStripImages.map((img, i) => (
                            <figure key={`${img.url}-${i}`} className="farmer-film-frame">
                                <img src={img.url} alt={img.caption} loading="lazy" />
                                <figcaption>{img.caption}</figcaption>
                            </figure>
                        ))}
                    </div>
                </div>
            </section>

            <section className="ng-hero">
                <div className="ng-hero-bg" />
                <div className="ng-hero-overlay" />
                <div className="ng-hero-content">
                    <h1>{t('hp_h1_pre')} <span className="ng-hl">{t('hp_h1_hl')}</span><br />{t('hp_h1_post')}</h1>
                    <p>{t('hp_hero_sub')}</p>
                    <div className="ng-hero-btns">
                        <button className="btn3d btn3d-orange" onClick={() => navigate('/workshop')}>
                            Khám phá Workshop <ArrowRight size={16} />
                        </button>
                        <button className="btn3d btn3d-outline-white" onClick={() => navigate('/ho-chieu')}>
                            Tạo hộ chiếu →
                        </button>
                    </div>
                </div>
            </section>

            <section className="container py-section" style={{ marginTop: 8 }}>
                <div className="section-header-center" style={{ marginBottom: 16 }}>
                    <h2 style={{ marginBottom: 6 }}>Khám phá tính năng</h2>
                    <p style={{ color: '#64748b', margin: 0 }}>Chọn mục bạn muốn trải nghiệm — tất cả miễn phí.</p>
                </div>

                <div className="cards-grid">
                    {QUICK_CARDS.map((card) => (
                        <article key={card.path} className={`card3d${card.highlight ? ' card3d-highlight' : ''}`} style={{ transform: 'none' }}>
                            <div className="card3d-body">
                                <div className="card3d-emoji">{card.emoji}</div>
                                <strong className="card3d-title">{card.title}</strong>
                                <p className="card3d-desc">{card.desc}</p>
                                <button className={`btn3d btn-sm ${card.highlight ? 'btn3d-orange' : 'btn3d-blue'}`} onClick={() => navigate(card.path)}>
                                    {card.cta}
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="ng-cta">
                <div className="ng-cta-overlay" />
                <div className="container ng-cta-inner">
                    <h2>{t('hp_cta_h2')}</h2>
                    <p>{t('hp_cta_sub')}</p>
                    <div className="ng-cta-btns">
                        <button className="btn3d btn3d-orange" onClick={() => navigate('/ho-chieu')}>
                            <Heart size={16} /> Tạo hộ chiếu
                        </button>
                        <button className="btn3d btn3d-blue" onClick={() => navigate('/workshop')}>
                            <Leaf size={16} /> Xem Workshop
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}
