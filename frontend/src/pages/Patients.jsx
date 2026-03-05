import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { patientAPI } from '../services/api'
import toast from 'react-hot-toast'

export function Patients() {
    const queryClient = useQueryClient()
    const { data, isLoading } = useQuery({ queryKey: ['patients'], queryFn: () => patientAPI.getAll() })

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({ name: '', email: '', dob: '', gender: 'M', phone: '', blood: '' })

    // Create Mutation
    const createMutation = useMutation({
        mutationFn: (newPatient) => patientAPI.create(newPatient),
        onSuccess: () => {
            toast.success('Patient created successfully!')
            queryClient.invalidateQueries(['patients'])
            setIsModalOpen(false)
            setFormData({ name: '', email: '', dob: '', gender: 'M', phone: '', blood: '' })
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to create patient')
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        createMutation.mutate(formData)
    }

    return (
        <div>
            {/* ── HEADER ── */}
            <div className="page-header" style={{ marginBottom: 24, borderBottom: 'none' }}>
                <div>
                    <h1 className="page-title" style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Patient Management</h1>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Track And Manage All Your Patients In One Place.</p>
                </div>
            </div>

            {/* ── SEARCH BAR ── */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, padding: '16px', background: 'white', borderRadius: 12, border: '1px solid var(--border)' }}>
                <input className="form-input" style={{ flex: 1, maxWidth: 200 }} type="date" />
                <input className="form-input" style={{ flex: 2 }} type="text" placeholder="Search name, phone number" />
                <button className="btn-success">Search</button>
            </div>

            {/* ── FILTER & ACTIONS ── */}
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

                {/* ACTION BUTTON TO OPEN MODAL */}
                <button className="btn-success" style={{ marginLeft: 'auto' }} onClick={() => setIsModalOpen(true)}>
                    + Create Patient
                </button>
            </div>

            {/* ── TABLE ── */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: 60, textAlign: 'center' }}>S.No</th>
                            <th>Patient ID</th>
                            <th>Patient Name</th>
                            <th>Priority</th>
                            <th>Contact Number</th>
                            <th>Created By</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? <tr><td colSpan="8" style={{ textAlign: 'center', padding: 40 }}>Loading...</td></tr> :
                            data?.data?.data?.length > 0 ? data.data.data.map((p, index) => (
                                <tr key={p._id}>
                                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{index + 1}</td>
                                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.patientId || ('PT' + p._id.slice(-4).toUpperCase())}</td>
                                    <td>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name || '---'}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.gender === 'M' ? 'Male' : p.gender === 'F' ? 'Female' : 'Other'} · {p.age || 0} Years</div>
                                    </td>
                                    <td><span style={{ color: p.blood ? 'var(--danger)' : 'var(--warning)', fontWeight: 500 }}>High</span></td>
                                    <td style={{ fontWeight: 500 }}>{p.phone || '---'}</td>
                                    <td>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>admin</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(p.createdAt || Date.now()).toLocaleString()}</div>
                                    </td>
                                    <td><span className={`badge ${p.status === 'Active' ? 'success' : 'warning'}`}>{p.status || 'Active'}</span></td>
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

            {/* ── CREATE PATIENT MODAL ── */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
                }}>
                    <div style={{
                        background: 'white', padding: 32, borderRadius: 16, width: '100%', maxWidth: 500,
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
                    }}>
                        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>Register New Patient</h2>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label className="form-label">Full Name</label>
                                <input required type="text" className="form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. John Doe" />
                            </div>

                            <div>
                                <label className="form-label">Email Address</label>
                                <input type="email" className="form-input" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="e.g. john@example.com" />
                            </div>

                            <div style={{ display: 'flex', gap: 16 }}>
                                <div style={{ flex: 1 }}>
                                    <label className="form-label">Date of Birth</label>
                                    <input required type="date" className="form-input" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="form-label">Gender</label>
                                    <select className="form-input" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 16 }}>
                                <div style={{ flex: 1 }}>
                                    <label className="form-label">Contact Number</label>
                                    <input required type="text" className="form-input" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="e.g. +91 9876543210" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="form-label">Blood Group</label>
                                    <select className="form-input" value={formData.blood} onChange={e => setFormData({ ...formData, blood: e.target.value })}>
                                        <option value="">Unknown</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 24 }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 16px', border: '1px solid var(--border)', background: 'white', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" disabled={createMutation.isLoading || createMutation.isPending} className="btn-success" style={{ padding: '10px 24px', borderRadius: 8, cursor: 'pointer' }}>
                                    {(createMutation.isLoading || createMutation.isPending) ? 'Saving...' : 'Save Patient'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}
