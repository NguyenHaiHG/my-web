import { Link } from 'react-router-dom'
import { usePassport, STAMP_DEFS } from '../context/PassportContext'
import { useData } from '../context/DataContext'
import { ArrowRight } from 'lucide-react'

const HG_HIGHLIGHTS = [
    { icon: '🏔️', label: 'Cao nguyên Đồng Văn', sub: 'Di sản địa chất UNESCO' },
    { icon: '🛣️', label: 'Đèo Mã Pí Lèng', sub: 'Đệ nhất hùng quan' },
    { icon: '🌸', label: 'Hoa Tam giác mạch', sub: 'Tháng 10–12 hàng năm' },
    { icon: '👘', label: 'Bản sắc dân tộc', sub: "H'Mông, Dao, Lô Lô..." },
]

const EXPERIENCES = [
    {
        to: '/tours',
        icon: '🏍️',
        title: 'Tour & Phượt',
        desc: 'Loop Rider, trekking, homestay dân tộc',
        color: '#f97316',
        bg: 'linear-gradient(135deg,#7c2d12,#9a3412)',
        stamp: 'tour',
    },
    {
        to: '/san-pham',
        icon: '🧵',
        title: 'Thủ công mỹ nghệ',
        desc: 'Thêu, dệt, trang phục dân tộc chính hãng',
        color: '#059669',
        bg: 'linear-gradient(135deg,#064e3b,#065f46)',
        stamp: 'product',
    },
    {
        to: '/dao-tao',
        icon: '📚',
        title: 'Đào tạo miễn phí',
        desc: 'EasyRider, tiếng Anh, quay video, trang điểm',
        color: '#3b82f6',
        bg: 'linear-gradient(135deg,#1e3a5f,#1e40af)',
        stamp: 'training',
    },
    {
        to: '/ho-tro',
        icon: '💜',
        title: 'Hỗ trợ cộng đồng',
        desc: 'Du khách nữ · Lao động · Đài phát thanh',
        color: '#a855f7',
        bg: 'linear-gradient(135deg,#4c1d95,#6d28d9)',
        stamp: 'radio',
    },
]

export default function DiscoverPage() {
    const { passport } = usePassport()
    const { tours = [], products = [] } = useData()
    const stampCount = passport.stamps.length

    return (
        <div className="dc-page">

            {/* ══ HERO ══ */}
            <section className="dc-hero">
                <img
                    className="dc-hero-img"
                    src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1400&q=80"
                    alt="Hà Giang"
                />
                <div className="dc-hero-overlay" />
                <div className="dc-hero-content">
                    <div className="dc-hero-badge">🌏 Cực Bắc Việt Nam · Tuyên Quang</div>
                    <h1 className="dc-hero-title">
                        Hộ Chiếu<br />
                        <span className="dc-hero-accent">Trải Nghiệm</span><br />
                        Hà Giang
                    </h1>
                    <p className="dc-hero-sub">
                        Khám phá, trải nghiệm, và mang về chứng nhận số<br />
                        từ miền núi đá hùng vĩ nhất Việt Nam
                    </p>
                    <div className="dc-hero-cta">
                        <Link to="/ho-chieu" className="dc-btn-primary">
                            🌸 Bắt đầu hành trình
                        </Link>
                        <Link to="/tours" className="dc-btn-ghost">
                            🏍️ Xem tour
                        </Link>
                    </div>
                    {stampCount > 0 && (
                        <Link to="/ho-chieu" className="dc-hero-stamp-bar">
                            ✅ Bạn đã có <strong>{stampCount} tem</strong> trong hộ chiếu → Xem ngay
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
                    <h2 className="dc-section-title">Thu thập tem · Nhận chứng nhận</h2>
                    <p className="dc-section-desc">
                        Mỗi trải nghiệm tại HTX Trường Hải tặng bạn một <strong>con tem số</strong>.
                        Thu thập đủ tem để xuất <strong>Chứng nhận Trải nghiệm Hà Giang</strong> —
                        tặng bạn bè, chia sẻ mạng xã hội, hay giữ làm kỷ niệm.
                    </p>
                    <div className="dc-stamps-preview">
                        {Object.entries(STAMP_DEFS).map(([type, def]) => (
                            <div key={type} className="dc-stamp-row">
                                <span className="dc-stamp-ico" style={{ color: def.color }}>{def.icon}</span>
                                <div>
                                    <div className="dc-stamp-name">{def.label}</div>
                                    <div className="dc-stamp-how">{def.how}</div>
                                </div>
                                {passport.stamps.some(s => s.type === type) && (
                                    <span className="dc-stamp-got">✓ Đã có</span>
                                )}
                            </div>
                        ))}
                    </div>
                    <Link to="/ho-chieu" className="dc-btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>
                        Bắt đầu ngay <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            {/* ══ STONE FENCE DIVIDER ══ */}
            <div className="hg-fence-divider" />

            {/* ══ EXPERIENCE GRID ══ */}
            <section className="dc-exp-section container">
                <h2 className="dc-section-title" style={{ textAlign: 'center', marginBottom: 8 }}>
                    Trải nghiệm Hà Giang
                </h2>
                <p style={{ textAlign: 'center', color: '#64748b', marginBottom: 32 }}>
                    Mỗi hoạt động giúp bạn kiếm thêm tem cho hộ chiếu
                </p>
                <div className="dc-exp-grid">
                    {EXPERIENCES.map(exp => {
                        const earned = passport.stamps.some(s => s.type === exp.stamp)
                        return (
                            <Link key={exp.to} to={exp.to} className="dc-exp-card" style={{ background: exp.bg }}>
                                <div className="dc-exp-icon">{exp.icon}</div>
                                <h3 className="dc-exp-title">{exp.title}</h3>
                                <p className="dc-exp-desc">{exp.desc}</p>
                                {exp.to === '/tours' && <div className="dc-exp-count">{tours.length} tour đang mở</div>}
                                {exp.to === '/san-pham' && <div className="dc-exp-count">{products.length} sản phẩm</div>}
                                {earned && <div className="dc-exp-stamp-badge">🎖️ Đã có tem</div>}
                                <div className="dc-exp-arrow"><ArrowRight size={18} /></div>
                            </Link>
                        )
                    })}
                </div>
            </section>

            {/* ══ BUCKWHEAT BANNER ══ */}
            <div className="dc-bw-banner">
                <div className="dc-bw-flowers">🌸🌸🌸🌸🌸🌸🌸</div>
                <h3>Hoa tam giác mạch nở rộ · Tháng 10–12</h3>
                <p>Đến Hà Giang mùa hoa và mang về chứng nhận trải nghiệm đặc biệt nhất</p>
                <Link to="/ho-chieu" className="dc-btn-primary dc-btn-sm">
                    🗺️ Tạo hộ chiếu của bạn →
                </Link>
            </div>

        </div>
    )
}
