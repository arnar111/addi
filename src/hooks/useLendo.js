import { useLocalStorage } from './useLocalStorage'

export const LENDO_ITEMS = [
  { id: 'set', label: 'Veislusett (borð+stólar)', icon: '🪑', defaultPrice: 7000 },
  { id: 'table', label: 'Borð', icon: '🪵', defaultPrice: 4000 },
  { id: 'chairs', label: 'Stólar (10 stk)', icon: '💺', defaultPrice: 3000 },
  { id: 'other', label: 'Annað', icon: '📦', defaultPrice: 0 },
]

export function useLendo() {
  const [rentals, setRentals] = useLocalStorage('addi_lendo', [])
  const [goal, setGoal] = useLocalStorage('addi_lendo_goal', 200000)

  const addRental = (amount, itemId, note = '', days = 1) => {
    setRentals(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      itemId,
      note,
      days: Number(days),
      date: new Date().toISOString(),
    }, ...prev])
  }

  const removeRental = (id) => setRentals(prev => prev.filter(r => r.id !== id))

  const forMonth = (date = new Date()) =>
    rentals.filter(r => {
      const d = new Date(r.date)
      return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear()
    })

  const monthlyTotal = () => forMonth().reduce((s, r) => s + r.amount, 0)
  const allTimeTotal = () => rentals.reduce((s, r) => s + r.amount, 0)
  const totalRentals = () => rentals.length
  const monthlyRentals = () => forMonth().length

  return {
    rentals,
    goal, setGoal,
    addRental, removeRental,
    forMonth, monthlyTotal, allTimeTotal,
    totalRentals, monthlyRentals,
    recent: rentals.slice(0, 15),
  }
}
