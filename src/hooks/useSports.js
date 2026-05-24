import { useState, useEffect } from 'react'

const BASE = 'https://www.thesportsdb.com/api/v1/json/3'
const SPURS_ID = '33604'
const EPL_ID = '4328'
const SEASON = '2025-2026'
const CACHE_KEY = 'addi_sports'
const CACHE_TTL = 30 * 60 * 1000

export function useSports() {
  const [nextMatch, setNextMatch] = useState(null)
  const [lastMatch, setLastMatch] = useState(null)
  const [table, setTable] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = () => {
    setLoading(true)
    setError(null)
    Promise.all([
      fetch(`${BASE}/eventsnext.php?id=${SPURS_ID}`).then(r => r.json()),
      fetch(`${BASE}/eventslast.php?id=${SPURS_ID}`).then(r => r.json()),
      fetch(`${BASE}/lookuptable.php?l=${EPL_ID}&s=${SEASON}`).then(r => r.json()),
    ])
      .then(([next, last, standings]) => {
        const d = {
          nextMatch: next.events?.[0] ?? null,
          lastMatch: last.results?.[0] ?? null,
          table: standings.table ?? null,
          ts: Date.now(),
        }
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(d))
        setNextMatch(d.nextMatch)
        setLastMatch(d.lastMatch)
        setTable(d.table)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY)
      if (raw) {
        const d = JSON.parse(raw)
        if (Date.now() - d.ts < CACHE_TTL) {
          setNextMatch(d.nextMatch)
          setLastMatch(d.lastMatch)
          setTable(d.table)
          setLoading(false)
          return
        }
      }
    } catch {}
    load()
  }, [])

  return { nextMatch, lastMatch, table, loading, error, refresh: load }
}
