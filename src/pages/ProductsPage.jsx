import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Trash2, Phone, ShoppingCart, Edit2 } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { useOrder } from '../context/OrderContext'
import { useLang } from '../context/LanguageContext'
import { usePassport } from '../context/PassportContext'
import AdminImgBtn from '../components/AdminImgBtn'

const FARM_TRACE_LOTS = [
  {
    id: 'lot-hg-00',
    type: 'livestock',
    farmName: 'Nông trại Trường Hải',
    product: 'Vịt nhà bà Hoa',
    lotCode: 'HG-VH-2005-01',
    farmer: 'Bà Hoa',
    area: 'Chuồng sau nhà',
    gps: '22.8240, 104.9860',
    harvestedAt: 'Đang nuôi',
    plannedSellDate: '05/06/2026',
    expectedOutput: 'Khoảng 75kg vịt thương phẩm',
    verified: 'Đã xác nhận tổ trưởng',
    standard: 'Chăn nuôi an toàn sinh học - không tồn dư kháng sinh',
    weather: { rain7dMm: 62, dryDays: 1, waterLevelCm: 18, source: 'Trạm mưa mini + nhật ký tổ hợp tác' },
    logs: [
      { date: '20/05/2026', task: 'Mua 50 con vịt giống, trung bình 500g/con', proof: 'Ảnh hóa đơn + cân mẫu' },
      { date: '21/05/2026', task: 'Cho ăn cám gạo + rau xanh, 2 cữ sáng/chiều', proof: 'Nhật ký app' },
      { date: '23/05/2026', task: 'Vệ sinh chuồng và thay nước', proof: 'Ảnh hiện trường' },
      { date: '26/05/2026', task: 'Cân kiểm tra tăng trưởng theo nhóm 10 con', proof: 'Số cân + ảnh' },
    ],
  },
  {
    id: 'lot-hg-01',
    type: 'crop',
    farmName: 'Nông trại liên kết Bắc Quang',
    product: 'Cam sành hữu cơ',
    lotCode: 'HG-CSA-2605-01',
    farmer: 'Vàng Mí Sinh',
    area: '2.5 sào',
    gps: '22.8231, 104.9836',
    harvestedAt: '25/05/2026',
    plannedSellDate: '30/05/2026',
    expectedOutput: 'Khoảng 420kg cam loại 1',
    verified: 'Đã đối soát HTX',
    standard: 'VietGAP nội bộ + phân hữu cơ vi sinh',
    weather: { rain7dMm: 188, dryDays: 0, waterLevelCm: 72, source: 'Trạm mưa xã + dữ liệu cảnh báo huyện' },
    logs: [
      { date: '12/05/2026', task: 'Làm đất và bổ sung phân hữu cơ', proof: 'Ảnh + GPS' },
      { date: '18/05/2026', task: 'Tưới nhỏ giọt theo lịch', proof: 'Nhật ký app' },
      { date: '24/05/2026', task: 'Lấy mẫu kiểm tra dư lượng', proof: 'Biên bản kiểm tra' },
      { date: '25/05/2026', task: 'Thu hoạch và đóng gói lô 01', proof: 'Cân nặng + ảnh kho' },
    ],
  },
  {
    id: 'lot-hg-02',
    type: 'livestock',
    farmName: 'Nông trại liên kết Đồng Văn',
    product: 'Mật ong bạc hà',
    lotCode: 'HG-MOB-2605-02',
    farmer: 'Lý Thị Giàng',
    area: '35 đàn ong',
    gps: '23.2455, 105.3094',
    harvestedAt: '21/05/2026',
    plannedSellDate: '01/06/2026',
    expectedOutput: 'Khoảng 180 lít mật',
    verified: 'Đã xác thực trưởng nhóm',
    standard: 'Mật ong sạch, không pha đường, truy xuất theo đàn',
    weather: { rain7dMm: 24, dryDays: 9, waterLevelCm: 10, source: 'Thiết bị đo mưa HTX + ảnh chụp hiện trường' },
    logs: [
      { date: '05/05/2026', task: 'Kiểm tra sức khỏe đàn ong', proof: 'Video ngắn' },
      { date: '10/05/2026', task: 'Bổ sung thùng ong và đánh dấu vị trí', proof: 'GPS + ảnh' },
      { date: '20/05/2026', task: 'Quay mật và lọc lần 1', proof: 'Nhật ký kho' },
      { date: '21/05/2026', task: 'Đóng chai và dán mã truy xuất', proof: 'Mã lô + số lượng' },
    ],
  },
  {
    id: 'lot-hg-03',
    type: 'crop',
    farmName: 'Nông trại liên kết Quản Bạ',
    product: 'Gạo nếp nương',
    lotCode: 'HG-GNN-2605-03',
    farmer: 'Hoàng Văn Chính',
    area: '4 sào',
    gps: '22.7520, 105.0012',
    harvestedAt: '19/05/2026',
    plannedSellDate: '03/06/2026',
    expectedOutput: 'Khoảng 260kg gạo thành phẩm',
    verified: 'Đã đối soát cân kho',
    standard: 'Canh tác bền vững, giảm thuốc BVTV theo ngưỡng',
    weather: { rain7dMm: 132, dryDays: 0, waterLevelCm: 47, source: 'Trạm thủy văn + cảm biến ruộng mẫu' },
    logs: [
      { date: '03/05/2026', task: 'Chăm sóc lúa giai đoạn trổ bông', proof: 'Nhật ký công việc' },
      { date: '11/05/2026', task: 'Kiểm tra sâu bệnh theo ô ruộng', proof: 'Ảnh hiện trường' },
      { date: '18/05/2026', task: 'Gặt và phơi theo mẻ', proof: 'Ảnh + cân khối lượng' },
      { date: '19/05/2026', task: 'Nhập kho và tạo mã lô online', proof: 'Mã truy xuất' },
    ],
  },
]

