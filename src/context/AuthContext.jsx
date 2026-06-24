import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { authService } from '../services/authService.js'
import { getToken, removeToken, saveToken } from '../utils/TokenUtilities.js'

const AuthContext = createContext(null)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(getToken()))
  const clear = useCallback(() => {
    removeToken()
    setUser(null)
    setLoading(false)
  }, [])
  const refresh = useCallback(async () => {
    if (!getToken()) {
      setLoading(false)
      return null
    }
    setLoading(true)
    try {
      const current = await authService.me()
      setUser(current)
      return current
    } catch {
      clear()
      return null
    } finally {
      setLoading(false)
    }
  }, [clear])
  useEffect(() => {
    refresh()
  }, [refresh])
  useEffect(() => {
    window.addEventListener('auth:unauthorized', clear)
    return () => window.removeEventListener('auth:unauthorized', clear)
  }, [clear])
  const login = async (credentials) => {
    const result = await authService.login(credentials.email, credentials.password)
    saveToken(result.access_token)
    return refresh()
  }
  const logout = async () => {
    try {
      await authService.logout()
    } catch {
      /* local logout still applies */
    }
    clear()
  }
  return (
    <AuthContext.Provider
      value={{ user, loading, authenticated: Boolean(user && getToken()), login, logout, refresh }}
    >
      {children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => useContext(AuthContext)
