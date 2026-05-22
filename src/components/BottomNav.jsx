import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Wallet, FileText, Package } from 'lucide-react'

const NAV = [
  { to: '/',        icon: LayoutDashboard, label: 'Heim' },
  { to: '/tasks',   icon: CheckSquare,     label: 'Verkefni' },
  { to: '/lendo',   icon: Package,         label: 'Lendó' },
  { to: '/finance', icon: Wallet,          label: 'Fjármál' },
  { to: '/notes',   icon: FileText,        label: 'Minnisblöð' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom"
         style={{ background: 'rgba(10,14,26,0.96)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--border)' }}>
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                isActive
                  ? to === '/lendo' ? 'text-[#f59e0b]' : 'text-[var(--accent)]'
                  : 'text-[var(--muted)]'
              }`
            }>
            {({ isActive }) => {
              const lendoActive = to === '/lendo' && isActive
              return (
                <>
                  <div className={`p-1.5 rounded-xl transition-all ${
                    lendoActive
                      ? 'bg-[rgba(245,158,11,0.15)]'
                      : isActive ? 'bg-[rgba(0,212,170,0.15)]' : ''
                  }`}>
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  </div>
                  <span style={{ fontSize: 10 }}>{label}</span>
                </>
              )
            }}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
