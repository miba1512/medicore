export function Notifications() {
    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">🔔 Notifications</h1>
                <button className="btn-primary">Mark All as Read</button>
            </div>
            <div className="card">
                <p style={{ color: 'var(--text-muted)' }}>No unread notifications.</p>
            </div>
        </div>
    )
}

export function Settings() {
    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">⚙️ Settings</h1>
                <button className="btn-primary">Save Changes</button>
            </div>
            <div className="card" style={{ maxWidth: 600 }}>
                <h3 style={{ marginBottom: 16 }}>Profile Information</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <label style={{ fontSize: 14 }}>Name</label>
                    <input type="text" defaultValue="Mithun Ramesh" style={{ padding: 10, background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'white', borderRadius: 6 }} />

                    <label style={{ fontSize: 14, marginTop: 10 }}>Email</label>
                    <input type="email" defaultValue="mithunramesh15122003@gmail.com" disabled style={{ padding: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: 6 }} />
                </div>
            </div>
        </div>
    )
}

export function Search() {
    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">🔍 Global Search</h1>
            </div>
            <input type="search" placeholder="Search patients, doctors, records..." style={{ width: '100%', padding: 16, fontSize: 16, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'white', outline: 'none' }} />
            <div style={{ marginTop: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                Type to start searching...
            </div>
        </div>
    )
}
