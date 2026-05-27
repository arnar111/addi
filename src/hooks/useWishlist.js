import { useLocalStorage } from './useLocalStorage'

const DEFAULT_WISHLIST = [
  {
    id: 'blacksmith',
    name: 'Blacksmith Master',
    icon: '⚒️',
    store: 'Steam',
    storeColor: '#1a9fff',
    originalPrice: 3990,
    currentPrice: 1990,
    targetPrice: 2000,
    priority: 'high',
    addedAt: new Date().toISOString(),
    onSale: true,
    saleEnds: '2026-06-09',
    url: 'https://store.steampowered.com',
    note: '-50% sale núna!',
  },
]

const STORES = ['Steam', 'Amazon', 'SeatGeek', 'PlayStation', 'Nintendo', 'Other']
const PRIORITY_COLORS = { high: '#ef4444', medium: '#f97316', low: '#22c55e' }
const PRIORITY_LABELS = { high: 'Brýnt', medium: 'Miðlungs', low: 'Lágt' }

export { STORES, PRIORITY_COLORS, PRIORITY_LABELS }

export function useWishlist() {
  const [items, setItems] = useLocalStorage('addi_wishlist', DEFAULT_WISHLIST)

  const add = (item) => setItems(prev => [...prev, { ...item, id: Date.now().toString(), addedAt: new Date().toISOString() }])
  const remove = (id) => setItems(prev => prev.filter(i => i.id !== id))
  const update = (id, changes) => setItems(prev => prev.map(i => i.id === id ? { ...i, ...changes } : i))
  const markSale = (id, salePrice, saleEnds) => setItems(prev => prev.map(i => i.id === id ? { ...i, onSale: true, currentPrice: salePrice, saleEnds } : i))

  const sorted = [...items].sort((a, b) => {
    const pa = { high: 0, medium: 1, low: 2 }
    return (pa[a.priority] || 1) - (pa[b.priority] || 1)
  })

  const onSale = items.filter(i => i.onSale)
  const atTarget = items.filter(i => i.currentPrice <= (i.targetPrice || 0))

  const totalSavings = items.reduce((sum, i) => {
    if (i.onSale && i.originalPrice && i.currentPrice) {
      return sum + (i.originalPrice - i.currentPrice)
    }
    return sum
  }, 0)

  return { items: sorted, add, remove, update, markSale, onSale, atTarget, totalSavings }
}
