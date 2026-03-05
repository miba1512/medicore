const Page = ({ title, icon }) => (
    <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{icon} {title}</h2>
        <p style={{ color: 'var(--text-muted)' }}>This section is under construction.</p>
    </div>
)

export function Dashboard() { return <Page title="Dashboard" icon="📊" /> }
export function Patients() { return <Page title="Patients" icon="🧑‍⚕️" /> }
export function Doctors() { return <Page title="Doctors" icon="👨‍⚕️" /> }
export function Appointments() { return <Page title="Appointments" icon="📅" /> }
export function Prescriptions() { return <Page title="Prescriptions" icon="💊" /> }
export function Consultation() { return <Page title="Consultations" icon="🩺" /> }
export function AIAssistant() { return <Page title="AI Assistant" icon="🤖" /> }
export function Records() { return <Page title="Records" icon="📁" /> }
export function Billing() { return <Page title="Billing" icon="💳" /> }
export function Search() { return <Page title="Search" icon="🔍" /> }
export function Notifications() { return <Page title="Notifications" icon="🔔" /> }
export function Settings() { return <Page title="Settings" icon="⚙️" /> }
