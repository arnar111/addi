import { useLocalStorage } from './useLocalStorage'

const PRESETS = [
  { id: 'p1', name: 'Mjólk', checked: false, category: 'dairy' },
  { id: 'p2', name: 'Brauð', checked: false, category: 'bakery' },
  { id: 'p3', name: 'Egg', checked: false, category: 'dairy' },
]

export function useShopping() {
  const [items, setItems] = useLocalStorage('addi_shopping', [])

  const add = (name, category = 'other') => {
    if (!name.trim()) return
    setItems(prev => [...prev, {
      id: Date.now().toString(),
      name: name.trim(),
      checked: false,
      category,
      createdAt: new Date().toISOString(),
    }])
  }

  const toggle = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i))
  }

  const remove = (id) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const clearChecked = () => {
    setItems(prev => prev.filter(i => !i.checked))
  }

  const clearAll = () => setItems([])

  const unchecked = items.filter(i => !i.checked)
  const checked = items.filter(i => i.checked)

  return { items, unchecked, checked, add, toggle, remove, clearChecked, clearAll }
}
