import StatusBadge from './StatusBadge'

const STATUS_OPTIONS = ['new', 'saved', 'applied', 'interview', 'offer', 'rejected']

const LOGO_COLORS = [
  { bg: '#EEEDFE', color: '#534AB7' },
  { bg: '#E1F5EE', color: '#0F6E56' },
  { bg: '#E6F1FB', color: '#0C447C' },
  { bg: '#FAEEDA', color: '#633806' },
  { bg: '#F1EFE8', color: '#444444' },
]

export default function ApplicationTracker({ jobs, onStatusChange }) {
  const tracked = (jobs || []).filter(j => j.status && j.status !== 'new')

  if (tracked.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '48px 24px',
        color: '#888', fontSize: '13px',
      }}>
        No applications tracked yet. Change a job's status to start tracking.
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
        <thead>
          <tr style={{ background: '#F8F8F6', borderBottom: '1px solid #E5E5E0' }}>
            {['Role', 'Company', 'Country', 'Salary', 'Status', 'Action'].map(h => (
              <th key={h} style={{
                padding: '10px 14px', textAlign: 'left',
                fontSize: '10px', color: '#888', fontWeight: '700',
                textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tracked.map(job => {
            const idx = (job.company || '').charCodeAt(0) % LOGO_COLORS.length
            const lc = LOGO_COLORS[idx]
            const initials = (job.company || 'XX').slice(0, 2).toUpperCase()
            return (
              <tr key={job.id} style={{ borderBottom: '1px solid #F1EFE8' }}>
                <td style={{ padding: '10px 14px', fontWeight: '600', color: '#1a1a1a', maxWidth: '200px' }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {job.title}
                  </div>
                </td>
                <td style={{ padding: '10px 14px', color: '#555' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '5px',
                      background: lc.bg, color: lc.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '9px', fontWeight: '700', flexShrink: 0,
                    }}>{initials}</div>
                    {job.company}
                  </div>
                </td>
                <td style={{ padding: '10px 14px', color: '#555' }}>{job.country}</td>
                <td style={{ padding: '10px 14px', color: '#0F6E56', fontWeight: '600', maxWidth: '160px' }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {job.salary || '—'}
                  </div>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <StatusBadge status={job.status} />
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <select
                    value={job.status}
                    onChange={e => onStatusChange(job.id, e.target.value)}
                    style={{
                      fontSize: '11px', border: '1px solid #E5E5E0',
                      borderRadius: '6px', padding: '3px 6px',
                      background: '#fff', color: '#444', cursor: 'pointer', outline: 'none',
                    }}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
