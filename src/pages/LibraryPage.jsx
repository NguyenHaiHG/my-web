import { useState, useMemo } from 'react'
import { Search, X, ChevronLeft, BookOpen } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import './LibraryPage.css'

const CATS = [
    { id: 'all', label: 'Tất cả', emoji: '📚' },
    { id: 'nature', label: 'Thiên nhiên', emoji: '🌿' },
    { id: 'language', label: 'Ngôn ngữ', emoji: '🗣️' },
    { id: 'culture', label: 'Văn hoá', emoji: '🎭' },
    { id: 'craft', label: 'Thủ công', emoji: '🧵' },
    { id: 'food', label: 'Ẩm thực', emoji: '🍜' },
    { id: 'story', label: 'Truyện cổ', emoji: '📖' },
]

const CAT_COLORS = {
    nature: { bg: '#f0fdf4', border: '#86efac', badge: '#16a34a' },
    language: { bg: '#eff6ff', border: '#93c5fd', badge: '#2563eb' },
    culture: { bg: '#faf5ff', border: '#d8b4fe', badge: '#7c3aed' },
    craft: { bg: '#fff7ed', border: '#fdba74', badge: '#ea580c' },
    food: { bg: '#fefce8', border: '#fde047', badge: '#ca8a04' },
    story: { bg: '#fdf2f8', border: '#f0abfc', badge: '#a21caf' },
}

function catLabel(id) { return CATS.find(c => c.id === id) || CATS[0] }

