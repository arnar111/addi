import { useFootball } from '../../hooks/useFootball'

function ScorePill({ match }) {
  if (!match) return null
  const isSpursHome = match.spursHome
  const spursScore = isSpursHome ? match.homeScore : match.awayScore
  const oppScore = isSpursHome ? match.awayScore : match.homeScore
  const opp = isSpursHome ? match.away : match.home
  const won = Number(spursScore) > Number(oppScore)
  const drew = Number(spursScore) === Number(oppScore)
  const result = won ? 'W' : drew ? 'D' : 'L'
  const color = won ? 'var(--success)' : drew ? '#f97316' : 'var(--danger)'

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="font-bold text-xs px-1.5 py-0.5 rounded" style={{ background: `${color}22`, color }}>{result}</span>
      <span className="font-semibold">Spurs {spursScore}–{oppScore} {opp}</span>
    </div>
  )
}

function NextMatch({ match }) {
  if (!match) return null
  const d = new Date(match.date)
  const opp = match.spursHome ? match.away : match.home
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent)' }}>NÆST</span>
      <span>Spurs vs {opp}</span>
      <span className="text-xs ml-auto" style={{ color: 'var(--muted)' }}>
        {d.toLocaleDateString('is-IS', { weekday: 'short', day: 'numeric', month: 'short' })}
      </span>
    </div>
  )
}

export default function SportsWidget() {
  const { spursLast, spursNext, loading } = useFootball()

  return (
    <div className="card-sm flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-base">⚽</span>
        <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Tottenham</span>
        <a href="#/sports" className="text-xs ml-auto" style={{ color: 'var(--accent)' }}>Sjá meira →</a>
      </div>
      {loading ? (
        <div className="text-xs" style={{ color: 'var(--muted)' }}>Sæki niðurstöður…</div>
      ) : (
        <>
          {spursLast && <ScorePill match={spursLast} />}
          {spursNext && <NextMatch match={spursNext} />}
          {!spursLast && !spursNext && (
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Engar leikir þessa vikuna</div>
          )}
        </>
      )}
    </div>
  )
}
