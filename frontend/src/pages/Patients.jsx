import { useQuery } from '@tanstack/react-query'
import { patientAPI } from '../services/api'

export function Patients() {
    const { data, isLoading } = useQuery({ queryKey: ['patients'], queryFn: () => patientAPI.getAll() })

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">🧑‍⚕️ Patients</h1>
                <button className="btn-primary">+ Add Patient</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Age/Gender</th>
                            <th>Phone</th>
                            <th>Blood Group</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading...</td></tr> :
                            data?.data?.data?.length > 0 ? data.data.data.map(p => (
                                <tr key={p._id}>
                                    <td style={{ color: 'var(--text-muted)' }}>{p._id.slice(-6)}</td>
                                    <td style={{ fontWeight: 600 }}>{p.user?.name || '---'}</td>
                                    <td>{p.age} / {p.gender}</td>
                                    <td>{p.contactNumber || '---'}</td>
                                    <td>{p.bloodGroup || '---'}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>No patients found.</td></tr>
                            )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
