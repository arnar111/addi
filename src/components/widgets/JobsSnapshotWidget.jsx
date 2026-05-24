import { useNavigate } from 'react-router-dom'
import { useJobs, JOB_STATUSES } from '../../hooks/useJobs'
import { ChevronRight, Briefcase } from 'lucide-react'

export default function JobsSnapshotWidget() {
  const navigate = useNavigate()
  const { stats, byStatus } = useJobs()
  const s = stats()

  const pills = [
    { label: 'Sótt um', val: byStatus('applied').length, color: '#3b82f6' },
    { label: 'Viðtal', val: s.interviews, color: '#f97316' },
    { label: 'Tilboð', val: s.offers, color: '#22c55e' },
  ]

  return (
    <button onClick={() => navigate('/jobs')} className="card w-full text-left transition-all hover:border-purple-500/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(139,92,246,0.15)' }}>
            <Briefcase size={16} style={{ color: 'var(--accent2)' }} />
          </div>
          <div>
            <div className="text-sm font-medium">Starfsleit</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>
              {s.total === 0 ? 'Engar umsóknir' : `${s.active} virkar umsóknir`}
            </div>
          </div>
        </div>
        <ChevronRight size={14} style={{ color: 'var(--muted)' }} />
      </div>

      {s.total > 0 ? (
        <div className="flex gap-3">
          {pills.map(p => (
            <div key={p.label} className="flex items-center gap-1.5">
              <span className="text-sm font-semibold" style={{ color: p.color }}>{p.val}</span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{p.label}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs" style={{ color: 'var(--muted)' }}>
          Fylgstu með starfsumsóknum þínum
        </div>
      )}
    </button>
  )
}
