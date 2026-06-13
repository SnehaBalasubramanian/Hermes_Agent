import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import ChatPanel from './components/ChatPanel'
import JobAlerts from './pages/JobAlerts'
import SavedJobs from './pages/SavedJobs'
import Applications from './pages/Applications'
import Resume from './pages/Resume'
import Settings from './pages/Settings'

export default function App() {
  const [jobs, setJobs] = useState([])
  const [activePage, setActivePage] = useState('alerts')
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}jobs.json`)
      .then(res => res.json())
      .then(data => {
        const savedStatuses = JSON.parse(localStorage.getItem('jobStatuses') || '{}')
        const merged = data.map(job => ({
          ...job,
          status: savedStatuses[job.id] || job.status || 'new'
        }))
        setJobs(merged)
        setLoading(false)
      })
      .catch(() => { setJobs([]); setLoading(false) })
  }, [])

  const updateJobStatus = (jobId, newStatus) => {
    const statuses = JSON.parse(localStorage.getItem('jobStatuses') || '{}')
    statuses[jobId] = newStatus
    localStorage.setItem('jobStatuses', JSON.stringify(statuses))
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j))
  }

  const renderPage = () => {
    switch (activePage) {
      case 'alerts':      return <JobAlerts jobs={jobs} loading={loading} onStatusChange={updateJobStatus} />
      case 'saved':       return <SavedJobs jobs={jobs} onStatusChange={updateJobStatus} />
      case 'applications':return <Applications jobs={jobs} onStatusChange={updateJobStatus} />
      case 'resume':      return <Resume />
      case 'settings':    return <Settings />
      default:            return <JobAlerts jobs={jobs} loading={loading} onStatusChange={updateJobStatus} />
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        activePage={activePage}
        onNavigate={(page) => { setActivePage(page); if (isMobile) setChatOpen(false) }}
        jobs={jobs}
        isMobile={isMobile}
      />

      <main style={{
        flex: 1, overflow: 'auto', background: '#F8F8F6',
        paddingBottom: isMobile ? '64px' : '0',
      }}>
        {renderPage()}
      </main>

      {/* Desktop chat panel */}
      {!isMobile && (
        <ChatPanel jobs={jobs} onStatusChange={updateJobStatus} />
      )}

      {/* Mobile: floating AI button */}
      {isMobile && (
        <>
          <button
            onClick={() => setChatOpen(true)}
            style={{
              position: 'fixed', bottom: '76px', right: '16px',
              width: '48px', height: '48px', borderRadius: '50%',
              background: '#534AB7', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(83,74,183,0.4)', zIndex: 100,
              fontSize: '20px',
            }}
          >
            🤖
          </button>

          {chatOpen && (
            <div style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.4)',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            }}
              onClick={e => { if (e.target === e.currentTarget) setChatOpen(false) }}
            >
              <div style={{
                background: '#fff', borderRadius: '16px 16px 0 0',
                height: '85vh', display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
              }}>
                <div style={{
                  padding: '12px 16px', borderBottom: '1px solid #E5E5E0',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontWeight: '700', fontSize: '14px' }}>AI Assistant</span>
                  <button
                    onClick={() => setChatOpen(false)}
                    style={{ border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer', color: '#888' }}
                  >✕</button>
                </div>
                <ChatPanel jobs={jobs} onStatusChange={updateJobStatus} mobile />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
