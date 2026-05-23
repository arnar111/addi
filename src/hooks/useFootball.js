import { useState, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

const ESPN_SCOREBOARD = 'https://site.api.espn.com/apis/v2/sports/soccer/fifa.world/scoreboard'
const ESPN_STANDINGS = 'https://site.api.espn.com/apis/v2/sports/soccer/fifa.world/standings'

export const ENGLAND_SQUAD = [
  { name: 'Jordan Pickford', pos: 'GKR', club: 'Everton' },
  { name: 'Dean Henderson', pos: 'GKR', club: 'Crystal Palace' },
  { name: 'James Trafford', pos: 'GKR', club: 'Burnley' },
  { name: 'Kyle Walker', pos: 'VB', club: 'Man City' },
  { name: 'Trent Alexander-Arnold', pos: 'VB', club: 'Real Madrid' },
  { name: 'Reece James', pos: 'VB', club: 'Chelsea' },
  { name: 'Lewis Dunk', pos: 'VB', club: 'Brighton' },
  { name: 'Marc Guéhi', pos: 'VB', club: 'Crystal Palace' },
  { name: 'Levi Colwill', pos: 'VB', club: 'Chelsea' },
  { name: 'Luke Shaw', pos: 'VB', club: 'Man United' },
  { name: 'Ezri Konsa', pos: 'VB', club: 'Aston Villa' },
  { name: 'Declan Rice', pos: 'MF', club: 'Arsenal' },
  { name: 'Jude Bellingham', pos: 'MF', club: 'Real Madrid' },
  { name: 'Kobbie Mainoo', pos: 'MF', club: 'Man United' },
  { name: 'Conor Gallagher', pos: 'MF', club: 'Atletico Madrid' },
  { name: 'Adam Wharton', pos: 'MF', club: 'Crystal Palace' },
  { name: 'Curtis Jones', pos: 'MF', club: 'Liverpool' },
  { name: 'Harry Kane', pos: 'FW', club: 'Bayern Munich' },
  { name: 'Bukayo Saka', pos: 'FW', club: 'Arsenal' },
  { name: 'Marcus Rashford', pos: 'FW', club: 'Aston Villa' },
  { name: 'Ollie Watkins', pos: 'FW', club: 'Aston Villa' },
  { name: 'Anthony Gordon', pos: 'FW', club: 'Newcastle' },
  { name: 'Eberechi Eze', pos: 'FW', club: 'Crystal Palace' },
  { name: 'Jarrod Bowen', pos: 'FW', club: 'West Ham' },
  { name: 'Noni Madueke', pos: 'FW', club: 'Chelsea' },
  { name: 'Morgan Gibbs-White', pos: 'FW', club: 'Nottm Forest' },
]

export function useFootball() {
  const [matches, setMatches] = useState([])
  const [standings, setStandings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchMatches = async () => {
    try {
      const res = await fetch(ESPN_SCOREBOARD)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setMatches(json.events || [])
      setLastUpdated(new Date())
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchStandings = async () => {
    try {
      const res = await fetch(ESPN_STANDINGS)
      if (!res.ok) return
      const json = await res.json()
      setStandings(json.standings || [])
    } catch {}
  }

  useEffect(() => {
    fetchMatches()
    fetchStandings()
    const t = setInterval(fetchMatches, 60000)
    return () => clearInterval(t)
  }, [])

  const liveMatches = matches.filter(m => m.status?.type?.state === 'in')
  const todayMatches = matches.filter(m => {
    const d = new Date(m.date)
    return d.toDateString() === new Date().toDateString()
  })
  const upcomingMatches = matches.filter(m => m.status?.type?.state === 'pre')
  const recentMatches = matches.filter(m => m.status?.type?.state === 'post')

  return {
    matches, standings, loading, error, lastUpdated,
    liveMatches, todayMatches, upcomingMatches, recentMatches,
    refresh: fetchMatches,
  }
}
