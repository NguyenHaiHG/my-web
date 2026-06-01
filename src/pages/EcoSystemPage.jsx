import { useEffect, useMemo, useState } from 'react'
import { MapPin, QrCode, Leaf, Trophy, Building2, Users, ShieldCheck, Store } from 'lucide-react'
import { usePassport } from '../context/PassportContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const FALLBACK_SITES = [
    { code: 'VG-LUNGCAM', name: 'Làng văn hóa Lũng Cẩm', type: 'village', district: 'Đồng Văn', ecoPoints: 30, badge: { name: 'Ký ức làng đá', icon: '🏘️' }, partnerBusiness: { name: 'Hợp tác xã Lũng Cẩm', offer: 'Giảm 10% tour trải nghiệm thêu lanh' }, story: { title: 'Nhà trình tường và ký ức làng đá', content: 'Không gian văn hóa người Mông với kiến trúc trình tường và hàng rào đá.' } },
    { code: 'FM-HSP-TEA', name: 'Nông trại chè Shan Tuyết Hoàng Su Phì', type: 'farm', district: 'Hoàng Su Phì', ecoPoints: 35, badge: { name: 'Người giữ rừng chè', icon: '🍃' }, partnerBusiness: { name: 'Nhóm chè bản Phùng', offer: 'Tặng 1 set trà khi đổi 120 điểm xanh' }, story: { title: 'Cây chè cổ thụ và sinh kế xanh', content: 'Bảo tồn cây chè cổ thụ và phát triển sinh kế bền vững.' } },
    { code: 'CS-CHUA-TRIEN-HG1', name: 'Điểm lịch sử Chùa Triền Hà Giang 1', type: 'cultural-site', district: 'Hà Giang 1', ecoPoints: 28, badge: { name: 'Dấu ấn Chùa Triền', icon: '🛕' }, partnerBusiness: { name: 'Nhóm hướng dẫn văn hóa Hà Giang 1', offer: 'Giảm 10% tour kể chuyện lịch sử địa phương' }, story: { title: 'Không gian tâm linh và ký ức phố núi', content: 'Điểm chùa gắn với lịch sử hình thành cộng đồng địa phương, nơi người dân gìn giữ nghi lễ và văn hóa ứng xử hài hòa với cảnh quan.' } },
    { code: 'MK-CHO-LON-HG1', name: 'Chợ Lớn Hà Giang 1', type: 'cultural-site', district: 'Hà Giang 1', ecoPoints: 24, badge: { name: 'Nhịp Chợ Lớn', icon: '🏬' }, partnerBusiness: { name: 'Tiểu thương Chợ Lớn', offer: 'Ưu đãi combo nông sản sạch cho khách check-in' }, story: { title: 'Nhịp thương hồ phố núi', content: 'Chợ Lớn Hà Giang 1 là điểm giao thương truyền thống, kết nối nông sản bản địa và sản phẩm thủ công của nhiều cộng đồng.' } },
    { code: 'MK-CHO-PHIEN-HG2', name: 'Chợ Phiên Hà Giang 2', type: 'cultural-site', district: 'Hà Giang 2', ecoPoints: 26, badge: { name: 'Dấu Chợ Phiên', icon: '🧺' }, partnerBusiness: { name: 'Ban tổ chức chợ phiên', offer: 'Tặng phiếu trải nghiệm ẩm thực địa phương' }, story: { title: 'Sắc màu chợ phiên vùng cao', content: 'Không gian chợ phiên cuối tuần với ẩm thực, thổ cẩm và âm nhạc dân tộc, phản ánh bản sắc sinh hoạt cộng đồng quanh Hà Giang 2.' } },
    { code: 'CS-BAOTANG-HG2', name: 'Không gian lịch sử cộng đồng Hà Giang 2', type: 'cultural-site', district: 'Hà Giang 2', ecoPoints: 22, badge: { name: 'Ký Ức Hà Giang 2', icon: '🏛️' }, partnerBusiness: { name: 'Câu lạc bộ lịch sử địa phương', offer: 'Ưu đãi tour giáo dục cộng đồng' }, story: { title: 'Ký ức cộng đồng qua hiện vật', content: 'Điểm trưng bày lịch sử địa phương giúp du khách hiểu tiến trình phát triển vùng đất, nghề truyền thống và câu chuyện gìn giữ bản sắc.' } },
    { code: 'EZ-QUANGTRUNG-T5', name: 'Quang Trung Cultural Eco Zone - Tổ 5', type: 'eco-zone', district: 'Phường Quang Trung', ecoPoints: 45, badge: { name: 'Người Gìn Giữ Quang Trung', icon: '🌱' }, partnerBusiness: { name: 'Quang Trung Cultural Eco Zone', offer: 'Combo trải nghiệm nông nghiệp + workshop môi trường cho nhóm gia đình' }, story: { title: 'Nông nghiệp trải nghiệm và bảo tồn cảnh quan văn hóa', content: 'Không gian thực hành nông nghiệp cộng đồng, bảo tồn cảnh quan văn hóa tổ 5 và hoạt động bảo vệ môi trường với mô hình phân loại rác, trồng cây, tái tạo mảng xanh.' } },
]

