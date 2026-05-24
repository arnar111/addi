import { useFootball } from '../../hooks/useFootball'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

const FORM_COLOR = { W: 'var(--success)', L: 'var(--danger)', D: '#f97316' }

export default function FootballWidget() {
  const { data, loading } = useFootball()

  if (loading) {
    return <div className="card animate-pulse-soft" style={{ height: 72 }} />
  }

  const fmt = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  return (
    <Link to="/sports" style={{ textDecoration: 'none', display: 'block' }}>
      <div className="card flex items-center gap-3">
        {/* Crest area */}
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
             style={{ background: 'rgba(100,116,139,0.15)' }}>⚒️</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>West Ham</span>
            {data?.recentForm?.length > 0 && (
              <div className="flex items-center gap-0.5">
                {data.recentForm.slice(0, 5).map((r, i) => (
                  <span key={i} className="text-xs font-bold"
                        style={{ color: FORM_COLOR[r] || 'var(--muted)' }}>{r}</span>
                ))}
              </div>
            )}
          </div>

          {data?.next ? (
            <div className="text-sm font-medium truncate">
              {data.next.home.name} vs {data.next.away.name}
            </div>
          ) : data?.last ? (
            <div className="text-sm font-medium">
              {data.last.home.name} {data.last.home.score} – {data.last.away.score} {data.last.away.name}
            </div>
          ) : (
            <div className="text-sm" style={{ color: 'var(--muted)' }}>EFL Championship</div>
          )}

          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {data?.next ? fmt(data.next.date) : data?.last ? fmt(data.last.date) : 'Sjá leiki →'}
          </div>
        </div>

        <ChevronRight size={16} style={{ color: 'var(--muted)' }} />
      </div>
    </Link>
  )
}
