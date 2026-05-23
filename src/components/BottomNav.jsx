import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Wallet, Trophy, CreditCard } from 'lucide-react'
import { useSubscriptions } from '../hooks/useSubscriptions'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Heim' },
  { to: '/sports', icon: Trophy, label: 'Íþróttir' },
  { to: '/finance', icon: Wallet, label: 'Fjármál' },
  { to: '/tasks', icon: CheckSquare, label: 'Verkefni' },
  { to: '/subs', icon: CreditCard, label: 'Áskriftir' },
]

export default function BottomNav() {
  const { alertSubs } = useSubscriptions()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom md:hidden"
         style={{ background: 'rgba(10,14,26,0.96)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--border)' }}>
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {NAV.map(({ to, icon: Icon, label }) => {
          const showBadge = to === '/subs' && alertSubs.length > 0
          return (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all relative ${
                  isActive ? 'text-[var(--accent)]' : 'text-[var(--muted)]'
                }`
              }>
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-xl transition-all relative ${isActive ? 'bg-[rgba(0,212,170,0.15)]' : ''}`}>
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                    {showBadge && (
                      <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                            style={{ background: 'var(--danger)', fontSize: 8, color: '#fff', fontWeight: 700 }}>
                        {alertSubs.length}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: 10 }}>{label}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
