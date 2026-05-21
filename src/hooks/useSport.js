import { useState, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

const PL_ID = '4328'
const SEASON = '2025-2026'
const CACHE_MS = 30 * 60 * 1000

export function useSport() {
  const [plTable, setPlTable] = useLocalStorage('addi_pl_table', null)
  const [plTableAt, setPlTableAt] = useLocalStorage('addi_pl_table_at', 0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isStale = Date.now() - plTableAt > CACHE_MS

  const fetchTable = async (force = false) => {
    if (!force && plTable && !isStale) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `https://www.thesportsdb.com/api/v1/json/1/lookuptable.php?l=${PL_ID}&s=${SEASON}`
      )
      if (!res.ok) throw new Error()
      const data = await res.json()
      if (data.table?.length) {
        setPlTable(data.table)
        setPlTableAt(Date.now())
      } else {
        throw new Error('no data')
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTable() }, [])

  return {
    plTable,
    loading,
    error,
    isStale,
    refresh: () => fetchTable(true),
    lastUpdated: plTableAt ? new Date(plTableAt) : null,
  }
}
