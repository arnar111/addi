import { useLocalStorage } from './useLocalStorage'

export const JOB_STATUSES = [
  { id: 'sent', label: 'Sent', color: '#3b82f6', icon: '📤' },
  { id: 'interview', label: 'Í viðtali', color: '#f97316', icon: '🎯' },
  { id: 'offer', label: 'Tilboð', color: '#22c55e', icon: '🎉' },
  { id: 'rejected', label: 'Hafnað', color: '#ef4444', icon: '✕' },
]

export function useJobs() {
  const [applications, setApplications] = useLocalStorage('addi_jobs', [])

  const add = (company, role, url = '', notes = '') => {
    setApplications(prev => [{
      id: Date.now().toString(),
      company,
      role,
      url,
      notes,
      status: 'sent',
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, ...prev])
  }

  const updateStatus = (id, status) => {
    setApplications(prev =>
      prev.map(a => a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a)
    )
  }

  const update = (id, fields) => {
    setApplications(prev =>
      prev.map(a => a.id === id ? { ...a, ...fields, updatedAt: new Date().toISOString() } : a)
    )
  }

  const remove = id => setApplications(prev => prev.filter(a => a.id !== id))

  const byStatus = status => applications.filter(a => a.status === status)

  const stats = JOB_STATUSES.reduce((acc, s) => {
    acc[s.id] = byStatus(s.id).length
    return acc
  }, {})

  return { applications, add, updateStatus, update, remove, byStatus, stats }
}
