import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Star, Medal } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useLang } from '../context/LanguageContext'

const FALLBACK = [
    { name: 'Linh N.', reviews: 4, stars: 19, country: 'Việt Nam' },
    { name: 'Tom H.', reviews: 3, stars: 15, country: 'UK' },
    { name: 'Mei T.', reviews: 3, stars: 14, country: 'Japan' },
]

export default function ContributionLeaderboardPage() {
    const { reviews } = useData()
    const { t } = useLang()

    const ranked = useMemo(() => {
        const approved = reviews.filter(r => r.approved)
        if (approved.length === 0) return FALLBACK

        const map = new Map()
        approved.forEach((r) => {
            const key = (r.name || 'Guest').trim()
            const old = map.get(key) || { name: key, reviews: 0, stars: 0, country: r.country || '' }
            old.reviews += 1
            old.stars += Number(r.rating || 0)
            map.set(key, old)
        })

        return Array.from(map.values())
            .sort((a, b) => b.stars - a.stars || b.reviews - a.reviews)
            .slice(0, 20)
    }, [reviews])

    return (
        <div className="page-enter">
            <div className="container py-section" style={{ maxWidth: 980 }}>
                <div className="section-header-center" style={{ marginBottom: 20 }}>
                    <span className="section-label">{t('star_label')}</span>
                    <h1 style={{ marginTop: 6 }}>{t('star_title')}</h1>
                    <p style={{ color: '#64748b' }}>{t('star_sub')}</p>
                </div>

                <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 10px 30px #0000000f', overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '80px 1.4fr 1fr 1fr', gap: 8, padding: '12px 16px', background: '#f8fafc', fontWeight: 700, color: '#334155' }}>
                        <span>#</span>
                        <span>{t('star_col_customer')}</span>
                        <span>{t('star_col_reviews')}</span>
                        <span>{t('star_col_stars')}</span>
                    </div>

                    {ranked.map((item, idx) => (
                        <div key={item.name} style={{ display: 'grid', gridTemplateColumns: '80px 1.4fr 1fr 1fr', gap: 8, padding: '12px 16px', borderTop: '1px solid #f1f5f9', alignItems: 'center' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 800 }}>
                                {idx === 0 ? <Trophy size={16} color="#d97706" /> : idx === 1 ? <Medal size={16} color="#64748b" /> : idx === 2 ? <Medal size={16} color="#b45309" /> : null}
                                {idx + 1}
                            </span>
                            <span>
                                <strong>{item.name}</strong>
                                {item.country ? <span style={{ color: '#64748b', marginLeft: 8 }}>· {item.country}</span> : null}
                            </span>
                            <span>{item.reviews}</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#b45309', fontWeight: 700 }}>
                                <Star size={14} fill="currentColor" /> {item.stars}
                            </span>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
                    <Link to="/gioi-thieu" className="btn3d btn3d-orange">
                        {t('star_cta')}
                    </Link>
                </div>
            </div>
        </div>
    )
}
