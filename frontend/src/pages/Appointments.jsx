import { useQuery } from '@tanstack/react-query'
import { appointmentAPI } from '../services/api'

export function Appointments() {
    const { data, isLoading } = useQuery({ queryKey: ['appointments'], queryFn: () => appointmentAPI.getAll() })

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">📅 Appointments</h1>
                <button className="btn-primary">+ New Appointment</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Date & Time</th>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Type</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading...</td></tr> :
                            data?.data?.data?.length > 0 ? data.data.data.map(a => (
                                <tr key={a._id}>
                                    <td style={{ fontWeight: 600 }}>{new Date(a.date).toLocaleDateString()} at {a.time}</td>
                                    <td>{a.patient?.name || '---'}</td>
                                    <td>{a.doctor?.name || '---'}</td>
                                    <td><span className="badge info">{a.type}</span></td>
                                    <td>
                                        <span className={`badge ${a.status === 'Completed' ? 'success' : a.status === 'Cancelled' ? 'danger' : 'warning'}`}>
                                            {a.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>No appointments scheduled.</td></tr>
                            )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
