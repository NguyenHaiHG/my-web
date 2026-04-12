import { createContext, useContext, useState } from 'react'

const UIContext = createContext(null)

export function UIProvider({ children }) {
  const [toast, setToast] = useState('')
  const [adminModal, setAdminModal] = useState(null) // 'tour' | 'product' | 'post'
  const [detailItem, setDetailItem] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [showCart, setShowCart] = useState(false)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  return (
    <UIContext.Provider value={{
      toast, showToast,
      adminModal, setAdminModal,
      detailItem, setDetailItem,
      showLogin, setShowLogin,
      showCart, setShowCart,
    }}>
      {children}
    </UIContext.Provider>
  )
}

export const useUI = () => useContext(UIContext)
