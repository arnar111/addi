import { useLocalStorage } from './useLocalStorage'

const thisMonth = () => {
  const now = new Date()
  return { month: now.getMonth(), year: now.getFullYear() }
}

export function useLendo() {
  const [bookings, setBookings] = useLocalStorage('addi_lendo', [])
  const [goal, setGoal] = useLocalStorage('addi_lendo_goal', 200000)
  const [items, setItems] = useLocalStorage('addi_lendo_items', [
    { id: '1', name: 'Veislusett (borð + 10 stólar)', price: 7000 },
    { id: '2', name: 'Borð', price: 3000 },
    { id: '3', name: 'Stólar (10 stk)', price: 4000 },
  ])

  const addBooking = ({ clientName, itemId, price, dateFrom, dateTo, note = '' }) => {
    setBookings(prev => [{
      id: Date.now().toString(),
      clientName,
      itemId,
      price: Number(price),
      dateFrom,
      dateTo: dateTo || dateFrom,
      note,
      createdAt: new Date().toISOString(),
    }, ...prev])
  }

  const removeBooking = (id) => setBookings(prev => prev.filter(b => b.id !== id))

  const monthlyIncome = (month, year) => {
    const { month: m, year: y } = month !== undefined ? { month, year } : thisMonth()
    return bookings
      .filter(b => {
        const d = new Date(b.dateFrom)
        return d.getMonth() === m && d.getFullYear() === y
      })
      .reduce((s, b) => s + b.price, 0)
  }

  const currentMonthIncome = monthlyIncome()

  const currentMonthBookings = () => {
    const { month, year } = thisMonth()
    return bookings.filter(b => {
      const d = new Date(b.dateFrom)
      return d.getMonth() === month && d.getFullYear() === year
    })
  }

  const upcomingBookings = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return bookings
      .filter(b => new Date(b.dateFrom) >= today)
      .sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom))
      .slice(0, 5)
  }

  const goalPct = Math.min(100, Math.round((currentMonthIncome / goal) * 100))

  const streak = () => {
    const dates = new Set(bookings.map(b => b.dateFrom))
    let s = 0
    const d = new Date()
    while (true) {
      const str = d.toISOString().split('T')[0]
      if (dates.has(str)) { s++; d.setDate(d.getDate() - 1) }
      else break
    }
    return s
  }

  const addItem = (name, price) => {
    setItems(prev => [...prev, { id: Date.now().toString(), name, price: Number(price) }])
  }

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id))

  return {
    bookings, addBooking, removeBooking,
    goal, setGoal,
    items, addItem, removeItem,
    currentMonthIncome, monthlyIncome, currentMonthBookings,
    upcomingBookings, goalPct, streak,
  }
}
