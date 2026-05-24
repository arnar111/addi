import { useLocalStorage } from './useLocalStorage'

const todayStr = () => new Date().toISOString().split('T')[0]

export function useHabits() {
  const [habits, setHabits] = useLocalStorage('addi_habits', [
    { id: '1', name: 'Hreyfingarækt', icon: '🏋️', color: '#00d4aa', completions: [], target: 5 },
    { id: '2', name: 'Lesa', icon: '📚', color: '#8b5cf6', completions: [], target: 7 },
    { id: '3', name: 'Drekka vatn', icon: '💧', color: '#3b82f6', completions: [], target: 7 },
    { id: '4', name: 'Hugleiðsla', icon: '🧘', color: '#f97316', completions: [], target: 7 },
    { id: '5', name: 'Ganga út', icon: '🚶', color: '#22c55e', completions: [], target: 5 },
  ])

  const toggle = (id) => {
    const today = todayStr()
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h
      const done = h.completions.includes(today)
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(done ? 10 : 40)
      return {
        ...h,
        completions: done
          ? h.completions.filter(d => d !== today)
          : [...h.completions, today],
      }
    }))
  }

  const add = (name, icon = '⭐', color = '#00d4aa', target = 7) => {
    setHabits(prev => [...prev, {
      id: Date.now().toString(),
      name, icon, color, target,
      completions: [],
    }])
  }

  const update = (id, changes) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...changes } : h))
  }

  const remove = (id) => {
    setHabits(prev => prev.filter(h => h.id !== id))
  }

  const isDoneToday = (id) => {
    const h = habits.find(h => h.id === id)
    return h ? h.completions.includes(todayStr()) : false
  }

  const streakFor = (id) => {
    const h = habits.find(h => h.id === id)
    if (!h) return 0
    let streak = 0
    const d = new Date()
    while (streak < 365) {
      const s = d.toISOString().split('T')[0]
      if (h.completions.includes(s)) {
        streak++
        d.setDate(d.getDate() - 1)
      } else break
    }
    return streak
  }

  const last28 = (id) => {
    const h = habits.find(hh => hh.id === id)
    if (!h) return []
    const days = []
    for (let i = 27; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const s = d.toISOString().split('T')[0]
      days.push({ date: s, done: h.completions.includes(s) })
    }
    return days
  }

  const todayDone = habits.filter(h => isDoneToday(h.id)).length

  return { habits, toggle, add, update, remove, isDoneToday, streakFor, last28, todayDone }
}