const FALLBACK_STORES = [
    {
        code: 'ST-HG-LANH-01',
        name: 'Nhà lanh bản Lô Lô Chải',
        category: 'craft',
        district: 'Đồng Văn',
        address: 'Bản Lô Lô Chải, Lũng Cú, Đồng Văn',
        story: { title: 'Xưởng lanh thủ công', content: 'Tự tay se sợi lanh, nhuộm chàm và in sáp ong cùng nghệ nhân địa phương.' },
        experience: { label: 'Mini workshop dệt lanh', description: 'Trải nghiệm 60 phút và nhận postcard họa tiết Mông.' },
        stamp: { name: 'Dấu Lanh Biên Cương', icon: '🧵' },
        reward: { visitPoints: 16 },
        offers: [{ title: 'Giảm 10% workshop', detail: 'Áp dụng cho nhóm từ 2 khách' }],
    },
    {
        code: 'ST-HG-TEA-02',
        name: 'Tea Bar Shan Tuyết Hoàng Su Phì',
        category: 'food',
        district: 'Hoàng Su Phì',
        address: 'Bản Phùng, Hoàng Su Phì',
        story: { title: 'Không gian trà cao nguyên', content: 'Nếm 5 dòng trà Shan Tuyết và nghe kể chuyện về cây chè cổ thụ.' },
        experience: { label: 'Tea tasting bản địa', description: 'Set nếm trà theo mùa, kết hợp storytelling của người bản địa.' },
        stamp: { name: 'Dấu Người Giữ Chè', icon: '🍵' },
        reward: { visitPoints: 14 },
        offers: [{ title: 'Giảm 12% combo tea flight', detail: 'Áp dụng khi check-in trong ngày' }],
    },
]

