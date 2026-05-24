import { useLocalStorage } from './useLocalStorage'

export const LENDO_ITEMS = [
  { id: 'party_set', name: 'Veislusett (borð + 10 stólar)', icon: '🎉', defaultRate: 7000 },
  { id: 'table', name: 'Borð (6-8 manns)', icon: '🪑', defaultRate: 3500 },
  { id: 'chairs_10', name: 'Stólar (10 stk)', icon: '🪑', defaultRate: 2000 },
  { id: 'tent', name: 'Tjald/Hlíf', icon: '⛺', defaultRate: 5000 },
  { id: 'other', name: 'Annað', icon: '📦', defaultRate: 5000 },
]

export function useLendo() {
  const [bookings, setBookings] = useLocalStorage('addi_lendo_bookings', [])
  const [monthlyGoal, setMonthlyGoal] = useLocalStorage('addi_lendo_goal', 200000)

  const addBooking = ({ item, amount, customer, startDate, endDate, notes = '' }) => {
    setBookings(prev => [{
      id: Date.now().toString(),
      item,
      amount: Number(amount),
      customer,
      startDate,
      endDate: endDate || startDate,
      notes,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }, ...prev])
  }

  const updateStatus = (id, status) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
  }

  const removeBooking = (id) => setBookings(prev => prev.filter(b => b.id !== id))

  const getMonthBookings = (date = new Date()) => {
    return bookings.filter(b => {
      const d = new Date(b.startDate)
      return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear()
    })
  }

  const monthlyIncome = () =>
    getMonthBookings()
      .filter(b => b.status !== 'cancelled')
      .reduce((s, b) => s + b.amount, 0)

  const goalProgress = () =>
    Math.min(100, Math.round((monthlyIncome() / monthlyGoal) * 100))

  const upcomingBookings = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return bookings
      .filter(b => new Date(b.startDate) >= today && b.status !== 'cancelled')
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  }

  return {
    bookings, addBooking, updateStatus, removeBooking,
    getMonthBookings, monthlyIncome, goalProgress,
    monthlyGoal, setMonthlyGoal,
    upcomingBookings,
  }
}
