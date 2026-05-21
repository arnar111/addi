import { useState, useEffect } from 'react'

export const WC_START = new Date('2026-06-11T19:00:00Z')
export const WC_END = new Date('2026-07-19T21:00:00Z')

const FLAGS = {
  'Argentina': '🇦🇷', 'Australia': '🇦🇺', 'Belgium': '🇧🇪', 'Brazil': '🇧🇷',
  'Cameroon': '🇨🇲', 'Canada': '🇨🇦', 'Chile': '🇨🇱', 'Colombia': '🇨🇴',
  'Costa Rica': '🇨🇷', 'Croatia': '🇭🇷', 'Denmark': '🇩🇰', 'Ecuador': '🇪🇨',
  'Egypt': '🇪🇬', 'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'France': '🇫🇷', 'Germany': '🇩🇪',
  'Ghana': '🇬🇭', 'Honduras': '🇭🇳', 'Iceland': '🇮🇸', 'Indonesia': '🇮🇩',
  'Iran': '🇮🇷', 'Italy': '🇮🇹', 'Japan': '🇯🇵', 'Mexico': '🇲🇽',
  'Morocco': '🇲🇦', 'Netherlands': '🇳🇱', 'New Zealand': '🇳🇿', 'Nigeria': '🇳🇬',
  'Norway': '🇳🇴', 'Panama': '🇵🇦', 'Paraguay': '🇵🇾', 'Peru': '🇵🇪',
  'Poland': '🇵🇱', 'Portugal': '🇵🇹', 'Qatar': '🇶🇦', 'Romania': '🇷🇴',
  'Saudi Arabia': '🇸🇦', 'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Senegal': '🇸🇳', 'Serbia': '🇷🇸',
  'Slovakia': '🇸🇰', 'South Korea': '🇰🇷', 'Spain': '🇪🇸', 'Switzerland': '🇨🇭',
  'Tunisia': '🇹🇳', 'Turkey': '🇹🇷', 'Ukraine': '🇺🇦', 'United States': '🇺🇸',
  'Uruguay': '🇺🇾', 'Venezuela': '🇻🇪', 'Wales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿', 'Algeria': '🇩🇿',
  'Ivory Coast': '🇨🇮', 'Hungary': '🇭🇺', 'Greece': '🇬🇷', 'Austria': '🇦🇹',
  'Bolivia': '🇧🇴', 'Jamaica': '🇯🇲', 'Guatemala': '🇬🇹',
}

export function getFlag(name = '') {
  return FLAGS[name] || FLAGS[name.replace(/\s+/g, ' ')] || '🏳️'
}

export function daysUntilWC() {
  const diff = WC_START - new Date()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function parseMatch(e) {
  const comp = e.competitions?.[0]
  const home = comp?.competitors?.find(c => c.homeAway === 'home')
  const away = comp?.competitors?.find(c => c.homeAway === 'away')
  return {
    id: e.id,
    date: e.date,
    statusName: e.status?.type?.name || 'pre',
    statusDetail: e.status?.type?.shortDetail || '',
    displayClock: e.status?.displayClock || '',
    completed: e.status?.type?.completed || false,
    home: {
      name: home?.team?.displayName || '',
      abbr: home?.team?.abbreviation || '',
      score: home?.score || '0',
      flag: getFlag(home?.team?.displayName || ''),
      logo: home?.team?.logo || '',
    },
    away: {
      name: away?.team?.displayName || '',
      abbr: away?.team?.abbreviation || '',
      score: away?.score || '0',
      flag: getFlag(away?.team?.displayName || ''),
      logo: away?.team?.logo || '',
    },
    venue: comp?.venue?.fullName || '',
    note: comp?.notes?.[0]?.headline || '',
    group: comp?.series?.summary || '',
  }
}

function cache(key, data, ttlMs) {
  sessionStorage.setItem(key, JSON.stringify(data))
  sessionStorage.setItem(key + '_at', String(Date.now() + ttlMs))
}

function getCache(key) {
  try {
    const exp = Number(sessionStorage.getItem(key + '_at'))
    if (Date.now() < exp) return JSON.parse(sessionStorage.getItem(key))
  } catch {}
  return null
}

export function useWorldCup() {
  const [matches, setMatches] = useState([])
  const [news, setNews] = useState([])
  const [standings, setStandings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const now = new Date()
  const preWC = now < WC_START
  const days = daysUntilWC()

  useEffect(() => {
    let alive = true
    async function load() {
      await Promise.allSettled([fetchMatches(alive), fetchNews(alive)])
      if (alive) setLoading(false)
    }
    load()
    return () => { alive = false }
  }, [])

  async function fetchMatches(alive) {
    const cached = getCache('addi_wc_matches')
    if (cached) { if (alive) setMatches(cached); return }
    try {
      const r = await fetch(
        'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard'
      )
      const d = await r.json()
      const events = (d.events || []).map(parseMatch)
      cache('addi_wc_matches', events, 2 * 60 * 1000)
      if (alive) setMatches(events)
    } catch { if (alive) setError(true) }
  }

  async function fetchNews(alive) {
    const cached = getCache('addi_wc_news')
    if (cached) { if (alive) setNews(cached); return }
    try {
      const r = await fetch(
        'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/news?limit=8'
      )
      const d = await r.json()
      const articles = (d.articles || []).slice(0, 8).map(a => ({
        id: String(a.id || Math.random()),
        headline: a.headline || '',
        description: a.description || '',
        published: a.published || null,
        image: a.images?.[0]?.url || null,
        link: a.links?.web?.href || null,
      }))
      cache('addi_wc_news', articles, 10 * 60 * 1000)
      if (alive) setNews(articles)
    } catch {}
  }

  const liveMatches = matches.filter(m => m.statusName === 'in')
  const todayMatches = matches.filter(m => {
    const d = new Date(m.date)
    const today = new Date()
    return d.toDateString() === today.toDateString()
  })
  const completedMatches = matches.filter(m => m.completed)
  const upcomingMatches = matches.filter(m => !m.completed && m.statusName !== 'in')

  return {
    matches, news, standings, loading, error,
    preWC, days,
    liveMatches, todayMatches, completedMatches, upcomingMatches,
  }
}
