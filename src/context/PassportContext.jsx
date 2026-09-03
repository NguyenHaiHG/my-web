import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { API } from '../utils/api'

const LS_KEY = 'hagiang_passport'
const GOOGLE_LS_KEY = 'hagiang_google_user'
const SERVER_KEY = 'hagiang_passport_server_key'

function parseGoogleJwt(credential) {
    try {
        const payload = credential.split('.')[1]
        return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    } catch { return null }
}

function getCurrentPassportKey() {
    try {
        const raw = localStorage.getItem(GOOGLE_LS_KEY)
        const sub = raw ? JSON.parse(raw)?.sub : null
        return sub ? `${LS_KEY}_${sub}` : LS_KEY
    } catch { return LS_KEY }
}

function getServerPassportKey() {
    try {
        const googleRaw = localStorage.getItem(GOOGLE_LS_KEY)
        const googleSub = googleRaw ? JSON.parse(googleRaw)?.sub : null
        if (googleSub) return `google_${googleSub}`
        let key = localStorage.getItem(SERVER_KEY)
        if (!key) {
            key = `guest_${crypto.randomUUID().replace(/-/g, '')}`
            localStorage.setItem(SERVER_KEY, key)
        }
        return key
    } catch {
        return 'guest_unavailable_key'
    }
}

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
        shortTitle: 'Hagiangloop Passport', shortTitle_en: 'Hagiangloop Passport',
        color: '#f97316',
        bgGrad: 'linear-gradient(135deg,#7c2d12,#c2410c)',
        minStamps: 5,
        minPoints: 120,
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
        minPoints: 90,
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
        minPoints: 70,
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
        minPoints: 85,
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
    ecozone: {
        id: 'ecozone',
        icon: '🌱',
        title: 'Quang Trung Cultural Eco Zone', title_en: 'Quang Trung Cultural Eco Zone',
        shortTitle: 'Eco Zone', shortTitle_en: 'Eco Zone',
        color: '#16a34a',
        bgGrad: 'linear-gradient(135deg,#14532d,#15803d)',
        minStamps: 4,
        minPoints: 130,
        certTitle: 'ĐẠI SỨ QUANG TRUNG CULTURAL ECO ZONE', certTitle_en: 'QUANG TRUNG CULTURAL ECO ZONE AMBASSADOR',
        stamps: {
            qt_farm: {
                icon: '🌾',
                label: 'Nông nghiệp trải nghiệm Tổ 5',
                label_en: 'To 5 Agriculture Experience',
                color: '#16a34a',
                how: 'Tham gia trải nghiệm nông nghiệp tại Quang Trung Cultural Eco Zone',
                how_en: 'Join agriculture experience at Quang Trung Cultural Eco Zone',
            },
            qt_landscape: {
                icon: '🏞️',
                label: 'Bảo tồn cảnh quan văn hóa',
                label_en: 'Cultural Landscape Conservation',
                color: '#0ea5e9',
                how: 'Check-in hoạt động bảo tồn cảnh quan văn hóa khu Tổ 5',
                how_en: 'Check in to cultural landscape conservation activity in To 5',
            },
            qt_environment: {
                icon: '♻️',
                label: 'Bảo vệ môi trường cộng đồng',
                label_en: 'Community Environment Protection',
                color: '#22c55e',
                how: 'Tham gia hoạt động phân loại rác hoặc làm sạch điểm công cộng',
                how_en: 'Join waste sorting or community cleanup activity',
            },
            chua_trien: {
                icon: '🛕',
                label: 'Điểm lịch sử Chùa Triền',
                label_en: 'Chua Trien Historical Site',
                color: '#d97706',
                how: 'Quét QR tại điểm lịch sử Chùa Triền Hà Giang 1',
                how_en: 'Scan QR at Chua Trien historical site in Ha Giang 1',
            },
            cho_lon: {
                icon: '🏬',
                label: 'Chợ Lớn Hà Giang 1',
                label_en: 'Ha Giang 1 Big Market',
                color: '#2563eb',
                how: 'Quét QR tại Chợ Lớn Hà Giang 1',
                how_en: 'Scan QR at Ha Giang 1 Big Market',
            },
            cho_phien: {
                icon: '🧺',
                label: 'Chợ Phiên Hà Giang 2',
                label_en: 'Ha Giang 2 Weekend Market',
                color: '#0ea5e9',
                how: 'Quét QR tại Chợ Phiên Hà Giang 2',
                how_en: 'Scan QR at Ha Giang 2 weekend market',
            },
            hg2_history: {
                icon: '🏛️',
                label: 'Không gian lịch sử cộng đồng HG2',
                label_en: 'Ha Giang 2 Community History Space',
                color: '#7c3aed',
                how: 'Quét QR tại không gian lịch sử cộng đồng Hà Giang 2',
                how_en: 'Scan QR at Ha Giang 2 community history space',
            },
        },
    },
}

