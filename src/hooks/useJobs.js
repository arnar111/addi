import { useLocalStorage } from './useLocalStorage'

export const JOB_STATUSES = [
  { id: 'applied', label: 'Sótt um', color: '#3b82f6', icon: '📤' },
  { id: 'replied', label: 'Svar fengið', color: '#8b5cf6', icon: '📩' },
  { id: 'interview', label: 'Viðtal', color: '#f97316', icon: '🤝' },
  { id: 'offer', label: 'Boð', color: '#22c55e', icon: '🎉' },
  { id: 'rejected', label: 'Hafnað', color: '#ef4444', icon: '❌' },
]

export const JOB_SOURCES = ['Alfred.is', 'LinkedIn', 'Glassdoor', 'Beint', 'Annað']

export function useJobs() {
  const [jobs, setJobs] = useLocalStorage('addi_jobs', [])

  const add = ({ title, company, source = 'LinkedIn', link = '', notes = '', status = 'applied' }) => {
    setJobs(prev => [{
      id: Date.now().toString(),
      title,
      company,
      source,
      link,
      notes,
      status,
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, ...prev])
  }

  const updateStatus = (id, status) => {
    setJobs(prev => prev.map(j =>
      j.id === id ? { ...j, status, updatedAt: new Date().toISOString() } : j
    ))
  }

  const updateNotes = (id, notes) => {
    setJobs(prev => prev.map(j =>
      j.id === id ? { ...j, notes, updatedAt: new Date().toISOString() } : j
    ))
  }

  const remove = (id) => setJobs(prev => prev.filter(j => j.id !== id))

  const byStatus = (status) => jobs.filter(j => j.status === status)
  const active = jobs.filter(j => !['rejected'].includes(j.status))

  return { jobs, add, updateStatus, updateNotes, remove, byStatus, active }
}
