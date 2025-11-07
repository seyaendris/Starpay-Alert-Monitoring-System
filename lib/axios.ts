import axios, { AxiosError } from "axios"
import { API_BASE_URL } from "./config"
import { useAuthStore } from "@/store/authStore"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 8000,
})

axios.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const { logout } = useAuthStore.getState()
    if (error.response?.status === 401) {
      // optionally: toast, redirect to /login, etc.
      logout()
    }
    return Promise.reject(error)
  }
)

export default api
