import { useLocalStorage } from './useLocalStorage'

export function useRental() {
  const [income, setIncome] = useLocalStorage('addi_rental_income', [])
  const [goal, setGoal] = useLocalStorage('addi_rental_goal', 200000)

  const thisMonthTotal = () => {
    const now = new Date()
    return income
      .filter(i => {
        const d = new Date(i.date)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      })
      .reduce((sum, i) => sum + i.amount, 0)
  }

  const allTimeTotal = income.reduce((sum, i) => sum + i.amount, 0)

  const addIncome = (amount, note = '') =>
    setIncome(prev => [
      { id: Date.now().toString(), amount, note, date: new Date().toISOString() },
      ...prev,
    ])

  const removeIncome = (id) => setIncome(prev => prev.filter(i => i.id !== id))

  const totalThisMonth = thisMonthTotal()
  const pct = goal > 0 ? Math.min(100, Math.round((totalThisMonth / goal) * 100)) : 0

  return { income, addIncome, removeIncome, goal, setGoal, totalThisMonth, allTimeTotal, pct }
}
