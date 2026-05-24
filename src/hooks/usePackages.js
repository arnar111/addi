import { useLocalStorage } from './useLocalStorage'

export const PACKAGE_STATUSES = [
  { id: 'ordered', label: 'Pantað', emoji: '🛒', color: '#64748b' },
  { id: 'processing', label: 'Í vinnslu', emoji: '📦', color: '#f97316' },
  { id: 'in_transit', label: 'Í flutningi', emoji: '🚚', color: '#3b82f6' },
  { id: 'out_for_delivery', label: 'Á leiðinni', emoji: '🏃', color: '#00d4aa' },
  { id: 'delivered', label: 'Afhent', emoji: '✅', color: '#22c55e' },
]

export function usePackages() {
  const [packages, setPackages] = useLocalStorage('addi_packages', [
    {
      id: '1',
      name: 'PETRIA #5700',
      tracking: '520aae54-ba9d-493b-be95-e716a920679e',
      carrier: 'DROPP',
      status: 'in_transit',
      addedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Huel – næsta pöntun',
      tracking: '',
      carrier: 'FedEx',
      status: 'ordered',
      addedAt: new Date().toISOString(),
      note: 'Á að berast 27. maí',
    },
  ])

  const add = (name, tracking = '', carrier = '', note = '') => {
    setPackages(prev => [{
      id: Date.now().toString(),
      name, tracking, carrier, note,
      status: 'ordered',
      addedAt: new Date().toISOString(),
    }, ...prev])
  }

  const updateStatus = (id, status) => {
    setPackages(prev => prev.map(p => p.id === id ? { ...p, status } : p))
  }

  const remove = (id) => {
    setPackages(prev => prev.filter(p => p.id !== id))
  }

  const active = packages.filter(p => p.status !== 'delivered')
  const delivered = packages.filter(p => p.status === 'delivered')

  return { packages, add, updateStatus, remove, active, delivered }
}
