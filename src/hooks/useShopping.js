import { useLocalStorage } from './useLocalStorage'

export const SHOPPING_CATS = [
  { id: 'matur', label: 'Matur', icon: '🥦', color: '#22c55e' },
  { id: 'drykkur', label: 'Drykkur', icon: '🥤', color: '#3b82f6' },
  { id: 'hreinlaeti', label: 'Hreinlæti', icon: '🧼', color: '#8b5cf6' },
  { id: 'heimili', label: 'Heimili', icon: '🏠', color: '#f97316' },
  { id: 'annad', label: 'Annað', icon: '🛒', color: '#64748b' },
]

export function useShopping() {
  const [items, setItems] = useLocalStorage('addi_shopping', [])

  const add = (name, category = 'matur') => {
    if (!name.trim()) return
    setItems(prev => [...prev, {
      id: Date.now().toString(),
      name: name.trim(),
      category,
      done: false,
      addedAt: new Date().toISOString(),
    }])
  }

  const toggle = (id) => setItems(prev =>
    prev.map(i => i.id === id ? { ...i, done: !i.done } : i)
  )

  const remove = (id) => setItems(prev => prev.filter(i => i.id !== id))

  const clearDone = () => setItems(prev => prev.filter(i => !i.done))

  const pending = items.filter(i => !i.done)
  const done = items.filter(i => i.done)

  return { items, add, toggle, remove, clearDone, pending, done }
}
