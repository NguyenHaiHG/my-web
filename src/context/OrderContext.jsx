import { createContext, useContext, useState } from 'react'

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
    const [tourBookings, setTourBookings] = useState([])
    const [taobaoOrders, setTaobaoOrders] = useState([])

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
    const submitCartOrder = (orderData, items) => {
        setCartOrders(prev => [{
            ...orderData,
            id: Date.now(),
            items: [...items],
            date: new Date().toLocaleString('vi-VN'),
            status: 'pending',
        }, ...prev])
        addNotif(`🛒 Đơn giỏ hàng mới từ ${orderData.name} – SĐT: ${orderData.phone}`, 'cart')
        clearCart()
    }

    const submitTourBooking = (bookingData) => {
        setTourBookings(prev => [{
            ...bookingData,
            id: Date.now(),
            date_submitted: new Date().toLocaleString('vi-VN'),
            status: 'pending',
        }, ...prev])
        addNotif(`🗺️ Đặt tour: "${bookingData.tourTitle}" – ${bookingData.name} (${bookingData.phone})`, 'tour')
    }

    const submitTaobaoOrder = (orderData) => {
        setTaobaoOrders(prev => [{
            ...orderData,
            id: Date.now(),
            date: new Date().toLocaleString('vi-VN'),
            status: 'pending',
        }, ...prev])
        addNotif(`📦 Đơn Taobao mới từ ${orderData.name} – SĐT: ${orderData.phone}`, 'taobao')
    }

    /* ── STATUS & DELETE ──────────────────────────────────── */
    const updateOrderStatus = (type, id, status) => {
        const upd = list => list.map(o => o.id === id ? { ...o, status } : o)
        if (type === 'cart') setCartOrders(upd)
        if (type === 'tour') setTourBookings(upd)
        if (type === 'taobao') setTaobaoOrders(upd)
    }

    const deleteOrder = (type, id) => {
        if (type === 'cart') setCartOrders(p => p.filter(o => o.id !== id))
        if (type === 'tour') setTourBookings(p => p.filter(o => o.id !== id))
        if (type === 'taobao') setTaobaoOrders(p => p.filter(o => o.id !== id))
    }

    return (
        <OrderContext.Provider value={{
            cart, addToCart, removeFromCart, updateQty, clearCart, totalCount,
            cartOrders, tourBookings, taobaoOrders,
            submitCartOrder, submitTourBooking, submitTaobaoOrder,
            updateOrderStatus, deleteOrder,
            notifications, unread, markRead, markAllRead,
        }}>
            {children}
        </OrderContext.Provider>
    )
}

export const useOrder = () => useContext(OrderContext)
