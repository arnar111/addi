import { Link } from 'react-router-dom'
import { useJobs, JOB_STATUSES } from '../../hooks/useJobs'
import { ChevronRight, Briefcase } from 'lucide-react'

export default function JobsSnapshotWidget() {
  const { active, byStatus } = useJobs()

  const interviews = byStatus('interview').length
  const applied = byStatus('applied').length

  if (active.length === 0) {
    return (
      <Link to="/jobs" className="card flex items-center gap-3 no-underline">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
             style={{ background: 'rgba(59,130,246,0.12)' }}>
          <Briefcase size={18} style={{ color: '#3b82f6' }} />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm">Starfsleit</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>Byrjaðu að skrá umsóknir</div>
        </div>
        <ChevronRight size={16} style={{ color: 'var(--muted)' }} />
      </Link>
    )
  }

  return (
    <Link to="/jobs" className="card no-underline" style={{
      background: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(139,92,246,0.04))',
    }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm flex items-center gap-1.5">
          <Briefcase size={14} style={{ color: '#3b82f6' }} /> Starfsleit
        </h3>
        <ChevronRight size={14} style={{ color: 'var(--muted)' }} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {JOB_STATUSES.filter(s => s.id !== 'rejected').map(s => {
          const count = byStatus(s.id).length
          return (
            <div key={s.id} className="flex flex-col items-center gap-0.5 py-2 rounded-xl"
                 style={{ background: count > 0 ? `${s.color}12` : 'var(--surface2)' }}>
              <span className="text-xs">{s.icon}</span>
              <span className="text-lg font-bold" style={{ color: count > 0 ? s.color : 'var(--muted)' }}>{count}</span>
              <span className="text-xs text-center" style={{ color: 'var(--muted)', fontSize: 10 }}>{s.label}</span>
            </div>
          )
        })}
      </div>
      {interviews > 0 && (
        <div className="mt-2 text-xs text-center font-medium" style={{ color: '#f97316' }}>
          🤝 {interviews} viðtal{interviews !== 1 ? 'i' : ''} á dagskrá!
        </div>
      )}
    </Link>
  )
}
