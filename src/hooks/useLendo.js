import { useLocalStorage } from './useLocalStorage'

export function useLendo() {
  const [bookings, setBookings] = useLocalStorage('addi_lendo_bookings', [])
  const [goal, setGoal] = useLocalStorage('addi_lendo_goal', 200000)
  const [items] = useLocalStorage('addi_lendo_items', [
    { id: '1', name: 'Borðsett (borð + 10 stólar)', pricePerDay: 7000, icon: '🪑' },
    { id: '2', name: 'Borð eitt', pricePerDay: 3000, icon: '🪵' },
    { id: '3', name: 'Stólar (x10)', pricePerDay: 5000, icon: '💺' },
  ])

  const addBooking = (itemId, startDate, days, note = '') => {
    const item = items.find(i => i.id === itemId)
    const amount = item ? item.pricePerDay * Number(days) : 0
    setBookings(prev => [
      {
        id: Date.now().toString(),
        itemId,
        itemName: item?.name || '',
        itemIcon: item?.icon || '🪑',
        startDate,
        days: Number(days),
        amount,
        note,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ])
  }

  const removeBooking = (id) => setBookings(prev => prev.filter(b => b.id !== id))

  const monthlyIncome = (offset = 0) => {
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth() + offset
    const target = new Date(y, m, 1)
    return bookings
      .filter(b => {
        const d = new Date(b.startDate)
        return d.getFullYear() === target.getFullYear() && d.getMonth() === target.getMonth()
      })
      .reduce((sum, b) => sum + b.amount, 0)
  }

  const totalIncome = () => bookings.reduce((sum, b) => sum + b.amount, 0)

  const monthBookings = (offset = 0) => {
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth() + offset
    const target = new Date(y, m, 1)
    return [...bookings]
      .filter(b => {
        const d = new Date(b.startDate)
        return d.getFullYear() === target.getFullYear() && d.getMonth() === target.getMonth()
      })
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
  }

  const recentBookings = [...bookings].slice(0, 15)

  const lastMonthIncome = monthlyIncome(-1)
  const thisMonthIncome = monthlyIncome(0)
  const vsLastMonth = lastMonthIncome > 0
    ? Math.round(((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100)
    : null

  return {
    bookings,
    items,
    goal,
    setGoal,
    addBooking,
    removeBooking,
    monthlyIncome,
    totalIncome,
    recentBookings,
    monthBookings,
    thisMonthIncome,
    lastMonthIncome,
    vsLastMonth,
  }
}
