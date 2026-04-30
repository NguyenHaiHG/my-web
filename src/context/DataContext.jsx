import { createContext, useContext, useState, useEffect } from 'react'

const DataContext = createContext(null)

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// MongoDB trả về _id, map sang id để không cần sửa các component khác
const mapId = item => ({ ...item, id: item._id || item.id })

const plural = type => type === 'post' ? 'posts' : type + 's'

export function DataProvider({ children }) {
  const [tours, setTours] = useState([])
  const [products, setProducts] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/tours`).then(r => r.json()),
      fetch(`${API}/api/products`).then(r => r.json()),
      fetch(`${API}/api/posts`).then(r => r.json()),
    ])
      .then(([toursData, productsData, postsData]) => {
        setTours(toursData.map(mapId))
        setProducts(productsData.map(mapId))
        setPosts(postsData.map(mapId))
      })
      .catch(err => console.error('Lỗi tải dữ liệu:', err))
      .finally(() => setLoading(false))
  }, [])

  const addItem = async (type, item) => {
    const res = await fetch(`${API}/api/${plural(type)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    const newItem = mapId(await res.json())
    if (type === 'tour') setTours(p => [newItem, ...p])
    else if (type === 'product') setProducts(p => [newItem, ...p])
    else if (type === 'post') setPosts(p => [newItem, ...p])
  }

  const deleteItem = async (type, id) => {
    await fetch(`${API}/api/${plural(type)}/${id}`, { method: 'DELETE' })
    if (type === 'tour') setTours(p => p.filter(i => i.id !== id))
    else if (type === 'product') setProducts(p => p.filter(i => i.id !== id))
    else if (type === 'post') setPosts(p => p.filter(i => i.id !== id))
  }

  const updateItem = async (type, id, data) => {
    const res = await fetch(`${API}/api/${plural(type)}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const updated = mapId(await res.json())
    const updater = list => list.map(i => i.id === id ? updated : i)
    if (type === 'tour') setTours(updater)
    else if (type === 'product') setProducts(updater)
    else if (type === 'post') setPosts(updater)
  }

  return (
    <DataContext.Provider value={{ tours, products, posts, loading, addItem, deleteItem, updateItem }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
