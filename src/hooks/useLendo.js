import { useLocalStorage } from './useLocalStorage'

const DEFAULT_ITEMS = [
  { id: '1', name: 'Veislusett (borð + 10 stólar)', priceDay: 7000, priceWeekend: 10000, emoji: '🪑' },
  { id: '2', name: 'Borð', priceDay: 2500, priceWeekend: 3500, emoji: '🪵' },
  { id: '3', name: 'Stólar (10 stk)', priceDay: 4500, priceWeekend: 6500, emoji: '🪑' },
  { id: '4', name: 'Tjald', priceDay: 5000, priceWeekend: 7000, emoji: '⛺' },
  { id: '5', name: 'Grillbúnaður', priceDay: 3000, priceWeekend: 4500, emoji: '🔥' },
]

export function useLendo() {
  const [rentals, setRentals] = useLocalStorage('addi_lendo_rentals', [])
  const [items, setItems] = useLocalStorage('addi_lendo_items', DEFAULT_ITEMS)
  const [goal, setGoal] = useLocalStorage('addi_lendo_goal', 200000)

  const addRental = ({ itemId, amount, days, note, date }) => {
    const item = items.find(i => i.id === itemId)
    setRentals(prev => [{
      id: Date.now().toString(),
      itemId,
      itemName: item?.name || 'Óþekkt hlutur',
      itemEmoji: item?.emoji || '📦',
      amount: Number(amount),
      days: Number(days) || 1,
      note: note || '',
      date: date || new Date().toISOString(),
    }, ...prev])
  }

  const removeRental = (id) => setRentals(prev => prev.filter(r => r.id !== id))

  const addItem = (name, priceDay, priceWeekend, emoji) => {
    setItems(prev => [...prev, {
      id: Date.now().toString(),
      name, priceDay: Number(priceDay), priceWeekend: Number(priceWeekend), emoji,
    }])
  }

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id))

  const currentMonth = () => {
    const now = new Date()
    return rentals.filter(r => {
      const d = new Date(r.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyIncome = () => currentMonth().reduce((s, r) => s + r.amount, 0)
  const totalRentals = () => currentMonth().length
  const avgPerRental = () => {
    const m = currentMonth()
    return m.length ? Math.round(m.reduce((s, r) => s + r.amount, 0) / m.length) : 0
  }

  const recentRentals = rentals.slice(0, 30)

  return {
    rentals, recentRentals, addRental, removeRental,
    items, addItem, removeItem,
    goal, setGoal,
    currentMonth, monthlyIncome, totalRentals, avgPerRental,
  }
}
