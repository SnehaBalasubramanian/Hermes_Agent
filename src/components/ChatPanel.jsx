import { useState, useRef, useEffect } from 'react'
import { Send, BarChart2, MessageCircle } from 'lucide-react'
import StatusBadge from './StatusBadge'

const LOGO_COLORS = [
  { bg: '#EEEDFE', color: '#534AB7' },
  { bg: '#E1F5EE', color: '#0F6E56' },
  { bg: '#E6F1FB', color: '#0C447C' },
  { bg: '#FAEEDA', color: '#633806' },
  { bg: '#F1EFE8', color: '#444444' },
]

const SYSTEM_PROMPT = `You are a helpful job search assistant for Sneha Balasubramanian, a software developer from Bangalore, India with 2 years experience. Skills: React, Angular, Docker, CI/CD, GitHub Actions, Jenkins, Linux, QA Testing, Prompt Engineering, Python basics, AWS basics. Looking for DevOps Engineer, Cloud Engineer, AI Engineer, MLOps Engineer roles in UK, Germany, Netherlands with visa sponsorship. Help with cover letters, visa questions, salary negotiation, interview prep. Be concise and practical.`

const QUICK_SUGGESTIONS = [
  'Write cover letter',
  'Netherlands visa guide',
  'Salary negotiation',
  'Interview prep',
]

const STATUS_OPTIONS = ['new', 'saved', 'applied', 'interview', 'offer', 'rejected']

const GEMINI_MODEL = 'gemini-1.5-flash-latest'

async function callGemini(apiKey, history, userMessage) {
  const contents = history
    .filter(m => m.role !== 'assistant' || history.indexOf(m) > 0)
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

  contents.push({ role: 'user', parts: [{ text: userMessage }] })

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { maxOutputTokens: 1000 },
      }),
    }
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `API error ${res.status}`)
  }

  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.'
}

