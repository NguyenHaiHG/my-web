import { createContext, useContext, useState } from 'react'

const DataContext = createContext(null)

const initialTours = [
  { id: 1, title: 'Tour Hà Giang Trọn Gói 3N2Đ', desc: 'Chinh phục Đồng Văn, Mèo Vạc, Mã Pí Lèng hùng vĩ', price: '2.500.000đ', img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=400&q=80', tag: 'tour' },
  { id: 2, title: 'Homestay Núi Đá', desc: 'Ngủ giữa ruộng bậc thang Hoàng Su Phì, trải nghiệm văn hóa H\'Mông', price: '800.000đ/đêm', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', tag: 'tour' },
  { id: 3, title: 'Tour Trekking Đỉnh Mây', desc: 'Chinh phục đỉnh núi cao trên 2000m, ngắm biển mây kỳ ảo', price: '1.800.000đ', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80', tag: 'tour' },
]

const initialProducts = [
  { id: 1, title: 'Mật Ong Bạc Hà', desc: 'Mật ong nguyên chất từ hoa bạc hà vùng cao, hũ 500g', price: '280.000đ', img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80', tag: 'product' },
  { id: 2, title: 'Trà Hoa Vàng Hà Giang', desc: 'Trà hoa vàng cổ thụ quý hiếm, hộp 100g', price: '350.000đ', img: 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?w=400&q=80', tag: 'product' },
  { id: 3, title: 'Thịt Trâu Gác Bếp', desc: 'Đặc sản thịt trâu truyền thống hun khói, gói 300g', price: '220.000đ', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80', tag: 'product' },
]

const initialPosts = [
  { id: 1, title: 'Kinh nghiệm du lịch Hà Giang tháng 10', content: 'Tháng 10 là mùa lúa chín vàng trên ruộng bậc thang Hoàng Su Phì, đây là thời điểm đẹp nhất để ghé thăm...', author: 'Admin', date: '10/04/2026', img: 'https://images.unsplash.com/photo-1540975038511-ad92c58acd41?w=400&q=80', tag: 'post' },
  { id: 2, title: 'Hướng dẫn order Taobao siêu tiết kiệm', content: 'Bí kíp order hàng Taobao giá rẻ, vận chuyển an toàn về Việt Nam chỉ trong 7-10 ngày...', author: 'Mod HTM', date: '08/04/2026', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80', tag: 'post' },
]

export function DataProvider({ children }) {
  const [tours, setTours] = useState(initialTours)
  const [products, setProducts] = useState(initialProducts)
  const [posts, setPosts] = useState(initialPosts)

  const addItem = (type, item) => {
    const newItem = { ...item, id: Date.now() }
    if (type === 'tour') setTours(p => [newItem, ...p])
    else if (type === 'product') setProducts(p => [newItem, ...p])
    else if (type === 'post') setPosts(p => [newItem, ...p])
  }

  const deleteItem = (type, id) => {
    if (type === 'tour') setTours(p => p.filter(i => i.id !== id))
    else if (type === 'product') setProducts(p => p.filter(i => i.id !== id))
    else if (type === 'post') setPosts(p => p.filter(i => i.id !== id))
  }

  const updateItem = (type, id, data) => {
    const updater = list => list.map(i => i.id === id ? { ...i, ...data } : i)
    if (type === 'tour') setTours(updater)
    else if (type === 'product') setProducts(updater)
    else if (type === 'post') setPosts(updater)
  }

  return (
    <DataContext.Provider value={{ tours, products, posts, addItem, deleteItem, updateItem }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
