import { Link } from 'react-router-dom'
import { Briefcase, FileText, Target, Timer, Settings, ChevronRight } from 'lucide-react'
import { useJobs } from '../hooks/useJobs'
import { useHabits } from '../hooks/useHabits'

const ITEMS = [
  { to: '/jobs', icon: Briefcase, label: 'Starfsleit', color: '#3b82f6' },
  { to: '/habits', icon: Target, label: 'Venjur', color: '#00d4aa' },
  { to: '/notes', icon: FileText, label: 'Minnisblöð', color: '#8b5cf6' },
  { to: '/timer', icon: Timer, label: 'Tímari', color: '#f97316' },
  { to: '/settings', icon: Settings, label: 'Stillingar', color: '#64748b' },
]

export default function More() {
  const { active: activeJobs } = useJobs()
  const { habits, todayDone } = useHabits()

  const badges = {
    '/jobs': activeJobs.length > 0 ? activeJobs.length : null,
    '/habits': habits.length > 0 ? `${todayDone}/${habits.length}` : null,
  }

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Fleiri</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Öll tæki og stillingar</p>
      </div>

      <div className="flex flex-col gap-2">
        {ITEMS.map(({ to, icon: Icon, label, color }) => (
          <Link key={to} to={to} className="card flex items-center gap-4"
                style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                 style={{ background: `${color}20` }}>
              <Icon size={20} style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">{label}</div>
            </div>
            {badges[to] && (
              <span className="badge text-xs"
                    style={{ background: `${color}20`, color }}>
                {badges[to]}
              </span>
            )}
            <ChevronRight size={16} style={{ color: 'var(--muted)' }} />
          </Link>
        ))}
      </div>
    </div>
  )
}
