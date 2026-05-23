import { useState, useEffect } from 'react'

const TEAMS = {
  mancity: { id: 133615, name: 'Man City', short: 'MCI', color: '#6CABDD' },
  liverpool: { id: 133602, name: 'Liverpool', short: 'LIV', color: '#C8102E' },
  iceland: { id: 170, name: 'Ísland', short: 'ISL', color: '#003897' },
}

const CACHE_TTL = 30 * 60 * 1000

function cached(key, ttl, fetcher) {
  const raw = localStorage.getItem(key)
  if (raw) {
    try {
      const { ts, data } = JSON.parse(raw)
      if (Date.now() - ts < ttl) return Promise.resolve(data)
    } catch {}
  }
  return fetcher().then(data => {
    localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }))
    return data
  })
}

async function fetchNextEvents(teamId) {
  const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=${teamId}`)
  const json = await res.json()
  return json.events || []
}

async function fetchLastEvents(teamId) {
  const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${teamId}`)
  const json = await res.json()
  return json.results || []
}

export function useSports() {
  const [fixtures, setFixtures] = useState({})
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    Promise.all(
      Object.entries(TEAMS).map(([key, team]) =>
        Promise.all([
          cached(`sports_next_${key}`, CACHE_TTL, () => fetchNextEvents(team.id)),
          cached(`sports_last_${key}`, CACHE_TTL, () => fetchLastEvents(team.id)),
        ]).then(([next, last]) => ({ key, next: next.slice(0, 3), last: last.slice(0, 3) }))
      )
    )
      .then(all => {
        if (cancelled) return
        const fix = {}, res = {}
        all.forEach(({ key, next, last }) => { fix[key] = next; res[key] = last })
        setFixtures(fix)
        setResults(res)
        setLoading(false)
      })
      .catch(e => {
        if (!cancelled) { setError(e.message); setLoading(false) }
      })

    return () => { cancelled = true }
  }, [])

  return { fixtures, results, teams: TEAMS, loading, error }
}
