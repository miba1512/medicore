import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useAuthStore } from '../hooks/useAuthStore'

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
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
            minHeight: '100vh', display: 'flex', alignItems: 'stretch',
            background: '#ffffff', padding: 24, boxSizing: 'border-box'
        }}>
            {/* Container holding both panels */}
            <div style={{
                display: 'flex', width: '100%', maxWidth: 1400, margin: '0 auto',
                background: '#ffffff', borderRadius: 24, overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0,0,0,0.05)'
            }}>

                {/* Left Side - Image Panel */}
                <div style={{
                    flex: 1, backgroundColor: '#f0f4f8', position: 'relative',
                    backgroundImage: 'url("https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2680&auto=format&fit=crop")',
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    borderRadius: 24, overflow: 'hidden'
                }}>
                    {/* Dark Overlay Gradient */}
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                        padding: 48
                    }}>
                        <h1 style={{
                            color: 'white', fontSize: 36, fontWeight: 700, lineHeight: 1.2,
                            marginBottom: 16, maxWidth: 500
                        }}>
                            Comprehensive Healthcare Management Platform
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>
                            Under the expert care of leading medical professionals.
                        </p>
                    </div>
                </div>

                {/* Right Side - Form Panel */}
                <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', padding: '0 10%'
                }}>

                    <div style={{ width: '100%', maxWidth: 420 }}>
                        {/* Logo */}
                        <div style={{ textAlign: 'center', marginBottom: 40 }}>
                            <div style={{
                                width: 56, height: 56, background: 'var(--accent)', color: 'white',
                                borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 32, fontWeight: 800, margin: '0 auto 16px'
                            }}>M</div>
                            <h2 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>MediCore</h2>
                            <p style={{ fontSize: 15, color: 'var(--text-muted)' }}>Welcome Back! Login To Your MediCore Account</p>
                        </div>

                        {error && <div style={{
                            background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)',
                            padding: '12px 16px', borderRadius: 8, marginBottom: 24, fontSize: 14, fontWeight: 500
                        }}>{error}</div>}

                        <form onSubmit={handleSubmit}>
                            {/* Email */}
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                                    Email ID / Username / Phone <span style={{ color: 'var(--danger)' }}>*</span>
                                </label>
                                <input
                                    type="email" placeholder="eg: arunkumar@gmail.com" value={form.email} required
                                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                    style={inputStyle}
                                />
                            </div>

                            {/* Password */}
                            <div style={{ marginBottom: 32 }}>
                                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                                    Password <span style={{ color: 'var(--danger)' }}>*</span>
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? 'text' : 'password'} placeholder="Enter password" value={form.password} required
                                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                        style={{ ...inputStyle, paddingRight: 60 }}
                                    />
                                    <button type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                                            background: 'none', border: 'none', color: 'var(--text-muted)',
                                            fontSize: 13, fontWeight: 500, cursor: 'pointer'
                                        }}>
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>

                            {/* Login Button */}
                            <button type="submit" disabled={loading} style={{
                                width: '100%', padding: '14px', background: 'var(--accent)',
                                color: 'white', border: 'none', borderRadius: 8, fontSize: 16,
                                fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'background 0.2s'
                            }}>
                                {loading ? 'Logging in…' : 'Login'}
                            </button>

                            {/* Forgot Password */}
                            <div style={{ textAlign: 'right', marginTop: 16 }}>
                                <button type="button" style={{
                                    background: 'none', border: 'none', color: 'var(--btn-green)',
                                    fontSize: 14, fontWeight: 600, cursor: 'pointer'
                                }}>
                                    Forgot Password ?
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}

const inputStyle = {
    width: '100%', padding: '14px 16px', background: 'white',
    border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)',
    fontSize: 15, outline: 'none', transition: 'border-color 0.2s',
}
