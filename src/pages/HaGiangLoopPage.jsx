import { useState, useEffect } from 'react'
import { MapPin, Clock, Users, Star, Check, X, Phone, ChevronDown, ChevronUp, Calendar, Shield, Camera, Mountain } from 'lucide-react'
import { useUI } from '../context/UIContext'
import { usePassport } from '../context/PassportContext'

/* ── 3D2N Itinerary ─────────────────────────────────── */
const ITINERARY_3D = [
    {
        day: 'Ngày 1', dayEn: 'Day 1',
        title: 'Hà Giang → Quản Bạ → Yên Minh',
        titleEn: 'Ha Giang → Quan Ba → Yen Minh',
        icon: '🌄', color: '#16a34a',
        img: 'https://images.pexels.com/photos/27568660/pexels-photo-27568660.jpeg?auto=compress&cs=tinysrgb&w=700',
        highlights: ['Cổng trời Quản Bạ', 'Núi Đôi huyền thoại', 'Cao nguyên đá', 'Bản người Mông'],
        highlightsEn: ["Quan Ba Heaven Gate", "Twin Mountains", "Rock Plateau", "H'Mong Village"],
        desc: 'Khởi hành sáng sớm từ TP Hà Giang theo QL4C lên cổng trời Quản Bạ — ngắm Núi Đôi từ trên cao. Tiếp tục vào Yên Minh qua vô số khúc cua núi uốn lượn, tối ngủ tại homestay địa phương.',
        descEn: "Early morning departure from Ha Giang along QL4C to Quan Ba Heaven Gate — panoramic views of the famous Twin Mountains. Continue to Yen Minh through winding mountain roads. Overnight at a local homestay.",
        meal: 'Trưa + Tối / Lunch + Dinner',
        hotel: 'Homestay Yên Minh',
    },
    {
        day: 'Ngày 2', dayEn: 'Day 2',
        title: 'Yên Minh → Đồng Văn → Mèo Vạc',
        titleEn: 'Yen Minh → Dong Van → Meo Vac',
        icon: '🏔️', color: '#d97706',
        img: 'https://images.pexels.com/photos/35792511/pexels-photo-35792511.jpeg?auto=compress&cs=tinysrgb&w=700',
        highlights: ['Phố cổ Đồng Văn', 'Dinh họ Vương', 'Đèo Mã Pí Lèng', 'Hẻm Tu Sản'],
        highlightsEn: ['Dong Van Old Quarter', 'Vuong Palace', 'Ma Pi Leng Pass', 'Tu San Canyon'],
        desc: 'Sáng ghé phố cổ Đồng Văn và Dinh họ Vương — kiến trúc độc đáo của người H\'Mông. Chiều vượt Mã Pí Lèng — tứ đại đỉnh đèo Việt Nam — nhìn xuống hẻm Tu Sản sâu 700m. Tối tại Mèo Vạc.',
        descEn: "Morning visit to Dong Van old quarter and Vuong Palace — unique H'Mong architecture. Afternoon conquering Ma Pi Leng Pass — one of Vietnam's 4 legendary passes — overlooking the 700m deep Tu San Canyon. Overnight Meo Vac.",
        meal: 'Sáng + Trưa + Tối / Breakfast + Lunch + Dinner',
        hotel: 'Khách sạn Mèo Vạc',
    },
    {
        day: 'Ngày 3', dayEn: 'Day 3',
        title: 'Mèo Vạc → Du Già → Hà Giang',
        titleEn: 'Meo Vac → Du Gia → Ha Giang',
        icon: '🌿', color: '#2563eb',
        img: 'https://images.pexels.com/photos/10077653/pexels-photo-10077653.jpeg?auto=compress&cs=tinysrgb&w=700',
        highlights: ['Ruộng bậc thang Du Già', 'Suối Tiên Du Già', 'Làng văn hóa', 'Về TP Hà Giang'],
        highlightsEn: ['Du Gia Rice Terraces', 'Du Gia Stream', 'Ethnic Village', 'Return Ha Giang'],
        desc: 'Sáng thăm ruộng bậc thang Du Già xanh mướt, tắm suối Tiên trong mát giữa rừng. Chiều qua làng văn hóa mua đặc sản: mật ong bạc hà, chè shan tuyết, thổ cẩm. Về lại TP Hà Giang chiều tối.',
        descEn: "Morning at Du Gia lush rice terraces and a refreshing swim in Du Gia stream amid the forest. Afternoon through ethnic villages — shop for buckwheat honey, Shan Tuyet tea, hand-embroidered brocade. Return to Ha Giang by late afternoon.",
        meal: 'Sáng + Trưa / Breakfast + Lunch',
        hotel: 'Về TP Hà Giang / Return Ha Giang',
    },
]

