import { useState } from 'react'
import { Search, BookOpen, Utensils, Music, Palette, Leaf, Star } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useLang } from '../context/LanguageContext'

const CAT_CONFIG = {
    language: { icon: <BookOpen size={16} />, label: 'Ngôn ngữ', color: '#2563eb' },
    food: { icon: <Utensils size={16} />, label: 'Ẩm thực', color: '#d97706' },
    culture: { icon: <Music size={16} />, label: 'Văn hoá', color: '#7c3aed' },
    craft: { icon: <Palette size={16} />, label: 'Nghề thủ công', color: '#db2777' },
    nature: { icon: <Leaf size={16} />, label: 'Thiên nhiên', color: '#16a34a' },
    story: { icon: <Star size={16} />, label: 'Câu chuyện', color: '#c05621' },
}

const SAMPLE_ITEMS = [
    {
        id: 'l1', title: 'Pjầu (Tiếng Tày)', category: 'language', ethnic: 'Tày',
        content: 'Pjầu nghĩa là "đi" — từ thông dụng nhất khi hỏi đường hoặc rủ nhau ra chợ.',
        pronunciation: 'Pʒau', translation: 'Đi / Let\'s go',
        img: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&q=80',
        tags: ['từ vựng', 'giao tiếp', 'hàng ngày'],
    },
    {
        id: 'l2', title: 'Thắng Cố Hà Giang', category: 'food', ethnic: 'H\'Mông',
        content: 'Món lẩu thắng cố truyền thống nấu từ các bộ phận của ngựa và bò, ăn kèm rau rừng. Là linh hồn của chợ phiên vùng cao.',
        img: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80',
        tags: ['món ăn', 'chợ phiên', 'truyền thống'],
    },
    {
        id: 'l3', title: 'Lễ Hội Gầu Tào', category: 'culture', ethnic: 'H\'Mông',
        content: 'Lễ hội đầu năm của người H\'Mông, diễn ra trên đồi cao để cầu phúc, cầu mùa màng tốt tươi. Có các trò chơi dân gian, múa khèn.',
        img: 'https://images.unsplash.com/photo-1574118093-f2bb2f69de59?w=400&q=80',
        tags: ['lễ hội', 'tín ngưỡng', 'mùa xuân'],
    },
    {
        id: 'l4', title: 'Thêu Thổ Cẩm', category: 'craft', ethnic: 'Tày - Nùng',
        content: 'Nghề thêu hoa văn thổ cẩm được truyền từ mẹ sang con gái. Mỗi hoa văn mang thông điệp về gia đình, mùa màng và thiên nhiên.',
        img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
        tags: ['thủ công', 'truyền thống', 'phụ nữ'],
    },
    {
        id: 'l5', title: 'Cây Hồng Không Hạt Quản Bạ', category: 'nature', ethnic: 'Vùng Hà Giang',
        content: 'Giống hồng đặc sản chỉ có ở vùng Quản Bạ, không có hạt, vị ngọt thanh. Chín vào tháng 10-11, đây là thời điểm đẹp nhất để thăm Hà Giang.',
        img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
        tags: ['đặc sản', 'cây ăn quả', 'mùa thu'],
    },
    {
        id: 'l6', title: 'Câu Chuyện Cây Đa 300 Năm', category: 'story', ethnic: 'Cộng đồng',
        content: 'Cây đa đầu bản Tổ 5 đã chứng kiến 4 thế hệ sinh ra và lớn lên. Người già kể rằng cây đa là nơi thần linh trú ngụ, bảo vệ cả bản.',
        img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80',
        tags: ['truyền thuyết', 'thiên nhiên', 'cộng đồng'],
    },
]

function LibraryCard({ item }) {
    const cat = CAT_CONFIG[item.category] || CAT_CONFIG.culture
    const [expanded, setExpanded] = useState(false)

    return (
        <div className="lib-card">
            {item.img && <div className="lib-card-img" style={{ backgroundImage: `url(${item.img})` }}>
                <span className="lib-cat-badge" style={{ background: cat.color }}>
                    {cat.icon} {cat.label}
                </span>
            </div>}
            <div className="lib-card-body">
                {item.ethnic && <span className="lib-ethnic">{item.ethnic}</span>}
                <h3>{item.title}</h3>
                {item.pronunciation && (
                    <div className="lib-pronunciation">
                        <span className="lib-pron-text">/{item.pronunciation}/</span>
                        {item.translation && <span className="lib-trans">→ {item.translation}</span>}
                    </div>
                )}
                <p className={`lib-content ${expanded ? '' : 'lib-content-clamp'}`}>{item.content}</p>
                {item.content?.length > 120 && (
                    <button className="lib-expand-btn" onClick={() => setExpanded(!expanded)}>
                        {expanded ? 'Thu gọn ▲' : 'Xem thêm ▼'}
                    </button>
                )}
                {item.tags?.length > 0 && (
                    <div className="lib-tags">
                        {item.tags.map(tag => <span key={tag} className="lib-tag">#{tag}</span>)}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function LibraryPage() {
    const { libraryItems } = useData()
    const [search, setSearch] = useState('')
    const [cat, setCat] = useState('all')

    const items = libraryItems.length > 0 ? libraryItems : SAMPLE_ITEMS
    const filtered = items.filter(item => {
        const matchCat = cat === 'all' || item.category === cat
        const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase())
            || (item.content || '').toLowerCase().includes(search.toLowerCase())
            || (item.ethnic || '').toLowerCase().includes(search.toLowerCase())
        return matchCat && matchSearch
    })

    return (
        <div className="page-enter">
            <div className="page-hero" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1400&q=80)' }}>
                <div className="ph-overlay" />
                <div className="ph-content">
                    <h1>Thư Viện Số</h1>
                    <p>Ngôn ngữ · Ẩm thực · Văn hoá · Nghề thủ công — di sản dân tộc được lưu giữ</p>
                </div>
            </div>

            <div className="container py-section">
                {/* SEARCH & FILTER */}
                <div className="lib-toolbar">
                    <div className="search-box">
                        <Search size={17} color="#94a3b8" />
                        <input placeholder="Tìm kiếm tư liệu..." value={search}
                            onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="lib-filter-row">
                        {[['all', '🌐 Tất cả'], ...Object.entries(CAT_CONFIG).map(([k, v]) => [k, `${v.label}`])].map(([val, label]) => (
                            <button key={val} className={`filter-chip ${cat === val ? 'filter-chip-active' : ''}`}
                                onClick={() => setCat(val)}>{label}</button>
                        ))}
                    </div>
                </div>

                <p className="lib-count">{filtered.length} tư liệu</p>

                <div className="lib-grid mt-6">
                    {filtered.map(item => <LibraryCard key={item.id} item={item} />)}
                    {filtered.length === 0 && <p className="empty-state">Không tìm thấy tư liệu nào.</p>}
                </div>
            </div>
        </div>
    )
}
