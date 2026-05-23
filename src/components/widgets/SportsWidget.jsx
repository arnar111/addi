import { useState, useEffect } from 'react'

const LEAGUES = [
  { id: 'eng.1', name: 'PL', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'esp.1', name: 'LL', flag: '🇪🇸' },
  { id: 'ger.1', name: 'BL', flag: '🇩🇪' },
]

const FAVE = ['Manchester City', 'Liverpool', 'Man City', 'Arsenal', 'Iceland', 'United States']

const SHORT = {
  'Manchester City': 'Man City',
  'Manchester United': 'Man Utd',
  'Tottenham Hotspur': 'Spurs',
  'Wolverhampton Wanderers': 'Wolves',
  'Newcastle United': 'Newcastle',
  'West Ham United': 'West Ham',
  'Nottingham Forest': "Nott'm F",
  'Brighton & Hove Albion': 'Brighton',
  'Bayer Leverkusen': 'Leverkusen',
  'Borussia Dortmund': 'Dortmund',
  'RB Leipzig': 'Leipzig',
}

function sn(name = '') {
  return SHORT[name] || (name.length > 14 ? name.slice(0, 13) + '…' : name)
}

function isFave(name = '') {
  return FAVE.some(t => name.includes(t))
}

export default function SportsWidget() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')
  const [error, setError] = useState(false)

  useEffect(() => {
    const cached = sessionStorage.getItem('addi_sports')
    const cachedAt = sessionStorage.getItem('addi_sportsAt')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 8 * 60 * 1000) {
      setMatches(JSON.parse(cached))
      setLoading(false)
      return
    }

    Promise.allSettled(
      LEAGUES.map(l =>
        fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${l.id}/scoreboard`)
          .then(r => r.ok ? r.json() : { events: [] })
          .then(d => (d.events || []).map(e => {
            const comp = e.competitions?.[0]
            const home = comp?.competitors?.find(c => c.homeAway === 'home')
            const away = comp?.competitors?.find(c => c.homeAway === 'away')
            const hn = home?.team?.name || ''
            const an = away?.team?.name || ''
            const fave = isFave(hn) || isFave(an)
            const inProg = e.status?.type?.name === 'STATUS_IN_PROGRESS'
            const done = e.status?.type?.completed === true
            return {
              id: e.id,
              league: l.name, flag: l.flag,
              home: hn, homeScore: home?.score,
              away: an, awayScore: away?.score,
              status: e.status?.type?.description || '',
              clock: e.status?.displayClock || '',
              inProg, done, fave,
              date: e.date,
            }
          }))
      )
    ).then(results => {
      const flat = results
        .filter(r => r.status === 'fulfilled')
        .flatMap(r => r.value)
        .sort((a, b) => {
          if (a.fave !== b.fave) return b.fave - a.fave
          if (a.inProg !== b.inProg) return b.inProg - a.inProg
          return new Date(b.date) - new Date(a.date)
        })
      if (flat.length === 0) setError(true)
      sessionStorage.setItem('addi_sports', JSON.stringify(flat))
      sessionStorage.setItem('addi_sportsAt', String(Date.now()))
      setMatches(flat)
      setLoading(false)
    })
  }, [])

  const shown = tab === 'fave'
    ? matches.filter(m => m.fave)
    : matches.slice(0, 8)

  if (error && !loading) return null

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">⚽</span>
          <span className="text-sm font-semibold">Knattspyrna</span>
        </div>
        <div className="flex gap-1">
          {[['all', 'Allt'], ['fave', '⭐']].map(([t, l]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="text-xs px-2.5 py-1 rounded-lg transition-all"
              style={{
                background: tab === t ? 'rgba(0,212,170,0.15)' : 'transparent',
                color: tab === t ? 'var(--accent)' : 'var(--muted)',
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-1.5">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-8 rounded-xl animate-pulse-soft" style={{ background: 'var(--surface2)' }} />
          ))}
        </div>
      ) : shown.length === 0 ? (
        <div className="text-xs text-center py-4" style={{ color: 'var(--muted)' }}>
          {tab === 'fave' ? 'Engar leikir fyrir lið þín núna' : 'Engar leikir í dag'}
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {shown.map(m => (
            <div
              key={m.id}
              className="flex items-center gap-2 px-2 py-2 rounded-xl"
              style={{
                background: m.fave ? 'rgba(0,212,170,0.05)' : 'transparent',
                border: m.fave ? '1px solid rgba(0,212,170,0.1)' : '1px solid transparent',
              }}
            >
              <span className="text-xs shrink-0" title={m.league}>{m.flag}</span>

              <div className="flex-1 min-w-0 grid items-center" style={{ gridTemplateColumns: '1fr auto 1fr', gap: 4 }}>
                <span
                  className="text-xs truncate text-right"
                  style={{ fontWeight: isFave(m.home) ? 600 : 400, color: isFave(m.home) ? 'var(--text)' : 'var(--muted)' }}
                >
                  {sn(m.home)}
                </span>

                <span
                  className="text-xs font-mono font-bold px-1.5 py-0.5 rounded-md tabular-nums shrink-0"
                  style={{
                    background: m.done || m.inProg ? 'var(--surface2)' : 'transparent',
                    color: m.inProg ? 'var(--success)' : m.done ? 'var(--text)' : 'var(--muted)',
                    minWidth: 46,
                    textAlign: 'center',
                    fontSize: 11,
                  }}
                >
                  {m.done || m.inProg
                    ? `${m.homeScore ?? '?'} - ${m.awayScore ?? '?'}`
                    : new Date(m.date).toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' })
                  }
                </span>

                <span
                  className="text-xs truncate"
                  style={{ fontWeight: isFave(m.away) ? 600 : 400, color: isFave(m.away) ? 'var(--text)' : 'var(--muted)' }}
                >
                  {sn(m.away)}
                </span>
              </div>

              {m.inProg && (
                <span className="text-xs shrink-0 font-medium" style={{ color: 'var(--success)' }}>
                  🔴{m.clock}
                </span>
              )}
              {m.done && !m.inProg && (
                <span className="text-xs shrink-0" style={{ color: 'var(--muted)' }}>Lok.</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
