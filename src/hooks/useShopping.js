import { useLocalStorage } from './useLocalStorage'

export const SHOP_CATEGORIES = [
  { id: 'food', label: 'Matur', icon: '🥦' },
  { id: 'dairy', label: 'Mjólkurvörur', icon: '🥛' },
  { id: 'bakery', label: 'Bakkelsi', icon: '🍞' },
  { id: 'meat', label: 'Kjöt', icon: '🥩' },
  { id: 'drinks', label: 'Drykkir', icon: '🧃' },
  { id: 'hygiene', label: 'Hreinlæti', icon: '🧴' },
  { id: 'home', label: 'Heimili', icon: '🏠' },
  { id: 'other', label: 'Annað', icon: '🛒' },
]

export function useShopping() {
  const [items, setItems] = useLocalStorage('addi_shopping', [])

  const add = (text, category = 'food', qty = 1) => {
    setItems(prev => [{
      id: Date.now().toString(),
      text: text.trim(),
      category,
      qty,
      done: false,
      createdAt: new Date().toISOString(),
    }, ...prev])
  }

  const toggle = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i))
  }

  const remove = (id) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const clearDone = () => {
    setItems(prev => prev.filter(i => !i.done))
  }

  const clearAll = () => setItems([])

  const pending = items.filter(i => !i.done)
  const done = items.filter(i => i.done)

  return { items, add, toggle, remove, clearDone, clearAll, pending, done }
}
