import { useLocalStorage } from './useLocalStorage'

const DEFAULT_EQUIPMENT = [
  { id: 'table_chairs', name: 'Borð + 10 stólar', pricePerDay: 7000, icon: '🪑', count: 1 },
  { id: 'extra_chairs', name: 'Viðbótarstólar (10)', pricePerDay: 2000, icon: '🪑', count: 1 },
  { id: 'tablecloth', name: 'Borðdúkur', pricePerDay: 1000, icon: '🎪', count: 4 },
  { id: 'tent', name: 'Partýtjald', pricePerDay: 5000, icon: '⛺', count: 1 },
]

export const BOOKING_STATUSES = ['Staðfest', 'Í bið', 'Skilað', 'Afbókað']

export function useLendo() {
  const [bookings, setBookings] = useLocalStorage('lendo_bookings', [])
  const [equipment, setEquipment] = useLocalStorage('lendo_equipment', DEFAULT_EQUIPMENT)
  const [monthlyGoal] = useLocalStorage('lendo_goal', 200000)

  const addBooking = (booking) => {
    setBookings(prev => [{ ...booking, id: Date.now().toString(), createdAt: new Date().toISOString() }, ...prev])
  }

  const removeBooking = (id) => setBookings(prev => prev.filter(b => b.id !== id))

  const updateStatus = (id, status) =>
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))

  const thisMonthIncome = () => {
    const now = new Date()
    return bookings
      .filter(b => {
        const d = new Date(b.date)
        return d.getMonth() === now.getMonth() &&
               d.getFullYear() === now.getFullYear() &&
               b.status !== 'Afbókað'
      })
      .reduce((sum, b) => sum + (Number(b.amount) || 0), 0)
  }

  const upcomingBookings = () => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return bookings
      .filter(b => new Date(b.date) >= now && b.status !== 'Afbókað')
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5)
  }

  const allSortedBookings = () =>
    [...bookings].sort((a, b) => new Date(b.date) - new Date(a.date))

  const totalIncome = () =>
    bookings.filter(b => b.status !== 'Afbókað').reduce((s, b) => s + (Number(b.amount) || 0), 0)

  return {
    bookings,
    equipment,
    setEquipment,
    monthlyGoal,
    addBooking,
    removeBooking,
    updateStatus,
    thisMonthIncome,
    upcomingBookings,
    allSortedBookings,
    totalIncome,
  }
}
