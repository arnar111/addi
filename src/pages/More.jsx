import { Link } from 'react-router-dom'
import { FileText, Timer, Settings, Trophy } from 'lucide-react'

const SECTIONS = [
  { to: '/sports', icon: Trophy, label: 'Knattspyrna', emoji: '⚽', desc: 'HM 2026 · Leikar', color: '#f97316' },
  { to: '/notes', icon: FileText, label: 'Minnisblöð', emoji: '📝', desc: 'Glósur og minnisblöð', color: '#8b5cf6' },
  { to: '/timer', icon: Timer, label: 'Tímari', emoji: '⏱️', desc: 'Pomodoro · Einbeiting', color: '#3b82f6' },
  { to: '/settings', icon: Settings, label: 'Stillingar', emoji: '⚙️', desc: 'Prófíll og valkostir', color: '#64748b' },
]

export default function More() {
  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Meira</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Fleiri eiginleikar</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {SECTIONS.map(({ to, icon: Icon, label, emoji, desc, color }) => (
          <Link key={to} to={to}
            className="card flex flex-col gap-3 active:scale-95 transition-transform"
            style={{ textDecoration: 'none' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: `${color}18` }}>
              {emoji}
            </div>
            <div>
              <div className="font-semibold text-sm">{label}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
