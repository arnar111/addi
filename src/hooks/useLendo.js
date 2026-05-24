import { useLocalStorage } from './useLocalStorage'

export function useLendo() {
  const [bookings, setBookings] = useLocalStorage('addi_lendo_bookings', [])
  const [equipment, setEquipment] = useLocalStorage('addi_lendo_equipment', [
    { id: '1', name: 'Veislusett A', desc: 'Borð + 10 stólar', pricePerDay: 7000, icon: '🪑' },
    { id: '2', name: 'Veislusett B', desc: 'Borð + 10 stólar', pricePerDay: 7000, icon: '🪑' },
    { id: '3', name: 'Extra borð', desc: 'Borð eitt og sér', pricePerDay: 3000, icon: '🛋️' },
    { id: '4', name: 'Extra stólar (x10)', desc: '10 stólar', pricePerDay: 2000, icon: '🪑' },
  ])
  const [monthlyGoal, setMonthlyGoal] = useLocalStorage('addi_lendo_goal', 200000)

  const addBooking = (booking) => {
    setBookings(prev => [{ id: Date.now().toString(), ...booking, createdAt: new Date().toISOString() }, ...prev])
  }

  const updateBooking = (id, updates) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
  }

  const removeBooking = (id) => {
    setBookings(prev => prev.filter(b => b.id !== id))
  }

  const currentMonthStr = () => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  }

  const monthlyIncome = () => {
    const prefix = currentMonthStr()
    return bookings
      .filter(b => b.paid && b.startDate?.startsWith(prefix))
      .reduce((s, b) => s + (b.totalPrice || 0), 0)
  }

  const pendingIncome = () => bookings
    .filter(b => !b.paid)
    .reduce((s, b) => s + (b.totalPrice || 0), 0)

  const upcomingBookings = () => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return bookings
      .filter(b => new Date(b.startDate) >= now)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  }

  const pastBookings = () => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return bookings
      .filter(b => new Date(b.startDate) < now)
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
  }

  const totalEarned = () => bookings.filter(b => b.paid).reduce((s, b) => s + (b.totalPrice || 0), 0)

  const calcPrice = (equipmentIds, startDate, endDate) => {
    if (!startDate || !endDate || !equipmentIds?.length) return 0
    const days = Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000) + 1)
    const dailyRate = equipmentIds.reduce((sum, eid) => {
      const eq = equipment.find(e => e.id === eid)
      return sum + (eq?.pricePerDay || 0)
    }, 0)
    return dailyRate * days
  }

  return {
    bookings, addBooking, updateBooking, removeBooking,
    equipment, setEquipment,
    monthlyGoal, setMonthlyGoal,
    monthlyIncome, pendingIncome, upcomingBookings, pastBookings, totalEarned,
    calcPrice,
  }
}
