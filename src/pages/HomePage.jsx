import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ArrowRight, Edit2, Heart, Leaf, Plus, Settings2, Trash2 } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { API, apiFetch, responseError } from '../utils/api'
import AdminHomeFilmStrip from '../components/AdminHomeFilmStrip'
import { ListSectionEditor } from '../components/PageContentShell'
import { CMS_SECTIONS } from '../config/cmsSections'

const QUICK_CARDS = [
    {
        emoji: '🏛️',
        title: 'Số hoá di sản',
        desc: 'Ghi lại ngôn ngữ, thổ cẩm, lễ hội và cảnh quan Hà Giang — thư viện số, nhật ký thiên nhiên và hộ chiếu QR.',
        path: '/so-hoa-di-san',
        cta: 'Xem chương trình →',
        highlight: true,
    },
    {
        emoji: '🧵',
        title: 'Workshop Văn Hoá',
        desc: 'Thêu thổ cẩm, nấu ăn bản địa, nhạc cụ dân tộc — trải nghiệm văn hoá Tày, H\u2019Mông do cộng đồng tổ chức.',
        path: '/workshop',
        cta: 'Đặt workshop →',
        highlight: true,
    },
    {
        emoji: '🗺️',
        title: 'Khám phá Hà Giang',
        desc: 'Hà Giang Loop, tour cộng đồng và hộ chiếu số — đi cùng người địa phương, không biến di sản thành sân khấu.',
        path: '/tours',
        cta: 'Xem hành trình →',
        highlight: true,
    },
    {
        emoji: '🛍️',
        title: 'Cửa hàng & lưu trú',
        desc: 'Thổ cẩm, đặc sản địa phương và dorm tại Phường Hà Giang 2 — gần Loop, gần cộng đồng.',
        path: '/san-pham',
        cta: 'Xem cửa hàng →',
        highlight: false,
    },
]

const FARMER_FALLBACK_IMAGES = [
    { url: 'https://images.pexels.com/photos/36582384/pexels-photo-36582384.jpeg?auto=compress&cs=tinysrgb&w=900', caption: 'Phụ nữ H’Mông — Hà Giang' },
    { url: 'https://images.pexels.com/photos/10077653/pexels-photo-10077653.jpeg?auto=compress&cs=tinysrgb&w=900', caption: 'Ruộng bậc thang Hà Giang nhìn từ trên cao' },
    { url: 'https://images.pexels.com/photos/6713502/pexels-photo-6713502.jpeg?auto=compress&cs=tinysrgb&w=900', caption: 'Nông dân trên thửa bậc thang' },
    { url: 'https://images.pexels.com/photos/18012109/pexels-photo-18012109.jpeg?auto=compress&cs=tinysrgb&w=900', caption: 'Đường uốn lượn Hà Giang nhìn từ trên' },
    { url: 'https://images.pexels.com/photos/15997684/pexels-photo-15997684.jpeg?auto=compress&cs=tinysrgb&w=900', caption: 'Cột cờ Lũng Cú — cực Bắc Việt Nam' },
    { url: 'https://images.pexels.com/photos/27568660/pexels-photo-27568660.jpeg?auto=compress&cs=tinysrgb&w=900', caption: 'Thung lũng Hà Giang xanh mướt' },
]

const HERO_IMAGES_DEFAULT = [
    { url: 'https://images.pexels.com/photos/18012109/pexels-photo-18012109.jpeg?auto=compress&cs=tinysrgb&w=1400', caption: 'Đường Hà Giang Loop — kỳ quan địa chất' },
    { url: 'https://images.pexels.com/photos/35792511/pexels-photo-35792511.jpeg?auto=compress&cs=tinysrgb&w=1400', caption: 'Núi non Hà Giang hùng vĩ' },
    { url: 'https://images.pexels.com/photos/10077653/pexels-photo-10077653.jpeg?auto=compress&cs=tinysrgb&w=1400', caption: 'Ruộng bậc thang Hà Giang xanh mướt' },
    { url: 'https://images.pexels.com/photos/36582384/pexels-photo-36582384.jpeg?auto=compress&cs=tinysrgb&w=1400', caption: 'Phụ nữ H’Mông — sắc màu vùng cao' },
]

