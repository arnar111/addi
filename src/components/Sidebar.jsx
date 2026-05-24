import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Wallet, FileText, Timer, Settings, Home } from 'lucide-react'

const NAV = [
  { to: '/',        icon: LayoutDashboard, label: 'Mælaborð',   emoji: null },
  { to: '/lendo',   icon: Home,            label: 'Lendó',       emoji: '🏠' },
  { to: '/sports',  icon: null,            label: 'Knattspyrna', emoji: '⚽' },
  { to: '/finance', icon: Wallet,          label: 'Fjármál',     emoji: null },
  { to: '/tasks',   icon: CheckSquare,     label: 'Verkefni',    emoji: null },
  { to: '/notes',   icon: FileText,        label: 'Minnisblöð',  emoji: null },
  { to: '/timer',   icon: Timer,           label: 'Tímari',      emoji: null },
  { to: '/settings',icon: Settings,        label: 'Stillingar',  emoji: null },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 h-screen sticky top-0 py-6 px-3"
           style={{ borderRight: '1px solid var(--border)', background: 'rgba(10,14,26,0.98)' }}>
      <div className="flex items-center gap-2 px-3 mb-8">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm"
             style={{ background: 'var(--accent)', color: '#000' }}>A</div>
        <span className="font-semibold text-lg" style={{ color: 'var(--text)' }}>Addi</span>
        <span className="text-xs ml-auto" style={{ color: 'var(--muted)' }}>v2</span>
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
                  ? <span style={{ fontSize: 16, width: 18, textAlign: 'center' }}>{emoji}</span>
                  : Icon && <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                }
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 text-xs" style={{ color: 'var(--muted)' }}>
        Addi · Reykjavík 🇮🇸
      </div>
    </aside>
  )
}