const DIGITAL_AGRI_CAPABILITIES = [
  'Quản lý',
  'Phân tích',
  'Theo dõi',
  'Dự đoán',
  'Bán hàng',
  'Truy xuất nguồn gốc',
]

function ProductCard({ item, onOrder, onAddCart, onView, onDelete, onEdit, isMod, isAdmin, t }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  return (
    <div className="card3d"
      style={{ transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); setTilt({ x: ((e.clientY - r.top) / r.height - .5) * 12, y: -((e.clientX - r.left) / r.width - .5) * 12 }) }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}>
      <div className="card3d-img" style={{ backgroundImage: `url(${item.img || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80'})` }}>
        {isMod && <AdminImgBtn type="product" itemId={item.id} />}
        <div className="card3d-badge">🌿 {t('prod_badge')}</div>
      </div>
      <div className="card3d-body">
        <strong className="card3d-title">{item.title}</strong>
        <p className="card3d-desc">{item.desc}</p>
        {item.price && <span className="card3d-price">{item.price}</span>}
        <div className="card3d-actions">
          <button className="btn-card-view" onClick={() => onView(item)}>{t('prod_detail')}</button>
          <button className="btn3d btn3d-green btn-sm" onClick={() => onAddCart(item)}><ShoppingCart size={14} /> {t('prod_cart')}</button>
          <button className="btn3d btn3d-orange btn-sm" onClick={() => onOrder(item)}>{t('prod_buy')}</button>
          {isMod && <button className="btn3d btn3d-blue btn-sm" onClick={() => onEdit(item)}><Edit2 size={13} /> {t('blog_edit')}</button>}
          {isAdmin && <button className="btn-card-del" onClick={() => onDelete('product', item.id)}><Trash2 size={14} /></button>}
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const { products } = useData()
  const { deleteItem } = useData()
  const { isMod, isAdmin } = useAuth()
  const { setAdminModal, setDetailItem, setEditItem, showToast } = useUI()
  const { addStamp } = usePassport()
  const { addToCart, submitCartOrder } = useOrder()
  const { t } = useLang()
  const [search, setSearch] = useState('')
  const [orderItem, setOrderItem] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', qty: 1, address: '', note: '' })
  const [demoOpen, setDemoOpen] = useState(false)
  const [activeLotId, setActiveLotId] = useState(FARM_TRACE_LOTS[0].id)
  const [traceQuery, setTraceQuery] = useState(FARM_TRACE_LOTS[0].lotCode)
  const [alertedLots, setAlertedLots] = useState([])
  const [vaccinationState, setVaccinationState] = useState({})
  const [lotImages, setLotImages] = useState({})

  const filtered = products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))

  const submitOrder = (e) => {
    e.preventDefault()
    submitCartOrder(
      { name: form.name, phone: form.phone, address: form.address, note: form.note },
      [{ ...orderItem, qty: Number(form.qty) }]
    )
    setOrderItem(null)
    setForm({ name: '', phone: '', qty: 1, address: '', note: '' })
    showToast(t('prod_success_msg').replace('{title}', orderItem.title))
  }

  const activeLot = FARM_TRACE_LOTS.find(lot => lot.id === activeLotId) || FARM_TRACE_LOTS[0]
  const tracedLot = FARM_TRACE_LOTS.find(
    lot => lot.lotCode.toLowerCase() === traceQuery.trim().toLowerCase()
  )
  const displayLot = tracedLot || activeLot

  const parseDMYDate = (value) => {
    const [day, month, year] = value.split('/').map(Number)
    return new Date(year, month - 1, day)
  }

  const getDaysToSell = (dateText) => {
    if (!dateText || !dateText.includes('/')) return null
    const today = new Date()
    const target = parseDMYDate(dateText)
    const oneDay = 24 * 60 * 60 * 1000
    return Math.ceil((target.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0)) / oneDay)
  }

  const getWeatherWarning = (weather) => {
    if (!weather) return 'Chưa có dữ liệu thời tiết.'
    if (weather.rain7dMm > 180 || weather.waterLevelCm >= 65) return 'Cảnh báo lũ: cần kiểm tra thoát nước và khu vực thấp ngay.'
    if (weather.rain7dMm >= 120 || weather.waterLevelCm >= 40) return 'Cảnh báo úng: theo dõi rãnh thoát nước, tránh đọng nước lâu.'
    if (weather.dryDays >= 7 || weather.rain7dMm < 25) return 'Cảnh báo hạn: cần chủ động lịch tưới, tiết kiệm nước.'
    return 'Thời tiết ổn định, tiếp tục theo dõi hàng ngày.'
  }

  const isLotAlerted = (lotId) => alertedLots.includes(lotId)

  const toggleSaleAlert = (lot) => {
    const alerted = isLotAlerted(lot.id)
    if (alerted) {
      setAlertedLots(prev => prev.filter(id => id !== lot.id))
      showToast(`Đã tắt cảnh báo xuất bán cho ${lot.product}`)
      return
    }
    setAlertedLots(prev => [...prev, lot.id])
    showToast(`Đã bật cảnh báo sắp xuất bán cho ${lot.product}. Hãy ưu tiên tìm khách hàng.`)
  }

  const setVaccination = (lotId, value) => {
    setVaccinationState(prev => ({ ...prev, [lotId]: value }))
    showToast(value ? 'Đã ghi nhận: Có tiêm phòng' : 'Đã ghi nhận: Chưa tiêm phòng')
  }

  const addLotImages = (lotId, fileList) => {
    const files = Array.from(fileList || []).filter(file => file.type.startsWith('image/'))
    if (files.length === 0) {
      showToast('Vui lòng chọn file ảnh hợp lệ')
      return
    }

    const items = files.map(file => ({
      id: `${Date.now()}_${file.name}`,
      name: file.name,
      url: URL.createObjectURL(file),
      addedAt: new Date().toLocaleString('vi-VN'),
    }))

    setLotImages(prev => ({
      ...prev,
      [lotId]: [...(prev[lotId] || []), ...items],
    }))

    showToast(`Đã thêm ${items.length} ảnh minh chứng`)
  }

  const lotImageList = (lotId) => lotImages[lotId] || []

  return (
    <div className="page-enter">
      <div className="page-hero" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1400&q=80)' }}>
        <div className="ph-overlay" />
        <div className="ph-content">
          <h1>{t('prod_hero_title')}</h1>
          <p>{t('prod_hero_sub')}</p>
        </div>
      </div>

      {orderItem && (
        <div className="modal-backdrop" onClick={() => setOrderItem(null)}>
          <div className="modal modal-large" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOrderItem(null)}>✕</button>
            <h2 className="modal-title">🛒 {t('prod_order_title')}: {orderItem.title}</h2>
            <p className="modal-hint">{orderItem.price}</p>
            <form onSubmit={submitOrder} className="login-form">
              <input className="form-input" placeholder={t('prod_name_ph')} value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input className="form-input" type="tel" placeholder={t('prod_phone_ph')} value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} required />
              <div className="form-2col">
                <input className="form-input" type="number" min="1" placeholder={t('prod_qty_ph')} value={form.qty}
                  onChange={e => setForm({ ...form, qty: e.target.value })} />
                <input className="form-input" placeholder={t('prod_city_ph')} value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
              <textarea className="form-input form-textarea" style={{ minHeight: 60 }} placeholder={t('prod_note_ph')}
                value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
              <button type="submit" className="btn3d btn3d-orange btn-full">{t('prod_confirm_btn')}</button>
              <a href="tel:0385737705" className="btn3d btn3d-blue btn-full" style={{ textAlign: 'center', marginTop: 8 }}>
                <Phone size={15} /> {t('prod_call_btn')}
              </a>
              <a href="https://wa.me/84385737705" target="_blank" rel="noreferrer" className="btn3d btn3d-green btn-full" style={{ textAlign: 'center', marginTop: 8 }}>
                💬 {t('whatsapp_btn')} 0385.737.705
              </a>
            </form>
          </div>
        </div>
      )}

      {demoOpen && (
        <div className="modal-backdrop" onClick={() => setDemoOpen(false)}>
          <div className="modal modal-large" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setDemoOpen(false)}>✕</button>
            <h2 className="modal-title">🌾 Nhật ký nông dân và truy xuất nguồn gốc</h2>
            <p className="modal-hint">Khách chỉ cần nhập mã lô để xem ai làm, làm ngày nào, ở đâu và có bằng chứng gì.</p>

            <div className="login-form">
              <input
                className="form-input"
                value={traceQuery}
                onChange={e => setTraceQuery(e.target.value)}
                placeholder="Nhập mã lô để truy xuất, ví dụ: HG-VH-2005-01"
              />

              {displayLot ? (
                <div className="card3d" style={{ transform: 'none' }}>
                  <div className="card3d-body" style={{ gap: 8 }}>
                    <strong className="card3d-title">{displayLot.product} - {displayLot.lotCode}</strong>
                    <span className="card3d-desc">🏡 Nông trại: {displayLot.farmName}</span>
                    <span className="card3d-desc">👨‍🌾 Nông dân: {displayLot.farmer}</span>
                    <span className="card3d-desc">📍 GPS: {displayLot.gps}</span>
                    <span className="card3d-desc">🌿 Diện tích/Quy mô: {displayLot.area}</span>
                    <span className="card3d-desc">🧺 Thu hoạch: {displayLot.harvestedAt}</span>
                    <span className="card3d-desc">🚚 Dự kiến xuất bán: {displayLot.plannedSellDate}</span>
                    <span className="card3d-desc">⏳ Còn khoảng: {getDaysToSell(displayLot.plannedSellDate) ?? 'N/A'} ngày để xuất bán</span>
                    <span className="card3d-desc">📦 Sản lượng dự kiến: {displayLot.expectedOutput}</span>
                    <span className="card3d-desc">📘 Tiêu chuẩn phát triển: {displayLot.standard}</span>
                    <span className="card3d-desc">✅ Kiểm chứng: {displayLot.verified}</span>

                    {displayLot.farmName === 'Nông trại Trường Hải' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <strong style={{ fontSize: 14 }}>📷 Ảnh minh chứng (thí điểm Nông trại Trường Hải)</strong>
                        <input
                          className="form-input"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => addLotImages(displayLot.id, e.target.files)}
                        />
                        <span className="card3d-desc">Đã tải: {lotImageList(displayLot.id).length} ảnh</span>
                      </div>
                    )}

                    {displayLot.type === 'livestock' && (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <span className="card3d-desc" style={{ width: '100%' }}>💉 Tiêm phòng:</span>
                        <button
                          type="button"
                          className={vaccinationState[displayLot.id] === true ? 'btn3d btn3d-green btn-sm' : 'btn3d btn3d-blue btn-sm'}
                          onClick={() => setVaccination(displayLot.id, true)}
                        >
                          Có
                        </button>
                        <button
                          type="button"
                          className={vaccinationState[displayLot.id] === false ? 'btn3d btn3d-red btn-sm' : 'btn3d btn3d-orange btn-sm'}
                          onClick={() => setVaccination(displayLot.id, false)}
                        >
                          Không
                        </button>
                      </div>
                    )}
                    <button
                      type="button"
                      className={isLotAlerted(displayLot.id) ? 'btn3d btn3d-red btn-sm' : 'btn3d btn3d-orange btn-sm'}
                      onClick={() => toggleSaleAlert(displayLot)}
                    >
                      {isLotAlerted(displayLot.id) ? 'Đã bật cảnh báo xuất bán' : 'Cảnh báo sắp xuất bán'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="empty-state" style={{ marginTop: 6 }}>
                  Không tìm thấy mã lô. Thử mã: HG-VH-2005-01
                </div>
              )}

              <div className="cards-grid" style={{ marginTop: 8 }}>
                <article className="card3d" style={{ transform: 'none' }}>
                  <div className="card3d-body" style={{ gap: 6 }}>
                    <strong className="card3d-title">Nhật ký thời tiết vùng nuôi/trồng</strong>
                    <span className="card3d-desc">🌧️ Lượng mưa 7 ngày: {displayLot.weather?.rain7dMm ?? 'N/A'} mm</span>
                    <span className="card3d-desc">☀️ Số ngày khô liên tiếp: {displayLot.weather?.dryDays ?? 'N/A'} ngày</span>
                    <span className="card3d-desc">🌊 Mực nước mặt ruộng/chuồng: {displayLot.weather?.waterLevelCm ?? 'N/A'} cm</span>
                    <span className="card3d-desc">📡 Cách đo: {displayLot.weather?.source || 'Trạm đo địa phương + nhật ký nông dân'}</span>
                    <span className="card3d-desc" style={{ color: '#b45309' }}>⚠️ {getWeatherWarning(displayLot.weather)}</span>
                  </div>
                </article>

                {lotImageList(displayLot.id).length > 0 && (
                  <article className="card3d" style={{ transform: 'none' }}>
                    <div className="card3d-body" style={{ gap: 6 }}>
                      <strong className="card3d-title">Ảnh minh chứng đã tải</strong>
                      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))' }}>
                        {lotImageList(displayLot.id).map((img) => (
                          <div key={img.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <img src={img.url} alt={img.name} style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 10 }} />
                            <span style={{ fontSize: 11, color: '#64748b' }}>{img.addedAt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                )}

                {displayLot.logs.map((log) => (
                  <article key={`${displayLot.id}-${log.date}-${log.task}`} className="card3d" style={{ transform: 'none' }}>
                    <div className="card3d-body" style={{ gap: 6 }}>
                      <strong className="card3d-title">{log.date}</strong>
                      <span className="card3d-desc">{log.task}</span>
                      <span className="card3d-desc">Bằng chứng: {log.proof}</span>
                    </div>
                  </article>
                ))}
              </div>

              <button className="btn3d btn3d-green btn-full" onClick={() => setDemoOpen(false)}>
                Đã xem demo
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container py-section">
        <div className="page-toolbar">
          <div className="search-box"><Search size={17} color="#94a3b8" />
            <input placeholder={t('prod_search')} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {isMod && <button className="btn3d btn3d-green btn-sm" onClick={() => setAdminModal('product')}><Plus size={15} /> {t('prod_add')}</button>}
        </div>

        <section style={{ marginTop: 16, marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
            <h2 style={{ marginBottom: 0 }}>Sản phẩm số cho nông nghiệp</h2>
            <button className="btn3d btn3d-blue btn-sm" onClick={() => setDemoOpen(true)}>Xem nhật ký thật</button>
          </div>
          <p style={{ color: '#475569', marginBottom: 14 }}>
            Làm thật, ăn thật: mỗi nông phẩm có mã lô, người làm, vị trí GPS, hình ảnh và lịch sử công việc để khách tự kiểm tra.
          </p>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            {DIGITAL_AGRI_CAPABILITIES.map((label) => (
              <span key={label} className="shop387-tab">{label}</span>
            ))}
          </div>

          <div className="cards-grid" style={{ marginBottom: 14 }}>
            <article className="card3d" style={{ transform: 'none' }}>
              <div className="card3d-body" style={{ gap: 8 }}>
                <strong className="card3d-title">Thay vì</strong>
                <span className="card3d-desc">Ghi sổ tay</span>
                <span className="card3d-desc">Nhớ bằng kinh nghiệm</span>
                <span className="card3d-desc">Bán truyền miệng</span>
              </div>
            </article>
            <article className="card3d" style={{ transform: 'none' }}>
              <div className="card3d-body" style={{ gap: 8 }}>
                <strong className="card3d-title">Thì sẽ</strong>
                <span className="card3d-desc">Lưu bằng dữ liệu</span>
                <span className="card3d-desc">Quản lý bằng GPS, hình ảnh, dashboard</span>
                <span className="card3d-desc">Theo dõi, dự báo và bán hàng theo số liệu</span>
              </div>
            </article>
          </div>

          <div className="cards-grid">
            {FARM_TRACE_LOTS.map((item) => (
              <article key={item.id} className="card3d" style={{ transform: 'none' }}>
                <div className="card3d-body" style={{ gap: 10 }}>
                  <strong className="card3d-title">{item.product}</strong>
                  <p className="card3d-desc">Mã lô: {item.lotCode}</p>
                  <span className="card3d-desc">Nông trại: {item.farmName}</span>
                  <span className="card3d-desc">Nông dân: {item.farmer}</span>
                  <span className="card3d-desc">GPS: {item.gps}</span>
                  <span className="card3d-desc">Dự kiến xuất bán: {item.plannedSellDate}</span>
                  <span className="card3d-desc">Còn khoảng: {getDaysToSell(item.plannedSellDate) ?? 'N/A'} ngày</span>
                  <span className="card3d-desc">Sản lượng dự kiến: {item.expectedOutput}</span>
                  <span className="card3d-desc">Tiêu chuẩn: {item.standard}</span>
                  <span className="card3d-desc">Kiểm chứng: {item.verified}</span>

                  {item.farmName === 'Nông trại Trường Hải' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <span className="card3d-desc">📷 Up ảnh minh chứng (thí điểm)</span>
                      <input
                        className="form-input"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => addLotImages(item.id, e.target.files)}
                      />
                      <span className="card3d-desc">Đã tải: {lotImageList(item.id).length} ảnh</span>
                    </div>
                  )}

                  {item.type === 'livestock' && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span className="card3d-desc" style={{ width: '100%' }}>Tiêm phòng:</span>
                      <button
                        type="button"
                        className={vaccinationState[item.id] === true ? 'btn3d btn3d-green btn-sm' : 'btn3d btn3d-blue btn-sm'}
                        onClick={() => setVaccination(item.id, true)}
                      >
                        Có
                      </button>
                      <button
                        type="button"
                        className={vaccinationState[item.id] === false ? 'btn3d btn3d-red btn-sm' : 'btn3d btn3d-orange btn-sm'}
                        onClick={() => setVaccination(item.id, false)}
                      >
                        Không
                      </button>
                    </div>
                  )}
                  <button
                    type="button"
                    className={isLotAlerted(item.id) ? 'btn3d btn3d-red btn-sm' : 'btn3d btn3d-green btn-sm'}
                    onClick={() => toggleSaleAlert(item)}
                  >
                    {isLotAlerted(item.id) ? 'Đã bật cảnh báo xuất bán' : 'Cảnh báo sắp xuất bán'}
                  </button>
                  <button
                    className="btn3d btn3d-orange btn-sm"
                    onClick={() => {
                      setActiveLotId(item.id)
                      setTraceQuery(item.lotCode)
                      setDemoOpen(true)
                    }}
                  >
                    Truy xuất lô này
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="cards-grid mt-6">
          {filtered.map(p => (
            <ProductCard key={p.id} item={p} isMod={isMod} isAdmin={isAdmin} t={t}
              onOrder={setOrderItem}
              onAddCart={item => { addToCart(item); addStamp('product'); showToast(t('prod_added_cart').replace('{title}', item.title)) }}
              onView={setDetailItem}
              onEdit={item => setEditItem({ type: 'product', item })}
              onDelete={(type, id) => { deleteItem(type, id); showToast(t('prod_deleted')) }} />
          ))}
          {filtered.length === 0 && (
            <div className="empty-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <p>{t('prod_no_result')}</p>
              <Link to="/shop387" className="btn3d btn3d-orange btn-sm">
                Xem bán trong thành phố
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
