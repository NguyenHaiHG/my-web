import { createContext, useContext, useState, useCallback } from 'react'

const LS_KEY = 'hagiang_passport'

/* ══════════════════════════════════════════════════════
   CƠ BẢN – 6 tem hộ chiếu
   ══════════════════════════════════════════════════════ */
export const STAMP_DEFS = {
    welcome: { icon: '🌸', label: 'Chào Hà Giang', label_en: 'Welcome to Ha Giang', color: '#ec4899', how: 'Tạo hộ chiếu lần đầu', how_en: 'Create your passport for the first time' },
    tour: { icon: '🏍️', label: 'Phượt thủ', label_en: 'Loop Rider', color: '#f97316', how: 'Đặt tour Ha Giang', how_en: 'Book a Ha Giang tour' },
    product: { icon: '🧵', label: 'Thủ công mỹ nghệ', label_en: 'Handicraft Lover', color: '#059669', how: 'Mua sản phẩm địa phương', how_en: 'Purchase local products' },
    training: { icon: '📚', label: 'Học viên HTX', label_en: 'HTX Student', color: '#2563eb', how: 'Đăng ký đào tạo miễn phí', how_en: 'Register for free training' },
    review: { icon: '🗣️', label: 'Đại sứ cộng đồng', label_en: 'Community Ambassador', color: '#7c3aed', how: 'Viết đánh giá tour', how_en: 'Write a tour review' },
    radio: { icon: '📻', label: 'Người nghe đài', label_en: 'Radio Listener', color: '#dc2626', how: 'Nghe đài Trường Hải FM', how_en: 'Listen to Truong Hai FM' },
}

/* ══════════════════════════════════════════════════════
   4 LOẠI CHỨNG NHẬN ĐẶC BIỆT
   ══════════════════════════════════════════════════════ */
