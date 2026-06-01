import { useNavigate } from 'react-router-dom'
import { ArrowRight, Heart, Leaf, Users } from 'lucide-react'
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
        emoji: '🍜',
        title: 'CityFood — Đặt món',
        desc: 'Gọi đồ ăn từ các shop trong thành phố Hà Giang, giao tận nơi nhanh chóng.',
        path: '/foodhg',
        cta: 'Đặt món ngay →',
        highlight: true,
    },
    {
        emoji: '🗺️',
        title: 'Tour Hà Giang',
        desc: 'Khám phá cung đường loop, tour theo ngày, trải nghiệm văn hóa địa phương.',
        path: '/tours',
        cta: 'Xem tour',
    },
    {
        emoji: '🌿',
        title: 'Nhật ký nông dân',
        desc: 'Xem truy xuất nguồn gốc, nhật ký theo ngày và sản vật bản địa.',
        path: '/san-pham',
        cta: 'Xem sản phẩm',
    },
    {
        emoji: '🏡',
        title: 'Homestay & Farmstay',
        desc: 'Tìm chỗ ở trong lòng bản làng vùng cao, gửi yêu cầu ngay từ điện thoại.',
        path: '/homestay-farmstay',
        cta: 'Xem lưu trú',
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
                        <button className="btn3d btn3d-orange" onClick={() => navigate('/san-pham')}>
                            Xem nhật ký nông dân <ArrowRight size={16} />
                        </button>
                        <button className="btn3d btn3d-outline-white" onClick={() => navigate('/tours')}>
                            Khám phá Hà Giang
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
