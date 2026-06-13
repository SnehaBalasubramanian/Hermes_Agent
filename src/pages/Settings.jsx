import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { CheckCircle2 } from 'lucide-react'

const DEFAULT_SETTINGS = {
  name: 'Sneha Balasubramanian',
  email: 'aaransrini@gmail.com',
  linkedin: 'https://linkedin.com/in/sneha-balasubramanian',
  roles: ['DevOps Engineer', 'Cloud Engineer', 'AI Engineer', 'MLOps Engineer'],
  countries: ['UK', 'Germany', 'Netherlands'],
  minSalaryUK: '55000',
  minSalaryDE: '65000',
  minSalaryNL: '60000',
}

const ALL_ROLES = ['DevOps Engineer', 'Cloud Engineer', 'AI Engineer', 'MLOps Engineer', 'Platform Engineer', 'Site Reliability Engineer']
const ALL_COUNTRIES = ['UK', 'Germany', 'Netherlands', 'France', 'Sweden', 'Denmark']

export default function Settings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('userSettings')
    if (stored) {
      try { setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) }) } catch {}
    }
  }, [])

  const toggle = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }))
  }

  const save = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Header title="Settings" subtitle="Configure your job search preferences" />
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

        {/* Profile */}
        <section style={{
          background: '#fff', border: '1px solid #E5E5E0',
          borderRadius: '10px', padding: '20px', marginBottom: '16px',
        }}>
          <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', marginBottom: '14px' }}>
            Profile
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Full Name', key: 'name', placeholder: 'Your name' },
              { label: 'Email', key: 'email', placeholder: 'your@email.com', type: 'email' },
              { label: 'LinkedIn URL', key: 'linkedin', placeholder: 'https://linkedin.com/in/...', colSpan: 2 },
            ].map(({ label, key, placeholder, type, colSpan }) => (
              <div key={key} style={{ gridColumn: colSpan ? `span ${colSpan}` : undefined }}>
                <label style={{ fontSize: '11px', color: '#666', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                  {label}
                </label>
                <input
                  type={type || 'text'}
                  value={settings[key]}
                  onChange={e => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  style={{
                    width: '100%', border: '1px solid #E5E5E0', borderRadius: '7px',
                    padding: '8px 10px', fontSize: '13px', outline: 'none',
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Job Preferences */}
        <section style={{
          background: '#fff', border: '1px solid #E5E5E0',
          borderRadius: '10px', padding: '20px', marginBottom: '16px',
        }}>
          <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', marginBottom: '14px' }}>
            Job Preferences
          </h2>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: '#555', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
              Target Roles
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {ALL_ROLES.map(role => {
                const checked = settings.roles.includes(role)
                return (
                  <label key={role} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: checked ? '#EEEDFE' : '#F8F8F6',
                    border: `1px solid ${checked ? '#534AB7' : '#E5E5E0'}`,
                    borderRadius: '8px', padding: '6px 12px', cursor: 'pointer',
                    fontSize: '12px', color: checked ? '#534AB7' : '#555', fontWeight: checked ? '600' : '400',
                  }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle('roles', role)}
                      style={{ display: 'none' }}
                    />
                    {role}
                  </label>
                )
              })}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: '#555', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
              Target Countries
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {ALL_COUNTRIES.map(c => {
                const checked = settings.countries.includes(c)
                return (
                  <label key={c} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: checked ? '#E1F5EE' : '#F8F8F6',
                    border: `1px solid ${checked ? '#0F6E56' : '#E5E5E0'}`,
                    borderRadius: '8px', padding: '6px 12px', cursor: 'pointer',
                    fontSize: '12px', color: checked ? '#0F6E56' : '#555', fontWeight: checked ? '600' : '400',
                  }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle('countries', c)}
                      style={{ display: 'none' }}
                    />
                    {c}
                  </label>
                )
              })}
            </div>
          </div>
        </section>

        {/* Salary */}
        <section style={{
          background: '#fff', border: '1px solid #E5E5E0',
          borderRadius: '10px', padding: '20px', marginBottom: '20px',
        }}>
          <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', marginBottom: '14px' }}>
            Minimum Salary
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { label: 'UK (£)', key: 'minSalaryUK', prefix: '£' },
              { label: 'Germany (€)', key: 'minSalaryDE', prefix: '€' },
              { label: 'Netherlands (€)', key: 'minSalaryNL', prefix: '€' },
            ].map(({ label, key, prefix }) => (
              <div key={key}>
                <label style={{ fontSize: '11px', color: '#666', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                  {label}
                </label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5E5E0', borderRadius: '7px', overflow: 'hidden' }}>
                  <span style={{ padding: '0 8px', background: '#F8F8F6', color: '#666', fontSize: '13px', borderRight: '1px solid #E5E5E0', alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>
                    {prefix}
                  </span>
                  <input
                    type="number"
                    value={settings[key]}
                    onChange={e => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                    style={{
                      flex: 1, border: 'none', padding: '8px 10px',
                      fontSize: '13px', outline: 'none',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <button
          onClick={save}
          style={{
            background: saved ? '#0F6E56' : '#534AB7', color: '#fff', border: 'none',
            borderRadius: '8px', padding: '11px 28px', fontSize: '13px',
            fontWeight: '600', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '7px',
            transition: 'background 0.3s',
          }}
        >
          {saved && <CheckCircle2 size={15} />}
          {saved ? 'Settings Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
