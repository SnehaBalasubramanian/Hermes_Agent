const STATS = [
  { label: 'Total Found', getValue: (jobs) => jobs.length, color: '#534AB7' },
  { label: 'New Today', getValue: (jobs) => jobs.filter(j => j.isNew).length, color: '#0F6E56' },
  { label: 'Applied', getValue: (jobs) => jobs.filter(j => j.status === 'applied').length, color: '#633806' },
  { label: 'Interviews', getValue: (jobs) => jobs.filter(j => j.status === 'interview').length, color: '#0C447C' },
]

export default function StatsBar({ jobs }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '12px', padding: '16px 24px',
    }}>
      {STATS.map(({ label, getValue, color }) => (
        <div key={label} style={{
          background: '#fff', border: '1px solid #E5E5E0',
          borderRadius: '10px', padding: '14px 16px',
        }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color }}>{getValue(jobs)}</div>
          <div style={{ fontSize: '10px', color: '#888', marginTop: '3px', fontWeight: '500' }}>{label}</div>
        </div>
      ))}
    </div>
  )
}
