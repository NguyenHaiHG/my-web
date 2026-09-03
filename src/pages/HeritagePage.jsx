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

const PRINCIPLES = [
    { emoji: '🤝', titleKey: 'hd_pr1_title', bodyKey: 'hd_pr1_body' },
    { emoji: '🏠', titleKey: 'hd_pr2_title', bodyKey: 'hd_pr2_body' },
    { emoji: '🔥', titleKey: 'hd_pr3_title', bodyKey: 'hd_pr3_body' },
    { emoji: '🌐', titleKey: 'hd_pr4_title', bodyKey: 'hd_pr4_body' },
]

const COMMUNITIES = [
    { emoji: '🏡', titleKey: 'hd_c1_title', bodyKey: 'hd_c1_body', tagsKey: 'hd_c1_tags' },
    { emoji: '🧵', titleKey: 'hd_c2_title', bodyKey: 'hd_c2_body', tagsKey: 'hd_c2_tags' },
    { emoji: '👘', titleKey: 'hd_c3_title', bodyKey: 'hd_c3_body', tagsKey: 'hd_c3_tags' },
    { emoji: '🥁', titleKey: 'hd_c4_title', bodyKey: 'hd_c4_body', tagsKey: 'hd_c4_tags' },
]

const STEPS = [
    { n: '01', icon: '🎙️', titleKey: 'hd_s1_title', bodyKey: 'hd_s1_body' },
    { n: '02', icon: '📚', titleKey: 'hd_s2_title', bodyKey: 'hd_s2_body' },
    { n: '03', icon: '🔳', titleKey: 'hd_s3_title', bodyKey: 'hd_s3_body' },
    { n: '04', icon: '🤝', titleKey: 'hd_s4_title', bodyKey: 'hd_s4_body' },
]

