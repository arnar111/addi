import { useLocalStorage } from './useLocalStorage'

export const LENDO_ITEMS = [
  { id: 'vset', label: 'Veislusett (borð + 10 stólar)', icon: '🪑', price: 7000 },
  { id: 'bord', label: 'Borð', icon: '🪵', price: 3000 },
  { id: 'stolar', label: 'Stólar (10 stk)', icon: '💺', price: 2500 },
  { id: 'cat', label: 'Cat', icon: '🐱', price: 7000 },
  { id: 'other', label: 'Annað', icon: '📦', price: 0 },
]

export function useLendo() {
  const [rentals, setRentals] = useLocalStorage('lendo_rentals', [])
  const [goal, setGoal] = useLocalStorage('lendo_goal', 200000)

  const add = ({ amount, item, note = '', date = null, days = 1 }) => {
    setRentals(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      item,
      note,
      days,
      date: date || new Date().toISOString(),
    }, ...prev])
  }

  const remove = (id) => setRentals(prev => prev.filter(r => r.id !== id))

  const rentalsForMonth = (year, month) => {
    const y = year ?? new Date().getFullYear()
    const m = month ?? new Date().getMonth()
    return rentals.filter(r => {
      const d = new Date(r.date)
      return d.getFullYear() === y && d.getMonth() === m
    })
  }

  const thisMonth = rentalsForMonth()
  const total = thisMonth.reduce((s, r) => s + r.amount, 0)
  const remaining = goal - total
  const pct = Math.min(100, Math.round((total / goal) * 100))
  const rentalCount = thisMonth.length
  const avgPerRental = rentalCount > 0 ? Math.round(total / rentalCount) : 0

  // Last 12 months summary for chart
  const last6 = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    const rentalsInMonth = rentalsForMonth(d.getFullYear(), d.getMonth())
    return {
      month: d.toLocaleDateString('is-IS', { month: 'short' }),
      total: rentalsInMonth.reduce((s, r) => s + r.amount, 0),
    }
  })

  return {
    rentals, add, remove,
    goal, setGoal,
    thisMonth, total, remaining, pct,
    rentalCount, avgPerRental, last6,
    rentalsForMonth,
  }
}
