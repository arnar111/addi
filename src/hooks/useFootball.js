import { useState, useEffect } from 'react'

const TSDB = 'https://www.thesportsdb.com/api/v1/json/3'
const MUFC_ID = '133604'
const PL_LEAGUE_ID = '4328'
const SEASON = '2025-2026'
const CACHE_TTL = 20 * 60 * 1000

export function useFootball() {
  const [table, setTable] = useState(null)
  const [recentMatches, setRecentMatches] = useState([])
  const [nextMatch, setNextMatch] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = sessionStorage.getItem('addi_football')
    const ts = sessionStorage.getItem('addi_football_ts')
    if (cached && ts && Date.now() - Number(ts) < CACHE_TTL) {
      const d = JSON.parse(cached)
      setTable(d.table)
      setRecentMatches(d.recentMatches)
      setNextMatch(d.nextMatch)
      setLoading(false)
      return
    }

    const load = async () => {
      try {
        const [tableRes, recentRes, nextRes] = await Promise.all([
          fetch(`${TSDB}/lookuptable.php?l=${PL_LEAGUE_ID}&s=${SEASON}`),
          fetch(`${TSDB}/eventslast.php?id=${MUFC_ID}`),
          fetch(`${TSDB}/eventsnext.php?id=${MUFC_ID}`),
        ])
        const [tableData, recentData, nextData] = await Promise.all([
          tableRes.json(),
          recentRes.json(),
          nextRes.json(),
        ])

        const payload = {
          table: tableData.table || [],
          recentMatches: (recentData.results || []).slice(0, 6),
          nextMatch: nextData.events?.[0] || null,
        }

        sessionStorage.setItem('addi_football', JSON.stringify(payload))
        sessionStorage.setItem('addi_football_ts', String(Date.now()))

        setTable(payload.table)
        setRecentMatches(payload.recentMatches)
        setNextMatch(payload.nextMatch)
      } catch {
        // graceful fail — sport page shows empty state
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const mufcRow = table?.find(r =>
    r.strTeam?.toLowerCase().includes('manchester united')
  )

  return { table, recentMatches, nextMatch, mufcRow, loading }
}
