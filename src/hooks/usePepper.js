import { useLocalStorage } from './useLocalStorage'

const todayStr = () => new Date().toISOString().split('T')[0]

export const PEPPER_TYPES = [
  { id: 'reaper', name: 'Carolina Reaper', shu: '2.2M SHU', icon: '🌶️', color: '#ef4444' },
  { id: 'ghost', name: 'Ghost Pepper', shu: '1M SHU', icon: '👻', color: '#f97316' },
  { id: 'scorpion', name: 'Moruga Scorpion', shu: '2M SHU', icon: '🦂', color: '#dc2626' },
  { id: '7pot', name: '7 Pot Primo', shu: '1.5M SHU', icon: '🔥', color: '#b91c1c' },
  { id: 'habanero', name: 'Habanero', shu: '350k SHU', icon: '🧡', color: '#ea580c' },
  { id: 'scotch', name: 'Scotch Bonnet', shu: '350k SHU', icon: '🟡', color: '#eab308' },
  { id: 'other', name: 'Annað', shu: '?', icon: '🌿', color: '#22c55e' },
]

export const LOG_TYPES = [
  { id: 'water', label: 'Vökvun', icon: '💧' },
  { id: 'feed', label: 'Áburður', icon: '🌿' },
  { id: 'light', label: 'Ljósskipti', icon: '💡' },
  { id: 'repot', label: 'Pottaskipti', icon: '🪴' },
  { id: 'trim', label: 'Klipping', icon: '✂️' },
  { id: 'note', label: 'Athugasemd', icon: '📝' },
]

export function usePepper() {
  const [plants, setPlants] = useLocalStorage('addi_plants', [])
  const [logs, setLogs] = useLocalStorage('addi_plant_logs', [])

  const addPlant = (name, type, plantedDate, notes = '') => {
    setPlants(prev => [{
      id: Date.now().toString(),
      name,
      type,
      plantedDate: plantedDate || todayStr(),
      notes,
    }, ...prev])
  }

  const removePlant = (id) => {
    setPlants(prev => prev.filter(p => p.id !== id))
    setLogs(prev => prev.filter(l => l.plantId !== id))
  }

  const addLog = (plantId, logType, note = '') => {
    setLogs(prev => [{
      id: Date.now().toString(),
      plantId,
      logType,
      note,
      date: new Date().toISOString(),
    }, ...prev])
  }

  const logsForPlant = (plantId) => logs.filter(l => l.plantId === plantId)

  const lastEventOfType = (plantId, type) => {
    const relevant = logs.filter(l => l.plantId === plantId && l.logType === type)
    return relevant.length > 0 ? new Date(relevant[0].date) : null
  }

  const daysSince = (plantId, type) => {
    const last = lastEventOfType(plantId, type)
    if (!last) return null
    return Math.floor((Date.now() - last.getTime()) / 86400000)
  }

  const daysSinceWater = (plantId) => daysSince(plantId, 'water')

  const ageInDays = (plantedDate) => {
    if (!plantedDate) return null
    return Math.floor((Date.now() - new Date(plantedDate).getTime()) / 86400000)
  }

  const plantsNeedingWater = plants.filter(p => {
    const d = daysSinceWater(p.id)
    return d === null || d > 2
  })

  return {
    plants, addPlant, removePlant,
    logs, addLog, logsForPlant,
    lastEventOfType, daysSince, daysSinceWater,
    ageInDays, plantsNeedingWater,
  }
}