function LoadingDots() {
  return (
    <div style={{ display: 'flex', gap: '4px', padding: '10px 14px', alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: '#534AB7', display: 'inline-block',
          animation: `dotBounce 1.2s ${i * 0.2}s infinite`,
        }} />
      ))}
      <style>{`
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

function AskAITab() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi Sneha! I\'m your job search assistant (powered by Google Gemini — free). Ask me anything about cover letters, visa requirements, salary negotiation, or interview prep.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState(localStorage.getItem('geminiApiKey') || '')
  const [showKeyInput, setShowKeyInput] = useState(!localStorage.getItem('geminiApiKey'))
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const saveKey = () => {
    localStorage.setItem('geminiApiKey', apiKey)
    setShowKeyInput(false)
  }

  const sendMessage = async (text) => {
    const userText = text || input.trim()
    if (!userText) return
    if (!apiKey) { setShowKeyInput(true); return }

    const newHistory = [...messages, { role: 'user', content: userText }]
    setMessages(newHistory)
    setInput('')
    setLoading(true)

    try {
      const reply = await callGemini(apiKey, messages, userText)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${err.message}`,
      }])
    } finally {
      setLoading(false)
    }
  }

  if (showKeyInput) {
    return (
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ background: '#E1F5EE', borderRadius: '8px', padding: '10px', fontSize: '11px', color: '#0F6E56', lineHeight: 1.5 }}>
          <strong>Free!</strong> Get your key at<br />
          <strong>aistudio.google.com</strong> → "Get API key"
        </div>
        <input
          type="password"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="AIza..."
          style={{
            border: '1px solid #E5E5E0', borderRadius: '7px', padding: '8px 10px',
            fontSize: '12px', outline: 'none', width: '100%',
          }}
        />
        <button
          onClick={saveKey}
          disabled={!apiKey}
          style={{
            background: '#534AB7', color: '#fff', border: 'none',
            borderRadius: '7px', padding: '8px', fontSize: '12px',
            fontWeight: '600', cursor: 'pointer',
            opacity: !apiKey ? 0.5 : 1,
          }}
        >
          Save Key
        </button>
        <button
          onClick={() => setShowKeyInput(false)}
          style={{
            background: 'transparent', color: '#888', border: 'none',
            fontSize: '11px', cursor: 'pointer', textDecoration: 'underline',
          }}
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '8px',
          }}>
            <div style={{
              maxWidth: '90%', padding: '9px 12px', borderRadius: '10px',
              fontSize: '12px', lineHeight: 1.5,
              background: msg.role === 'user' ? '#534AB7' : '#F1EFE8',
              color: msg.role === 'user' ? '#fff' : '#1a1a1a',
              whiteSpace: 'pre-wrap',
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '8px' }}>
            <div style={{ background: '#F1EFE8', borderRadius: '10px' }}>
              <LoadingDots />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: '8px 12px 4px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
        {QUICK_SUGGESTIONS.map(s => (
          <button
            key={s}
            onClick={() => sendMessage(s)}
            style={{
              background: '#EEEDFE', color: '#534AB7', border: 'none',
              borderRadius: '12px', padding: '4px 10px', fontSize: '10px',
              fontWeight: '600', cursor: 'pointer',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div style={{
        padding: '10px 12px', borderTop: '1px solid #E5E5E0',
        display: 'flex', gap: '7px', alignItems: 'flex-end',
      }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
          }}
          placeholder="Ask anything..."
          rows={1}
          style={{
            flex: 1, border: '1px solid #E5E5E0', borderRadius: '7px',
            padding: '7px 10px', fontSize: '12px', resize: 'none',
            outline: 'none', fontFamily: 'inherit', lineHeight: 1.4,
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          style={{
            background: '#534AB7', border: 'none', borderRadius: '7px',
            padding: '7px 10px', cursor: 'pointer', display: 'flex',
            alignItems: 'center', opacity: (!input.trim() || loading) ? 0.5 : 1,
          }}
        >
          <Send size={14} color="#fff" />
        </button>
      </div>

      <div style={{ padding: '0 12px 8px', textAlign: 'right' }}>
        <button
          onClick={() => setShowKeyInput(true)}
          style={{
            background: 'none', border: 'none', fontSize: '10px',
            color: '#aaa', cursor: 'pointer', textDecoration: 'underline',
          }}
        >
          Change API key
        </button>
      </div>
    </div>
  )
}

function ResumeTab() {
  const [jobTitle, setJobTitle] = useState('')
  const [country, setCountry] = useState('Netherlands')
  const [loading, setLoading] = useState(false)
  const [resume, setResume] = useState('')
  const apiKey = localStorage.getItem('geminiApiKey') || ''

  const generate = async () => {
    if (!jobTitle || !apiKey) return
    setLoading(true)
    setResume('')

    const prompt = `Generate a complete, tailored European-style CV for Sneha Balasubramanian applying for ${jobTitle} in ${country}.

Background:
- 2 years software development + DevOps experience
- Skills: React, Angular, Docker, CI/CD, GitHub Actions, Jenkins, Linux, QA Testing, Prompt Engineering, Python basics, AWS basics
- B.Tech Computer Science
- From Bangalore, India — seeking visa-sponsored relocation to ${country}

Create a realistic, professional CV in plain text format with:
1. Contact details header
2. Professional Summary (tailored to ${jobTitle})
3. Core Technical Skills
4. Work Experience (2 roles with measurable achievements)
5. Education
6. Certifications
7. Languages

Tailor it for ${country} job market conventions.`

    try {
      const reply = await callGemini(apiKey, [], prompt)
      setResume(reply)
    } catch (err) {
      setResume(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const copy = () => navigator.clipboard.writeText(resume).catch(() => {})
  const download = () => {
    const blob = new Blob([resume], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `Sneha_CV_${jobTitle.replace(/\s+/g, '_')}.txt`
    a.click()
  }

  return (
    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
      <div>
        <label style={{ fontSize: '11px', color: '#666', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
          Target Job Title
        </label>
        <input
          value={jobTitle}
          onChange={e => setJobTitle(e.target.value)}
          placeholder="e.g. DevOps Engineer"
          style={{
            width: '100%', border: '1px solid #E5E5E0', borderRadius: '7px',
            padding: '7px 10px', fontSize: '12px', outline: 'none',
          }}
        />
      </div>

      <div>
        <label style={{ fontSize: '11px', color: '#666', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
          Target Country
        </label>
        <select
          value={country}
          onChange={e => setCountry(e.target.value)}
          style={{
            width: '100%', border: '1px solid #E5E5E0', borderRadius: '7px',
            padding: '7px 10px', fontSize: '12px', outline: 'none', background: '#fff',
          }}
        >
          <option>UK</option>
          <option>Germany</option>
          <option>Netherlands</option>
        </select>
      </div>

      <button
        onClick={generate}
        disabled={!jobTitle || loading || !apiKey}
        style={{
          background: '#534AB7', color: '#fff', border: 'none',
          borderRadius: '7px', padding: '9px', fontSize: '12px',
          fontWeight: '600', cursor: 'pointer',
          opacity: (!jobTitle || loading || !apiKey) ? 0.5 : 1,
        }}
      >
        {loading ? 'Generating...' : 'Generate Resume'}
      </button>

      {!apiKey && (
        <p style={{ fontSize: '11px', color: '#A32D2D' }}>Set your Gemini API key in the Ask AI tab first.</p>
      )}

      {resume && (
        <>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={copy} style={{
              flex: 1, background: '#EEEDFE', color: '#534AB7', border: 'none',
              borderRadius: '7px', padding: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer',
            }}>Copy</button>
            <button onClick={download} style={{
              flex: 1, background: '#E1F5EE', color: '#0F6E56', border: 'none',
              borderRadius: '7px', padding: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer',
            }}>Download .txt</button>
          </div>
          <pre style={{
            fontSize: '10px', lineHeight: 1.5, color: '#333',
            background: '#F8F8F6', border: '1px solid #E5E5E0',
            borderRadius: '7px', padding: '10px', whiteSpace: 'pre-wrap',
            wordBreak: 'break-word', maxHeight: '400px', overflowY: 'auto',
          }}>
            {resume}
          </pre>
        </>
      )}
    </div>
  )
}

function TrackTab({ jobs, onStatusChange }) {
  const tracked = (jobs || []).filter(j => j.status && j.status !== 'new')

  if (tracked.length === 0) {
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '24px',
        color: '#888', fontSize: '12px', textAlign: 'center',
      }}>
        <BarChart2 size={32} color="#D0CCF8" style={{ marginBottom: '10px' }} />
        No applications tracked yet.
        <br />Change a job's status to start.
      </div>
    )
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
      {tracked.map(job => {
        const idx = (job.company || '').charCodeAt(0) % LOGO_COLORS.length
        const lc = LOGO_COLORS[idx]
        const initials = (job.company || 'XX').slice(0, 2).toUpperCase()
        return (
          <div key={job.id} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px', borderRadius: '8px', marginBottom: '6px',
            background: '#F8F8F6', border: '1px solid #E5E5E0',
          }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '6px',
              background: lc.bg, color: lc.color, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '9px', fontWeight: '700',
            }}>{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '11px', fontWeight: '600', color: '#1a1a1a',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{job.title}</div>
              <StatusBadge status={job.status} />
            </div>
            <select
              value={job.status}
              onChange={e => onStatusChange(job.id, e.target.value)}
              style={{
                fontSize: '10px', border: '1px solid #E5E5E0',
                borderRadius: '5px', padding: '2px 4px',
                background: '#fff', color: '#444', cursor: 'pointer', outline: 'none',
              }}
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        )
      })}
    </div>
  )
}

const TABS = [
  { id: 'ask', label: 'Ask AI', icon: MessageCircle },
  { id: 'track', label: 'Track', icon: BarChart2 },
]

export default function ChatPanel({ jobs, onStatusChange }) {
  const [activeTab, setActiveTab] = useState('ask')

  return (
    <aside style={{
      width: '280px', minWidth: '280px', background: '#fff',
      borderLeft: '1px solid #E5E5E0', display: 'flex', flexDirection: 'column',
      height: '100vh', overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', borderBottom: '1px solid #E5E5E0',
        background: '#F8F8F6',
      }}>
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                flex: 1, padding: '11px 6px', border: 'none',
                background: active ? '#fff' : 'transparent',
                color: active ? '#534AB7' : '#888',
                fontSize: '11px', fontWeight: active ? '700' : '400',
                cursor: 'pointer', borderBottom: active ? '2px solid #534AB7' : '2px solid transparent',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
              }}
            >
              <Icon size={14} />
              {label}
            </button>
          )
        })}
      </div>

      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'ask' && <AskAITab />}
        {activeTab === 'track' && <TrackTab jobs={jobs} onStatusChange={onStatusChange} />}
      </div>
    </aside>
  )
}
