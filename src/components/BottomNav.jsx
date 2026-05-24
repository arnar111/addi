import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, Trophy, Wallet, CheckSquare } from 'lucide-react'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Heim' },
  { to: '/lendo', icon: Package, label: 'Lendó', activeColor: '#f97316' },
  { to: '/sports', icon: Trophy, label: 'Íþróttir', activeColor: '#22c55e' },
  { to: '/finance', icon: Wallet, label: 'Fjármál' },
  { to: '/tasks', icon: CheckSquare, label: 'Verkefni' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom md:hidden"
         style={{ background: 'rgba(10,14,26,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--border)' }}>
      <div className="flex items-center justify-around px-1 pt-2 pb-1">
        {NAV.map(({ to, icon: Icon, label, activeColor }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${
                isActive ? '' : 'text-[var(--muted)]'
              }`
            }
            style={({ isActive }) => isActive ? { color: activeColor || 'var(--accent)' } : {}}>
            {({ isActive }) => (
              <>
                <div className="p-1.5 rounded-xl transition-all"
                     style={isActive ? { background: `${activeColor || 'var(--accent)'}20` } : {}}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span style={{ fontSize: 10 }}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
