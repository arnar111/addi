import { useState, useEffect } from 'react'

const CACHE_TTL = 5 * 60 * 1000

function cachedFetch(key, url, ttl = CACHE_TTL) {
  try {
    const hit = sessionStorage.getItem(key)
    if (hit) {
      const { data, at } = JSON.parse(hit)
      if (Date.now() - at < ttl) return Promise.resolve(data)
    }
  } catch {}
  return fetch(url)
    .then(r => r.json())
    .then(data => {
      try { sessionStorage.setItem(key, JSON.stringify({ data, at: Date.now() })) } catch {}
      return data
    })
}

function parseSchedule(json) {
  const events = json.events || []
  const now = new Date()
  const upcoming = []
  const recent = []

  for (const e of events) {
    const date = new Date(e.date)
    const comps = e.competitions?.[0]
    const home = comps?.competitors?.find(c => c.homeAway === 'home')
    const away = comps?.competitors?.find(c => c.homeAway === 'away')
    const statusName = e.status?.type?.name || ''
    const item = {
      id: e.id,
      date: e.date,
      status: statusName,
      statusDisplay: e.status?.type?.shortDetail || e.status?.type?.description || '',
      live: statusName?.includes('IN_PROGRESS') || statusName?.includes('HALFTIME'),
      home: {
        name: home?.team?.displayName || home?.team?.name || '',
        abbr: home?.team?.abbreviation || '',
        logo: home?.team?.logo || '',
        score: home?.score ?? null,
        winner: home?.winner,
      },
      away: {
        name: away?.team?.displayName || away?.team?.name || '',
        abbr: away?.team?.abbreviation || '',
        logo: away?.team?.logo || '',
        score: away?.score ?? null,
        winner: away?.winner,
      },
      venue: comps?.venue?.fullName || '',
    }
    if (statusName === 'STATUS_FINAL') {
      recent.push(item)
    } else {
      upcoming.push(item)
    }
  }

  return {
    upcoming: upcoming.slice(0, 5),
    recent: recent.slice(-5).reverse(),
  }
}

export function useSports() {
  const [inter, setInter] = useState(null)
  const [knicks, setKnicks] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = () => {
    try { sessionStorage.removeItem('inter_sched'); sessionStorage.removeItem('knicks_sched') } catch {}
    setLoading(true)
    load()
  }

  function load() {
    Promise.allSettled([
      cachedFetch('inter_sched',
        'https://site.api.espn.com/apis/site/v2/sports/soccer/ita.1/teams/110/schedule'),
      cachedFetch('knicks_sched',
        'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/18/schedule'),
    ]).then(([interRes, knicksRes]) => {
      if (interRes.status === 'fulfilled') setInter(parseSchedule(interRes.value))
      else setError('Could not load Inter Milan data')
      if (knicksRes.status === 'fulfilled') setKnicks(parseSchedule(knicksRes.value))
      else setError(e => e || 'Could not load Knicks data')
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  return { inter, knicks, loading, error, refresh }
}
