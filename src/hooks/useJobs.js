import { useLocalStorage } from './useLocalStorage'

export const JOB_STATUS_CONFIG = {
  sent:      { label: 'Sent',        color: '#3b82f6', bg: 'rgba(59,130,246,0.12)'  },
  interview: { label: 'Viðtal',      color: '#f97316', bg: 'rgba(249,115,22,0.12)'  },
  offer:     { label: 'Tilboð',      color: '#22c55e', bg: 'rgba(34,197,94,0.12)'   },
  rejected:  { label: 'Hafnað',      color: '#ef4444', bg: 'rgba(239,68,68,0.12)'   },
  withdrawn: { label: 'Afturkallað', color: '#64748b', bg: 'rgba(100,116,139,0.12)' },
}

export const JOB_SOURCE_CONFIG = {
  linkedin:  { label: 'LinkedIn',   color: '#0a66c2' },
  glassdoor: { label: 'Glassdoor',  color: '#0caa41' },
  alfred:    { label: 'Alfred.is',  color: '#ff6b6b' },
  direct:    { label: 'Beint',      color: '#8b5cf6' },
  other:     { label: 'Annað',      color: '#64748b' },
}

export function useJobs() {
  const [jobs, setJobs] = useLocalStorage('addi_jobs', [])

  const add = (data) => {
    setJobs(prev => [{
      id: Date.now().toString(),
      company:   data.company  || '',
      role:      data.role     || '',
      source:    data.source   || 'linkedin',
      status:    'sent',
      url:       data.url      || '',
      salary:    data.salary   || '',
      notes:     data.notes    || '',
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, ...prev])
  }

  const updateStatus = (id, status) => {
    setJobs(prev => prev.map(j =>
      j.id === id ? { ...j, status, updatedAt: new Date().toISOString() } : j
    ))
  }

  const update = (id, updates) => {
    setJobs(prev => prev.map(j =>
      j.id === id ? { ...j, ...updates, updatedAt: new Date().toISOString() } : j
    ))
  }

  const remove = (id) => setJobs(prev => prev.filter(j => j.id !== id))

  const stats = {
    total:      jobs.length,
    active:     jobs.filter(j => !['rejected', 'withdrawn'].includes(j.status)).length,
    interviews: jobs.filter(j => j.status === 'interview').length,
    offers:     jobs.filter(j => j.status === 'offer').length,
  }

  return { jobs, add, update, updateStatus, remove, stats }
}
