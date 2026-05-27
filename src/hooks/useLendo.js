import { useLocalStorage } from './useLocalStorage'

const DEFAULT_STATE = {
  monthlyGoal: 200000,
  entries: [],
  listings: [
    { id: '1', name: 'Veislusett (borð + 10 stólar)', pricePerDay: 7000, active: true },
    { id: '2', name: 'Annað', pricePerDay: 5000, active: false },
  ]
}

export function useLendo() {
  const [state, setState] = useLocalStorage('addi_lendo', DEFAULT_STATE)

  const currentMonth = new Date().toISOString().slice(0, 7)

  const monthlyEntries = (state.entries || []).filter(e =>
    e.date?.startsWith(currentMonth)
  )

  const monthlyIncome = monthlyEntries.reduce((sum, e) => sum + (e.amount || 0), 0)

  function addEntry(entry) {
    setState(s => ({
      ...s,
      entries: [
        { id: Date.now(), date: new Date().toISOString(), ...entry },
        ...(s.entries || [])
      ]
    }))
  }

  function removeEntry(id) {
    setState(s => ({ ...s, entries: (s.entries || []).filter(e => e.id !== id) }))
  }

  function updateGoal(amount) {
    setState(s => ({ ...s, monthlyGoal: amount }))
  }

  function updateListings(listings) {
    setState(s => ({ ...s, listings }))
  }

  const goalProgress = state.monthlyGoal > 0
    ? Math.min(100, (monthlyIncome / state.monthlyGoal) * 100)
    : 0

  return {
    entries: state.entries || [],
    monthlyEntries,
    monthlyIncome,
    monthlyGoal: state.monthlyGoal,
    goalProgress,
    listings: state.listings || [],
    addEntry,
    removeEntry,
    updateGoal,
    updateListings,
  }
}
