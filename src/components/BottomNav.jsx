import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Wallet, FileText, Trophy } from 'lucide-react'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Heim' },
  { to: '/tasks', icon: CheckSquare, label: 'Verkefni' },
  { to: '/sports', icon: Trophy, label: 'Sport' },
  { to: '/finance', icon: Wallet, label: 'Fjármál' },
  { to: '/notes', icon: FileText, label: 'Minnisblöð' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
         style={{
           background: 'rgba(8,12,24,0.92)',
           backdropFilter: 'blur(24px)',
           WebkitBackdropFilter: 'blur(24px)',
           borderTop: '1px solid var(--border)',
           paddingBottom: 'env(safe-area-inset-bottom, 8px)',
         }}>
      <div className="flex items-center justify-around px-1 pt-1.5 pb-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 transition-all ${
                isActive ? 'text-[var(--accent)]' : 'text-[var(--muted)]'
              }`
            }>
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[rgba(0,212,170,0.15)]' : ''}`}>
                  <Icon size={21} strokeWidth={isActive ? 2.4 : 1.7} />
                </div>
                <span className="font-medium" style={{ fontSize: 9.5 }}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
