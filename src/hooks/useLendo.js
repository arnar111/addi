import { useLocalStorage } from './useLocalStorage'

export const LENDO_ITEMS = [
  { id: 'veisluset', label: 'Veisluset (borð + 10 stólar)', price: 7000, icon: '🪑' },
  { id: 'bord', label: 'Borð eitt', price: 3000, icon: '🪵' },
  { id: 'stolar', label: 'Stólar (10 stk)', price: 4000, icon: '🪑' },
  { id: 'annad', label: 'Annað', price: 0, icon: '📦' },
]

export function useLendo() {
  const [rentals, setRentals] = useLocalStorage('addi_lendo', [])
  const [monthlyGoal, setMonthlyGoal] = useLocalStorage('addi_lendo_goal', 200000)

  const addRental = (itemId, days, note = '', date = null, customPrice = null) => {
    const item = LENDO_ITEMS.find(i => i.id === itemId)
    const income = customPrice !== null ? Number(customPrice) : (item?.price || 0) * Number(days)
    setRentals(prev => [{
      id: Date.now().toString(),
      itemId,
      days: Number(days),
      income,
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

  const monthlyIncome = () => currentMonth().reduce((s, r) => s + r.income, 0)
  const totalRentals = () => currentMonth().length
  const avgPerRental = () => {
    const cm = currentMonth()
    return cm.length ? Math.round(cm.reduce((s, r) => s + r.income, 0) / cm.length) : 0
  }
  const goalProgress = () => Math.min(100, Math.round((monthlyIncome() / monthlyGoal) * 100))

  return {
    rentals, addRental, removeRental,
    monthlyGoal, setMonthlyGoal,
    currentMonth, monthlyIncome, totalRentals, avgPerRental, goalProgress,
  }
}
