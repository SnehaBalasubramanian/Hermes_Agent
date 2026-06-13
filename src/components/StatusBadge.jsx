const STATUS_STYLES = {
  new:        { bg: '#F1EFE8', color: '#444' },
  saved:      { bg: '#E6F1FB', color: '#0C447C' },
  applied:    { bg: '#FAEEDA', color: '#633806' },
  interview:  { bg: '#E1F5EE', color: '#085041' },
  offer:      { bg: '#EEEDFE', color: '#3C3489' },
  rejected:   { bg: '#FCEBEB', color: '#A32D2D' },
}

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.new
  return (
    <span style={{
      background: style.bg, color: style.color,
      fontSize: '10px', fontWeight: '600',
      padding: '3px 8px', borderRadius: '20px',
      textTransform: 'capitalize', whiteSpace: 'nowrap',
    }}>
      {status || 'new'}
    </span>
  )
}