/* ══════════════════════════════════════════════════════
   GPS LANDMARKS – check-in thực địa
   ══════════════════════════════════════════════════════ */
export const GPS_LANDMARKS = [
    { id: 'km0', icon: '🚩', label: 'Cột mốc số 0 – HTX Trường Hải', label_en: 'Km0 – HTX Truong Hai', color: '#dc2626', lat: 22.8228, lng: 104.9882, radius: 300 },
    { id: 'cong_chao', icon: '🏛️', label: 'Cổng chào Hà Giang', label_en: 'Ha Giang Welcome Gate', color: '#f97316', lat: 22.8012, lng: 104.9780, radius: 400 },
    { id: 'quan_ba', icon: '🏞️', label: 'Núi Đôi Quản Bạ – Cổng Trời', label_en: "Quan Ba Twin Peaks – Heaven's Gate", color: '#10b981', lat: 23.0567, lng: 105.0785, radius: 600 },
    { id: 'mapi_leng', icon: '🏔️', label: 'Đỉnh đèo Mã Pí Lèng', label_en: 'Ma Pi Leng Pass Summit', color: '#ef4444', lat: 23.1383, lng: 105.3500, radius: 600 },
    { id: 'dong_van', icon: '🏯', label: 'Phố cổ Đồng Văn', label_en: 'Dong Van Old Quarter', color: '#c8963e', lat: 23.2754, lng: 105.3638, radius: 500 },
    { id: 'lung_cu', icon: '🚩', label: 'Cột cờ Lũng Cú', label_en: 'Lung Cu Flag Tower', color: '#dc2626', lat: 23.3704, lng: 105.3316, radius: 400 },
    { id: 'hsp', icon: '🌾', label: 'Ruộng bậc thang Hoàng Su Phì', label_en: 'Hoang Su Phi Terraces', color: '#16a34a', lat: 22.7083, lng: 104.7133, radius: 800 },
]

/* ══════════════════════════════════════════════════════
   CONTEXT
   ══════════════════════════════════════════════════════ */
const PassportContext = createContext()
export const usePassport = () => useContext(PassportContext)

const fresh = () => ({
    holderName: '',
    stamps: [],
    certs: {},      // { [certId]: { stamps: { [type]: {earnedAt} }, reviews: [] } }
    gpsStamps: [],  // [{ id, earnedAt }]
    certRegistry: [], // [{ certCode, verifyUrl, certId, certTitle, holder, issuedAt, points, stampsCount }]
    eco: {
        scanEvents: [],   // [{ siteCode, siteName, pointsEarned, earnedAt }]
        storeEvents: [],  // [{ storeCode, storeName, visitDateKey, pointsEarned, earnedAt }]
    },
    createdAt: new Date().toISOString(),
})

