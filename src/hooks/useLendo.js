import { useLocalStorage } from './useLocalStorage'

const MONTHLY_GOAL = 200000

export function useLendo() {
  const [entries, setEntries] = useLocalStorage('addi_lendo', [])
  const [goal, setGoal] = useLocalStorage('addi_lendo_goal', MONTHLY_GOAL)

  const add = (amount, note = '', date = null) => {
    setEntries(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      note,
      date: date || new Date().toISOString(),
    }, ...prev])
  }

  const remove = (id) => setEntries(prev => prev.filter(e => e.id !== id))

  const currentMonth = () => {
    const now = new Date()
    return entries.filter(e => {
      const d = new Date(e.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyTotal = () => currentMonth().reduce((s, e) => s + e.amount, 0)
  const monthlyCount = () => currentMonth().length

  // Days remaining in month
  const daysInMonth = () => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  }
  const dayOfMonth = () => new Date().getDate()
  const daysLeft = () => daysInMonth() - dayOfMonth()

  // Projection based on daily avg
  const projection = () => {
    const today = dayOfMonth()
    const earned = monthlyTotal()
    if (today === 0) return 0
    const dailyAvg = earned / today
    return Math.round(earned + dailyAvg * daysLeft())
  }

  return {
    entries,
    add,
    remove,
    goal,
    setGoal,
    currentMonth: currentMonth(),
    monthlyTotal: monthlyTotal(),
    monthlyCount: monthlyCount(),
    daysLeft: daysLeft(),
    projection: projection(),
    recentEntries: entries.slice(0, 15),
  }
}
