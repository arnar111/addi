import { useLocalStorage } from './useLocalStorage'

const todayStr = () => new Date().toISOString().split('T')[0]

const defaultMeds = [
  { id: '1', name: 'Tradolan', dose: '1 tafla', times: ['08:00', '20:00'], taken: {}, color: '#22c55e' },
]

const defaultExercises = [
  { id: '1', name: 'Liðlegar æfingar', sets: 3, reps: 10, note: 'Hringræður í öxl' },
  { id: '2', name: 'Styrktar æfing', sets: 3, reps: 15, note: 'Létt þyngd' },
  { id: '3', name: 'Teygjur', sets: 1, reps: 5, note: '30 sek hvert' },
]

export function useHealth() {
  const [meds, setMeds] = useLocalStorage('addi_meds', defaultMeds)
  const [physioLog, setPhysioLog] = useLocalStorage('addi_physio_log', [])
  const [physioExercises] = useLocalStorage('addi_physio_exercises', defaultExercises)

  const takeMed = (medId, time) => {
    const today = todayStr()
    setMeds(prev => prev.map(m => {
      if (m.id !== medId) return m
      const taken = { ...m.taken }
      if (!taken[today]) taken[today] = []
      if (taken[today].includes(time)) {
        taken[today] = taken[today].filter(t => t !== time)
      } else {
        taken[today] = [...taken[today], time]
      }
      return { ...m, taken }
    }))
  }

  const isTaken = (medId, time) => {
    const today = todayStr()
    const m = meds.find(m => m.id === medId)
    return m?.taken?.[today]?.includes(time) || false
  }

  const allTakenToday = () => meds.every(m =>
    m.times.every(t => isTaken(m.id, t))
  )

  const logPhysio = (exerciseId, note = '') => {
    setPhysioLog(prev => [{
      id: Date.now().toString(),
      exerciseId,
      date: new Date().toISOString(),
      note,
    }, ...prev.slice(0, 200)])
  }

  const todayPhysio = physioLog.filter(l => l.date.startsWith(todayStr()))
  const todayMedsDone = meds.reduce((acc, m) =>
    acc + m.times.filter(t => isTaken(m.id, t)).length, 0)
  const totalMedsDose = meds.reduce((acc, m) => acc + m.times.length, 0)

  return {
    meds, takeMed, isTaken, allTakenToday,
    physioLog, physioExercises, logPhysio, todayPhysio,
    todayMedsDone, totalMedsDose,
  }
}
