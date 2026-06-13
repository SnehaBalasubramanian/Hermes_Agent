import { useState } from 'react'
import { Bookmark, Share2, Check } from 'lucide-react'
import StatusBadge from './StatusBadge'

const LOGO_COLORS = [
  { bg: '#EEEDFE', color: '#534AB7' },
  { bg: '#E1F5EE', color: '#0F6E56' },
  { bg: '#E6F1FB', color: '#0C447C' },
  { bg: '#FAEEDA', color: '#633806' },
  { bg: '#F1EFE8', color: '#444444' },
]

const STATUS_OPTIONS = ['new', 'saved', 'applied', 'interview', 'offer', 'rejected']

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
  }
  // Fallback for non-HTTPS (localhost http)
  const el = document.createElement('textarea')
  el.value = text
  el.style.position = 'fixed'
  el.style.opacity = '0'
  document.body.appendChild(el)
  el.focus()
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
  return Promise.resolve()
}

export default function JobCard({ job, onStatusChange }) {
  const [copied, setCopied] = useState(false)

  if (!job) return null

  const colorIdx = (job.company || '').charCodeAt(0) % LOGO_COLORS.length
  const logoColor = LOGO_COLORS[colorIdx]
  const initials = (job.company || 'XX').slice(0, 2).toUpperCase()
  const skills = (job.skills || []).slice(0, 5)

  const handleShare = () => {
    if (!job.applyLink) return
    copyToClipboard(job.applyLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{
      background: '#fff', borderRadius: '10px',
      border: '1px solid #E5E5E0',
      borderLeft: job.isNew ? '3px solid #534AB7' : '1px solid #E5E5E0',
      padding: '16px', marginBottom: '12px',
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '8px',
          background: logoColor.bg, color: logoColor.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: '700', flexShrink: 0,
        }}>
          {initials}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', lineHeight: 1.3 }}>
                {job.title}
              </h3>
              <p style={{ fontSize: '11px', color: '#777', marginTop: '2px' }}>
                {job.company} · {job.location}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
              {job.isNew && (
                <span style={{
                  background: '#EEEDFE', color: '#534AB7',
                  fontSize: '9px', fontWeight: '700',
                  padding: '2px 7px', borderRadius: '10px',
                }}>NEW</span>
              )}
            </div>
          </div>

          {job.salary && (
            <p style={{ fontSize: '13px', fontWeight: '700', color: '#0F6E56', marginTop: '6px' }}>
              {job.salary}
            </p>
          )}
        </div>
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
          {skills.map(skill => (
            <span key={skill} style={{
              background: '#F8F8F6', border: '1px solid #E5E5E0',
              fontSize: '10px', color: '#555',
              padding: '2px 8px', borderRadius: '12px',
            }}>
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Why it fits */}
      {job.whyItFitsMe && (
        <div style={{
          background: '#F8F8F6', borderRadius: '7px',
          padding: '9px 11px', marginTop: '10px',
        }}>
          <span style={{
            fontSize: '10px', fontWeight: '700', color: '#0F6E56',
            textTransform: 'uppercase', letterSpacing: '0.5px',
          }}>
            Why it fits you ·{' '}
          </span>
          <span style={{ fontSize: '11px', color: '#555', lineHeight: 1.4 }}>
            {job.whyItFitsMe}
          </span>
        </div>
      )}

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: '12px', flexWrap: 'wrap', gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StatusBadge status={job.status} />
          <select
            value={job.status || 'new'}
            onChange={e => onStatusChange(job.id, e.target.value)}
            style={{
              fontSize: '11px', border: '1px solid #E5E5E0',
              borderRadius: '6px', padding: '3px 6px', cursor: 'pointer',
              background: '#fff', color: '#444', outline: 'none',
            }}
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button
            onClick={() => onStatusChange(job.id, 'saved')}
            title="Save job"
            style={{
              border: '1px solid #E5E5E0', borderRadius: '6px',
              padding: '5px 7px', background: job.status === 'saved' ? '#EEEDFE' : '#fff',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
            }}
          >
            <Bookmark size={13} color={job.status === 'saved' ? '#534AB7' : '#888'} fill={job.status === 'saved' ? '#534AB7' : 'none'} />
          </button>

          <button
            onClick={handleShare}
            title={copied ? 'Copied!' : 'Copy job link'}
            style={{
              border: `1px solid ${copied ? '#0F6E56' : '#E5E5E0'}`,
              borderRadius: '6px', padding: '5px 7px',
              background: copied ? '#E1F5EE' : '#fff',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
              transition: 'all 0.2s',
            }}
          >
            {copied
              ? <><Check size={13} color="#0F6E56" /><span style={{ fontSize: '10px', color: '#0F6E56', fontWeight: '600' }}>Copied!</span></>
              : <Share2 size={13} color="#888" />
            }
          </button>

          {job.applyLink && (
            <a
              href={job.applyLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#534AB7', color: '#fff',
                fontSize: '12px', fontWeight: '600',
                padding: '6px 14px', borderRadius: '7px',
                textDecoration: 'none', whiteSpace: 'nowrap',
              }}
            >
              Apply Now
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
