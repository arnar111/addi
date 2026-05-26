import { useState, useEffect } from 'react'
import { ExternalLink, RefreshCw } from 'lucide-react'

const CACHE_KEY = 'pl_standings_v2'
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

function getStatValue(stats, name) {
  return stats?.find(s => s.name === name)?.value ?? '-'
}

export default function SportsWidget() {
  const [standings, setStandings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = () => {
    setLoading(true)
    setError(null)
    const cached = sessionStorage.getItem(CACHE_KEY)
    const cachedAt = sessionStorage.getItem(CACHE_KEY + '_at')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < CACHE_DURATION) {
      try {
        setStandings(JSON.parse(cached))
        setLoading(false)
        return
      } catch {}
    }

    fetch('https://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings')
      .then(r => { if (!r.ok) throw new Error('Network error'); return r.json() })
      .then(d => {
        const raw = d?.standings?.[0]?.entries ?? d?.children?.[0]?.standings?.[0]?.entries ?? []
        const teams = raw.map((e, idx) => ({
          pos: idx + 1,
          name: e.team?.displayName ?? '?',
          abbr: e.team?.abbreviation ?? '?',
          logo: e.team?.logos?.[0]?.href ?? null,
          played: getStatValue(e.stats, 'gamesPlayed'),
          won: getStatValue(e.stats, 'wins'),
          drawn: getStatValue(e.stats, 'ties'),
          lost: getStatValue(e.stats, 'losses'),
          gd: getStatValue(e.stats, 'pointDifferential'),
          pts: getStatValue(e.stats, 'points'),
        }))

        if (teams.length === 0) throw new Error('No data')

        const result = { teams: teams.slice(0, 8), updatedAt: Date.now() }
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(result))
        sessionStorage.setItem(CACHE_KEY + '_at', String(Date.now()))
        setStandings(result)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => { load() }, [])

  if (loading) return (
    <div className="card flex items-center gap-3 py-3">
      <div className="text-xl">⚽</div>
      <div className="text-sm" style={{ color: 'var(--muted)' }}>Hleður PL töflu...</div>
    </div>
  )

  if (error || !standings) return (
    <div className="card flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xl">⚽</span>
        <span className="text-sm" style={{ color: 'var(--muted)' }}>PL tafla - villa</span>
      </div>
      <button onClick={load} style={{ color: 'var(--accent)' }}>
        <RefreshCw size={14} />
      </button>
    </div>
  )

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">⚽</span>
          <span className="text-sm font-semibold">Premier League</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load} style={{ color: 'var(--muted)' }}>
            <RefreshCw size={12} />
          </button>
          <a href="https://www.theathletic.com" target="_blank" rel="noopener noreferrer"
             className="text-xs flex items-center gap-0.5" style={{ color: 'var(--accent)' }}>
            Athletic <ExternalLink size={10} />
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2 px-2 pb-1 text-xs" style={{ color: 'var(--muted)' }}>
          <span className="w-5">#</span>
          <span className="flex-1">Lið</span>
          <span className="w-5 text-right">L</span>
          <span className="w-5 text-right">D</span>
          <span className="w-7 text-right font-semibold">Stig</span>
        </div>
        {standings.teams.map((team) => {
          const isArsenal = team.name.toLowerCase().includes('arsenal')
          const isTop4 = team.pos <= 4
          return (
            <div key={team.pos}
              className="flex items-center gap-2 py-1.5 px-2 rounded-lg text-xs transition-all"
              style={{
                background: isArsenal ? 'rgba(0,212,170,0.08)' : 'transparent',
                border: `1px solid ${isArsenal ? 'rgba(0,212,170,0.25)' : 'transparent'}`,
              }}>
              <span className="w-5 text-right font-medium" style={{
                color: isTop4 ? 'var(--accent)' : 'var(--muted)',
              }}>{team.pos}</span>
              {team.logo
                ? <img src={team.logo} alt={team.abbr} className="w-4 h-4 object-contain shrink-0" />
                : <span className="w-4 shrink-0" />}
              <span className="flex-1 font-medium truncate"
                style={{ color: isArsenal ? 'var(--accent)' : 'var(--text)' }}>
                {isArsenal ? '⭐ ' : ''}{team.name}
              </span>
              <span className="w-5 text-right" style={{ color: 'var(--muted)' }}>{team.played}</span>
              <span className="w-5 text-right" style={{ color: team.gd > 0 ? 'var(--success)' : team.gd < 0 ? 'var(--danger)' : 'var(--muted)' }}>
                {team.gd > 0 ? '+' : ''}{team.gd}
              </span>
              <span className="w-7 text-right font-bold"
                style={{ color: isArsenal ? 'var(--accent)' : 'var(--text)' }}>
                {team.pts}
              </span>
            </div>
          )
        })}
      </div>

      {standings.updatedAt && (
        <div className="text-right mt-2 text-xs" style={{ color: 'var(--muted)' }}>
          {new Date(standings.updatedAt).toLocaleDateString('is-IS', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
    </div>
  )
}