/* ── 4D3N Itinerary ─────────────────────────────────── */
const ITINERARY_4D = [
    {
        day: 'Ngày 1', dayEn: 'Day 1',
        title: 'Hà Giang → Quản Bạ → Yên Minh',
        titleEn: 'Ha Giang → Quan Ba → Yen Minh',
        icon: '🌄', color: '#16a34a',
        img: 'https://images.pexels.com/photos/27568660/pexels-photo-27568660.jpeg?auto=compress&cs=tinysrgb&w=700',
        highlights: ['Cổng trời Quản Bạ', 'Núi Đôi huyền thoại', 'Cao nguyên đá', 'Bản người Mông'],
        highlightsEn: ["Quan Ba Heaven Gate", "Twin Mountains", "Rock Plateau", "H'Mong Village"],
        desc: 'Khởi hành sáng sớm từ TP Hà Giang theo QL4C lên cổng trời Quản Bạ — ngắm Núi Đôi từ trên cao. Tiếp tục vào Yên Minh qua vô số khúc cua núi uốn lượn, tối ngủ tại homestay địa phương.',
        descEn: "Early morning departure from Ha Giang along QL4C to Quan Ba Heaven Gate — panoramic views of the famous Twin Mountains. Continue to Yen Minh through winding mountain roads. Overnight at a local homestay.",
        meal: 'Trưa + Tối / Lunch + Dinner',
        hotel: 'Homestay Yên Minh',
    },
    {
        day: 'Ngày 2', dayEn: 'Day 2',
        title: 'Yên Minh → Lũng Cú → Đồng Văn',
        titleEn: 'Yen Minh → Lung Cu → Dong Van',
        icon: '🏴', color: '#7c3aed',
        img: 'https://images.pexels.com/photos/15997684/pexels-photo-15997684.jpeg?auto=compress&cs=tinysrgb&w=700',
        highlights: ['Cột cờ Lũng Cú', 'Điểm cực Bắc Việt Nam', 'Phố cổ Đồng Văn', 'Dinh họ Vương'],
        highlightsEn: ['Lung Cu Flag Tower', "Vietnam's Northernmost Point", 'Dong Van Old Quarter', 'Vuong Palace'],
        desc: 'Buổi sáng chinh phục cột cờ Lũng Cú — điểm cực Bắc Việt Nam trên đỉnh núi Rồng 1.470m — phóng tầm mắt sang đất Trung Quốc. Chiều xuống phố cổ Đồng Văn, thăm Dinh họ Vương kiến trúc H\'Mông độc đáo. Tối tại Đồng Văn.',
        descEn: "Morning conquering Lung Cu Flag Tower — Vietnam's northernmost point on 1,470m Dragon Mountain — with views into China. Afternoon down to Dong Van Old Quarter and the unique H'Mong Vuong Palace. Overnight Dong Van.",
        meal: 'Sáng + Trưa + Tối / Breakfast + Lunch + Dinner',
        hotel: 'Homestay Đồng Văn',
    },
    {
        day: 'Ngày 3', dayEn: 'Day 3',
        title: 'Đồng Văn → Đèo Mã Pí Lèng → Mèo Vạc',
        titleEn: 'Dong Van → Ma Pi Leng Pass → Meo Vac',
        icon: '🏔️', color: '#d97706',
        img: 'https://images.pexels.com/photos/35792511/pexels-photo-35792511.jpeg?auto=compress&cs=tinysrgb&w=700',
        highlights: ['Đèo Mã Pí Lèng', 'Hẻm Tu Sản 700m', 'Chợ Mèo Vạc', 'Hoàng hôn cao nguyên'],
        highlightsEn: ['Ma Pi Leng Pass', '700m Tu San Canyon', 'Meo Vac Market', 'Highland Sunset'],
        desc: 'Vượt đèo Mã Pí Lèng — "đệ nhất hùng quan" Đông Nam Á — với những khúc cua tay áo bên vực thẳm. Dừng nhìn xuống hẻm Tu Sản — hẻm vực sâu nhất Đông Nam Á. Tối thăm chợ đêm Mèo Vạc, thưởng thức thắng cố.',
        descEn: "Traverse Ma Pi Leng Pass — Southeast Asia's greatest mountain road — with hairpin bends over sheer cliffs. Stop to gaze into Tu San Canyon — SEA's deepest gorge. Evening at Meo Vac night market, taste the local Thang Co stew.",
        meal: 'Sáng + Trưa + Tối / Breakfast + Lunch + Dinner',
        hotel: 'Khách sạn Mèo Vạc',
    },
    {
        day: 'Ngày 4', dayEn: 'Day 4',
        title: 'Mèo Vạc → Du Già → Hà Giang',
        titleEn: 'Meo Vac → Du Gia → Ha Giang',
        icon: '🌿', color: '#2563eb',
        img: 'https://images.pexels.com/photos/10077653/pexels-photo-10077653.jpeg?auto=compress&cs=tinysrgb&w=700',
        highlights: ['Ruộng bậc thang Du Già', 'Suối Tiên Du Già', 'Làng văn hóa', 'Kết thúc hành trình'],
        highlightsEn: ['Du Gia Rice Terraces', 'Du Gia Stream', 'Ethnic Village', 'End of Tour'],
        desc: 'Sáng thăm ruộng bậc thang Du Già xanh mướt, tắm suối Tiên trong mát giữa rừng. Chiều mua đặc sản: mật ong bạc hà, chè shan tuyết, thổ cẩm thêu tay. Về lại TP Hà Giang, kết thúc hành trình.',
        descEn: "Morning at Du Gia lush rice terraces and a refreshing swim in Du Gia stream amid the forest. Afternoon shop for local specialties: buckwheat honey, Shan Tuyet tea, hand-embroidered brocade. Return to Ha Giang — end of tour.",
        meal: 'Sáng + Trưa / Breakfast + Lunch',
        hotel: 'Về TP Hà Giang / Return Ha Giang',
    },
]

/* ── Includes / Excludes ─────────────────────────────── */
const INCLUDES = [
    { icon: '🏍️', text: 'Easy Rider guide lái xe + xe máy bản địa', en: 'Local Easy Rider guide (driver) + motorbike' },
    { icon: '🏨', text: 'Homestay/khách sạn 2–3★ (số đêm theo gói)', en: 'Homestay/hotel 2–3★ (nights per package)' },
    { icon: '🍽️', text: 'Bữa ăn theo chương trình (7 bữa/3N·10 bữa/4N)', en: 'Meals per itinerary (7 meals/3D · 10 meals/4D)' },
    { icon: '🧭', text: 'Hướng dẫn viên địa phương song ngữ Việt–Anh', en: 'Bilingual (VN–EN) local Easy Rider guide' },
    { icon: '🎫', text: 'Vé tham quan: Dinh họ Vương, Núi Đôi, Lũng Cú', en: 'Entrance fees: Vuong Palace, Twin Mountains, Lung Cu' },
    { icon: '⛑️', text: 'Mũ bảo hiểm đủ tiêu chuẩn', en: 'Full-face helmets provided' },
    { icon: '💊', text: 'Bảo hiểm du lịch cơ bản', en: 'Basic travel insurance' },
    { icon: '📸', text: 'Hỗ trợ chụp ảnh tại các điểm đẹp', en: 'Photo assistance at all scenic stops' },
]

