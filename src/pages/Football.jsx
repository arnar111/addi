import { useFootball } from '../hooks/useFootball'
import { ExternalLink, RefreshCw } from 'lucide-react'

function MatchCard({ match, showScore }) {
  const date = new Date(match.strTimestamp || match.dateEvent + 'T' + (match.strTime || '00:00:00'))
  const isToday = new Date().toDateString() === date.toDateString()
  const isPast = date < new Date()

  const home = match.strHomeTeam
  const away = match.strAwayTeam
  const homeScore = match.intHomeScore
  const awayScore = match.intAwayScore
  const hasScore = homeScore !== null && homeScore !== undefined && homeScore !== ''

  return (
    <div className="card flex flex-col gap-2.5 py-3">
      <div className="flex items-center justify-between text-xs" style={{ color: 'var(--muted)' }}>
        <span>{match.strLeague}</span>
        <span style={{ color: isToday ? 'var(--accent)' : 'var(--muted)' }}>
          {isToday ? 'Í dag · ' : ''}
          {date.toLocaleDateString('is-IS', { weekday: 'short', month: 'short', day: 'numeric' })}
          {match.strTime ? ` · ${match.strTime.slice(0, 5)}` : ''}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {match.strHomeTeamBadge && (
          <img src={match.strHomeTeamBadge} alt={home} className="w-8 h-8 object-contain shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">{home}</div>
        </div>
        {hasScore ? (
          <div className="text-lg font-bold tabular-nums px-2" style={{ color: 'var(--accent)' }}>
            {homeScore} – {awayScore}
          </div>
        ) : (
          <div className="text-sm font-medium px-2" style={{ color: 'var(--muted)' }}>vs</div>
        )}
        <div className="flex-1 min-w-0 text-right">
          <div className="text-sm font-semibold truncate">{away}</div>
        </div>
        {match.strAwayTeamBadge && (
          <img src={match.strAwayTeamBadge} alt={away} className="w-8 h-8 object-contain shrink-0" />
        )}
      </div>

      {match.strVenue && (
        <div className="text-xs" style={{ color: 'var(--muted)' }}>📍 {match.strVenue}</div>
      )}
    </div>
  )
}

export default function Football() {
  const { league, setLeague, data, loading, error, leagues } = useFootball()

  const upcoming = data.upcoming || []
  const recent = data.recent || []
  const currentLeague = leagues[league]

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Fótbolti</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Leikir & niðurstöður</p>
        </div>
        <a href="https://theathletic.com" target="_blank" rel="noopener noreferrer"
           className="btn btn-ghost text-xs gap-1.5">
          <ExternalLink size={12} /> The Athletic
        </a>
      </div>

      {/* League tabs */}
      <div className="flex gap-2">
        {Object.entries(leagues).map(([key, l]) => (
          <button key={key} onClick={() => setLeague(key)}
            className="btn flex-1 text-sm justify-center"
            style={{
              background: league === key ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: league === key ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${league === key ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>
            {l.icon} {l.name}
          </button>
        ))}
      </div>

      {loading && (
        <div className="card flex items-center justify-center gap-2 py-8">
          <RefreshCw size={16} className="animate-spin" style={{ color: 'var(--accent)' }} />
          <span className="text-sm" style={{ color: 'var(--muted)' }}>Sæki leiki...</span>
        </div>
      )}

      {error && (
        <div className="card py-6 text-center" style={{ color: 'var(--muted)' }}>
          <div className="text-2xl mb-2">⚽</div>
          <div className="text-sm">Gat ekki sótt leiki</div>
          <div className="text-xs mt-1">{error}</div>
        </div>
      )}

      {!loading && !error && (
        <>
          {upcoming.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold px-1" style={{ color: 'var(--muted)' }}>
                Næstu leikir
              </h2>
              {upcoming.map(m => (
                <MatchCard key={m.idEvent} match={m} />
              ))}
            </div>
          )}

          {recent.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold px-1" style={{ color: 'var(--muted)' }}>
                Nýlegar niðurstöður
              </h2>
              {recent.map(m => (
                <MatchCard key={m.idEvent} match={m} showScore />
              ))}
            </div>
          )}

          {upcoming.length === 0 && recent.length === 0 && (
            <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
              <div className="text-3xl mb-3">⚽</div>
              <div className="text-sm">Engir leikir fundust</div>
              <div className="text-xs mt-1">
                {currentLeague.name} · {currentLeague.season}
              </div>
            </div>
          )}
        </>
      )}

      {/* Quick links */}
      <div className="card flex flex-col gap-3">
        <h3 className="text-sm font-semibold">Hlekkir</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'The Athletic', url: 'https://theathletic.com', icon: '📰' },
            { label: 'BBC Sport', url: 'https://bbc.com/sport/football', icon: '⚽' },
            { label: 'Takkarena', url: 'https://takkmvp.netlify.app', icon: '🏆' },
            { label: 'FIFA World Cup', url: 'https://fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026', icon: '🌍' },
          ].map(l => (
            <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-2 p-2.5 rounded-xl text-sm"
               style={{ background: 'var(--surface2)', color: 'var(--text)' }}>
              <span>{l.icon}</span>
              <span className="text-xs truncate">{l.label}</span>
              <ExternalLink size={10} className="ml-auto shrink-0" style={{ color: 'var(--muted)' }} />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