export default function EcoSystemPage() {
    const { recordEcoScan, recordStoreVisit } = usePassport()
    const [sites, setSites] = useState([])
    const [leaderboard, setLeaderboard] = useState([])
    const [businessData, setBusinessData] = useState([])
    const [stores, setStores] = useState([])
    const [storeLeaderboard, setStoreLeaderboard] = useState([])
    const [storeInsights, setStoreInsights] = useState([])
    const [reports, setReports] = useState([])
    const [summary, setSummary] = useState({ overview: { total: 0, open: 0, inProgress: 0, resolved: 0, highSeverity: 0 }, bySite: [] })
    const [scanForm, setScanForm] = useState({ userKey: '', siteCode: '' })
    const [scanResult, setScanResult] = useState(null)
    const [storeForm, setStoreForm] = useState({ userKey: '', storeCode: '', spendAmount: '' })
    const [storeResult, setStoreResult] = useState(null)
    const [reportForm, setReportForm] = useState({
        reporter: '',
        siteCode: '',
        category: 'other',
        severity: 'medium',
        description: '',
    })
    const [loading, setLoading] = useState(true)
    const [offline, setOffline] = useState(false)

    const loadData = async () => {
        setLoading(true)
        try {
            const [sitesRes, lbRes, bizRes, reportsRes, summaryRes, storesRes, storeLbRes, storeInsightsRes] = await Promise.all([
                fetch(`${API}/api/eco-system/sites`),
                fetch(`${API}/api/eco-system/leaderboard`),
                fetch(`${API}/api/eco-system/business-dashboard`),
                fetch(`${API}/api/eco-system/reports`),
                fetch(`${API}/api/eco-system/conservation-summary`),
                fetch(`${API}/api/eco-system/stores`),
                fetch(`${API}/api/eco-system/store-leaderboard`),
                fetch(`${API}/api/eco-system/store-insights`),
            ])

            if (!sitesRes.ok) throw new Error('Không tải được sites')

            const [sitesData, lbData, bizData, reportsData, summaryData, storesData, storeLbData, storeInsightsData] = await Promise.all([
                sitesRes.json(),
                lbRes.ok ? lbRes.json() : [],
                bizRes.ok ? bizRes.json() : [],
                reportsRes.ok ? reportsRes.json() : [],
                summaryRes.ok ? summaryRes.json() : { overview: { total: 0, open: 0, inProgress: 0, resolved: 0, highSeverity: 0 }, bySite: [] },
                storesRes.ok ? storesRes.json() : [],
                storeLbRes.ok ? storeLbRes.json() : [],
                storeInsightsRes.ok ? storeInsightsRes.json() : [],
            ])

            setSites(sitesData)
            setLeaderboard(lbData)
            setBusinessData(bizData)
            setStores(storesData)
            setStoreLeaderboard(storeLbData)
            setStoreInsights(storeInsightsData)
            setReports(reportsData)
            setSummary(summaryData)
            setOffline(false)

            if (!scanForm.siteCode && sitesData[0]?.code) {
                setScanForm(p => ({ ...p, siteCode: sitesData[0].code }))
                setReportForm(p => ({ ...p, siteCode: sitesData[0].code }))
            }
            if (!storeForm.storeCode && storesData[0]?.code) {
                setStoreForm(p => ({ ...p, storeCode: storesData[0].code }))
            }
        } catch {
            setOffline(true)
            setSites(FALLBACK_SITES)
            setStores(FALLBACK_STORES)
            setLeaderboard([])
            setBusinessData([])
            setStoreLeaderboard([])
            setStoreInsights([])
            setReports([])
            setSummary({ overview: { total: 0, open: 0, inProgress: 0, resolved: 0, highSeverity: 0 }, bySite: [] })
            if (!scanForm.siteCode && FALLBACK_SITES[0]?.code) {
                setScanForm(p => ({ ...p, siteCode: FALLBACK_SITES[0].code }))
                setReportForm(p => ({ ...p, siteCode: FALLBACK_SITES[0].code }))
            }
            if (!storeForm.storeCode && FALLBACK_STORES[0]?.code) {
                setStoreForm(p => ({ ...p, storeCode: FALLBACK_STORES[0].code }))
            }
        }
        setLoading(false)
    }

    useEffect(() => {
        loadData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const typeLabel = {
        village: 'Làng văn hóa',
        farm: 'Nông trại',
        'eco-zone': 'Vùng sinh thái',
        'cultural-site': 'Điểm văn hóa',
    }

    const totalPotentialPoints = useMemo(() => sites.reduce((sum, s) => sum + (s.ecoPoints || 0), 0), [sites])
    const totalStorePotentialPoints = useMemo(() => stores.reduce((sum, s) => sum + (s.reward?.visitPoints || 0), 0), [stores])

    const storeCategoryLabel = {
        craft: 'Thủ công',
        food: 'Ẩm thực',
        homestay: 'Lưu trú',
        'farm-shop': 'Nông sản',
        wellness: 'Chăm sóc',
        souvenir: 'Lưu niệm',
    }

    const handleScan = async (e) => {
        e.preventDefault()
        if (!scanForm.userKey.trim() || !scanForm.siteCode) return

        if (offline) {
            const site = sites.find(s => s.code === scanForm.siteCode)
            const data = {
                alreadyCollected: false,
                pointsEarned: site?.ecoPoints || 0,
                site,
                badge: site?.badge,
                story: site?.story,
                message: 'Demo mode: mở khóa thành công (offline).',
            }
            setScanResult(data)
            if (!data.alreadyCollected) {
                recordEcoScan({
                    siteCode: site?.code || scanForm.siteCode,
                    siteName: site?.name || '',
                    pointsEarned: data.pointsEarned || 0,
                })
            }
            return
        }

        const res = await fetch(`${API}/api/eco-system/scan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(scanForm),
        })
        const data = await res.json()
        setScanResult(data)
        if (!data.alreadyCollected) {
            recordEcoScan({
                siteCode: data.site?.code || scanForm.siteCode,
                siteName: data.site?.name || '',
                pointsEarned: data.pointsEarned || 0,
            })
        }
        await loadData()
    }

    const handleStoreVisit = async (e) => {
        e.preventDefault()
        if (!storeForm.userKey.trim() || !storeForm.storeCode) return

        if (offline) {
            const store = stores.find(s => s.code === storeForm.storeCode)
            const spend = Number(storeForm.spendAmount) > 0 ? Number(storeForm.spendAmount) : 0
            const points = (store?.reward?.visitPoints || 0) + Math.floor(spend * 0.1)
            const data = {
                alreadyCheckedInToday: false,
                pointsEarned: points,
                store,
                stamp: store?.stamp,
                message: 'Demo mode: check-in cửa hàng thành công (offline).',
            }
            setStoreResult(data)
            if (!data.alreadyCheckedInToday) {
                recordStoreVisit({
                    storeCode: store?.code || storeForm.storeCode,
                    storeName: store?.name || '',
                    pointsEarned: data.pointsEarned || 0,
                })
            }
            return
        }

        const res = await fetch(`${API}/api/eco-system/store-visit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userKey: storeForm.userKey,
                storeCode: storeForm.storeCode,
                spendAmount: Number(storeForm.spendAmount) || 0,
            }),
        })
        const data = await res.json()
        setStoreResult(data)
        if (!data.alreadyCheckedInToday) {
            recordStoreVisit({
                storeCode: data.store?.code || storeForm.storeCode,
                storeName: data.store?.name || '',
                pointsEarned: data.pointsEarned || 0,
            })
        }
        await loadData()
    }

    const submitReport = async (e) => {
        e.preventDefault()
        if (!reportForm.siteCode || !reportForm.description.trim()) return

        if (offline) {
            setReportForm(p => ({ ...p, description: '' }))
            return
        }

        await fetch(`${API}/api/eco-system/reports`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reportForm),
        })

        setReportForm(p => ({ ...p, description: '' }))
        await loadData()
    }

    return (
        <div className="eco-page container py-section">
            <div className="eco-head">
                <h1>Ha Giang Smart Cultural Landscape</h1>
                <p>Quét QR tại làng, nông trại, vùng sinh thái để mở khóa câu chuyện, nhận huy hiệu, tích điểm xanh và tham gia bảo tồn cộng đồng.</p>
                <div className="eco-head-metrics">
                    <span>{sites.length} điểm đến</span>
                    <span>{stores.length} cửa hàng trải nghiệm</span>
                    <span>{totalPotentialPoints + totalStorePotentialPoints} điểm tiềm năng</span>
                </div>
                {offline && <span className="eco-offline">Đang ở chế độ offline demo</span>}
            </div>

            <section className="eco-grid eco-grid-3">
                <div className="eco-card">
                    <div className="eco-card-top"><MapPin size={18} /><h3>Interactive Map Layer</h3></div>
                    <p>{sites.length} điểm văn hóa/sinh thái đã kết nối.</p>
                    <div className="eco-site-list">
                        {sites.map(site => (
                            <div key={site.code} className="eco-site-item">
                                <strong>{site.name}</strong>
                                <span>{typeLabel[site.type] || site.type} · {site.district}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="eco-card">
                    <div className="eco-card-top"><QrCode size={18} /><h3>QR Storytelling</h3></div>
                    <form className="eco-form" onSubmit={handleScan}>
                        <input className="form-input" placeholder="Tên du khách / user key" value={scanForm.userKey}
                            onChange={e => setScanForm(p => ({ ...p, userKey: e.target.value }))} />
                        <select className="form-input" value={scanForm.siteCode} onChange={e => setScanForm(p => ({ ...p, siteCode: e.target.value }))}>
                            {sites.map(site => <option key={site.code} value={site.code}>{site.name}</option>)}
                        </select>
                        <button className="btn3d btn3d-green" type="submit">Quét QR & Mở khóa</button>
                    </form>
                    {scanResult && (
                        <div className="eco-result">
                            <p>{scanResult.message}</p>
                            {scanResult.story?.title && <strong>{scanResult.story.title}</strong>}
                            {scanResult.story?.content && <p>{scanResult.story.content}</p>}
                        </div>
                    )}
                </div>

                <div className="eco-card">
                    <div className="eco-card-top"><Leaf size={18} /><h3>Eco Reward System</h3></div>
                    <p>Tổng điểm xanh khả dụng toàn hệ: <strong>{totalPotentialPoints}</strong></p>
                    <p>Huy hiệu mở khóa theo site và được ghi nhận vào Passport số.</p>
                    <div className="eco-badge-row">
                        {sites.slice(0, 5).map(s => <span key={s.code} className="eco-badge-chip">{s.badge?.icon || '🌿'} {s.badge?.name}</span>)}
                    </div>
                </div>
            </section>

            <section className="eco-grid eco-grid-3" style={{ marginTop: 18 }}>
                <div className="eco-card">
                    <div className="eco-card-top"><Store size={18} /><h3>Store Experience Network</h3></div>
                    <p>{stores.length} cửa hàng địa phương đã kết nối trải nghiệm.</p>
                    <p>Tổng điểm check-in cửa hàng khả dụng: <strong>{totalStorePotentialPoints}</strong></p>
                    <div className="eco-site-list">
                        {stores.map(store => (
                            <div key={store.code} className="eco-site-item">
                                <strong>{store.name}</strong>
                                <span>{storeCategoryLabel[store.category] || store.category} · {store.district}</span>
                                {store.experience?.label && <span>{store.experience.label}</span>}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="eco-card">
                    <div className="eco-card-top"><QrCode size={18} /><h3>QR Store Story & Check-in</h3></div>
                    <form className="eco-form" onSubmit={handleStoreVisit}>
                        <input
                            className="form-input"
                            placeholder="Tên khách / user key"
                            value={storeForm.userKey}
                            onChange={e => setStoreForm(p => ({ ...p, userKey: e.target.value }))}
                        />
                        <select
                            className="form-input"
                            value={storeForm.storeCode}
                            onChange={e => setStoreForm(p => ({ ...p, storeCode: e.target.value }))}
                        >
                            {stores.map(store => <option key={store.code} value={store.code}>{store.name}</option>)}
                        </select>
                        <input
                            className="form-input"
                            type="number"
                            min="0"
                            placeholder="Chi tiêu (tuỳ chọn)"
                            value={storeForm.spendAmount}
                            onChange={e => setStoreForm(p => ({ ...p, spendAmount: e.target.value }))}
                        />
                        <button className="btn3d btn3d-blue" type="submit">Quét QR cửa hàng</button>
                    </form>
                    {storeResult && (
                        <div className="eco-result" style={{ marginTop: 12 }}>
                            <p>{storeResult.message}</p>
                            {storeResult.store?.story?.title && <strong>{storeResult.store.story.title}</strong>}
                            {storeResult.store?.story?.content && <p>{storeResult.store.story.content}</p>}
                            {storeResult.store?.experience?.description && <p>{storeResult.store.experience.description}</p>}
                            <p>Điểm nhận: <strong>{storeResult.pointsEarned || 0}</strong> · Dấu: {storeResult.stamp?.icon || '🛍️'} {storeResult.stamp?.name || 'Dấu trải nghiệm'}</p>
                        </div>
                    )}
                </div>

                <div className="eco-card">
                    <div className="eco-card-top"><Trophy size={18} /><h3>Store Leaderboard</h3></div>
                    {storeLeaderboard.length === 0 ? (
                        <p>Chưa có dữ liệu check-in cửa hàng.</p>
                    ) : (
                        <ol className="eco-leaderboard">
                            {storeLeaderboard.map(row => (
                                <li key={`${row.userKey}-${row.rank}`}>
                                    <span>#{row.rank} {row.userKey}</span>
                                    <strong>{row.totalStorePoints} điểm</strong>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>
            </section>

            <section className="eco-grid eco-grid-2" style={{ marginTop: 18 }}>
                <div className="eco-card">
                    <div className="eco-card-top"><Building2 size={18} /><h3>Local Business Dashboard</h3></div>
                    {businessData.length === 0 ? (
                        <p>Chưa có dữ liệu partner.</p>
                    ) : (
                        <div className="eco-table-wrap">
                            <table className="eco-table">
                                <thead>
                                    <tr>
                                        <th>Điểm</th>
                                        <th>Đối tác</th>
                                        <th>Scan</th>
                                        <th>Offer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {businessData.map(row => (
                                        <tr key={row.code}>
                                            <td>{row.name}</td>
                                            <td>{row.partnerBusiness?.name || '-'}</td>
                                            <td>{row.totalScans}</td>
                                            <td>{row.partnerBusiness?.offer || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="eco-card">
                    <div className="eco-card-top"><Trophy size={18} /><h3>Community Leaderboard</h3></div>
                    {leaderboard.length === 0 ? <p>Chưa có dữ liệu scan.</p> : (
                        <ol className="eco-leaderboard">
                            {leaderboard.map(r => (
                                <li key={r.userKey}>
                                    <span>#{r.rank} {r.userKey}</span>
                                    <strong>{r.totalPoints} điểm</strong>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>
            </section>

            <section className="eco-grid eco-grid-2" style={{ marginTop: 18 }}>
                <div className="eco-card">
                    <div className="eco-card-top"><Building2 size={18} /><h3>Store Insights Dashboard</h3></div>
                    {storeInsights.length === 0 ? (
                        <p>Chưa có dữ liệu cửa hàng.</p>
                    ) : (
                        <div className="eco-table-wrap">
                            <table className="eco-table">
                                <thead>
                                    <tr>
                                        <th>Cửa hàng</th>
                                        <th>Lượt</th>
                                        <th>Khách</th>
                                        <th>Điểm phát</th>
                                        <th>Ưu đãi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {storeInsights.map(row => (
                                        <tr key={row.code}>
                                            <td>{row.name}</td>
                                            <td>{row.totalVisits}</td>
                                            <td>{row.uniqueVisitors}</td>
                                            <td>{row.totalPointsIssued}</td>
                                            <td>{row.topOffer || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="eco-card">
                    <div className="eco-card-top"><Leaf size={18} /><h3>Store Offers</h3></div>
                    <div className="eco-report-list">
                        {stores.flatMap(store => (store.offers || []).slice(0, 1).map(offer => ({
                            id: `${store.code}-${offer.title}`,
                            storeName: store.name,
                            category: storeCategoryLabel[store.category] || store.category,
                            title: offer.title,
                            detail: offer.detail,
                        }))).slice(0, 6).map(item => (
                            <div key={item.id} className="eco-report-item">
                                <strong>{item.storeName}</strong>
                                <span>{item.category}</span>
                                <p><strong>{item.title}</strong> - {item.detail}</p>
                            </div>
                        ))}
                        {stores.length === 0 && <p>Chưa có ưu đãi trải nghiệm.</p>}
                    </div>
                </div>
            </section>

            <section className="eco-grid eco-grid-2" style={{ marginTop: 18 }}>
                <div className="eco-card">
                    <div className="eco-card-top"><Users size={18} /><h3>Community Participation</h3></div>
                    <form className="eco-form" onSubmit={submitReport}>
                        <input className="form-input" placeholder="Tên người báo cáo" value={reportForm.reporter}
                            onChange={e => setReportForm(p => ({ ...p, reporter: e.target.value }))} />
                        <select className="form-input" value={reportForm.siteCode} onChange={e => setReportForm(p => ({ ...p, siteCode: e.target.value }))}>
                            {sites.map(site => <option key={site.code} value={site.code}>{site.name}</option>)}
                        </select>
                        <div className="eco-form-row">
                            <select className="form-input" value={reportForm.category} onChange={e => setReportForm(p => ({ ...p, category: e.target.value }))}>
                                <option value="waste">Rác thải</option>
                                <option value="water">Nguồn nước</option>
                                <option value="trail">Lối mòn du lịch</option>
                                <option value="biodiversity">Đa dạng sinh học</option>
                                <option value="other">Khác</option>
                            </select>
                            <select className="form-input" value={reportForm.severity} onChange={e => setReportForm(p => ({ ...p, severity: e.target.value }))}>
                                <option value="low">Mức thấp</option>
                                <option value="medium">Mức vừa</option>
                                <option value="high">Mức cao</option>
                            </select>
                        </div>
                        <textarea className="form-input form-textarea" rows="3" placeholder="Mô tả quan sát tại hiện trường..."
                            value={reportForm.description}
                            onChange={e => setReportForm(p => ({ ...p, description: e.target.value }))} />
                        <button className="btn3d btn3d-orange" type="submit">Gửi báo cáo bảo tồn</button>
                    </form>
                </div>

                <div className="eco-card">
                    <div className="eco-card-top"><ShieldCheck size={18} /><h3>Landscape Conservation Tracking</h3></div>
                    <div className="eco-summary">
                        <div><span>Tổng báo cáo</span><strong>{summary.overview.total}</strong></div>
                        <div><span>Mở</span><strong>{summary.overview.open}</strong></div>
                        <div><span>Đang xử lý</span><strong>{summary.overview.inProgress}</strong></div>
                        <div><span>Đã xử lý</span><strong>{summary.overview.resolved}</strong></div>
                        <div><span>Mức cao</span><strong>{summary.overview.highSeverity}</strong></div>
                    </div>
                    <div className="eco-report-list">
                        {reports.slice(0, 6).map(rep => (
                            <div key={rep._id || rep.id} className="eco-report-item">
                                <strong>{rep.siteName}</strong>
                                <span>{rep.category} · {rep.severity} · {rep.status}</span>
                                <p>{rep.description}</p>
                            </div>
                        ))}
                        {reports.length === 0 && <p>Chưa có báo cáo nào.</p>}
                    </div>
                </div>
            </section>

            {loading && <p style={{ marginTop: 14, color: '#64748b' }}>Đang tải hệ sinh thái số...</p>}
        </div>
    )
}
