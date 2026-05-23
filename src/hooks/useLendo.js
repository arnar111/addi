import { useLocalStorage } from './useLocalStorage'

export function useLendo() {
  const [rentals, setRentals] = useLocalStorage('addi_lendo', [])
  const [goal, setGoal] = useLocalStorage('addi_lendo_goal', 200000)

  const addRental = (amount, type, note = '', date = null) => {
    setRentals(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      type,
      note,
      date: date || new Date().toISOString(),
    }, ...prev])
  }

  const removeRental = (id) => setRentals(prev => prev.filter(r => r.id !== id))

  const currentMonth = () => {
    const now = new Date()
    return rentals.filter(r => {
      const d = new Date(r.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const allTimeTotal = () => rentals.reduce((s, r) => s + r.amount, 0)
  const monthlyTotal = () => currentMonth().reduce((s, r) => s + r.amount, 0)
  const remaining = () => goal - monthlyTotal()
  const goalPct = () => Math.min(100, Math.round((monthlyTotal() / goal) * 100))

  const byMonth = () => {
    const map = {}
    rentals.forEach(r => {
      const d = new Date(r.date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      map[key] = (map[key] || 0) + r.amount
    })
    return map
  }

  return {
    rentals, addRental, removeRental,
    goal, setGoal,
    monthlyTotal, remaining, goalPct, allTimeTotal,
    currentMonth, byMonth,
  }
}