const EXCLUDES = [
    { vn: 'Vé xe/máy bay đến TP Hà Giang', en: 'Transport to/from Ha Giang city' },
    { vn: 'Đồ uống và chi tiêu cá nhân', en: 'Drinks and personal expenses' },
    { vn: 'Tiền tip hướng dẫn viên (tự nguyện)', en: 'Guide tip (voluntary)' },
    { vn: 'Chi phí phát sinh ngoài chương trình', en: 'Extra costs outside the itinerary' },
]

/* ── Gallery ─────────────────────────────────────────── */
const GALLERY_FALLBACK = [
    { src: 'https://images.pexels.com/photos/35792511/pexels-photo-35792511.jpeg?auto=compress&cs=tinysrgb&w=900', caption: 'Đèo Mã Pí Lèng / Ma Pi Leng Pass' },
    { src: 'https://images.pexels.com/photos/10077653/pexels-photo-10077653.jpeg?auto=compress&cs=tinysrgb&w=900', caption: 'Ruộng bậc thang Hà Giang / Rice Terraces' },
    { src: 'https://images.pexels.com/photos/36582384/pexels-photo-36582384.jpeg?auto=compress&cs=tinysrgb&w=900', caption: "Phụ nữ H'Mông / H'Mong Women" },
    { src: 'https://images.pexels.com/photos/22028921/pexels-photo-22028921.jpeg?auto=compress&cs=tinysrgb&w=900', caption: 'Làng bản Hà Giang / Ha Giang Village' },
    { src: 'https://images.pexels.com/photos/27568660/pexels-photo-27568660.jpeg?auto=compress&cs=tinysrgb&w=900', caption: 'Thung lũng Hà Giang / Ha Giang Valley' },
    { src: 'https://images.pexels.com/photos/15997684/pexels-photo-15997684.jpeg?auto=compress&cs=tinysrgb&w=900', caption: 'Cột cờ Lũng Cú / Lung Cu Flag Tower' },
]

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/* ── FAQ ─────────────────────────────────────────────── */
const FAQ = [
    {
        q: 'Easy Rider là gì? Tôi có phải lái xe không?',
        en_q: 'What is Easy Rider? Do I need to ride a motorbike?',
        a: 'Easy Rider là hình thức du lịch xe máy truyền thống — bạn ngồi sau hướng dẫn viên bản địa (người Mông/Tày), họ lái xe và dẫn đường. Bạn không cần bằng lái hay kinh nghiệm lái xe máy. Nếu muốn tự lái, có thể thuê xe bán số riêng (thêm phí).',
        en_a: "Easy Rider is a traditional motorbike touring style — you ride pillion behind a local H'Mong/Tay guide who drives and navigates. No license or experience needed. Prefer to self-ride? A semi-automatic motorbike rental is available at extra cost.",
    },
    {
        q: '3 ngày 2 đêm hay 4 ngày 3 đêm — nên chọn gói nào?',
        en_q: '3D2N or 4D3N — which package to choose?',
        a: '3N2Đ phù hợp nếu thời gian hạn chế — vẫn đủ thấy Mã Pí Lèng, Đồng Văn, Mèo Vạc. 4N3Đ thêm Lũng Cú (điểm cực Bắc), ngủ thêm 1 đêm tại Đồng Văn, tận hưởng mỗi điểm dừng thoải mái hơn. Khuyên chọn 4N nếu có thể!',
        en_a: "3D2N is great if time is tight — still covers Ma Pi Leng, Dong Van & Meo Vac. 4D3N adds Lung Cu (Vietnam's northernmost point), an extra night in Dong Van, and a more relaxed pace. We recommend 4D if you can spare the time!",
    },
    {
        q: 'Thời điểm đẹp nhất để đi Hà Giang Loop?',
        en_q: 'Best time to visit Ha Giang Loop?',
        a: 'Tháng 10–11 (hoa tam giác mạch tím) và tháng 3–4 (hoa lê, đào trắng) là đỉnh nhất. Tháng 6–8 ruộng bậc thang xanh mướt cũng rất ấn tượng. Tránh tháng 1–2 (rét đậm, sương mù dày).',
        en_a: 'Oct–Nov (purple buckwheat blossoms) and Mar–Apr (white pear & peach blooms) are most spectacular. Jun–Aug offers lush green rice terraces. Avoid Jan–Feb — heavy fog and cold.',
    },
    {
        q: 'Tour có phù hợp với gia đình có trẻ nhỏ không?',
        en_q: 'Is the tour suitable for families with young children?',
        a: 'Với Easy Rider ngồi sau, trẻ từ 8 tuổi trở lên có thể tham gia cùng phụ huynh. Đường núi nhiều khúc cua nên cần trẻ đã quen đi xe. Nếu muốn an toàn hơn, có thể đặt gói xe ô tô 7 chỗ riêng (liên hệ báo giá).',
        en_a: 'For Easy Rider (pillion), children 8+ can join with a parent. Mountain roads have many sharp bends, so the child should be comfortable on motorcycles. For maximum safety, a private 7-seat car option is available — contact us for pricing.',
    },
    {
        q: 'Đặt cọc và hủy tour như thế nào?',
        en_q: 'Deposit & cancellation policy?',
        a: 'Đặt cọc 30% qua chuyển khoản để giữ chỗ. Hủy trước 7 ngày: hoàn 100%. Hủy trước 3 ngày: hoàn 50%. Hủy trong 3 ngày: không hoàn cọc.',
        en_a: '30% deposit by bank transfer to confirm your booking. Cancel 7+ days ahead: full refund. Cancel 3–6 days: 50% refund. Cancel within 3 days: no refund.',
    },
]

