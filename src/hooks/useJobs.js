import { useLocalStorage } from './useLocalStorage'

export const STATUSES = ['applied', 'phone', 'interview', 'offer', 'rejected']

export const STATUS_LABEL = {
  applied: 'Sótt um',
  phone: 'Símtal',
  interview: 'Viðtal',
  offer: 'Boð',
  rejected: 'Hafnað',
}

export const STATUS_COLOR = {
  applied: '#3b82f6',
  phone: '#8b5cf6',
  interview: '#f97316',
  offer: '#22c55e',
  rejected: '#64748b',
}

export function useJobs() {
  const [jobs, setJobs] = useLocalStorage('addi_jobs', [])

  const add = (company, role, url = '', notes = '') => {
    setJobs(prev => [{
      id: Date.now().toString(),
      company: company.trim(),
      role: role.trim(),
      url: url.trim(),
      notes: notes.trim(),
      status: 'applied',
      date: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, ...prev])
  }

  const updateStatus = (id, status) => {
    setJobs(prev => prev.map(j =>
      j.id === id ? { ...j, status, updatedAt: new Date().toISOString() } : j
    ))
  }

  const update = (id, changes) => {
    setJobs(prev => prev.map(j =>
      j.id === id ? { ...j, ...changes, updatedAt: new Date().toISOString() } : j
    ))
  }

  const remove = (id) => setJobs(prev => prev.filter(j => j.id !== id))

  const byStatus = (status) => jobs.filter(j => j.status === status)
  const active = jobs.filter(j => j.status !== 'rejected')

  return { jobs, add, update, updateStatus, remove, byStatus, active }
}
