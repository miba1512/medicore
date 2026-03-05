import { useQuery } from '@tanstack/react-query'
import { consultationAPI } from '../services/api'

export function Consultation() {
    const { data, isLoading } = useQuery({ queryKey: ['consultations'], queryFn: () => consultationAPI.getAll() })

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">🩺 Consultations</h1>
                <button className="btn-primary">+ Start Consultation</button>
            </div>

            <div className="grid-cards">
                {isLoading ? <p>Loading...</p> : data?.data?.data?.length > 0 ? data.data.data.map(c => (
                    <div key={c._id} className="card">
                        <h3 style={{ fontSize: 18, fontWeight: 600 }}>{c.patient?.name}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>Dr. {c.doctor?.name}</p>
                        <p style={{ fontSize: 14 }}><strong>Symptoms:</strong> {c.symptoms}</p>
                        <p style={{ fontSize: 14 }}><strong>Diagnosis:</strong> {c.diagnosis}</p>
                        <button className="btn-primary" style={{ marginTop: 'auto' }}>View Notes</button>
                    </div>
                )) : (
                    <p style={{ color: 'var(--text-muted)' }}>No past consultations.</p>
                )}
            </div>
        </div>
    )
}
