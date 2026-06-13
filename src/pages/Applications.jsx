import { BarChart2 } from 'lucide-react'
import Header from '../components/Header'
import ApplicationTracker from '../components/ApplicationTracker'

export default function Applications({ jobs, onStatusChange }) {
  const all = jobs || []
  const applied = all.filter(j => j.status === 'applied').length
  const interview = all.filter(j => j.status === 'interview').length
  const offer = all.filter(j => j.status === 'offer').length
  const rejected = all.filter(j => j.status === 'rejected').length
  const total = applied + interview + offer + rejected

  const stats = [
    { label: 'Applied', value: applied, bg: '#FAEEDA', color: '#633806' },
    { label: 'Interview', value: interview, bg: '#E1F5EE', color: '#085041' },
    { label: 'Offer', value: offer, bg: '#EEEDFE', color: '#3C3489' },
    { label: 'Rejected', value: rejected, bg: '#FCEBEB', color: '#A32D2D' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header title="My Applications" subtitle={`${total} application${total !== 1 ? 's' : ''} tracked`} />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Stats row */}
        <div style={{ display: 'flex', gap: '12px', padding: '16px 24px' }}>
          {stats.map(({ label, value, bg, color }) => (
            <div key={label} style={{
              flex: 1, background: bg, borderRadius: '10px',
              padding: '12px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color }}>{value}</div>
              <div style={{ fontSize: '10px', color, opacity: 0.8, marginTop: '2px', fontWeight: '500' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        {total === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '48px 24px', textAlign: 'center',
          }}>
            <BarChart2 size={48} color="#534AB7" style={{ marginBottom: '16px', opacity: 0.4 }} />
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>
              No applications yet
            </h2>
            <p style={{ fontSize: '13px', color: '#666', maxWidth: '320px', lineHeight: 1.6 }}>
              When you mark a job as Applied, Interview, Offer, or Rejected it will appear here.
            </p>
          </div>
        ) : (
          <div style={{
            margin: '0 24px 24px',
            background: '#fff', borderRadius: '10px',
            border: '1px solid #E5E5E0', overflow: 'hidden',
          }}>
            <ApplicationTracker jobs={jobs} onStatusChange={onStatusChange} />
          </div>
        )}
      </div>
    </div>
  )
}
