import { useLocalStorage } from './useLocalStorage'

export function useLendo() {
  const [rentals, setRentals] = useLocalStorage('addi_lendo_rentals', [])
  const [monthlyGoal, setMonthlyGoal] = useLocalStorage('addi_lendo_goal', 200000)

  const addRental = (amount, item = '', note = '') => {
    setRentals(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      item: item.trim(),
      note: note.trim(),
      date: new Date().toISOString(),
    }, ...prev])
  }

  const removeRental = (id) => setRentals(prev => prev.filter(r => r.id !== id))

  const thisMonth = () => {
    const now = new Date()
    return rentals.filter(r => {
      const d = new Date(r.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyRevenue = () => thisMonth().reduce((s, r) => s + r.amount, 0)
  const rentalCount = () => thisMonth().length

  const revenueStreak = () => {
    let streak = 0
    const d = new Date()
    while (streak < 365) {
      const s = d.toISOString().split('T')[0]
      const hasRental = rentals.some(r => r.date.startsWith(s))
      if (hasRental) { streak++; d.setDate(d.getDate() - 1) }
      else break
    }
    return streak
  }

  return {
    rentals, addRental, removeRental,
    monthlyRevenue, monthlyGoal, setMonthlyGoal,
    thisMonth, rentalCount, revenueStreak,
  }
}
