import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    FileText, Package, MapPin, BookOpen, Users, Heart,
    Star, Plus, Trash2, Check, X, Edit2, LayoutDashboard,
    ChevronDown, ChevronRight, Bell, LogOut, Upload, Save
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { useOrder } from '../context/OrderContext'
import { useUI } from '../context/UIContext'
import { useLang } from '../context/LanguageContext'

const NAV_ITEMS = [
    { key: 'overview', icon: <LayoutDashboard size={18} />, label: 'Tổng quan' },
    { key: 'workshops', icon: <Users size={18} />, label: 'Workshop' },
    { key: 'workshop-regs', icon: <Check size={18} />, label: 'Đăng ký WS' },
    { key: 'library', icon: <BookOpen size={18} />, label: 'Thư viện số' },
    { key: 'posts', icon: <FileText size={18} />, label: 'Bài viết' },
    { key: 'products', icon: <Package size={18} />, label: 'Sản phẩm' },
    { key: 'tours', icon: <MapPin size={18} />, label: 'Discover' },
    { key: 'tour-bookings', icon: <MapPin size={18} />, label: 'Đặt lịch' },
    { key: 'volunteers', icon: <Heart size={18} />, label: 'Tình nguyện' },
    { key: 'reviews', icon: <Star size={18} />, label: 'Reviews' },
]

const STATUS_COLORS = { pending: '#f59e0b', confirmed: '#2563eb', done: '#16a34a', cancelled: '#dc2626', approved: '#16a34a', rejected: '#dc2626' }

