import { useState, useEffect } from 'react'

const PL_LEAGUE_ID = 4328

function useFootball() {
  const [results, setResults] = useState(null)
  const [fixtures, setFixtures] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const cached = sessionStorage.getItem('addi_football_v2')
    if (cached) {
      try {
        const { data, ts } = JSON.parse(cached)
        if (Date.now() - ts < 30 * 60 * 1000) {
          setResults(data.results)
          setFixtures(data.fixtures)
          setLoading(false)
          return
        }
      } catch (_) {}
    }

    Promise.all([
      fetch(`https://www.thesportsdb.com/api/v1/json/3/eventspastleague.php?id=${PL_LEAGUE_ID}`)
        .then(r => r.json()),
      fetch(`https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${PL_LEAGUE_ID}`)
        .then(r => r.json()),
    ])
      .then(([past, next]) => {
        const r = (past.events || []).slice(-5).reverse()
        const f = (next.events || []).slice(0, 5)
        setResults(r)
        setFixtures(f)
        sessionStorage.setItem('addi_football_v2', JSON.stringify({
          data: { results: r, fixtures: f },
          ts: Date.now(),
        }))
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return { results, fixtures, loading, error }
}

function TeamBadge({ name }) {
  const abbr = name
    .replace(/^(AFC|FC|Manchester|Arsenal|Chelsea|Liverpool|Tottenham|Everton|Leicester|Newcastle|West Ham|Aston Villa|Brighton|Brentford|Wolves|Crystal Palace|Fulham|Nottm Forest|Bournemouth|Ipswich|Southampton) /i, '')
    .slice(0, 3)
    .toUpperCase()
  return (
    <span className="w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0"
      style={{ background: 'var(--surface)', fontSize: 9 }}>
      {abbr}
    </span>
  )
}

export default function FootballWidget() {
  const { results, fixtures, loading, error } = useFootball()
  const [tab, setTab] = useState('results')

  if (loading) return (
    <div className="card animate-pulse-soft flex items-center gap-3 py-3">
      <span className="text-xl">⚽</span>
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-3 w-40 rounded" style={{ background: 'var(--surface2)' }} />
        <div className="h-3 w-28 rounded" style={{ background: 'var(--surface2)' }} />
      </div>
    </div>
  )

  if (error) return (
    <div className="card flex items-center gap-3">
      <span className="text-xl">⚽</span>
      <div className="text-xs" style={{ color: 'var(--muted)' }}>Premier League gögn ekki tiltæk</div>
    </div>
  )

  const events = tab === 'results' ? results : fixtures

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>⚽</span>
          <span className="font-semibold text-sm">Premier League</span>
        </div>
        <div className="flex gap-1">
          {[['results', 'Úrslit'], ['fixtures', 'Leikir']].map(([t, l]) => (
            <button key={t} onClick={() => setTab(t)}
              className="text-xs px-2.5 py-1 rounded-lg transition-all"
              style={{
                background: tab === t ? 'rgba(0,212,170,0.15)' : 'var(--surface2)',
                color: tab === t ? 'var(--accent)' : 'var(--muted)',
              }}>{l}</button>
          ))}
        </div>
      </div>

      {!events || events.length === 0 ? (
        <div className="text-xs text-center py-2" style={{ color: 'var(--muted)' }}>
          {tab === 'results' ? 'Engir leikir nýverið' : 'Engir leikir á dagskrá'}
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {events.slice(0, 4).map(ev => (
            <div key={ev.idEvent}
              className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs"
              style={{ background: 'var(--surface2)' }}>
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <TeamBadge name={ev.strHomeTeam} />
                <span className="truncate font-medium">{ev.strHomeTeam}</span>
              </div>
              {tab === 'results' ? (
                <span className="font-bold text-sm shrink-0 px-2 py-0.5 rounded-md"
                  style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)', minWidth: 40, textAlign: 'center' }}>
                  {ev.intHomeScore ?? '?'} – {ev.intAwayScore ?? '?'}
                </span>
              ) : (
                <span className="font-medium shrink-0 mx-1" style={{ color: 'var(--accent)' }}>
                  {new Date(ev.dateEvent).toLocaleDateString('is-IS', { month: 'short', day: 'numeric' })}
                </span>
              )}
              <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
                <span className="truncate font-medium text-right">{ev.strAwayTeam}</span>
                <TeamBadge name={ev.strAwayTeam} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
