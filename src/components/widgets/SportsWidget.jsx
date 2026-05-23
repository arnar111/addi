import { useSports } from '../../hooks/useSports'
import { useNavigate } from 'react-router-dom'

function MiniMatch({ event, label }) {
  if (!event) return null
  const finished = event.intHomeScore !== null && event.intHomeScore !== '' && event.strStatus !== 'NS'
  const isLiverpool = (t) => t?.toLowerCase().includes('liverpool')
  const livHome = isLiverpool(event.strHomeTeam)
  const homeWin = finished && Number(event.intHomeScore) > Number(event.intAwayScore)
  const livWon = (livHome && homeWin) || (!livHome && !homeWin && finished && event.intHomeScore !== event.intAwayScore)

  return (
    <div className="flex items-center gap-2 py-1.5">
      <div className="text-xs w-10 shrink-0 font-medium" style={{ color: 'var(--muted)' }}>{label}</div>
      <div className="flex-1 flex items-center gap-1 min-w-0">
        <span className="text-xs truncate flex-1"
              style={{ color: livHome ? 'var(--text)' : 'var(--muted)' }}>
          {event.strHomeTeam}
        </span>
        <span className="text-xs font-bold font-mono shrink-0 px-2 py-0.5 rounded tabular-nums"
              style={{ background: 'var(--surface2)', color: finished ? (livWon ? 'var(--success)' : 'var(--muted)') : 'var(--muted)' }}>
          {finished ? `${event.intHomeScore}–${event.intAwayScore}` : 'vs'}
        </span>
        <span className="text-xs truncate flex-1 text-right"
              style={{ color: !livHome ? 'var(--text)' : 'var(--muted)' }}>
          {event.strAwayTeam}
        </span>
      </div>
    </div>
  )
}

export default function SportsWidget() {
  const { data, loading } = useSports()
  const navigate = useNavigate()

  if (loading) return (
    <div className="card animate-pulse-soft" style={{ height: 90 }} />
  )

  const liv = data?.liverpool
  if (!liv?.last && !liv?.next) return (
    <div className="card flex items-center gap-3 cursor-pointer" onClick={() => navigate('/sports')}>
      <span className="text-2xl">🔴</span>
      <div>
        <div className="text-sm font-semibold">Liverpool FC</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>Smelltu til að sjá leikjanir</div>
      </div>
    </div>
  )

  return (
    <div className="card cursor-pointer" onClick={() => navigate('/sports')}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm">🔴</span>
        <span className="text-sm font-semibold">Liverpool FC</span>
        <span className="text-xs ml-auto" style={{ color: 'var(--muted)' }}>⚽</span>
      </div>
      <div style={{ borderTop: '1px solid var(--border)', marginTop: 4 }}>
        {liv.last && <MiniMatch event={liv.last} label="Síðast" />}
        {liv.next && <MiniMatch event={liv.next} label="Næst" />}
      </div>
    </div>
  )
}
