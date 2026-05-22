import { useLocalStorage } from './useLocalStorage'

export const SHOP_CATS = [
  { id: 'produce', label: 'Grænmeti', icon: '🥦' },
  { id: 'meat', label: 'Kjöt', icon: '🥩' },
  { id: 'dairy', label: 'Mjólk', icon: '🥛' },
  { id: 'bakery', label: 'Brauð', icon: '🍞' },
  { id: 'drinks', label: 'Drykkir', icon: '🧃' },
  { id: 'hygiene', label: 'Hreinlæti', icon: '🧴' },
  { id: 'home', label: 'Húshald', icon: '🏠' },
  { id: 'other', label: 'Annað', icon: '📦' },
]

export function useShopping() {
  const [items, setItems] = useLocalStorage('addi_shopping', [])

  const addItem = (text, category = 'other', qty = '') => {
    if (!text.trim()) return
    setItems(prev => [...prev, {
      id: Date.now().toString(),
      text: text.trim(),
      category,
      qty,
      done: false,
      createdAt: new Date().toISOString(),
    }])
  }

  const toggle = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i))
  const remove = (id) => setItems(prev => prev.filter(i => i.id !== id))
  const clearDone = () => setItems(prev => prev.filter(i => !i.done))
  const clearAll = () => setItems([])

  const pending = items.filter(i => !i.done)
  const done = items.filter(i => i.done)

  return { items, addItem, toggle, remove, clearDone, clearAll, pending, done }
}
