import { useState, useEffect } from 'react'

const LEAGUES = {
  pl: { id: 'eng.1', name: 'Premier League', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  ucl: { id: 'UEFA.CHAMPIONS', name: 'Champions League', icon: '⭐' },
  usmnt: { id: 'fifa.worldq.concacaf', name: 'CONCACAF', icon: '🇺🇸' },
}

export function useSports(leagueId = 'eng.1') {
  const [news, setNews] = useState([])
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cacheKey = `sports_${leagueId}`
    const cached = sessionStorage.getItem(cacheKey)
    const cachedAt = sessionStorage.getItem(`${cacheKey}_at`)
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 15 * 60 * 1000) {
      const d = JSON.parse(cached)
      setNews(d.news || [])
      setScores(d.scores || [])
      setLoading(false)
      return
    }

    Promise.all([
      fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueId}/news?limit=12`)
        .then(r => r.json()).catch(() => null),
      fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${leagueId}/scoreboard`)
        .then(r => r.json()).catch(() => null),
    ]).then(([newsData, scoresData]) => {
      const articles = (newsData?.articles || []).slice(0, 12).map(a => ({
        id: a.dataSourceIdentifier || String(Math.random()),
        headline: a.headline,
        description: a.description,
        image: a.images?.[0]?.url,
        published: a.published,
        link: a.links?.web?.href,
      }))

      const events = (scoresData?.events || []).slice(0, 10).map(e => {
        const comp = e.competitions?.[0]
        const home = comp?.competitors?.find(c => c.homeAway === 'home')
        const away = comp?.competitors?.find(c => c.homeAway === 'away')
        return {
          id: e.id,
          date: e.date,
          homeTeam: home?.team?.shortDisplayName || '',
          homeLogo: home?.team?.logo,
          homeScore: home?.score,
          awayTeam: away?.team?.shortDisplayName || '',
          awayLogo: away?.team?.logo,
          awayScore: away?.score,
          status: comp?.status?.type?.name,
          statusText: comp?.status?.type?.shortDetail,
        }
      })

      setNews(articles)
      setScores(events)
      sessionStorage.setItem(cacheKey, JSON.stringify({ news: articles, scores: events }))
      sessionStorage.setItem(`${cacheKey}_at`, String(Date.now()))
      setLoading(false)
    }).catch(e => {
      setError(e.message)
      setLoading(false)
    })
  }, [leagueId])

  return { news, scores, loading, error }
}
