import { useLocalStorage } from './useLocalStorage'

const ITEMS = [
  { id: 'veislusett', label: 'Veislusett (borð + 10 stólar)', icon: '🪑' },
  { id: 'borð', label: 'Borð', icon: '🍽️' },
  { id: 'stólar', label: 'Stólar (10 stk)', icon: '🪑' },
  { id: 'annað', label: 'Annað', icon: '📦' },
]

export { ITEMS as LENDO_ITEMS }

export function useLendo() {
  const [bookings, setBookings] = useLocalStorage('addi_lendo_bookings', [])
  const [bizExpenses, setBizExpenses] = useLocalStorage('addi_lendo_expenses', [])
  const [monthlyGoal, setMonthlyGoal] = useLocalStorage('addi_lendo_goal', 200000)

  const addBooking = ({ amount, item = 'veislusett', customer = '', note = '', date = null, days = 1 }) => {
    setBookings(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      item, customer, note, days: Number(days),
      date: date || new Date().toISOString(),
    }, ...prev])
  }

  const removeBooking = (id) => setBookings(prev => prev.filter(b => b.id !== id))

  const addBizExpense = ({ amount, note = '', date = null }) => {
    setBizExpenses(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      note,
      date: date || new Date().toISOString(),
    }, ...prev])
  }

  const removeBizExpense = (id) => setBizExpenses(prev => prev.filter(e => e.id !== id))

  const getMonthBookings = (offsetMonths = 0) => {
    const now = new Date()
    const m = now.getMonth() - offsetMonths
    const y = now.getFullYear() + Math.floor(m / 12)
    const month = ((m % 12) + 12) % 12
    return bookings.filter(b => {
      const d = new Date(b.date)
      return d.getMonth() === month && d.getFullYear() === y
    })
  }

  const currentMonthBookings = () => getMonthBookings(0)
  const monthlyRevenue = (offset = 0) => getMonthBookings(offset).reduce((s, b) => s + b.amount, 0)

  const currentMonthExpenses = () => {
    const now = new Date()
    return bizExpenses.filter(e => {
      const d = new Date(e.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyBizExpenses = () => currentMonthExpenses().reduce((s, e) => s + e.amount, 0)
  const netProfit = () => monthlyRevenue() - monthlyBizExpenses()
  const goalProgress = () => Math.min(100, Math.round((monthlyRevenue() / monthlyGoal) * 100))

  const last6Months = () => Array.from({ length: 6 }, (_, i) => {
    const offset = 5 - i
    const d = new Date()
    d.setMonth(d.getMonth() - offset)
    return {
      month: d.toLocaleDateString('is-IS', { month: 'short' }),
      revenue: monthlyRevenue(offset),
    }
  })

  return {
    bookings, addBooking, removeBooking,
    bizExpenses, addBizExpense, removeBizExpense,
    monthlyGoal, setMonthlyGoal,
    currentMonthBookings, monthlyRevenue, monthlyBizExpenses, netProfit, goalProgress,
    last6Months,
  }
}
