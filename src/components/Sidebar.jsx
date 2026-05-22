import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Wallet, FileText, Timer, Settings, ShoppingCart, Trophy, CreditCard } from 'lucide-react'
import { useSubscriptions } from '../hooks/useSubscriptions'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Mælaborð' },
  { to: '/tasks', icon: CheckSquare, label: 'Verkefni' },
  { to: '/finance', icon: Wallet, label: 'Fjármál' },
  { to: '/subscriptions', icon: CreditCard, label: 'Áskriftir', showBadge: true },
  { to: '/sports', icon: Trophy, label: 'Íþróttir' },
  { to: '/shopping', icon: ShoppingCart, label: 'Innkaup' },
  { to: '/notes', icon: FileText, label: 'Minnisblöð' },
  { to: '/timer', icon: Timer, label: 'Tímari' },
]

export default function Sidebar() {
  const { failedSubs } = useSubscriptions()
  return (
    <aside
      className="hidden md:flex flex-col w-56 shrink-0 h-screen sticky top-0 py-6 px-3"
      style={{ borderRight: '1px solid var(--border)', background: 'rgba(10,14,26,0.98)' }}
    >
      <div className="flex items-center gap-2 px-3 mb-8">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm"
          style={{ background: 'var(--accent)', color: '#000' }}
        >A</div>
        <span className="font-semibold text-lg" style={{ color: 'var(--text)' }}>Addi</span>
        <span className="text-xs ml-auto" style={{ color: 'var(--muted)' }}>v2</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(({ to, icon: Icon, label, showBadge }) => (
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
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                <span className="flex-1">{label}</span>
                {showBadge && failedSubs.length > 0 && (
                  <span className="w-4 h-4 rounded-full flex items-center justify-center font-bold"
                        style={{ background: 'var(--danger)', color: '#fff', fontSize: 9 }}>
                    {failedSubs.length}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            isActive
              ? 'text-[var(--accent)]'
              : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface2)]'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Settings size={18} strokeWidth={isActive ? 2.2 : 1.8} />
            Stillingar
          </>
        )}
      </NavLink>

      <div className="px-3 mt-3 text-xs" style={{ color: 'var(--muted)' }}>
        Arnar · Reykjavík 🇮🇸
      </div>
    </aside>
  )
}
