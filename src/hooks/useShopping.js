import { useLocalStorage } from './useLocalStorage'

export const SHOP_CATEGORIES = [
  { id: 'grocery', label: 'Matvörur', icon: '🛒', color: '#22c55e' },
  { id: 'household', label: 'Heimilið', icon: '🏠', color: '#3b82f6' },
  { id: 'pharmacy', label: 'Apótek', icon: '💊', color: '#ef4444' },
  { id: 'clothing', label: 'Föt', icon: '👕', color: '#8b5cf6' },
  { id: 'electronics', label: 'Tækni', icon: '💻', color: '#f97316' },
  { id: 'other', label: 'Annað', icon: '📦', color: '#64748b' },
]

export function useShopping() {
  const [items, setItems] = useLocalStorage('addi_shopping', [])

  const add = (text, category = 'grocery', estimate = 0) => {
    setItems(prev => [...prev, {
      id: Date.now().toString(),
      text,
      category,
      estimate: Number(estimate) || 0,
      done: false,
      createdAt: new Date().toISOString(),
    }])
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

  const pending = items.filter(i => !i.done)
  const done = items.filter(i => i.done)
  const totalEstimate = pending.reduce((s, i) => s + (i.estimate || 0), 0)

  return { items, add, toggle, remove, clearDone, pending, done, totalEstimate }
}
