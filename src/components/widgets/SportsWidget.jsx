import { Link } from 'react-router-dom'
import { useSports } from '../../hooks/useSports'
import { Trophy, ChevronRight, RefreshCw } from 'lucide-react'

function positionColor(rank, total) {
  if (rank <= 4) return '#00d4aa'
  if (rank === 5) return '#8b5cf6'
  if (rank === 6) return '#3b82f6'
  if (total && rank >= total - 2) return '#ef4444'
  return 'var(--muted)'
}

export default function SportsWidget() {
  const { standings, matches, loading, error, refresh } = useSports()

  if (loading) return (
    <div className="card animate-pulse-soft">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded" style={{ background: 'var(--surface2)' }} />
        <div className="h-4 w-32 rounded" style={{ background: 'var(--surface2)' }} />
      </div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-7 rounded mb-1.5" style={{ background: 'var(--surface2)' }} />
      ))}
    </div>
  )

  if (error || !standings) return (
    <div className="card flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
           style={{ background: 'rgba(0,212,170,0.1)' }}>
        <Trophy size={18} style={{ color: 'var(--accent)' }} />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">Premier League</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          {error ? 'Gat ekki sótt gögn' : 'Engin gögn til'}
        </div>
      </div>
      <button onClick={refresh} style={{ color: 'var(--muted)' }}><RefreshCw size={14} /></button>
    </div>
  )

  const total = standings.length
  const tottenham = standings.find(s => s.isTottenham)
  const top5 = standings.slice(0, 5)
  const showTot = tottenham && tottenham.rank > 5
  const displayRows = showTot ? [...top5, null, tottenham] : top5

  const liveOrUpcoming = matches
    ?.filter(m => m.statusName === 'STATUS_IN_PROGRESS' || m.statusName === 'STATUS_SCHEDULED')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 1)[0]

  const tottenhamMatch = matches?.find(m =>
    m.isTottenham &&
    (m.statusName === 'STATUS_IN_PROGRESS' || m.statusName === 'STATUS_FINAL' || m.statusName === 'STATUS_SCHEDULED')
  )

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">⚽</span>
          <h3 className="font-semibold text-sm">Premier League</h3>
        </div>
        <Link to="/sports" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      {tottenhamMatch && (
        <div className="mb-3 px-3 py-2 rounded-xl flex items-center gap-2"
             style={{ background: 'rgba(19,34,87,0.4)', border: '1px solid rgba(19,34,87,0.6)' }}>
          <span className="text-xs font-medium" style={{ color: '#7ba3e0' }}>🐓 Spurs</span>
          <span className="flex-1 text-xs text-center font-semibold">
            {tottenhamMatch.homeShort} {tottenhamMatch.homeScore ?? '–'} : {tottenhamMatch.awayScore ?? '–'} {tottenhamMatch.awayShort}
          </span>
          <span className="text-xs" style={{ color: tottenhamMatch.statusName === 'STATUS_IN_PROGRESS' ? '#22c55e' : 'var(--muted)' }}>
            {tottenhamMatch.statusName === 'STATUS_IN_PROGRESS'
              ? `${tottenhamMatch.clock} ●`
              : tottenhamMatch.statusShort}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-0.5">
        {displayRows.map((row, i) => {
          if (row === null) return (
            <div key="sep" className="text-center text-xs py-0.5" style={{ color: 'var(--muted)' }}>···</div>
          )
          return (
            <div key={row.id || i}
                 className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all"
                 style={{
                   background: row.isTottenham ? 'rgba(19,34,87,0.35)' : 'transparent',
                   border: row.isTottenham ? '1px solid rgba(19,34,87,0.5)' : '1px solid transparent',
                 }}>
              <span className="w-4 text-right font-medium shrink-0"
                    style={{ color: positionColor(row.rank, total) }}>
                {row.rank}
              </span>
              <span className="flex-1 font-medium truncate" style={{ color: row.isTottenham ? '#a8c4e8' : 'var(--text)' }}>
                {row.short || row.team.split(' ').pop()}
                {row.isTottenham && ' 🐓'}
              </span>
              <span className="font-bold w-6 text-right" style={{ color: row.isTottenham ? '#a8c4e8' : 'var(--text)' }}>
                {row.points}
              </span>
              <span style={{ color: 'var(--muted)', width: 20, textAlign: 'right' }}>{row.played}</span>
            </div>
          )
        })}
      </div>

      <div className="flex gap-2 mt-3 text-xs" style={{ color: 'var(--muted)' }}>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: '#00d4aa' }} /> UCL</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: '#8b5cf6' }} /> UEL</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: '#3b82f6' }} /> UECL</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: '#ef4444' }} /> Niður</span>
      </div>
    </div>
  )
}
