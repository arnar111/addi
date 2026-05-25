import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Wallet, FileText, Timer, ShoppingBag, Settings } from 'lucide-react'

const NAV = [
  { to: '/',        icon: LayoutDashboard, label: 'Mælaborð' },
  { to: '/tasks',   icon: CheckSquare,     label: 'Verkefni' },
  { to: '/finance', icon: Wallet,          label: 'Fjármál' },
  { to: '/lendo',   icon: ShoppingBag,     label: 'Lendó' },
  { to: '/notes',   icon: FileText,        label: 'Minnisblöð' },
  { to: '/timer',   icon: Timer,           label: 'Tímari' },
  { to: '/settings',icon: Settings,        label: 'Stillingar' },
]

export default function Sidebar() {
  return (
    <aside
      className="hidden md:flex flex-col w-56 shrink-0 h-screen sticky top-0 py-6 px-3"
      style={{ borderRight: '1px solid var(--border)', background: 'rgba(8,12,24,0.98)' }}
    >
      <div className="flex items-center gap-2.5 px-3 mb-8">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base"
          style={{ background: 'var(--accent)', color: '#000' }}
        >
          A
        </div>
        <div>
          <div className="font-semibold text-base leading-tight">Addi</div>
          <div className="text-xs leading-tight" style={{ color: 'var(--muted)' }}>Reykjavík</div>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5 flex-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[rgba(0,212,170,0.12)] text-[var(--accent)]'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface2)]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} strokeWidth={isActive ? 2.3 : 1.8} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 mt-4 text-xs" style={{ color: 'var(--muted)' }}>
        v1 · {new Date().toLocaleDateString('is-IS', { month: 'short', year: 'numeric' })}
      </div>
    </aside>
  )
}
