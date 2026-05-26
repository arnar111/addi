import { useLocalStorage } from './useLocalStorage'
import { isToday } from '../utils/time'

const DEFAULTS = {
  items: [
    { id: '1', name: 'Borð + 10 stólar', pricePerDay: 7000, active: true },
    { id: '2', name: 'Borð + 12 stólar', pricePerDay: 9000, active: true },
    { id: '3', name: 'Stór tjaldsett', pricePerDay: 15000, active: false },
  ],
  bookings: [],
  monthlyGoal: 200000,
}

export function useLendo() {
  const [data, setData] = useLocalStorage('addi-lendo', DEFAULTS)

  function addBooking(booking) {
    const newBooking = {
      id: Date.now().toString(),
      itemId: booking.itemId,
      itemName: booking.itemName,
      amount: booking.amount,
      days: booking.days || 1,
      date: booking.date || new Date().toISOString().split('T')[0],
      note: booking.note || '',
      createdAt: new Date().toISOString(),
    }
    setData(d => ({ ...d, bookings: [newBooking, ...d.bookings] }))
  }

  function removeBooking(id) {
    setData(d => ({ ...d, bookings: d.bookings.filter(b => b.id !== id) }))
  }

  function addItem(item) {
    const newItem = {
      id: Date.now().toString(),
      name: item.name,
      pricePerDay: item.pricePerDay,
      active: true,
    }
    setData(d => ({ ...d, items: [...d.items, newItem] }))
  }

  function toggleItem(id) {
    setData(d => ({
      ...d,
      items: d.items.map(i => i.id === id ? { ...i, active: !i.active } : i)
    }))
  }

  function updateGoal(goal) {
    setData(d => ({ ...d, monthlyGoal: goal }))
  }

  const now = new Date()
  const thisMonth = data.bookings.filter(b => {
    const d = new Date(b.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const monthTotal = thisMonth.reduce((sum, b) => sum + b.amount, 0)
  const todayTotal = data.bookings
    .filter(b => isToday(b.date))
    .reduce((sum, b) => sum + b.amount, 0)

  const goalPct = Math.min(100, Math.round((monthTotal / (data.monthlyGoal || 200000)) * 100))
  const streak = calcStreak(data.bookings)

  return {
    items: data.items,
    bookings: data.bookings,
    monthlyGoal: data.monthlyGoal,
    monthTotal,
    todayTotal,
    goalPct,
    streak,
    thisMonthBookings: thisMonth,
    addBooking,
    removeBooking,
    addItem,
    toggleItem,
    updateGoal,
  }
}

function calcStreak(bookings) {
  if (!bookings.length) return 0
  const dates = [...new Set(bookings.map(b => b.date))].sort().reverse()
  let streak = 0
  let current = new Date()
  current.setHours(0, 0, 0, 0)
  for (const dateStr of dates) {
    const d = new Date(dateStr)
    d.setHours(0, 0, 0, 0)
    const diff = (current - d) / 86400000
    if (diff > 1) break
    streak++
    current = d
  }
  return streak
}
