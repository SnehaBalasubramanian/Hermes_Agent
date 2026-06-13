import { useState, useEffect } from 'react'

const STATS = [
  { label: 'Total Found', getValue: j => j.length,                               color: '#534AB7' },
  { label: 'New Today',   getValue: j => j.filter(x => x.isNew).length,          color: '#0F6E56' },
  { label: 'Applied',     getValue: j => j.filter(x => x.status==='applied').length, color: '#633806' },
  { label: 'Interviews',  getValue: j => j.filter(x => x.status==='interview').length, color: '#0C447C' },
]

export default function StatsBar({ jobs }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
      gap: isMobile ? '8px' : '12px',
      padding: isMobile ? '12px 16px' : '16px 24px',
    }}>
      {STATS.map(({ label, getValue, color }) => (
        <div key={label} style={{
          background: '#fff', border: '1px solid #E5E5E0',
          borderRadius: '10px', padding: isMobile ? '10px 12px' : '14px 16px',
        }}>
          <div style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '700', color }}>
            {getValue(jobs)}
          </div>
          <div style={{ fontSize: '10px', color: '#888', marginTop: '3px', fontWeight: '500' }}>
            {label}
          </div>
        </div>
      ))}
    </div>
  )
}
