import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

const FAQ_CATS = [
    {
        id: 'booking', icon: '🏍️',
        title: 'Tour & Đặt chỗ', title_en: 'Tours & Booking',
        items: [
            {
                q: 'Đặt tour Hà Giang Loop như thế nào?',
                q_en: 'How do I book a Ha Giang Loop tour?',
                a: 'Nhắn Zalo/WhatsApp số 0385.737.705 hoặc điền form tại trang Liên hệ. Sau khi xác nhận, đặt cọc 30% qua chuyển khoản. Chúng tôi phản hồi trong vòng 2 giờ.',
                a_en: 'Message Zalo/WhatsApp at 0385.737.705 or fill the Contact form. After confirmation, a 30% deposit is required by bank transfer. We respond within 2 hours.',
            },
            {
                q: 'Chính sách huỷ tour?',
                q_en: 'What is the cancellation policy?',
                a: 'Huỷ trước 3 ngày: hoàn 100%. Huỷ trong 3 ngày: hoàn 50%. Huỷ trong ngày khởi hành: không hoàn tiền.',
                a_en: 'Cancel 3+ days before departure: full refund. Within 3 days: 50% refund. Same day: no refund.',
            },
            {
                q: 'Tour có hướng dẫn viên không?',
                q_en: 'Do tours include a guide?',
                a: 'Có — hướng dẫn viên người địa phương, biết tiếng Anh, rành đường núi. Bạn có thể yêu cầu hướng dẫn viên nữ khi đặt tour.',
                a_en: 'Yes — local guides who speak English and know the mountain roads. You can request a female guide when booking.',
            },
            {
                q: 'Nhóm tối đa bao nhiêu người?',
                q_en: 'What is the maximum group size?',
                a: 'Tối đa 8 người/nhóm để đảm bảo chất lượng trải nghiệm và an toàn trên đường núi.',
                a_en: 'Maximum 8 people per group to ensure experience quality and safety on mountain roads.',
            },
            {
                q: 'Tour đã bao gồm những gì?',
                q_en: 'What is included in the tour?',
                a: 'Xe máy, xăng, hướng dẫn viên, homestay và bữa sáng (gói 3N2Đ và 4N3Đ thêm bữa tối). Không bao gồm: vé thắng cảnh, đồ uống.',
                a_en: 'Motorbike, fuel, guide, homestay and breakfast (3D2N and 4D3N packages also include dinner). Not included: entrance fees, drinks.',
            },
        ],
    },
    {
        id: 'getting-there', icon: '🛣️',
        title: 'Di chuyển đến Hà Giang', title_en: 'Getting to Ha Giang',
        items: [
            {
                q: 'Từ Hà Nội lên Hà Giang mất bao lâu?',
                q_en: 'How long from Hanoi to Ha Giang?',
                a: 'Xe bus đêm khoảng 6–7 tiếng (~200.000đ/vé, nhiều hãng chạy từ Mỹ Đình). Không có sân bay hay tàu hoả trực tiếp. HTX có thể tư vấn đặt vé bus.',
                a_en: 'Overnight bus is about 6–7 hours (~200,000 VND, several operators from My Dinh). No direct airport or train service. HTX can help arrange bus tickets.',
            },
            {
                q: 'Đến HTX Trường Hải bằng cách nào?',
                q_en: 'How do I get to HTX Truong Hai?',
                a: 'Địa chỉ: Tổ 5 Quang Trung, Phường Hà Giang. Cách trung tâm thành phố 10 phút, chỉ 500m từ điểm xuất phát Hà Giang Loop. Xem bản đồ tại trang Liên hệ.',
                a_en: 'Address: To 5 Quang Trung, Ha Giang Ward. 10 minutes from city center, only 500m from the Ha Giang Loop start point. See the map on the Contact page.',
            },
            {
                q: 'HTX có thuê xe máy không?',
                q_en: 'Does HTX rent motorbikes?',
                a: 'Có — xe bán tự động và xe số, bảo trì định kỳ, mũ bảo hiểm đạt chuẩn. Từ 150.000đ/ngày. Tour trọn gói đã bao gồm xe.',
                a_en: 'Yes — semi-automatic and manual bikes, regularly serviced, quality helmets. From 150,000 VND/day. Package tours include the bike.',
            },
        ],
    },
    {
        id: 'accommodation', icon: '🏠',
        title: 'Lưu trú', title_en: 'Accommodation',
        items: [
            {
                q: 'HTX có chỗ nghỉ không?',
                q_en: 'Does HTX have accommodation?',
                a: 'Có — homestay "Nhà Trong Rừng" giữa vườn cây ăn quả trăm năm, gia đình người Tày 4 thế hệ. Yên tĩnh, an toàn, mang đậm bản sắc dân tộc.',
                a_en: 'Yes — the "House in the Forest" homestay in a century-old fruit garden, a 4-generation Tày family home. Peaceful, safe, and deeply authentic.',
            },
            {
                q: 'Phòng có tiện nghi gì?',
                q_en: 'What amenities are in the rooms?',
                a: 'Điều hoà, quạt trần, wifi, nhà tắm riêng. Bữa sáng kiểu Tày (xôi nếp nương, bánh cuốn, trà núi) phục vụ tại vườn.',
                a_en: 'AC, ceiling fan, wifi, private bathroom. Tày-style breakfast (sticky glutinous rice, steamed rolls, mountain tea) served in the garden.',
            },
            {
                q: 'HTX có thể tư vấn thêm homestay bên ngoài không?',
                q_en: 'Can HTX recommend other homestays?',
                a: 'Có — chúng tôi có danh sách homestay uy tín dọc tuyến Loop đã được xác minh, đặc biệt phù hợp cho phụ nữ đi một mình.',
                a_en: 'Yes — we have a vetted list of trusted homestays along the Loop route, especially suitable for solo female travelers.',
            },
        ],
    },
    {
        id: 'women-safety', icon: '💜',
        title: 'An toàn phụ nữ', title_en: "Women's Safety",
        items: [
            {
                q: 'Nữ du khách đi một mình có an toàn không?',
                q_en: 'Is Ha Giang safe for solo female travelers?',
                a: 'Hà Giang là một trong những điểm đến an toàn nhất cho phụ nữ đi một mình. Người dân hiền hoà, đường rõ ràng. HTX có hướng dẫn viên nữ và mạng lưới hỗ trợ 24/7.',
                a_en: 'Ha Giang is one of the safest destinations for solo female travelers. Friendly locals, clear roads. HTX has female guides and a 24/7 support network.',
            },
            {
                q: 'Cần liên lạc ai khi gặp sự cố?',
                q_en: 'Who to contact in an emergency?',
                a: '• 113 — Cảnh sát (miễn phí, 24/7)\n• 1800 599 920 — Đường dây hỗ trợ bạo lực gia đình (miễn phí, 24/7)\n• 0385.737.705 — HTX Trường Hải (Zalo/WhatsApp)',
                a_en: '• 113 — Police (free, 24/7)\n• 1800 599 920 — GBV Hotline (free, 24/7)\n• 0385.737.705 — HTX Truong Hai (Zalo/WhatsApp)',
            },
            {
                q: 'Có thể yêu cầu hướng dẫn viên nữ không?',
                q_en: 'Can I request a female guide?',
                a: 'Có — hướng dẫn viên nữ người Tày địa phương, biết tiếng Anh. Cần đặt trước ít nhất 2 ngày để sắp xếp lịch.',
                a_en: 'Yes — local Tày female guides who speak English. Please request at least 2 days in advance for scheduling.',
            },
            {
                q: 'HTX có chương trình hỗ trợ phụ nữ không?',
                q_en: 'Does HTX have a women support programme?',
                a: 'Có — trang /ho-tro có thông tin đầy đủ về: hỗ trợ du khách nữ, phụ nữ lao động, nạn nhân bạo lực gia đình, và phụ nữ dân tộc thiểu số.',
                a_en: 'Yes — the /ho-tro page has full details on: support for female travelers, female workers, domestic violence survivors, and ethnic minority women.',
            },
        ],
    },
    {
        id: 'products', icon: '🎁',
        title: 'Sản phẩm & Đơn hàng', title_en: 'Products & Orders',
        items: [
            {
                q: 'HTX có ship hàng không?',
                q_en: 'Do you offer shipping?',
                a: 'Có — giao toàn quốc 3–5 ngày làm việc. Miễn phí ship đơn từ 500.000đ. Đơn quốc tế liên hệ qua WhatsApp để được báo phí cụ thể.',
                a_en: 'Yes — nationwide delivery 3–5 business days. Free shipping on orders over 500,000 VND. International orders via WhatsApp for shipping quote.',
            },
            {
                q: 'Sản phẩm có được xác nhận nguồn gốc không?',
                q_en: 'Are products certified authentic?',
                a: '100% thủ công do phụ nữ Tày làm tại HTX. Không phẩm màu, không hoá chất. Mỗi sản phẩm có thẻ giới thiệu người làm và mã QR truy xuất nguồn gốc.',
                a_en: '100% handmade by Tày women at HTX. No artificial dyes or chemicals. Each product includes a maker profile card and QR code for origin traceability.',
            },
            {
                q: 'Có thể đặt hàng số lượng lớn không?',
                q_en: 'Can I place bulk orders?',
                a: 'Có — đơn hàng đoàn, quà tặng doanh nghiệp, sự kiện. Liên hệ trực tiếp qua Zalo/WhatsApp để được báo giá và thời gian giao hàng.',
                a_en: 'Yes — group orders, corporate gifts, events. Contact directly via Zalo/WhatsApp for pricing and lead time.',
            },
        ],
    },
]

