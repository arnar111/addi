import { useLocalStorage } from './useLocalStorage'

export const JOB_STATUSES = ['Áhugi', 'Sótt', 'Viðtal', 'Tilboð', 'Hafnað', 'Samþykkt']

export const STATUS_META = {
  'Áhugi':    { color: '#64748b', bg: 'rgba(100,116,139,0.12)', icon: '🔖' },
  'Sótt':     { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  icon: '📤' },
  'Viðtal':   { color: '#f97316', bg: 'rgba(249,115,22,0.12)',  icon: '💬' },
  'Tilboð':   { color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   icon: '🎉' },
  'Hafnað':   { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   icon: '❌' },
  'Samþykkt': { color: '#00d4aa', bg: 'rgba(0,212,170,0.12)',   icon: '✅' },
}

export function useJobs() {
  const [jobs, setJobs] = useLocalStorage('addi_jobs', [])

  const add = ({ company, role, url = '', note = '', platform = '' }) => {
    setJobs(prev => [{
      id: Date.now().toString(),
      company,
      role,
      url,
      note,
      platform,
      status: 'Sótt',
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, ...prev])
  }

  const updateStatus = (id, status) =>
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status, updatedAt: new Date().toISOString() } : j))

  const update = (id, updates) =>
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...updates, updatedAt: new Date().toISOString() } : j))

  const remove = (id) => setJobs(prev => prev.filter(j => j.id !== id))

  const active = jobs.filter(j => !['Hafnað', 'Samþykkt'].includes(j.status))
  const archived = jobs.filter(j => ['Hafnað', 'Samþykkt'].includes(j.status))

  const countByStatus = (status) => jobs.filter(j => j.status === status).length

  return { jobs, add, update, updateStatus, remove, active, archived, countByStatus }
}
