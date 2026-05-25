import { createContext, useContext, useState, useCallback } from 'react'

const LS_KEY = 'hagiang_passport'

/* ══════════════════════════════════════════════════════
   CƠ BẢN – 6 tem hộ chiếu
   ══════════════════════════════════════════════════════ */
export const STAMP_DEFS = {
    welcome: { icon: '🌸', label: 'Chào Hà Giang', color: '#ec4899', how: 'Tạo hộ chiếu lần đầu' },
    tour: { icon: '🏍️', label: 'Phượt thủ', color: '#f97316', how: 'Đặt tour Ha Giang' },
    product: { icon: '🧵', label: 'Thủ công mỹ nghệ', color: '#059669', how: 'Mua sản phẩm địa phương' },
    training: { icon: '📚', label: 'Học viên HTX', color: '#2563eb', how: 'Đăng ký đào tạo miễn phí' },
    review: { icon: '🗣️', label: 'Đại sứ cộng đồng', color: '#7c3aed', how: 'Viết đánh giá tour' },
    radio: { icon: '📻', label: 'Người nghe đài', color: '#dc2626', how: 'Nghe đài Trường Hải FM' },
}

/* ══════════════════════════════════════════════════════
   4 LOẠI CHỨNG NHẬN ĐẶC BIỆT
   ══════════════════════════════════════════════════════ */
export const CERT_TYPES = {
    loop: {
        id: 'loop',
        icon: '🏍️',
        title: 'Cung đường Ha Giang Loop',
        shortTitle: 'HG Loop',
        color: '#f97316',
        bgGrad: 'linear-gradient(135deg,#7c2d12,#c2410c)',
        minStamps: 5,
        certTitle: 'CHINH PHỤC CUNG ĐƯỜNG HA GIANG LOOP',
        stamps: {
            dongvan: { icon: '🏯', label: 'Phố Đồng Văn', color: '#f97316', how: 'Đến thăm phố cổ Đồng Văn' },
            mapieng: { icon: '🏔️', label: 'Mã Pí Lèng', color: '#ef4444', how: 'Vượt đèo Mã Pí Lèng' },
            lungcu: { icon: '🚩', label: 'Cột cờ Lũng Cú', color: '#dc2626', how: 'Leo lên đỉnh Lũng Cú' },
            quanba: { icon: '🏞️', label: 'Núi Đôi Quản Bạ', color: '#10b981', how: 'Ngắm núi đôi Quản Bạ' },
            deogió: { icon: '💨', label: 'Đèo Gió', color: '#06b6d4', how: 'Chinh phục đèo Gió' },
            congtroi: { icon: '☁️', label: 'Cổng Trời', color: '#8b5cf6', how: 'Đứng trên Cổng Trời' },
            meovac: { icon: '🌊', label: 'Mèo Vạc', color: '#3b82f6', how: 'Khám phá thị trấn Mèo Vạc' },
            phobang: { icon: '🏘️', label: 'Phố Bảng', color: '#c8963e', how: 'Thăm Phố Bảng yên bình' },
        },
    },
    culture: {
        id: 'culture',
        icon: '🎨',
        title: 'Trải nghiệm văn hóa',
        shortTitle: 'Văn hóa',
        color: '#ec4899',
        bgGrad: 'linear-gradient(135deg,#701a75,#a21caf)',
        minStamps: 3,
        certTitle: 'NGƯỜI KHÁM PHÁ VĂN HÓA HÀ GIANG',
        stamps: {
            painting: { icon: '🖌️', label: 'Vẽ tranh', color: '#ec4899', how: 'Tham gia lớp vẽ tranh dân tộc' },
            cooking: { icon: '🍲', label: 'Nấu ăn truyền thống', color: '#f97316', how: 'Nấu ẩm thực dân tộc cùng HTX' },
            climbing: { icon: '⛰️', label: 'Leo núi', color: '#10b981', how: 'Chinh phục một đỉnh núi tại HG' },
            weaving: { icon: '🧵', label: 'Dệt thổ cẩm', color: '#8b5cf6', how: 'Học dệt thổ cẩm thủ công' },
            dance: { icon: '💃', label: 'Múa xòe Tây Bắc', color: '#ec4899', how: 'Tham gia buổi múa xòe truyền thống' },
            festival: { icon: '🎭', label: 'Lễ hội truyền thống', color: '#c8963e', how: 'Dự lễ hội của dân tộc thiểu số' },
        },
    },
    volunteer: {
        id: 'volunteer',
        icon: '🤝',
        title: 'Đóng góp & Tình nguyện',
        shortTitle: 'Tình nguyện',
        color: '#059669',
        bgGrad: 'linear-gradient(135deg,#064e3b,#065f46)',
        minStamps: 2,
        certTitle: 'TÌNH NGUYỆN VIÊN HÀ GIANG',
        stamps: {
            volunteer: { icon: '🙋', label: 'Tình nguyện viên', color: '#059669', how: 'Đăng ký tình nguyện với HTX' },
            tree: { icon: '🌱', label: 'Trồng cây xanh', color: '#16a34a', how: 'Tham gia trồng cây ở bản làng' },
            community: { icon: '🏘️', label: 'Hỗ trợ cộng đồng', color: '#0d9488', how: 'Tham gia hoạt động cộng đồng' },
            education: { icon: '📖', label: 'Hỗ trợ giáo dục', color: '#2563eb', how: 'Hỗ trợ trường học vùng cao' },
            donation: { icon: '🎁', label: 'Quyên góp', color: '#7c3aed', how: 'Quyên góp vật phẩm cho bản' },
        },
    },
    products: {
        id: 'products',
        icon: '🛍️',
        title: 'Trải nghiệm sản phẩm bản địa',
        shortTitle: 'Sản phẩm',
        color: '#c8963e',
        bgGrad: 'linear-gradient(135deg,#78350f,#92400e)',
        minStamps: 3,
        certTitle: 'NGƯỜI TIÊU DÙNG SẢN PHẨM BẢN ĐỊA HÀ GIANG',
        stamps: {
            honey: { icon: '🍯', label: 'Mật ong bạc hà', color: '#f59e0b', how: 'Mua mật ong bạc hà HTX' },
            fabric: { icon: '🧣', label: 'Thổ cẩm', color: '#7c3aed', how: 'Mua vải / trang phục thổ cẩm' },
            buckwheat: { icon: '🌸', label: 'Tam giác mạch', color: '#ec4899', how: 'Thưởng thức sản phẩm tam giác mạch' },
            wine: { icon: '🍶', label: 'Rượu ngô', color: '#c8963e', how: 'Nếm rượu ngô truyền thống' },
            tea: { icon: '🍵', label: 'Chè Shan tuyết', color: '#16a34a', how: 'Uống chè Shan tuyết Tủa Chùa' },
            herb: { icon: '🌿', label: 'Thuốc nam', color: '#10b981', how: 'Sử dụng thuốc nam bản địa' },
        },
    },
}

