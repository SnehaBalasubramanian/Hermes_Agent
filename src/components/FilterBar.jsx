const FILTERS = ['All', 'UK', 'Germany', 'Netherlands', 'Visa Sponsored', 'Remote', 'Hybrid']

export default function FilterBar({ active, onChange }) {
  return (
    <div style={{
      padding: '0 24px 16px', display: 'flex', gap: '8px',
      overflowX: 'auto', flexWrap: 'nowrap',
    }}>
      {FILTERS.map(f => {
        const isActive = active === f
        return (
          <button
            key={f}
            onClick={() => onChange(f)}
            style={{
              padding: '5px 14px', borderRadius: '20px', fontSize: '12px',
              fontWeight: isActive ? '600' : '400', cursor: 'pointer',
              whiteSpace: 'nowrap', border: isActive ? 'none' : '1px solid #E5E5E0',
              background: isActive ? '#534AB7' : '#fff',
              color: isActive ? '#fff' : '#555',
              transition: 'all 0.15s',
            }}
          >
            {f}
          </button>
        )
      })}
    </div>
  )
}
