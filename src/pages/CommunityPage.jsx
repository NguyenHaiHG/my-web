import { useNavigate } from 'react-router-dom'
import { Heart, BookOpen, Leaf, Users, MapPin, ArrowRight } from 'lucide-react'
import { useLang } from '../context/LanguageContext'

const PROG_ICONS = [<Users size={28} />, <BookOpen size={28} />, <Leaf size={28} />, <Heart size={28} />]
const PROG_COLORS = ['#2d6a4f', '#1a6b8a', '#c05621', '#9b2c2c']
const PROG_LINKS = ['/workshop', '/thu-vien', '/tours', '/tinh-nguyen']
const PROG_KEYS = [
    ['comm_prog1_title', 'comm_prog1_desc', 'comm_prog1_tag'],
    ['comm_prog2_title', 'comm_prog2_desc', 'comm_prog2_tag'],
    ['comm_prog3_title', 'comm_prog3_desc', 'comm_prog3_tag'],
    ['comm_prog4_title', 'comm_prog4_desc', 'comm_prog4_tag'],
]
const MS_KEYS = [
    ['comm_ms1_year', 'comm_ms1'], ['comm_ms2_year', 'comm_ms2'],
    ['comm_ms3_year', 'comm_ms3'], ['comm_ms4_year', 'comm_ms4'],
]
const COMM_STATS = [
    { num: '12+', key: 'comm_stat1' }, { num: '3', key: 'comm_stat2' },
    { num: '200+', key: 'comm_stat3' }, { num: '4', key: 'comm_stat4' },
    { num: '48+', key: 'comm_stat5' }, { num: '100%', key: 'comm_stat6' },
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
                        <MapPin size={14} /> {t('comm_eyebrow')}
                    </span>
                    <h1>{t('comm_h1a')}<br /><span className="comm-hl">{t('comm_h1b')}</span></h1>
                    <p>{t('comm_hero_p')}</p>
                    <div className="comm-hero-btns">
                        <button className="btn3d btn3d-orange" onClick={() => navigate('/workshop')}>
                            {t('comm_hero_btn1')}
                        </button>
                        <button className="btn3d btn3d-blue" onClick={() => navigate('/tinh-nguyen')}>
                            {t('comm_hero_btn2')}
                        </button>
                    </div>
                </div>
            </div>

            {/* IMPACT NUMBERS */}
            <section className="comm-impact">
                <div className="container comm-impact-grid">
                    {COMM_STATS.map((s, i) => (
                        <div key={i} className="comm-stat">
                            <strong>{s.num}</strong>
                            <span>{t(s.key)}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* OUR STORY */}
            <section className="comm-story container">
                <div className="comm-story-text">
                    <span className="section-label">{t('comm_story_label')}</span>
                    <h2>{t('comm_story_h2')}</h2>
                    <p>{t('comm_story_p1')}</p>
                    <p>{t('comm_story_p2')}</p>
                    <button className="btn3d btn3d-orange" onClick={() => navigate('/tours')}>
                        {t('comm_story_btn')} <ArrowRight size={16} />
                    </button>
                </div>
                <div className="comm-story-timeline">
                    {MS_KEYS.map(([yk, tk], i) => (
                        <div key={i} className="timeline-item">
                            <div className="timeline-dot" />
                            <div className="timeline-content">
                                <strong>{t(yk)}</strong>
                                <p>{t(tk)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* PROGRAMS */}
            <section className="comm-programs">
                <div className="container">
                    <div className="section-header-center">
                        <span className="section-label">{t('comm_prog_label')}</span>
                        <h2>{t('comm_prog_h2')}</h2>
                    </div>
                    <div className="comm-programs-grid">
                        {PROG_KEYS.map(([tk, dk, tagk], i) => (
                            <div key={i} className="comm-program-card" onClick={() => navigate(PROG_LINKS[i])}>
                                <div className="comm-program-icon" style={{ background: PROG_COLORS[i] + '18', color: PROG_COLORS[i] }}>
                                    {PROG_ICONS[i]}
                                </div>
                                <span className="comm-program-tag">{t(tagk)}</span>
                                <h3>{t(tk)}</h3>
                                <p>{t(dk)}</p>
                                <span className="comm-program-link">
                                    {t('comm_prog_link')} <ArrowRight size={14} />
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
                    <h2>{t('comm_cta_h2')}</h2>
                    <p>{t('comm_cta_p')}</p>
                    <div className="comm-cta-btns">
                        <button className="btn3d btn3d-orange" onClick={() => navigate('/tinh-nguyen')}>
                            <Heart size={16} /> {t('comm_cta_btn1')}
                        </button>
                        <button className="btn3d btn3d-blue" onClick={() => navigate('/workshop')}>
                            <Users size={16} /> {t('comm_cta_btn2')}
                        </button>
                        <button className="btn3d btn3d-green" onClick={() => navigate('/tours')}>
                            <Leaf size={16} /> {t('comm_cta_btn3')}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}