/* ── Detail Modal ── */
function DetailModal({ item, onClose, onEdit, onDelete, isMod }) {
    const cat = catLabel(item.category)
    const colors = CAT_COLORS[item.category] || CAT_COLORS.nature

    return (
        <div className="lp-backdrop" onClick={onClose}>
            <div className="lp-detail" onClick={e => e.stopPropagation()}>
                <div className="lp-detail-head" style={{ background: colors.bg, borderBottom: `1px solid ${colors.border}` }}>
                    <button className="lp-icon-btn" onClick={onClose}><ChevronLeft size={20} /></button>
                    <span className="lp-detail-cat" style={{ color: colors.badge }}>
                        {cat.emoji} {cat.label}
                        {item.ethnic && <span className="lp-detail-ethnic"> · {item.ethnic}</span>}
                    </span>
                    {isMod && (
                        <div style={{ display: 'flex', gap: 4 }}>
                            <button className="lp-icon-btn" onClick={() => onEdit(item)} title="Sửa">✏️</button>
                            <button className="lp-icon-btn lp-del-btn" onClick={() => onDelete(item.id)} title="Xoá">🗑️</button>
                        </div>
                    )}
                    {!isMod && <div style={{ width: 36 }} />}
                </div>

                {item.img && (
                    <div className="lp-detail-img">
                        <img src={item.img} alt={item.title} />
                    </div>
                )}

                <div className="lp-detail-body">
                    <h2 className="lp-detail-title">{item.title}</h2>

                    {(item.pronunciation || item.translation) && (
                        <div className="lp-lang-box">
                            {item.pronunciation && <div className="lp-pronunciation">🔊 {item.pronunciation}</div>}
                            {item.translation && <div className="lp-translation">🌐 {item.translation}</div>}
                        </div>
                    )}

                    {item.content && (
                        <div className="lp-content">
                            <div className="lp-content-rule" />
                            <p>{item.content}</p>
                        </div>
                    )}

                    {item.tags?.length > 0 && (
                        <div className="lp-tags">
                            {item.tags.map(t => (
                                <span key={t} className="lp-tag">#{t}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

/* ── Library Card ── */
function LibCard({ item, onClick }) {
    const cat = catLabel(item.category)
    const colors = CAT_COLORS[item.category] || CAT_COLORS.nature

    return (
        <article className="lp-card" onClick={onClick} tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onClick()}
            style={{ '--cat-bg': colors.bg, '--cat-border': colors.border }}>
            {item.img ? (
                <div className="lp-card-img">
                    <img src={item.img} alt={item.title} loading="lazy" />
                    <span className="lp-card-cat-badge" style={{ background: colors.badge }}>
                        {cat.emoji}
                    </span>
                </div>
            ) : (
                <div className="lp-card-no-img" style={{ background: colors.bg }}>
                    <span className="lp-card-cat-big">{cat.emoji}</span>
                </div>
            )}
            <div className="lp-card-body">
                <span className="lp-card-cat-label" style={{ color: colors.badge, background: colors.bg }}>
                    {cat.label}
                </span>
                <h3 className="lp-card-title">{item.title}</h3>
                {item.ethnic && <p className="lp-card-ethnic">👥 {item.ethnic}</p>}
                {item.pronunciation && (
                    <p className="lp-card-pronun">🔊 {item.pronunciation}</p>
                )}
                {item.content && (
                    <p className="lp-card-excerpt">{item.content}</p>
                )}
            </div>
        </article>
    )
}

/* ── MAIN PAGE ── */
export default function LibraryPage() {
    const { libraryItems, deleteItem } = useData()
    const { isMod } = useAuth()
    const { setAdminModal, setEditItem, showToast } = useUI()
    const [cat, setCat] = useState('all')
    const [search, setSearch] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [detail, setDetail] = useState(null)

    const filtered = useMemo(() => {
        const q = search.toLowerCase()
        return libraryItems.filter(item => {
            const matchCat = cat === 'all' || item.category === cat
            const matchQ = !q ||
                item.title?.toLowerCase().includes(q) ||
                item.content?.toLowerCase().includes(q) ||
                item.ethnic?.toLowerCase().includes(q) ||
                item.pronunciation?.toLowerCase().includes(q) ||
                item.tags?.some(t => t.toLowerCase().includes(q))
            return matchCat && matchQ
        })
    }, [libraryItems, cat, search])

    const handleDelete = async (id) => {
        if (!window.confirm('Xoá mục này?')) return
        await deleteItem('library', id)
        setDetail(null)
        showToast('Đã xoá')
    }

    const handleEdit = (item) => {
        setDetail(null)
        setEditItem({ type: 'library', item })
    }

    return (
        <div className="lp-page page-enter">
            {/* HERO */}
            <div className="lp-hero">
                <div className="lp-hero-deco" aria-hidden>
                    <span>🌿</span><span>🗣️</span><span>🎭</span><span>🧵</span><span>📖</span>
                </div>
                <div className="lp-hero-content">
                    <div className="lp-hero-badge"><BookOpen size={13} /> Thư viện số</div>
                    <h1>Kho tri thức bản địa</h1>
                    <p>Thiên nhiên · Ngôn ngữ · Văn hoá · Thủ công · Ẩm thực — của các dân tộc vùng cao Hà Giang</p>
                </div>
            </div>

            {/* TOOLBAR */}
            <div className="lp-toolbar">
                <div className="lp-filter-row">
                    {CATS.map(c => (
                        <button key={c.id}
                            className={`lp-pill${cat === c.id ? ' lp-pill-active' : ''}`}
                            onClick={() => setCat(c.id)}>
                            {c.emoji} <span className="lp-pill-label">{c.label}</span>
                        </button>
                    ))}
                </div>
                <div className="lp-toolbar-right">
                    <button className="lp-icon-btn" onClick={() => setShowSearch(s => !s)} title="Tìm kiếm">
                        <Search size={18} />
                    </button>
                    {isMod && (
                        <button className="lp-btn-add" onClick={() => setAdminModal('library')}>
                            + Thêm
                        </button>
                    )}
                </div>
            </div>

            {/* SEARCH */}
            {showSearch && (
                <div className="lp-searchbar">
                    <Search size={15} color="#94a3b8" />
                    <input className="lp-search-input"
                        placeholder="Tìm tên, dân tộc, từ khoá…"
                        value={search} onChange={e => setSearch(e.target.value)} autoFocus />
                    {search && <button className="lp-icon-btn" onClick={() => setSearch('')}><X size={15} /></button>}
                </div>
            )}

            {/* GRID */}
            <div className="lp-container">
                <div className="lp-count">
                    {filtered.length} mục {cat !== 'all' && `· ${catLabel(cat).label}`}
                    {search && ` · "${search}"`}
                </div>

                {filtered.length === 0 ? (
                    <div className="lp-empty">
                        <span>📚</span>
                        <p>{libraryItems.length === 0 ? 'Thư viện chưa có nội dung.' : 'Không tìm thấy mục nào.'}</p>
                        {(cat !== 'all' || search) && (
                            <button className="lp-btn-link" onClick={() => { setCat('all'); setSearch('') }}>Xoá bộ lọc</button>
                        )}
                    </div>
                ) : (
                    <div className="lp-grid">
                        {filtered.map(item => (
                            <LibCard key={item.id} item={item} onClick={() => setDetail(item)} />
                        ))}
                    </div>
                )}
            </div>

            {/* DETAIL */}
            {detail && (
                <DetailModal
                    item={detail}
                    onClose={() => setDetail(null)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isMod={isMod}
                />
            )}
        </div>
    )
}