export default function FAQPage() {
    const { lang } = useLang()
    const [openItem, setOpenItem] = useState(null)
    const toggle = (key) => setOpenItem(prev => prev === key ? null : key)

    return (
        <div className="faq-page">
            <div className="faq-hero">
                <div className="faq-hero-badge">❓</div>
                <h1>{lang === 'en' ? 'Frequently Asked Questions' : 'Câu hỏi thường gặp'}</h1>
                <p>{lang === 'en' ? 'Everything you need to know before coming to Ha Giang' : 'Tất cả những gì bạn cần biết trước khi đến Hà Giang'}</p>
            </div>

            <div className="container faq-content">
                {FAQ_CATS.map(cat => (
                    <div key={cat.id} className="faq-cat">
                        <h2 className="faq-cat-title">
                            <span>{cat.icon}</span>
                            {lang === 'en' ? cat.title_en : cat.title}
                        </h2>
                        <div className="faq-items">
                            {cat.items.map((item, idx) => {
                                const key = `${cat.id}-${idx}`
                                const isOpen = openItem === key
                                return (
                                    <div key={key} className={`faq-item${isOpen ? ' faq-item-open' : ''}`}>
                                        <button className="faq-q" onClick={() => toggle(key)}>
                                            <span>{lang === 'en' ? item.q_en : item.q}</span>
                                            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </button>
                                        {isOpen && (
                                            <div className="faq-a">{lang === 'en' ? item.a_en : item.a}</div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}

                <div className="faq-cta">
                    <p>{lang === 'en' ? "Can't find your answer? Message us directly!" : 'Không tìm thấy câu trả lời? Nhắn trực tiếp cho chúng tôi!'}</p>
                    <div className="faq-cta-btns">
                        <a href="https://zalo.me/0385737705" target="_blank" rel="noreferrer" className="faq-cta-btn faq-cta-zalo">💬 Zalo</a>
                        <a href="https://wa.me/84385737705" target="_blank" rel="noreferrer" className="faq-cta-btn faq-cta-wa">💬 WhatsApp</a>
                        <Link to="/lien-he" className="faq-cta-btn faq-cta-contact">{lang === 'en' ? '📝 Contact Form' : '📝 Form liên hệ'}</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
