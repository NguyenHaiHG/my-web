import { createContext, useContext, useState, useEffect } from 'react'
import { API, apiFetch, responseError } from '../utils/api'

const OrderContext = createContext(null)

export function OrderProvider({ children }) {
    /* ── CART ─────────────────────────────────────────────── */
    const [cart, setCart] = useState([])

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id)
            if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
            return [...prev, { ...item, qty: 1 }]
        })
    }

    const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id))

    const updateQty = (id, qty) => {
        if (qty < 1) { removeFromCart(id); return }
        setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Number(qty) } : i))
    }

    const clearCart = () => setCart([])

    const totalCount = cart.reduce((s, i) => s + i.qty, 0)

    /* ── 3 SEPARATE ORDER STORES ──────────────────────────── */
    const [cartOrders, setCartOrders] = useState([])
    const [taobaoOrders, setTaobaoOrders] = useState([])
    const [tourBookings, setTourBookings] = useState([])
    const [workshopRegs, setWorkshopRegs] = useState([])
    const [volunteerApps, setVolunteerApps] = useState([])

    const mapId = item => ({ ...item, id: item._id || item.id })

    /* ── Load private admin queues from backend ───────────── */
    useEffect(() => {
        const loadAdminQueues = async () => {
            try {
                const [ordersRes, regsRes, volunteersRes] = await Promise.all([
                    apiFetch('/api/orders'),
                    apiFetch('/api/workshop-regs'),
                    apiFetch('/api/volunteers'),
                ])
                if (ordersRes.ok) {
                    const orders = (await ordersRes.json()).map(mapId)
                    setCartOrders(orders.filter(o => !['taobao', 'tour'].includes(o.orderType)))
                    setTaobaoOrders(orders.filter(o => o.orderType === 'taobao'))
                    setTourBookings(orders.filter(o => o.orderType === 'tour'))
                }
                if (regsRes.ok) setWorkshopRegs((await regsRes.json()).map(mapId))
                if (volunteersRes.ok) setVolunteerApps((await volunteersRes.json()).map(mapId))
            } catch { /* admin may not be logged in yet */ }
        }
        loadAdminQueues()
        window.addEventListener('admin-authenticated', loadAdminQueues)
        return () => window.removeEventListener('admin-authenticated', loadAdminQueues)
    }, [])

    /* ── NOTIFICATIONS ────────────────────────────────────── */
    const [notifications, setNotifications] = useState([])

    const addNotif = (message, type) => {
        setNotifications(prev => [{
            id: Date.now() + Math.random(),
            message, type,
            read: false,
            time: new Date().toLocaleString('vi-VN'),
        }, ...prev])
    }

    const unread = notifications.filter(n => !n.read).length
    const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })))

    /* ── SUBMIT ORDERS ─────────────────────────────────────── */
    const submitCartOrder = async (orderData, items) => {
        const payload = { ...orderData, items }
        try {
            const res = await fetch(`${API}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...payload, orderType: 'cart' }),
            })
            if (!res.ok) throw await responseError(res, 'Không thể gửi đơn hàng')
            const data = await res.json()
            const saved = { ...data, id: data._id || data.id, date: new Date().toLocaleString('vi-VN') }
            setCartOrders(prev => [saved, ...prev])
        } catch (err) {
            throw new Error(err?.message || 'Không kết nối được server — đơn hàng chưa được lưu')
        }
        addNotif(`🛒 Đơn giỏ hàng mới từ ${orderData.name} – SĐT: ${orderData.phone}`, 'cart')
        clearCart()
    }

    const submitTaobaoOrder = async (orderData) => {
        const res = await fetch(`${API}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...orderData, orderType: 'taobao', details: orderData }),
        })
        if (!res.ok) throw await responseError(res, 'Không thể gửi đơn Taobao')
        const saved = mapId(await res.json())
        setTaobaoOrders(prev => [saved, ...prev])
        addNotif(`🛍️ Đơn Taobao mới từ ${orderData.name} – SĐT: ${orderData.phone}`, 'taobao')
        return saved
    }

    const submitTourBooking = async (bookingData) => {
        const res = await fetch(`${API}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderType: 'tour',
                name: bookingData.name,
                phone: bookingData.phone,
                email: bookingData.email,
                note: bookingData.note,
                details: bookingData,
            }),
        })
        if (!res.ok) throw await responseError(res, 'Không thể gửi đặt tour')
        const saved = mapId(await res.json())
        setTourBookings(prev => [saved, ...prev])
        addNotif(`🗺️ Đặt tour: "${bookingData.tourTitle}" – ${bookingData.name} (${bookingData.phone})`, 'tour')
        return saved
    }

    const submitWorkshopReg = async (regData) => {
        const res = await fetch(`${API}/api/workshop-regs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(regData),
        })
        if (!res.ok) throw await responseError(res, 'Không thể gửi đăng ký workshop')
        const saved = mapId(await res.json())
        setWorkshopRegs(prev => [saved, ...prev])
        addNotif(`🎓 Đăng ký workshop: "${regData.workshopTitle}" – ${regData.name}`, 'workshop')
        return saved
    }

    const submitVolunteerApp = async (appData) => {
        const res = await fetch(`${API}/api/volunteers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appData),
        })
        if (!res.ok) throw await responseError(res, 'Không thể gửi đơn tình nguyện')
        const saved = mapId(await res.json())
        setVolunteerApps(prev => [saved, ...prev])
        addNotif(`🙋 Đơn tình nguyện mới từ ${appData.name}`, 'volunteer')
        return saved
    }

    const updateOrderStatus = async (type, id, status) => {
        const route = type === 'workshop' ? 'workshop-regs' : type === 'volunteer' ? 'volunteers' : 'orders'
        const method = route === 'orders' ? 'PATCH' : 'PUT'
        const res = await apiFetch(`/api/${route}/${id}`, { method, body: JSON.stringify({ status }) })
        if (!res.ok) throw await responseError(res, 'Không thể cập nhật trạng thái')
        const upd = list => list.map(o => o.id === id ? { ...o, status } : o)
        if (type === 'cart') setCartOrders(upd)
        if (type === 'taobao') setTaobaoOrders(upd)
        if (type === 'tour') setTourBookings(upd)
        if (type === 'workshop') setWorkshopRegs(upd)
        if (type === 'volunteer') setVolunteerApps(upd)
    }

    const deleteOrder = async (type, id) => {
        const route = type === 'workshop' ? 'workshop-regs' : type === 'volunteer' ? 'volunteers' : 'orders'
        const res = await apiFetch(`/api/${route}/${id}`, { method: 'DELETE' })
        if (!res.ok) throw await responseError(res, 'Không thể xóa dữ liệu')
        if (type === 'cart') setCartOrders(p => p.filter(o => o.id !== id))
        if (type === 'taobao') setTaobaoOrders(p => p.filter(o => o.id !== id))
        if (type === 'tour') setTourBookings(p => p.filter(o => o.id !== id))
        if (type === 'workshop') setWorkshopRegs(p => p.filter(o => o.id !== id))
        if (type === 'volunteer') setVolunteerApps(p => p.filter(o => o.id !== id))
    }

    return (
        <OrderContext.Provider value={{
            cart, addToCart, removeFromCart, updateQty, clearCart, totalCount,
            cartOrders, taobaoOrders, tourBookings, workshopRegs, volunteerApps,
            submitCartOrder, submitTaobaoOrder, submitTourBooking, submitWorkshopReg, submitVolunteerApp,
            updateOrderStatus, deleteOrder,
            notifications, unread, markRead, markAllRead,
        }}>
            {children}
        </OrderContext.Provider>
    )
}

export const useOrder = () => useContext(OrderContext)
