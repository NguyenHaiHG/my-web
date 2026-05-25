import { Link } from 'react-router-dom'
import { usePassport, STAMP_DEFS } from '../context/PassportContext'
import { useData } from '../context/DataContext'
import { useLang } from '../context/LanguageContext'
import { ArrowRight } from 'lucide-react'

export default function DiscoverPage() {
    const { passport } = usePassport()
    const { tours = [], products = [] } = useData()
    const { t, lang } = useLang()
    const stampCount = passport.stamps.length

    const REVIEWS = [
        { name: 'Sarah M.', country: '🇦🇺 Australia', stars: 5, text: 'The loop was absolutely breathtaking. Our guide from HTX Truong Hai was incredible — knowledgeable, patient, and made us feel safe the whole time.', text_vi: 'Cung đường tuyệt đẹp. Hướng dẫn viên HTX Trường Hải rất giỏi, kiên nhẫn và khiến chúng tôi luôn cảm thấy an toàn.' },
        { name: 'Trần Ngọc H.', country: '🇻🇳 Hà Nội', stars: 5, text: 'Tôi đã đi loop 3 lần và lần với HTX là hay nhất. Nhà giữa vườn cây ăn quả, yên bình khó tả.', text_vi: 'Tôi đã đi loop 3 lần và lần với HTX là hay nhất. Nhà giữa vườn cây ăn quả, yên bình khó tả.' },
        { name: 'James K.', country: '🇨🇦 Canada', stars: 5, text: 'As a solo female traveler I felt completely safe. HTX arranged a female guide and checked in with me every day. Highly recommend!', text_vi: 'Là nữ đi một mình, tôi cảm thấy hoàn toàn an toàn. HTX sắp xếp hướng dẫn viên nữ và hỏi thăm hàng ngày.' },
        { name: 'Minh T.', country: '🇫🇷 France', stars: 5, text: 'The local products — honey, rice wine, dried fruits — are authentic and wonderful. Bought so many gifts to bring back to Paris!', text_vi: 'Các sản phẩm địa phương — mật ong, rượu, hoa quả sấy — rất xịn. Mua cả túi về Paris làm quà!' },
    ]

    const HG_HIGHLIGHTS = [
        { icon: '🏔️', label: t('dc_hl1'), sub: t('dc_hl1s') },
        { icon: '🛣️', label: t('dc_hl2'), sub: t('dc_hl2s') },
        { icon: '🌸', label: t('dc_hl3'), sub: t('dc_hl3s') },
        { icon: '👘', label: t('dc_hl4'), sub: t('dc_hl4s') },
    ]

    const LOOP_PKGS = [
        {
            id: '2n1d', label: '2N1Đ', label_en: '2D1N', price: '3.500.000', badge: null,
            includes_vi: 'Xe máy · Xăng · Hướng dẫn · Homestay · Bữa sáng',
            includes_en: 'Motorbike · Fuel · Guide · Homestay · Breakfast',
            days: [
                { d: 'Ngày 1', d_en: 'Day 1', pts: ['HTX → Quản Bạ → Đồng Văn', 'Cột cờ Lũng Cú', 'Đêm tại Đồng Văn'], pts_en: ['HTX → Quan Ba → Dong Van', 'Lung Cu Flag Tower', 'Night in Dong Van'] },
                { d: 'Ngày 2', d_en: 'Day 2', pts: ['Đèo Mã Pí Lèng', 'Sông Nho Quế', 'Về HTX buổi tối'], pts_en: ['Ma Pi Leng Pass', 'Nho Que River', 'Return to HTX by evening'] },
            ],
        },
        {
            id: '3n2d', label: '3N2Đ', label_en: '3D2N', price: '4.500.000', badge: 'popular',
            includes_vi: 'Xe máy · Xăng · Hướng dẫn · Homestay 2 đêm · Bữa sáng',
            includes_en: 'Motorbike · Fuel · Guide · 2 nights homestay · Breakfast',
            days: [
                { d: 'Ngày 1', d_en: 'Day 1', pts: ['HTX → Quản Bạ → Yên Minh', 'Đồng Văn phố cổ', 'Đêm tại Đồng Văn'], pts_en: ['HTX → Quan Ba → Yen Minh', 'Dong Van Old Quarter', 'Night in Dong Van'] },
                { d: 'Ngày 2', d_en: 'Day 2', pts: ['Lũng Cú + Đèo Mã Pí Lèng', 'Mèo Vạc chợ phiên', 'Đêm tại Mèo Vạc'], pts_en: ['Lung Cu + Ma Pi Leng Pass', 'Meo Vac Sunday Market', 'Night in Meo Vac'] },
                { d: 'Ngày 3', d_en: 'Day 3', pts: ['Sông Nho Quế kayak', "Bản H'Mông Lũng Tám", 'Về HTX chiều'], pts_en: ['Nho Que River kayak', "H'Mong village Lung Tam", 'Return to HTX afternoon'] },
            ],
        },
        {
            id: '4n3d', label: '4N3Đ', label_en: '4D3N', price: '5.300.000', badge: null,
            includes_vi: 'Xe máy · Xăng · Hướng dẫn · Homestay 3 đêm · Bữa sáng + Tối',
            includes_en: 'Motorbike · Fuel · Guide · 3 nights homestay · Breakfast + Dinner',
            days: [
                { d: 'Ngày 1', d_en: 'Day 1', pts: ['HTX → Quản Bạ', 'Thác Tiên + Núi Đôi', 'Đêm tại Yên Minh'], pts_en: ['HTX → Quan Ba', 'Fairy Falls + Twin Mountains', 'Night in Yen Minh'] },
                { d: 'Ngày 2', d_en: 'Day 2', pts: ['Cao nguyên đá Đồng Văn', 'Lũng Cú cột cờ', 'Đêm tại Đồng Văn'], pts_en: ['Dong Van Stone Plateau', 'Lung Cu Flag Tower', 'Night in Dong Van'] },
                { d: 'Ngày 3', d_en: 'Day 3', pts: ['Đèo Mã Pí Lèng', 'Sông Nho Quế thuyền', 'Đêm tại Mèo Vạc'], pts_en: ['Ma Pi Leng Pass', 'Nho Que River boat', 'Night in Meo Vac'] },
                { d: 'Ngày 4', d_en: 'Day 4', pts: ["Bản Lũng Tám H'Mông", 'Chợ Đồng Văn phiên', 'Về HTX cuối chiều'], pts_en: ["Lung Tam H'Mong village", 'Dong Van weekly market', 'Return to HTX late afternoon'] },
            ],
        },
    ]

    const EXPERIENCES = [
        { to: '/tours', icon: '🏍️', title: t('dc_exp1t'), desc: t('dc_exp1d'), color: '#f97316', bg: 'linear-gradient(135deg,#7c2d12,#9a3412)', stamp: 'tour' },
        { to: '/san-pham', icon: '🧵', title: t('dc_exp2t'), desc: t('dc_exp2d'), color: '#059669', bg: 'linear-gradient(135deg,#064e3b,#065f46)', stamp: 'product' },
        { to: '/dao-tao', icon: '📚', title: t('dc_exp3t'), desc: t('dc_exp3d'), color: '#3b82f6', bg: 'linear-gradient(135deg,#1e3a5f,#1e40af)', stamp: 'training' },
        { to: '/ho-tro', icon: '💜', title: t('dc_exp4t'), desc: t('dc_exp4d'), color: '#a855f7', bg: 'linear-gradient(135deg,#4c1d95,#6d28d9)', stamp: 'radio' },
    ]

    return (
        <div className="dc-page">

            {/* ══ HERO ══ */}
            <section className="dc-hero">
                <img
                    className="dc-hero-img"
                    src="https://images.unsplash.com/photo-1562920618-c427d9252d7a?w=1600&q=85&auto=format&fit=crop"
                    alt="Hà Giang"
                />
                <div className="dc-hero-overlay" />
                <div className="dc-hero-content">
                    <div className="dc-hero-badge">{t('dc_badge')}</div>
                    <h1 className="dc-hero-title">
                        {t('dc_hero_t1')}<br />
                        <span className="dc-hero-accent">{t('dc_hero_t2')}</span><br />
                        {t('dc_hero_t3')}
                    </h1>
                    <p className="dc-hero-sub">
                        {lang === 'en' ? 'Explore, experience, and bring home a digital certificate' : 'Khám phá, trải nghiệm, và mang về chứng nhận số'}<br />
                        {lang === 'en' ? "from Vietnam's most majestic limestone plateau" : 'từ miền núi đá hùng vĩ nhất Việt Nam'}
                    </p>
                    <div className="dc-hero-cta">
                        <Link to="/ho-chieu" className="dc-btn-primary">
                            {t('dc_btn_start')}
                        </Link>
                        <Link to="/tours" className="dc-btn-ghost">
                            {t('dc_btn_tours')}
                        </Link>
                    </div>
                    {stampCount > 0 && (
                        <Link to="/ho-chieu" className="dc-hero-stamp-bar">
                            {t('dc_stamp_bar_pre')} <strong>{stampCount} {t('dc_stamp_bar_mid')}</strong> {t('dc_stamp_bar_post')}
                        </Link>
                    )}
                </div>
                {/* Stone fence bottom edge */}
                <div className="dc-hero-fence" />
            </section>

            {/* ══ HIGHLIGHT BAR ══ */}
            <section className="dc-highlights">
                {HG_HIGHLIGHTS.map(h => (
                    <div key={h.label} className="dc-hl">
                        <span className="dc-hl-icon">{h.icon}</span>
                        <div>
                            <div className="dc-hl-label">{h.label}</div>
                            <div className="dc-hl-sub">{h.sub}</div>
                        </div>
                    </div>
                ))}
            </section>

            {/* ══ PASSPORT TEASER ══ */}
            <section className="dc-passport-section container">
                {/* Passport book visual */}
                <div className="dc-pp-book">
                    <div className="dc-pp-cover">
                        <div className="dc-pp-cover-bg" />
                        <div className="dc-pp-cover-lines">
                            <div className="dc-pp-line1">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                            <div className="dc-pp-emblem">🌸</div>
                            <div className="dc-pp-title-text">HỘ CHIẾU</div>
                            <div className="dc-pp-title-sub">TRẢI NGHIỆM</div>
                            <div className="dc-pp-org-text">HTX Trường Hải · Tuyên Quang</div>
                        </div>
                    </div>
                    <div className="dc-pp-inner">
                        <div className="dc-pp-inner-title">THÔNG TIN NGƯỜI CẦM</div>
                        {passport.holderName ? (
                            <>
                                <div className="dc-pp-row"><span>Họ tên</span><strong>{passport.holderName}</strong></div>
                                <div className="dc-pp-row"><span>Tem đã có</span><strong>{passport.stamps.length} tem</strong></div>
                                <div className="dc-pp-stamps-mini">
                                    {passport.stamps.map(s => (
                                        <span key={s.type} title={s.label} className="dc-pp-mini-stamp">{s.icon}</span>
                                    ))}
                                    {passport.stamps.length === 0 && <span style={{ color: '#94a3b8', fontSize: 12 }}>Chưa có tem</span>}
                                </div>
                            </>
                        ) : (
                            <div className="dc-pp-noname">
                                <p>✈️ Chưa có hộ chiếu</p>
                                <p>Bắt đầu hành trình ngay!</p>
                            </div>
                        )}
                        <Link to="/ho-chieu" className="dc-pp-open-btn">
                            {passport.holderName ? '📖 Mở hộ chiếu' : '🌸 Tạo hộ chiếu'} →
                        </Link>
                    </div>
                </div>

                {/* Info side */}
                <div className="dc-passport-info">
                    <h2 className="dc-section-title">{t('dc_collect_title')}</h2>
                    <p className="dc-section-desc">
                        {lang === 'en'
                            ? <>Every experience at HTX Truong Hai earns you a <strong>digital stamp</strong>. Collect enough to download your <strong>Ha Giang Experience Certificate</strong> — share it, gift it, or keep it as a memory.</> : <>Mỗi trải nghiệm tại HTX Trường Hải tặng bạn một <strong>con tem số</strong>. Thu thập đủ tem để xuất <strong>Chứng nhận Trải nghiệm Hà Giang</strong> — tặng bạn bè, chia sẻ mạng xã hội, hay giữ làm kỷ niệm.</>
                        }
                    </p>
                    <div className="dc-stamps-preview">
                        {Object.entries(STAMP_DEFS).map(([type, def]) => (
                            <div key={type} className="dc-stamp-row">
                                <span className="dc-stamp-ico" style={{ color: def.color }}>{def.icon}</span>
                                <div>
                                    <div className="dc-stamp-name">{lang === 'en' ? def.label_en : def.label}</div>
                                    <div className="dc-stamp-how">{lang === 'en' ? def.how_en : def.how}</div>
                                </div>
                                {passport.stamps.some(s => s.type === type) && (
                                    <span className="dc-stamp-got">{t('dc_got')}</span>
                                )}
                            </div>
                        ))}
                    </div>
                    <Link to="/ho-chieu" className="dc-btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>
                        {t('dc_btn_start_now')} <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            {/* ══ STONE FENCE DIVIDER ══ */}
            <div className="hg-fence-divider" />

            {/* ══ EXPERIENCE GRID ══ */}
            <section className="dc-exp-section container">
                <h2 className="dc-section-title" style={{ textAlign: 'center', marginBottom: 8 }}>
                    {t('dc_exp_title')}
                </h2>
                <p style={{ textAlign: 'center', color: '#64748b', marginBottom: 32 }}>
                    {t('dc_exp_sub')}
                </p>
                <div className="dc-exp-grid">
                    {EXPERIENCES.map(exp => {
                        const earned = passport.stamps.some(s => s.type === exp.stamp)
                        return (
                            <Link key={exp.to} to={exp.to} className="dc-exp-card" style={{ background: exp.bg }}>
                                <div className="dc-exp-icon">{exp.icon}</div>
                                <h3 className="dc-exp-title">{exp.title}</h3>
                                <p className="dc-exp-desc">{exp.desc}</p>
                                {exp.to === '/tours' && <div className="dc-exp-count">{tours.length} {t('dc_tours_open')}</div>}
                                {exp.to === '/san-pham' && <div className="dc-exp-count">{products.length} {t('dc_prods_avail')}</div>}
                                {earned && <div className="dc-exp-stamp-badge">{t('dc_stamp_earned')}</div>}
                                <div className="dc-exp-arrow"><ArrowRight size={18} /></div>
                            </Link>
                        )
                    })}
                </div>
            </section>

            {/* ══ HA GIANG LOOP PACKAGES ══ */}
            <section className="dc-loop-section">
                <div className="dc-loop-header">
                    <h2>{t('dc_loop_title')}</h2>
                    <p>{t('dc_loop_sub')}</p>
                </div>
                <div className="dc-loop-grid">
                    {LOOP_PKGS.map(pkg => (
                        <div key={pkg.id} className={`dc-loop-card${pkg.badge === 'popular' ? ' dc-loop-card-popular' : ''}`}>
                            {pkg.badge === 'popular' && (
                                <div className="dc-loop-pop-badge">{t('dc_loop_popular')}</div>
                            )}
                            <div className="dc-loop-duration">
                                <span className="dc-loop-dur-pill">{lang === 'en' ? pkg.label_en : pkg.label}</span>
                            </div>
                            <div className="dc-loop-price">{pkg.price}đ</div>
                            <div className="dc-loop-price-note">{t('dc_loop_per_person')}</div>
                            <div className="dc-loop-days">
                                {pkg.days.map((day, i) => (
                                    <div key={i} className="dc-loop-day">
                                        <div className="dc-loop-day-title">{lang === 'en' ? day.d_en : day.d}</div>
                                        <ul className="dc-loop-points">
                                            {(lang === 'en' ? day.pts_en : day.pts).map((pt, j) => (
                                                <li key={j}>{pt}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                            <div className="dc-loop-includes">
                                <strong>{t('dc_loop_includes')}</strong> {lang === 'en' ? pkg.includes_en : pkg.includes_vi}
                            </div>
                            <Link to="/tours" className="dc-loop-book-btn">{t('dc_loop_book')}</Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══ REVIEWS ══ */}
            <section className="dc-reviews-section container">
                <h2 className="dc-section-title" style={{ textAlign: 'center', marginBottom: 8 }}>{t('dc_reviews_title')}</h2>
                <p style={{ textAlign: 'center', color: '#64748b', marginBottom: 40 }}>{t('dc_reviews_sub')}</p>
                <div className="dc-review-grid">
                    {REVIEWS.map((r, i) => (
                        <div key={i} className="dc-review-card">
                            <div className="dc-review-stars">{'⭐'.repeat(r.stars)}</div>
                            <p className="dc-review-text">"{lang === 'en' ? r.text : r.text_vi}"</p>
                            <div className="dc-review-author">
                                <strong>{r.name}</strong><span>{r.country}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══ BUCKWHEAT BANNER ══ */}
            <div className="dc-bw-banner">
                <div className="dc-bw-flowers">🌸🌸🌸🌸🌸🌸🌸</div>
                <h3>{t('dc_bw_title')}</h3>
                <p>{t('dc_bw_sub')}</p>
                <Link to="/ho-chieu" className="dc-btn-primary dc-btn-sm">
                    {t('dc_bw_btn')}
                </Link>
            </div>

        </div>
    )
}
