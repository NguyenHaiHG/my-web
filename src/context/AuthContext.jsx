import { createContext, useContext, useEffect, useState } from 'react'
import { apiFetch, getAuthToken, responseError, setAuthToken } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(() => !!getAuthToken())
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    localStorage.removeItem('htx_truonghai_auth_user')
    const token = getAuthToken()
    if (!token) {
      setAuthLoading(false)
      return
    }

    apiFetch('/api/auth/me')
      .then(async response => {
        if (!response.ok) throw await responseError(response, 'Không thể xác minh phiên đăng nhập')
        const data = await response.json()
        setUser(data.user)
        window.dispatchEvent(new CustomEvent('admin-authenticated'))
      })
      .catch(() => {
        setAuthToken('')
        setUser(null)
      })
      .finally(() => setAuthLoading(false))
  }, [])

  useEffect(() => {
    const expire = () => setUser(null)
    window.addEventListener('admin-session-expired', expire)
    return () => window.removeEventListener('admin-session-expired', expire)
  }, [])

  const login = async (username, password) => {
    setLoginError('')
    try {
      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        auth: false,
        body: JSON.stringify({ username, password }),
      })
      if (!response.ok) throw await responseError(response, 'Không thể đăng nhập')
      const data = await response.json()
      setAuthToken(data.token)
      setUser(data.user)
      window.dispatchEvent(new CustomEvent('admin-authenticated'))
      setLoginError('')
      return true
    } catch (err) {
      setLoginError(err?.message || 'Không thể đăng nhập')
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setAuthToken('')
  }

  const changePassword = async (currentPassword, newPassword) => {
    const response = await apiFetch('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    if (!response.ok) throw await responseError(response, 'Không thể đổi mật khẩu')
    return true
  }

  const isAdmin = user?.role === 'admin'
  const isMod = isAdmin

  return (
    <AuthContext.Provider value={{ user, login, logout, changePassword, loginError, setLoginError, authLoading, isAdmin, isMod }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
