import { useLocalStorage } from './useLocalStorage'

const MONTHLY_GOAL = 200000

export function useRental() {
  const [rentals, setRentals] = useLocalStorage('addi_rentals', [])

  const add = (amount, item, note = '') => {
    setRentals(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      item: item || 'Óþekkt',
      note,
      date: new Date().toISOString(),
    }, ...prev])
  }

  const remove = (id) => setRentals(prev => prev.filter(r => r.id !== id))

  const currentMonth = () => {
    const now = new Date()
    return rentals.filter(r => {
      const d = new Date(r.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyTotal = () => currentMonth().reduce((s, r) => s + r.amount, 0)
  const remaining = () => Math.max(0, MONTHLY_GOAL - monthlyTotal())
  const pct = () => Math.min(100, Math.round((monthlyTotal() / MONTHLY_GOAL) * 100))
  const recent = rentals.slice(0, 10)

  return { rentals, add, remove, currentMonth, monthlyTotal, remaining, pct, recent, MONTHLY_GOAL }
}
