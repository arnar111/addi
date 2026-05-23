import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Wallet, FileText, Timer, Settings, Dumbbell } from 'lucide-react'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Mælaborð' },
  { to: '/sports', icon: () => <span style={{ fontSize: 16 }}>⚽</span>, label: 'Íþróttir' },
  { to: '/tasks', icon: CheckSquare, label: 'Verkefni' },
  { to: '/finance', icon: Wallet, label: 'Fjármál' },
  { to: '/habits', icon: Dumbbell, label: 'Venjur' },
  { to: '/notes', icon: FileText, label: 'Minnisblöð' },
  { to: '/timer', icon: Timer, label: 'Tímari' },
  { to: '/settings', icon: Settings, label: 'Stillingar' },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 h-screen sticky top-0 py-6 px-3"
           style={{ borderRight: '1px solid var(--border)', background: 'rgba(10,14,26,0.98)' }}>
      <div className="flex items-center gap-2.5 px-3 mb-8">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base"
             style={{ background: 'var(--accent)', color: '#000' }}>A</div>
        <div>
          <div className="font-semibold text-base leading-tight" style={{ color: 'var(--text)' }}>Addi</div>
          <div className="text-xs leading-tight" style={{ color: 'var(--muted)' }}>Reykjavík</div>
        </div>
        <span className="text-xs ml-auto px-1.5 py-0.5 rounded-md font-medium"
              style={{ background: 'rgba(0,212,170,0.1)', color: 'var(--accent)' }}>v1</span>
      </div>

      <nav className="flex flex-col gap-0.5 flex-1">
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
                <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 text-xs flex items-center gap-2" style={{ color: 'var(--muted)' }}>
        <div className="w-1.5 h-1.5 rounded-full animate-pulse-soft" style={{ background: 'var(--success)' }} />
        Arnar · Reykjavík
      </div>
    </aside>
  )
}
