import { useLocalStorage } from './useLocalStorage'

export function useLendo() {
  const [bookings, setBookings] = useLocalStorage('addi_lendo', [])

  const add = ({ customerName, equipment, startDate, endDate, amount, note }) => {
    setBookings(prev => [{
      id: Date.now().toString(),
      customerName: customerName || '',
      equipment: equipment || 'Sett',
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || startDate || new Date().toISOString().split('T')[0],
      amount: Number(amount) || 0,
      note: note || '',
      status: 'booked',
      createdAt: new Date().toISOString(),
    }, ...prev])
  }

  const remove = (id) => setBookings(prev => prev.filter(b => b.id !== id))

  const updateStatus = (id, status) =>
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))

  const thisMonth = () => {
    const now = new Date()
    return bookings.filter(b => {
      const d = new Date(b.startDate)
      return d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear() &&
        b.status !== 'cancelled'
    })
  }

  const monthlyRevenue = () => thisMonth().reduce((s, b) => s + b.amount, 0)

  const upcoming = () => {
    const today = new Date().toISOString().split('T')[0]
    return bookings
      .filter(b => b.startDate >= today && !['done', 'cancelled'].includes(b.status))
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
  }

  const totalRevenue = () =>
    bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + b.amount, 0)

  return { bookings, add, remove, updateStatus, thisMonth, monthlyRevenue, upcoming, totalRevenue }
}
