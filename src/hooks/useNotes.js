import { useLocalStorage } from './useLocalStorage'

export function useNotes() {
  const [notes, setNotes] = useLocalStorage('addi_notes', [])

  const add = (text, pinned = false) => {
    if (!text.trim()) return
    setNotes(prev => [{
      id: Date.now().toString(),
      text: text.trim(),
      pinned,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, ...prev])
  }

  const update = (id, text) => {
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, text, updatedAt: new Date().toISOString() } : n
    ))
  }

  const remove = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  const pin = (id) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n))
  }

  const sorted = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return new Date(b.updatedAt) - new Date(a.updatedAt)
  })

  const search = (q) => {
    if (!q) return sorted
    return sorted.filter(n => n.text.toLowerCase().includes(q.toLowerCase()))
  }

  return { notes: sorted, add, update, remove, pin, search }
}