/* ══════════════════════════════════════════════════════
   CONTEXT
   ══════════════════════════════════════════════════════ */
const PassportContext = createContext()
export const usePassport = () => useContext(PassportContext)

const fresh = () => ({
    holderName: '',
    stamps: [],
    certs: {},      // { [certId]: { stamps: { [type]: {earnedAt} }, reviews: [] } }
    createdAt: new Date().toISOString(),
})

const load = () => {
    try {
        const raw = JSON.parse(localStorage.getItem(LS_KEY))
        if (!raw) return null
        if (!raw.certs) return { ...raw, certs: {} }  // migrate old passport
        return raw
    } catch { return null }
}
const save = (p) => { try { localStorage.setItem(LS_KEY, JSON.stringify(p)) } catch { /* noop */ } }

export function PassportProvider({ children }) {
    const [passport, setPassport] = useState(() => load() || fresh())

    const update = (next) => { setPassport(next); save(next) }
    const setHolderName = (name) => update({ ...passport, holderName: name })

    /* ── Basic stamps ── */
    const addStamp = useCallback((type) => {
        setPassport(prev => {
            if (prev.stamps.some(s => s.type === type)) return prev
            const def = STAMP_DEFS[type]
            if (!def) return prev
            const next = {
                ...prev,
                stamps: [...prev.stamps, {
                    type, icon: def.icon, label: def.label, color: def.color,
                    earnedAt: new Date().toLocaleDateString('vi-VN'),
                }],
            }
            save(next); return next
        })
    }, [])
    const hasStamp = (type) => passport.stamps.some(s => s.type === type)

    /* ── Certificate stamps (4 cert types) ── */
    const addCertStamp = useCallback((certId, stampType) => {
        setPassport(prev => {
            const certData = prev.certs[certId] || { stamps: {}, reviews: [] }
            if (certData.stamps[stampType]) return prev
            const next = {
                ...prev,
                certs: {
                    ...prev.certs,
                    [certId]: {
                        ...certData,
                        stamps: {
                            ...certData.stamps,
                            [stampType]: { earnedAt: new Date().toLocaleDateString('vi-VN') },
                        },
                    },
                },
            }
            save(next); return next
        })
    }, [])
    const hasCertStamp = (certId, stampType) => !!(passport.certs[certId]?.stamps?.[stampType])
    const getCertStamps = (certId) => passport.certs[certId]?.stamps || {}
    const getCertStampCount = (certId) => Object.keys(passport.certs[certId]?.stamps || {}).length

    /* ── Reviews ── */
    const addReview = useCallback((certId, { rating, location, comment }) => {
        setPassport(prev => {
            const certData = prev.certs[certId] || { stamps: {}, reviews: [] }
            const next = {
                ...prev,
                certs: {
                    ...prev.certs,
                    [certId]: {
                        ...certData,
                        reviews: [
                            ...(certData.reviews || []),
                            {
                                id: Date.now(),
                                rating, location, comment,
                                author: prev.holderName || 'Du khách',
                                date: new Date().toLocaleDateString('vi-VN'),
                            },
                        ],
                    },
                },
            }
            save(next); return next
        })
    }, [])
    const getReviews = (certId) => passport.certs[certId]?.reviews || []

    return (
        <PassportContext.Provider value={{
            passport,
            setHolderName,
            addStamp, hasStamp,
            addCertStamp, hasCertStamp, getCertStamps, getCertStampCount,
            addReview, getReviews,
            STAMP_DEFS, CERT_TYPES,
        }}>
            {children}
        </PassportContext.Provider>
    )
}
