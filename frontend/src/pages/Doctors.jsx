import { useQuery } from '@tanstack/react-query'
import { doctorAPI } from '../services/api'

export function Doctors() {
    const { data, isLoading } = useQuery({ queryKey: ['doctors'], queryFn: () => doctorAPI.getAll() })

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">👨‍⚕️ Doctors</h1>
                <button className="btn-primary">+ Add Doctor</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Specialization</th>
                            <th>Experience</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading...</td></tr> :
                            data?.data?.data?.length > 0 ? data.data.data.map(d => (
                                <tr key={d._id}>
                                    <td style={{ color: 'var(--text-muted)' }}>{d._id.slice(-6)}</td>
                                    <td style={{ fontWeight: 600 }}>{d.user?.name || '---'}</td>
                                    <td><span className="badge info">{d.specialization}</span></td>
                                    <td>{d.experienceYears} Years</td>
                                    <td>⭐ {d.rating}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>No doctors found.</td></tr>
                            )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
