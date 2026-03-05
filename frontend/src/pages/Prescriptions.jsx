import { useQuery } from '@tanstack/react-query'
import { prescriptionAPI } from '../services/api'

export function Prescriptions() {
    const { data, isLoading } = useQuery({ queryKey: ['prescriptions'], queryFn: () => prescriptionAPI.getAll() })

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">💊 Prescriptions</h1>
                <button className="btn-primary">+ Write Prescription</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Diagnosis</th>
                            <th>Medicines</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading...</td></tr> :
                            data?.data?.data?.length > 0 ? data.data.data.map(p => (
                                <tr key={p._id}>
                                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                    <td style={{ fontWeight: 600 }}>{p.patient?.name || '---'}</td>
                                    <td>{p.doctor?.name || '---'}</td>
                                    <td>{p.diagnosis}</td>
                                    <td>{p.medicines?.length || 0}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>No prescriptions found.</td></tr>
                            )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