/* ── BookingForm ─────────────────────────────────────── */
function BookingForm({ tourType, onSuccess }) {
    const price = tourType === '4d3n' ? 4500000 : 4000000
    const [form, setForm] = useState({ name: '', phone: '', date: '', guests: 1, note: '' })
    const [loading, setLoading] = useState(false)

    const submit = (e) => {
        e.preventDefault()
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            onSuccess(form)
        }, 600)
    }

    return (
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
                className="form-input"
                placeholder="Họ và tên / Full name *"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
            />
            <input
                className="form-input"
                placeholder="Số điện thoại / Phone number *"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value.replace(/[^0-9+]/g, '') })}
                required
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input
                    className="form-input"
                    type="date"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    required
                />
                <select
                    className="form-input"
                    value={form.guests}
                    onChange={e => setForm({ ...form, guests: Number(e.target.value) })}
                >
                    {[1, 2, 3, 4, 5, 6].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'khách / person' : 'khách / people'}</option>
                    ))}
                </select>
            </div>
            <textarea
                className="form-input form-textarea"
                placeholder="Ghi chú / Notes (special requests, allergies, self-ride preference...)"
                value={form.note}
                onChange={e => setForm({ ...form, note: e.target.value })}
                rows={3}
            />
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#166534' }}>
                💰 Dự kiến / Estimate: <strong>{(price * form.guests).toLocaleString('vi-VN')}đ</strong>
                <span style={{ color: '#64748b', marginLeft: 6 }}>({form.guests} × {price.toLocaleString('vi-VN')}đ)</span>
            </div>
            <button type="submit" className="btn3d btn3d-orange btn-full" disabled={loading}>
                {loading ? '⏳ Đang gửi... / Sending...' : <><Calendar size={15} /> Đặt Tour / Book Now</>}
            </button>
            <a href="tel:0385737705" className="btn3d btn3d-blue btn-full" style={{ textAlign: 'center' }}>
                <Phone size={15} /> Gọi tư vấn / Call: 0385.737.705
            </a>
        </form>
    )
}

/* ── FaqItem ─────────────────────────────────────────── */
function FaqItem({ item }) {
    const [open, setOpen] = useState(false)
    return (
        <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', marginBottom: 8 }}>
            <button
                onClick={() => setOpen(o => !o)}
                style={{
                    width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', padding: '14px 18px', background: open ? '#f0fdf4' : '#fff',
                    border: 'none', cursor: 'pointer', gap: 10,
                }}
            >
                <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b', lineHeight: 1.4 }}>{item.q}</div>
                    <div style={{ fontWeight: 500, fontSize: 12, color: '#94a3b8', marginTop: 2, fontStyle: 'italic' }}>{item.en_q}</div>
                </div>
                {open
                    ? <ChevronUp size={18} color="#16a34a" style={{ flexShrink: 0, marginTop: 3 }} />
                    : <ChevronDown size={18} color="#94a3b8" style={{ flexShrink: 0, marginTop: 3 }} />}
            </button>
            {open && (
                <div style={{ padding: '0 18px 14px' }}>
                    <div style={{ fontSize: 14, color: '#334155', lineHeight: 1.7, marginBottom: 8 }}>{item.a}</div>
                    <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, fontStyle: 'italic', borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>{item.en_a}</div>
                </div>
            )}
        </div>
    )
}

