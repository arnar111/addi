import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Wallet, FileText, Timer, Settings, Flame, ShoppingCart, CreditCard, X } from 'lucide-react'
import { useSidebar } from '../context/SidebarContext'

const NAV_PRIMARY = [
  { to: '/', icon: LayoutDashboard, label: 'Mælaborð' },
  { to: '/tasks', icon: CheckSquare, label: 'Verkefni' },
  { to: '/finance', icon: Wallet, label: 'Fjármál' },
  { to: '/habits', icon: Flame, label: 'Vanur' },
  { to: '/notes', icon: FileText, label: 'Minnisblöð' },
]

const NAV_SECONDARY = [
  { to: '/shopping', icon: ShoppingCart, label: 'Innkaup' },
  { to: '/subscriptions', icon: CreditCard, label: 'Áskriftir' },
  { to: '/timer', icon: Timer, label: 'Tímari' },
]

export default function Sidebar() {
  const { isOpen, close } = useSidebar()

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden"
             style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
             onClick={close} />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-50 flex flex-col w-56 shrink-0 h-screen py-6 px-3 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ borderRight: '1px solid var(--border)', background: 'rgba(10,14,26,0.98)', backdropFilter: 'blur(20px)' }}>

        <div className="flex items-center gap-2 px-3 mb-8">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm"
               style={{ background: 'var(--accent)', color: '#000' }}>A</div>
          <span className="font-semibold text-lg" style={{ color: 'var(--text)' }}>Addi</span>
          <span className="text-xs ml-auto" style={{ color: 'var(--muted)' }}>v2</span>
          <button onClick={close} className="md:hidden p-1 rounded-lg" style={{ color: 'var(--muted)' }}>
            <X size={16} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          <div className="text-xs px-3 mb-1 font-medium" style={{ color: 'var(--muted)' }}>Aðal</div>
          {NAV_PRIMARY.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={close}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[rgba(0,212,170,0.12)] text-[var(--accent)]'
                    : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface2)]'
                }`
              }>
              {({ isActive }) => (
                <>
                  <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                  {label}
                </>
              )}
            </NavLink>
          ))}

          <div className="text-xs px-3 mt-4 mb-1 font-medium" style={{ color: 'var(--muted)' }}>Verkfæri</div>
          {NAV_SECONDARY.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} onClick={close}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[rgba(0,212,170,0.12)] text-[var(--accent)]'
                    : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface2)]'
                }`
              }>
              {({ isActive }) => (
                <>
                  <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                  {label}
                </>
              )}
            </NavLink>
          ))}

          <div className="flex-1" />

          <NavLink to="/settings" onClick={close}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[rgba(0,212,170,0.12)] text-[var(--accent)]'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface2)]'
              }`
            }>
            {({ isActive }) => (
              <>
                <Settings size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                Stillingar
              </>
            )}
          </NavLink>
        </nav>

        <div className="px-3 text-xs mt-4" style={{ color: 'var(--muted)' }}>
          Arnar · Reykjavík
        </div>
      </aside>
    </>
  )
}
