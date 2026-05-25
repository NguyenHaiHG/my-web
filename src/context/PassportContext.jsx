import { createContext, useContext, useState, useCallback } from 'react'

const LS_KEY = 'hagiang_passport'

export const STAMP_DEFS = {
    welcome: { icon: '🌸', label: 'Chào Hà Giang', color: '#ec4899', how: 'Tạo hộ chiếu lần đầu' },
    tour: { icon: '🏍️', label: 'Phượt thủ', color: '#f97316', how: 'Đặt tour Ha Giang' },
    product: { icon: '🧵', label: 'Thủ công mỹ nghệ', color: '#059669', how: 'Mua sản phẩm địa phương' },
    training: { icon: '📚', label: 'Học viên HTX', color: '#2563eb', how: 'Đăng ký đào tạo miễn phí' },
    review: { icon: '🗣️', label: 'Đại sứ cộng đồng', color: '#7c3aed', how: 'Viết đánh giá tour' },
    radio: { icon: '📻', label: 'Người nghe đài', color: '#dc2626', how: 'Nghe đài Trường Hải FM' },
}

const PassportContext = createContext()
export const usePassport = () => useContext(PassportContext)

const fresh = () => ({ holderName: '', stamps: [], createdAt: new Date().toISOString() })
const load = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || null } catch { return null } }
const save = (p) => { try { localStorage.setItem(LS_KEY, JSON.stringify(p)) } catch { /* noop */ } }

export function PassportProvider({ children }) {
    const [passport, setPassport] = useState(() => load() || fresh())

    const update = (next) => { setPassport(next); save(next) }

    const setHolderName = (name) => {
        const next = { ...passport, holderName: name }
        update(next)
    }

    const addStamp = useCallback((type) => {
        setPassport(prev => {
            if (prev.stamps.some(s => s.type === type)) return prev
            const def = STAMP_DEFS[type]
            if (!def) return prev
            const next = {
                ...prev,
                stamps: [...prev.stamps, {
                    type,
                    icon: def.icon,
                    label: def.label,
                    color: def.color,
                    earnedAt: new Date().toLocaleDateString('vi-VN'),
                }],
            }
            save(next)
            return next
        })
    }, [])

    const hasStamp = (type) => passport.stamps.some(s => s.type === type)

    return (
        <PassportContext.Provider value={{ passport, setHolderName, addStamp, hasStamp, STAMP_DEFS }}>
            {children}
        </PassportContext.Provider>
    )
}
