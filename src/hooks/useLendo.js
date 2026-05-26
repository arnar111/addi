import { useLocalStorage } from './useLocalStorage'

export const LENDO_ITEMS = [
  { id: 'veislusett', name: 'Veislusett (borð + 10 stólar)', price: 7000, icon: '🎉' },
  { id: 'stolar_10', name: '10 stólar', price: 3000, icon: '🪑' },
  { id: 'bord', name: 'Borð', price: 2000, icon: '🪑' },
  { id: 'tjald', name: 'Tjald/Tjaldbúnaður', price: 4000, icon: '⛺' },
  { id: 'annad', name: 'Annað', price: 0, icon: '📦' },
]

export function useLendo() {
  const [bookings, setBookings] = useLocalStorage('addi_lendo_v2', [])
  const [goal, setGoal] = useLocalStorage('addi_lendo_goal', 200000)

  const addBooking = ({ date, itemId, price, customer = '', note = '', days = 1 }) => {
    const item = LENDO_ITEMS.find(i => i.id === itemId) || LENDO_ITEMS[4]
    setBookings(prev => [{
      id: Date.now().toString(),
      date: date || new Date().toISOString().split('T')[0],
      itemId,
      itemName: item.name,
      price: Number(price) || item.price,
      customer,
      note,
      days: Number(days) || 1,
      paid: false,
      createdAt: new Date().toISOString(),
    }, ...prev])
  }

  const togglePaid = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, paid: !b.paid } : b))
  }

  const removeBooking = (id) => {
    setBookings(prev => prev.filter(b => b.id !== id))
  }

  const currentMonthBookings = () => {
    const now = new Date()
    return bookings.filter(b => {
      const d = new Date(b.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const totalRevenue = (list = null) =>
    (list || bookings).reduce((s, b) => s + (b.price * (b.days || 1)), 0)

  const monthlyRevenue = () => totalRevenue(currentMonthBookings())
  const unpaidTotal = () => bookings.filter(b => !b.paid).reduce((s, b) => s + (b.price * (b.days || 1)), 0)
  const paidTotal = () => bookings.filter(b => b.paid).reduce((s, b) => s + (b.price * (b.days || 1)), 0)

  const goalPct = () => Math.min(100, Math.round((monthlyRevenue() / goal) * 100))

  return {
    bookings,
    addBooking,
    togglePaid,
    removeBooking,
    goal,
    setGoal,
    currentMonthBookings,
    monthlyRevenue,
    unpaidTotal,
    paidTotal,
    goalPct,
    totalRevenue,
  }
}
