import { useLocalStorage } from './useLocalStorage'

export const JOB_STATUSES = [
  { id: 'wishlist', label: 'Óskari', color: '#64748b', emoji: '⭐' },
  { id: 'applied', label: 'Sótt um', color: '#3b82f6', emoji: '📤' },
  { id: 'interview', label: 'Viðtal', color: '#f97316', emoji: '🎯' },
  { id: 'offer', label: 'Tilboð', color: '#22c55e', emoji: '🎉' },
  { id: 'rejected', label: 'Hafnað', color: '#ef4444', emoji: '✕' },
]

export function useJobs() {
  const [jobs, setJobs] = useLocalStorage('addi_jobs', [])

  const addJob = ({ company, role, url = '', notes = '', status = 'applied', location = '' }) => {
    setJobs(prev => [{
      id: Date.now().toString(),
      company, role, url, notes, status, location,
      appliedDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, ...prev])
  }

  const updateStatus = (id, status) => {
    setJobs(prev => prev.map(j => j.id === id
      ? { ...j, status, updatedAt: new Date().toISOString() }
      : j))
  }

  const updateNotes = (id, notes) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, notes } : j))
  }

  const removeJob = (id) => setJobs(prev => prev.filter(j => j.id !== id))

  const byStatus = (statusId) => jobs.filter(j => j.status === statusId)

  const stats = () => ({
    total: jobs.length,
    active: jobs.filter(j => !['rejected'].includes(j.status)).length,
    interviews: byStatus('interview').length,
    offers: byStatus('offer').length,
    rejected: byStatus('rejected').length,
  })

  return { jobs, addJob, updateStatus, updateNotes, removeJob, byStatus, stats }
}
