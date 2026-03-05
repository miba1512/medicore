import { useQuery } from '@tanstack/react-query'
import { billingAPI } from '../services/api'

export function Billing() {
    const { data, isLoading } = useQuery({ queryKey: ['billing'], queryFn: () => billingAPI.getAll() })

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">💳 Billing & Invoices</h1>
                <button className="btn-primary">+ Generate Invoice</button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Invoice Date</th>
                            <th>Patient</th>
                            <th>Total Amount</th>
                            <th>Paid Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading...</td></tr> :
                            data?.data?.data?.length > 0 ? data.data.data.map(b => (
                                <tr key={b._id}>
                                    <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                                    <td style={{ fontWeight: 600 }}>{b.patient?.name || '---'}</td>
                                    <td>${b.totalAmount?.toFixed(2)}</td>
                                    <td>${b.paidAmount?.toFixed(2)}</td>
                                    <td>
                                        <span className={`badge ${b.status === 'Paid' ? 'success' : b.status === 'Partially Paid' ? 'warning' : 'danger'}`}>
                                            {b.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '30px' }}>No invoices found.</td></tr>
                            )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