export default function HomePage({ siteContent = {} }) {
    const navigate = useNavigate()
    const { t } = useLang()
    const { isAdmin } = useAuth()
    const [showFilmStripAdmin, setShowFilmStripAdmin] = useState(false)
    const [filmStripItems, setFilmStripItems] = useState(FARMER_FALLBACK_IMAGES)
    const [highlights, setHighlights] = useState(siteContent.highlights || null)
    const [cardEditor, setCardEditor] = useState(null)
    const [cardError, setCardError] = useState('')

    // ── Hero slideshow ───────────────────────────────────────────────
    const [heroImages, setHeroImages] = useState(HERO_IMAGES_DEFAULT)
    const [heroIdx, setHeroIdx] = useState(0)
    const cmsHero = siteContent.hero || {}
    const staleHomeCta = /khám phá ngay/i.test(cmsHero.buttonLabel || '')
    const heroCtaLabel = cmsHero.buttonLabel && !staleHomeCta ? cmsHero.buttonLabel : t('hp_hero_btn1')
    const heroCtaHref = (cmsHero.buttonHref || '').includes('so-hoa') ? cmsHero.buttonHref : '/so-hoa-di-san'
    const mappedCards = highlights?.items?.length
        ? highlights.items.map(item => ({
            id: item.id || item._id,
            emoji: item.emoji || '🌿',
            title: item.title,
            desc: item.body || item.description,
            path: item.buttonHref || '/',
            cta: item.buttonLabel || 'Khám phá →',
            highlight: item.highlight !== false,
        }))
        : QUICK_CARDS
    const heritageCard = QUICK_CARDS[0]
    const quickCards = mappedCards.some(card => card.path === '/so-hoa-di-san')
        ? mappedCards
        : [heritageCard, ...mappedCards].slice(0, 4)

    useEffect(() => {
        setHighlights(siteContent.highlights || null)
    }, [siteContent.highlights])

    const deleteQuickCard = async card => {
        if (!card.id || !window.confirm(`Xóa thẻ "${card.title}" khỏi trang chủ?`)) return
        setCardError('')
        try {
            const response = await apiFetch(`/api/site-content/home/highlights/items/${card.id}`, { method: 'DELETE' })
            if (!response.ok) throw await responseError(response, 'Không thể xóa thẻ')
            const result = await response.json()
            setHighlights(current => ({ ...(current || {}), items: result.items || current?.items?.filter(item => (item.id || item._id) !== card.id) || [] }))
        } catch (err) {
            setCardError(err.message)
        }
    }

    // Fetch admin-uploaded hero images from backend
    useEffect(() => {
        fetch(`${API}/api/site-images`)
            .then(r => r.json())
            .then(arr => {
                if (!Array.isArray(arr)) return
                const slots = arr
                    .filter(img => img.slot?.startsWith('homepage-hero-') && img.url)
                    .sort((a, b) => a.slot.localeCompare(b.slot))
                    .map(img => ({ url: img.url, caption: img.caption || '' }))
                if (slots.length > 0) setHeroImages(slots)
            })
            .catch(() => { })
    }, [])

    useEffect(() => {
        if (heroImages.length <= 1) return
        const t = setInterval(() => setHeroIdx(i => (i + 1) % heroImages.length), 7000)
        return () => clearInterval(t)
    }, [heroImages.length])

    useEffect(() => {
        let active = true
        apiFetch('/api/home-film-strip', { auth: false })
            .then(async response => {
                if (!response.ok) throw new Error('Không thể tải dải ảnh')
                const data = await response.json()
                const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []
                if (!active) return
                setFilmStripItems(items.length ? items.filter(item => item.url && item.enabled !== false) : FARMER_FALLBACK_IMAGES)
            })
            .catch(() => {
                if (active) setFilmStripItems(FARMER_FALLBACK_IMAGES)
            })
        return () => { active = false }
    }, [])

    const syncFilmStrip = (items) => {
        setFilmStripItems(items.length ? items.filter(item => item.url && item.enabled !== false) : FARMER_FALLBACK_IMAGES)
    }

    // Duplicate the same ordered list so the existing CSS animation loops seamlessly.
    const filmStripImages = [...filmStripItems, ...filmStripItems]

    return (
        <div className="page-enter">
            <section className="ng-hero" aria-label="Ảnh bìa">
                <div
                    className="ng-hero-bg"
                    style={{ backgroundImage: `url(${cmsHero.image || heroImages[heroIdx]?.url || HERO_IMAGES_DEFAULT[0].url})` }}
                />
                <div className="ng-hero-overlay" />

                {/* Slideshow dots */}
                {heroImages.length > 1 && (
                    <div style={{
                        position: 'absolute', bottom: 28, left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex', gap: 6, zIndex: 5,
                    }}>
                        {heroImages.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setHeroIdx(i)}
                                aria-label={`Ảnh ${i + 1}`}
                                style={{
                                    width: i === heroIdx ? 22 : 8, height: 8, borderRadius: 4,
                                    background: i === heroIdx ? '#fff' : 'rgba(255,255,255,0.4)',
                                    border: 'none', cursor: 'pointer', padding: 0,
                                    transition: 'all 0.35s',
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Photo caption */}
                {heroImages[heroIdx]?.caption && (
                    <div style={{
                        position: 'absolute', bottom: 52, right: 20, zIndex: 5,
                        background: 'rgba(0,0,0,0.38)', color: 'rgba(255,255,255,0.88)',
                        padding: '3px 12px', borderRadius: 20, fontSize: 12,
                        backdropFilter: 'blur(4px)', pointerEvents: 'none',
                    }}>
                        📸 {heroImages[heroIdx].caption}
                    </div>
                )}

                <div className="ng-hero-content">
                    <p className="ng-hero-eyebrow">{t('hp_hero_badge')}</p>
                    <h1><span className="ng-hl">{cmsHero.title || t('hp_h1_hl')}</span></h1>
                    <p>{cmsHero.subtitle || cmsHero.body || t('hp_hero_sub')}</p>
                    <div className="ng-hero-btns">
                        <button className="btn3d btn3d-orange" onClick={() => navigate(heroCtaHref)}>
                            {heroCtaLabel} <ArrowRight size={16} />
                        </button>
                        <button className="btn3d btn3d-outline-white" onClick={() => navigate('/lien-he')}>
                            {t('hp_hero_btn2')} →
                        </button>
                    </div>
                </div>
            </section>

            <section className="farmer-film" aria-label="Ảnh cộng đồng & thiên nhiên" style={{ position: 'relative' }}>
                <div className="container">
                    <div className="farmer-film-head">
                        <strong>BookHaGiang — văn hoá, kết nối và lưu trữ</strong>
                        <p>Ảnh workshop, đời sống cộng đồng và những ký ức địa phương được lưu giữ mỗi ngày.</p>
                    </div>
                    {isAdmin && (
                        <button
                            type="button"
                            onClick={() => setShowFilmStripAdmin(open => !open)}
                            aria-expanded={showFilmStripAdmin}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                marginBottom: 12, padding: '7px 11px',
                                border: '1px solid #9ab9aa', borderRadius: 8,
                                background: showFilmStripAdmin ? '#315e4d' : '#fff',
                                color: showFilmStripAdmin ? '#fff' : '#315e4d',
                                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                            }}
                        >
                            <Settings2 size={14} /> {showFilmStripAdmin ? 'Đóng quản lý ảnh' : 'Quản lý dải ảnh'}
                        </button>
                    )}
                </div>
                {isAdmin && showFilmStripAdmin && (
                    <AdminHomeFilmStrip
                        compact
                        onChange={syncFilmStrip}
                        onClose={() => setShowFilmStripAdmin(false)}
                    />
                )}
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

            <section className="container py-section" style={{ marginTop: 8 }}>
                <div className="section-header-center" style={{ marginBottom: 16 }}>
                    <h2 style={{ marginBottom: 6 }}>Bạn muốn trải nghiệm gì?</h2>
                    <p style={{ color: '#64748b', margin: 0 }}>Số hoá di sản · Workshop · Khám phá · Cửa hàng — chọn điều phù hợp với bạn.</p>
                    {isAdmin && (
                        <button className="btn3d btn3d-green btn-sm" style={{ marginTop: 12 }} onClick={() => setCardEditor({ mode: 'new' })}>
                            <Plus size={14} /> Thêm thẻ trải nghiệm
                        </button>
                    )}
                    {cardError && <p className="form-error">{cardError}</p>}
                </div>

                <div className="cards-grid">
                    {quickCards.map((card) => (
                        <article key={card.id || card.path} className={`card3d${card.highlight ? ' card3d-highlight' : ''}`} style={{ transform: 'none', position: 'relative' }}>
                            {isAdmin && card.id && (
                                <div className="blog-actions" style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
                                    <button className="btn3d btn3d-orange btn-sm" onClick={() => setCardEditor({ mode: 'edit', id: card.id })}><Edit2 size={13} /> Sửa</button>
                                    <button className="btn-card-del" title="Xóa thẻ" onClick={() => deleteQuickCard(card)}><Trash2 size={14} /></button>
                                </div>
                            )}
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
                {isAdmin && cardEditor && (
                    <ListSectionEditor
                        page="home"
                        config={{ key: 'highlights', ...CMS_SECTIONS.home.highlights }}
                        initial={highlights}
                        initialEditId={cardEditor.mode === 'edit' ? cardEditor.id : ''}
                        openNewInitially={cardEditor.mode === 'new'}
                        onSaved={(_section, saved) => setHighlights(saved)}
                        onClose={() => setCardEditor(null)}
                    />
                )}
            </section>

            <section className="ng-cta">
                <div className="ng-cta-overlay" />
                <div className="container ng-cta-inner">
                    <h2>{t('hp_cta_h2')}</h2>
                    <p>{t('hp_cta_sub')}</p>
                    <div className="ng-cta-btns">
                        <button className="btn3d btn3d-orange" onClick={() => navigate('/so-hoa-di-san')}>
                            <Leaf size={16} /> Số hoá di sản
                        </button>
                        <button className="btn3d btn3d-blue" onClick={() => navigate('/workshop')}>
                            <Heart size={16} /> Đặt workshop
                        </button>
                        <button className="btn3d btn3d-outline-white" onClick={() => navigate('/tours')}>
                            🗺️ Khám phá Hà Giang
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}
