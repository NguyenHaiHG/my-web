import { createContext, useContext, useState, useEffect } from 'react'

const DataContext = createContext(null)

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// MongoDB trả về _id, map sang id để không cần sửa các component khác
const mapId = item => ({ ...item, id: item._id || item.id })

export function DataProvider({ children }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/posts`)
      .then(r => r.json())
      .then(data => setPosts(data.map(mapId)))
      .catch(err => console.error('Lỗi tải bài viết:', err))
      .finally(() => setLoading(false))
  }, [])

  const addItem = async (type, item) => {
    const res = await fetch(`${API}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    if (!res.ok) throw new Error(await res.text())
    const newItem = mapId(await res.json())
    setPosts(p => [newItem, ...p])
  }

  const deleteItem = async (type, id) => {
    await fetch(`${API}/api/posts/${id}`, { method: 'DELETE' })
    setPosts(p => p.filter(i => i.id !== id))
  }

  const updateItem = async (type, id, data) => {
    const res = await fetch(`${API}/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(await res.text())
    const updated = mapId(await res.json())
    setPosts(list => list.map(i => i.id === id ? updated : i))
  }

  return (
    <DataContext.Provider value={{ posts, loading, addItem, deleteItem, updateItem }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
