import { useLocalStorage } from './useLocalStorage'

export const LENDO_ITEMS = [
  { id: 'table_set', label: 'Borð + 10 stólar', icon: '🪑', pricePerDay: 7000 },
  { id: 'full_set', label: 'Fullt sett (2 borð + 20 stólar)', icon: '🎉', pricePerDay: 12000 },
  { id: 'weekend_set', label: 'Borð + 10 stólar (helgi)', icon: '🪑', pricePerDay: 10000 },
  { id: 'chairs_extra', label: 'Auka stólar (10 stk)', icon: '🪑', pricePerDay: 3000 },
  { id: 'other', label: 'Annað', icon: '📦', pricePerDay: 0 },
]

export function useLendo() {
  const [bookings, setBookings] = useLocalStorage('lendo_bookings', [])

  const add = (booking) => {
    setBookings(prev => [{
      id: Date.now().toString(),
      paid: false,
      createdAt: new Date().toISOString(),
      ...booking,
    }, ...prev])
  }

  const remove = (id) => setBookings(prev => prev.filter(b => b.id !== id))

  const update = (id, updates) =>
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))

  const togglePaid = (id) =>
    setBookings(prev => prev.map(b => b.id === id ? { ...b, paid: !b.paid } : b))

  const currentMonth = () => {
    const now = new Date()
    return bookings.filter(b => {
      const d = new Date(b.startDate)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyRevenue = () => currentMonth().reduce((s, b) => s + (Number(b.price) || 0), 0)
  const monthlyPaid = () =>
    currentMonth().filter(b => b.paid).reduce((s, b) => s + (Number(b.price) || 0), 0)
  const monthlyPending = () => monthlyRevenue() - monthlyPaid()

  const totalRevenue = () => bookings.reduce((s, b) => s + (Number(b.price) || 0), 0)

  const upcoming = () =>
    bookings
      .filter(b => new Date(b.startDate) >= new Date(new Date().toDateString()))
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))

  const recent = () => bookings.slice(0, 20)

  return {
    bookings,
    add, remove, update, togglePaid,
    currentMonth, monthlyRevenue, monthlyPaid, monthlyPending, totalRevenue,
    upcoming, recent,
  }
}
