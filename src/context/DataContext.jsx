import { createContext, useContext, useState, useEffect } from 'react'

const DataContext = createContext(null)

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const mapId = item => ({ ...item, id: item._id || item.id })

const ENDPOINTS = {
  post: 'posts',
  product: 'products',
  tour: 'tours',
  workshop: 'workshops',
  library: 'library',
  review: 'reviews',
}

export function DataProvider({ children }) {
  const [posts, setPosts] = useState([])
  const [products, setProducts] = useState([])
  const [tours, setTours] = useState([])
  const [workshops, setWorkshops] = useState([])
  const [libraryItems, setLibraryItems] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const SETTERS = {
    post: setPosts,
    product: setProducts,
    tour: setTours,
    workshop: setWorkshops,
    library: setLibraryItems,
    review: setReviews,
  }

  useEffect(() => {
    Promise.all(
      Object.values(ENDPOINTS).map(ep =>
        fetch(`${API}/api/${ep}`).then(r => r.json()).catch(() => [])
      )
    ).then(([postsData, productsData, toursData, workshopsData, libraryData, reviewsData]) => {
      setPosts((postsData || []).map(mapId))
      setProducts((productsData || []).map(mapId))
      setTours((toursData || []).map(mapId))
      setWorkshops((workshopsData || []).map(mapId))
      setLibraryItems((libraryData || []).map(mapId))
      setReviews((reviewsData || []).map(mapId))
      setLoading(false)
    })
  }, [])

  const addItem = async (type, item) => {
    const ep = ENDPOINTS[type]
    if (!ep) throw new Error(`Unknown type: ${type}`)
    const res = await fetch(`${API}/api/${ep}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    if (!res.ok) throw new Error(await res.text())
    const newItem = mapId(await res.json())
    SETTERS[type](p => [newItem, ...p])
    return newItem
  }

  const updateItem = async (type, id, data) => {
    const ep = ENDPOINTS[type]
    if (!ep) throw new Error(`Unknown type: ${type}`)
    const res = await fetch(`${API}/api/${ep}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(await res.text())
    const updated = mapId(await res.json())
    SETTERS[type](list => list.map(i => i.id === id ? updated : i))
    return updated
  }

  const deleteItem = async (type, id) => {
    const ep = ENDPOINTS[type]
    if (!ep) throw new Error(`Unknown type: ${type}`)
    await fetch(`${API}/api/${ep}/${id}`, { method: 'DELETE' })
    SETTERS[type](p => p.filter(i => i.id !== id))
  }

  return (
    <DataContext.Provider value={{
      posts, products, tours, workshops, libraryItems, reviews,
      loading, addItem, updateItem, deleteItem,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
