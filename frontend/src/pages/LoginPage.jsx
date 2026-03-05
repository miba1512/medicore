import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useAuthStore } from '../hooks/useAuthStore'

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { setAuth } = useAuthStore()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true); setError('')
        try {
            const { data } = await authAPI.login(form)
            setAuth(data.token, data.user)
            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed')
        } finally { setLoading(false) }
    }

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #0d1117 0%, #141c2e 100%)',
        }}>
            <div style={{
                width: 380, padding: 40, background: 'var(--bg-card)',
                borderRadius: 16, border: '1px solid var(--border)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            }}>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>🏥 MediCore</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Sign in to continue</p>

                {error && <p style={{ color: 'var(--danger)', marginBottom: 16, fontSize: 14 }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="email" placeholder="Email" value={form.email} required
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        style={inputStyle}
                    />
                    <input
                        type="password" placeholder="Password" value={form.password} required
                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                        style={{ ...inputStyle, marginTop: 12 }}
                    />
                    <button type="submit" disabled={loading} style={btnStyle}>
                        {loading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    )
}

const inputStyle = {
    width: '100%', padding: '12px 14px', background: 'var(--bg-secondary)',
    border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)',
    fontSize: 14, outline: 'none',
}
const btnStyle = {
    width: '100%', marginTop: 20, padding: '12px', background: 'var(--accent)',
    color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600,
}
