import { useLocalStorage } from './useLocalStorage'

export const JOB_STATUSES = [
  { id: 'sent', label: 'Sent', icon: '📤', color: '#3b82f6' },
  { id: 'interview', label: 'Viðtal', icon: '💼', color: '#f97316' },
  { id: 'offered', label: 'Boð', icon: '🎉', color: '#22c55e' },
  { id: 'rejected', label: 'Synjað', icon: '❌', color: '#ef4444' },
  { id: 'archived', label: 'Geymt', icon: '📦', color: '#64748b' },
]

export function useJobs() {
  const [jobs, setJobs] = useLocalStorage('addi_jobs', [])

  const add = ({ company, role, salary, location, link, notes, status = 'sent' }) => {
    setJobs(prev => [{
      id: Date.now().toString(),
      company,
      role,
      salary: salary ? Number(salary) : null,
      location,
      link,
      notes,
      status,
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, ...prev])
  }

  const updateStatus = (id, status) => {
    setJobs(prev => prev.map(j => j.id === id
      ? { ...j, status, updatedAt: new Date().toISOString() }
      : j
    ))
  }

  const update = (id, fields) => {
    setJobs(prev => prev.map(j => j.id === id
      ? { ...j, ...fields, updatedAt: new Date().toISOString() }
      : j
    ))
  }

  const remove = (id) => setJobs(prev => prev.filter(j => j.id !== id))

  const active = jobs.filter(j => j.status !== 'archived' && j.status !== 'rejected')
  const byStatus = (s) => jobs.filter(j => j.status === s)

  return { jobs, add, update, updateStatus, remove, active, byStatus }
}
