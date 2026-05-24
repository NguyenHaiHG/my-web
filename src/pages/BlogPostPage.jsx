import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { useLang } from '../context/LanguageContext'
import { useState } from 'react'
import { Edit2, Trash2, Upload, X } from 'lucide-react'

export default function BlogPostPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { posts, deleteItem, updateItem } = useData()
    const { isMod, isAdmin } = useAuth()
    const { showToast } = useUI()
    const { t } = useLang()

    const post = posts.find(p => p.id === id || p._id === id)

    const [editOpen, setEditOpen] = useState(false)
    const [editForm, setEditForm] = useState(null)
    const [editPreview, setEditPreview] = useState('')

    const openEdit = () => {
        setEditForm({ title: post.title, content: post.content || '', author: post.author || '', img: post.img || '' })
        setEditPreview(post.img || '')
        setEditOpen(true)
    }

    const handleEditFile = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => {
            setEditPreview(ev.target.result)
            setEditForm(f => ({ ...f, img: ev.target.result }))
        }
        reader.readAsDataURL(file)
    }

    const saveEdit = async (e) => {
        e.preventDefault()
        try {
            await updateItem('post', post.id, editForm)
            setEditOpen(false)
            showToast(t('admin_update_btn'))
        } catch (err) {
            showToast('Lỗi cập nhật: ' + err.message)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('Bạn có chắc muốn xoá bài viết này?')) return
        await deleteItem('post', post.id)
        showToast(t('blog_deleted'))
        navigate('/blog')
    }

    if (!post) {
        return (
            <div className="page-enter" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                <p style={{ fontSize: 18, color: '#64748b' }}>Bài viết không tồn tại hoặc đã bị xoá.</p>
                <button className="btn3d btn3d-blue btn-sm" onClick={() => navigate('/blog')}>
                    <ArrowLeft size={16} /> {t('blog_back')}
                </button>
            </div>
        )
    }

    return (
        <div className="page-enter">
            {/* Edit Modal */}
            {editOpen && editForm && (
                <div className="modal-backdrop" onClick={() => setEditOpen(false)}>
                    <div className="modal modal-large" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setEditOpen(false)}><X size={16} /></button>
                        <h2 className="modal-title">✏️ {t('admin_edit_title')}</h2>
                        <form onSubmit={saveEdit} className="login-form">
                            <input className="form-input" placeholder={t('admin_title_ph')} value={editForm.title}
                                onChange={e => setEditForm({ ...editForm, title: e.target.value })} required />
                            <textarea className="form-input form-textarea" placeholder={t('admin_content_ph')} value={editForm.content}
                                onChange={e => setEditForm({ ...editForm, content: e.target.value })} required />
                            <input className="form-input" placeholder={t('admin_author_ph')} value={editForm.author}
                                onChange={e => setEditForm({ ...editForm, author: e.target.value })} />
                            <div className="img-upload-area">
                                <p className="img-upload-title"><Upload size={14} /> {t('admin_img_label')}</p>
                                <label className="img-upload-box">
                                    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={handleEditFile} />
                                    {editPreview
                                        ? <div className="img-preview-wrap">
                                            <img src={editPreview} alt="preview" className="img-preview" />
                                            <div className="img-preview-overlay"><Upload size={18} /> {t('admin_change_img')}</div>
                                        </div>
                                        : <div className="img-upload-placeholder">
                                            <Upload size={32} color="#94a3b8" />
                                            <span>{t('admin_img_click')}</span>
                                            <small>PNG · JPG · WEBP</small>
                                        </div>
                                    }
                                </label>
                                <div className="img-or">{t('admin_img_or')}</div>
                                <input className="form-input" placeholder="https://example.com/image.jpg"
                                    value={editForm.img} onChange={e => { setEditForm({ ...editForm, img: e.target.value }); setEditPreview(e.target.value) }} />
                            </div>
                            <button type="submit" className="btn3d btn3d-orange btn-full">{t('admin_update_btn')}</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="article-page">
                <div className="article-nav-bar">
                    <button className="btn-back" onClick={() => navigate('/blog')}>
                        <ArrowLeft size={18} /> {t('blog_back')}
                    </button>
                    {isMod && (
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn3d btn3d-orange btn-sm" onClick={openEdit}>
                                <Edit2 size={14} /> {t('blog_edit')}
                            </button>
                            {isAdmin && (
                                <button className="btn-card-del" onClick={handleDelete}>
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {post.img && <img src={post.img} alt={post.title} className="article-hero-img" />}
                <h1 className="article-title">{post.title}</h1>
                <div className="article-meta">
                    {post.date && <span><Calendar size={14} /> {post.date}</span>}
                    {post.author && <span><User size={14} /> {post.author}</span>}
                </div>
                <div className="article-body">{post.content}</div>
                <button className="btn-back mt-6" onClick={() => navigate('/blog')}>
                    <ArrowLeft size={18} /> {t('blog_back')}
                </button>
            </div>
        </div>
    )
}
