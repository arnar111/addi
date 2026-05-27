import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Wallet, FileText, Shirt } from 'lucide-react'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Heim' },
  { to: '/tasks', icon: CheckSquare, label: 'Verkefni' },
  { to: '/finance', icon: Wallet, label: 'Fjármál' },
  { to: '/football', icon: Shirt, label: 'Fótbolti' },
  { to: '/notes', icon: FileText, label: 'Minnisblöð' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-bottom"
         style={{ background: 'rgba(8,12,24,0.96)', backdropFilter: 'blur(24px)', borderTop: '1px solid var(--border)' }}>
      <div className="flex items-center justify-around px-1 pt-2 pb-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all ${
                isActive ? 'text-[var(--accent)]' : 'text-[var(--muted)]'
              }`
            }>
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[rgba(0,212,170,0.15)]' : ''}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span style={{ fontSize: 9 }}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
