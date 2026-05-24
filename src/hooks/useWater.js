import { useLocalStorage } from './useLocalStorage'

const todayStr = () => new Date().toISOString().split('T')[0]

export function useWater() {
  const [water, setWater] = useLocalStorage('addi_water', {})
  const [goal, setGoal] = useLocalStorage('addi_water_goal', 8)

  const today = todayStr()
  const todayCount = water[today] || 0

  const add = () => {
    setWater(prev => ({ ...prev, [today]: (prev[today] || 0) + 1 }))
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(30)
  }

  const subtract = () => {
    setWater(prev => ({ ...prev, [today]: Math.max(0, (prev[today] || 0) - 1) }))
  }

  const weekHistory = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const s = d.toISOString().split('T')[0]
      days.push({ date: s, count: water[s] || 0 })
    }
    return days
  }

  return { todayCount, goal, setGoal, add, subtract, weekHistory }
}
