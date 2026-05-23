import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Trophy, GuitarIcon, Wallet, ShoppingCart } from 'lucide-react'

// Custom golf icon since lucide doesn't have one
function GolfIcon({ size = 20, strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 18v-8" />
      <path d="M12 10 L17 7 L12 4" />
      <ellipse cx="12" cy="20" rx="3" ry="1" />
    </svg>
  )
}

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Heim' },
  { to: '/sports', icon: Trophy, label: 'Sport' },
  { to: '/golf', icon: GolfIcon, label: 'Golf' },
  { to: '/finance', icon: Wallet, label: 'Fjármál' },
  { to: '/shopping', icon: ShoppingCart, label: 'Innkaup' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom md:hidden"
         style={{ background: 'rgba(10,14,26,0.96)', backdropFilter: 'blur(24px)', borderTop: '1px solid var(--border)' }}>
      <div className="flex items-center justify-around px-1 pt-2 pb-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                isActive ? 'text-[var(--accent)]' : 'text-[var(--muted)]'
              }`
            }>
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[rgba(0,212,170,0.15)]' : ''}`}>
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
