import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import ChatPanel from './components/ChatPanel'
import JobAlerts from './pages/JobAlerts'
import SavedJobs from './pages/SavedJobs'
import Applications from './pages/Applications'
import Resume from './pages/Resume'
import Settings from './pages/Settings'

function App() {
  const [jobs, setJobs] = useState([])
  const [activePage, setActivePage] = useState('alerts')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}jobs.json`)
      .then(res => res.json())
      .then(data => {
        const savedStatuses = JSON.parse(
          localStorage.getItem('jobStatuses') || '{}'
        )
        const merged = data.map(job => ({
          ...job,
          status: savedStatuses[job.id] || job.status || 'new'
        }))
        setJobs(merged)
        setLoading(false)
      })
      .catch(() => {
        setJobs([])
        setLoading(false)
      })
  }, [])

  const updateJobStatus = (jobId, newStatus) => {
    const statuses = JSON.parse(
      localStorage.getItem('jobStatuses') || '{}'
    )
    statuses[jobId] = newStatus
    localStorage.setItem('jobStatuses', JSON.stringify(statuses))
    setJobs(prev =>
      prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j)
    )
  }

  const renderPage = () => {
    switch(activePage) {
      case 'alerts': return <JobAlerts jobs={jobs} loading={loading} onStatusChange={updateJobStatus} />
      case 'saved': return <SavedJobs jobs={jobs} onStatusChange={updateJobStatus} />
      case 'applications': return <Applications jobs={jobs} onStatusChange={updateJobStatus} />
      case 'resume': return <Resume />
      case 'settings': return <Settings />
      default: return <JobAlerts jobs={jobs} loading={loading} onStatusChange={updateJobStatus} />
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar activePage={activePage} onNavigate={setActivePage} jobs={jobs} />
      <main style={{ flex: 1, overflow: 'auto', background: '#F8F8F6' }}>
        {renderPage()}
      </main>
      <ChatPanel jobs={jobs} />
    </div>
  )
}

export default App
