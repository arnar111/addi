import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Wallet, FileText, Timer, Settings, CreditCard, Trophy, ShoppingCart, Sparkles } from 'lucide-react'
import { useSubscriptions } from '../hooks/useSubscriptions'
import { useLocalStorage } from '../hooks/useLocalStorage'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Mælaborð' },
  { to: '/tasks', icon: CheckSquare, label: 'Verkefni' },
  { to: '/finance', icon: Wallet, label: 'Fjármál' },
  { to: '/shopping', icon: ShoppingCart, label: 'Innkaup' },
  { to: '/habits', icon: Sparkles, label: 'Venjur' },
  { to: '/sports', icon: Trophy, label: 'Íþróttir' },
  { to: '/football', icon: Trophy, label: 'HM 2026' },
  { to: '/subs', icon: CreditCard, label: 'Áskriftir' },
  { to: '/notes', icon: FileText, label: 'Minnisblöð' },
  { to: '/timer', icon: Timer, label: 'Tímari' },
  { to: '/settings', icon: Settings, label: 'Stillingar' },
]

export default function Sidebar() {
  const { failing } = useSubscriptions()
  const [name] = useLocalStorage('addi_name', 'Addi')
  const [city] = useLocalStorage('addi_city', 'Reykjavík')

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 h-screen sticky top-0 py-6 px-3"
           style={{ borderRight: '1px solid var(--border)', background: 'rgba(10,14,26,0.98)' }}>
      <div className="flex items-center gap-2 px-3 mb-6">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm"
             style={{ background: 'var(--accent)', color: '#000' }}>A</div>
        <span className="font-semibold text-lg" style={{ color: 'var(--text)' }}>Addi</span>
        <span className="text-xs ml-auto px-1.5 py-0.5 rounded font-mono"
              style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>v1</span>
      </div>

      <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                isActive
                  ? 'bg-[rgba(0,212,170,0.12)] text-[var(--accent)]'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface2)]'
              }`
            }>
            {({ isActive }) => (
              <>
                <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
                {label}
                {to === '/subs' && failing.length > 0 && (
                  <span className="ml-auto w-5 h-5 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                        style={{ background: 'var(--danger)', fontSize: 10 }}>
                    {failing.length}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 text-xs mt-2" style={{ color: 'var(--muted)' }}>
        {name} · {city}
      </div>
    </aside>
  )
}
