import { useLocalStorage } from './useLocalStorage'

export const JOB_STATUSES = {
  wishlist: { label: 'Listi', color: '#64748b', emoji: '📋' },
  applied: { label: 'Sókt', color: '#3b82f6', emoji: '📤' },
  interview: { label: 'Viðtal', color: '#f97316', emoji: '🎤' },
  offer: { label: 'Tilboð', color: '#22c55e', emoji: '🎉' },
  rejected: { label: 'Hafnað', color: '#ef4444', emoji: '❌' },
}

export function useJobs() {
  const [jobs, setJobs] = useLocalStorage('addi_jobs', [])

  function addJob(job) {
    setJobs(prev => [
      {
        id: Date.now(),
        title: '',
        company: '',
        location: '',
        salary: '',
        url: '',
        status: 'wishlist',
        notes: '',
        appliedAt: null,
        createdAt: new Date().toISOString(),
        ...job,
      },
      ...prev
    ])
  }

  function updateJob(id, updates) {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j))
  }

  function removeJob(id) {
    setJobs(prev => prev.filter(j => j.id !== id))
  }

  function setStatus(id, status) {
    setJobs(prev => prev.map(j =>
      j.id === id
        ? { ...j, status, appliedAt: status === 'applied' && !j.appliedAt ? new Date().toISOString() : j.appliedAt }
        : j
    ))
  }

  const byStatus = Object.keys(JOB_STATUSES).reduce((acc, key) => {
    acc[key] = jobs.filter(j => j.status === key)
    return acc
  }, {})

  return { jobs, byStatus, addJob, updateJob, removeJob, setStatus }
}
