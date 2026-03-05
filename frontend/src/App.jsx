import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './hooks/useAuthStore'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import {
  Dashboard, Patients, Doctors, Appointments,
  Prescriptions, Consultation, AIAssistant,
  Records, Billing, Search, Notifications, Settings,
} from './pages/index.jsx'

function PrivateRoute({ children }) {
  const { token } = useAuthStore()
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="prescriptions" element={<Prescriptions />} />
        <Route path="consultation" element={<Consultation />} />
        <Route path="ai" element={<AIAssistant />} />
        <Route path="records" element={<Records />} />
        <Route path="billing" element={<Billing />} />
        <Route path="search" element={<Search />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
