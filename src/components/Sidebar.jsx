import { Globe, Briefcase, Bookmark, BarChart2, FileText, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'alerts', label: 'Job Alerts', icon: Briefcase },
  { id: 'saved', label: 'Saved Jobs', icon: Bookmark },
  { id: 'applications', label: 'Applications', icon: BarChart2 },
  { id: 'resume', label: 'My Resume', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ activePage, onNavigate, jobs }) {
  const newCount = jobs.filter(j => j.status === 'new' || j.isNew).length
  const appliedCount = jobs.filter(j => j.status === 'applied').length

  const getBadge = (id) => {
    if (id === 'alerts' && newCount > 0) return newCount
    if (id === 'applications' && appliedCount > 0) return appliedCount
    return null
  }

  return (
    <aside style={{
      width: '220px',
      minWidth: '220px',
      background: '#fff',
      borderRight: '1px solid #E5E5E0',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #E5E5E0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '8px',
            background: '#534AB7', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Globe size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a1a', lineHeight: 1.2 }}>
              S-Hunt AI
            </div>
            <div style={{ fontSize: '10px', color: '#999', marginTop: '2px' }}>
              Powered by Hermes Agent
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = activePage === id
          const badge = getBadge(id)
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 10px', borderRadius: '8px', border: 'none',
                cursor: 'pointer', marginBottom: '2px',
                background: active ? '#EEEDFE' : 'transparent',
                color: active ? '#534AB7' : '#444',
                fontWeight: active ? '600' : '400',
                fontSize: '13px',
                borderLeft: active ? '3px solid #534AB7' : '3px solid transparent',
                textAlign: 'left',
                transition: 'background 0.15s',
              }}
            >
              <Icon size={16} />
              <span style={{ flex: 1 }}>{label}</span>
              {badge && (
                <span style={{
                  background: '#534AB7', color: '#fff',
                  fontSize: '10px', fontWeight: '700',
                  padding: '1px 6px', borderRadius: '10px', minWidth: '18px',
                  textAlign: 'center',
                }}>
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Agent Status */}
      <div style={{
        padding: '14px 16px', borderTop: '1px solid #E5E5E0',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <span style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: '#22c55e', display: 'inline-block',
          boxShadow: '0 0 0 2px #dcfce7',
          animation: 'pulse 2s infinite',
        }} />
        <span style={{ fontSize: '11px', color: '#444', fontWeight: '500' }}>Agent Active</span>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 2px #dcfce7; }
          50% { box-shadow: 0 0 0 5px #dcfce722; }
        }
      `}</style>
    </aside>
  )
}
