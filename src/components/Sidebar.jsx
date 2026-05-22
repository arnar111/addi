import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Wallet, FileText, Timer, Settings, Trophy } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Mælaborð' },
  { to: '/tasks', icon: CheckSquare, label: 'Verkefni' },
  { to: '/finance', icon: Wallet, label: 'Fjármál' },
  { to: '/sports', icon: Trophy, label: 'Íþróttir' },
  { to: '/notes', icon: FileText, label: 'Minnisblöð' },
  { to: '/timer', icon: Timer, label: 'Tímari' },
  { to: '/settings', icon: Settings, label: 'Stillingar' },
]

export default function Sidebar() {
  const [name] = useLocalStorage('addi_name', 'Arnar')
  const [city] = useLocalStorage('addi_city', 'Reykjavík')

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 h-screen sticky top-0 py-6 px-3"
           style={{ borderRight: '1px solid var(--border)', background: 'rgba(10,14,26,0.98)' }}>
      <div className="flex items-center gap-2 px-3 mb-8">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm"
             style={{ background: 'var(--accent)', color: '#000' }}>A</div>
        <span className="font-semibold text-lg" style={{ color: 'var(--text)' }}>Addi</span>
        <span className="text-xs ml-auto px-1.5 py-0.5 rounded-md"
              style={{ color: 'var(--accent)', background: 'rgba(0,212,170,0.12)', fontSize: 10 }}>v2</span>
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
        {name} · {city}
      </div>
    </aside>
  )
}
