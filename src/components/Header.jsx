import { useState, useEffect } from 'react'

export default function Header({ title, subtitle }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  return (
    <div style={{
      background: '#fff', borderBottom: '1px solid #E5E5E0',
      padding: isMobile ? '12px 16px' : '14px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: '8px',
    }}>
      <div>
        <h1 style={{ fontSize: isMobile ? '14px' : '15px', fontWeight: '700', color: '#1a1a1a' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{subtitle}</p>
        )}
      </div>

      {!isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', color: '#888' }}>Last scan: 9:00 AM</span>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: '#E1F5EE', padding: '4px 10px', borderRadius: '20px',
          }}>
            <span style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: '#22c55e', display: 'inline-block',
              animation: 'headerPulse 2s infinite',
            }} />
            <span style={{ fontSize: '11px', color: '#0F6E56', fontWeight: '600' }}>Agent Active</span>
          </div>
        </div>
      )}

      {isMobile && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          background: '#E1F5EE', padding: '3px 8px', borderRadius: '20px',
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: '#22c55e', display: 'inline-block',
          }} />
          <span style={{ fontSize: '10px', color: '#0F6E56', fontWeight: '600' }}>Active</span>
        </div>
      )}

      <style>{`
        @keyframes headerPulse {
          0%,100% { opacity: 1; } 50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
