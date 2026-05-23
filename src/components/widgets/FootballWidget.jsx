import { useFootball, useWorldCup } from '../../hooks/useFootball'
import { useNavigate } from 'react-router-dom'

function TeamScore({ name, score, isSpurs }) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <span className="text-xs font-medium text-center leading-tight" style={{ color: isSpurs ? 'var(--text)' : 'var(--muted)' }}>
        {name}
      </span>
      {score !== null && score !== undefined && (
        <span className="text-2xl font-bold" style={{ color: isSpurs ? 'var(--accent)' : 'var(--text)' }}>{score}</span>
      )}
    </div>
  )
}

export default function FootballWidget() {
  const { nextMatch, lastResult, loading } = useFootball()
  const { days, hours, started } = useWorldCup()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-3">
      {/* World Cup countdown */}
      <div
        className="card cursor-pointer"
        onClick={() => navigate('/football')}
        style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.12), rgba(239,68,68,0.08))', borderColor: 'rgba(249,115,22,0.25)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium mb-0.5" style={{ color: '#f97316' }}>
              🏆 FIFA World Cup 2026
            </div>
            {started ? (
              <div className="text-lg font-bold">Heimsmeistaramótið er hafið!</div>
            ) : (
              <div className="text-lg font-bold">
                {days}d {hours}h eftir
              </div>
            )}
            <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              11. júní · USA / Canada / México
            </div>
          </div>
          <div className="text-4xl">⚽</div>
        </div>
      </div>

      {/* Spurs widget */}
      <div
        className="card cursor-pointer"
        onClick={() => navigate('/football')}
        style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.06), rgba(139,92,246,0.06))' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">⚪</span>
          <span className="text-sm font-semibold">Tottenham Hotspur</span>
          <span className="text-xs ml-auto" style={{ color: 'var(--muted)' }}>Premier League</span>
        </div>

        {loading ? (
          <div className="h-12 rounded-lg animate-pulse-soft" style={{ background: 'var(--surface2)' }} />
        ) : (
          <div className="flex flex-col gap-3">
            {lastResult && (
              <div>
                <div className="text-xs mb-1.5" style={{ color: 'var(--muted)' }}>
                  Síðasta leikur · {new Date(lastResult.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex items-center gap-2 px-2 py-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
                  <TeamScore name={lastResult.home} score={lastResult.homeScore} isSpurs={lastResult.spursHome} />
                  <span className="text-xs font-bold" style={{ color: 'var(--muted)' }}>–</span>
                  <TeamScore name={lastResult.away} score={lastResult.awayScore} isSpurs={!lastResult.spursHome} />
                </div>
              </div>
            )}
            {nextMatch && (
              <div>
                <div className="text-xs mb-1.5" style={{ color: 'var(--muted)' }}>
                  Næsti leikur · {new Date(nextMatch.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl" style={{ background: 'var(--surface2)' }}>
                  <span className="flex-1 text-xs font-medium text-center">{nextMatch.home}</span>
                  <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>VS</span>
                  <span className="flex-1 text-xs font-medium text-center">{nextMatch.away}</span>
                </div>
                {nextMatch.venue && (
                  <div className="text-xs mt-1 text-center" style={{ color: 'var(--muted)' }}>{nextMatch.venue}</div>
                )}
              </div>
            )}
            {!lastResult && !nextMatch && (
              <div className="text-xs text-center py-2" style={{ color: 'var(--muted)' }}>
                Smelltu til að sjá dagskrá
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
