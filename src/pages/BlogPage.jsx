import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Trash2, Edit2, Calendar, User } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { useLang } from '../context/LanguageContext'

export default function BlogPage() {
  const { posts, deleteItem } = useData()
  const { isMod, isAdmin } = useAuth()
  const { setAdminModal, setEditItem, showToast } = useUI()
  const { t } = useLang()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.content || '').toLowerCase().includes(search.toLowerCase())
  )

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
              {post.img && (
                <div
                  className="blog-card-img"
                  style={{ backgroundImage: `url(${post.img || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80'})`, cursor: 'pointer' }}
                  onClick={() => navigate(`/blog/${post.id}`)}
                />
              )}
              <div className="blog-card-body">
                <div className="blog-meta">
                  {post.date && <span><Calendar size={12} /> {post.date}</span>}
                  {post.author && <span><User size={12} /> {post.author}</span>}
                </div>
                <h3 className="blog-title" style={{ cursor: 'pointer' }} onClick={() => navigate(`/blog/${post.id}`)}>
                  {post.title}
                </h3>
                <p className="blog-excerpt">{(post.content || '').slice(0, 120)}...</p>
                <div className="blog-actions">
                  <button className="btn3d btn3d-blue btn-sm" onClick={() => navigate(`/blog/${post.id}`)}>
                    {t('blog_read_more')}
                  </button>
                  {isMod && (
                    <button className="btn3d btn3d-orange btn-sm" onClick={() => setEditItem({ type: 'post', item: post })}>
                      <Edit2 size={14} /> {t('blog_edit')}
                    </button>
                  )}
                  {isAdmin && (
                    <button className="btn-card-del" onClick={() => { deleteItem('post', post.id); showToast(t('blog_deleted')) }}>
                      <Trash2 size={14} />
                    </button>
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