const load = (key) => {
    try {
        const raw = JSON.parse(localStorage.getItem(key || getCurrentPassportKey()))
        if (!raw) return null
        if (!raw.certs) raw.certs = {}
        if (!raw.gpsStamps) raw.gpsStamps = []
        if (!raw.certRegistry) raw.certRegistry = []
        if (!raw.eco) raw.eco = { scanEvents: [], storeEvents: [] }
        if (!raw.eco.scanEvents) raw.eco.scanEvents = []
        if (!raw.eco.storeEvents) raw.eco.storeEvents = []
        return raw
    } catch { return null }
}
const save = (p) => {
    fetch(`${API}/api/passports/${encodeURIComponent(getServerPassportKey())}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p),
    }).then(response => {
        if (!response.ok) throw new Error(`Passport sync failed (${response.status})`)
        try { localStorage.setItem(getCurrentPassportKey(), JSON.stringify(p)) } catch { /* cache unavailable */ }
    }).catch(() => {
        window.dispatchEvent(new CustomEvent('passport-sync-error'))
    })
}

export function PassportProvider({ children }) {
    const [passport, setPassport] = useState(() => load() || fresh())
    const [googleUser, setGoogleUser] = useState(() => {
        try {
            const raw = localStorage.getItem(GOOGLE_LS_KEY)
            return raw ? JSON.parse(raw) : null
        } catch { return null }
    })
    const ECO_CERT_SITE_MAP = {
        'CS-CHUA-TRIEN-HG1': 'chua_trien',
        'MK-CHO-LON-HG1': 'cho_lon',
        'MK-CHO-PHIEN-HG2': 'cho_phien',
        'CS-BAOTANG-HG2': 'hg2_history',
        'EZ-QUANGTRUNG-T5': 'qt_landscape',
    }

    useEffect(() => {
        const key = getServerPassportKey()
        fetch(`${API}/api/passports/${encodeURIComponent(key)}`)
            .then(response => response.ok ? response.json() : null)
            .then(remote => {
                if (remote) {
                    setPassport(remote)
                    try { localStorage.setItem(getCurrentPassportKey(), JSON.stringify(remote)) } catch { /* noop */ }
                } else {
                    save(passport)
                }
            })
            .catch(() => { })
    }, [googleUser])

    const update = (next) => { setPassport(next); save(next) }
    const setHolderName = (name) => update({ ...passport, holderName: name })

    /* ── Google login ── */
    const loginWithGoogle = useCallback((credential) => {
        const user = parseGoogleJwt(credential)
        if (!user?.sub) return
        localStorage.setItem(GOOGLE_LS_KEY, JSON.stringify(user))
        setGoogleUser(user)
        const key = `${LS_KEY}_${user.sub}`
        const existing = load(key)
        const next = existing || { ...fresh(), holderName: user.name || '' }
        setPassport(next)
    }, [])

    const logoutGoogle = useCallback(() => {
        localStorage.removeItem(GOOGLE_LS_KEY)
        setGoogleUser(null)
        setPassport(load(LS_KEY) || fresh())
    }, [])

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
    const removeStamp = useCallback((type) => {
        setPassport(prev => {
            const next = { ...prev, stamps: prev.stamps.filter(s => s.type !== type) }
            save(next); return next
        })
    }, [])

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
    const removeCertStamp = useCallback((certId, stampType) => {
        setPassport(prev => {
            const certData = prev.certs[certId] || { stamps: {}, reviews: [] }
            const newStamps = { ...certData.stamps }
            delete newStamps[stampType]
            const next = {
                ...prev,
                certs: { ...prev.certs, [certId]: { ...certData, stamps: newStamps } },
            }
            save(next); return next
        })
    }, [])
    const getCertStamps = (certId) => passport.certs[certId]?.stamps || {}
    const getCertStampCount = (certId) => Object.keys(passport.certs[certId]?.stamps || {}).length

    const markCertIssued = useCallback((certId, payload = {}) => {
        setPassport(prev => {
            const certData = prev.certs[certId] || { stamps: {}, reviews: [] }
            if (certData.issuedAt) return prev
            const next = {
                ...prev,
                certs: {
                    ...prev.certs,
                    [certId]: {
                        ...certData,
                        issuedAt: new Date().toISOString(),
                        issueMeta: {
                            ...(certData.issueMeta || {}),
                            ...payload,
                        },
                    },
                },
            }
            save(next)
            return next
        })
    }, [])

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

    /* ── GPS check-in stamps ── */
    const addGpsStamp = useCallback((id) => {
        setPassport(prev => {
            const gpsStamps = prev.gpsStamps || []
            if (gpsStamps.some(s => s.id === id)) return prev
            const next = {
                ...prev,
                gpsStamps: [...gpsStamps, { id, earnedAt: new Date().toISOString() }],
            }
            save(next); return next
        })
    }, [])
    const hasGpsStamp = (id) => (passport.gpsStamps || []).some(s => s.id === id)

    const registerCertificate = useCallback((record) => {
        if (!record?.certCode) return
        setPassport(prev => {
            const registry = prev.certRegistry || []
            const idx = registry.findIndex(r => r.certCode === record.certCode)
            const nextRegistry = idx === -1
                ? [record, ...registry].slice(0, 300)
                : registry.map((r, i) => (i === idx ? { ...r, ...record } : r))

            const next = {
                ...prev,
                certRegistry: nextRegistry,
            }
            save(next)
            return next
        })
    }, [])

    const findCertificateByCode = useCallback((certCode) => {
        if (!certCode) return null
        return (passport.certRegistry || []).find(r => r.certCode === certCode) || null
    }, [passport.certRegistry])

    const getEcoPoints = () => {
        const scanPts = (passport.eco?.scanEvents || []).reduce((sum, e) => sum + (Number(e.pointsEarned) || 0), 0)
        const storePts = (passport.eco?.storeEvents || []).reduce((sum, e) => sum + (Number(e.pointsEarned) || 0), 0)
        return scanPts + storePts
    }

    const recordEcoScan = useCallback(({ siteCode, siteName = '', pointsEarned = 0 }) => {
        if (!siteCode) return
        setPassport(prev => {
            const eco = prev.eco || { scanEvents: [], storeEvents: [] }
            if ((eco.scanEvents || []).some(e => e.siteCode === siteCode)) return prev

            const ecoStampType = ECO_CERT_SITE_MAP[siteCode]
            const certData = ecoStampType ? (prev.certs.ecozone || { stamps: {}, reviews: [] }) : null
            const certDef = ecoStampType ? CERT_TYPES.ecozone?.stamps?.[ecoStampType] : null

            const next = {
                ...prev,
                eco: {
                    ...eco,
                    scanEvents: [
                        ...(eco.scanEvents || []),
                        {
                            siteCode,
                            siteName,
                            pointsEarned: Number(pointsEarned) || 0,
                            earnedAt: new Date().toISOString(),
                        },
                    ],
                },
                certs: ecoStampType ? {
                    ...prev.certs,
                    ecozone: {
                        ...certData,
                        stamps: certData.stamps?.[ecoStampType]
                            ? certData.stamps
                            : {
                                ...(certData.stamps || {}),
                                [ecoStampType]: { earnedAt: new Date().toLocaleDateString('vi-VN'), source: siteCode },
                            },
                    },
                } : prev.certs,
                stamps: certDef && !prev.stamps.some(s => s.type === 'tour')
                    ? [...prev.stamps, {
                        type: 'tour',
                        icon: STAMP_DEFS.tour.icon,
                        label: STAMP_DEFS.tour.label,
                        color: STAMP_DEFS.tour.color,
                        earnedAt: new Date().toLocaleDateString('vi-VN'),
                    }]
                    : prev.stamps,
            }
            save(next)
            return next
        })
    }, [])

    const recordStoreVisit = useCallback(({ storeCode, storeName = '', pointsEarned = 0 }) => {
        if (!storeCode) return
        setPassport(prev => {
            const eco = prev.eco || { scanEvents: [], storeEvents: [] }
            const now = new Date()
            const visitDateKey = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`
            if ((eco.storeEvents || []).some(e => e.storeCode === storeCode && e.visitDateKey === visitDateKey)) return prev

            const hasProductStamp = prev.stamps.some(s => s.type === 'product')
            const next = {
                ...prev,
                eco: {
                    ...eco,
                    storeEvents: [
                        ...(eco.storeEvents || []),
                        {
                            storeCode,
                            storeName,
                            visitDateKey,
                            pointsEarned: Number(pointsEarned) || 0,
                            earnedAt: now.toISOString(),
                        },
                    ],
                },
                stamps: hasProductStamp ? prev.stamps : [
                    ...prev.stamps,
                    {
                        type: 'product',
                        icon: STAMP_DEFS.product.icon,
                        label: STAMP_DEFS.product.label,
                        color: STAMP_DEFS.product.color,
                        earnedAt: new Date().toLocaleDateString('vi-VN'),
                    },
                ],
            }
            save(next)
            return next
        })
    }, [])

    return (
        <PassportContext.Provider value={{
            passport,
            setHolderName,
            addStamp, hasStamp, removeStamp,
            addCertStamp, hasCertStamp, removeCertStamp, getCertStamps, getCertStampCount,
            markCertIssued,
            addReview, getReviews,
            addGpsStamp, hasGpsStamp,
            recordEcoScan, recordStoreVisit, getEcoPoints,
            registerCertificate, findCertificateByCode,
            googleUser, loginWithGoogle, logoutGoogle,
            STAMP_DEFS, CERT_TYPES,
        }}>
            {children}
        </PassportContext.Provider>
    )
}
