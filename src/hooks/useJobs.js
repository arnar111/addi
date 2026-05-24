import { useLocalStorage } from './useLocalStorage'

export const JOB_STATUSES = [
  { id: 'applied', label: 'Sótt um', color: '#3b82f6', short: 'S' },
  { id: 'interview', label: 'Viðtal', color: '#f97316', short: 'V' },
  { id: 'offer', label: 'Tilboð', color: '#22c55e', short: 'T' },
  { id: 'rejected', label: 'Hafnað', color: '#ef4444', short: 'H' },
  { id: 'withdrawn', label: 'Dregið til baka', color: '#64748b', short: 'D' },
]

export function useJobs() {
  const [jobs, setJobs] = useLocalStorage('addi_jobs', [])

  const add = ({ company, role, link = '', location = '', appliedDate, notes = '' }) => {
    setJobs(prev => [{
      id: Date.now().toString(),
      company,
      role,
      link,
      location,
      appliedDate: appliedDate || new Date().toISOString().split('T')[0],
      notes,
      status: 'applied',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, ...prev])
  }

  const updateStatus = (id, status) => {
    setJobs(prev => prev.map(j => j.id === id
      ? { ...j, status, updatedAt: new Date().toISOString() }
      : j
    ))
  }

  const update = (id, updates) => {
    setJobs(prev => prev.map(j => j.id === id
      ? { ...j, ...updates, updatedAt: new Date().toISOString() }
      : j
    ))
  }

  const remove = (id) => setJobs(prev => prev.filter(j => j.id !== id))

  const byStatus = (statusId) => jobs.filter(j => j.status === statusId)
  const active = jobs.filter(j => !['rejected', 'withdrawn'].includes(j.status))

  return { jobs, add, updateStatus, update, remove, byStatus, active }
}
