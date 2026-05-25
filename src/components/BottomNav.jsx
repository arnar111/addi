import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Wallet, FileText, ShoppingBag } from 'lucide-react'

const NAV = [
  { to: '/',        icon: LayoutDashboard, label: 'Heim' },
  { to: '/tasks',   icon: CheckSquare,     label: 'Verkefni' },
  { to: '/finance', icon: Wallet,          label: 'Fjármál' },
  { to: '/lendo',   icon: ShoppingBag,     label: 'Lendó' },
  { to: '/notes',   icon: FileText,        label: 'Minnisblöð' },
]

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-bottom"
      style={{
        background: 'rgba(8,12,24,0.96)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div className="flex items-center justify-around px-1 pt-2 pb-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all min-w-[52px] ${
                isActive ? 'text-[var(--accent)]' : 'text-[var(--muted)]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className="p-1.5 rounded-xl transition-all"
                  style={{ background: isActive ? 'rgba(0,212,170,0.14)' : 'transparent' }}
                >
                  <Icon size={21} strokeWidth={isActive ? 2.4 : 1.7} />
                </div>
                <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400 }}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
