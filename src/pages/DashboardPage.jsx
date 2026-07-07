import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Package, MapPin, BookOpen, Users, Heart,
    Star, Plus, Trash2, Check, X, Edit2, LayoutDashboard,
    ChevronDown, ChevronRight, Bell, LogOut, Upload, Save, Image
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { useOrder } from '../context/OrderContext'
import { useUI } from '../context/UIContext'
import { useLang } from '../context/LanguageContext'
import HeroSectionEditor from '../components/HeroSectionEditor'
import DiscoverContentEditor from '../components/DiscoverContentEditor'
import AdminCommunityGallery from '../components/AdminCommunityGallery'
import AdminSiteImages from '../components/AdminSiteImages'
import AdminNatureMemory from '../components/AdminNatureMemory'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/* Nén ảnh bằng Canvas — tránh base64 vượt 10MB */
function compressImage(file, maxW = 1200, quality = 0.82) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = reject
        reader.onload = ev => {
            const img = new Image()
            img.onerror = reject
            img.onload = () => {
                const scale = Math.min(1, maxW / Math.max(img.width, img.height))
                const canvas = document.createElement('canvas')
                canvas.width = Math.round(img.width * scale)
                canvas.height = Math.round(img.height * scale)
                canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
                resolve(canvas.toDataURL('image/jpeg', quality))
            }
            img.src = ev.target.result
        }
        reader.readAsDataURL(file)
    })
}

const NAV_ITEMS = [
    { key: 'overview', icon: <LayoutDashboard size={18} />, label: 'Tổng quan' },
    { key: 'hero-section', icon: <Image size={18} />, label: 'Hero Section' },
    { key: 'community-gallery', icon: <Image size={18} />, label: 'Ảnh cộng đồng' },
    { key: 'site-images', icon: <Image size={18} />, label: 'Ảnh trang web' },
    { key: 'nature-memory', icon: <Image size={18} />, label: '🌿 Nhật Ký Thiên Nhiên' },
    { key: 'workshops', icon: <Users size={18} />, label: 'Workshop' },
    { key: 'workshop-regs', icon: <Check size={18} />, label: 'Đăng ký WS' },
    { key: 'passport-sites', icon: <MapPin size={18} />, label: '🎖️ Điểm Hộ chiếu' },
    { key: 'library', icon: <BookOpen size={18} />, label: 'Thư viện số' },
    { key: 'products', icon: <Package size={18} />, label: 'Sản phẩm' },
    { key: 'volunteers', icon: <Heart size={18} />, label: 'Tình nguyện' },
    { key: 'reviews', icon: <Star size={18} />, label: 'Reviews' },
]

const STATUS_COLORS = { pending: '#f59e0b', confirmed: '#2563eb', done: '#16a34a', cancelled: '#dc2626', approved: '#16a34a', rejected: '#dc2626' }

