import { useLocalStorage } from './useLocalStorage'

const DEFAULT_ITEMS = [
  { id: '1', name: 'Veislusett (borð + 10 stólar)', defaultPrice: 7000, icon: '🪑' },
  { id: '2', name: 'Borðsett (borð + 6 stólar)', defaultPrice: 5000, icon: '🪵' },
  { id: '3', name: 'Stóll (stk)', defaultPrice: 500, icon: '🪑' },
  { id: '4', name: 'Borð (stk)', defaultPrice: 2000, icon: '🪵' },
]

export function useRental() {
  const [rentals, setRentals] = useLocalStorage('addi_rentals', [])
  const [items] = useLocalStorage('addi_rental_items', DEFAULT_ITEMS)
  const [monthlyGoal, setMonthlyGoal] = useLocalStorage('addi_rental_goal', 200000)

  const addRental = ({ client, itemId, startDate, days, pricePerDay, note = '' }) => {
    const item = items.find(i => i.id === itemId) || items[0]
    setRentals(prev => [{
      id: Date.now().toString(),
      client,
      itemId,
      itemName: item.name,
      itemIcon: item.icon,
      startDate,
      days: Number(days),
      pricePerDay: Number(pricePerDay),
      total: Number(days) * Number(pricePerDay),
      note,
      status: 'active',
      createdAt: new Date().toISOString(),
    }, ...prev])
  }

  const updateStatus = (id, status) => {
    setRentals(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }

  const remove = (id) => setRentals(prev => prev.filter(r => r.id !== id))

  const thisMonthRentals = () => {
    const now = new Date()
    return rentals.filter(r => {
      const d = new Date(r.startDate)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  const monthlyIncome = () => thisMonthRentals().reduce((s, r) => s + r.total, 0)
  const activeRentals = rentals.filter(r => r.status === 'active')
  const totalIncome = rentals.filter(r => r.status !== 'cancelled').reduce((s, r) => s + r.total, 0)

  return {
    rentals, items, monthlyGoal, setMonthlyGoal,
    addRental, updateStatus, remove,
    thisMonthRentals, monthlyIncome, activeRentals, totalIncome,
  }
}
