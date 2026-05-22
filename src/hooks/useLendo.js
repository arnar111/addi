import { useLocalStorage } from './useLocalStorage'

export const LENDO_ITEMS = [
  'Veislusett (borð + 10 stólar)',
  'Borð (1 stk)',
  'Stólar (10 stk)',
  'Tjald / Sólhlíf',
  'Annað búnaður',
]

export function useLendo() {
  const [rentals, setRentals] = useLocalStorage('addi_lendo_rentals', [])
  const [goal, setGoal] = useLocalStorage('addi_lendo_goal', 200000)

  const addRental = (item, days, amount, note = '') => {
    setRentals(prev => [{
      id: Date.now().toString(),
      item,
      days: Number(days),
      amount: Number(amount),
      note,
      date: new Date().toISOString(),
    }, ...prev])
  }

  const removeRental = (id) => {
    setRentals(prev => prev.filter(r => r.id !== id))
  }

  const currentMonth = () => {
    const now = new Date()
    return rentals.filter(r => {
      const d = new Date(r.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyEarnings = () => currentMonth().reduce((s, r) => s + r.amount, 0)

  const avgPerRental = () => {
    const m = currentMonth()
    if (!m.length) return 0
    return Math.round(m.reduce((s, r) => s + r.amount, 0) / m.length)
  }

  const totalEarnings = () => rentals.reduce((s, r) => s + r.amount, 0)

  const streak = () => {
    if (!rentals.length) return 0
    const days = new Set(rentals.map(r => new Date(r.date).toISOString().split('T')[0]))
    let count = 0
    const d = new Date()
    while (days.has(d.toISOString().split('T')[0])) {
      count++
      d.setDate(d.getDate() - 1)
    }
    return count
  }

  const byItem = () => {
    const m = currentMonth()
    const result = {}
    m.forEach(r => {
      result[r.item] = (result[r.item] || 0) + r.amount
    })
    return result
  }

  return {
    rentals,
    goal, setGoal,
    addRental, removeRental,
    currentMonth, monthlyEarnings, avgPerRental, totalEarnings,
    streak, byItem,
    recentRentals: rentals.slice(0, 20),
  }
}