/* ── Main Page ───────────────────────────────────────── */
export default function HaGiangLoopPage() {
    const { showToast } = useUI()
    const { addStamp } = usePassport()
    const [bookingDone, setBookingDone] = useState(false)
    const [galleryIdx, setGalleryIdx] = useState(null)
    const [tourType, setTourType] = useState('3d2n') // '3d2n' | '4d3n'
    const [gallery, setGallery] = useState(GALLERY_FALLBACK)

    useEffect(() => {
        fetch(`${API}/api/site-images`)
            .then(r => r.json())
            .then(arr => {
                if (!Array.isArray(arr)) return
                const slotMap = {}
                arr.forEach(img => { if (img.url) slotMap[img.slot] = img })
                setGallery(GALLERY_FALLBACK.map((g, i) => {
                    const slotImg = slotMap[`hg-gallery-${i + 1}`]
                    return slotImg ? { src: slotImg.url, caption: slotImg.caption || g.caption } : g
                }))
            })
            .catch(() => { })
    }, [])

    const itinerary = tourType === '4d3n' ? ITINERARY_4D : ITINERARY_3D
    const price = tourType === '4d3n' ? 4500000 : 4000000
    const oldPrice = tourType === '4d3n' ? 5500000 : 4800000
    const nights = tourType === '4d3n' ? '4 Ngày 3 Đêm' : '3 Ngày 2 Đêm'
    const nightsEn = tourType === '4d3n' ? '4 Days 3 Nights' : '3 Days 2 Nights'

    const handleBookingSuccess = (form) => {
        addStamp('tour')
        setBookingDone(true)
        showToast(`✅ Đã nhận yêu cầu đặt tour! Admin sẽ liên hệ ${form.phone} sớm.`)
    }

    return (
        <div className="page-enter">

            {/* ── HERO ── */}
            <section style={{
                position: 'relative', minHeight: 500,
                background: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #1a3a2a 100%)',
                display: 'flex', alignItems: 'center', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

                <div className="container" style={{ position: 'relative', zIndex: 1, padding: '60px 24px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'center' }}>

                        {/* Left: text */}
                        <div style={{ flex: '1 1 320px' }}>
                            <span style={{
                                display: 'inline-block', background: 'rgba(255,255,255,0.12)', color: '#6ee7b7',
                                border: '1px solid rgba(110,231,183,0.3)', borderRadius: 999, padding: '4px 14px',
                                fontSize: 13, fontWeight: 700, marginBottom: 16, backdropFilter: 'blur(8px)',
                            }}>
                                🗺️ HTX Trường Hải · Hà Giang
                            </span>
                            <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem,5vw,3rem)', fontWeight: 900, margin: '0 0 6px', lineHeight: 1.1 }}>
                                Hà Giang Loop
                            </h1>
                            <div style={{ color: '#34d399', fontSize: 'clamp(1rem,3vw,1.5rem)', fontWeight: 900, marginBottom: 4 }}>
                                {nights}
                            </div>
                            <div style={{ color: '#6ee7b7', fontSize: 'clamp(0.85rem,2vw,1rem)', fontWeight: 600, marginBottom: 18, fontStyle: 'italic' }}>
                                Easy Rider Motorbike Tour · {nightsEn}
                            </div>
                            <p style={{ color: '#a7f3d0', fontSize: 15, lineHeight: 1.7, margin: '0 0 4px', maxWidth: 480 }}>
                                🏍️ Ngồi sau hướng dẫn viên bản địa người Mông — chinh phục Mã Pí Lèng, phố cổ Đồng Văn, ruộng bậc thang Du Già trên yên xe máy.
                            </p>
                            <p style={{ color: '#6ee7b7', fontSize: 13, lineHeight: 1.6, margin: '0 0 22px', maxWidth: 480, fontStyle: 'italic' }}>
                                Ride pillion with a local H'Mong Easy Rider guide — conquer Ma Pi Leng Pass, Dong Van Old Town & terraced rice fields by motorbike.
                            </p>

                            {/* Tour type selector */}
                            <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
                                {[
                                    { id: '3d2n', label: '3 Ngày 2 Đêm', sub: '3D2N · 3.200.000đ/người' },
                                    { id: '4d3n', label: '4 Ngày 3 Đêm', sub: '4D3N · 4.200.000đ/người — Thêm Lũng Cú' },
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setTourType(opt.id)}
                                        style={{
                                            flex: 1, padding: '10px 12px', borderRadius: 12, textAlign: 'left',
                                            border: tourType === opt.id ? '2px solid #34d399' : '2px solid rgba(255,255,255,0.18)',
                                            background: tourType === opt.id ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.05)',
                                            color: tourType === opt.id ? '#34d399' : '#a7f3d0',
                                            cursor: 'pointer', transition: 'all 0.2s',
                                        }}
                                    >
                                        <div style={{ fontWeight: 800, fontSize: 13 }}>{opt.label}</div>
                                        <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>{opt.sub}</div>
                                    </button>
                                ))}
                            </div>

                            {/* Stats */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 20px', marginBottom: 24 }}>
                                {[
                                    { icon: <Clock size={14} />, text: nights },
                                    { icon: <Users size={14} />, text: '1 khách / 1 Easy Rider' },
                                    { icon: <MapPin size={14} />, text: 'Khởi hành Hà Giang' },
                                    { icon: <Star size={14} fill="currentColor" />, text: '4.9 / 5 ★' },
                                ].map((s, i) => (
                                    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#d1fae5', fontSize: 13, fontWeight: 600 }}>
                                        {s.icon} {s.text}
                                    </span>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                <a href="#booking" className="btn3d btn3d-orange" style={{ textDecoration: 'none' }}
                                    onClick={e => { e.preventDefault(); document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }) }}>
                                    <Calendar size={15} /> Đặt Tour / Book Now
                                </a>
                                <a href="tel:0385737705" className="btn3d btn3d-blue" style={{ textDecoration: 'none' }}>
                                    <Phone size={15} /> Gọi / Call
                                </a>
                            </div>
                        </div>

                        {/* Right: Price card */}
                        <div style={{
                            flex: '1 1 250px', maxWidth: 300, background: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20,
                            padding: 26, backdropFilter: 'blur(12px)', textAlign: 'center',
                        }}>
                            <div style={{ color: '#9ca3af', textDecoration: 'line-through', fontSize: 14, marginBottom: 4 }}>
                                {oldPrice.toLocaleString('vi-VN')}đ
                            </div>
                            <div style={{ color: '#34d399', fontSize: 34, fontWeight: 900, lineHeight: 1.1 }}>
                                {price.toLocaleString('vi-VN')}đ
                            </div>
                            <div style={{ color: '#a7f3d0', fontSize: 12, marginBottom: 4 }}>/người · per person</div>
                            <div style={{ color: '#6ee7b7', fontSize: 12, fontStyle: 'italic', marginBottom: 16 }}>
                                {nightsEn} Easy Rider
                            </div>
                            <div style={{
                                background: '#dc2626', color: '#fff', borderRadius: 999,
                                padding: '4px 12px', fontSize: 12, fontWeight: 800, display: 'inline-block', marginBottom: 18,
                            }}>
                                🔥 Ưu đãi mùa hè / Summer Deal
                            </div>
                            <div style={{ color: '#d1fae5', fontSize: 13, lineHeight: 2, textAlign: 'left' }}>
                                <div>✅ Easy Rider guide + xe máy</div>
                                <div>✅ Ăn, ngủ trọn gói</div>
                                <div>✅ HDV song ngữ Việt–Anh</div>
                                <div>✅ Vé tham quan + bảo hiểm</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── QUICK STATS BAR ── */}
            <div style={{ background: '#16a34a', padding: '14px 0' }}>
                <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px 28px' }}>
                    {[
                        { icon: <Mountain size={15} />, label: '12+ điểm / 12+ stops' },
                        { icon: <Camera size={15} />, label: 'Vô số góc ảnh đẹp / Countless photo ops' },
                        { icon: <Shield size={15} />, label: 'Bảo hiểm đầy đủ / Fully insured' },
                        { icon: <Users size={15} />, label: 'Nhóm nhỏ / Small group' },
                    ].map((s, i) => (
                        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: '#fff', fontWeight: 700, fontSize: 13 }}>
                            {s.icon} {s.label}
                        </span>
                    ))}
                </div>
            </div>

            {/* ── EASY RIDER INFO ── */}
            <section style={{ padding: '48px 0', background: '#fffbeb' }}>
                <div className="container">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'stretch' }}>
                        {/* Main explanation */}
                        <div style={{ flex: '2 1 280px', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                            <div style={{ fontSize: 52, lineHeight: 1, flexShrink: 0 }}>🏍️</div>
                            <div>
                                <h2 style={{ color: '#92400e', fontWeight: 900, fontSize: 'clamp(1.1rem,3vw,1.5rem)', margin: '0 0 8px' }}>
                                    Easy Rider là gì? / What is Easy Rider?
                                </h2>
                                <p style={{ color: '#78350f', fontSize: 14, lineHeight: 1.7, margin: '0 0 6px' }}>
                                    Bạn <strong>ngồi sau</strong> hướng dẫn viên bản địa (người Mông/Tày) — họ lái xe, dẫn đường và kể chuyện văn hóa. Không cần bằng lái, không cần kinh nghiệm lái xe. Trải nghiệm <em>thực sự cùng người địa phương</em>.
                                </p>
                                <p style={{ color: '#a16207', fontSize: 13, lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                                    You ride pillion with a local H'Mong/Tay guide who drives, navigates, and shares cultural stories. No driving license or experience needed — a truly authentic local experience.
                                </p>
                            </div>
                        </div>

                        {/* Options card */}
                        <div style={{ flex: '1 1 200px', background: '#fff', border: '1px solid #fde68a', borderRadius: 16, padding: '18px 20px' }}>
                            <div style={{ fontWeight: 800, color: '#92400e', marginBottom: 14, fontSize: 14 }}>
                                🎯 Tuỳ chọn / Options
                            </div>
                            {[
                                { icon: '👤', vn: 'Ngồi sau Easy Rider (mặc định)', en: 'Ride pillion with guide (default)' },
                                { icon: '🏍️', vn: 'Tự lái xe bán số (+phí thuê)', en: 'Self-ride semi-auto (+rental fee)' },
                                { icon: '🚗', vn: 'Xe ô tô riêng (theo yêu cầu)', en: 'Private car option (on request)' },
                            ].map((opt, i) => (
                                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                                    <span style={{ fontSize: 18, flexShrink: 0 }}>{opt.icon}</span>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#78350f', lineHeight: 1.3 }}>{opt.vn}</div>
                                        <div style={{ fontSize: 11, color: '#a16207', fontStyle: 'italic' }}>{opt.en}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── ITINERARY ── */}
            <section style={{ padding: '44px 0', background: '#f8fafc' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 40 }}>
                        <span style={{ color: '#16a34a', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: 2 }}>
                            Lịch Trình / Itinerary
                        </span>
                        <h2 style={{ fontSize: 'clamp(1.5rem,4vw,2.2rem)', fontWeight: 900, color: '#0f172a', margin: '8px 0 4px' }}>
                            {nights} Khám Phá Loop
                        </h2>
                        <p style={{ color: '#64748b', fontSize: 14, margin: 0, fontStyle: 'italic' }}>
                            {nightsEn} Ha Giang Loop — Easy Rider Adventure
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {itinerary.map((day, i) => (
                            <div key={i} style={{
                                background: '#fff', borderRadius: 18, overflow: 'hidden',
                                boxShadow: '0 2px 14px rgba(0,0,0,0.07)',
                                border: `2px solid ${day.color}20`,
                            }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {/* Day strip */}
                                    <div style={{
                                        background: day.color, color: '#fff', width: 100, flexShrink: 0,
                                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                                        justifyContent: 'center', padding: '20px 10px', gap: 6, minHeight: 120,
                                    }}>
                                        <div style={{ fontSize: 24 }}>{day.icon}</div>
                                        <div style={{ fontWeight: 900, fontSize: 14, textAlign: 'center' }}>{day.day}</div>
                                        <div style={{ fontWeight: 500, fontSize: 11, opacity: 0.85 }}>{day.dayEn}</div>
                                    </div>
                                    {/* Content */}
                                    <div style={{ flex: 1, padding: '18px 22px', minWidth: 0 }}>
                                        <h3 style={{ margin: '0 0 2px', color: '#1e293b', fontSize: 15, fontWeight: 800, lineHeight: 1.4 }}>
                                            {day.title}
                                        </h3>
                                        <p style={{ color: '#64748b', fontSize: 12, fontStyle: 'italic', margin: '0 0 10px', lineHeight: 1.4 }}>
                                            {day.titleEn}
                                        </p>
                                        <p style={{ color: '#475569', fontSize: 13, lineHeight: 1.7, margin: '0 0 4px' }}>
                                            {day.desc}
                                        </p>
                                        <p style={{ color: '#94a3b8', fontSize: 12, fontStyle: 'italic', lineHeight: 1.6, margin: '0 0 12px' }}>
                                            {day.descEn}
                                        </p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                                            {day.highlights.map((h, j) => (
                                                <span key={j} style={{
                                                    background: `${day.color}15`, color: day.color,
                                                    border: `1px solid ${day.color}30`, borderRadius: 999,
                                                    padding: '3px 10px', fontSize: 12, fontWeight: 600,
                                                }}>
                                                    📍 {h}
                                                </span>
                                            ))}
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 12, color: '#64748b' }}>
                                            <span>🍽️ {day.meal}</span>
                                            <span>🏨 {day.hotel}</span>
                                        </div>
                                    </div>
                                    {/* Day photo */}
                                    {day.img && (
                                        <div style={{
                                            width: 140, flexShrink: 0, overflow: 'hidden',
                                            borderLeft: `3px solid ${day.color}30`,
                                        }}>
                                            <img src={day.img} alt={day.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: 120 }}
                                                loading="lazy" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── INCLUDES / EXCLUDES ── */}
            <section style={{ padding: '44px 0', background: '#fff' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 40 }}>
                        <span style={{ color: '#16a34a', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: 2 }}>
                            Chi Phí / What's Included
                        </span>
                        <h2 style={{ fontSize: 'clamp(1.5rem,4vw,2.2rem)', fontWeight: 900, color: '#0f172a', margin: '8px 0 4px' }}>
                            Trọn Gói — Không Phát Sinh
                        </h2>
                        <p style={{ color: '#64748b', fontSize: 14, margin: 0, fontStyle: 'italic' }}>
                            All-Inclusive Package — No Hidden Costs
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                        {/* Included */}
                        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 20, padding: 28 }}>
                            <h3 style={{ color: '#166534', fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
                                <Check size={18} color="#16a34a" /> Đã bao gồm / Included
                            </h3>
                            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {INCLUDES.map((inc, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                        <span style={{ fontSize: 18, flexShrink: 0 }}>{inc.icon}</span>
                                        <div>
                                            <div style={{ color: '#166534', fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}>{inc.text}</div>
                                            <div style={{ color: '#16a34a', fontSize: 11, fontStyle: 'italic', marginTop: 1, opacity: 0.8 }}>{inc.en}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Excluded */}
                        <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 20, padding: 28 }}>
                            <h3 style={{ color: '#9a3412', fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
                                <X size={18} color="#ea580c" /> Không bao gồm / Not Included
                            </h3>
                            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {EXCLUDES.map((exc, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                        <span style={{ color: '#ea580c', fontWeight: 900, fontSize: 16, flexShrink: 0, lineHeight: 1.2 }}>–</span>
                                        <div>
                                            <div style={{ color: '#9a3412', fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}>{exc.vn}</div>
                                            <div style={{ color: '#c2410c', fontSize: 11, fontStyle: 'italic', marginTop: 1 }}>{exc.en}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div style={{ marginTop: 24, background: '#fff', borderRadius: 14, padding: 16, border: '1px solid #fed7aa' }}>
                                <strong style={{ color: '#ea580c', fontSize: 13 }}>💡 Mẹo / Travel Tip</strong>
                                <p style={{ color: '#78350f', fontSize: 13, margin: '6px 0 4px', lineHeight: 1.6 }}>
                                    Xe khách giường nằm Hà Nội–Hà Giang khoảng 280.000đ/chiều. Đến sáng, về tối — tiết kiệm chi phí di chuyển.
                                </p>
                                <p style={{ color: '#a16207', fontSize: 11, margin: 0, fontStyle: 'italic', lineHeight: 1.5 }}>
                                    Sleeper bus Hanoi–Ha Giang ~280,000 VND one way. Depart evening, arrive morning — great way to save on transport.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── GALLERY ── */}
            <section style={{ padding: '44px 0', background: '#0f172a' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 36 }}>
                        <span style={{ color: '#34d399', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: 2 }}>
                            Hình Ảnh / Gallery
                        </span>
                        <h2 style={{ fontSize: 'clamp(1.5rem,4vw,2.2rem)', fontWeight: 900, color: '#fff', margin: '8px 0 4px' }}>
                            Khung Cảnh Hà Giang
                        </h2>
                        <p style={{ color: '#475569', fontSize: 14, margin: 0, fontStyle: 'italic' }}>
                            Ha Giang Loop — A Visual Journey
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
                        {gallery.map((img, i) => (
                            <div
                                key={i}
                                onClick={() => setGalleryIdx(i)}
                                style={{
                                    borderRadius: 12, overflow: 'hidden', aspectRatio: '4/3',
                                    cursor: 'pointer', position: 'relative',
                                    background: '#1e293b', transition: 'transform 0.2s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <img src={img.src} alt={img.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{
                                    position: 'absolute', bottom: 0, left: 0, right: 0,
                                    background: 'linear-gradient(transparent, rgba(0,0,0,0.75))',
                                    color: '#fff', fontSize: 11, fontWeight: 600, padding: '20px 8px 7px',
                                }}>
                                    {img.caption}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── LIGHTBOX ── */}
            {galleryIdx !== null && (
                <div
                    className="modal-backdrop"
                    onClick={() => setGalleryIdx(null)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
                        <button
                            className="modal-close"
                            onClick={() => setGalleryIdx(null)}
                            style={{ position: 'absolute', top: -16, right: -16, zIndex: 1 }}
                        >✕</button>
                        <img
                            src={gallery[galleryIdx].src}
                            alt={gallery[galleryIdx].caption}
                            style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 16, display: 'block' }}
                        />
                        <div style={{ color: '#fff', textAlign: 'center', marginTop: 10, fontWeight: 700 }}>
                            {gallery[galleryIdx].caption}
                        </div>
                    </div>
                </div>
            )}

            {/* ── BOOKING + FAQ ── */}
            <section id="booking" style={{ padding: '44px 0', background: '#f8fafc' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 40 }}>
                        <span style={{ color: '#16a34a', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: 2 }}>
                            Đặt Lịch / Book Tour
                        </span>
                        <h2 style={{ fontSize: 'clamp(1.5rem,4vw,2.2rem)', fontWeight: 900, color: '#0f172a', margin: '8px 0 4px' }}>
                            Đặt Tour & Hỏi Đáp
                        </h2>
                        <p style={{ color: '#64748b', fontSize: 14, margin: 0, fontStyle: 'italic' }}>
                            Book Your Trip & FAQ
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, alignItems: 'start' }}>
                        {/* Booking form */}
                        <div style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ margin: '0 0 4px', color: '#0f172a', fontWeight: 800, fontSize: 17 }}>
                                📋 Đặt Tour Hà Giang Loop
                            </h3>
                            <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 16px', fontStyle: 'italic' }}>
                                Book Ha Giang Loop — {nightsEn}
                            </p>

                            {/* Tour type mini-selector inside form */}
                            <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
                                {[
                                    { id: '3d2n', label: '3N2Đ · 3.200.000đ' },
                                    { id: '4d3n', label: '4N3Đ · 4.200.000đ' },
                                ].map(opt => (
                                    <button key={opt.id} type="button" onClick={() => setTourType(opt.id)}
                                        style={{
                                            flex: 1, padding: '8px 10px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                                            border: tourType === opt.id ? '2px solid #16a34a' : '2px solid #e2e8f0',
                                            background: tourType === opt.id ? '#f0fdf4' : '#f8fafc',
                                            color: tourType === opt.id ? '#166534' : '#64748b',
                                            cursor: 'pointer',
                                        }}>
                                        {opt.label}
                                    </button>
                                ))}
                            </div>

                            {bookingDone ? (
                                <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                                    <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                                    <h4 style={{ color: '#16a34a', fontWeight: 800, marginBottom: 4 }}>Đã nhận yêu cầu!</h4>
                                    <p style={{ color: '#64748b', fontSize: 13, marginBottom: 4, lineHeight: 1.6 }}>Admin sẽ liên hệ xác nhận trong vòng 2 giờ.</p>
                                    <p style={{ color: '#94a3b8', fontSize: 12, fontStyle: 'italic', marginBottom: 20 }}>Booking received! We'll contact you within 2 hours.</p>
                                    <button className="btn3d btn3d-orange" onClick={() => setBookingDone(false)}>
                                        Đặt thêm / Book more
                                    </button>
                                </div>
                            ) : (
                                <BookingForm tourType={tourType} onSuccess={handleBookingSuccess} />
                            )}
                        </div>

                        {/* FAQ */}
                        <div>
                            <h3 style={{ margin: '0 0 4px', color: '#0f172a', fontWeight: 800, fontSize: 17 }}>
                                ❓ Câu Hỏi Thường Gặp
                            </h3>
                            <p style={{ color: '#64748b', fontSize: 13, margin: '0 0 16px', fontStyle: 'italic' }}>
                                Frequently Asked Questions
                            </p>
                            {FAQ.map((item, i) => (
                                <FaqItem key={i} item={item} />
                            ))}

                            {/* Contact strip */}
                            <div style={{
                                marginTop: 16, background: '#fff', border: '1px solid #bbf7d0',
                                borderRadius: 14, padding: '16px 18px',
                                display: 'flex', gap: 12, alignItems: 'center',
                            }}>
                                <span style={{ fontSize: 26 }}>💬</span>
                                <div>
                                    <div style={{ fontWeight: 800, color: '#166534', fontSize: 13 }}>Còn thắc mắc? Chat ngay!</div>
                                    <div style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic', marginBottom: 4 }}>Still have questions? Chat with us!</div>
                                    <div style={{ fontSize: 13, color: '#64748b' }}>
                                        Zalo: <a href="https://zalo.me/0385737705" style={{ color: '#2563eb', fontWeight: 700 }}>0385.737.705</a>
                                        {' · '}
                                        WhatsApp: <a href="https://wa.me/84385737705" style={{ color: '#16a34a', fontWeight: 700 }}>+84 385 737 705</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── BOTTOM CTA ── */}
            <section style={{
                background: 'linear-gradient(135deg, #064e3b, #065f46)',
                padding: '48px 24px', textAlign: 'center',
            }}>
                <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(1.3rem,4vw,1.8rem)', marginBottom: 4 }}>
                    Sẵn sàng chinh phục Hà Giang Loop?
                </h2>
                <p style={{ color: '#6ee7b7', fontSize: 14, marginBottom: 8, fontStyle: 'italic' }}>
                    Ready to conquer the Ha Giang Loop on an Easy Rider?
                </p>
                <p style={{ color: '#a7f3d0', fontSize: 14, marginBottom: 28 }}>
                    Chỉ còn <strong style={{ color: '#fbbf24' }}>vài suất</strong> trong tháng 6 — đặt ngay để nhận giá ưu đãi!
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <a
                        href="#booking"
                        className="btn3d btn3d-orange"
                        style={{ textDecoration: 'none', fontSize: 15, padding: '14px 28px' }}
                        onClick={e => { e.preventDefault(); document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }) }}
                    >
                        <Calendar size={16} /> Đặt Tour / Book Now
                    </a>
                    <a href="tel:0385737705" className="btn3d btn3d-blue" style={{ textDecoration: 'none', fontSize: 15, padding: '14px 28px' }}>
                        <Phone size={16} /> 0385.737.705
                    </a>
                </div>
            </section>

        </div>
    )
}
