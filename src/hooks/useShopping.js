import { useLocalStorage } from './useLocalStorage'

export function useShopping() {
  const [items, setItems] = useLocalStorage('addi_shopping', [])

  const addItem = (name, price = 0) => {
    if (!name.trim()) return
    setItems(prev => [{ id: Date.now().toString(), name: name.trim(), price: Number(price) || 0, done: false }, ...prev])
  }

  const toggleItem = (id) => setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i))

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id))

  const setPrice = (id, price) => setItems(prev => prev.map(i => i.id === id ? { ...i, price: Number(price) || 0 } : i))

  const setName = (id, name) => setItems(prev => prev.map(i => i.id === id ? { ...i, name } : i))

  const clearDone = () => setItems(prev => prev.filter(i => !i.done))

  const clearAll = () => setItems([])

  const pending = items.filter(i => !i.done)
  const done = items.filter(i => i.done)
  const checkedTotal = done.reduce((s, i) => s + i.price, 0)
  const grandTotal = items.reduce((s, i) => s + i.price, 0)
  const pct = grandTotal > 0 ? Math.round((checkedTotal / grandTotal) * 100) : 0

  return { items, addItem, toggleItem, removeItem, setPrice, setName, clearDone, clearAll, pending, done, checkedTotal, grandTotal, pct }
}
