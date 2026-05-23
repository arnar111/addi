import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Wallet, FileText, Timer, Settings, CreditCard, Trophy } from 'lucide-react'
import { useSubscriptions } from '../hooks/useSubscriptions'

const NAV = [
  { to: '/',              icon: LayoutDashboard, label: 'Mælaborð' },
  { to: '/tasks',         icon: CheckSquare,     label: 'Verkefni' },
  { to: '/finance',       icon: Wallet,          label: 'Fjármál' },
  { to: '/subscriptions', icon: CreditCard,      label: 'Áskriftir' },
  { to: '/sports',        icon: Trophy,          label: 'Íþróttir' },
  { to: '/notes',         icon: FileText,        label: 'Minnisblöð' },
  { to: '/timer',         icon: Timer,           label: 'Tímari' },
  { to: '/settings',      icon: Settings,        label: 'Stillingar' },
]

export default function Sidebar() {
  const { warnings } = useSubscriptions()
  const warnCount = warnings().length

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 h-screen sticky top-0 py-6 px-3"
           style={{ borderRight: '1px solid var(--border)', background: 'rgba(10,14,26,0.98)' }}>
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 mb-8">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm"
             style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))', color: '#000' }}>A</div>
        <span className="font-semibold text-lg" style={{ color: 'var(--text)' }}>Addi</span>
        <span className="text-xs ml-auto px-1.5 py-0.5 rounded-md font-medium"
              style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)' }}>v2</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[rgba(0,212,170,0.12)] text-[var(--accent)]'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface2)]'
              }`
            }>
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                  {to === '/subscriptions' && warnCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-white flex items-center justify-center font-bold"
                          style={{ background: 'var(--danger)', fontSize: 8 }}>
                      {warnCount}
                    </span>
                  )}
                </div>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 text-xs" style={{ color: 'var(--muted)' }}>
        Arnar · Hafnarfjörður
      </div>
    </aside>
  )
}
