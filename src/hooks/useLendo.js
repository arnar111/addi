import { useLocalStorage } from './useLocalStorage'

const INITIAL_INVENTORY = [
  { id: 'inv1', name: 'Veislusett (borð + 10 stólar)', pricePerDay: 7000, quantity: 3, icon: '🎪' },
  { id: 'inv2', name: 'Borð', pricePerDay: 3000, quantity: 6, icon: '🪑' },
  { id: 'inv3', name: 'Stóll', pricePerDay: 300, quantity: 40, icon: '🪑' },
  { id: 'inv4', name: 'Tjald', pricePerDay: 5000, quantity: 2, icon: '⛺' },
  { id: 'inv5', name: 'Borðabrúður', pricePerDay: 1500, quantity: 10, icon: '🎀' },
]

export function useLendo() {
  const [rentals, setRentals] = useLocalStorage('addi_lendo_rentals', [])
  const [inventory, setInventory] = useLocalStorage('addi_lendo_inventory', INITIAL_INVENTORY)
  const [monthGoal, setMonthGoal] = useLocalStorage('addi_lendo_goal', 200000)

  const addRental = ({ renterName, item, days, startDate, note, customAmount }) => {
    const inv = inventory.find(i => i.id === item)
    const totalAmount = customAmount ? Number(customAmount) : (inv ? inv.pricePerDay * Number(days) : 0)
    setRentals(prev => [{
      id: Date.now().toString(),
      renterName,
      item,
      itemName: inv ? inv.name : item,
      days: Number(days),
      startDate: startDate || new Date().toISOString().split('T')[0],
      note: note || '',
      totalAmount,
      status: 'active',
      createdAt: new Date().toISOString(),
    }, ...prev])
  }

  const returnRental = (id) => {
    setRentals(prev => prev.map(r =>
      r.id === id ? { ...r, status: 'returned', returnedAt: new Date().toISOString() } : r
    ))
  }

  const deleteRental = (id) => {
    setRentals(prev => prev.filter(r => r.id !== id))
  }

  const monthlyIncome = () => {
    const now = new Date()
    return rentals
      .filter(r => {
        const d = new Date(r.createdAt)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      })
      .reduce((sum, r) => sum + (r.totalAmount || 0), 0)
  }

  const totalIncome = () => rentals.reduce((sum, r) => sum + (r.totalAmount || 0), 0)

  const activeRentals = rentals.filter(r => r.status === 'active')
  const returnedRentals = rentals.filter(r => r.status === 'returned')

  const rentalsDueToday = activeRentals.filter(r => {
    if (!r.startDate || !r.days) return false
    const end = new Date(r.startDate)
    end.setDate(end.getDate() + r.days)
    const today = new Date()
    return end.toDateString() === today.toDateString()
  })

  return {
    rentals, inventory, setInventory,
    monthGoal, setMonthGoal,
    addRental, returnRental, deleteRental,
    monthlyIncome, totalIncome,
    activeRentals, returnedRentals, rentalsDueToday,
  }
}
