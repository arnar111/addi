import { useLocalStorage } from './useLocalStorage'

export const LENDO_CATS = [
  { id: 'set', label: 'Veislusett', icon: '🎪', color: '#f97316' },
  { id: 'tables', label: 'Borð', icon: '🪵', color: '#8b5cf6' },
  { id: 'chairs', label: 'Stólar', icon: '🪑', color: '#3b82f6' },
  { id: 'other', label: 'Annað', icon: '📦', color: '#64748b' },
]

export function useLendo() {
  const [rentals, setRentals] = useLocalStorage('addi_lendo', [])
  const [target, setTarget] = useLocalStorage('addi_lendo_target', 200000)

  const addRental = (amount, category, note = '', date = null) => {
    setRentals(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      category,
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

  const monthlyTotal = () => currentMonth().reduce((s, r) => s + r.amount, 0)
  const allTimeTotal = () => rentals.reduce((s, r) => s + r.amount, 0)

  const monthlyByCategory = () => {
    const m = currentMonth()
    const result = {}
    LENDO_CATS.forEach(c => { result[c.id] = 0 })
    m.forEach(r => { result[r.category] = (result[r.category] || 0) + r.amount })
    return result
  }

  const last6Months = () => {
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const total = rentals
        .filter(r => {
          const rd = new Date(r.date)
          return rd.getMonth() === d.getMonth() && rd.getFullYear() === d.getFullYear()
        })
        .reduce((s, r) => s + r.amount, 0)
      months.push({
        label: d.toLocaleDateString('is-IS', { month: 'short' }),
        total,
      })
    }
    return months
  }

  return {
    rentals,
    addRental,
    removeRental,
    target,
    setTarget,
    currentMonth,
    monthlyTotal,
    allTimeTotal,
    monthlyByCategory,
    last6Months,
    categories: LENDO_CATS,
  }
}
