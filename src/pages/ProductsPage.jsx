import { useMemo, useState } from 'react'
import { Edit2, PackageOpen, Plus, Search, Trash2 } from 'lucide-react'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import AdminImgBtn from '../components/AdminImgBtn'

export default function ProductsPage() {
    const { products, loading, deleteItem } = useData()
    const { isMod, isAdmin } = useAuth()
    const { setAdminModal, setEditItem, showToast } = useUI()
    const [search, setSearch] = useState('')
    const [deletingId, setDeletingId] = useState(null)

    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase()
        if (!query) return products
        return products.filter(product =>
            [product.title, product.desc, product.price]
                .some(value => String(value || '').toLowerCase().includes(query))
        )
    }, [products, search])

    const handleDelete = async (product) => {
        if (deletingId) return
        setDeletingId(product.id)
        try {
            await deleteItem('product', product.id)
            showToast('✅ Đã xóa sản phẩm')
        } catch (err) {
            showToast('❌ ' + (err?.message || 'Không thể xóa sản phẩm'))
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="page-enter">
            <div className="page-hero tours-hero" style={{ backgroundImage: 'url(/hg-city-2.svg)' }}>
                <div className="ph-overlay" />
                <div className="ph-content">
                    <h1>Sản phẩm địa phương</h1>
                    <p>Khám phá đặc sản và sản phẩm thủ công từ Hà Giang.</p>
                    <div className="tours-hero-search">
                        <Search size={18} color="#94a3b8" />
                        <input
                            aria-label="Tìm sản phẩm"
                            placeholder="Tìm theo tên, mô tả hoặc giá…"
                            value={search}
                            onChange={event => setSearch(event.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="container py-section">
                <div className="tours-filter-bar">
                    <p className="tours-result-count" style={{ margin: 0 }}>
                        {filteredProducts.length} sản phẩm
                    </p>
                    {isMod && (
                        <button className="btn3d btn3d-green btn-sm" onClick={() => setAdminModal('product')}>
                            <Plus size={15} /> Thêm sản phẩm
                        </button>
                    )}
                </div>

                {loading ? (
                    <p className="empty-state">Đang tải sản phẩm…</p>
                ) : (
                    <div className="cards-grid mt-6">
                        {filteredProducts.map(product => (
                            <article className="card3d" key={product.id}>
                                <div
                                    className="card3d-img"
                                    style={{ backgroundImage: `url(${product.img || '/hg-city-2.svg'})` }}
                                >
                                    {isMod && <AdminImgBtn type="product" itemId={product.id} />}
                                    <div className="card3d-badge">Sản phẩm</div>
                                </div>
                                <div className="card3d-body">
                                    <strong className="card3d-title">{product.title}</strong>
                                    <p className="card3d-desc">{product.desc || 'Sản phẩm địa phương Hà Giang.'}</p>
                                    <span className="card3d-price">{product.price || 'Liên hệ'}</span>
                                    {(isMod || isAdmin) && (
                                        <div className="card3d-actions" style={{ marginTop: 14 }}>
                                            {isMod && (
                                                <button
                                                    className="btn3d btn3d-blue btn-sm"
                                                    onClick={() => setEditItem({ type: 'product', item: product })}
                                                >
                                                    <Edit2 size={13} /> Sửa
                                                </button>
                                            )}
                                            {isAdmin && (
                                                <button
                                                    className="btn-card-del"
                                                    aria-label={`Xóa ${product.title}`}
                                                    disabled={deletingId === product.id}
                                                    onClick={() => handleDelete(product)}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))}
                        {!filteredProducts.length && (
                            <p className="empty-state">
                                <PackageOpen size={24} /> {search ? 'Không tìm thấy sản phẩm phù hợp.' : 'Chưa có sản phẩm.'}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
