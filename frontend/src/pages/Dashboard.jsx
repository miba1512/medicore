import { useQuery } from '@tanstack/react-query'
import { patientAPI, doctorAPI, appointmentAPI } from '../services/api'
import { Link } from 'react-router-dom'

export function Dashboard() {
    const { data: pData } = useQuery({ queryKey: ['patients'], queryFn: () => patientAPI.getAll() })
    const { data: dData } = useQuery({ queryKey: ['doctors'], queryFn: () => doctorAPI.getAll() })
    const { data: aData } = useQuery({ queryKey: ['appointments'], queryFn: () => appointmentAPI.getAll() })

    const patientsCount = pData?.data?.total || 0
    const doctorsCount = dData?.data?.total || 0
    const appointmentsCount = aData?.data?.total || 0

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">📊 Dashboard</h1>
            </div>

            <div className="grid-cards">
                <div className="card">
                    <span className="card-title">Total Patients</span>
                    <span className="card-value">{patientsCount}</span>
                </div>
                <div className="card">
                    <span className="card-title">Available Doctors</span>
                    <span className="card-value">{doctorsCount}</span>
                </div>
                <div className="card">
                    <span className="card-title">Upcoming Appointments</span>
                    <span className="card-value">{appointmentsCount}</span>
                </div>
                <div className="card">
                    <span className="card-title">Revenue (MTD)</span>
                    <span className="card-value">$4,250</span>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Date & Time</th>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(aData?.data?.data?.slice(0, 5) || []).map(appt => (
                            <tr key={appt._id}>
                                <td>{new Date(appt.date).toLocaleDateString()} {appt.time}</td>
                                <td>{appt.patient?.name || 'Unknown'}</td>
                                <td>{appt.doctor?.name || 'Unknown'}</td>
                                <td><span className={`badge ${appt.status === 'Scheduled' ? 'success' : 'warning'}`}>{appt.status}</span></td>
                            </tr>
                        ))}
                        {(!aData?.data?.data || aData.data.data.length === 0) && (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No upcoming appointments</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
