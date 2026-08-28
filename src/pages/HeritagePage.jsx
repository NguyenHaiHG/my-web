import { useNavigate } from 'react-router-dom'
import { ArrowRight, Landmark, ScanLine } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import { useData } from '../context/DataContext'
import './HeritagePage.css'

const PILLARS = [
    { emoji: '🗣️', titleKey: 'hd_p1_title', bodyKey: 'hd_p1_body' },
    { emoji: '🧵', titleKey: 'hd_p2_title', bodyKey: 'hd_p2_body' },
    { emoji: '🍜', titleKey: 'hd_p3_title', bodyKey: 'hd_p3_body' },
    { emoji: '🌿', titleKey: 'hd_p4_title', bodyKey: 'hd_p4_body' },
]

const STEPS = [
    { n: '01', icon: '🎙️', titleKey: 'hd_s1_title', bodyKey: 'hd_s1_body' },
    { n: '02', icon: '📚', titleKey: 'hd_s2_title', bodyKey: 'hd_s2_body' },
    { n: '03', icon: '🔳', titleKey: 'hd_s3_title', bodyKey: 'hd_s3_body' },
    { n: '04', icon: '🤝', titleKey: 'hd_s4_title', bodyKey: 'hd_s4_body' },
]

const TOOLS = [
    {
        emoji: '📚', path: '/thu-vien',
        titleKey: 'hd_t1_title', bodyKey: 'hd_t1_body', ctaKey: 'hd_t1_cta', accent: '#b45309',
    },
    {
        emoji: '🌿', path: '/nhat-ky-thien-nhien',
        titleKey: 'hd_t2_title', bodyKey: 'hd_t2_body', ctaKey: 'hd_t2_cta', accent: '#15803d',
    },
    {
        emoji: '🎖️', path: '/ho-chieu',
        titleKey: 'hd_t3_title', bodyKey: 'hd_t3_body', ctaKey: 'hd_t3_cta', accent: '#1d4ed8',
    },
    {
        emoji: '🎓', path: '/workshop',
        titleKey: 'hd_t4_title', bodyKey: 'hd_t4_body', ctaKey: 'hd_t4_cta', accent: '#c2410c',
    },
]

