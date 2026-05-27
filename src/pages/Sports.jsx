import { useFootball } from '../hooks/useFootball'
import { Shield, Calendar, Trophy, TrendingUp, ExternalLink } from 'lucide-react'

function ResultBadge({ result, size = 'md' }) {
  const colors = { W: '#22c55e', D: '#f97316', L: '#ef4444' }
  const labels = { W: 'W', D: 'D', L: 'L' }
  if (!result) return null
  const sz = size === 'sm' ? 'w-5 h-5 text-xs' : 'w-6 h-6 text-sm'
  return (
    <span
      className={`inline-flex items-center justify-center ${sz} rounded font-bold`}
      style={{ background: colors[result] + '25', color: colors[result] }}
    >
      {labels[result]}
    </span>
  )
}

function formatDate(dateStr, short = false) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (short) return d.toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })
  return d.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function countdown(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = d - now
  if (diff <= 0) return 'Í beinni'
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  if (days > 0) return `${days}d ${hours}h`
  return `${hours}klst`
}

export default function Sports() {
  const { data, loading } = useFootball()

  if (loading) {
    return (
      <div className="flex flex-col gap-4 pb-4 animate-slide-up">
        <div className="px-1 pt-2">
          <h1 className="text-xl font-semibold">Íþróttir</h1>
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="card animate-pulse-soft h-20" style={{ background: 'var(--surface2)' }} />
        ))}
      </div>
    )
  }

  const { lastMatches = [], nextMatch, standing, standings = [] } = data || {}
  const topStandings = standings.slice(0, 10)

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Íþróttir</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Arsenal · Premier League</p>
      </div>

      {/* Arsenal Standing Card */}
      {standing && (
        <div
          className="card"
          style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(255,255,255,0.02))', border: '1px solid rgba(239,68,68,0.25)' }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
              style={{ background: 'rgba(239,68,68,0.15)' }}
            >
              🔴
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold">Arsenal FC</div>
              <div className="text-sm" style={{ color: 'var(--muted)' }}>
                {standing.position === 1 ? '🏆 Meistari' : `${standing.position}. sæti í Premier League`}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-3xl font-bold">{standing.points}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>stig</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-4">
            {[
              ['Leikir', standing.played],
              ['Sigrar', standing.wins],
              ['Jafnt', standing.draws],
              ['Tap', standing.losses],
            ].map(([label, val]) => (
              <div key={label} className="flex flex-col items-center p-2 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
                <div className="text-lg font-bold">{val}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Match */}
      {nextMatch && (
        <div className="card" style={{ border: '1px solid rgba(0,212,170,0.2)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={14} style={{ color: 'var(--accent)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>Næsti leikur</span>
            <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent)' }}>
              {countdown(nextMatch.date)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center gap-1">
              <div className="text-2xl">{nextMatch.isArsenalHome ? '🔴' : '⬜'}</div>
              <div className="text-sm font-semibold">Arsenal</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>{nextMatch.isArsenalHome ? 'Heima' : 'Gestir'}</div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="text-2xl font-light" style={{ color: 'var(--muted)' }}>vs</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>{formatDate(nextMatch.date, true)}</div>
              {nextMatch.venue && (
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{nextMatch.venue}</div>
              )}
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="text-2xl">⬜</div>
              <div className="text-sm font-semibold">{nextMatch.opponent?.shortName}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>{nextMatch.isArsenalHome ? 'Gestir' : 'Heima'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Form / Recent Results */}
      {lastMatches.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} style={{ color: 'var(--accent)' }} />
            <span className="text-sm font-semibold">Síðustu leikir</span>
            <div className="ml-auto flex gap-1">
              {lastMatches.slice(-5).map((m, i) => (
                <ResultBadge key={i} result={m?.result} size="sm" />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {lastMatches.slice(-5).reverse().map((match, i) => (
              <div
                key={match.id || i}
                className="flex items-center justify-between py-2 px-3 rounded-xl"
                style={{ background: 'var(--surface2)' }}
              >
                <div className="text-xs" style={{ color: 'var(--muted)', minWidth: 60 }}>
                  {formatDate(match.date, true)}
                </div>
                <div className="flex items-center gap-2 flex-1 justify-center text-sm">
                  <span className="font-medium">{match.isArsenalHome ? 'ARS' : match.opponent?.shortName}</span>
                  <span
                    className="px-2 py-0.5 rounded-lg text-xs font-bold"
                    style={{
                      background: match.result === 'W' ? 'rgba(34,197,94,0.15)' : match.result === 'L' ? 'rgba(239,68,68,0.15)' : 'rgba(249,115,22,0.15)',
                      color: match.result === 'W' ? '#22c55e' : match.result === 'L' ? '#ef4444' : '#f97316',
                    }}
                  >
                    {match.arsenalScore} – {match.oppScore}
                  </span>
                  <span className="font-medium">{match.isArsenalHome ? match.opponent?.shortName : 'ARS'}</span>
                </div>
                <ResultBadge result={match.result} size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PL Table */}
      {topStandings.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={14} style={{ color: '#f97316' }} />
            <span className="text-sm font-semibold">Premier League tafla</span>
          </div>

          <div className="flex flex-col gap-0.5">
            {/* Header */}
            <div className="grid text-xs px-2 pb-1" style={{ gridTemplateColumns: '24px 1fr 32px 32px 28px', color: 'var(--muted)' }}>
              <span>#</span>
              <span>Lið</span>
              <span className="text-center">Lkj</span>
              <span className="text-center">Stg</span>
              <span className="text-center">GD</span>
            </div>

            {topStandings.map((team) => (
              <div
                key={team.team}
                className="grid items-center px-2 py-1.5 rounded-lg text-sm"
                style={{
                  gridTemplateColumns: '24px 1fr 32px 32px 28px',
                  background: team.isArsenal ? 'rgba(239,68,68,0.1)' : 'transparent',
                  border: team.isArsenal ? '1px solid rgba(239,68,68,0.2)' : '1px solid transparent',
                }}
              >
                <span
                  className="font-semibold text-xs"
                  style={{ color: team.position <= 4 ? 'var(--accent)' : team.position >= 18 ? 'var(--danger)' : 'var(--muted)' }}
                >
                  {team.position}
                </span>
                <span className="font-medium truncate" style={{ color: team.isArsenal ? '#ef4444' : 'var(--text)' }}>
                  {team.isArsenal ? '🔴 ' : ''}{team.shortName}
                </span>
                <span className="text-center text-xs" style={{ color: 'var(--muted)' }}>{team.played}</span>
                <span className="text-center font-semibold">{team.points}</span>
                <span
                  className="text-center text-xs"
                  style={{ color: team.gd > 0 ? 'var(--success)' : team.gd < 0 ? 'var(--danger)' : 'var(--muted)' }}
                >
                  {team.gd > 0 ? '+' : ''}{team.gd}
                </span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex gap-3 mt-3 text-xs" style={{ color: 'var(--muted)' }}>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
              Champions League
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: 'var(--danger)' }} />
              Niðurganga
            </div>
          </div>
        </div>
      )}

      {/* No data */}
      {!data && (
        <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
          <div className="text-3xl mb-2">⚽</div>
          <div className="text-sm">Gat ekki sótt leikjagögn</div>
          <div className="text-xs mt-1">Reyndu aftur síðar</div>
        </div>
      )}

      {/* The Athletic link */}
      <a
        href="https://theathletic.com"
        target="_blank"
        rel="noopener noreferrer"
        className="card flex items-center gap-3"
        style={{ border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none' }}
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0" style={{ background: '#000', color: '#fff' }}>A</div>
        <div className="flex-1">
          <div className="text-sm font-medium">The Athletic</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Nýjustu fréttir og greiningar</div>
        </div>
        <ExternalLink size={14} style={{ color: 'var(--muted)' }} />
      </a>
    </div>
  )
}
