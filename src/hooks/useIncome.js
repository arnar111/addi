import { useLocalStorage } from './useLocalStorage'

export function useIncome() {
  const [income, setIncome] = useLocalStorage('addi_income', [])
  const [monthlyGoal, setMonthlyGoal] = useLocalStorage('addi_income_goal', 200000)

  const add = (amount, source = 'lendo', note = '', date = null) => {
    setIncome(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      source,
      note,
      date: date || new Date().toISOString(),
    }, ...prev])
  }

  const remove = (id) => setIncome(prev => prev.filter(i => i.id !== id))

  const currentMonth = () => {
    const now = new Date()
    return income.filter(i => {
      const d = new Date(i.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyTotal = () => currentMonth().reduce((s, i) => s + i.amount, 0)
  const recent = income.slice(0, 20)

  return { income, add, remove, currentMonth, monthlyTotal, monthlyGoal, setMonthlyGoal, recent }
}
