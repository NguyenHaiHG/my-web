import { createElement, useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
    Check, ClipboardList, Heart, KeyRound, LayoutDashboard, Leaf,
    LogOut, Mail, MapPin, Menu, Package, ShieldCheck, Star, Trash2, X,
    Image, FileText, Edit2, Plus, ExternalLink,
    Settings, Save,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { useOrder } from '../context/OrderContext'
import { useUI } from '../context/UIContext'
import { apiFetch, responseError } from '../utils/api'
import AdminSiteImages from '../components/AdminSiteImages'
import AdminNatureMemory from '../components/AdminNatureMemory'
import AdminHomeFilmStrip from '../components/AdminHomeFilmStrip'
import { PageContentAdminPanel } from '../components/PageContentShell'
import { CMS_SECTIONS } from '../config/cmsSections'

const NAV_ITEMS = [
    { key: 'overview', icon: LayoutDashboard, label: 'Tổng quan' },
    { key: 'orders', icon: Package, label: 'Đơn hàng / Đặt tour' },
    { key: 'workshop-regs', icon: ClipboardList, label: 'Đăng ký workshop' },
    { key: 'volunteers', icon: Heart, label: 'Tình nguyện' },
    { key: 'reviews', icon: Star, label: 'Duyệt review' },
    { key: 'moderation', icon: ShieldCheck, label: 'Penpal / Nhật ký' },
    { key: 'eco', icon: MapPin, label: 'Điểm eco / Passport' },
    { key: 'page-content', icon: FileText, label: 'Nội dung từng trang' },
    { key: 'content', icon: ClipboardList, label: 'Bài / Workshop / Danh mục' },
    { key: 'media', icon: Image, label: 'Thư viện ảnh' },
    { key: 'settings', icon: Settings, label: 'Cấu hình chung' },
    { key: 'account', icon: KeyRound, label: 'Tài khoản admin' },
]

const STATUS_LABELS = {
    pending: 'Chờ xử lý',
    confirmed: 'Đã xác nhận',
    done: 'Hoàn tất',
    completed: 'Hoàn tất',
    approved: 'Đã duyệt',
    rejected: 'Từ chối',
    cancelled: 'Đã hủy',
}

function StatusBadge({ status = 'pending' }) {
    return <span className={`status-badge status-${status}`}>{STATUS_LABELS[status] || status}</span>
}

function Overview({ orders, setSection }) {
    const cards = [
        { key: 'orders', label: 'Đơn hàng / tour', count: orders.cartOrders.length + orders.taobaoOrders.length + orders.tourBookings.length, icon: Package },
        { key: 'workshop-regs', label: 'Đăng ký workshop', count: orders.workshopRegs.length, icon: ClipboardList },
        { key: 'volunteers', label: 'Đơn tình nguyện', count: orders.volunteerApps.length, icon: Heart },
        { key: 'moderation', label: 'Khu vực cần kiểm duyệt', count: 2, icon: ShieldCheck },
    ]
    return (
        <div>
            <h2 className="db-section-title">Trung tâm nghiệp vụ</h2>
            <p className="db-section-hint">Dashboard quản lý cả nội dung từng trang, danh mục bài và các hàng đợi vận hành.</p>
            <div className="db-stats-grid">
                {cards.map(({ key, label, count, icon }) => (
                    <button key={key} className="db-stat-card" onClick={() => setSection(key)}>
                        <div className="db-stat-icon">{createElement(icon, { size: 22 })}</div>
                        <div><div className="db-stat-val">{count}</div><div className="db-stat-label">{label}</div></div>
                    </button>
                ))}
            </div>
            <div className="db-inline-edit-guide">
                <h3>Chỉnh nội dung công khai</h3>
                <p>Chọn “Nội dung từng trang” trong menu để thêm, sửa, xóa Workshop, Liên hệ và Hà Giang Loop ngay tại Dashboard.</p>
                <div className="db-guide-links">
                    <Link to="/">Trang chủ</Link><Link to="/workshop">Workshop</Link><Link to="/ha-giang-loop">Hà Giang Loop</Link>
                    <Link to="/blog">Blog</Link><Link to="/thu-vien">Thư viện</Link><Link to="/lien-he">Liên hệ</Link>
                </div>
            </div>
        </div>
    )
}

function QueueTable({ title, type, rows, updateOrderStatus, deleteOrder, showToast }) {
    const act = async (action, row, value) => {
        const rowType = type === 'orders'
            ? row.orderType === 'tour' ? 'tour' : row.orderType === 'taobao' ? 'taobao' : 'cart'
            : type
        const id = row.id || row._id
        try {
            if (action === 'delete') {
                if (!window.confirm('Xóa dữ liệu này khỏi server?')) return
                await deleteOrder(rowType, id)
                showToast('Đã xóa trên server')
            } else {
                await updateOrderStatus(rowType, id, value)
                showToast('Đã cập nhật trạng thái')
            }
        } catch (err) {
            showToast('❌ ' + (err?.message || 'Thao tác thất bại'))
        }
    }

    return (
        <div>
            <h2 className="db-section-title">{title}</h2>
            {rows.length === 0 ? <p className="empty-state">Chưa có dữ liệu.</p> : (
                <div className="db-table-wrap">
                    <table className="db-table">
                        <thead><tr><th>Khách hàng</th><th>Liên hệ</th><th>Chi tiết</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
                        <tbody>
                            {rows.map(row => (
                                <tr key={row.id || row._id}>
                                    <td><strong>{row.name || '—'}</strong><br /><small>{row.createdAt ? new Date(row.createdAt).toLocaleString('vi-VN') : '—'}</small></td>
                                    <td>{row.phone || '—'}<br /><small>{row.email || ''}</small></td>
                                    <td>{row.workshopTitle || row.details?.tourTitle || row.orderType || row.motivation || row.note || '—'}</td>
                                    <td><StatusBadge status={row.status} /></td>
                                    <td className="db-actions">
                                        <button title="Xác nhận" onClick={() => act('status', row, type === 'volunteer' ? 'approved' : 'confirmed')}><Check size={15} /></button>
                                        <button title="Hoàn tất" onClick={() => act('status', row, type === 'workshop' ? 'completed' : type === 'volunteer' ? 'rejected' : 'done')}><ShieldCheck size={15} /></button>
                                        <button className="danger" title="Xóa" onClick={() => act('delete', row)}><Trash2 size={15} /></button>
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

function ReviewsPanel({ showToast }) {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')

    useEffect(() => {
        apiFetch('/api/reviews/all')
            .then(async response => {
                if (!response.ok) throw await responseError(response, 'Không thể tải review')
                setReviews((await response.json()).map(item => ({ ...item, id: item._id || item.id })))
            })
            .catch(err => setLoadError(err.message))
            .finally(() => setLoading(false))
    }, [])

    const mutate = async (review, method) => {
        try {
            const response = await apiFetch(`/api/reviews/${review.id}`, {
                method,
                body: method === 'PUT' ? JSON.stringify({ approved: true }) : undefined,
            })
            if (!response.ok) throw await responseError(response, 'Không thể cập nhật review')
            setReviews(prev => method === 'DELETE' ? prev.filter(item => item.id !== review.id) : prev.map(item => item.id === review.id ? { ...item, approved: true } : item))
            showToast('Đã lưu thay đổi trên server')
        } catch (err) {
            showToast('❌ ' + err.message)
        }
    }

    return (
        <div>
            <h2 className="db-section-title">Duyệt review</h2>
            {loadError && <p className="form-error">{loadError}</p>}
            {loading ? <p>Đang tải…</p> : reviews.length === 0 ? <p className="empty-state">Chưa có review.</p> : (
                <div className="db-review-list">
                    {reviews.map(review => (
                        <article className="db-review-card" key={review.id}>
                            <div><strong>{review.name || review.author || 'Khách'}</strong> · {'★'.repeat(review.rating || 0)}</div>
                            <p>{review.comment || review.content}</p>
                            <div><StatusBadge status={review.approved ? 'approved' : 'pending'} /></div>
                            <div className="db-actions">
                                {!review.approved && <button onClick={() => mutate(review, 'PUT')}><Check size={15} /> Duyệt</button>}
                                <button className="danger" onClick={() => mutate(review, 'DELETE')}><Trash2 size={15} /> Xóa</button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}

function ModerationPanel() {
    return (
        <div>
            <h2 className="db-section-title">Kiểm duyệt cộng đồng</h2>
            <div className="db-moderation-grid">
                <Link to="/penpal" className="db-moderation-card"><Mail size={28} /><h3>Penpal</h3><p>Xem hồ sơ công khai và xóa hồ sơ không phù hợp ngay trên trang.</p></Link>
                <Link to="/nhat-ky-thien-nhien" className="db-moderation-card"><Leaf size={28} /><h3>Nhật ký thiên nhiên</h3><p>Duyệt ảnh và xóa ghi chép trực tiếp trên trang nhật ký.</p></Link>
            </div>
        </div>
    )
}

function EcoPanel({ showToast }) {
    const [sites, setSites] = useState([])
    const [form, setForm] = useState({ code: '', name: '', district: '', type: 'cultural-site', ecoPoints: 10 })
    const [editingSite, setEditingSite] = useState(null)

    const load = () => fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/eco-system/sites`)
        .then(response => response.ok ? response.json() : [])
        .then(setSites)
        .catch(() => setSites([]))
    useEffect(load, [])

    const save = async event => {
        event.preventDefault()
        try {
            const payload = editingSite ? {
                ...editingSite,
                ...form,
                story: { ...(editingSite.story || {}), title: form.name },
                badge: { ...(editingSite.badge || {}), id: editingSite.badge?.id || form.code.toLowerCase(), name: editingSite.badge?.name || `Dấu ${form.name}` },
            } : {
                ...form,
                location: { lat: 22.8233, lng: 104.9836 },
                story: { title: form.name, content: `Khám phá ${form.name}` },
                badge: { id: form.code.toLowerCase(), name: `Dấu ${form.name}`, icon: '🌿' },
            }
            const endpoint = editingSite ? `/api/eco-system/sites/${editingSite._id}` : '/api/eco-system/sites'
            const response = await apiFetch(endpoint, { method: editingSite ? 'PUT' : 'POST', body: JSON.stringify(payload) })
            if (!response.ok) throw await responseError(response, editingSite ? 'Không thể sửa điểm eco' : 'Không thể thêm điểm eco')
            const saved = await response.json()
            setSites(prev => editingSite ? prev.map(item => item._id === saved._id ? saved : item) : [...prev, saved])
            setForm({ code: '', name: '', district: '', type: 'cultural-site', ecoPoints: 10 })
            setEditingSite(null)
            showToast(editingSite ? 'Đã sửa điểm eco trên server' : 'Đã thêm điểm eco trên server')
        } catch (err) { showToast('❌ ' + err.message) }
    }

    const startEdit = site => {
        setEditingSite(site)
        setForm({
            code: site.code || '',
            name: site.name || '',
            district: site.district || '',
            type: site.type || 'cultural-site',
            ecoPoints: Number(site.ecoPoints) || 0,
        })
    }

    const remove = async site => {
        if (!window.confirm(`Xóa điểm ${site.name}?`)) return
        try {
            const response = await apiFetch(`/api/eco-system/sites/${site._id}`, { method: 'DELETE' })
            if (!response.ok) throw await responseError(response, 'Không thể xóa điểm eco')
            setSites(prev => prev.filter(item => item._id !== site._id))
        } catch (err) { showToast('❌ ' + err.message) }
    }

    return (
        <div>
            <h2 className="db-section-title">Điểm eco / Passport</h2>
            <form className="db-eco-form" onSubmit={save}>
                <input className="form-input" placeholder="Mã điểm" required value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
                <input className="form-input" placeholder="Tên điểm" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <input className="form-input" placeholder="Khu vực" value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} />
                <input className="form-input" type="number" min="0" value={form.ecoPoints} onChange={e => setForm({ ...form, ecoPoints: Number(e.target.value) })} />
                <button className="btn3d btn3d-green">{editingSite ? 'Lưu sửa' : 'Thêm điểm'}</button>
                {editingSite && <button type="button" className="btn3d btn3d-gray" onClick={() => {
                    setEditingSite(null)
                    setForm({ code: '', name: '', district: '', type: 'cultural-site', ecoPoints: 10 })
                }}>Hủy</button>}
            </form>
            <div className="db-table-wrap">
                <table className="db-table"><thead><tr><th>Mã</th><th>Tên</th><th>Khu vực</th><th>Điểm</th><th /></tr></thead>
                    <tbody>{sites.map(site => <tr key={site._id || site.code}><td>{site.code}</td><td>{site.name}</td><td>{site.district}</td><td>{site.ecoPoints}</td><td className="db-actions"><button title="Sửa" onClick={() => startEdit(site)}><Edit2 size={14} /></button><button className="btn-card-del" onClick={() => remove(site)}><Trash2 size={14} /></button></td></tr>)}</tbody>
                </table>
            </div>
        </div>
    )
}

const PAGE_CONTENT_TABS = [
    { key: 'workshop', label: 'Workshop', page: 'workshop', path: '/workshop', sections: {} },
    { key: 'heritage', label: 'Số hoá di sản', page: 'heritage', path: '/so-hoa-di-san', sections: CMS_SECTIONS.heritage },
    { key: 'contact', label: 'Liên hệ', page: 'contact', path: '/lien-he', sections: CMS_SECTIONS.contact },
    { key: 'ha-giang-loop', label: 'Hà Giang Loop', page: 'ha-giang-loop', path: '/ha-giang-loop', sections: CMS_SECTIONS['ha-giang-loop'] },
]

function PageContentHub({ data, setAdminModal, setEditItem, showToast }) {
    const [activePage, setActivePage] = useState('workshop')
    const config = PAGE_CONTENT_TABS.find(item => item.key === activePage) || PAGE_CONTENT_TABS[0]

    return (
        <div>
            <h2 className="db-section-title">Nội dung từng trang</h2>
            <p className="db-section-hint">Thêm, sửa và xóa section hoặc từng mục; thay đổi được lưu cùng API với trình chỉnh sửa trực tiếp.</p>
            <div className="db-guide-links" style={{ marginBottom: 18 }}>
                {PAGE_CONTENT_TABS.map(item => (
                    <button key={item.key} className={`btn3d btn-sm ${activePage === item.key ? 'btn3d-green' : 'btn3d-gray'}`} onClick={() => setActivePage(item.key)}>
                        {item.label}
                    </button>
                ))}
            </div>
            <PageContentAdminPanel key={config.page} page={config.page} sections={config.sections} title={config.label} publicPath={config.path} />
            {activePage === 'workshop' && (
                <div style={{ marginTop: 20 }}>
                    <ContentInventory data={data} setAdminModal={setAdminModal} setEditItem={setEditItem} showToast={showToast} initialType="workshop" />
                </div>
            )}
        </div>
    )
}

const CONTENT_TYPES = [
    { key: 'post', label: 'Bài viết', field: 'posts', route: '/blog' },
    { key: 'workshop', label: 'Workshop', field: 'workshops', route: '/workshop' },
    { key: 'library', label: 'Thư viện', field: 'libraryItems', route: '/thu-vien' },
    { key: 'tour', label: 'Tour', field: 'tours', route: '/tours' },
    { key: 'product', label: 'Sản phẩm', field: 'products', route: '/san-pham' },
]

function ContentInventory({ data, setAdminModal, setEditItem, showToast, initialType = 'post' }) {
    const [activeType, setActiveType] = useState(initialType)
    const config = CONTENT_TYPES.find(item => item.key === activeType) || CONTENT_TYPES[0]
    const rows = data[config.field] || []

    const remove = async item => {
        if (!window.confirm(`Xóa "${item.title || item.name || 'mục này'}" khỏi server?`)) return
        try {
            await data.deleteItem(config.key, item.id || item._id)
            showToast('Đã xóa nội dung trên server')
        } catch (err) {
            showToast('❌ ' + err.message)
        }
    }

    return (
        <div>
            <div className="db-table-header">
                <div>
                    <h2 className="db-section-title">Nội dung website</h2>
                    <p className="db-section-hint">Thêm, sửa hoặc xóa cùng dữ liệu đang hiển thị trên từng trang.</p>
                </div>
                <Link className="btn3d btn3d-blue btn-sm" to={config.route}><ExternalLink size={14} /> Xem trang</Link>
            </div>
            <div className="db-guide-links" style={{ marginBottom: 18 }}>
                {CONTENT_TYPES.map(item => (
                    <button key={item.key} className={`btn3d btn-sm ${activeType === item.key ? 'btn3d-green' : 'btn3d-gray'}`} onClick={() => setActiveType(item.key)}>
                        {item.label} ({(data[item.field] || []).length})
                    </button>
                ))}
            </div>
            <button className="btn3d btn3d-green btn-sm" onClick={() => setAdminModal(config.key)}><Plus size={14} /> Thêm {config.label.toLowerCase()}</button>
            {rows.length === 0 ? <p className="empty-state">Chưa có dữ liệu server. Hãy thêm mục đầu tiên.</p> : (
                <div className="db-table-wrap" style={{ marginTop: 14 }}>
                    <table className="db-table">
                        <thead><tr><th>Tiêu đề</th><th>Ảnh</th><th>Thông tin</th><th>Thao tác</th></tr></thead>
                        <tbody>{rows.map(item => (
                            <tr key={item.id || item._id}>
                                <td><strong>{item.title || item.name || 'Không tiêu đề'}</strong></td>
                                <td>{item.img ? <img src={item.img} alt="" style={{ width: 72, height: 48, borderRadius: 7, objectFit: 'cover' }} /> : '—'}</td>
                                <td>{item.category || item.date || item.price || item.author || '—'}</td>
                                <td className="db-actions">
                                    <button title="Sửa" onClick={() => setEditItem({ type: config.key, item })}><Edit2 size={14} /></button>
                                    <button className="danger" title="Xóa" onClick={() => remove(item)}><Trash2 size={14} /></button>
                                </td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

function MediaCenter() {
    const [tab, setTab] = useState('site')
    return (
        <div>
            <h2 className="db-section-title">Thư viện ảnh</h2>
            <p className="db-section-hint">Quản lý ảnh Hero, gallery, ảnh chạy ngang và ảnh thiên nhiên được lưu trên server.</p>
            <div className="db-guide-links" style={{ marginBottom: 18 }}>
                <button className={`btn3d btn-sm ${tab === 'site' ? 'btn3d-green' : 'btn3d-gray'}`} onClick={() => setTab('site')}>Hero & gallery</button>
                <button className={`btn3d btn-sm ${tab === 'community' ? 'btn3d-green' : 'btn3d-gray'}`} onClick={() => setTab('community')}>Ảnh chạy ngang</button>
                <button className={`btn3d btn-sm ${tab === 'nature' ? 'btn3d-green' : 'btn3d-gray'}`} onClick={() => setTab('nature')}>Ảnh thiên nhiên</button>
            </div>
            {tab === 'site' && <AdminSiteImages />}
            {tab === 'community' && <AdminHomeFilmStrip />}
            {tab === 'nature' && <AdminNatureMemory />}
        </div>
    )
}

function GlobalSettingsPanel({ showToast }) {
    const [content, setContent] = useState({
        header: { title: '', subtitle: '' },
        footer: { title: '', body: '' },
    })
    const [saving, setSaving] = useState('')

    useEffect(() => {
        apiFetch('/api/site-content/global', { auth: false })
            .then(response => response.ok ? response.json() : {})
            .then(value => setContent(current => ({
                header: { ...current.header, ...(value.header || {}) },
                footer: { ...current.footer, ...(value.footer || {}) },
            })))
            .catch(() => { })
    }, [])

    const save = async section => {
        setSaving(section)
        try {
            const response = await apiFetch(`/api/site-content/global/${section}`, {
                method: 'PUT',
                body: JSON.stringify(content[section]),
            })
            if (!response.ok) throw await responseError(response, 'Không thể lưu cấu hình')
            const saved = await response.json()
            setContent(current => ({ ...current, [section]: saved }))
            showToast('Đã lưu cấu hình chung trên server')
        } catch (err) {
            showToast('❌ ' + err.message)
        } finally {
            setSaving('')
        }
    }

    return (
        <div>
            <h2 className="db-section-title">Cấu hình chung</h2>
            <p className="db-section-hint">Tên website, dòng giới thiệu đầu trang và nội dung chân trang.</p>
            <div className="db-account-panel" style={{ maxWidth: 720 }}>
                <h3>Đầu trang</h3>
                <input className="form-input" value={content.header.title} placeholder="Tên website" onChange={event => setContent(current => ({ ...current, header: { ...current.header, title: event.target.value } }))} />
                <input className="form-input" value={content.header.subtitle} placeholder="Dòng giới thiệu" onChange={event => setContent(current => ({ ...current, header: { ...current.header, subtitle: event.target.value } }))} />
                <button className="btn3d btn3d-green" disabled={saving === 'header'} onClick={() => save('header')}><Save size={15} /> Lưu đầu trang</button>
                <h3>Chân trang</h3>
                <input className="form-input" value={content.footer.title} placeholder="Tên đơn vị" onChange={event => setContent(current => ({ ...current, footer: { ...current.footer, title: event.target.value } }))} />
                <textarea className="form-input" rows="4" value={content.footer.body} placeholder="Thông tin chân trang" onChange={event => setContent(current => ({ ...current, footer: { ...current.footer, body: event.target.value } }))} />
                <button className="btn3d btn3d-green" disabled={saving === 'footer'} onClick={() => save('footer')}><Save size={15} /> Lưu chân trang</button>
            </div>
        </div>
    )
}

function AccountPanel({ user, changePassword, logout, showToast }) {
    const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
    const [saving, setSaving] = useState(false)

    const submit = async event => {
        event.preventDefault()
        if (form.newPassword !== form.confirmPassword) return showToast('❌ Mật khẩu xác nhận không khớp')
        setSaving(true)
        try {
            await changePassword(form.currentPassword, form.newPassword)
            setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
            showToast('Đã đổi mật khẩu. Mật khẩu mới được lưu mã hóa trên server.')
        } catch (err) {
            showToast('❌ ' + err.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="db-account-panel">
            <h2 className="db-section-title">Tài khoản admin</h2>
            <p><strong>Tên đăng nhập:</strong> {user.username}</p>
            <p><strong>Tên hiển thị:</strong> {user.displayName}</p>
            <form onSubmit={submit}>
                <input className="form-input" type="password" autoComplete="current-password" placeholder="Mật khẩu hiện tại" required value={form.currentPassword} onChange={e => setForm({ ...form, currentPassword: e.target.value })} />
                <input className="form-input" type="password" autoComplete="new-password" minLength="10" placeholder="Mật khẩu mới (ít nhất 10 ký tự)" required value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} />
                <input className="form-input" type="password" autoComplete="new-password" placeholder="Nhập lại mật khẩu mới" required value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
                <button className="btn3d btn3d-green btn-full" disabled={saving}><KeyRound size={16} /> {saving ? 'Đang lưu…' : 'Đổi mật khẩu'}</button>
            </form>
            <button className="btn3d btn3d-red" onClick={logout}><LogOut size={16} /> Đăng xuất</button>
        </div>
    )
}

export default function DashboardPage() {
    const { user, isAdmin, authLoading, changePassword, logout } = useAuth()
    const data = useData()
    const orders = useOrder()
    const { showToast, setAdminModal, setEditItem } = useUI()
    const [section, setSection] = useState('overview')
    const [mobileNav, setMobileNav] = useState(false)

    if (authLoading) return <div className="container py-section">Đang xác minh phiên admin…</div>
    if (!isAdmin) return <Navigate to="/" replace />

    const allOrders = [...orders.cartOrders, ...orders.taobaoOrders, ...orders.tourBookings]
    let panel
    if (section === 'overview') panel = <Overview orders={orders} setSection={setSection} />
    if (section === 'orders') panel = <QueueTable title="Đơn hàng / Đặt tour" type="orders" rows={allOrders} {...orders} showToast={showToast} />
    if (section === 'workshop-regs') panel = <QueueTable title="Đăng ký workshop" type="workshop" rows={orders.workshopRegs} {...orders} showToast={showToast} />
    if (section === 'volunteers') panel = <QueueTable title="Đơn tình nguyện" type="volunteer" rows={orders.volunteerApps} {...orders} showToast={showToast} />
    if (section === 'reviews') panel = <ReviewsPanel showToast={showToast} />
    if (section === 'moderation') panel = <ModerationPanel />
    if (section === 'eco') panel = <EcoPanel showToast={showToast} />
    if (section === 'page-content') panel = <PageContentHub data={data} setAdminModal={setAdminModal} setEditItem={setEditItem} showToast={showToast} />
    if (section === 'content') panel = <ContentInventory data={data} setAdminModal={setAdminModal} setEditItem={setEditItem} showToast={showToast} />
    if (section === 'media') panel = <MediaCenter />
    if (section === 'settings') panel = <GlobalSettingsPanel showToast={showToast} />
    if (section === 'account') panel = <AccountPanel user={user} changePassword={changePassword} logout={logout} showToast={showToast} />

    return (
        <div className="dashboard-layout">
            <button className="db-mobile-toggle" onClick={() => setMobileNav(value => !value)}>{mobileNav ? <X /> : <Menu />}</button>
            <aside className={`db-sidebar ${mobileNav ? 'open' : ''}`}>
                <div className="db-sidebar-brand"><ShieldCheck size={22} /><div><strong>Admin</strong><small>{user.displayName}</small></div></div>
                <nav>{NAV_ITEMS.map(({ key, icon, label }) => (
                    <button key={key} className={section === key ? 'active' : ''} onClick={() => { setSection(key); setMobileNav(false) }}>{createElement(icon, { size: 18 })}{label}</button>
                ))}</nav>
                <button className="db-logout" onClick={logout}><LogOut size={17} /> Đăng xuất</button>
            </aside>
            <main className="db-main">{panel}</main>
        </div>
    )
}
