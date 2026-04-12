import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext(null)

export const translations = {
    vi: {
        // ── Navigation
        nav_home: '🏠 Trang Chủ',
        nav_tours: '🗺️ Du Lịch',
        nav_order: '🛒 Order Taobao',
        nav_products: '🍯 Đặc Sản',
        nav_blog: '📝 Blog',
        nav_contact: '📞 Liên Hệ',
        nav_mgmt_cart: '🛒 QL Giỏ Hàng',
        nav_mgmt_tour: '🗺️ QL Đặt Tour',
        nav_mgmt_taobao: '📦 QL Taobao',
        btn_login: 'Đăng Nhập',
        btn_logout: 'Thoát',

        // ── Tours Hero
        tours_hero_title: '🗺️ Tour Du Lịch Hà Giang',
        tours_hero_sub: 'Ruộng bậc thang · Đỉnh Mã Pí Lèng · Bình nguyên đá Đồng Văn',
        tours_search: 'Tìm kiếm tour...',
        tours_add: '+ Thêm Tour',
        tours_no_result: 'Không tìm thấy tour nào 😢',
        tours_filter_all: 'Tất cả',
        tours_filter_budget: '💰 Tiết kiệm',
        tours_filter_premium: '⭐ Cao cấp',
        tours_filter_trek: '🥾 Trekking',
        tours_sort: 'Sắp xếp',
        tours_sort_default: 'Mặc định',
        tours_sort_price_asc: 'Giá tăng dần',
        tours_sort_price_desc: 'Giá giảm dần',
        tours_sort_rating: 'Đánh giá cao',
        tours_results: 'tour',

        // ── Tour Card
        card_from: 'Từ',
        card_per_person: '/người',
        card_duration: 'Thời gian',
        card_max: 'Tối đa',
        card_people: 'người',
        card_rating: 'Đánh giá',
        card_detail: 'Chi Tiết',
        card_book: '🗓 Đặt Ngay',
        card_includes: 'Bao gồm:',

        // ── Includes labels
        inc_transport: '🚌 Xe đưa đón',
        inc_meal: '🍽️ Ăn uống',
        inc_guide: '🧭 HDV',
        inc_hotel: '🏨 Lưu trú',
        inc_ticket: '🎫 Vé tham quan',

        // ── Booking Modal
        book_title: '🗺️ Đặt Tour',
        book_step1: 'Chọn ngày',
        book_step2: 'Thông tin',
        book_step3: 'Xác nhận',
        book_departure_date: 'Ngày khởi hành *',
        book_guest_count: 'Số lượng khách',
        book_adults: 'Người lớn',
        book_children: 'Trẻ em',
        book_next: 'Tiếp theo →',
        book_full_name: 'Họ và tên *',
        book_phone: 'Số điện thoại *',
        book_email: 'Email (tùy chọn)',
        book_notes: 'Yêu cầu đặc biệt',
        book_notes_ph: 'Dị ứng thức ăn, phòng riêng, yêu cầu đặc biệt...',
        book_back: '← Quay lại',
        book_summary_title: '📋 Tóm tắt đặt tour',
        book_tour_label: 'Tour',
        book_date_label: 'Ngày khởi hành',
        book_total_guests: 'Tổng khách',
        book_price_per: 'Giá / người',
        book_contact_label: 'Liên hệ',
        book_note_label: 'Ghi chú',
        book_confirm: '✅ Xác Nhận Đặt Tour',
        book_call: '📞 Gọi Ngay 0385.737.705',
        book_no_date: '⚠️ Vui lòng chọn ngày khởi hành',
        book_required_msg: '⚠️ Vui lòng điền đầy đủ thông tin bắt buộc',
        book_success_msg: 'Đặt tour "{title}" thành công! Admin/Mod sẽ liên hệ sớm.',
        book_adults_label: 'người lớn',
        book_children_label: 'trẻ em',
        book_and: 'và',
        book_deleted: 'Đã xoá!',
    },

    en: {
        // ── Navigation
        nav_home: '🏠 Home',
        nav_tours: '🗺️ Tours',
        nav_order: '🛒 Taobao Order',
        nav_products: '🍯 Specialties',
        nav_blog: '📝 Blog',
        nav_contact: '📞 Contact',
        nav_mgmt_cart: '🛒 Cart Mgmt',
        nav_mgmt_tour: '🗺️ Tour Mgmt',
        nav_mgmt_taobao: '📦 Taobao Mgmt',
        btn_login: 'Login',
        btn_logout: 'Sign Out',

        // ── Tours Hero
        tours_hero_title: '🗺️ Ha Giang Travel Tours',
        tours_hero_sub: 'Terraced Rice Fields · Mã Pí Lèng Peak · Dong Van Stone Plateau',
        tours_search: 'Search tours...',
        tours_add: '+ Add Tour',
        tours_no_result: 'No tours found 😢',
        tours_filter_all: 'All',
        tours_filter_budget: '💰 Budget',
        tours_filter_premium: '⭐ Premium',
        tours_filter_trek: '🥾 Trekking',
        tours_sort: 'Sort',
        tours_sort_default: 'Default',
        tours_sort_price_asc: 'Price: Low → High',
        tours_sort_price_desc: 'Price: High → Low',
        tours_sort_rating: 'Top Rated',
        tours_results: 'tour(s)',

        // ── Tour Card
        card_from: 'From',
        card_per_person: '/person',
        card_duration: 'Duration',
        card_max: 'Max',
        card_people: 'people',
        card_rating: 'Rating',
        card_detail: 'View Details',
        card_book: '🗓 Book Now',
        card_includes: 'Includes:',

        // ── Includes labels
        inc_transport: '🚌 Transport',
        inc_meal: '🍽️ Meals',
        inc_guide: '🧭 Tour Guide',
        inc_hotel: '🏨 Accommodation',
        inc_ticket: '🎫 Entry Tickets',

        // ── Booking Modal
        book_title: '🗺️ Book Tour',
        book_step1: 'Date',
        book_step2: 'Your Info',
        book_step3: 'Confirm',
        book_departure_date: 'Departure Date *',
        book_guest_count: 'Number of Guests',
        book_adults: 'Adults',
        book_children: 'Children',
        book_next: 'Next →',
        book_full_name: 'Full Name *',
        book_phone: 'Phone Number *',
        book_email: 'Email (optional)',
        book_notes: 'Special Requests',
        book_notes_ph: 'Food allergies, private room, special requirements...',
        book_back: '← Back',
        book_summary_title: '📋 Booking Summary',
        book_tour_label: 'Tour',
        book_date_label: 'Departure Date',
        book_total_guests: 'Total Guests',
        book_price_per: 'Price / person',
        book_contact_label: 'Contact',
        book_note_label: 'Notes',
        book_confirm: '✅ Confirm Booking',
        book_call: '📞 Call 0385.737.705',
        book_no_date: '⚠️ Please select a departure date',
        book_required_msg: '⚠️ Please fill in all required fields',
        book_success_msg: 'Tour "{title}" booked! Admin/Mod will contact you soon.',
        book_adults_label: 'adults',
        book_children_label: 'children',
        book_and: 'and',
        book_deleted: 'Deleted!',
    },
}

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState('vi')

    const t = (key) => translations[lang]?.[key] ?? translations.vi[key] ?? key
    const toggleLang = () => setLang(l => (l === 'vi' ? 'en' : 'vi'))

    return (
        <LanguageContext.Provider value={{ lang, t, toggleLang }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLang = () => useContext(LanguageContext)
