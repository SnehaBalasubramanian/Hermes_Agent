import { Bookmark } from 'lucide-react'
import Header from '../components/Header'
import JobCard from '../components/JobCard'

export default function SavedJobs({ jobs, onStatusChange }) {
  const saved = (jobs || []).filter(j => j.status === 'saved')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header title="Saved Jobs" subtitle={`${saved.length} job${saved.length !== 1 ? 's' : ''} saved`} />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {saved.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '60px 24px', textAlign: 'center',
          }}>
            <Bookmark size={48} color="#534AB7" style={{ marginBottom: '16px', opacity: 0.5 }} />
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>
              No saved jobs yet
            </h2>
            <p style={{ fontSize: '13px', color: '#666', maxWidth: '320px', lineHeight: 1.6 }}>
              Click the bookmark icon on any job to save it for later.
            </p>
          </div>
        ) : (
          <div style={{ padding: '16px 24px' }}>
            {saved.map(job => (
              <JobCard key={job.id} job={job} onStatusChange={onStatusChange} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
