import { useNavigate } from 'react-router-dom'
import { useSports } from '../../hooks/useSports'
import { ChevronRight } from 'lucide-react'

function MiniScore({ event, flag }) {
  if (!event) return null
  const hasScore = event.intHomeScore !== null && event.intHomeScore !== '' && event.intHomeScore !== undefined
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-base">{flag}</span>
      <span className="truncate flex-1" style={{ color: 'var(--muted)', maxWidth: 90 }}>{event.strHomeTeam?.split(' ').slice(-1)[0]}</span>
      {hasScore ? (
        <span className="font-bold" style={{ color: 'var(--text)' }}>{event.intHomeScore}–{event.intAwayScore}</span>
      ) : (
        <span style={{ color: 'var(--accent)', fontSize: 10 }}>Í dag</span>
      )}
      <span className="truncate" style={{ color: 'var(--muted)', maxWidth: 90, textAlign: 'right' }}>{event.strAwayTeam?.split(' ').slice(-1)[0]}</span>
    </div>
  )
}

export default function SportsWidget() {
  const navigate = useNavigate()
  const { pl, nba, loading } = useSports()

  const latestPL = pl?.past?.[0]
  const latestNBA = nba?.past?.[0] || nba?.next?.[0]

  if (loading) {
    return (
      <div className="card animate-pulse-soft flex items-center gap-3" style={{ minHeight: 68 }}>
        <div className="w-8 h-8 rounded-xl" style={{ background: 'var(--surface2)' }} />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-3 w-32 rounded" style={{ background: 'var(--surface2)' }} />
          <div className="h-3 w-24 rounded" style={{ background: 'var(--surface2)' }} />
        </div>
      </div>
    )
  }

  return (
    <button onClick={() => navigate('/sports')} className="card w-full text-left"
            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(0,212,170,0.04))' }}>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>Íþróttir</span>
        <div className="flex items-center gap-1">
          <span className="text-xs px-1.5 py-0.5 rounded-md font-medium"
                style={{ background: 'rgba(0,119,190,0.15)', color: '#60b3ff' }}>🏀 NBA Finals</span>
          <ChevronRight size={14} style={{ color: 'var(--muted)' }} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {latestPL ? <MiniScore event={latestPL} flag="⚽" /> : (
          <div className="text-xs" style={{ color: 'var(--muted)' }}>⚽ Engar nýlegar leikjaniðurstöður</div>
        )}
        {latestNBA ? <MiniScore event={latestNBA} flag="🏀" /> : (
          <div className="text-xs" style={{ color: 'var(--muted)' }}>🏀 Engar nýlegar NBA niðurstöður</div>
        )}
      </div>
    </button>
  )
}
