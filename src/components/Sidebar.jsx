import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Wallet, FileText, Timer, Settings, Trophy, Flame } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Mælaborð' },
  { to: '/sports', icon: Trophy, label: 'Íþróttir' },
  { to: '/golf', label: 'Golf', emoji: '⛳' },
  { to: '/tasks', icon: CheckSquare, label: 'Verkefni' },
  { to: '/finance', icon: Wallet, label: 'Fjármál' },
  { to: '/habits', icon: Flame, label: 'Vanur' },
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
        <span className="text-xs ml-auto" style={{ color: 'var(--muted)' }}>v1.1</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(({ to, icon: Icon, label, emoji }) => (
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
                {emoji
                  ? <span style={{ fontSize: 18, lineHeight: 1 }}>{emoji}</span>
                  : <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                }
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
