import { useLocalStorage } from './useLocalStorage'

export function useShoppingList() {
  const [items, setItems] = useLocalStorage('addi_shopping', [])

  const add = (text, qty = '') => {
    if (!text.trim()) return
    setItems(prev => [...prev, {
      id: Date.now().toString(),
      text: text.trim(),
      qty: qty.trim(),
      done: false,
      addedAt: new Date().toISOString(),
    }])
  }

  const toggle = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i))
  const remove = (id) => setItems(prev => prev.filter(i => i.id !== id))
  const clearDone = () => setItems(prev => prev.filter(i => !i.done))
  const clearAll = () => setItems([])

  const pending = items.filter(i => !i.done)
  const done = items.filter(i => i.done)

  return { items, add, toggle, remove, clearDone, clearAll, pending, done }
}
