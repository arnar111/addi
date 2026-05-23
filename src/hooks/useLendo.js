import { useLocalStorage } from './useLocalStorage'

export const LENDO_ITEMS = [
  { id: 'borðsett', label: 'Borðsett', icon: '🪑', price: 7000 },
  { id: 'borð', label: 'Borð', icon: '🪵', price: 4000 },
  { id: 'stólar', label: 'Stólar (x10)', icon: '💺', price: 3000 },
  { id: 'tjald', label: 'Tjald', icon: '⛺', price: 5000 },
  { id: 'dúkur', label: 'Borðdúkar', icon: '🎀', price: 2000 },
  { id: 'önnur', label: 'Annað', icon: '📦', price: 0 },
]

export function useLendo() {
  const [bookings, setBookings] = useLocalStorage('addi_lendo_bookings', [])
  const [goal, setGoal] = useLocalStorage('addi_lendo_goal', 200000)

  const addBooking = ({ amount, item, note, date, status = 'paid', days = 1 }) => {
    setBookings(prev => [{
      id: Date.now().toString(),
      amount: Number(amount),
      item: item || 'borðsett',
      note: note || '',
      date: date || new Date().toISOString(),
      status,
      days: Number(days) || 1,
    }, ...prev])
  }

  const removeBooking = (id) => setBookings(prev => prev.filter(b => b.id !== id))

  const updateStatus = (id, status) =>
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))

  const currentMonthBookings = () => {
    const now = new Date()
    return bookings.filter(b => {
      const d = new Date(b.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyPaid = () =>
    currentMonthBookings().filter(b => b.status === 'paid').reduce((s, b) => s + b.amount, 0)

  const monthlyPending = () =>
    currentMonthBookings().filter(b => b.status === 'pending').reduce((s, b) => s + b.amount, 0)

  const monthlyCount = () => currentMonthBookings().length

  const goalPct = () => Math.min(100, Math.round((monthlyPaid() / goal) * 100))

  const allTimePaid = () =>
    bookings.filter(b => b.status === 'paid').reduce((s, b) => s + b.amount, 0)

  return {
    bookings, addBooking, removeBooking, updateStatus,
    goal, setGoal,
    currentMonthBookings, monthlyPaid, monthlyPending, monthlyCount, goalPct, allTimePaid,
    LENDO_ITEMS,
  }
}
