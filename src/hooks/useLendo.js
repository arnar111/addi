import { useLocalStorage } from './useLocalStorage'

export const LENDO_CATEGORIES = [
  { id: 'veislur', label: 'Veislur & Viðburðir', icon: '🎉', color: '#f97316' },
  { id: 'bunadur', label: 'Búnaður', icon: '🔧', color: '#3b82f6' },
  { id: 'listir', label: 'Listir & Sköpun', icon: '🎨', color: '#8b5cf6' },
  { id: 'utivera', label: 'Útivist', icon: '⛺', color: '#22c55e' },
  { id: 'annad', label: 'Annað', icon: '📦', color: '#64748b' },
]

const DEFAULT_GOAL = 200000

export function useLendo() {
  const [rentals, setRentals] = useLocalStorage('addi_lendo_rentals', [])
  const [goal, setGoal] = useLocalStorage('addi_lendo_goal', DEFAULT_GOAL)

  const addRental = ({ amount, category = 'veislur', item = '', renter = '', date = null }) => {
    setRentals(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      category,
      item,
      renter,
      date: date || new Date().toISOString(),
    }, ...prev])
  }

  const removeRental = (id) => setRentals(prev => prev.filter(r => r.id !== id))

  const monthRentals = (month = new Date()) => {
    return rentals.filter(r => {
      const d = new Date(r.date)
      return d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear()
    })
  }

  const monthTotal = (month) => monthRentals(month).reduce((s, r) => s + r.amount, 0)

  const allTimeTotal = () => rentals.reduce((s, r) => s + r.amount, 0)

  const byCategory = (month) => {
    const mr = monthRentals(month)
    const result = {}
    mr.forEach(r => {
      result[r.category] = (result[r.category] || 0) + r.amount
    })
    return result
  }

  const streak = () => {
    const now = new Date()
    let count = 0
    for (let i = 0; i < 12; i++) {
      const m = new Date(now.getFullYear(), now.getMonth() - i, 1)
      if (monthTotal(m) > 0) count++
      else break
    }
    return count
  }

  return {
    rentals,
    goal, setGoal,
    addRental, removeRental,
    monthRentals, monthTotal, allTimeTotal,
    byCategory, streak,
  }
}
