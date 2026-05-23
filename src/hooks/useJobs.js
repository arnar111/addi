import { useLocalStorage } from './useLocalStorage'

export const JOB_STATUSES = [
  { id: 'saved', label: 'Vistað', icon: '🔖', color: '#8b5cf6' },
  { id: 'applied', label: 'Sent', icon: '📝', color: '#3b82f6' },
  { id: 'interview', label: 'Viðtal', icon: '📞', color: '#f97316' },
  { id: 'offer', label: 'Tilboð', icon: '🎯', color: '#22c55e' },
  { id: 'rejected', label: 'Hafnað', icon: '❌', color: '#ef4444' },
]

export function useJobs() {
  const [jobs, setJobs] = useLocalStorage('addi_jobs', [])

  const add = ({ company, title, link = '', status = 'applied', salary = '', notes = '' }) => {
    setJobs(prev => [{
      id: Date.now(),
      company,
      title,
      link,
      status,
      salary,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, ...prev])
  }

  const update = (id, updates) => {
    setJobs(prev => prev.map(j =>
      j.id === id ? { ...j, ...updates, updatedAt: new Date().toISOString() } : j
    ))
  }

  const remove = (id) => setJobs(prev => prev.filter(j => j.id !== id))

  const stats = JOB_STATUSES.reduce((acc, s) => {
    acc[s.id] = jobs.filter(j => j.status === s.id).length
    return acc
  }, {})

  const active = jobs.filter(j => !['rejected'].includes(j.status))
  const recent = [...jobs].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 3)

  return { jobs, add, update, remove, stats, active, recent }
}
