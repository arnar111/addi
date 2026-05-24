import { useLocalStorage } from './useLocalStorage'

export const JOB_STATUSES = [
  { id: 'sent', label: 'Sent', color: '#3b82f6', icon: '📤' },
  { id: 'interview', label: 'Viðtal', color: '#f97316', icon: '📞' },
  { id: 'offer', label: 'Tilboð', color: '#22c55e', icon: '🎉' },
  { id: 'rejected', label: 'Hafnað', color: '#ef4444', icon: '❌' },
  { id: 'withdrawn', label: 'Dregið til baka', color: '#64748b', icon: '↩️' },
]

export function useJobs() {
  const [applications, setApplications] = useLocalStorage('addi_jobs', [])

  const add = ({ company, role, url, location, salary, note, appliedDate }) => {
    setApplications(prev => [{
      id: Date.now().toString(),
      company: company || '',
      role: role || '',
      url: url || '',
      location: location || '',
      salary: salary || '',
      note: note || '',
      status: 'sent',
      appliedDate: appliedDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    }, ...prev])
  }

  const remove = (id) => setApplications(prev => prev.filter(a => a.id !== id))

  const updateStatus = (id, status) =>
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a))

  const update = (id, data) =>
    setApplications(prev => prev.map(a => a.id === id ? { ...a, ...data } : a))

  const byStatus = (status) => applications.filter(a => a.status === status)

  const active = applications.filter(a => !['rejected', 'withdrawn'].includes(a.status))

  return { applications, add, remove, updateStatus, update, byStatus, active, STATUSES: JOB_STATUSES }
}
