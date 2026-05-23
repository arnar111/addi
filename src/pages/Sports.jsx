import { useState, useEffect } from 'react'

const LEAGUES = [
  { id: 'eng.1', label: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', short: 'PL' },
  { id: 'esp.1', label: 'La Liga', flag: '🇪🇸', short: 'LL' },
  { id: 'ger.1', label: 'Bundesliga', flag: '🇩🇪', short: 'BL' },
  { id: 'fra.1', label: 'Ligue 1', flag: '🇫🇷', short: 'L1' },
  { id: 'usa.1', label: 'MLS', flag: '🇺🇸', short: 'MLS' },
]

function useScoreboard(leagueId) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    const key = `scores_${leagueId}`
    const keyAt = `scores_at_${leagueId}`
    const cached = sessionStorage.getItem(key)
    const cachedAt = sessionStorage.getItem(keyAt)
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 5 * 60 * 1000) {
      setData(JSON.parse(cached))
      setLoading(false)
      return
    }
    fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueId}/scoreboard`)
      .then(r => r.json())
      .then(d => {
        sessionStorage.setItem(key, JSON.stringify(d))
        sessionStorage.setItem(keyAt, String(Date.now()))
        setData(d)
        setLoading(false)
      })
      .catch(() => { setError('Gat ekki sótt leiki'); setLoading(false) })
  }, [leagueId])

  const refresh = () => {
    sessionStorage.removeItem(`scores_${leagueId}`)
    sessionStorage.removeItem(`scores_at_${leagueId}`)
    setData(null)
    setLoading(true)
    fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueId}/scoreboard`)
      .then(r => r.json())
      .then(d => {
        sessionStorage.setItem(`scores_${leagueId}`, JSON.stringify(d))
        sessionStorage.setItem(`scores_at_${leagueId}`, String(Date.now()))
        setData(d)
        setLoading(false)
      })
      .catch(() => { setError('Gat ekki sótt leiki'); setLoading(false) })
  }

  return { data, loading, error, refresh }
}

