import { useQuery } from '@tanstack/react-query'
import { patientAPI } from '../services/api'

export function Patients() {
    const { data, isLoading } = useQuery({ queryKey: ['patients'], queryFn: () => patientAPI.getAll() })

    return (
        <div>
            <div className="page-header" style={{ marginBottom: 24, borderBottom: 'none' }}>
                <div>
                    <h1 className="page-title" style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Patient Management</h1>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Track And Manage All Your Patients In One Place.</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 24, padding: '16px', background: 'white', borderRadius: 12, border: '1px solid var(--border)' }}>
                <input className="form-input" style={{ flex: 1, maxWidth: 200 }} type="date" />
                <input className="form-input" style={{ flex: 2 }} type="text" placeholder="Search name, phone number" />
                <button className="btn-success">Search</button>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 12, flex: 1 }}>
                    <select className="form-input" style={{ maxWidth: 200, cursor: 'pointer' }}>
                        <option>Priority: Select</option>
                        <option>High</option>
                        <option>Medium</option>
                    </select>
                    <select className="form-input" style={{ maxWidth: 200, cursor: 'pointer' }}>
                        <option>Unit: Select</option>
                        <option>Homecare</option>
                    </select>
                    <button style={{ background: 'none', border: 'none', color: 'var(--danger)', fontWeight: 600, fontSize: 13 }}>Clear Filter</button>
                </div>
                <button className="btn-success" style={{ marginLeft: 'auto' }}>+ Create Patient</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: 60, textAlign: 'center' }}>S.No</th>
                            <th>Patient ID</th>
                            <th>Patient Name</th>
                            <th>Priority</th>
                            <th>Contact Number</th>
                            <th>Created</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? <tr><td colSpan="8" style={{ textAlign: 'center', padding: 40 }}>Loading...</td></tr> :
                            data?.data?.data?.length > 0 ? data.data.data.map((p, index) => (
                                <tr key={p._id}>
                                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{index + 1}</td>
                                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>PT{p._id.slice(-4).toUpperCase()}</td>
                                    <td>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.user?.name || '---'}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.gender} · {p.age} Years</div>
                                    </td>
                                    <td><span style={{ color: p.bloodGroup ? 'var(--danger)' : 'var(--warning)', fontWeight: 500 }}>High</span></td>
                                    <td style={{ fontWeight: 500 }}>{p.contactNumber || '---'}</td>
                                    <td>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>admin</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>05/03/2026, 07:18 PM</div>
                                    </td>
                                    <td><span className="badge success">Registered</span></td>
                                    <td style={{ textAlign: 'center', fontSize: 18, color: 'var(--info)', cursor: 'pointer' }}>👁️</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No patients found in database.</td></tr>
                            )}
                    </tbody>
                </table>
            </div>

            {/* Pagination mock to match page */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', marginTop: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                    Rows per page
                    <select className="form-input" style={{ width: 60, padding: '4px 8px' }}><option>10</option></select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: 'var(--text-primary)' }}>
                    <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>&lt; &lt;</button>
                    <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>&lt;</button>
                    Page 1 of 124
                    <button style={{ border: 'none', background: 'none', cursor: 'pointer' }}>&gt;</button>
                    <button style={{ border: 'none', background: 'none', cursor: 'pointer' }}>&gt; &gt;</button>
                </div>
            </div>
        </div>
    )
}
