import { useLocalStorage } from './useLocalStorage'

const todayStr = () => new Date().toISOString().split('T')[0]

export function useHabits() {
  const [habits, setHabits] = useLocalStorage('addi_habits', [
    { id: '1', name: 'Forrita', icon: '💻', color: '#00d4aa', completions: [] },
    { id: '2', name: 'Hreyfingarækt', icon: '🏋️', color: '#8b5cf6', completions: [] },
    { id: '3', name: 'Lesa', icon: '📚', color: '#3b82f6', completions: [] },
    { id: '4', name: 'Lendó bókun', icon: '🪑', color: '#f97316', completions: [] },
  ])

  const toggle = (id) => {
    const today = todayStr()
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h
      const done = h.completions.includes(today)
      return {
        ...h,
        completions: done
          ? h.completions.filter(d => d !== today)
          : [...h.completions, today],
      }
    }))
  }

  const add = (name, icon = '⭐', color = '#00d4aa') => {
    setHabits(prev => [...prev, {
      id: Date.now().toString(),
      name, icon, color,
      completions: [],
    }])
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
    while (true) {
      const s = d.toISOString().split('T')[0]
      if (h.completions.includes(s)) {
        streak++
        d.setDate(d.getDate() - 1)
      } else break
    }
    return streak
  }

  const todayDone = habits.filter(h => isDoneToday(h.id)).length

  return { habits, toggle, add, remove, isDoneToday, streakFor, todayDone }
}
