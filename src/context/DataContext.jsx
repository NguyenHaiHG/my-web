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
  communityImage: 'community-images',
}

/* ── localStorage helpers ── */
const LS_KEY = type => `hagiang_${type}s`

function lsLoad(type) {
  try { return JSON.parse(localStorage.getItem(LS_KEY(type)) || '[]') } catch { return [] }
}
function lsSave(type, list) {
  try { localStorage.setItem(LS_KEY(type), JSON.stringify(list)) } catch { /* quota */ }
}
function lsAdd(type, item) {
  const list = [item, ...lsLoad(type)]
  lsSave(type, list)
}
function lsUpdate(type, id, data) {
  const list = lsLoad(type).map(i => (i.id === id ? { ...i, ...data } : i))
  lsSave(type, list)
}
function lsDelete(type, id) {
  lsSave(type, lsLoad(type).filter(i => i.id !== id))
}
function makeLocalId() {
  return 'local_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7)
}

export function DataProvider({ children }) {
  const [posts, setPosts] = useState([])
  const [products, setProducts] = useState([])
  const [tours, setTours] = useState([])
  const [workshops, setWorkshops] = useState([])
  const [libraryItems, setLibraryItems] = useState([])
  const [reviews, setReviews] = useState([])
  const [communityImages, setCommunityImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)

  const SETTERS = {
    post: setPosts,
    product: setProducts,
    tour: setTours,
    workshop: setWorkshops,
    library: setLibraryItems,
    review: setReviews,
    communityImage: setCommunityImages,
  }

  const TYPE_KEYS = ['post', 'product', 'tour', 'workshop', 'library', 'review', 'communityImage']

  useEffect(() => {
    // Load localStorage data immediately so UI isn't empty
    setPosts(lsLoad('post'))
    setProducts(lsLoad('product'))
    setTours(lsLoad('tour'))
    setWorkshops(lsLoad('workshop'))
    setLibraryItems(lsLoad('library'))
    setReviews(lsLoad('review'))
    setCommunityImages(lsLoad('communityImage'))

    Promise.all(
      Object.values(ENDPOINTS).map(ep =>
        fetch(`${API}/api/${ep}`, { signal: AbortSignal.timeout(5000) })
          .then(r => r.json()).catch(() => null)
      )
    ).then(results => {
      const allFailed = results.every(r => r === null)
      if (allFailed) {
        setOffline(true)
      } else {
        const [postsData, productsData, toursData, workshopsData, libraryData, reviewsData, communityImagesData] = results
        const sets = [setPosts, setProducts, setTours, setWorkshops, setLibraryItems, setReviews, setCommunityImages]
        const types = TYPE_KEYS
          ;[postsData, productsData, toursData, workshopsData, libraryData, reviewsData, communityImagesData].forEach((data, i) => {
            if (data) {
              const mapped = data.map(mapId)
              sets[i](mapped)
              lsSave(types[i], mapped)
            }
          })
      }
      setLoading(false)
    })
  }, [])

  const addItem = async (type, item) => {
    const ep = ENDPOINTS[type]
    if (!ep) throw new Error(`Unknown type: ${type}`)
    let res
    try {
      res = await fetch(`${API}/api/${ep}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
        signal: AbortSignal.timeout(10000),
      })
    } catch {
      // Offline fallback — save locally with a local ID
      const localItem = { ...item, id: makeLocalId(), _local: true }
      if (SETTERS[type]) {
        SETTERS[type](p => { const list = [localItem, ...p]; lsSave(type, list); return list })
      }
      return localItem
    }
    if (!res.ok) {
      const raw = await res.text().catch(() => '')
      let msg
      try { msg = JSON.parse(raw)?.error || raw } catch { msg = raw }
      throw new Error(`Lỗi ${res.status}: ${msg}`)
    }
    const newItem = mapId(await res.json())
    SETTERS[type](p => { const list = [newItem, ...p]; lsSave(type, list); return list })
    return newItem
  }

  const updateItem = async (type, id, data) => {
    const ep = ENDPOINTS[type]
    if (!ep) throw new Error(`Unknown type: ${type}`)
    let res
    try {
      res = await fetch(`${API}/api/${ep}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(10000),
      })
    } catch {
      // Offline fallback — update locally
      const updated = { ...data, id }
      if (SETTERS[type]) {
        SETTERS[type](list => { const next = list.map(i => i.id === id ? { ...i, ...data } : i); lsSave(type, next); return next })
      }
      return updated
    }
    if (!res.ok) {
      const raw = await res.text().catch(() => '')
      let msg
      try { msg = JSON.parse(raw)?.error || raw } catch { msg = raw }
      throw new Error(`Lỗi ${res.status}: ${msg}`)
    }
    const updated = mapId(await res.json())
    SETTERS[type](list => { const next = list.map(i => i.id === id ? updated : i); lsSave(type, next); return next })
    return updated
  }

  const deleteItem = async (type, id) => {
    const ep = ENDPOINTS[type]
    if (!ep) throw new Error(`Unknown type: ${type}`)
    try {
      await fetch(`${API}/api/${ep}/${id}`, { method: 'DELETE', signal: AbortSignal.timeout(5000) })
    } catch { /* offline — still remove from local */ }
    SETTERS[type](p => { const next = p.filter(i => i.id !== id); lsSave(type, next); return next })
    lsDelete(type, id)
  }

  return (
    <DataContext.Provider value={{
      posts, products, tours, workshops, libraryItems, reviews, communityImages,
      loading, offline, addItem, updateItem, deleteItem,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
