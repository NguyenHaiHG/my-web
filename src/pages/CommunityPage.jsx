import { useNavigate } from 'react-router-dom'
import { Heart, BookOpen, Leaf, Users, MapPin, ArrowRight } from 'lucide-react'
import { useLang } from '../context/LanguageContext'

const PROGRAMS = [
    {
        icon: <Users size={28} />,
        color: '#2d6a4f',
        title: 'Workshop Phụ Nữ',
        desc: 'Dạy may, thêu thổ cẩm, kỹ năng số và tiếng Anh giao tiếp miễn phí cho phụ nữ dân tộc.',
        link: '/workshop',
        tag: 'Đang tuyển sinh',
    },
    {
        icon: <BookOpen size={28} />,
        color: '#1a6b8a',
        title: 'Thư Viện Số',
        desc: 'Số hoá ngôn ngữ, văn hóa, ẩm thực các dân tộc thiểu số — lưu giữ cho thế hệ mai sau.',
        link: '/thu-vien',
        tag: 'Mở cửa',
    },
    {
        icon: <Leaf size={28} />,
        color: '#c05621',
        title: 'Du Lịch Bảo Tồn',
        desc: 'Trải nghiệm cuộc sống 4 thế hệ người dân tộc, cây ăn quả, cảnh quan hoang sơ cửa ngõ Hà Giang Loop.',
        link: '/tours',
        tag: 'Đặt tour',
    },
    {
        icon: <Heart size={28} />,
        color: '#9b2c2c',
        title: 'Tình Nguyện Viên',
        desc: 'Góp tay cùng cộng đồng — dạy học, làm vườn, số hóa tư liệu, phát triển du lịch bền vững.',
        link: '/tinh-nguyen',
        tag: 'Tham gia',
    },
]

const STORY_MILESTONES = [
    { year: '~1940s', text: 'Thế hệ thứ nhất định cư tại Tổ 5 Quang Trung, khai phá vườn cây ăn quả trên núi.' },
    { year: '~1970s', text: 'Thế hệ thứ hai mở rộng canh tác, gìn giữ nghề thêu thổ cẩm truyền thống.' },
    { year: '2000s', text: 'Thế hệ thứ ba chứng kiến đô thị hoá — cân bằng giữa hiện đại và bản sắc.' },
    { year: '2024', text: 'Thế hệ thứ tư khởi động dự án — kết nối cộng đồng, đào tạo phụ nữ, mở cửa đón khách.' },
]

export default function CommunityPage() {
    const navigate = useNavigate()
    const { t } = useLang()

    return (
        <div className="page-enter">
            {/* HERO */}
            <div className="comm-hero">
                <div className="comm-hero-overlay" />
                <div className="comm-hero-content">
                    <span className="comm-eyebrow">
                        <MapPin size={14} /> Tổ 5 Quang Trung · Phường Hà Giang 2 · Tuyên Quang
                    </span>
                    <h1>Dự Án Cộng Đồng<br /><span className="comm-hl">HTX Trường Hải</span></h1>
                    <p>Trao quyền cho phụ nữ · Bảo tồn văn hoá · Phát triển bền vững<br />
                        Ngay cửa ngõ Hà Giang Loop — 500m khỏi con đường lớn, trên độ cao ~1000m</p>
                    <div className="comm-hero-btns">
                        <button className="btn3d btn3d-orange" onClick={() => navigate('/workshop')}>
                            Tham gia Workshop
                        </button>
                        <button className="btn3d btn3d-blue" onClick={() => navigate('/tinh-nguyen')}>
                            Trở thành TNV
                        </button>
                    </div>
                </div>
            </div>

            {/* IMPACT NUMBERS */}
            <section className="comm-impact">
                <div className="container comm-impact-grid">
                    {[
                        { num: '12+', label: 'Phụ nữ được đào tạo' },
                        { num: '3', label: 'Workshop / tháng' },
                        { num: '200+', label: 'Du khách ghé thăm' },
                        { num: '4', label: 'Thế hệ cùng chung sống' },
                        { num: '48+', label: 'Mục thư viện số' },
                        { num: '100%', label: 'Miễn phí cho phụ nữ' },
                    ].map((s, i) => (
                        <div key={i} className="comm-stat">
                            <strong>{s.num}</strong>
                            <span>{s.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* OUR STORY */}
            <section className="comm-story container">
                <div className="comm-story-text">
                    <span className="section-label">📖 Câu chuyện của chúng tôi</span>
                    <h2>Bốn thế hệ trên mảnh đất<br />cửa ngõ Hà Giang</h2>
                    <p>
                        Tổ 5 Quang Trung nằm trên sườn núi cao khoảng 1.000m, cách mặt đường chính 500m —
                        chỉ xe máy mới vào được. Đây không phải bất lợi, mà là đặc ân: thiên nhiên hoang sơ,
                        vườn cây ăn quả trăm năm tuổi, và gia đình người dân tộc 4 thế hệ vẫn còn đó.
                    </p>
                    <p>
                        Trước làn sóng đô thị hoá, chúng tôi chọn không đứng yên. Dự án ra đời để
                        <strong> trao quyền cho phụ nữ</strong> qua kỹ năng nghề và kỹ năng số,
                        <strong> số hoá di sản</strong> trước khi nó biến mất, và
                        <strong> mở cửa đón khách</strong> một cách có trách nhiệm.
                    </p>
                    <button className="btn3d btn3d-orange" onClick={() => navigate('/tours')}>
                        Khám phá địa điểm <ArrowRight size={16} />
                    </button>
                </div>
                <div className="comm-story-timeline">
                    {STORY_MILESTONES.map((m, i) => (
                        <div key={i} className="timeline-item">
                            <div className="timeline-dot" />
                            <div className="timeline-content">
                                <strong>{m.year}</strong>
                                <p>{m.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* PROGRAMS */}
            <section className="comm-programs">
                <div className="container">
                    <div className="section-header-center">
                        <span className="section-label">🌱 Các chương trình</span>
                        <h2>Chúng tôi đang làm gì?</h2>
                    </div>
                    <div className="comm-programs-grid">
                        {PROGRAMS.map((p, i) => (
                            <div key={i} className="comm-program-card" onClick={() => navigate(p.link)}>
                                <div className="comm-program-icon" style={{ background: p.color + '18', color: p.color }}>
                                    {p.icon}
                                </div>
                                <span className="comm-program-tag">{p.tag}</span>
                                <h3>{p.title}</h3>
                                <p>{p.desc}</p>
                                <span className="comm-program-link">
                                    Tìm hiểu thêm <ArrowRight size={14} />
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* GET INVOLVED CTA */}
            <section className="comm-cta">
                <div className="comm-cta-overlay" />
                <div className="container comm-cta-inner">
                    <h2>Bạn có thể đóng góp gì?</h2>
                    <p>Dù là tình nguyện viên, du khách, hay nhà hảo tâm — mỗi sự tham gia đều có ý nghĩa.</p>
                    <div className="comm-cta-btns">
                        <button className="btn3d btn3d-orange" onClick={() => navigate('/tinh-nguyen')}>
                            <Heart size={16} /> Đăng ký tình nguyện
                        </button>
                        <button className="btn3d btn3d-blue" onClick={() => navigate('/workshop')}>
                            <Users size={16} /> Tham gia workshop
                        </button>
                        <button className="btn3d btn3d-green" onClick={() => navigate('/tours')}>
                            <Leaf size={16} /> Đặt tour bảo tồn
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}
