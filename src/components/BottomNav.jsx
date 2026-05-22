import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Wallet, Home, Trophy } from 'lucide-react'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Heim' },
  { to: '/football', icon: Trophy, label: 'Fótbolti', activeColor: 'var(--accent)' },
  { to: '/finance', icon: Wallet, label: 'Fjármál' },
  { to: '/lendo', icon: Home, label: 'Lendó', activeColor: '#f97316' },
  { to: '/tasks', icon: CheckSquare, label: 'Verkefni' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom md:hidden"
         style={{ background: 'rgba(10,14,26,0.97)', backdropFilter: 'blur(24px)', borderTop: '1px solid var(--border)' }}>
      <div className="flex items-center justify-around px-1 pt-1.5 pb-1">
        {NAV.map(({ to, icon: Icon, label, activeColor }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all"
            style={({ isActive }) => ({
              color: isActive ? (activeColor || 'var(--accent)') : 'var(--muted)',
            })}>
            {({ isActive }) => (
              <>
                <div className="p-1.5 rounded-xl transition-all"
                     style={{ background: isActive ? `${(activeColor || 'var(--accent)')}22` : 'transparent' }}>
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
