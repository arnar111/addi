import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Wallet, CreditCard, Trophy } from 'lucide-react'
import { useSubscriptions } from '../hooks/useSubscriptions'

const NAV = [
  { to: '/',              icon: LayoutDashboard, label: 'Heim' },
  { to: '/tasks',         icon: CheckSquare,     label: 'Verkefni' },
  { to: '/finance',       icon: Wallet,          label: 'Fjármál' },
  { to: '/subscriptions', icon: CreditCard,      label: 'Áskriftir' },
  { to: '/sports',        icon: Trophy,          label: 'Íþróttir' },
]

export default function BottomNav() {
  const { warnings } = useSubscriptions()
  const warnCount = warnings().length

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom md:hidden"
         style={{ background: 'rgba(10,14,26,0.97)', backdropFilter: 'blur(24px)', borderTop: '1px solid var(--border)' }}>
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                isActive ? 'text-[var(--accent)]' : 'text-[var(--muted)]'
              }`
            }>
            {({ isActive }) => (
              <>
                <div className={`relative p-1.5 rounded-xl transition-all ${isActive ? 'bg-[rgba(0,212,170,0.15)]' : ''}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  {to === '/subscriptions' && warnCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white flex items-center justify-center font-bold"
                          style={{ background: 'var(--danger)', fontSize: 9 }}>
                      {warnCount}
                    </span>
                  )}
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
