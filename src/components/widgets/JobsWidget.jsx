import { Link } from 'react-router-dom'
import { useJobs, JOB_STATUSES } from '../../hooks/useJobs'
import { ChevronRight, Briefcase } from 'lucide-react'

export default function JobsWidget() {
  const { jobs, stats } = useJobs()

  const interviews = jobs.filter(j => j.status === 'interview')
  const recent = [...jobs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3)

  return (
    <Link to="/jobs" className="card block" style={{ textDecoration: 'none' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Briefcase size={15} style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-semibold">Starf</span>
        </div>
        <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--accent)' }}>
          <span>Sjá allt</span>
          <ChevronRight size={12} />
        </div>
      </div>

      {/* Mini pipeline */}
      <div className="flex gap-1 mb-3">
        {JOB_STATUSES.filter(s => s.id !== 'rejected').map(s => {
          const count = jobs.filter(j => j.status === s.id).length
          return (
            <div key={s.id} className="flex-1 text-center py-1.5 rounded-lg"
                 style={{ background: count > 0 ? s.bg : 'var(--surface2)' }}>
              <div className="text-sm font-bold" style={{ color: count > 0 ? s.color : 'var(--muted)' }}>{count}</div>
              <div className="text-xs" style={{ color: 'var(--muted)', fontSize: 9 }}>{s.label}</div>
            </div>
          )
        })}
      </div>

      {interviews.length > 0 && (
        <div className="text-xs px-2 py-1.5 rounded-xl"
             style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316' }}>
          🎯 {interviews.map(j => j.company).join(', ')} — viðtal í gangi
        </div>
      )}

      {stats.total === 0 && (
        <div className="text-xs text-center py-2" style={{ color: 'var(--muted)' }}>
          Byrjaðu að fylgjast með umsóknum
        </div>
      )}
    </Link>
  )
}