function useStandings(leagueId) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const key = `standings_${leagueId}`
    const keyAt = `standings_at_${leagueId}`
    const cached = sessionStorage.getItem(key)
    const cachedAt = sessionStorage.getItem(keyAt)
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 30 * 60 * 1000) {
      setData(JSON.parse(cached))
      setLoading(false)
      return
    }
    fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueId}/standings`)
      .then(r => r.json())
      .then(d => {
        sessionStorage.setItem(key, JSON.stringify(d))
        sessionStorage.setItem(keyAt, String(Date.now()))
        setData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [leagueId])

  return { data, loading }
}

function statusBadge(comp) {
  const state = comp?.status?.type?.state
  const detail = comp?.status?.type?.shortDetail || ''
  const clock = comp?.status?.displayClock
  if (state === 'in') {
    return (
      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold animate-pulse-soft"
            style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
        ⬤ {clock || detail}
      </span>
    )
  }
  if (state === 'post') {
    return <span className="text-[10px]" style={{ color: 'var(--muted)' }}>Lokið</span>
  }
  return <span className="text-[10px]" style={{ color: 'var(--muted)' }}>{detail || 'Á dagskrá'}</span>
}

function MatchCard({ event }) {
  const comp = event.competitions?.[0]
  if (!comp) return null
  const home = comp.competitors?.find(c => c.homeAway === 'home')
  const away = comp.competitors?.find(c => c.homeAway === 'away')
  const state = comp.status?.type?.state
  const isLive = state === 'in'
  const isFinal = state === 'post'
  const homeWin = isFinal && Number(home?.score) > Number(away?.score)
  const awayWin = isFinal && Number(away?.score) > Number(home?.score)

  return (
    <div className="flex items-center gap-3 py-3 px-3 rounded-xl transition-all"
         style={{ background: isLive ? 'rgba(239,68,68,0.04)' : 'var(--surface2)' }}>
      {/* Home */}
      <div className="flex-1 flex items-center justify-end gap-2">
        <span className="text-sm font-medium text-right leading-tight"
              style={{ color: homeWin ? 'var(--text)' : isFinal && !homeWin ? 'var(--muted)' : 'var(--text)' }}>
          {home?.team?.shortDisplayName || home?.team?.name}
        </span>
        {home?.team?.logo && (
          <img src={home.team.logo} alt="" className="w-6 h-6 object-contain" />
        )}
      </div>

      {/* Score / status */}
      <div className="flex flex-col items-center gap-1 shrink-0" style={{ minWidth: 72 }}>
        {isFinal || isLive ? (
          <div className="flex items-center gap-2">
            <span className={`text-xl font-bold tabular-nums ${homeWin ? '' : 'opacity-60'}`}>
              {home?.score ?? 0}
            </span>
            <span className="text-sm" style={{ color: 'var(--muted)' }}>–</span>
            <span className={`text-xl font-bold tabular-nums ${awayWin ? '' : 'opacity-60'}`}>
              {away?.score ?? 0}
            </span>
          </div>
        ) : (
          <span className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>vs</span>
        )}
        {statusBadge(comp)}
      </div>

      {/* Away */}
      <div className="flex-1 flex items-center gap-2">
        {away?.team?.logo && (
          <img src={away.team.logo} alt="" className="w-6 h-6 object-contain" />
        )}
        <span className="text-sm font-medium leading-tight"
              style={{ color: awayWin ? 'var(--text)' : isFinal && !awayWin ? 'var(--muted)' : 'var(--text)' }}>
          {away?.team?.shortDisplayName || away?.team?.name}
        </span>
      </div>
    </div>
  )
}

function getStat(entry, name) {
  return entry.stats?.find(s => s.name === name)?.value ?? '-'
}

function StandingsTable({ data }) {
  if (!data) return null
  const entries = data.standings?.entries || []
  const total = entries.length

  return (
    <div className="card overflow-hidden p-0">
      <div className="grid text-xs font-medium py-2.5 px-4"
           style={{
             gridTemplateColumns: '26px 1fr 30px 30px 30px 36px 40px',
             color: 'var(--muted)',
             borderBottom: '1px solid var(--border)',
           }}>
        <span>#</span>
        <span>Lið</span>
        <span className="text-center">L</span>
        <span className="text-center">J</span>
        <span className="text-center">T</span>
        <span className="text-center">MD</span>
        <span className="text-right font-bold">Stig</span>
      </div>
      {entries.map((entry, idx) => {
        const rank = Number(getStat(entry, 'rank') || idx + 1)
        const wins = getStat(entry, 'wins')
        const draws = getStat(entry, 'ties')
        const losses = getStat(entry, 'losses')
        const gd = getStat(entry, 'pointDifferential')
        const pts = getStat(entry, 'points')
        const isTop4 = rank <= 4
        const isEuropa = rank === 5 || rank === 6
        const isRelegation = total >= 18 && rank >= total - 2

        return (
          <div key={entry.team?.id || idx}
               className="grid items-center py-2.5 px-4 text-sm"
               style={{
                 gridTemplateColumns: '26px 1fr 30px 30px 30px 36px 40px',
                 borderBottom: idx < entries.length - 1 ? '1px solid var(--border)' : 'none',
                 borderLeft: `3px solid ${isTop4 ? 'var(--accent)' : isEuropa ? '#8b5cf6' : isRelegation ? 'var(--danger)' : 'transparent'}`,
               }}>
            <span className="font-medium text-xs" style={{ color: isTop4 ? 'var(--accent)' : 'var(--muted)' }}>
              {rank}
            </span>
            <div className="flex items-center gap-1.5 min-w-0">
              {entry.team?.logos?.[0]?.href && (
                <img src={entry.team.logos[0].href} alt="" className="w-4 h-4 object-contain shrink-0" />
              )}
              <span className="font-medium truncate text-xs">{entry.team?.shortDisplayName || entry.team?.name}</span>
            </div>
            <span className="text-center text-xs" style={{ color: 'var(--success)' }}>{wins}</span>
            <span className="text-center text-xs" style={{ color: 'var(--muted)' }}>{draws}</span>
            <span className="text-center text-xs" style={{ color: 'var(--danger)' }}>{losses}</span>
            <span className="text-center text-xs"
                  style={{ color: Number(gd) > 0 ? 'var(--success)' : Number(gd) < 0 ? 'var(--danger)' : 'var(--muted)' }}>
              {Number(gd) > 0 ? `+${gd}` : gd}
            </span>
            <span className="text-right font-bold text-sm">{pts}</span>
          </div>
        )
      })}

      {/* Legend */}
      <div className="flex gap-4 px-4 py-3" style={{ borderTop: '1px solid var(--border)' }}>
        {[
          { color: 'var(--accent)', label: 'CL' },
          { color: '#8b5cf6', label: 'Europa' },
          { color: 'var(--danger)', label: 'Brotthvarf' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--muted)' }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: color, display: 'inline-block', flexShrink: 0 }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Sports() {
  const [league, setLeague] = useState('eng.1')
  const [tab, setTab] = useState('scores')
  const { data: scores, loading: scoresLoading, error, refresh } = useScoreboard(league)
  const { data: standings, loading: standingsLoading } = useStandings(league)

  const events = scores?.events || []
  const selectedLeague = LEAGUES.find(l => l.id === league)

  const liveCount = events.filter(e => e.competitions?.[0]?.status?.type?.state === 'in').length
  const finishedCount = events.filter(e => e.competitions?.[0]?.status?.type?.state === 'post').length

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-xl font-semibold">Íþróttir ⚽</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {selectedLeague?.label}
            {liveCount > 0 && <span style={{ color: '#ef4444' }}> · {liveCount} LIVE</span>}
          </p>
        </div>
        <button onClick={refresh} className="btn btn-ghost" style={{ padding: '8px' }} disabled={scoresLoading}>
          <span style={{ display: 'inline-block', animation: scoresLoading ? 'spin 1s linear infinite' : 'none' }}>
            🔄
          </span>
        </button>
      </div>

      {/* League selector */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {LEAGUES.map(l => (
          <button key={l.id} onClick={() => setLeague(l.id)}
            className="btn shrink-0 text-xs py-1.5 gap-1"
            style={{
              background: league === l.id ? 'rgba(0,212,170,0.15)' : 'var(--surface)',
              color: league === l.id ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${league === l.id ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`,
            }}>
            <span>{l.flag}</span> {l.short}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[['scores', '⚽ Leikir'], ['standings', '🏆 Tafla']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className="btn text-sm flex-1 justify-center"
            style={{
              background: tab === t ? 'rgba(0,212,170,0.12)' : 'var(--surface)',
              color: tab === t ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${tab === t ? 'rgba(0,212,170,0.25)' : 'var(--border)'}`,
            }}>{l}</button>
        ))}
      </div>

      {tab === 'scores' && (
        <>
          {scoresLoading ? (
            <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
              <div className="text-2xl mb-2">⏳</div>
              Hleður leikjum...
            </div>
          ) : error ? (
            <div className="card text-center py-8" style={{ color: 'var(--danger)' }}>
              <div className="text-2xl mb-2">⚠️</div>
              {error}
            </div>
          ) : events.length === 0 ? (
            <div className="card text-center py-10" style={{ color: 'var(--muted)' }}>
              <div className="text-4xl mb-3">😴</div>
              <div className="font-medium">Engir leikir í dag</div>
              <div className="text-xs mt-1">Athugaðu aftur seinna!</div>
            </div>
          ) : (
            <div className="card flex flex-col gap-1.5 p-3">
              {liveCount > 0 && (
                <div className="text-xs font-semibold px-1 mb-1" style={{ color: '#ef4444' }}>
                  ⬤ LIVE
                </div>
              )}
              {events.filter(e => e.competitions?.[0]?.status?.type?.state === 'in').map(e => (
                <MatchCard key={e.id} event={e} />
              ))}
              {finishedCount > 0 && liveCount > 0 && (
                <div className="text-xs font-semibold px-1 mt-1 mb-1" style={{ color: 'var(--muted)' }}>
                  Lokið
                </div>
              )}
              {events.filter(e => e.competitions?.[0]?.status?.type?.state === 'post').map(e => (
                <MatchCard key={e.id} event={e} />
              ))}
              {events.filter(e => e.competitions?.[0]?.status?.type?.state === 'pre').length > 0 && (
                <div className="text-xs font-semibold px-1 mt-1 mb-1" style={{ color: 'var(--muted)' }}>
                  Á dagskrá
                </div>
              )}
              {events.filter(e => e.competitions?.[0]?.status?.type?.state === 'pre').map(e => (
                <MatchCard key={e.id} event={e} />
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'standings' && (
        standingsLoading ? (
          <div className="card text-center py-8" style={{ color: 'var(--muted)' }}>
            <div className="text-2xl mb-2">⏳</div>
            Hleður töflu...
          </div>
        ) : (
          <StandingsTable data={standings} />
        )
      )}
    </div>
  )
}
