import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import { ArrowRight, Heart, Leaf } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'

function loadNaturePhotos() {
    try {
        const raw = localStorage.getItem('nature_memories_v1')
        if (!raw) return []
        const entries = JSON.parse(raw)
        return entries
            .filter(e => e.img)
            .map(e => ({
                url: e.img,
                caption: e.name
                    ? `${e.name}${e.location ? ' · ' + e.location : ''}`
                    : 'Quan sát thiên nhiên',
                isNature: true,
            }))
    } catch { return [] }
}

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
    {
        emoji: '🌿',
        title: 'Nhật Ký Thiên Nhiên',
        desc: 'Ghi chép quan sát cây cối, côn trùng, chim chóc — tỉ mỉ như người Nhật. Lưu ảnh, ghi chú, thời tiết.',
        path: '/nhat-ky-thien-nhien',
        cta: 'Mở nhật ký →',
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

export default function HomePage() {
    const navigate = useNavigate()
    const { t } = useLang()
    const { communityImages } = useData()
    const { isAdmin, isMod } = useAuth()
    const canEdit = isAdmin || isMod

    // ── Hero slideshow ───────────────────────────────────────────────
    const [heroImages, setHeroImages] = useState(() => {
        try {
            const saved = localStorage.getItem('hagiang_hero_v2')
            if (saved) return JSON.parse(saved)
        } catch { /* ignore */ }
        return HERO_IMAGES_DEFAULT
    })
    const [heroIdx, setHeroIdx] = useState(0)
    const [showHeroAdmin, setShowHeroAdmin] = useState(false)
    const [newHeroUrl, setNewHeroUrl] = useState('')
    const [newHeroCaption, setNewHeroCaption] = useState('')

    useEffect(() => {
        if (heroImages.length <= 1) return
        const t = setInterval(() => setHeroIdx(i => (i + 1) % heroImages.length), 7000)
        return () => clearInterval(t)
    }, [heroImages.length])

    const saveHeroImages = (imgs) => {
        setHeroImages(imgs)
        localStorage.setItem('hagiang_hero_v2', JSON.stringify(imgs))
    }

    // Always show default Pexels Ha Giang photos; community uploads added on top
    const communityMapped = communityImages
        .map((img, i) => {
            if (typeof img === 'string') return { url: img, caption: `Ảnh cộng đồng ${i + 1}` }
            return { url: img.url, caption: img.caption || `Ảnh cộng đồng ${i + 1}` }
        })
        // Filter out old broken Unsplash URLs
        .filter(img => img.url && !img.url.includes('unsplash.com') && !img.url.endsWith('.svg'))

    const farmerImages = [...FARMER_FALLBACK_IMAGES, ...communityMapped]

    const naturePhotos = useMemo(() => loadNaturePhotos(), [])

    // Interleave: farmer photos + nature memory photos together
    const allImages = useMemo(() => {
        if (!naturePhotos.length) return farmerImages
        const merged = []
        const maxLen = Math.max(farmerImages.length, naturePhotos.length)
        for (let i = 0; i < maxLen; i++) {
            if (i < farmerImages.length) merged.push(farmerImages[i])
            if (i < naturePhotos.length) merged.push(naturePhotos[i])
        }
        return merged
    }, [farmerImages, naturePhotos])

    const filmStripImages = [...allImages, ...allImages]

    return (
        <div className="page-enter">
            <section className="ng-hero" aria-label="Ảnh bìa">
                <div
                    className="ng-hero-bg"
                    style={{ backgroundImage: `url(${heroImages[heroIdx]?.url || HERO_IMAGES_DEFAULT[0].url})` }}
                />
                <div className="ng-hero-overlay" />

                {/* Admin edit button */}
                {canEdit && (
                    <button
                        onClick={() => setShowHeroAdmin(true)}
                        style={{
                            position: 'absolute', top: 16, right: 16, zIndex: 10,
                            background: 'rgba(0,0,0,0.55)', color: '#fff',
                            border: '1px solid rgba(255,255,255,0.35)',
                            borderRadius: 8, padding: '6px 14px', cursor: 'pointer',
                            fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
                            backdropFilter: 'blur(4px)',
                        }}
                    >
                        🖼️ Sửa ảnh bìa
                    </button>
                )}

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

            {/* ── Hero Admin Modal ─────────────────────────────────────── */}
            {showHeroAdmin && (
                <div
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)',
                        zIndex: 9000, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', padding: 16,
                    }}
                    onClick={() => setShowHeroAdmin(false)}
                >
                    <div
                        style={{
                            background: '#fff', borderRadius: 18, padding: 24,
                            maxWidth: 500, width: '100%', maxHeight: '85vh', overflowY: 'auto',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 style={{ margin: '0 0 4px', fontSize: 17 }}>🖼️ Quản lý ảnh bìa trang chủ</h3>
                        <p style={{ color: '#64748b', fontSize: 12, margin: '0 0 16px' }}>Kéo URL ảnh vào để thêm. Ảnh hiện tại sẽ tự chuyển mỗi 7 giây.</p>

                        {heroImages.map((img, i) => (
                            <div key={i} style={{
                                display: 'flex', gap: 10, marginBottom: 8,
                                alignItems: 'center', background: i === heroIdx ? '#f0fdf4' : '#f8fafc',
                                borderRadius: 10, padding: 8, border: i === heroIdx ? '1.5px solid #16a34a' : '1.5px solid #e2e8f0',
                            }}>
                                <img
                                    src={img.url} alt=""
                                    style={{ width: 72, height: 46, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
                                    onError={e => { e.target.style.background = '#e2e8f0'; e.target.src = '' }}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {img.caption || '(chưa có caption)'}
                                    </div>
                                    <div style={{ fontSize: 11, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {img.url}
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setHeroIdx(0); saveHeroImages(heroImages.filter((_, j) => j !== i)) }}
                                    style={{ background: '#fee2e2', border: 'none', borderRadius: 6, padding: '5px 9px', cursor: 'pointer', color: '#dc2626', flexShrink: 0, fontWeight: 700 }}
                                    title="Xoá ảnh này"
                                >✕</button>
                            </div>
                        ))}

                        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: 13 }}>+ Thêm ảnh mới</p>
                            <input
                                value={newHeroUrl}
                                onChange={e => setNewHeroUrl(e.target.value)}
                                placeholder="Dán URL ảnh (Unsplash, hoặc link ảnh của bạn)…"
                                style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px', fontSize: 13 }}
                            />
                            <input
                                value={newHeroCaption}
                                onChange={e => setNewHeroCaption(e.target.value)}
                                placeholder="Caption (vd: Nông dân thu hoạch lúa)"
                                style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px', fontSize: 13 }}
                            />
                            <button
                                onClick={() => {
                                    if (!newHeroUrl.trim()) return
                                    saveHeroImages([...heroImages, { url: newHeroUrl.trim(), caption: newHeroCaption.trim() }])
                                    setNewHeroUrl(''); setNewHeroCaption('')
                                }}
                                style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', cursor: 'pointer', fontWeight: 700 }}
                            >
                                + Thêm ảnh
                            </button>
                            <button
                                onClick={() => { saveHeroImages(HERO_IMAGES_DEFAULT); setHeroIdx(0) }}
                                style={{ background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 12 }}
                            >
                                ↺ Khôi phục ảnh mặc định
                            </button>
                            <button
                                onClick={() => setShowHeroAdmin(false)}
                                style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', cursor: 'pointer', fontWeight: 700 }}
                            >
                                ✓ Xong
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <section className="farmer-film" aria-label="Ảnh cộng đồng & thiên nhiên">
                <div className="container">
                    <div className="farmer-film-head">
                        <strong>Nông dân vùng cao Hà Giang</strong>
                        <p>Ảnh nông dân & nhật ký thiên nhiên của học sinh.</p>
                    </div>
                </div>
                <div className="farmer-film-window">
                    <div className="farmer-film-track">
                        {filmStripImages.map((img, i) => (
                            <figure key={`${img.url}-${i}`} className="farmer-film-frame">
                                <img src={img.url} alt={img.caption} loading="lazy" />
                                {img.isNature && (
                                    <span className="farmer-film-nature-badge">🌿</span>
                                )}
                                <figcaption>{img.caption}</figcaption>
                            </figure>
                        ))}
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
