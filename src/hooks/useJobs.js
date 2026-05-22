import { useLocalStorage } from './useLocalStorage'

export const JOB_STATUSES = [
  { id: 'applied', label: 'Sótt', color: '#3b82f6' },
  { id: 'screening', label: 'Skoðun', color: '#f97316' },
  { id: 'interview', label: 'Viðtal', color: '#8b5cf6' },
  { id: 'offer', label: 'Tilboð', color: '#22c55e' },
  { id: 'rejected', label: 'Hafnað', color: '#ef4444' },
  { id: 'withdrawn', label: 'Dregið til baka', color: '#64748b' },
]

export function useJobs() {
  const [jobs, setJobs] = useLocalStorage('addi_jobs', [])

  const add = (company, role, url = '', notes = '') => {
    setJobs(prev => [{
      id: Date.now().toString(),
      company,
      role,
      url,
      notes,
      status: 'applied',
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, ...prev])
  }

  const update = (id, updates) => {
    setJobs(prev => prev.map(j =>
      j.id === id ? { ...j, ...updates, updatedAt: new Date().toISOString() } : j
    ))
  }

  const remove = (id) => setJobs(prev => prev.filter(j => j.id !== id))

  const stats = {
    total: jobs.length,
    applied: jobs.filter(j => j.status === 'applied').length,
    active: jobs.filter(j => ['screening', 'interview'].includes(j.status)).length,
    offers: jobs.filter(j => j.status === 'offer').length,
    rejected: jobs.filter(j => j.status === 'rejected').length,
  }

  return { jobs, add, update, remove, stats }
}
