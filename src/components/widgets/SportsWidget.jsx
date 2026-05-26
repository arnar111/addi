import { Link } from 'react-router-dom'
import { ChevronRight, Trophy } from 'lucide-react'
import { useKnicksSchedule, useInterMilanSchedule } from '../../hooks/useSports'

function GamePill({ won, lost, score, opponent, isHome, completed, inProgress }) {
  const label = completed
    ? (won ? 'W' : 'L')
    : inProgress ? 'LIVE' : 'Væntanlegt'
  const color = completed
    ? (won ? 'var(--success)' : 'var(--danger)')
    : inProgress ? '#f97316' : 'var(--muted)'
  return (
    <div className="flex items-center justify-between py-1.5 border-b last:border-0"
         style={{ borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold w-8 text-center" style={{ color }}>{label}</span>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>{isHome ? 'vs' : '@'}</span>
        <span className="text-sm font-medium">{opponent}</span>
      </div>
      {completed || inProgress ? (
        <span className="text-sm font-mono font-semibold">{score}</span>
      ) : (
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          {new Date(score).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
        </span>
      )}
    </div>
  )
}

export default function SportsWidget() {
  const { schedule: knicks } = useKnicksSchedule()
  const { schedule: inter } = useInterMilanSchedule()

  const recentKnicks = knicks
    .filter(g => g.completed || g.inProgress)
    .slice(-3)
    .reverse()

  const nextKnicks = knicks.find(g => !g.completed && !g.inProgress)

  const recentInter = inter
    .filter(g => g.completed)
    .slice(-2)
    .reverse()

  const inFinalsMode = knicks.some(g =>
    !g.completed && !g.inProgress &&
    (g.opponent?.toLowerCase().includes('finals') ||
     knicks.filter(g2 => g2.completed).length > 70)
  )

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(0,119,181,0.08), rgba(255,106,0,0.06))' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy size={16} style={{ color: '#f97316' }} />
          <h3 className="font-semibold text-sm">Íþróttir</h3>
        </div>
        <Link to="/sports" className="flex items-center gap-0.5 text-xs" style={{ color: 'var(--accent)' }}>
          Sjá allt <ChevronRight size={12} />
        </Link>
      </div>

      {/* Knicks */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">🏀</span>
          <span className="text-xs font-semibold" style={{ color: '#0077b5' }}>NY KNICKS</span>
          {inFinalsMode && (
            <span className="badge text-xs" style={{ background: 'rgba(249,115,22,0.2)', color: '#f97316', fontSize: 9 }}>
              🏆 FINALS
            </span>
          )}
        </div>
        <div>
          {recentKnicks.length > 0
            ? recentKnicks.map(g => (
                <GamePill key={g.id}
                  won={g.won} lost={!g.won} completed={g.completed}
                  inProgress={g.inProgress}
                  opponent={g.opponent} isHome={g.isHome}
                  score={g.completed || g.inProgress ? `${g.kScore}-${g.oScore}` : g.date} />
              ))
            : <div className="text-xs py-1" style={{ color: 'var(--muted)' }}>Engar leikjanir tiltækar</div>
          }
          {nextKnicks && !nextKnicks.completed && (
            <div className="flex items-center gap-2 mt-1.5 py-1 px-2 rounded-lg"
                 style={{ background: 'rgba(0,119,181,0.08)' }}>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>Næsti leikur:</span>
              <span className="text-xs font-medium">{nextKnicks.isHome ? 'vs' : '@'} {nextKnicks.opponent}</span>
              <span className="text-xs ml-auto" style={{ color: 'var(--accent)' }}>
                {new Date(nextKnicks.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Inter Milan */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">⚫🔵</span>
          <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>INTER MILAN</span>
        </div>
        <div>
          {recentInter.length > 0
            ? recentInter.map(g => (
                <GamePill key={g.id}
                  won={g.won} completed={g.completed}
                  inProgress={g.inProgress}
                  opponent={g.opponent} isHome={g.isHome}
                  score={g.completed || g.inProgress ? `${g.iScore}-${g.oScore}` : g.date} />
              ))
            : <div className="text-xs py-1" style={{ color: 'var(--muted)' }}>Engar niðurstöður tiltækar</div>
          }
        </div>
      </div>
    </div>
  )
}
