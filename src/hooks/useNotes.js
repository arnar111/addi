import { useLocalStorage } from './useLocalStorage'

export function useNotes() {
  const [notes, setNotes] = useLocalStorage('addi_notes', [])

  const add = (text, title = '', color = '', pinned = false) => {
    if (!text.trim() && !title.trim()) return
    setNotes(prev => [{
      id: Date.now().toString(),
      title: title.trim(),
      text: text.trim(),
      color,
      pinned,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, ...prev])
  }

  const update = (id, changes) => {
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, ...changes, updatedAt: new Date().toISOString() } : n
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
    const ql = q.toLowerCase()
    return sorted.filter(n =>
      n.text.toLowerCase().includes(ql) ||
      (n.title || '').toLowerCase().includes(ql)
    )
  }

  return { notes: sorted, add, update, remove, pin, search }
}