/* ── OVERVIEW ── */
function Overview({ data, orders }) {
    const navigate = useNavigate()
    const cards = [
        { label: 'Bài viết', val: data.posts.length, color: '#2563eb', icon: <FileText size={22} />, link: '/blog' },
        { label: 'Workshops', val: data.workshops.length, color: '#7c3aed', icon: <Users size={22} />, link: '/workshop' },
        { label: 'Đăng ký WS', val: orders.workshopRegs.length, color: '#db2777', icon: <Check size={22} /> },
        { label: 'Đặt lịch', val: orders.tourBookings.length, color: '#f97316', icon: <MapPin size={22} />, link: '/tours' },
        { label: 'Đơn TNV', val: orders.volunteerApps.length, color: '#16a34a', icon: <Heart size={22} />, link: '/tinh-nguyen' },
        { label: 'Reviews chờ duyệt', val: data.reviews.filter(r => !r.approved).length, color: '#c05621', icon: <Star size={22} /> },
    ]
    return (
        <div>
            <h2 className="db-section-title">Tổng quan</h2>
            <div className="db-stats-grid">
                {cards.map((c, i) => (
                    <div key={i} className="db-stat-card" style={{ borderTopColor: c.color }}
                        onClick={() => c.link && navigate(c.link)}>
                        <div className="db-stat-icon" style={{ background: c.color + '18', color: c.color }}>{c.icon}</div>
                        <div>
                            <div className="db-stat-val">{c.val}</div>
                            <div className="db-stat-label">{c.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <h3 className="db-sub-title">Thông báo gần đây</h3>
            <div className="db-notif-list">
                {orders.notifications.slice(0, 8).map((n, i) => (
                    <div key={i} className={`db-notif-item ${n.read ? '' : 'db-notif-unread'}`}>
                        <span>{n.message}</span>
                        <span className="db-notif-time">{n.time}</span>
                    </div>
                ))}
                {orders.notifications.length === 0 && <p className="empty-state">Chưa có thông báo nào.</p>}
            </div>
        </div>
    )
}

/* ── CONTENT TABLE ── */
function ContentTable({ type, items, onAdd, onDelete, onEdit, columns }) {
    return (
        <div>
            <div className="db-table-header">
                <h2 className="db-section-title">{NAV_ITEMS.find(n => n.key === type)?.label}</h2>
                {onAdd && (
                    <button className="btn3d btn3d-green btn-sm" onClick={onAdd}>
                        <Plus size={14} /> Thêm mới
                    </button>
                )}
            </div>
            {items.length === 0 ? (
                <p className="empty-state">Chưa có dữ liệu.</p>
            ) : (
                <div className="db-table-wrap">
                    <table className="db-table">
                        <thead>
                            <tr>{columns.map(c => <th key={c.key}>{c.label}</th>)}<th>Thao tác</th></tr>
                        </thead>
                        <tbody>
                            {items.map((item, i) => (
                                <tr key={item.id || i}>
                                    {columns.map(c => (
                                        <td key={c.key}>
                                            {c.render ? c.render(item) : (item[c.key] || '—')}
                                        </td>
                                    ))}
                                    <td>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            {onEdit && (
                                                <button className="btn3d btn3d-blue btn-xs" onClick={() => onEdit(item)}>
                                                    <Edit2 size={12} />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button className="btn-card-del" onClick={() => onDelete(item.id)}>
                                                    <Trash2 size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

/* ── APPLICATIONS TABLE ── */
function AppTable({ title, items, statusKey, onStatusChange, onDelete }) {
    const STATUS_OPTS = statusKey === 'volunteer'
        ? [['pending', '⏳ Chờ'], ['approved', '✅ Duyệt'], ['rejected', '❌ Từ chối']]
        : [['pending', '⏳ Chờ'], ['confirmed', '✅ Xác nhận'], ['cancelled', '❌ Huỷ']]

    return (
        <div>
            <h2 className="db-section-title">{title}</h2>
            {items.length === 0 ? (
                <p className="empty-state">Chưa có dữ liệu.</p>
            ) : (
                <div className="db-app-list">
                    {items.map((item, i) => (
                        <div key={item.id || i} className="db-app-card">
                            <div className="db-app-info">
                                <strong>{item.name}</strong>
                                {item.phone && <span>📞 {item.phone}</span>}
                                {item.email && <span>✉️ {item.email}</span>}
                                {item.workshopTitle && <span>🎓 {item.workshopTitle}</span>}
                                {item.tourTitle && <span>🗺️ {item.tourTitle}</span>}
                                {item.skills && <span>🛠️ {item.skills}</span>}
                                {item.availability && <span>📅 {item.availability}</span>}
                                {item.motivation && <p style={{ color: '#64748b', fontSize: 13 }}>"{item.motivation}"</p>}
                                {item.date && <span style={{ color: '#94a3b8', fontSize: 12 }}>🕐 {item.date || item.date_submitted}</span>}
                            </div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <select className={`status-select status-${item.status}`} value={item.status}
                                    onChange={e => onStatusChange(statusKey, item.id, e.target.value)}>
                                    {STATUS_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                                </select>
                                <button className="btn-card-del" onClick={() => onDelete(statusKey, item.id)}>
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

/* ── EDIT MODAL ── */
const FIELD_DEFS = {
    post: ['title', 'content', 'author', 'img'],
    workshop: ['title', 'content', 'date', 'time', 'category', 'capacity', 'status', 'instructor', 'img'],
    library: ['title', 'content', 'category', 'ethnic', 'pronunciation', 'translation', 'img'],
    product: ['title', 'desc', 'price', 'img'],
    tour: ['title', 'desc', 'price', 'duration', 'img'],
    review: ['name', 'country', 'rating', 'content'],
}
const FIELD_META = {
    title: { label: 'Tiêu đề', type: 'text', required: true },
    content: { label: 'Nội dung', type: 'textarea' },
    desc: { label: 'Mô tả', type: 'textarea' },
    author: { label: 'Tác giả', type: 'text' },
    date: { label: 'Ngày', type: 'text' },
    time: { label: 'Giờ', type: 'text' },
    category: { label: 'Danh mục / Loại', type: 'text' },
    capacity: { label: 'Sức chứa', type: 'number' },
    status: { label: 'Trạng thái', type: 'text' },
    instructor: { label: 'Giảng viên', type: 'text' },
    ethnic: { label: 'Dân tộc', type: 'text' },
    pronunciation: { label: 'Phát âm', type: 'text' },
    translation: { label: 'Dịch nghĩa', type: 'text' },
    price: { label: 'Giá', type: 'text' },
    duration: { label: 'Thời gian', type: 'text' },
    name: { label: 'Tên', type: 'text' },
    country: { label: 'Quốc gia', type: 'text' },
    rating: { label: 'Đánh giá (1-5)', type: 'number' },
    img: { label: 'Ảnh', type: 'image' },
}

function EditModal({ type, item, onClose, onSave }) {
    const fields = FIELD_DEFS[type] || Object.keys(item).filter(k => k !== 'id' && k !== '_id')
    const [form, setForm] = useState(() => {
        const f = {}
        fields.forEach(k => { f[k] = item[k] ?? '' })
        return f
    })
    const [preview, setPreview] = useState(item.img || '')
    const [saving, setSaving] = useState(false)

    const handleFile = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => {
            setPreview(ev.target.result)
            setForm(f => ({ ...f, img: ev.target.result }))
        }
        reader.readAsDataURL(file)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        await onSave(form)
        setSaving(false)
    }

    const TYPE_LABELS = { post: 'Bài viết', workshop: 'Workshop', library: 'Thư viện', product: 'Sản phẩm', tour: 'Discover', review: 'Review' }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal modal-large edit-modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}><X size={16} /></button>
                <h2 className="modal-title">✏️ Chỉnh sửa {TYPE_LABELS[type] || type}</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    {fields.map(key => {
                        const meta = FIELD_META[key] || { label: key, type: 'text' }
                        if (meta.type === 'image') return (
                            <div key={key} className="img-upload-area">
                                <p className="img-upload-title"><Upload size={14} /> Ảnh</p>
                                {/* Current image preview */}
                                {preview && (
                                    <div className="edit-img-current">
                                        <img src={preview} alt="current" />
                                        <button type="button" className="edit-img-remove" onClick={() => { setPreview(''); setForm(f => ({ ...f, img: '' })) }}>
                                            <X size={12} /> Xoá ảnh
                                        </button>
                                    </div>
                                )}
                                <label className="img-upload-box">
                                    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={handleFile} />
                                    <div className="img-upload-placeholder" style={{ padding: '14px' }}>
                                        <Upload size={22} color="#94a3b8" />
                                        <span style={{ fontSize: 13 }}>{preview ? 'Thay ảnh mới' : 'Tải ảnh lên'}</span>
                                        <small>PNG · JPG · WEBP</small>
                                    </div>
                                </label>
                                <div className="img-or">hoặc dán URL</div>
                                <input className="form-input" placeholder="https://..." value={form.img}
                                    onChange={e => { setForm(f => ({ ...f, img: e.target.value })); setPreview(e.target.value) }} />
                            </div>
                        )
                        if (meta.type === 'textarea') return (
                            <div key={key}>
                                <label className="edit-field-label">{meta.label}</label>
                                <textarea className="form-input form-textarea" value={form[key]}
                                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                            </div>
                        )
                        return (
                            <div key={key}>
                                <label className="edit-field-label">{meta.label}</label>
                                <input className="form-input" type={meta.type || 'text'} required={meta.required}
                                    value={form[key]}
                                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                            </div>
                        )
                    })}
                    <button type="submit" className="btn3d btn3d-green btn-full" disabled={saving}>
                        <Save size={15} /> {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default function DashboardPage() {
    const navigate = useNavigate()
    const { user, logout, isMod } = useAuth()
    const data = useData()
    const orders = useOrder()
    const { setAdminModal, showToast } = useUI()
    const { t } = useLang()
    const [activeTab, setActiveTab] = useState('overview')
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [editState, setEditState] = useState(null) // { type, item }

    const openEdit = (type, item) => setEditState({ type, item })
    const closeEdit = () => setEditState(null)

    if (!isMod) {
        return (
            <div className="container py-section text-center">
                <p style={{ color: '#dc2626', fontSize: 18 }}>Bạn không có quyền truy cập trang này.</p>
                <button className="btn3d btn3d-blue btn-sm" style={{ marginTop: 16 }} onClick={() => navigate('/')}>
                    Về trang chủ
                </button>
            </div>
        )
    }

    const handleDelete = async (type, id) => {
        if (!window.confirm('Bạn có chắc muốn xoá?')) return
        try {
            await data.deleteItem(type, id)
            showToast('Đã xoá thành công')
        } catch (e) {
            showToast('Lỗi: ' + e.message)
        }
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <Overview data={data} orders={orders} />
            case 'posts':
                return <ContentTable type="posts" items={data.posts}
                    onAdd={() => setAdminModal('post')}
                    onDelete={(id) => handleDelete('post', id)}
                    onEdit={(item) => openEdit('post', item)}
                    columns={[
                        { key: 'title', label: 'Tiêu đề' },
                        { key: 'author', label: 'Tác giả' },
                        { key: 'date', label: 'Ngày' },
                    ]} />
            case 'workshops':
                return <ContentTable type="workshops" items={data.workshops}
                    onAdd={() => setAdminModal('workshop')}
                    onDelete={(id) => handleDelete('workshop', id)}
                    onEdit={(item) => openEdit('workshop', item)}
                    columns={[
                        { key: 'title', label: 'Tên workshop' },
                        { key: 'date', label: 'Ngày' },
                        { key: 'category', label: 'Loại' },
                        { key: 'capacity', label: 'Sức chứa' },
                        { key: 'status', label: 'Trạng thái', render: w => <span style={{ color: w.status === 'upcoming' ? '#2563eb' : w.status === 'ongoing' ? '#16a34a' : '#64748b' }}>{w.status}</span> },
                    ]} />
            case 'workshop-regs':
                return <AppTable title="Đăng ký Workshop" items={orders.workshopRegs}
                    statusKey="workshop" onStatusChange={orders.updateOrderStatus} onDelete={orders.deleteOrder} />
            case 'library':
                return <ContentTable type="library" items={data.libraryItems}
                    onAdd={() => setAdminModal('library')}
                    onDelete={(id) => handleDelete('library', id)}
                    onEdit={(item) => openEdit('library', item)}
                    columns={[
                        { key: 'title', label: 'Tiêu đề' },
                        { key: 'category', label: 'Danh mục' },
                        { key: 'ethnic', label: 'Dân tộc' },
                    ]} />
            case 'products':
                return <ContentTable type="products" items={data.products}
                    onAdd={() => setAdminModal('product')}
                    onDelete={(id) => handleDelete('product', id)}
                    onEdit={(item) => openEdit('product', item)}
                    columns={[
                        { key: 'title', label: 'Tên sản phẩm' },
                        { key: 'price', label: 'Giá' },
                    ]} />
            case 'tours':
                return <ContentTable type="tours" items={data.tours}
                    onAdd={() => setAdminModal('tour')}
                    onDelete={(id) => handleDelete('tour', id)}
                    onEdit={(item) => openEdit('tour', item)}
                    columns={[
                        { key: 'title', label: 'Tên' },
                        { key: 'price', label: 'Giá' },
                        { key: 'duration', label: 'Thời gian' },
                    ]} />
            case 'tour-bookings':
                return <AppTable title="Booking Discover" items={orders.tourBookings}
                    statusKey="tour" onStatusChange={orders.updateOrderStatus} onDelete={orders.deleteOrder} />
            case 'volunteers':
                return <AppTable title="Đơn Tình Nguyện" items={orders.volunteerApps}
                    statusKey="volunteer" onStatusChange={orders.updateOrderStatus} onDelete={orders.deleteOrder} />
            case 'reviews':
                return (
                    <div>
                        <h2 className="db-section-title">Reviews du khách</h2>
                        {data.reviews.length === 0 ? <p className="empty-state">Chưa có review nào.</p> : (
                            <div className="db-app-list">
                                {data.reviews.map((r, i) => (
                                    <div key={r.id || i} className="db-app-card">
                                        <div className="db-app-info">
                                            <strong>{r.name}</strong>
                                            {r.country && <span>🌍 {r.country}</span>}
                                            <span>{'⭐'.repeat(r.rating || 5)}</span>
                                            <p style={{ color: '#374151', fontSize: 14 }}>"{r.content}"</p>
                                            <span className={`ws-status ${r.approved ? 'ws-status-ongoing' : 'ws-status-upcoming'}`}>
                                                {r.approved ? '✅ Đã duyệt' : '⏳ Chờ duyệt'}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            {!r.approved && (
                                                <button className="btn3d btn3d-green btn-sm"
                                                    onClick={() => data.updateItem('review', r.id, { approved: true })}>
                                                    <Check size={14} /> Duyệt
                                                </button>
                                            )}
                                            <button className="btn-card-del"
                                                onClick={() => handleDelete('review', r.id)}>
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )
            default: return null
        }
    }

    return (
        <div className="db-layout">
            {editState && (
                <EditModal
                    type={editState.type}
                    item={editState.item}
                    onClose={closeEdit}
                    onSave={async (changes) => {
                        try {
                            await data.updateItem(editState.type, editState.item.id, changes)
                            showToast('✅ Đã lưu thay đổi!')
                            closeEdit()
                        } catch (e) {
                            showToast('❌ Lỗi: ' + e.message)
                        }
                    }}
                />
            )}
            {/* SIDEBAR */}
            <aside className={`db-sidebar ${sidebarOpen ? 'db-sidebar-open' : 'db-sidebar-collapsed'}`}>
                <div className="db-sidebar-header">
                    <span className="db-sidebar-logo">HTX Dashboard</span>
                    <button className="db-collapse-btn" onClick={() => setSidebarOpen(o => !o)}>
                        {sidebarOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                </div>
                <nav className="db-nav">
                    {NAV_ITEMS.map(item => (
                        <button key={item.key}
                            className={`db-nav-item ${activeTab === item.key ? 'db-nav-active' : ''}`}
                            onClick={() => setActiveTab(item.key)}>
                            {item.icon}
                            {sidebarOpen && <span>{item.label}</span>}
                            {item.key === 'workshop-regs' && orders.workshopRegs.filter(r => r.status === 'pending').length > 0 && (
                                <span className="db-badge">{orders.workshopRegs.filter(r => r.status === 'pending').length}</span>
                            )}
                            {item.key === 'volunteers' && orders.volunteerApps.filter(a => a.status === 'pending').length > 0 && (
                                <span className="db-badge">{orders.volunteerApps.filter(a => a.status === 'pending').length}</span>
                            )}
                        </button>
                    ))}
                </nav>
                <div className="db-sidebar-footer">
                    <div className="db-user-info">
                        <span className={`role-badge role-${user?.role}`}>{user?.role?.toUpperCase()}</span>
                        {sidebarOpen && <span className="db-username">{user?.name}</span>}
                    </div>
                    <button className="db-logout-btn" onClick={() => { logout(); navigate('/') }}>
                        <LogOut size={14} />
                        {sidebarOpen && <span>Đăng xuất</span>}
                    </button>
                </div>
            </aside>

            {/* MAIN */}
            <main className="db-main">
                <div className="db-topbar">
                    <div className="db-topbar-left">
                        <button className="db-topbar-back" onClick={() => navigate('/')}>← Về trang chủ</button>
                    </div>
                    <div className="db-topbar-right">
                        <span className="db-notif-btn">
                            <Bell size={18} />
                            {orders.unread > 0 && <span className="db-notif-dot">{orders.unread}</span>}
                        </span>
                    </div>
                </div>
                <div className="db-content">
                    {renderContent()}
                </div>
            </main>
        </div>
    )
}
