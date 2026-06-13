import { useState } from 'react'
import Header from '../components/Header'
import { CheckCircle2 } from 'lucide-react'

const TIPS = [
  {
    title: 'European CV Format',
    items: [
      'Include a professional photo (standard in DE/NL, optional in UK)',
      'Add date of birth and nationality (expected in DE/NL)',
      'Keep to 2 pages maximum',
      'Use clear section headers: Profile, Experience, Education, Skills',
      'List experience in reverse chronological order',
    ],
  },
  {
    title: 'ATS Optimization',
    items: [
      'Mirror keywords from the job description exactly',
      'Use standard section names (not creative titles)',
      'Avoid tables, columns, and graphics in ATS versions',
      'Save as .pdf unless .docx is requested',
      'Use measurable achievements: "reduced build time by 40%"',
    ],
  },
  {
    title: 'Cover Letter Tips',
    items: [
      'Address it to the hiring manager by name when possible',
      'Mention visa sponsorship need early — don\'t hide it',
      'Show you know the company\'s tech stack',
      'Keep to 3 short paragraphs',
      'End with a clear call to action',
    ],
  },
  {
    title: 'Visa & Relocation',
    items: [
      'UK: Skilled Worker visa requires employer sponsorship — check A-rated list',
      'Netherlands: HSM visa for €5,688/mo+ salary (2024)',
      'Germany: IT specialist visa for recognized qualifications',
      'Always mention willingness to relocate immediately',
      'Include LinkedIn URL — European recruiters always check',
    ],
  },
]

export default function Resume() {
  const [jobTitle, setJobTitle] = useState('')
  const [country, setCountry] = useState('Netherlands')
  const [loading, setLoading] = useState(false)
  const [resume, setResume] = useState('')
  const [copied, setCopied] = useState(false)

  const apiKey = localStorage.getItem('geminiApiKey') || ''

  const generate = async () => {
    if (!jobTitle || !apiKey) return
    setLoading(true)
    setResume('')

    const prompt = `Generate a complete, tailored European-style CV for Sneha Balasubramanian applying for ${jobTitle} in ${country}.

Background:
- 2 years software development + DevOps experience
- Skills: React, Angular, Docker, CI/CD, GitHub Actions, Jenkins, Linux, QA Testing, Prompt Engineering, Python basics, AWS basics
- B.Tech Computer Science from a reputable Indian university
- From Bangalore, India — seeking visa-sponsored relocation to ${country}

Create a realistic, professional CV in plain text format with:
1. Contact details header (use placeholder email/phone)
2. Professional Summary (3-4 lines tailored to ${jobTitle})
3. Core Technical Skills (formatted clearly)
4. Work Experience (2 roles, realistic with measurable achievements)
5. Education
6. Certifications (relevant ones she could realistically have)
7. Languages

Tailor it specifically for ${country} job market conventions.`

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 2000 },
          }),
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || `API error ${res.status}`)
      setResume(data.candidates?.[0]?.content?.parts?.[0]?.text || 'Failed to generate.')
    } catch (err) {
      setResume(`Error: ${err.message}. Make sure your Gemini API key is set in the Ask AI tab.`)
    } finally {
      setLoading(false)
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(resume).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const download = () => {
    const blob = new Blob([resume], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `Sneha_Balasubramanian_CV_${country}_${jobTitle.replace(/\s+/g, '_')}.txt`
    a.click()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header title="Resume Builder" subtitle="AI-powered CV tailored for European roles" />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', gap: '20px', padding: '20px 24px', alignItems: 'flex-start' }}>

          {/* Left: Builder */}
          <div style={{ flex: 3, minWidth: 0 }}>
            <div style={{
              background: '#fff', border: '1px solid #E5E5E0',
              borderRadius: '10px', padding: '20px', marginBottom: '16px',
            }}>
              <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', marginBottom: '14px' }}>
                Generate Tailored CV
              </h2>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div style={{ flex: 2 }}>
                  <label style={{ fontSize: '11px', color: '#666', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                    Target Job Title
                  </label>
                  <input
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    placeholder="e.g. DevOps Engineer"
                    style={{
                      width: '100%', border: '1px solid #E5E5E0', borderRadius: '7px',
                      padding: '8px 10px', fontSize: '13px', outline: 'none',
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '11px', color: '#666', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    style={{
                      width: '100%', border: '1px solid #E5E5E0', borderRadius: '7px',
                      padding: '8px 10px', fontSize: '13px', outline: 'none', background: '#fff',
                    }}
                  >
                    <option>UK</option>
                    <option>Germany</option>
                    <option>Netherlands</option>
                  </select>
                </div>
              </div>

              {!apiKey && (
                <p style={{ fontSize: '11px', color: '#A32D2D', marginBottom: '8px' }}>
                  Set your Gemini API key in the Ask AI chat panel first.
                </p>
              )}

              <button
                onClick={generate}
                disabled={!jobTitle || loading || !apiKey}
                style={{
                  background: '#534AB7', color: '#fff', border: 'none',
                  borderRadius: '8px', padding: '10px 20px',
                  fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                  opacity: (!jobTitle || loading || !apiKey) ? 0.5 : 1,
                  width: '100%',
                }}
              >
                {loading ? 'Generating your CV...' : 'Generate CV with AI'}
              </button>
            </div>

            {resume && (
              <div style={{
                background: '#fff', border: '1px solid #E5E5E0',
                borderRadius: '10px', padding: '20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a1a' }}>Generated CV</h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={copy} style={{
                      background: copied ? '#E1F5EE' : '#EEEDFE',
                      color: copied ? '#0F6E56' : '#534AB7',
                      border: 'none', borderRadius: '7px', padding: '6px 14px',
                      fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '5px',
                    }}>
                      {copied && <CheckCircle2 size={12} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button onClick={download} style={{
                      background: '#E1F5EE', color: '#0F6E56',
                      border: 'none', borderRadius: '7px', padding: '6px 14px',
                      fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                    }}>
                      Download .txt
                    </button>
                  </div>
                </div>
                <pre style={{
                  fontSize: '11px', lineHeight: 1.6, color: '#333',
                  background: '#F8F8F6', border: '1px solid #E5E5E0',
                  borderRadius: '7px', padding: '14px', whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word', maxHeight: '500px', overflowY: 'auto',
                  fontFamily: 'inherit',
                }}>
                  {resume}
                </pre>
              </div>
            )}
          </div>

          {/* Right: Tips */}
          <div style={{ flex: 2, minWidth: 0 }}>
            {TIPS.map(({ title, items }) => (
              <div key={title} style={{
                background: '#fff', border: '1px solid #E5E5E0',
                borderRadius: '10px', padding: '16px', marginBottom: '12px',
              }}>
                <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#534AB7', marginBottom: '10px' }}>
                  {title}
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {items.map((item, i) => (
                    <li key={i} style={{ display: 'flex', gap: '7px', alignItems: 'flex-start' }}>
                      <CheckCircle2 size={12} color="#0F6E56" style={{ marginTop: '1px', flexShrink: 0 }} />
                      <span style={{ fontSize: '11px', color: '#444', lineHeight: 1.4 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
