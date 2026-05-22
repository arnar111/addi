import { useLocalStorage } from './useLocalStorage'

export const RENTAL_ITEMS = [
  { id: 'veislusett', label: 'Veislusett (borð + 10 stólar)', price: 7000, icon: '🎪' },
  { id: 'bord', label: 'Borð', price: 3000, icon: '🪑' },
  { id: 'stolar', label: 'Stólar (x10)', price: 3000, icon: '🪑' },
  { id: 'tjald', label: 'Tjald / Skjólveggur', price: 5000, icon: '⛺' },
  { id: 'annad', label: 'Annað', price: 0, icon: '📦' },
]

const MONTHLY_GOAL = 200000

export function useLendo() {
  const [bookings, setBookings] = useLocalStorage('addi_lendo_bookings', [])
  const [goal, setGoal] = useLocalStorage('addi_lendo_goal', MONTHLY_GOAL)

  const addBooking = ({ customer, itemId, startDate, endDate, pricePerDay, note, paid = false }) => {
    const days = Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000) + 1)
    setBookings(prev => [{
      id: Date.now().toString(),
      customer,
      itemId,
      startDate,
      endDate,
      pricePerDay: Number(pricePerDay),
      total: Number(pricePerDay) * days,
      days,
      note,
      paid,
      createdAt: new Date().toISOString(),
    }, ...prev])
  }

  const togglePaid = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, paid: !b.paid } : b))
  }

  const removeBooking = (id) => {
    setBookings(prev => prev.filter(b => b.id !== id))
  }

  const thisMonth = () => {
    const now = new Date()
    return bookings.filter(b => {
      const d = new Date(b.startDate)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyTotal = () => thisMonth().reduce((s, b) => s + (b.paid ? b.total : 0), 0)
  const monthlyPending = () => thisMonth().reduce((s, b) => s + (!b.paid ? b.total : 0), 0)
  const monthlyGoal = goal

  const upcoming = () => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return bookings
      .filter(b => new Date(b.endDate) >= now)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  }

  const past = () => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return bookings
      .filter(b => new Date(b.endDate) < now)
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
  }

  const unpaidCount = () => bookings.filter(b => !b.paid).length

  return {
    bookings, addBooking, togglePaid, removeBooking,
    thisMonth, monthlyTotal, monthlyPending, monthlyGoal, setGoal,
    upcoming, past, unpaidCount,
  }
}
