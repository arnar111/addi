import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Trophy, Wallet, Rocket, CheckSquare, FileText, Timer, Settings } from 'lucide-react'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Mælaborð' },
  { to: '/sport', icon: Trophy, label: 'Íþróttir' },
  { to: '/finance', icon: Wallet, label: 'Fjármál' },
  { to: '/projects', icon: Rocket, label: 'Verkefni' },
  { to: '/tasks', icon: CheckSquare, label: 'Listar' },
  { to: '/notes', icon: FileText, label: 'Minnisblöð' },
  { to: '/timer', icon: Timer, label: 'Tímari' },
  { to: '/settings', icon: Settings, label: 'Stillingar' },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 h-screen sticky top-0 py-6 px-3"
           style={{ borderRight: '1px solid var(--border)', background: 'rgba(10,14,26,0.98)' }}>
      <div className="flex items-center gap-2 px-3 mb-8">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm"
             style={{ background: 'var(--accent)', color: '#000' }}>A</div>
        <span className="font-semibold text-lg" style={{ color: 'var(--text)' }}>Addi</span>
        <span className="text-xs ml-auto px-1.5 py-0.5 rounded-md"
              style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)', fontSize: 10 }}>v1</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[rgba(0,212,170,0.12)] text-[var(--accent)]'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface2)]'
              }`
            }>
            {({ isActive }) => (
              <>
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 text-xs" style={{ color: 'var(--muted)' }}>
        Addi · Garðabær
      </div>
    </aside>
  )
}
