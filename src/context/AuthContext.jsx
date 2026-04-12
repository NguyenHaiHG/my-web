import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// Tài khoản mẫu (trong thực tế nên dùng backend/database)
const USERS = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Nguyễn Xuân Hải' },
  { id: 2, username: 'mod', password: 'mod123', role: 'mod', name: 'Lộc Như Quỳnh' },
  { id: 3, username: 'user', password: 'user123', role: 'user', name: 'Khách Hàng' },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loginError, setLoginError] = useState('')

  const login = (username, password) => {
    const found = USERS.find(u => u.username === username && u.password === password)
    if (found) {
      setUser(found)
      setLoginError('')
      return true
    }
    setLoginError('Sai tên đăng nhập hoặc mật khẩu!')
    return false
  }

  const logout = () => setUser(null)

  const isAdmin = user?.role === 'admin'
  const isMod = user?.role === 'mod' || user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, login, logout, loginError, setLoginError, isAdmin, isMod }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
