import { useLocalStorage } from './useLocalStorage'

export const JOB_STATUSES = ['Sótt um', 'Í vinnslu', 'Viðtal', 'Bjóð', 'Hafnað']

export const STATUS_COLORS = {
  'Sótt um': '#3b82f6',
  'Í vinnslu': '#f97316',
  'Viðtal': '#8b5cf6',
  'Bjóð': '#22c55e',
  'Hafnað': '#64748b',
}

export function useJobs() {
  const [jobs, setJobs] = useLocalStorage('addi_jobs', [])

  const addJob = (job) =>
    setJobs(prev => [{ ...job, id: Date.now().toString(), createdAt: new Date().toISOString() }, ...prev])

  const removeJob = (id) => setJobs(prev => prev.filter(j => j.id !== id))

  const updateStatus = (id, status) =>
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status, updatedAt: new Date().toISOString() } : j))

  const byStatus = () =>
    JOB_STATUSES.reduce((acc, s) => ({ ...acc, [s]: jobs.filter(j => j.status === s) }), {})

  const active = jobs.filter(j => j.status !== 'Hafnað')
  const interviews = jobs.filter(j => j.status === 'Viðtal')
  const offers = jobs.filter(j => j.status === 'Bjóð')

  return { jobs, addJob, removeJob, updateStatus, byStatus, active, interviews, offers }
}
