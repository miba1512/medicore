import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../hooks/useAuthStore'

const nav = [
    { to: '/dashboard', label: '📊 Dashboard' },
    { to: '/patients', label: '🧑‍⚕️ Patients' },
    { to: '/doctors', label: '👨‍⚕️ Doctors' },
    { to: '/appointments', label: '📅 Appointments' },
    { to: '/prescriptions', label: '💊 Prescriptions' },
    { to: '/consultation', label: '🩺 Consultations' },
    { to: '/records', label: '📁 Records' },
    { to: '/billing', label: '💳 Billing' },
    { to: '/ai', label: '🤖 AI Assistant' },
    { to: '/notifications', label: '🔔 Notifications' },
    { to: '/settings', label: '⚙️ Settings' },
]

export default function Layout() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = () => { logout(); navigate('/login') }

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            {/* Sidebar */}
            <aside style={{
                width: 220, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)',
                display: 'flex', flexDirection: 'column', flexShrink: 0,
            }}>
                <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)' }}>
                    <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)' }}>🏥 MediCore</h1>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{user?.name}</p>
                </div>
                <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
                    {nav.map(({ to, label }) => (
                        <NavLink key={to} to={to} style={({ isActive }) => ({
                            display: 'block', padding: '10px 16px', fontSize: 13,
                            color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                            background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
                            borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                            transition: 'all 0.15s',
                        })}>
                            {label}
                        </NavLink>
                    ))}
                </nav>
                <button onClick={handleLogout} style={{
                    margin: 12, padding: '8px 12px', background: 'var(--danger)',
                    color: '#fff', border: 'none', borderRadius: 6, fontSize: 13,
                }}>
                    Logout
                </button>
            </aside>

            {/* Main content */}
            <main style={{ flex: 1, overflowY: 'auto', padding: 24, background: 'var(--bg-primary)' }}>
                <Outlet />
            </main>
        </div>
    )
}
