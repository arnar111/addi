import { Link } from 'react-router-dom'
import { useJobs, JOB_STATUSES } from '../../hooks/useJobs'
import { Briefcase, Plus } from 'lucide-react'

export default function JobsWidget() {
  const { jobs, stats, recent } = useJobs()

  const activeStatuses = ['saved', 'applied', 'interview', 'offer']
  const activeCount = activeStatuses.reduce((s, id) => s + (stats[id] || 0), 0)
  const interviewCount = stats.interview || 0
  const offerCount = stats.offer || 0

  if (jobs.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Briefcase size={14} style={{ color: 'var(--accent)' }} />
            <span className="text-sm font-semibold">Störf</span>
          </div>
          <Link to="/jobs" className="text-xs" style={{ color: 'var(--accent)' }}>Bæta við →</Link>
        </div>
        <p className="text-xs py-1" style={{ color: 'var(--muted)' }}>
          Byrjaðu að fylgjast með umsóknum þínum
        </p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Briefcase size={14} style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-semibold">Störf</span>
        </div>
        <Link to="/jobs" className="text-xs" style={{ color: 'var(--accent)' }}>Allt →</Link>
      </div>

      <div className="grid grid-cols-4 gap-1.5 mb-3">
        {JOB_STATUSES.filter(s => activeStatuses.includes(s.id)).map(s => (
          <div key={s.id} className="flex flex-col items-center gap-0.5 p-2 rounded-xl"
               style={{ background: stats[s.id] > 0 ? `${s.color}15` : 'var(--surface2)' }}>
            <span className="text-base leading-none">{s.icon}</span>
            <span className="text-sm font-bold" style={{ color: stats[s.id] > 0 ? s.color : 'var(--muted)' }}>
              {stats[s.id] || 0}
            </span>
            <span className="text-center leading-tight" style={{ fontSize: 9, color: 'var(--muted)' }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {recent.length > 0 && (
        <div className="flex flex-col gap-1">
          {recent.slice(0, 2).map(job => {
            const st = JOB_STATUSES.find(s => s.id === job.status)
            return (
              <div key={job.id} className="flex items-center gap-2">
                <span style={{ fontSize: 13 }}>{st?.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium truncate block">{job.company}</span>
                  <span className="text-xs truncate block" style={{ color: 'var(--muted)' }}>{job.title}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
