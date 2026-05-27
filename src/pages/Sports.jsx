import { useSports } from '../hooks/useSports'
import { RefreshCw, Calendar, Trophy } from 'lucide-react'

function getResultLabel(ev, team = 'Arsenal') {
  const isHome = ev.homeTeam?.includes(team)
  const myScore = isHome ? parseInt(ev.homeScore) : parseInt(ev.awayScore)
  const theirScore = isHome ? parseInt(ev.awayScore) : parseInt(ev.homeScore)
  if (isNaN(myScore) || isNaN(theirScore)) return { label: '?', color: 'var(--muted)' }
  if (myScore > theirScore) return { label: 'W', bg: 'rgba(34,197,94,0.15)', color: 'var(--success)' }
  if (myScore < theirScore) return { label: 'L', bg: 'rgba(239,68,68,0.15)', color: 'var(--danger)' }
  return { label: 'D', bg: 'rgba(249,115,22,0.15)', color: '#f97316' }
}

function getOpponent(ev, team = 'Arsenal') {
  return ev.homeTeam?.includes(team) ? ev.awayTeam : ev.homeTeam
}

function getScore(ev, team = 'Arsenal') {
  const isHome = ev.homeTeam?.includes(team)
  return isHome
    ? `${ev.homeScore ?? '–'} – ${ev.awayScore ?? '–'}`
    : `${ev.awayScore ?? '–'} – ${ev.homeScore ?? '–'}`
}

function getHomeAway(ev, team = 'Arsenal') {
  return ev.homeTeam?.includes(team) ? 'Heima' : 'Úti'
}

function getDaysUntil(dateStr) {
  const then = new Date(dateStr)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  then.setHours(0, 0, 0, 0)
  const diff = Math.round((then - now) / (1000 * 60 * 60 * 24))
  if (diff === 0) return '🔴 Í dag!'
  if (diff === 1) return '⏰ Á morgun'
  if (diff < 0) return null
  return `${diff} dagar`
}

function SkeletonCard() {
  return (
    <div className="card animate-pulse-soft">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl" style={{ background: 'var(--surface2)' }} />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-3 rounded w-32" style={{ background: 'var(--surface2)' }} />
          <div className="h-3 rounded w-20" style={{ background: 'var(--surface2)' }} />
        </div>
      </div>
    </div>
  )
}

export default function Sports() {
  const { lastResults, nextFixtures, loading, error } = useSports()

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="px-1 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔴</span>
          <div>
            <h1 className="text-xl font-semibold">Arsenal FC</h1>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Premier League</p>
          </div>
        </div>
      </div>

      {/* Last 5 form */}
      {!loading && lastResults && lastResults.length > 0 && (
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(255,255,255,0.01))' }}>
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={14} style={{ color: '#ef4444' }} />
            <span className="font-semibold text-sm">Form (síðustu 5)</span>
          </div>
          <div className="flex gap-2">
            {lastResults.slice(0, 5).map((ev, i) => {
              const r = getResultLabel(ev)
              return (
                <div key={ev.id} className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
                     style={{ background: r.bg, color: r.color, border: `1px solid ${r.color}44` }}>
                  {r.label}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Next fixtures */}
      <div>
        <div className="flex items-center gap-2 mb-2 px-1">
          <Calendar size={14} style={{ color: 'var(--accent)' }} />
          <span className="font-semibold text-sm">Næstu leikir</span>
        </div>

        {loading ? (
          <div className="flex flex-col gap-2">
            {[1,2].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="card text-center py-6" style={{ color: 'var(--muted)' }}>
            Gat ekki sótt leikjaáætlun 😕
          </div>
        ) : nextFixtures?.length === 0 ? (
          <div className="card text-center py-6" style={{ color: 'var(--muted)' }}>
            Engir leikir í boði
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {nextFixtures?.map(ev => {
              const countdown = getDaysUntil(ev.date)
              return (
                <div key={ev.id} className="card flex items-center gap-3"
                     style={{ border: countdown?.includes('dag') ? '1px solid rgba(239,68,68,0.3)' : '1px solid var(--border)' }}>
                  <div className="flex flex-col items-center justify-center w-12 shrink-0 p-1.5 rounded-xl"
                       style={{ background: 'var(--surface2)' }}>
                    <div className="text-xs font-bold"
                         style={{ color: 'var(--accent)' }}>
                      {new Date(ev.date).toLocaleDateString('is-IS', { month: 'short' }).toUpperCase()}
                    </div>
                    <div className="text-lg font-bold leading-none">
                      {new Date(ev.date).getDate()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">Arsenal vs {getOpponent(ev)}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs" style={{ color: 'var(--muted)' }}>
                        {getHomeAway(ev)} · {ev.league}
                      </span>
                    </div>
                  </div>
                  {countdown && (
                    <div className="text-xs font-semibold shrink-0 text-right"
                         style={{ color: countdown.includes('dag') ? '#ef4444' : 'var(--accent)' }}>
                      {countdown}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Recent results */}
      <div>
        <div className="flex items-center gap-2 mb-2 px-1">
          <span className="text-sm">⚽</span>
          <span className="font-semibold text-sm">Nýlegar niðurstöður</span>
        </div>

        {loading ? (
          <div className="flex flex-col gap-2">
            {[1,2,3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : lastResults?.length === 0 ? (
          <div className="card text-center py-6" style={{ color: 'var(--muted)' }}>
            Engar niðurstöður tiltækar
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {lastResults?.map(ev => {
              const r = getResultLabel(ev)
              return (
                <div key={ev.id} className="card flex items-center gap-3 py-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                       style={{ background: r.bg, color: r.color, border: `1px solid ${r.color}44` }}>
                    {r.label}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">
                      {ev.homeTeam} vs {ev.awayTeam}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                      {ev.league} · {new Date(ev.date).toLocaleDateString('is-IS', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="text-lg font-bold shrink-0 tabular-nums">
                    {getScore(ev)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Tennis stub */}
      <div className="card" style={{ border: '1px solid rgba(139,92,246,0.25)' }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">🎾</span>
          <div>
            <div className="text-sm font-semibold">ATP Tennis</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Sinner · Alcaraz · Djokovic</div>
          </div>
          <div className="ml-auto text-xs px-2 py-1 rounded-lg"
               style={{ background: 'rgba(139,92,246,0.15)', color: 'var(--accent2)' }}>
            Bráðum
          </div>
        </div>
      </div>
    </div>
  )
}