export const CERT_TYPES = {
    loop: {
        id: 'loop',
        icon: '🏍️',
        title: 'Cung đường Ha Giang Loop', title_en: 'Ha Giang Loop Road',
        shortTitle: 'HG Loop', shortTitle_en: 'HG Loop',
        color: '#f97316',
        bgGrad: 'linear-gradient(135deg,#7c2d12,#c2410c)',
        minStamps: 5,
        certTitle: 'CHINH PHỤC CUNG ĐƯỜNG HA GIANG LOOP', certTitle_en: 'CONQUERING THE HA GIANG LOOP',
        stamps: {
            dongvan: { icon: '🏯', label: 'Phố Đồng Văn', label_en: 'Dong Van Town', color: '#f97316', how: 'Đến thăm phố cổ Đồng Văn', how_en: 'Visit the historic Dong Van old quarter' },
            mapieng: { icon: '🏔️', label: 'Mã Pí Lèng', label_en: 'Ma Pi Leng Pass', color: '#ef4444', how: 'Vượt đèo Mã Pí Lèng', how_en: 'Conquer the legendary Ma Pi Leng Pass' },
            lungcu: { icon: '🚩', label: 'Cột cờ Lũng Cú', label_en: 'Lung Cu Flag Tower', color: '#dc2626', how: 'Leo lên đỉnh Lũng Cú', how_en: 'Climb to the top of Lung Cu' },
            quanba: { icon: '🏞️', label: 'Núi Đôi Quản Bạ', label_en: 'Quan Ba Twin Mountains', color: '#10b981', how: 'Ngắm núi đôi Quản Bạ', how_en: 'Admire the Quan Ba Twin Mountains' },
            deogió: { icon: '💨', label: 'Đèo Gió', label_en: 'Deo Gio Pass', color: '#06b6d4', how: 'Chinh phục đèo Gió', how_en: 'Conquer the Deo Gio mountain pass' },
            congtroi: { icon: '☁️', label: 'Cổng Trời', label_en: "Heaven's Gate", color: '#8b5cf6', how: 'Đứng trên Cổng Trời', how_en: "Stand at Heaven's Gate viewpoint" },
            meovac: { icon: '🌊', label: 'Mèo Vạc', label_en: 'Meo Vac Town', color: '#3b82f6', how: 'Khám phá thị trấn Mèo Vạc', how_en: 'Explore Meo Vac market town' },
            phobang: { icon: '🏘️', label: 'Phố Bảng', label_en: 'Pho Bang Village', color: '#c8963e', how: 'Thăm Phố Bảng yên bình', how_en: 'Visit the peaceful Pho Bang village' },
        },
    },
    culture: {
        id: 'culture',
        icon: '🎨',
        title: 'Trải nghiệm văn hóa', title_en: 'Cultural Experiences',
        shortTitle: 'Văn hóa', shortTitle_en: 'Culture',
        color: '#ec4899',
        bgGrad: 'linear-gradient(135deg,#701a75,#a21caf)',
        minStamps: 3,
        certTitle: 'NGƯỜI KHÁM PHÁ VĂN HÓA HÀ GIANG', certTitle_en: 'HA GIANG CULTURAL EXPLORER',
        stamps: {
            painting: { icon: '🖌️', label: 'Vẽ tranh', label_en: 'Ethnic Painting', color: '#ec4899', how: 'Tham gia lớp vẽ tranh dân tộc', how_en: 'Join an ethnic painting class' },
            cooking: { icon: '🍲', label: 'Nấu ăn truyền thống', label_en: 'Traditional Cooking', color: '#f97316', how: 'Nấu ẩm thực dân tộc cùng HTX', how_en: 'Cook traditional cuisine with HTX' },
            climbing: { icon: '⛰️', label: 'Leo núi', label_en: 'Mountain Climbing', color: '#10b981', how: 'Chinh phục một đỉnh núi tại HG', how_en: 'Conquer a mountain peak in Ha Giang' },
            weaving: { icon: '🧵', label: 'Dệt thổ cẩm', label_en: 'Brocade Weaving', color: '#8b5cf6', how: 'Học dệt thổ cẩm thủ công', how_en: 'Learn traditional brocade weaving' },
            dance: { icon: '💃', label: 'Múa xòe Tây Bắc', label_en: 'Xoe Dance', color: '#ec4899', how: 'Tham gia buổi múa xòe truyền thống', how_en: 'Join a traditional Xoe dance session' },
            festival: { icon: '🎭', label: 'Lễ hội truyền thống', label_en: 'Traditional Festival', color: '#c8963e', how: 'Dự lễ hội của dân tộc thiểu số', how_en: 'Attend an ethnic minority festival' },
        },
    },
    volunteer: {
        id: 'volunteer',
        icon: '🤝',
        title: 'Đóng góp & Tình nguyện', title_en: 'Contribute & Volunteer',
        shortTitle: 'Tình nguyện', shortTitle_en: 'Volunteer',
        color: '#059669',
        bgGrad: 'linear-gradient(135deg,#064e3b,#065f46)',
        minStamps: 2,
        certTitle: 'TÌNH NGUYỆN VIÊN HÀ GIANG', certTitle_en: 'HA GIANG VOLUNTEER',
        stamps: {
            volunteer: { icon: '🙋', label: 'Tình nguyện viên', label_en: 'Volunteer', color: '#059669', how: 'Đăng ký tình nguyện với HTX', how_en: 'Register as a volunteer with HTX' },
            tree: { icon: '🌱', label: 'Trồng cây xanh', label_en: 'Tree Planting', color: '#16a34a', how: 'Tham gia trồng cây ở bản làng', how_en: 'Join tree planting in the village' },
            community: { icon: '🏘️', label: 'Hỗ trợ cộng đồng', label_en: 'Community Support', color: '#0d9488', how: 'Tham gia hoạt động cộng đồng', how_en: 'Participate in community activities' },
            education: { icon: '📖', label: 'Hỗ trợ giáo dục', label_en: 'Education Support', color: '#2563eb', how: 'Hỗ trợ trường học vùng cao', how_en: 'Support highland schools' },
            donation: { icon: '🎁', label: 'Quyên góp', label_en: 'Donation', color: '#7c3aed', how: 'Quyên góp vật phẩm cho bản', how_en: 'Donate supplies to the village' },
        },
    },
    products: {
        id: 'products',
        icon: '🛍️',
        title: 'Trải nghiệm sản phẩm bản địa', title_en: 'Local Product Experience',
        shortTitle: 'Sản phẩm', shortTitle_en: 'Products',
        color: '#c8963e',
        bgGrad: 'linear-gradient(135deg,#78350f,#92400e)',
        minStamps: 3,
        certTitle: 'NGƯỜI TIÊU DÙNG SẢN PHẨM BẢN ĐỊA HÀ GIANG', certTitle_en: 'HA GIANG LOCAL PRODUCT AMBASSADOR',
        stamps: {
            honey: { icon: '🍯', label: 'Mật ong bạc hà', label_en: 'Mint Honey', color: '#f59e0b', how: 'Mua mật ong bạc hà HTX', how_en: 'Buy HTX mint honey' },
            fabric: { icon: '🧣', label: 'Thổ cẩm', label_en: 'Brocade Fabric', color: '#7c3aed', how: 'Mua vải / trang phục thổ cẩm', how_en: 'Purchase brocade fabric or clothing' },
            buckwheat: { icon: '🌸', label: 'Tam giác mạch', label_en: 'Buckwheat Product', color: '#ec4899', how: 'Thưởng thức sản phẩm tam giác mạch', how_en: 'Enjoy buckwheat products' },
            wine: { icon: '🍶', label: 'Rượu ngô', label_en: 'Corn Wine', color: '#c8963e', how: 'Nếm rượu ngô truyền thống', how_en: 'Taste traditional corn wine' },
            tea: { icon: '🍵', label: 'Chè Shan tuyết', label_en: 'Shan Tuyet Tea', color: '#16a34a', how: 'Uống chè Shan tuyết Tủa Chùa', how_en: 'Drink ancient Shan Tuyet tea' },
            herb: { icon: '🌿', label: 'Thuốc nam', label_en: 'Herbal Medicine', color: '#10b981', how: 'Sử dụng thuốc nam bản địa', how_en: 'Use local herbal remedies' },
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
