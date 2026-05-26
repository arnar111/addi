import { useState, useEffect } from 'react'

const CACHE_MS = 5 * 60 * 1000

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

function cached(key, fn, ms = CACHE_MS) {
  const raw = sessionStorage.getItem(key)
  const at = sessionStorage.getItem(key + '_at')
  if (raw && at && Date.now() - Number(at) < ms) {
    return Promise.resolve(JSON.parse(raw))
  }
  return fn().then(data => {
    sessionStorage.setItem(key, JSON.stringify(data))
    sessionStorage.setItem(key + '_at', String(Date.now()))
    return data
  })
}

function parseNBA(data) {
  const events = data.events || []
  const cavs = events.filter(e =>
    e.competitions?.[0]?.competitors?.some(c =>
      c.team?.abbreviation === 'CLE' || c.team?.displayName?.includes('Cavaliers')
    )
  )
  const all = events.slice(0, 8).map(e => {
    const comp = e.competitions?.[0]
    const [h, a] = comp?.competitors || []
    const status = comp?.status?.type
    return {
      id: e.id,
      home: { name: h?.team?.shortDisplayName || h?.team?.displayName || '?', score: h?.score, logo: h?.team?.logo, abbr: h?.team?.abbreviation },
      away: { name: a?.team?.shortDisplayName || a?.team?.displayName || '?', score: a?.score, logo: a?.team?.logo, abbr: a?.team?.abbreviation },
      status: status?.description || '',
      state: status?.state || 'pre',
      date: e.date,
      name: e.name,
    }
  })
  return { cavs: cavs.length ? cavs.map(e => {
    const comp = e.competitions?.[0]
    const [h, a] = comp?.competitors || []
    const status = comp?.status?.type
    return {
      id: e.id,
      home: { name: h?.team?.shortDisplayName || '?', score: h?.score, abbr: h?.team?.abbreviation },
      away: { name: a?.team?.shortDisplayName || '?', score: a?.score, abbr: a?.team?.abbreviation },
      status: status?.description || '',
      state: status?.state || 'pre',
      date: e.date,
    }
  }) : null, all }
}

function parseSerieA(data) {
  const events = data.events || []
  const inter = events.filter(e =>
    e.competitions?.[0]?.competitors?.some(c =>
      c.team?.displayName?.includes('Inter') || c.team?.abbreviation === 'INT' || c.team?.shortDisplayName === 'Inter'
    )
  )
  const all = events.slice(0, 6).map(e => {
    const comp = e.competitions?.[0]
    const [h, a] = comp?.competitors || []
    const status = comp?.status?.type
    return {
      id: e.id,
      home: { name: h?.team?.shortDisplayName || h?.team?.displayName || '?', score: h?.score },
      away: { name: a?.team?.shortDisplayName || a?.team?.displayName || '?', score: a?.score },
      status: status?.description || '',
      state: status?.state || 'pre',
      date: e.date,
    }
  })
  return { inter: inter.length ? inter.map(e => {
    const comp = e.competitions?.[0]
    const [h, a] = comp?.competitors || []
    const status = comp?.status?.type
    return {
      id: e.id,
      home: { name: h?.team?.shortDisplayName || '?', score: h?.score },
      away: { name: a?.team?.shortDisplayName || '?', score: a?.score },
      status: status?.description || '',
      state: status?.state || 'pre',
      date: e.date,
    }
  }) : null, all }
}

export function useSports() {
  const [nba, setNba] = useState(null)
  const [soccer, setSoccer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const [nbaData, soccerData] = await Promise.allSettled([
          cached('espn_nba', () => fetchJson('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard')),
          cached('espn_ita', () => fetchJson('https://site.api.espn.com/apis/site/v2/sports/soccer/ita.1/scoreboard')),
        ])
        if (cancelled) return
        if (nbaData.status === 'fulfilled') setNba(parseNBA(nbaData.value))
        if (soccerData.status === 'fulfilled') setSoccer(parseSerieA(soccerData.value))
      } catch {}
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  return { nba, soccer, loading }
}