const IMPACT = [
    { valueKey: 'hd_i1_value', titleKey: 'hd_i1_title', bodyKey: 'hd_i1_body' },
    { valueKey: 'hd_i2_value', titleKey: 'hd_i2_title', bodyKey: 'hd_i2_body' },
    { valueKey: 'hd_i3_value', titleKey: 'hd_i3_title', bodyKey: 'hd_i3_body' },
    { valueKey: 'hd_i4_value', titleKey: 'hd_i4_title', bodyKey: 'hd_i4_body' },
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

const TOOL_ACCENTS = ['#b45309', '#15803d', '#1d4ed8', '#c2410c']

function splitTags(value) {
    if (Array.isArray(value)) return value.filter(Boolean)
    if (typeof value === 'string') return value.split(',').map(item => item.trim()).filter(Boolean)
    return []
}

export default function HeritagePage({ siteContent = {} }) {
    const { t } = useLang()
    const navigate = useNavigate()
    const { libraryItems } = useData()
    const cmsHero = siteContent.hero || {}
    const why = siteContent.why || {}
    const closing = siteContent.closing || siteContent.cta || {}

    const principles = siteContent.principles?.items?.length
        ? siteContent.principles.items.map(item => ({
            emoji: item.emoji || '✦',
            title: item.title,
            body: item.body,
        }))
        : PRINCIPLES.map(item => ({ emoji: item.emoji, title: t(item.titleKey), body: t(item.bodyKey) }))

    const communities = siteContent.communities?.items?.length
        ? siteContent.communities.items.map(item => ({
            emoji: item.emoji || '🏛️',
            title: item.title,
            body: item.body,
            tags: splitTags(item.tags),
            image: item.image,
        }))
        : COMMUNITIES.map(item => ({
            emoji: item.emoji,
            title: t(item.titleKey),
            body: t(item.bodyKey),
            tags: splitTags(t(item.tagsKey)),
            image: '',
        }))

    const pillars = siteContent.pillars?.items?.length
        ? siteContent.pillars.items.map(item => ({
            emoji: item.emoji || '🏛️',
            title: item.title,
            body: item.body,
            image: item.image,
        }))
        : PILLARS.map(p => ({ emoji: p.emoji, title: t(p.titleKey), body: t(p.bodyKey), image: '' }))

    const tools = siteContent.tools?.items?.length
        ? siteContent.tools.items.map((item, i) => ({
            emoji: item.emoji || '📚',
            title: item.title,
            body: item.body,
            path: item.buttonHref || '/thu-vien',
            cta: item.buttonLabel || t('hd_open'),
            accent: TOOL_ACCENTS[i % TOOL_ACCENTS.length],
            image: item.image,
        }))
        : TOOLS.map(tool => ({
            emoji: tool.emoji,
            title: t(tool.titleKey),
            body: t(tool.bodyKey),
            path: tool.path,
            cta: t(tool.ctaKey),
            accent: tool.accent,
            image: '',
        }))

    const steps = siteContent.steps?.items?.length
        ? siteContent.steps.items.map((item, i) => ({
            n: item.n || String(i + 1).padStart(2, '0'),
            icon: item.icon || '✦',
            title: item.title,
            body: item.body,
        }))
        : STEPS.map(step => ({
            n: step.n,
            icon: step.icon,
            title: t(step.titleKey),
            body: t(step.bodyKey),
        }))

    const impact = siteContent.impact?.items?.length
        ? siteContent.impact.items.map(item => ({
            value: item.value,
            title: item.title,
            body: item.body,
        }))
        : IMPACT.map(item => ({
            value: t(item.valueKey),
            title: t(item.titleKey),
            body: t(item.bodyKey),
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
                        <button className="btn3d btn3d-orange" onClick={() => navigate(cmsHero.buttonHref || '/thu-vien')}>
                            {cmsHero.buttonLabel || t('hd_hero_library')} <ArrowRight size={16} />
                        </button>
                        <button className="btn3d btn3d-outline-white" onClick={() => navigate('/lien-he')}>
                            {t('hd_hero_join')}
                        </button>
                    </div>
                </div>
            </section>

            <section className="hd-section">
                <div className="hd-why-grid">
                    <div>
                        <div className="hd-kicker">{why.kicker || t('hd_why_kicker')}</div>
                        <h2 className="hd-h2">{why.title || t('hd_why_title')}</h2>
                        <p className="hd-lead">{why.body || t('hd_why_body')}</p>
                        <p className="hd-lead hd-lead-2">{why.body2 || t('hd_why_body2')}</p>
                    </div>
                    {why.image ? (
                        <figure className="hd-why-photo">
                            <img src={why.image} alt="" />
                        </figure>
                    ) : (
                        <aside className="hd-why-note">
                            <strong>{t('hd_why_note_title')}</strong>
                            <p>{t('hd_why_note_body')}</p>
                        </aside>
                    )}
                </div>
            </section>

            <section className="hd-section hd-section-alt">
                <div className="hd-kicker">{t('hd_principles_kicker')}</div>
                <h2 className="hd-h2">{t('hd_principles_title')}</h2>
                <p className="hd-lead">{t('hd_principles_body')}</p>
                <div className="hd-pillar-grid">
                    {principles.map((item, i) => (
                        <article key={item.title || i} className="hd-pillar">
                            <span className="hd-pillar-emoji">{item.emoji}</span>
                            <strong>{item.title}</strong>
                            <p>{item.body}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="hd-section">
                <div className="hd-kicker">{t('hd_communities_kicker')}</div>
                <h2 className="hd-h2">{t('hd_communities_title')}</h2>
                <p className="hd-lead">{t('hd_communities_body')}</p>
                <div className="hd-community-grid">
                    {communities.map((item, i) => (
                        <article key={item.title || i} className="hd-community">
                            {item.image && <div className="hd-community-img" style={{ backgroundImage: `url(${item.image})` }} />}
                            <span className="hd-pillar-emoji">{item.emoji}</span>
                            <strong>{item.title}</strong>
                            <p>{item.body}</p>
                            {item.tags?.length > 0 && (
                                <div className="hd-tags">
                                    {item.tags.map(tag => <span key={tag}>{tag}</span>)}
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            </section>

            <section className="hd-section hd-section-alt">
                <div className="hd-kicker">{t('hd_pillars_kicker')}</div>
                <h2 className="hd-h2">{t('hd_pillars_title')}</h2>
                <p className="hd-lead">{t('hd_pillars_body')}</p>
                <div className="hd-pillar-grid">
                    {pillars.map((pillar, i) => (
                        <article key={pillar.title || i} className="hd-pillar">
                            {pillar.image && <div className="hd-community-img" style={{ backgroundImage: `url(${pillar.image})` }} />}
                            <span className="hd-pillar-emoji">{pillar.emoji}</span>
                            <strong>{pillar.title}</strong>
                            <p>{pillar.body}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="hd-section">
                <div className="hd-kicker">{t('hd_tools_kicker')}</div>
                <h2 className="hd-h2">{t('hd_tools_title')}</h2>
                <p className="hd-lead">{t('hd_tools_body')}</p>
                <div className="hd-tool-grid">
                    {tools.map((tool, i) => (
                        <article key={tool.path || i} className="hd-tool" style={{ '--hd-accent': tool.accent }}>
                            {tool.image && <div className="hd-community-img" style={{ backgroundImage: `url(${tool.image})` }} />}
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

            <section className="hd-section hd-section-alt">
                <div className="hd-kicker">{t('hd_steps_kicker')}</div>
                <h2 className="hd-h2">{t('hd_steps_title')}</h2>
                <p className="hd-lead">{t('hd_steps_body')}</p>
                <div className="hd-steps">
                    {steps.map((step, i) => (
                        <article key={step.n || i} className="hd-step">
                            <span className="hd-step-n">{step.n}</span>
                            <span className="hd-step-icon">{step.icon}</span>
                            <strong>{step.title}</strong>
                            <p>{step.body}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="hd-section">
                <div className="hd-kicker">{t('hd_impact_kicker')}</div>
                <h2 className="hd-h2">{t('hd_impact_title')}</h2>
                <p className="hd-lead">{t('hd_impact_body')}</p>
                <div className="hd-impact-grid">
                    {impact.map((item, i) => (
                        <article key={item.title || i} className="hd-impact">
                            <span className="hd-impact-value">{item.value}</span>
                            <strong>{item.title}</strong>
                            <p>{item.body}</p>
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
                <h2>{closing.title || t('hd_cta_title')}</h2>
                <p>{closing.body || t('hd_cta_body')}</p>
                <div className="hd-hero-btns">
                    <button className="btn3d btn3d-orange" onClick={() => navigate(closing.buttonHref || '/lien-he')}>
                        {closing.buttonLabel || t('hd_cta_btn')}
                    </button>
                    <button className="btn3d btn3d-outline-white" onClick={() => navigate(closing.button2Href || '/penpal')}>
                        {closing.button2Label || t('hd_cta_penpal')}
                    </button>
                </div>
            </section>
        </div>
    )
}
