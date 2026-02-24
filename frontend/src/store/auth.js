import axios from 'axios'
import { create } from 'zustand'

axios.defaults.baseURL = 'http://127.0.0.1:8000/api'
axios.defaults.headers.common['Accept'] = 'application/json'

const savedToken = localStorage.getItem('token')
if (savedToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
}

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: savedToken || null,
  loading: false,
  error: null,

  isAuthenticated: () => !!get().token,
  isAdmin: () => get().user?.role === 'admin',

  login: async (credentials) => {
    set({ loading: true, error: null })
    try {
      const response = await axios.post('/login', credentials)
      const { token, user } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      set({ token, user, loading: false })
      return true
    } catch (err) {
      set({
        error:
          err.response?.data?.message ||
          err.response?.data?.email?.[0] ||
          'Error al iniciar sesión',
        loading: false,
      })
      return false
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null })
    try {
      const response = await axios.post('/register', userData)
      const { token, user } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      set({ token, user, loading: false })
      return true
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Error al registrarse',
        loading: false,
      })
      return false
    }
  },

  logout: async () => {
    try {
      if (get().token) {
        await axios.post('/logout')
      }
    } catch (e) {
      console.error('Error logging out from server', e)
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
    set({ user: null, token: null })
  },
}))
