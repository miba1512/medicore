import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../hooks/useAuthStore'

const nav = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/patients', label: 'Patients', icon: '🧑‍⚕️' },
    { to: '/doctors', label: 'Doctors', icon: '👨‍⚕️' },
    { to: '/appointments', label: 'Appointments', icon: '📅' },
    { to: '/prescriptions', label: 'Prescriptions', icon: '💊' },
    { to: '/consultation', label: 'Consultations', icon: '🩺' },
    { to: '/records', label: 'Records', icon: '📁' },
    { to: '/billing', label: 'Billing', icon: '💳' },
    { to: '/ai', label: 'AI Assistant', icon: '🤖' },
    { to: '/notifications', label: 'Notifications', icon: '🔔' },
    { to: '/settings', label: 'Settings', icon: '⚙️' },
]

export default function Layout() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = () => { logout(); navigate('/login') }

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-app)' }}>
            {/* Sidebar - Dark theme like the design */}
            <aside style={{
                width: 250,
                background: 'var(--sidebar-bg)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
            }}>
                <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: 32, height: 32, background: 'white', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 700, fontSize: 18 }}>
                        M
                    </div>
                    <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: 0.5, color: 'white' }}>MediCore</h1>
                </div>

                <div style={{ padding: '0 24px', marginBottom: 20 }}>
                    <p style={{ fontSize: 12, color: 'var(--sidebar-text)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Main Menu</p>
                </div>

                <nav style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
                    {nav.map(({ to, label, icon }) => (
                        <NavLink key={to} to={to} style={({ isActive }) => ({
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '12px 16px', margin: '4px 0', borderRadius: 8,
                            fontSize: 14, fontWeight: 500,
                            color: isActive ? 'var(--sidebar-active-text)' : 'var(--sidebar-text)',
                            background: isActive ? 'var(--sidebar-active-bg)' : 'transparent',
                            transition: 'all 0.2s ease',
                        })}
                            onMouseEnter={(e) => {
                                if (e.target.style.background === 'transparent') {
                                    e.target.style.color = 'white';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (e.target.style.background === 'transparent') {
                                    e.target.style.color = 'var(--sidebar-text)';
                                }
                            }}>
                            <span style={{ fontSize: 18 }}>{icon}</span>
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div style={{ padding: '20px' }}>
                    <button onClick={handleLogout} style={{
                        width: '100%', padding: '12px', background: 'transparent',
                        color: 'var(--sidebar-text)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                        onMouseEnter={(e) => { e.target.style.background = 'rgba(239, 68, 68, 0.1)'; e.target.style.color = '#ef4444'; e.target.style.borderColor = 'rgba(239, 68, 68, 0.2)'; }}
                        onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--sidebar-text)'; e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                {/* Top Header */}
                <header style={{
                    height: 72, background: 'var(--bg-card)',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 32px', flexShrink: 0
                }}>
                    <div>
                        <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Welcome back,</span>
                        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name || 'Administrator'}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <span style={{ fontSize: 20, cursor: 'pointer', position: 'relative' }}>
                            🔔
                            <span style={{ position: 'absolute', top: -2, right: -4, background: 'var(--danger)', width: 8, height: 8, borderRadius: '50%' }}></span>
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
