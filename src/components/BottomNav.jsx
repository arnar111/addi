import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Wallet, CreditCard, FileText } from 'lucide-react'
import { useSubscriptions } from '../hooks/useSubscriptions'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Heim' },
  { to: '/tasks', icon: CheckSquare, label: 'Verkefni' },
  { to: '/finance', icon: Wallet, label: 'Fjármál' },
  { to: '/subscriptions', icon: CreditCard, label: 'Áskriftir' },
  { to: '/notes', icon: FileText, label: 'Minnisblöð' },
]

export default function BottomNav() {
  const { upcomingRenewals } = useSubscriptions()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom md:hidden"
      style={{ background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--border)' }}>
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all relative ${
                isActive ? 'text-[var(--accent)]' : 'text-[var(--muted)]'
              }`
            }>
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[rgba(0,212,170,0.15)]' : ''}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  {to === '/subscriptions' && upcomingRenewals.length > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: '#f97316', color: '#fff', fontSize: 9 }}>
                      {upcomingRenewals.length}
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
