import { useState } from 'react'
import { Search, Plus, Trash2, Calendar, User, ArrowLeft } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { useLang } from '../context/LanguageContext'

export default function BlogPage() {
  const { posts } = useData()
  const { deleteItem } = useData()
  const { isMod, isAdmin } = useAuth()
  const { setAdminModal, showToast } = useUI()
  const { t } = useLang()
  const [search, setSearch] = useState('')
  const [article, setArticle] = useState(null)

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.content || '').toLowerCase().includes(search.toLowerCase())
  )

  if (article) {
    return (
      <div className="page-enter">
        <div className="article-page">
          <button className="btn-back" onClick={() => setArticle(null)}><ArrowLeft size={18} /> {t('blog_back')}</button>
          {article.img && <img src={article.img} alt={article.title} className="article-hero-img" />}
          <h1 className="article-title">{article.title}</h1>
          <div className="article-meta">
            {article.date && <span><Calendar size={14} /> {article.date}</span>}
            {article.author && <span><User size={14} /> {article.author}</span>}
          </div>
          <div className="article-body">{article.content}</div>
          <button className="btn-back mt-6" onClick={() => setArticle(null)}><ArrowLeft size={18} /> {t('blog_back')}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-enter">
      <div className="page-hero" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=80)' }}>
        <div className="ph-overlay" />
        <div className="ph-content">
          <h1>{t('blog_hero_title')}</h1>
          <p>{t('blog_hero_sub')}</p>
        </div>
      </div>

      <div className="container py-section">
        <div className="page-toolbar">
          <div className="search-box"><Search size={17} color="#94a3b8" />
            <input placeholder={t('blog_search')} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {isMod && <button className="btn3d btn3d-green btn-sm" onClick={() => setAdminModal('post')}><Plus size={15} /> {t('blog_add')}</button>}
        </div>

        <div className="blog-grid mt-6">
          {filtered.map(post => (
            <article key={post.id} className="blog-card">
              {post.img && <div className="blog-card-img" style={{ backgroundImage: `url(${post.img})` }} />}
              <div className="blog-card-body">
                <div className="blog-meta">
                  {post.date && <span><Calendar size={12} /> {post.date}</span>}
                  {post.author && <span><User size={12} /> {post.author}</span>}
                </div>
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-excerpt">{(post.content || '').slice(0, 120)}...</p>
                <div className="blog-actions">
                  <button className="btn3d btn3d-blue btn-sm" onClick={() => setArticle(post)}>{t('blog_read_more')}</button>
                  {isAdmin && (
                    <button className="btn-card-del" onClick={() => { deleteItem('post', post.id); showToast(t('blog_deleted')) }}><Trash2 size={14} /></button>
                  )}
                </div>
              </div>
            </article>
          ))}
          {filtered.length === 0 && <p className="empty-state">{t('blog_empty')}</p>}
        </div>
      </div>
    </div>
  )
}
