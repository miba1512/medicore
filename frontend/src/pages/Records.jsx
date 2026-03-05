import { useQuery } from '@tanstack/react-query'
import { recordAPI } from '../services/api'

export function Records() {
    const { data, isLoading } = useQuery({ queryKey: ['records'], queryFn: () => recordAPI.getAll() })

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">📁 Medical Records</h1>
                <button className="btn-primary">⬆️ Upload Record</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Patient</th>
                            <th>Document Type</th>
                            <th>File Name</th>
                            <th>Uploaded By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading...</td></tr> :
                            data?.data?.data?.length > 0 ? data.data.data.map(r => (
                                <tr key={r._id}>
                                    <td>{new Date(r.uploadedAt).toLocaleDateString()}</td>
                                    <td style={{ fontWeight: 600 }}>{r.patient?.name || '---'}</td>
                                    <td><span className="badge info">{r.recordType}</span></td>
                                    <td>{r.originalFileName}</td>
                                    <td>{r.uploadedBy?.name || '---'}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>No records found.</td></tr>
                            )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
