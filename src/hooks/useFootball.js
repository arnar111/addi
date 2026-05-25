import { useState, useEffect } from 'react'

const TEAMS = [
  { id: '33577', name: 'Tottenham Hotspur', shortName: 'Spurs' },
  { id: '33605', name: 'West Ham United', shortName: 'West Ham' },
]

export function useFootball() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = sessionStorage.getItem('football_v2')
    const cachedAt = sessionStorage.getItem('football_v2_at')
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 30 * 60 * 1000) {
      setResults(JSON.parse(cached))
      setLoading(false)
      return
    }

    Promise.allSettled(
      TEAMS.map(team =>
        fetch(`https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${team.id}`)
          .then(r => r.json())
          .then(d => ({ team, events: d.results || [] }))
      )
    ).then(settled => {
      const data = settled
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value)
        .filter(r => r.events.length > 0)
      sessionStorage.setItem('football_v2', JSON.stringify(data))
      sessionStorage.setItem('football_v2_at', String(Date.now()))
      setResults(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return { results, loading }
}