/* ── OVERVIEW ── */
function Overview({ data, orders }) {
    const navigate = useNavigate()
    const cards = [
        { label: 'Workshops', val: data.workshops.length, color: '#7c3aed', icon: <Users size={22} />, link: '/workshop' },
        { label: 'Đăng ký WS', val: orders.workshopRegs.length, color: '#db2777', icon: <Check size={22} /> },
        { label: 'Đơn TNV', val: orders.volunteerApps.length, color: '#16a34a', icon: <Heart size={22} /> },
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

function classifyCityOrder(order) {
    const itemName = String(order?.items?.[0]?.name || '').toUpperCase()
    if (itemName.includes('[STAY]')) return 'stay'
    if (itemName.includes('[BUS]')) return 'bus'
    return 'other'
}

/* ── EDIT MODAL ── */
const FIELD_DEFS = {
    post: ['title', 'content', 'author', 'img'],
    workshop: ['title', 'content', 'date', 'time', 'category', 'capacity', 'isFree', 'price', 'status', 'instructor', 'img'],
    library: ['title', 'img'],
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
    isFree: { label: 'Miễn phí (true/false)', type: 'text' },
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

    const handleFile = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > 20 * 1024 * 1024) { alert('Ảnh quá lớn (tối đa 20MB)'); return }
        try {
            const compressed = await compressImage(file)
            setPreview(compressed)
            setForm(f => ({ ...f, img: compressed }))
        } catch {
            alert('Không đọc được ảnh, thử file khác')
        }
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

/* ── PASSPORT SITES ── */
function PassportSites() {
    const [sites, setSites] = useState([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(null)
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

    useEffect(() => {
        fetch(`${API_URL}/eco/sites`)
            .then(r => r.json())
            .then(d => setSites(Array.isArray(d) ? d : []))
            .catch(() => setSites([]))
            .finally(() => setLoading(false))
    }, [])

    const save = async (id, form) => {
        try {
            const res = await fetch(`${API_URL}/eco/sites/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            if (res.ok) {
                const updated = await res.json()
                setSites(prev => prev.map(s => s._id === id ? updated : s))
                setEditing(null)
            }
        } catch (e) {
            alert('Lỗi lưu: ' + e.message)
        }
    }

    if (loading) return <p className="empty-state">Đang tải dữ liệu...</p>

    return (
        <div>
            <h2 className="db-section-title">🎖️ Điểm Hộ chiếu Hà Giang</h2>
            <p style={{ color: '#64748b', marginBottom: 16, fontSize: 14 }}>
                Quản lý các điểm đóng dấu Hộ chiếu. Người dùng quét QR tại điểm để nhận tem và điểm eco.
            </p>
            {sites.length === 0 ? (
                <p className="empty-state">Chưa có điểm nào. Khởi động backend để tải dữ liệu mặc định.</p>
            ) : (
                <div className="db-app-list">
                    {sites.map(site => editing?._id === site._id ? (
                        <div key={site._id} className="db-app-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
                            <div className="form-2col">
                                <div>
                                    <label className="edit-field-label">Tên điểm</label>
                                    <input className="form-input" value={editing.name}
                                        onChange={e => setEditing(p => ({ ...p, name: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="edit-field-label">Mã (code)</label>
                                    <input className="form-input" value={editing.code}
                                        onChange={e => setEditing(p => ({ ...p, code: e.target.value }))} />
                                </div>
                            </div>
                            <div className="form-2col">
                                <div>
                                    <label className="edit-field-label">Icon tem (emoji)</label>
                                    <input className="form-input" value={editing.badge?.icon || ''}
                                        onChange={e => setEditing(p => ({ ...p, badge: { ...p.badge, icon: e.target.value } }))} />
                                </div>
                                <div>
                                    <label className="edit-field-label">Tên tem</label>
                                    <input className="form-input" value={editing.badge?.name || ''}
                                        onChange={e => setEditing(p => ({ ...p, badge: { ...p.badge, name: e.target.value } }))} />
                                </div>
                            </div>
                            <div className="form-2col">
                                <div>
                                    <label className="edit-field-label">Điểm eco</label>
                                    <input className="form-input" type="number" value={editing.ecoPoints || ''}
                                        onChange={e => setEditing(p => ({ ...p, ecoPoints: +e.target.value }))} />
                                </div>
                                <div>
                                    <label className="edit-field-label">Khu vực</label>
                                    <input className="form-input" value={editing.district || ''}
                                        onChange={e => setEditing(p => ({ ...p, district: e.target.value }))} />
                                </div>
                            </div>
                            <div>
                                <label className="edit-field-label">Câu chuyện ngắn</label>
                                <textarea className="form-input form-textarea" value={editing.story?.content || ''}
                                    onChange={e => setEditing(p => ({ ...p, story: { ...p.story, content: e.target.value } }))} />
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button className="btn3d btn3d-green btn-sm" onClick={() => save(site._id, editing)}>
                                    <Save size={14} /> Lưu thay đổi
                                </button>
                                <button className="btn3d btn-sm" onClick={() => setEditing(null)}>Huỷ</button>
                            </div>
                        </div>
                    ) : (
                        <div key={site._id} className="db-app-card">
                            <div className="db-app-info">
                                <strong>{site.badge?.icon} {site.name}</strong>
                                <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748b' }}>🔑 {site.code}</span>
                                <span>🎖️ Tem: {site.badge?.name}</span>
                                <span>⚡ {site.ecoPoints} điểm eco · 📍 {site.district}</span>
                                <span style={{ color: '#64748b', fontSize: 13 }}>{site.story?.title}</span>
                            </div>
                            <button className="btn3d btn3d-blue btn-sm" onClick={() => setEditing({ ...site })}>
                                <Edit2 size={13} /> Chỉnh sửa
                            </button>
                        </div>
                    ))}
                </div>
            )}
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
    const [cityOrders, setCityOrders] = useState([])
    const [cityFilter, setCityFilter] = useState('all')
    const [cityLoading, setCityLoading] = useState(false)

    const loadCityOrders = async () => {
        setCityLoading(true)
        try {
            const res = await fetch(`${API}/api/orders`)
            const list = await res.json()
            const filtered = Array.isArray(list) ? list.filter(o => classifyCityOrder(o) !== 'other') : []
            setCityOrders(filtered)
        } catch {
            showToast('Không tải được đơn Stay/Bus từ backend')
        } finally {
            setCityLoading(false)
        }
    }

    useEffect(() => {
        if (activeTab === 'city-orders') loadCityOrders()
    }, [activeTab])

    const updateCityOrderStatus = async (id, status) => {
        try {
            const res = await fetch(`${API}/api/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            })
            if (!res.ok) throw new Error('update failed')
            setCityOrders(prev => prev.map(o => (o._id === id ? { ...o, status } : o)))
            showToast('Đã cập nhật trạng thái đơn')
        } catch {
            showToast('Không cập nhật được trạng thái đơn')
        }
    }

    const createTestCityOrder = async (kind = 'bus') => {
        const now = new Date()
        const stamp = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
        const isStay = kind === 'stay'
        const payload = {
            items: [
                {
                    id: Date.now(),
                    name: isStay ? '[STAY] Demo Homestay' : '[BUS] Demo Ha Giang ↔ Ha Noi',
                    price: isStay ? 650000 : 320000,
                    qty: isStay ? 2 : 1,
                    img: '/hg-city-1.svg',
                },
            ],
            address: isStay
                ? `Hà Giang 2 · Demo stay · KH: Test ${stamp}`
                : `Hà Giang ↔ Hà Nội · 12:30 · KH: Test ${stamp}`,
            phone: '0900000000',
            location: isStay ? 'Hà Giang 2' : 'Hà Giang ↔ Hà Nội',
            pickup: false,
            isTest: true,
        }

        try {
            const res = await fetch(`${API}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            if (!res.ok) throw new Error('create failed')
            showToast(isStay ? 'Đã tạo đơn test Stay' : 'Đã tạo đơn test Bus')
            await loadCityOrders()
        } catch {
            showToast('Không tạo được đơn test')
        }
    }

    const clearTestCityOrders = async () => {
        if (!window.confirm('Xóa toàn bộ đơn test Stay/Bus?')) return

        try {
            const res = await fetch(`${API}/api/orders/test`, { method: 'DELETE' })
            if (!res.ok) throw new Error('delete failed')
            const result = await res.json()
            showToast(`Đã xóa ${result.deletedCount || 0} đơn test`)
            await loadCityOrders()
        } catch {
            showToast('Không xóa được đơn test')
        }
    }

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

    const cityCounts = {
        all: cityOrders.length,
        stay: cityOrders.filter(o => classifyCityOrder(o) === 'stay').length,
        bus: cityOrders.filter(o => classifyCityOrder(o) === 'bus').length,
    }

    const cityPending = cityOrders.filter(o => o.status === 'pending').length

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <Overview data={data} orders={orders} />
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
                        { key: 'img', label: 'Ảnh', render: item => item.img ? <img src={item.img} alt={item.title} style={{ width: 60, height: 44, objectFit: 'cover', borderRadius: 6 }} /> : '—' },
                        { key: 'title', label: 'Tiêu đề' },
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
            case 'passport-sites':
                return <PassportSites />
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
            case 'hero-section':
                return <HeroSectionEditor />
            case 'community-gallery':
                return <AdminCommunityGallery />
            case 'site-images':
                return <AdminSiteImages />
            case 'nature-memory':
                return <AdminNatureMemory />
            default:
                return null
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
                            {item.key === 'city-orders' && cityPending > 0 && (
                                <span className="db-badge">{cityPending}</span>
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
