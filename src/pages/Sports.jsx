import { useState } from 'react'
import { useSports } from '../hooks/useSports'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { RefreshCw, Trophy, BarChart2, Star } from 'lucide-react'

function TeamBadge({ logo, name, size = 6 }) {
  return logo
    ? <img src={logo} alt={name} className={`w-${size} h-${size} object-contain`} />
    : <div className={`w-${size} h-${size} rounded-full flex items-center justify-center text-xs font-bold`}
           style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
        {(name || '?').slice(0, 2).toUpperCase()}
      </div>
}

function MatchCard({ match, favoriteTeam }) {
  const isLive = match.state === 'in'
  const isDone = match.state === 'post'
  const isPre = match.state === 'pre'
  const isFav = favoriteTeam && (
    match.home.name?.toLowerCase().includes(favoriteTeam.toLowerCase()) ||
    match.away.name?.toLowerCase().includes(favoriteTeam.toLowerCase())
  )

  const dateStr = new Date(match.date).toLocaleString('is-IS', {
    weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  return (
    <div className="card" style={{
      border: isFav ? '1px solid rgba(139,92,246,0.4)' : '1px solid var(--border)',
      background: isFav ? 'linear-gradient(135deg, rgba(139,92,246,0.06), var(--surface))' : 'var(--surface)',
    }}>
      {isFav && (
        <div className="flex items-center gap-1 mb-2">
          <Star size={11} style={{ color: 'var(--accent2)' }} />
          <span className="text-xs font-medium" style={{ color: 'var(--accent2)' }}>Uppáhaldslið</span>
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Home */}
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <TeamBadge logo={match.home.logo} name={match.home.name} size={10} />
          <span className="text-xs font-medium text-center leading-tight">{match.home.name}</span>
        </div>

        {/* Score / Time */}
        <div className="flex flex-col items-center gap-1 shrink-0 min-w-[80px]">
          {(isDone || isLive) ? (
            <>
              <div className="text-2xl font-bold tabular-nums"
                   style={{ color: isLive ? 'var(--success)' : 'var(--text)' }}>
                {match.home.score} – {match.away.score}
              </div>
              {isLive && (
                <span className="text-xs px-2 py-0.5 rounded-full font-bold animate-pulse-soft"
                      style={{ background: 'rgba(34,197,94,0.2)', color: 'var(--success)' }}>
                  LIVE · {match.statusDesc}
                </span>
              )}
              {isDone && (
                <span className="text-xs" style={{ color: 'var(--muted)' }}>Lokið</span>
              )}
            </>
          ) : (
            <>
              <span className="text-lg font-semibold" style={{ color: 'var(--muted)' }}>vs</span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{dateStr}</span>
            </>
          )}
        </div>

        {/* Away */}
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <TeamBadge logo={match.away.logo} name={match.away.name} size={10} />
          <span className="text-xs font-medium text-center leading-tight">{match.away.name}</span>
        </div>
      </div>
    </div>
  )
}

function StandingsTable({ standings, favoriteTeam }) {
  if (!standings.length) return (
    <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
      Taflan er ekki tiltæk
    </div>
  )

  return (
    <div className="card p-0 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <BarChart2 size={14} style={{ color: 'var(--accent)' }} />
        <span className="text-sm font-semibold">Stigatafla — Premier League</span>
      </div>
      <div className="overflow-x-auto">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
              <th style={{ padding: '8px 8px 8px 16px', textAlign: 'left', width: 28 }}>#</th>
              <th style={{ padding: '8px 4px', textAlign: 'left', minWidth: 130 }}>Lið</th>
              <th style={{ padding: '8px 4px', textAlign: 'center', width: 32 }}>L</th>
              <th style={{ padding: '8px 4px', textAlign: 'center', width: 32 }}>W</th>
              <th style={{ padding: '8px 4px', textAlign: 'center', width: 32 }}>D</th>
              <th style={{ padding: '8px 4px', textAlign: 'center', width: 32 }}>T</th>
              <th style={{ padding: '8px 4px', textAlign: 'center', width: 40 }}>GD</th>
              <th style={{ padding: '8px 16px 8px 4px', textAlign: 'center', width: 40, fontWeight: 700, color: 'var(--text)' }}>Stig</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s, i) => {
              const isFav = favoriteTeam && s.team?.toLowerCase().includes(favoriteTeam.toLowerCase())
              const isTop4 = s.rank <= 4
              const isTop6 = s.rank <= 6
              return (
                <tr key={i} style={{
                  background: isFav ? 'rgba(139,92,246,0.08)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                  borderLeft: isFav ? '2px solid var(--accent2)' : '2px solid transparent',
                }}>
                  <td style={{ padding: '7px 8px 7px 16px', color: isTop4 ? 'var(--accent)' : 'var(--muted)', fontWeight: isTop4 ? 700 : 400 }}>
                    {s.rank}
                  </td>
                  <td style={{ padding: '7px 4px' }}>
                    <div className="flex items-center gap-1.5">
                      {s.logo && <img src={s.logo} alt={s.team} className="w-4 h-4 object-contain" />}
                      <span style={{ fontWeight: isFav ? 700 : 400, color: isFav ? 'var(--text)' : 'inherit' }}>
                        {s.team}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '7px 4px', textAlign: 'center', color: 'var(--muted)' }}>{s.gp}</td>
                  <td style={{ padding: '7px 4px', textAlign: 'center' }}>{s.w}</td>
                  <td style={{ padding: '7px 4px', textAlign: 'center', color: 'var(--muted)' }}>{s.d}</td>
                  <td style={{ padding: '7px 4px', textAlign: 'center', color: 'var(--muted)' }}>{s.l}</td>
                  <td style={{ padding: '7px 4px', textAlign: 'center', color: s.gd >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                    {s.gd > 0 ? '+' : ''}{s.gd}
                  </td>
                  <td style={{ padding: '7px 16px 7px 4px', textAlign: 'center', fontWeight: 700 }}>
                    {s.pts}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 flex gap-4 text-xs" style={{ color: 'var(--muted)', borderTop: '1px solid var(--border)' }}>
        <span style={{ color: 'var(--accent)' }}>■</span> Champions League
        <span>■</span> Europa League
      </div>
    </div>
  )
}

export default function Sports() {
  const { plMatches, plStandings, loading } = useSports()
  const [favoriteTeam, setFavoriteTeam] = useLocalStorage('addi_fav_team', 'Man Utd')
  const [tab, setTab] = useState('matches')

  const liveMatches = plMatches.filter(m => m.state === 'in')
  const doneMatches = plMatches.filter(m => m.state === 'post')
  const preMatches = plMatches.filter(m => m.state === 'pre')

  const displayMatches = tab === 'matches'
    ? [...liveMatches, ...doneMatches, ...preMatches]
    : plStandings

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <div className="flex items-center gap-2 mb-1">
          <Trophy size={18} style={{ color: 'var(--accent2)' }} />
          <h1 className="text-xl font-semibold">Íþróttir</h1>
          {liveMatches.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full font-bold animate-pulse-soft"
                  style={{ background: 'rgba(34,197,94,0.2)', color: 'var(--success)' }}>
              {liveMatches.length} LIVE
            </span>
          )}
        </div>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Premier League 2025/26</p>
      </div>

      {/* Favorite team picker */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {['Man Utd', 'Liverpool', 'Arsenal', 'Man City', 'Chelsea', 'Tottenham'].map(team => (
          <button key={team}
            onClick={() => setFavoriteTeam(team)}
            className="btn shrink-0 text-xs py-1.5"
            style={{
              background: favoriteTeam === team ? 'rgba(139,92,246,0.15)' : 'var(--surface)',
              color: favoriteTeam === team ? 'var(--accent2)' : 'var(--muted)',
              border: `1px solid ${favoriteTeam === team ? 'rgba(139,92,246,0.4)' : 'var(--border)'}`,
            }}>
            {favoriteTeam === team ? '⭐ ' : ''}{team}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[['matches', '⚽ Leikir'], ['standings', '📊 Tafla']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="card animate-pulse-soft h-24" />
          ))}
        </div>
      ) : tab === 'matches' ? (
        <div className="flex flex-col gap-3">
          {liveMatches.length > 0 && (
            <div className="text-xs font-semibold px-1" style={{ color: 'var(--success)' }}>🔴 LIVE</div>
          )}
          {liveMatches.map(m => <MatchCard key={m.id} match={m} favoriteTeam={favoriteTeam} />)}

          {doneMatches.length > 0 && (
            <div className="text-xs font-semibold px-1 mt-1" style={{ color: 'var(--muted)' }}>Nýlokið</div>
          )}
          {doneMatches.slice(0, 5).map(m => <MatchCard key={m.id} match={m} favoriteTeam={favoriteTeam} />)}

          {preMatches.length > 0 && (
            <div className="text-xs font-semibold px-1 mt-1" style={{ color: 'var(--muted)' }}>Framundan</div>
          )}
          {preMatches.slice(0, 5).map(m => <MatchCard key={m.id} match={m} favoriteTeam={favoriteTeam} />)}

          {plMatches.length === 0 && (
            <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
              <div className="text-4xl mb-3">⚽</div>
              <div className="font-medium mb-1">Engir leikir í dag</div>
              <div className="text-xs">Skoðaðu stigatöfluna!</div>
            </div>
          )}
        </div>
      ) : (
        <StandingsTable standings={plStandings} favoriteTeam={favoriteTeam} />
      )}
    </div>
  )
}
