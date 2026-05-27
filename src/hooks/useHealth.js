import { useLocalStorage } from './useLocalStorage'

const today = () => new Date().toISOString().split('T')[0]

export function useHealth() {
  const [log, setLog] = useLocalStorage('addi_health_log', {})
  const [waterGoal] = useLocalStorage('addi_water_goal', 8)
  const [weightLog, setWeightLog] = useLocalStorage('addi_weight_log', [])
  const [proteinGoal] = useLocalStorage('addi_protein_goal', 150)

  const getDay = (date = today()) => log[date] || {
    huel: [],
    water: 0,
    workout: null,
    notes: '',
  }

  const updateDay = (date, updates) => {
    setLog(prev => ({ ...prev, [date]: { ...getDay(date), ...updates } }))
  }

  const addHuel = (type) => {
    const d = getDay()
    const proteinMap = { black: 40, standard: 35, rtd: 20, powder: 30 }
    updateDay(today(), {
      huel: [
        ...d.huel,
        {
          type,
          time: new Date().toLocaleTimeString('is-IS', { hour: '2-digit', minute: '2-digit' }),
          protein: proteinMap[type] || 35,
        },
      ],
    })
  }

  const removeHuel = (idx) => {
    const d = getDay()
    updateDay(today(), { huel: d.huel.filter((_, i) => i !== idx) })
  }

  const setWater = (glasses) => updateDay(today(), { water: glasses })

  const setWorkout = (w) => updateDay(today(), { workout: w })

  const addWeight = (kg) => {
    setWeightLog(prev => {
      const existing = prev.findIndex(e => e.date === today())
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = { date: today(), kg }
        return updated
      }
      return [...prev, { date: today(), kg }]
    })
  }

  const todayData = getDay()
  const totalProtein = todayData.huel.reduce((a, h) => a + (h.protein || 0), 0)

  // Last 7 days for weekly stats
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })

  const weeklyProteinAvg = (() => {
    const days = last7Days.filter(d => log[d]?.huel?.length > 0)
    if (!days.length) return 0
    const total = days.reduce((acc, d) => {
      return acc + (log[d]?.huel || []).reduce((a, h) => a + (h.protein || 0), 0)
    }, 0)
    return Math.round(total / days.length)
  })()

  const last7Weight = last7Days
    .map(d => weightLog.find(w => w.date === d))
    .filter(Boolean)

  return {
    todayData,
    totalProtein,
    proteinGoal,
    waterGoal,
    weightLog,
    last7Weight,
    weeklyProteinAvg,
    addHuel,
    removeHuel,
    setWater,
    setWorkout,
    addWeight,
    getDay,
    last7Days,
    log,
  }
}
