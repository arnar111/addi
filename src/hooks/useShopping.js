import { useLocalStorage } from './useLocalStorage'

const DEFAULT_LISTS = [
  { id: 'costco', name: 'Costco', icon: '🛒', color: '#f97316', items: [] },
  { id: 'grocery', name: 'Stórmarkaður', icon: '🥦', color: '#22c55e', items: [] },
  { id: 'kringlan', name: 'Kringlan', icon: '🛍️', color: '#8b5cf6', items: [] },
]

export function useShopping() {
  const [lists, setLists] = useLocalStorage('addi_shopping', DEFAULT_LISTS)

  const addItem = (listId, text) =>
    setLists(prev => prev.map(l => l.id !== listId ? l : {
      ...l, items: [...l.items, { id: Date.now().toString(), text, done: false }],
    }))

  const toggleItem = (listId, itemId) =>
    setLists(prev => prev.map(l => l.id !== listId ? l : {
      ...l, items: l.items.map(i => i.id !== itemId ? i : { ...i, done: !i.done }),
    }))

  const removeItem = (listId, itemId) =>
    setLists(prev => prev.map(l => l.id !== listId ? l : {
      ...l, items: l.items.filter(i => i.id !== itemId),
    }))

  const clearDone = (listId) =>
    setLists(prev => prev.map(l => l.id !== listId ? l : {
      ...l, items: l.items.filter(i => !i.done),
    }))

  const addList = (name, icon = '📋', color = '#00d4aa') =>
    setLists(prev => [...prev, { id: Date.now().toString(), name, icon, color, items: [] }])

  const removeList = (id) => setLists(prev => prev.filter(l => l.id !== id))

  const totalPending = lists.reduce((s, l) => s + l.items.filter(i => !i.done).length, 0)

  return { lists, addItem, toggleItem, removeItem, clearDone, addList, removeList, totalPending }
}
