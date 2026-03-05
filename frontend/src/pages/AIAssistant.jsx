import { useState } from 'react'

export function AIAssistant() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your AI clinical assistant. How can I help you today?' }
    ])
    const [input, setInput] = useState('')

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
            <div className="page-header">
                <h1 className="page-title">🤖 AI Assistant</h1>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-card)', borderRadius: 10, padding: 20, marginBottom: 20, border: '1px solid var(--border)' }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{
                        display: 'flex', marginBottom: 16,
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                    }}>
                        <div style={{
                            maxWidth: '70%', padding: '12px 16px', borderRadius: 8,
                            background: msg.role === 'user' ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                            color: msg.role === 'user' ? '#fff' : 'var(--text-primary)'
                        }}>
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
                <input
                    type="text" value={input} onChange={e => setInput(e.target.value)}
                    placeholder="Ask a clinical question or summarize records..."
                    style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'white', outline: 'none' }}
                />
                <button className="btn-primary" onClick={() => {
                    if (!input.trim()) return
                    setMessages([...messages, { role: 'user', content: input }, { role: 'assistant', content: 'This feature will be connected to Anthropic API shortly.' }])
                    setInput('')
                }}>Send</button>
            </div>
        </div>
    )
}
