import { useLocalStorage } from './useLocalStorage'

export const ITEM_TYPES = [
  { id: 'table_set', label: 'Veislusett (borð + 10 stólar)', pricePerDay: 7000, icon: '🪑' },
  { id: 'table', label: 'Borð', pricePerDay: 3000, icon: '🔲' },
  { id: 'chairs_10', label: '10 stólar', pricePerDay: 4000, icon: '🪑' },
  { id: 'other', label: 'Annað', pricePerDay: 0, icon: '📦' },
]

export function useBusiness() {
  const [bookings, setBookings] = useLocalStorage('addi_lendo_bookings', [])
  const [monthlyGoal, setMonthlyGoal] = useLocalStorage('addi_lendo_goal', 200000)
  const [items, setItems] = useLocalStorage('addi_lendo_items', [
    { id: '1', name: 'Veislusett - borð + 10 stólar', type: 'table_set', pricePerDay: 7000, active: true },
  ])

  const addBooking = ({ customerName, itemId, startDate, endDate, priceOverride = null, notes = '' }) => {
    const item = items.find(i => i.id === itemId)
    const days = Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1)
    const price = priceOverride !== null ? priceOverride : (item?.pricePerDay || 0) * days
    setBookings(prev => [{
      id: Date.now().toString(),
      customerName,
      itemId,
      itemName: item?.name || 'Óþekkt',
      startDate,
      endDate,
      days,
      price,
      notes,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }, ...prev])
  }

  const updateStatus = (id, status) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
  }

  const remove = (id) => setBookings(prev => prev.filter(b => b.id !== id))

  const monthlyIncome = (year, month) => {
    return bookings
      .filter(b => {
        const d = new Date(b.startDate)
        return d.getFullYear() === year && d.getMonth() === month && b.status !== 'cancelled'
      })
      .reduce((sum, b) => sum + b.price, 0)
  }

  const thisMonthIncome = () => {
    const now = new Date()
    return monthlyIncome(now.getFullYear(), now.getMonth())
  }

  const recentBookings = [...bookings].sort((a, b) =>
    new Date(b.startDate) - new Date(a.startDate)
  ).slice(0, 10)

  const upcoming = bookings.filter(b => new Date(b.startDate) >= new Date() && b.status !== 'cancelled')
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))

  return {
    bookings, addBooking, updateStatus, remove,
    items, setItems,
    monthlyGoal, setMonthlyGoal,
    monthlyIncome, thisMonthIncome,
    recentBookings, upcoming,
  }
}
