import { useFootball } from '../../hooks/useFootball'
import { useNavigate } from 'react-router-dom'
import { Trophy, ChevronRight } from 'lucide-react'

function Countdown({ days }) {
  return (
    <div className="flex flex-col items-center justify-center py-3 px-4 rounded-2xl"
         style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.12), rgba(139,92,246,0.12))', border: '1px solid rgba(0,212,170,0.2)' }}>
      <div className="text-xs mb-1" style={{ color: 'var(--muted)' }}>FIFA World Cup 2026 🏆</div>
      <div className="flex items-end gap-1">
        <span className="text-4xl font-bold" style={{ color: 'var(--accent)' }}>{days}</span>
        <span className="text-sm mb-1" style={{ color: 'var(--muted)' }}>dagar eftir</span>
      </div>
      <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Hefst 11. júní · USA/CAN/MEX</div>
    </div>
  )
}

export default function FootballWidget() {
  const { matches, recent, daysToWC, loading } = useFootball()
  const nav = useNavigate()

  if (loading) return (
    <div className="card animate-pulse-soft">
      <div className="h-4 w-32 rounded mb-3" style={{ background: 'var(--surface2)' }} />
      <div className="h-16 rounded-xl" style={{ background: 'var(--surface2)' }} />
    </div>
  )

  const nextMatch = matches.find(m => m.status === 'TIMED' || m.status === 'SCHEDULED')
  const liveMatch = matches.find(m => m.status === 'IN_PLAY' || m.status === 'PAUSED')

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.04), rgba(139,92,246,0.04))' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy size={15} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Knattspyrna</span>
        </div>
        <button onClick={() => nav('/football')} className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Meira <ChevronRight size={12} />
        </button>
      </div>

      {liveMatch ? (
        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl"
             style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-soft" style={{ background: 'var(--danger)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--danger)' }}>LIVE</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span>{liveMatch.homeTeam?.shortName || liveMatch.homeTeam?.name}</span>
            <span style={{ color: 'var(--accent)' }}>{liveMatch.score?.fullTime?.home ?? '-'} – {liveMatch.score?.fullTime?.away ?? '-'}</span>
            <span>{liveMatch.awayTeam?.shortName || liveMatch.awayTeam?.name}</span>
          </div>
        </div>
      ) : daysToWC <= 30 ? (
        <Countdown days={daysToWC} />
      ) : null}

      {recent.slice(0, 2).map(m => (
        <div key={m.id} className="flex items-center justify-between py-2 mt-2">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-xs truncate">{m.homeTeam?.shortName || m.homeTeam?.name}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-lg mx-2"
               style={{ background: 'var(--surface2)' }}>
            <span>{m.score?.fullTime?.home}</span>
            <span style={{ color: 'var(--muted)' }}>–</span>
            <span>{m.score?.fullTime?.away}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
            <span className="text-xs truncate">{m.awayTeam?.shortName || m.awayTeam?.name}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
