import { useLocalStorage } from './useLocalStorage'

export const STAGES = ['Fræ', 'Kíma', 'Uppspretta', 'Planta', 'Blóm', 'Ávöxtur', 'Uppskera']
export const STAGE_COLORS = ['#64748b', '#22c55e', '#86efac', '#16a34a', '#f97316', '#ef4444', '#eab308']

export const PEPPER_TYPES = [
  { id: 'reaper', label: 'Carolina Reaper', icon: '🌶️', shu: '2.2M SHU' },
  { id: 'ghost', label: 'Ghost Pepper', icon: '👻', shu: '1M SHU' },
  { id: 'scorpion', label: 'Scorpion', icon: '🦂', shu: '1.4M SHU' },
  { id: 'habanero', label: 'Habanero', icon: '🟠', shu: '350k SHU' },
  { id: 'cayenne', label: 'Cayenne', icon: '🔴', shu: '50k SHU' },
  { id: 'other', label: 'Annað', icon: '🌿', shu: '?' },
]

const defaultPlants = [
  { id: '1', name: 'Reaper #1', type: 'reaper', stage: 2, potSize: '1L', lastWatered: new Date(Date.now() - 2 * 86400000).toISOString(), notes: '', added: new Date().toISOString() },
  { id: '2', name: 'Ghost #1', type: 'ghost', stage: 1, potSize: '0.5L', lastWatered: new Date(Date.now() - 1 * 86400000).toISOString(), notes: '', added: new Date().toISOString() },
  { id: '3', name: 'Scorpion #1', type: 'scorpion', stage: 1, potSize: '0.5L', lastWatered: new Date(Date.now() - 3 * 86400000).toISOString(), notes: '', added: new Date().toISOString() },
]

export function useSpira() {
  const [plants, setPlants] = useLocalStorage('addi_spira_plants', defaultPlants)
  const [wateringLog, setWateringLog] = useLocalStorage('addi_spira_watering', [])

  const addPlant = (name, type, potSize = '0.5L') => {
    setPlants(prev => [...prev, {
      id: Date.now().toString(),
      name, type, potSize,
      stage: 0,
      lastWatered: null,
      notes: '',
      added: new Date().toISOString(),
    }])
  }

  const water = (id) => {
    const now = new Date().toISOString()
    setPlants(prev => prev.map(p => p.id === id ? { ...p, lastWatered: now } : p))
    setWateringLog(prev => [{ id: Date.now().toString(), plantId: id, date: now }, ...prev.slice(0, 500)])
  }

  const waterAll = () => {
    const now = new Date().toISOString()
    setPlants(prev => prev.map(p => ({ ...p, lastWatered: now })))
  }

  const advanceStage = (id) => {
    setPlants(prev => prev.map(p =>
      p.id === id ? { ...p, stage: Math.min(STAGES.length - 1, p.stage + 1) } : p
    ))
  }

  const regressStage = (id) => {
    setPlants(prev => prev.map(p =>
      p.id === id ? { ...p, stage: Math.max(0, p.stage - 1) } : p
    ))
  }

  const updateNote = (id, notes) => {
    setPlants(prev => prev.map(p => p.id === id ? { ...p, notes } : p))
  }

  const removePlant = (id) => setPlants(prev => prev.filter(p => p.id !== id))

  const daysSinceWatered = (plant) => {
    if (!plant.lastWatered) return null
    return Math.floor((Date.now() - new Date(plant.lastWatered)) / 86400000)
  }

  const needsWater = plants.filter(p => {
    const d = daysSinceWatered(p)
    return d === null || d >= 2
  })

  return {
    plants, addPlant, water, waterAll, advanceStage, regressStage,
    updateNote, removePlant, daysSinceWatered, needsWater,
    STAGES, STAGE_COLORS, PEPPER_TYPES,
    wateringLog,
  }
}
