import { createContext, useContext, useState, useEffect } from 'react'
import { API, apiFetch, responseError } from '../utils/api'

const DataContext = createContext(null)

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
function lsDelete(type, id) {
  lsSave(type, lsLoad(type).filter(i => i.id !== id))
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
      res = await apiFetch(`/api/${ep}`, {
        method: 'POST',
        body: JSON.stringify(item),
        signal: AbortSignal.timeout(10000),
      })
    } catch {
      throw new Error('Không kết nối được server — dữ liệu chưa được lưu')
    }
    if (!res.ok) {
      throw await responseError(res, 'Không thể thêm dữ liệu')
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
      res = await apiFetch(`/api/${ep}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(10000),
      })
    } catch {
      throw new Error('Không kết nối được server — thay đổi chưa được lưu')
    }
    if (!res.ok) {
      throw await responseError(res, 'Không thể cập nhật dữ liệu')
    }
    const updated = mapId(await res.json())
    SETTERS[type](list => { const next = list.map(i => i.id === id ? updated : i); lsSave(type, next); return next })
    return updated
  }

  const deleteItem = async (type, id) => {
    const ep = ENDPOINTS[type]
    if (!ep) throw new Error(`Unknown type: ${type}`)
    let response
    try {
      response = await apiFetch(`/api/${ep}/${id}`, { method: 'DELETE', signal: AbortSignal.timeout(5000) })
    } catch {
      throw new Error('Không kết nối được server — dữ liệu chưa bị xóa')
    }
    if (!response.ok) throw await responseError(response, 'Không thể xóa dữ liệu')
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
