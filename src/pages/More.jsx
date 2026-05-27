import { NavLink } from 'react-router-dom'
import { CheckSquare, FileText, Timer, Settings, ChevronRight } from 'lucide-react'

const ITEMS = [
  { to: '/tasks', icon: CheckSquare, label: 'Verkefni', desc: 'Gæðaverkefni og markmið', color: 'var(--accent)' },
  { to: '/notes', icon: FileText, label: 'Minnisblöð', desc: 'Hugmyndir og glósur', color: 'var(--accent2)' },
  { to: '/timer', icon: Timer, label: 'Tímari', desc: 'Pomodoro og hlé', color: 'var(--accent3)' },
  { to: '/settings', icon: Settings, label: 'Stillingar', desc: 'Sérsníða Addi', color: 'var(--muted)' },
]

export default function More() {
  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <div className="px-1 pt-2">
        <h1 className="text-xl font-semibold">Meira</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Öll verkfæri</p>
      </div>
      <div className="flex flex-col gap-2">
        {ITEMS.map(item => (
          <NavLink key={item.to} to={item.to}
            className="card flex items-center gap-4 py-3.5 active:scale-98 transition-transform">
            {({ isActive }) => (
              <>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                     style={{ background: `${item.color}18` }}>
                  <item.icon size={22} style={{ color: item.color }} strokeWidth={1.8} />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{item.desc}</div>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--muted)' }} />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
