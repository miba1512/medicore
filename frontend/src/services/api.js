import axios from 'axios'
import { useAuthStore } from '../hooks/useAuthStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://medicore-api.onrender.com/api',
  timeout: 15000,
})

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
}

// ── Patients ──────────────────────────────────────────────────
export const patientAPI = {
  getAll: (params) => api.get('/patients', { params }),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
  search: (q) => api.get('/patients/search', { params: { q } }),
}

// ── Doctors ───────────────────────────────────────────────────
export const doctorAPI = {
  getAll: (params) => api.get('/doctors', { params }),
  getById: (id) => api.get(`/doctors/${id}`),
  create: (data) => api.post('/doctors', data),
  update: (id, data) => api.put(`/doctors/${id}`, data),
  getSchedule: (id) => api.get(`/doctors/${id}/schedule`),
}

// ── Appointments ──────────────────────────────────────────────
export const appointmentAPI = {
  getAll: (params) => api.get('/appointments', { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  cancel: (id) => api.patch(`/appointments/${id}/cancel`),
  reschedule: (id, data) => api.patch(`/appointments/${id}/reschedule`, data),
}

// ── Prescriptions ─────────────────────────────────────────────
export const prescriptionAPI = {
  getAll: (params) => api.get('/prescriptions', { params }),
  getById: (id) => api.get(`/prescriptions/${id}`),
  create: (data) => api.post('/prescriptions', data),
  update: (id, data) => api.put(`/prescriptions/${id}`, data),
  getPDF: (id) => api.get(`/prescriptions/${id}/pdf`, { responseType: 'blob' }),
}

// ── Consultations ─────────────────────────────────────────────
export const consultationAPI = {
  getAll: (params) => api.get('/consultations', { params }),
  getById: (id) => api.get(`/consultations/${id}`),
  create: (data) => api.post('/consultations', data),
  update: (id, data) => api.put(`/consultations/${id}`, data),
  summarise: (id) => api.post(`/consultations/${id}/summarise`),
}

// ── Medical Records ───────────────────────────────────────────
export const recordAPI = {
  getAll: (params) => api.get('/records', { params }),
  getById: (id) => api.get(`/records/${id}`),
  upload: (formData) => api.post('/records/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/records/${id}`),
  summarise: (id) => api.post(`/records/${id}/summarise`),
}

// ── Billing ───────────────────────────────────────────────────
export const billingAPI = {
  getAll: (params) => api.get('/billing', { params }),
  getById: (id) => api.get(`/billing/${id}`),
  create: (data) => api.post('/billing', data),
  markPaid: (id) => api.patch(`/billing/${id}/pay`),
  getInvoice: (id) => api.get(`/billing/${id}/invoice`, { responseType: 'blob' }),
}

// ── AI ────────────────────────────────────────────────────────
export const aiAPI = {
  chat: (messages, patientId) => api.post('/ai/chat', { messages, patientId }),
  search: (query) => api.post('/ai/search', { query }),
}

// ── Notifications ─────────────────────────────────────────────
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  dismiss: (id) => api.patch(`/notifications/${id}/dismiss`),
  markAll: () => api.patch('/notifications/mark-all-read'),
}

export default api
