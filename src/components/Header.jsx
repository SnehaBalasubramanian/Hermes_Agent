export default function Header({ title, subtitle }) {
  return (
    <div style={{
      background: '#fff', borderBottom: '1px solid #E5E5E0',
      padding: '14px 24px', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div>
        <h1 style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a' }}>{title}</h1>
        {subtitle && (
          <p style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{subtitle}</p>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '11px', color: '#888' }}>Last scan: 9:00 AM</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px',
          background: '#E1F5EE', padding: '4px 10px', borderRadius: '20px' }}>
          <span style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: '#22c55e', display: 'inline-block',
            animation: 'headerPulse 2s infinite',
          }} />
          <span style={{ fontSize: '11px', color: '#0F6E56', fontWeight: '600' }}>Agent Active</span>
        </div>
      </div>
      <style>{`
        @keyframes headerPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
