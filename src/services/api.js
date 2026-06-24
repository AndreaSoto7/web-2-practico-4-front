import axios from 'axios'
import { getToken, removeToken } from '../utils/TokenUtilities.js'

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')

const api = axios.create({ baseURL: API_URL })
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && getToken()) {
      removeToken()
      window.dispatchEvent(new Event('auth:unauthorized'))
    }
    return Promise.reject(error)
  },
)

export const errorMessage = (error, fallback = 'Ocurrió un error inesperado') => {
  const message = error.response?.data?.message
  return Array.isArray(message) ? message.join('. ') : message || fallback
}
export const posterUrl = (movie) => (movie?.id ? `${API_URL}/peliculas/${movie.id}/poster` : '')
export default api
