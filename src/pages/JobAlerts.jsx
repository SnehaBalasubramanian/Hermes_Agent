import { useState, useEffect } from 'react'
import { Globe } from 'lucide-react'
import Header from '../components/Header'
import StatsBar from '../components/StatsBar'
import FilterBar from '../components/FilterBar'
import JobCard from '../components/JobCard'

const FILTER_FN = {
  'All':            () => true,
  'UK':             j => j.country === 'UK',
  'Germany':        j => j.country === 'Germany',
  'Netherlands':    j => j.country === 'Netherlands',
  'Visa Sponsored': j => j.visaSponsored === true,
  'Remote':         j => j.remote === true,
  'Hybrid':         j => j.hybrid === true,
}

export default function JobAlerts({ jobs, loading, onStatusChange }) {
  const [filter, setFilter] = useState('All')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  const filtered = (jobs || []).filter(FILTER_FN[filter] || (() => true))

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ textAlign: 'center', color: '#888' }}>
          <div style={{
            width: '36px', height: '36px', border: '3px solid #EEEDFE',
            borderTopColor: '#534AB7', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 12px',
          }} />
          <p style={{ fontSize: '13px' }}>Loading jobs...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header title="Today's Job Alerts" subtitle="Automatically found by Hermes Agent" />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <StatsBar jobs={jobs || []} />
        <FilterBar active={filter} onChange={setFilter} />

        {filtered.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '48px 24px', textAlign: 'center',
          }}>
            <Globe size={48} color="#534AB7" style={{ marginBottom: '16px', opacity: 0.7 }} />
            <h2 style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '10px' }}>
              {jobs.length === 0 ? 'No job alerts yet' : 'No jobs match this filter'}
            </h2>
            {jobs.length === 0 ? (
              <>
                <p style={{ fontSize: '13px', color: '#666', maxWidth: '340px', lineHeight: 1.6, marginBottom: '8px' }}>
                  Your Hermes Agent searches for DevOps, Cloud and AI Engineer roles in UK, Germany and Netherlands every morning at 9 AM.
                </p>
                <p style={{ fontSize: '11px', color: '#888', fontStyle: 'italic' }}>
                  Make sure your Hermes Agent is running in WSL2
                </p>
              </>
            ) : (
              <p style={{ fontSize: '13px', color: '#666' }}>Try a different filter.</p>
            )}
          </div>
        ) : (
          <div style={{ padding: isMobile ? '0 12px 24px' : '0 24px 24px' }}>
            {filtered.map(job => (
              <JobCard key={job.id} job={job} onStatusChange={onStatusChange} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
