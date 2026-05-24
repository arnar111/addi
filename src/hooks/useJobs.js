import { useLocalStorage } from './useLocalStorage'

const DEMO_JOBS = [
  {
    id: '1',
    company: 'Origo Iceland',
    title: 'Engineering Manager',
    status: 'applied',
    date: '2026-05-20',
    url: 'https://alfred.is',
    notes: 'Saw on LinkedIn',
    salary: '',
  },
  {
    id: '2',
    company: 'Alvotech',
    title: 'Head of Quality Compliance',
    status: 'applied',
    date: '2026-05-22',
    url: 'https://alfred.is',
    notes: '',
    salary: '',
  },
]

export const JOB_STATUSES = [
  { id: 'applied', label: 'Sótt um', color: '#3b82f6', icon: '📤' },
  { id: 'phone', label: 'Símaviðtal', color: '#8b5cf6', icon: '📞' },
  { id: 'interview', label: 'Viðtal', color: '#f97316', icon: '🤝' },
  { id: 'offer', label: 'Boð fengið', color: '#22c55e', icon: '🎉' },
  { id: 'rejected', label: 'Hafnað', color: '#ef4444', icon: '❌' },
]

export function useJobs() {
  const [jobs, setJobs] = useLocalStorage('addi_jobs', DEMO_JOBS)

  const add = (company, title, status = 'applied', url = '', notes = '', salary = '') => {
    setJobs(prev => [{
      id: Date.now().toString(),
      company, title, status, url, notes, salary,
      date: new Date().toISOString().split('T')[0],
    }, ...prev])
  }

  const update = (id, changes) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...changes } : j))
  }

  const remove = (id) => {
    setJobs(prev => prev.filter(j => j.id !== id))
  }

  const byStatus = () => {
    const result = {}
    JOB_STATUSES.forEach(s => { result[s.id] = [] })
    jobs.forEach(j => {
      if (result[j.status]) result[j.status].push(j)
      else result['applied'].push(j)
    })
    return result
  }

  const activeCount = jobs.filter(j => j.status !== 'rejected').length

  return { jobs, add, update, remove, byStatus, activeCount }
}
