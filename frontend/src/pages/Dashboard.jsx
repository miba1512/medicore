import { useQuery } from '@tanstack/react-query'
import { patientAPI, doctorAPI, appointmentAPI } from '../services/api'

export function Dashboard() {
    const { data: pData } = useQuery({ queryKey: ['patients'], queryFn: () => patientAPI.getAll() })
    const { data: dData } = useQuery({ queryKey: ['doctors'], queryFn: () => doctorAPI.getAll() })
    const { data: aData } = useQuery({ queryKey: ['appointments'], queryFn: () => appointmentAPI.getAll() })

    const patientsCount = pData?.data?.total || 0
    const doctorsCount = dData?.data?.total || 0
    const appointmentsCount = aData?.data?.total || 0

    return (
        <div>
            <div className="page-header" style={{ marginBottom: 32 }}>
                <div>
                    <h1 className="page-title" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Dashboard Overview</h1>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Track And Manage All Your Data In One Place.</p>
                </div>
            </div>

            {/* Styled Grid matched to the screenshot */}
            <div className="grid-cards" style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                {/* Card 1 */}
                <div className="card" style={{ flex: '1 1 200px', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: '16px 24px', border: '1.5px solid #d8b4fe' }}>
                    <div style={{ marginRight: 16, fontSize: 24, padding: 12, background: '#f3e8ff', color: '#8b5cf6', borderRadius: '50%' }}>🧑‍⚕️</div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{patientsCount}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Patients</div>
                    </div>
                </div>
                {/* Card 2 */}
                <div className="card" style={{ flex: '1 1 200px', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: '16px 24px' }}>
                    <div style={{ marginRight: 16, fontSize: 24, padding: 12, background: '#e0e7ff', color: '#4f46e5', borderRadius: '50%' }}>👨‍⚕️</div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#4f46e5' }}>{doctorsCount}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Available Doctors</div>
                    </div>
                </div>
                {/* Card 3 */}
                <div className="card" style={{ flex: '1 1 200px', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: '16px 24px' }}>
                    <div style={{ marginRight: 16, fontSize: 24, padding: 12, background: '#ede9fe', color: '#7c3aed', borderRadius: '50%' }}>📅</div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#7c3aed' }}>{appointmentsCount}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Appointments</div>
                    </div>
                </div>
                {/* Card 4 */}
                <div className="card" style={{ flex: '1 1 200px', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: '16px 24px' }}>
                    <div style={{ marginRight: 16, fontSize: 24, padding: 12, background: '#dcfce7', color: '#16a34a', borderRadius: '50%' }}>💳</div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#16a34a' }}>995</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Completed</div>
                    </div>
                </div>
                {/* Card 5 */}
                <div className="card" style={{ flex: '1 1 200px', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: '16px 24px' }}>
                    <div style={{ marginRight: 16, fontSize: 24, padding: 12, background: '#fef3c7', color: '#d97706', borderRadius: '50%' }}>💰</div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#d97706' }}>11</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Unpaid Invoices</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                <input className="form-input" style={{ flex: 1, maxWidth: 300, background: 'white' }} type="date" />
                <input className="form-input" style={{ flex: 2, background: 'white' }} type="text" placeholder="Search name, phone number..." />
                <button className="btn-success">Search</button>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center' }}>
                <button className="btn-success" style={{ marginLeft: 'auto' }}>+ Create Entry</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Date & Time</th>
                            <th>Patient Reference</th>
                            <th>Doctor Assigned</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(aData?.data?.data?.slice(0, 5) || []).map(appt => (
                            <tr key={appt._id}>
                                <td>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{new Date(appt.date).toLocaleDateString()}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{appt.time}</div>
                                </td>
                                <td>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{appt.patient?.name || 'Unknown'}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>ID: {appt.patient?._id?.slice(-6)}</div>
                                </td>
                                <td style={{ fontWeight: 500 }}>{appt.doctor?.name || 'Unknown'}</td>
                                <td><span className={`badge ${appt.status === 'Scheduled' ? 'new' : 'success'}`}>{appt.status}</span></td>
                                <td style={{ textAlign: 'center', fontSize: 18, color: 'var(--info)', cursor: 'pointer' }}>👁️</td>
                            </tr>
                        ))}
                        {(!aData?.data?.data || aData.data.data.length === 0) && (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>No recent activity to display.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
