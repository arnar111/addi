import { useSports } from '../hooks/useSports'
import { Shield, ExternalLink, Trophy } from 'lucide-react'

function ResultBadge({ match }) {
  if (!match?.completed) return null
  const isSpurs = (name) => name?.toLowerCase().includes('tottenham') || name?.toLowerCase().includes('spurs')
  const homeIsSpurs = isSpurs(match.home.name)
  const spursScore = homeIsSpurs ? Number(match.home.score) : Number(match.away.score)
  const oppScore = homeIsSpurs ? Number(match.away.score) : Number(match.home.score)
  const result = spursScore > oppScore ? 'W' : spursScore < oppScore ? 'L' : 'D'
  const colors = { W: '#22c55e', L: '#ef4444', D: '#f97316' }
  const labels = { W: 'Sigur', L: 'Tap', D: 'Jafntefli' }
  return (
    <span className="badge" style={{ background: `${colors[result]}22`, color: colors[result] }}>
      {result} · {labels[result]}
    </span>
  )
}

function MatchCard({ match, title }) {
  if (!match) return null
  const date = new Date(match.date)
  const isSpurs = (name) => name?.toLowerCase().includes('tottenham') || name?.toLowerCase().includes('spurs')

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>{title}</span>
        {match.completed ? <ResultBadge match={match} /> : (
          <span className="badge" style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)' }}>
            {date.toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-1 flex-1">
          <div className="text-2xl">🛡️</div>
          <div className="text-sm font-semibold text-center leading-tight"
               style={{ color: isSpurs(match.home.name) ? 'var(--text)' : 'var(--muted)' }}>
            {match.home.name}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          {match.completed ? (
            <div className="text-2xl font-bold tabular-nums">
              {match.home.score}–{match.away.score}
            </div>
          ) : (
            <div className="text-lg font-bold" style={{ color: 'var(--muted)' }}>vs</div>
          )}
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            {date.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 flex-1">
          <div className="text-2xl">🛡️</div>
          <div className="text-sm font-semibold text-center leading-tight"
               style={{ color: isSpurs(match.away.name) ? 'var(--text)' : 'var(--muted)' }}>
            {match.away.name}
          </div>
        </div>
      </div>

      {match.statusText && (
        <div className="text-xs text-center mt-2" style={{ color: 'var(--muted)' }}>
          {match.statusText}
        </div>
      )}
    </div>
  )
}

export default function Sports() {
  const { data, loading } = useSports()

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Íþróttir</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Tottenham Hotspur · Premier League</p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[0,1].map(i => (
            <div key={i} className="card animate-pulse-soft h-32" style={{ background: 'var(--surface)' }} />
          ))}
        </div>
      ) : (
        <>
          {data?.lastMatch && <MatchCard match={data.lastMatch} title="Síðasti leikur" />}
          {data?.nextMatch && <MatchCard match={data.nextMatch} title="Næsti leikur" />}

          {!data?.lastMatch && !data?.nextMatch && (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              <div className="text-3xl mb-2">🏆</div>
              <p className="text-sm">Engir leikir fundnir</p>
              <p className="text-xs mt-1">Tímabilið gæti verið á pásaþoli</p>
            </div>
          )}

          {data?.record && (
            <div className="card flex items-center gap-3">
              <Trophy size={20} style={{ color: '#e5a820' }} />
              <div>
                <div className="text-sm font-semibold">Leiktíð {data.season || '2025/26'}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{data.record}</div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="card flex flex-col gap-3" style={{ border: '1px solid rgba(229,168,32,0.2)' }}>
        <div className="text-sm font-semibold" style={{ color: '#e5a820' }}>📰 The Athletic</div>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          Dýpri greiningar, leikjaskýrslur og viðtöl um Spurs og meira.
        </p>
        <a href="https://theathletic.com/team/tottenham-hotspur" target="_blank" rel="noreferrer"
           className="btn btn-ghost text-xs justify-center">
          <ExternalLink size={13} /> Opna The Athletic
        </a>
      </div>

      <div className="card flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Tennis · ATP</div>
          <a href="https://www.atptour.com" target="_blank" rel="noreferrer"
             className="text-xs" style={{ color: 'var(--accent)' }}>
            atptour.com →
          </a>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Jannik Sinner', 'Carlos Alcaraz', 'Novak Djokovic', 'Alexander Zverev'].map(name => (
            <a key={name}
               href={`https://www.atptour.com/en/players/${name.toLowerCase().replace(' ', '-')}`}
               target="_blank" rel="noreferrer"
               className="badge text-xs" style={{ background: 'var(--surface2)', color: 'var(--text)' }}>
              🎾 {name.split(' ').pop()}
            </a>
          ))}
        </div>
        <a href="https://www.atptour.com/en/scores/current" target="_blank" rel="noreferrer"
           className="btn btn-ghost text-xs justify-center">
          <ExternalLink size={13} /> Lifandi stigatafla ATP
        </a>
      </div>
    </div>
  )
}
