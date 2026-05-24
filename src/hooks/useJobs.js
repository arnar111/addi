import { useLocalStorage } from './useLocalStorage'

export const JOB_STATUSES = [
  { id: 'spotted',   label: 'Áhugi',      color: '#64748b', bg: 'rgba(100,116,139,0.15)' },
  { id: 'applied',   label: 'Sótt',       color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  { id: 'interview', label: 'Viðtal',     color: '#f97316', bg: 'rgba(249,115,22,0.15)' },
  { id: 'offer',     label: 'Tilboð',     color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
  { id: 'rejected',  label: 'Hafnað',     color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
]

const SEED = [
  { id: '1', company: 'Origo', role: 'Engineering Manager', location: 'Reykjavík', salary: '700.000 ISK', status: 'spotted', date: '2026-05-20', notes: '', url: '' },
  { id: '2', company: 'CCP Games', role: 'Product Manager', location: 'Reykjavík', salary: '', status: 'applied', date: '2026-05-18', notes: 'Sent CV via LinkedIn', url: '' },
  { id: '3', company: 'Íslandsbanki', role: 'Department Manager', location: 'Reykjavík', salary: '850.000 ISK', status: 'interview', date: '2026-05-15', notes: 'First interview May 22', url: '' },
]

export function useJobs() {
  const [jobs, setJobs] = useLocalStorage('addi_jobs', SEED)

  const add = (data) => {
    setJobs(prev => [...prev, { id: Date.now().toString(), date: new Date().toISOString().split('T')[0], ...data }])
  }

  const update = (id, data) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...data } : j))
  }

  const remove = (id) => {
    setJobs(prev => prev.filter(j => j.id !== id))
  }

  const byStatus = (statusId) => jobs.filter(j => j.status === statusId)

  const stats = {
    total: jobs.length,
    active: jobs.filter(j => !['rejected'].includes(j.status)).length,
    interviews: jobs.filter(j => j.status === 'interview').length,
    offers: jobs.filter(j => j.status === 'offer').length,
  }

  return { jobs, add, update, remove, byStatus, stats }
}
