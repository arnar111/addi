import { useLocalStorage } from './useLocalStorage'

export const LENDO_ITEMS = [
  { id: 'veislusett', label: 'Veislusett (borð + 10 stólar)', price: 7000 },
  { id: 'extra_chairs', label: 'Auka stólar', price: 1000 },
  { id: 'table', label: 'Borð eitt', price: 3000 },
  { id: 'other', label: 'Annað', price: 0 },
]

export function useLendo() {
  const [rentals, setRentals] = useLocalStorage('addi_lendo', [])
  const [monthlyGoal, setMonthlyGoal] = useLocalStorage('addi_lendo_goal', 200000)

  const addRental = ({ amount, item, note, date }) => {
    setRentals(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      item: item || 'other',
      note: note || '',
      date: date || new Date().toISOString(),
    }, ...prev])
  }

  const removeRental = (id) => setRentals(prev => prev.filter(r => r.id !== id))

  const currentMonthRentals = () => {
    const now = new Date()
    return rentals.filter(r => {
      const d = new Date(r.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyTotal = () => currentMonthRentals().reduce((s, r) => s + r.amount, 0)
  const rentalCount = () => currentMonthRentals().length
  const progressPct = () => Math.min(100, Math.round((monthlyTotal() / monthlyGoal) * 100))
  const remaining = () => monthlyGoal - monthlyTotal()

  const lastThirtyDays = () => {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000
    return rentals.filter(r => new Date(r.date).getTime() > cutoff)
  }

  const byMonth = () => {
    const map = {}
    rentals.forEach(r => {
      const d = new Date(r.date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      map[key] = (map[key] || 0) + r.amount
    })
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 6)
  }

  return {
    rentals,
    addRental,
    removeRental,
    currentMonthRentals,
    monthlyTotal,
    rentalCount,
    progressPct,
    remaining,
    monthlyGoal,
    setMonthlyGoal,
    lastThirtyDays,
    byMonth,
    recentRentals: rentals.slice(0, 30),
  }
}
