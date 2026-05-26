import { useLocalStorage } from './useLocalStorage'

export function useLendo() {
  const [items, setItems] = useLocalStorage('addi_lendo_items', [
    { id: '1', name: 'Veislusett', description: 'Borð + 10 stólar', pricePerDay: 7000, priceWeekend: 10000, icon: '🪑', active: true },
    { id: '2', name: 'Tjald', description: 'Stórt veðurtjald', pricePerDay: 5000, priceWeekend: 7000, icon: '⛺', active: true },
  ])

  const [bookings, setBookings] = useLocalStorage('addi_lendo_bookings', [])
  const [monthlyGoal, setMonthlyGoal] = useLocalStorage('addi_lendo_goal', 200000)
  const [reviews] = useLocalStorage('addi_lendo_reviews', { rating: 4.3, count: 14 })

  const addBooking = (itemId, date, days, amount, renterName = '', note = '') => {
    setBookings(prev => [{
      id: Date.now().toString(),
      itemId,
      date,
      days: Number(days),
      amount: Number(amount),
      renterName,
      note,
      createdAt: new Date().toISOString(),
    }, ...prev])
  }

  const removeBooking = (id) => setBookings(prev => prev.filter(b => b.id !== id))

  const addItem = (name, description, pricePerDay, icon = '📦') => {
    setItems(prev => [...prev, {
      id: Date.now().toString(), name, description,
      pricePerDay: Number(pricePerDay), priceWeekend: Number(pricePerDay),
      icon, active: true,
    }])
  }

  const currentMonthIncome = () => {
    const now = new Date()
    return bookings
      .filter(b => {
        const d = new Date(b.date)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      })
      .reduce((sum, b) => sum + b.amount, 0)
  }

  const incomeForDays = (days) => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    return bookings.filter(b => new Date(b.date) >= cutoff).reduce((sum, b) => sum + b.amount, 0)
  }

  const totalBookings = bookings.length
  const totalIncome = bookings.reduce((sum, b) => sum + b.amount, 0)

  const revenueByItem = () => {
    const result = {}
    bookings.forEach(b => {
      result[b.itemId] = (result[b.itemId] || 0) + b.amount
    })
    return result
  }

  const nextBooking = () => {
    const today = new Date().toISOString().split('T')[0]
    return bookings
      .filter(b => b.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))[0] || null
  }

  return {
    items, addItem,
    bookings: bookings.slice(0, 20),
    monthlyGoal, setMonthlyGoal,
    reviews,
    addBooking, removeBooking,
    currentMonthIncome, incomeForDays,
    totalBookings, totalIncome,
    revenueByItem, nextBooking,
  }
}
