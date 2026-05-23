import { useState, useEffect } from 'react'

export const LEAGUES = [
  { id: 'eng.1', name: 'Premier League', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', short: 'PL' },
  { id: 'uefa.champions', name: 'Meistaradeildin', emoji: '⭐', short: 'UCL' },
  { id: 'usa.1', name: 'MLS', emoji: '🇺🇸', short: 'MLS' },
  { id: 'concacaf.nations.league', name: 'USMNT', emoji: '🦅', short: 'USA' },
]

function ttl(key, minutes) {
  const cached = sessionStorage.getItem(key)
  const at = sessionStorage.getItem(`${key}_at`)
  if (cached && at && Date.now() - Number(at) < minutes * 60 * 1000) return JSON.parse(cached)
  return null
}

function cache(key, data) {
  sessionStorage.setItem(key, JSON.stringify(data))
  sessionStorage.setItem(`${key}_at`, String(Date.now()))
}

export function useSports() {
  const [scores, setScores] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [newsLoading, setNewsLoading] = useState(true)
  const [activeLeague, setActiveLeague] = useState('eng.1')

  useEffect(() => {
    setLoading(true)
    const key = `sports_scores_${activeLeague}`
    const hit = ttl(key, 5)
    if (hit) { setScores(hit); setLoading(false); return }

    fetch(`https://site.api.espn.com/apis/v2/sports/soccer/${activeLeague}/scoreboard`)
      .then(r => r.json())
      .then(d => {
        const events = (d.events || []).slice(0, 20).map(e => {
          const comp = e.competitions?.[0]
          const home = comp?.competitors?.find(c => c.homeAway === 'home')
          const away = comp?.competitors?.find(c => c.homeAway === 'away')
          return {
            id: e.id,
            name: e.name,
            date: e.date,
            status: e.status?.type?.shortDetail || '',
            statusType: e.status?.type?.name || '',
            homeTeam: home ? {
              name: home.team?.shortDisplayName || home.team?.displayName,
              abbr: home.team?.abbreviation,
              logo: home.team?.logo,
              score: home.score,
              winner: home.winner,
            } : null,
            awayTeam: away ? {
              name: away.team?.shortDisplayName || away.team?.displayName,
              abbr: away.team?.abbreviation,
              logo: away.team?.logo,
              score: away.score,
              winner: away.winner,
            } : null,
          }
        })
        cache(key, events)
        setScores(events)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [activeLeague])

  useEffect(() => {
    const hit = ttl('sports_news', 20)
    if (hit) { setNews(hit); setNewsLoading(false); return }

    fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/news?limit=12')
      .then(r => r.json())
      .then(d => {
        const articles = (d.articles || []).map(a => ({
          id: a.dataSourceIdentifier || a.id || a.headline,
          headline: a.headline,
          description: a.description,
          published: a.published,
          image: a.images?.[0]?.url,
          url: a.links?.web?.href || a.links?.mobile?.href,
          category: a.categories?.find(c => c.type === 'team')?.description || 'Football',
        }))
        cache('sports_news', articles)
        setNews(articles)
        setNewsLoading(false)
      })
      .catch(() => setNewsLoading(false))
  }, [])

  return { scores, news, loading, newsLoading, activeLeague, setActiveLeague }
}
