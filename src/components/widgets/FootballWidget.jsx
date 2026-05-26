import { useFootball } from '../../hooks/useFootball'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function FootballWidget() {
  const { scores, standings, loading, error } = useFootball()
  const navigate = useNavigate()

  if (loading) return (
    <div className="card animate-pulse-soft">
      <div className="text-xs font-medium mb-3" style={{ color: 'var(--muted)' }}>⚽ Premier League</div>
      <div className="text-xs" style={{ color: 'var(--muted)' }}>Hleður stöðu...</div>
    </div>
  )

  if (error && !standings) return (
    <button className="card w-full text-left" onClick={() => navigate('/sports')}>
      <div className="text-sm font-semibold mb-1">⚽ Premier League</div>
      <div className="text-xs" style={{ color: 'var(--muted)' }}>Smelltu til að sjá stöðu →</div>
    </button>
  )

  const top5 = standings?.slice(0, 5) || []
  const recentScores = scores?.filter(s => s.completed).slice(0, 3) || []

  return (
    <button className="card w-full text-left transition-all hover:border-[var(--accent)]"
            onClick={() => navigate('/sports')}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold">⚽ Premier League</span>
        <ChevronRight size={14} style={{ color: 'var(--muted)' }} />
      </div>

      {top5.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {top5.map((t, i) => (
            <div key={t.team} className="flex items-center gap-2 text-xs">
              <span className="w-4 text-center font-medium shrink-0"
                    style={{ color: i < 4 ? 'var(--accent)' : '#f97316' }}>
                {t.rank}
              </span>
              {t.logo
                ? <img src={t.logo} alt={t.team} style={{ width: 16, height: 16, objectFit: 'contain' }} />
                : <span style={{ width: 16 }} />
              }
              <span className="flex-1 truncate">{t.team}</span>
              <span className="font-bold" style={{ color: 'var(--text)' }}>{t.points}</span>
            </div>
          ))}
        </div>
      )}

      {recentScores.length > 0 && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Nýjast</div>
          {recentScores.map(s => (
            <div key={s.id} className="flex items-center text-xs mb-1">
              <span className="flex-1 truncate text-right">{s.home.name}</span>
              <span className="mx-2 px-2 py-0.5 rounded font-bold shrink-0"
                    style={{ background: 'var(--surface2)', minWidth: 44, textAlign: 'center' }}>
                {s.home.score ?? '-'} – {s.away.score ?? '-'}
              </span>
              <span className="flex-1 truncate">{s.away.name}</span>
            </div>
          ))}
        </div>
      )}
    </button>
  )
}