export default function HeritagePage({ siteContent = {} }) {
    const { t } = useLang()
    const navigate = useNavigate()
    const { libraryItems } = useData()
    const cmsHero = siteContent.hero || {}
    const pillars = siteContent.pillars?.items?.length
        ? siteContent.pillars.items.map(item => ({
            emoji: item.emoji || '🏛️',
            title: item.title,
            body: item.body,
        }))
        : PILLARS.map(p => ({ emoji: p.emoji, title: t(p.titleKey), body: t(p.bodyKey) }))
    const tools = siteContent.tools?.items?.length
        ? siteContent.tools.items.map(item => ({
            emoji: item.emoji || '📚',
            title: item.title,
            body: item.body,
            path: item.buttonHref || '/thu-vien',
            cta: item.buttonLabel || t('hd_open'),
            accent: '#b45309',
        }))
        : TOOLS.map(tool => ({
            emoji: tool.emoji,
            title: t(tool.titleKey),
            body: t(tool.bodyKey),
            path: tool.path,
            cta: t(tool.ctaKey),
            accent: tool.accent,
        }))
    const preview = (libraryItems || []).slice(0, 4)

    return (
        <div className="hd-page page-enter">
            <section className="hd-hero" style={cmsHero.image ? {
                backgroundImage: `linear-gradient(#4a1f12ee,#7c2d12cc),url("${cmsHero.image}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            } : undefined}>
                <div className="hd-hero-deco" aria-hidden>
                    <span>🏛️</span><span>📜</span><span>🧵</span><span>🗣️</span><span>🌿</span>
                </div>
                <div className="hd-hero-content">
                    <div className="hd-hero-badge"><Landmark size={13} /> {t('hd_badge')}</div>
                    <h1>{cmsHero.title || t('hd_h1')}</h1>
                    <p>{cmsHero.subtitle || cmsHero.body || t('hd_sub')}</p>
                    <div className="hd-hero-btns">
                        <button className="btn3d btn3d-orange" onClick={() => navigate('/thu-vien')}>
                            {t('hd_hero_library')} <ArrowRight size={16} />
                        </button>
                        <button className="btn3d btn3d-outline-white" onClick={() => navigate('/lien-he')}>
                            {t('hd_hero_join')}
                        </button>
                    </div>
                </div>
            </section>

            <section className="hd-section">
                <div className="hd-kicker">{t('hd_why_kicker')}</div>
                <h2 className="hd-h2">{t('hd_why_title')}</h2>
                <p className="hd-lead">{t('hd_why_body')}</p>
                <div className="hd-pillar-grid">
                    {pillars.map((pillar, i) => (
                        <article key={pillar.title || i} className="hd-pillar">
                            <span className="hd-pillar-emoji">{pillar.emoji}</span>
                            <strong>{pillar.title}</strong>
                            <p>{pillar.body}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="hd-section hd-section-alt">
                <div className="hd-kicker">{t('hd_tools_kicker')}</div>
                <h2 className="hd-h2">{t('hd_tools_title')}</h2>
                <p className="hd-lead">{t('hd_tools_body')}</p>
                <div className="hd-tool-grid">
                    {tools.map((tool, i) => (
                        <article key={tool.path || i} className="hd-tool" style={{ '--hd-accent': tool.accent }}>
                            <span className="hd-tool-emoji">{tool.emoji}</span>
                            <strong>{tool.title}</strong>
                            <p>{tool.body}</p>
                            <button className="btn3d btn3d-orange btn-sm" onClick={() => navigate(tool.path)}>
                                {tool.cta} <ArrowRight size={14} />
                            </button>
                        </article>
                    ))}
                </div>
            </section>

            <section className="hd-section">
                <div className="hd-kicker">{t('hd_steps_kicker')}</div>
                <h2 className="hd-h2">{t('hd_steps_title')}</h2>
                <div className="hd-steps">
                    {STEPS.map(step => (
                        <article key={step.n} className="hd-step">
                            <span className="hd-step-n">{step.n}</span>
                            <span className="hd-step-icon">{step.icon}</span>
                            <strong>{t(step.titleKey)}</strong>
                            <p>{t(step.bodyKey)}</p>
                        </article>
                    ))}
                </div>
            </section>

            {preview.length > 0 && (
                <section className="hd-section hd-section-alt">
                    <div className="hd-section-head">
                        <div>
                            <div className="hd-kicker">{t('hd_lib_kicker')}</div>
                            <h2 className="hd-h2">{t('hd_lib_title')}</h2>
                        </div>
                        <button className="btn3d btn3d-blue btn-sm" onClick={() => navigate('/thu-vien')}>
                            {t('hd_lib_all')} <ArrowRight size={14} />
                        </button>
                    </div>
                    <div className="hd-preview-grid">
                        {preview.map(item => (
                            <button key={item.id || item._id} className="hd-preview" onClick={() => navigate('/thu-vien')}>
                                {item.img
                                    ? <div className="hd-preview-img" style={{ backgroundImage: `url(${item.img})` }} />
                                    : <div className="hd-preview-img hd-preview-empty">📜</div>}
                                <span>{item.title}</span>
                            </button>
                        ))}
                    </div>
                </section>
            )}

            <section className="hd-cta">
                <ScanLine size={28} />
                <h2>{t('hd_cta_title')}</h2>
                <p>{t('hd_cta_body')}</p>
                <div className="hd-hero-btns">
                    <button className="btn3d btn3d-orange" onClick={() => navigate('/lien-he')}>
                        {t('hd_cta_btn')}
                    </button>
                    <button className="btn3d btn3d-outline-white" onClick={() => navigate('/penpal')}>
                        {t('hd_cta_penpal')}
                    </button>
                </div>
            </section>
        </div>
    )
}
