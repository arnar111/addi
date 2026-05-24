import { useState, useEffect } from 'react'

const SPURS_ID = '133604'
const BASE = 'https://www.thesportsdb.com/api/v1/json/3'

function formatMatch(e) {
  if (!e) return null
  const isHome = e.strHomeTeam?.includes('Tottenham')
  const opponent = isHome ? e.strAwayTeam : e.strHomeTeam
  const score = (e.intHomeScore != null && e.intAwayScore != null)
    ? `${e.intHomeScore}–${e.intAwayScore}`
    : null
  const spursGoals = isHome ? Number(e.intHomeScore) : Number(e.intAwayScore)
  const oppGoals = isHome ? Number(e.intAwayScore) : Number(e.intHomeScore)
  const result = score ? (spursGoals > oppGoals ? 'W' : spursGoals < oppGoals ? 'L' : 'D') : null
  return {
    id: e.idEvent,
    label: e.strEvent,
    league: e.strLeague,
    date: e.dateEvent,
    time: e.strTime?.slice(0, 5),
    opponent,
    isHome,
    score,
    spursGoals,
    oppGoals,
    result,
    thumb: e.strThumb,
    venue: e.strVenue,
    round: e.intRound,
  }
}

export function useFootball() {
  const [lastMatches, setLastMatches] = useState([])
  const [nextMatch, setNextMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [lastRes, nextRes] = await Promise.all([
          fetch(`${BASE}/eventslast.php?id=${SPURS_ID}`),
          fetch(`${BASE}/eventsnext.php?id=${SPURS_ID}`),
        ])
        const [lastData, nextData] = await Promise.all([lastRes.json(), nextRes.json()])
        if (cancelled) return
        setLastMatches((lastData.results || []).map(formatMatch).filter(Boolean))
        setNextMatch(formatMatch((nextData.events || [])[0]))
      } catch (e) {
        if (!cancelled) setError(e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return { lastMatches, nextMatch, loading, error }
}

export function usePLTable() {
  const [table, setTable] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`${BASE}/lookuptable.php?l=4328&s=2024-2025`)
        const data = await res.json()
        if (cancelled) return
        setTable(data.table || [])
      } catch {
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return { table, loading }
}
