import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Wallet, FileText, Timer, Settings, Trophy, Home, Briefcase } from 'lucide-react'

const NAV_PRIMARY = [
  { to: '/', icon: LayoutDashboard, label: 'Mælaborð' },
  { to: '/sports', icon: Trophy, label: 'Sport ⚽' },
  { to: '/lendo', icon: Home, label: 'Lendó' },
  { to: '/jobs', icon: Briefcase, label: 'Starf' },
  { to: '/finance', icon: Wallet, label: 'Fjármál' },
]

const NAV_SECONDARY = [
  { to: '/tasks', icon: CheckSquare, label: 'Verkefni' },
  { to: '/notes', icon: FileText, label: 'Minnisblöð' },
  { to: '/timer', icon: Timer, label: 'Tímari' },
  { to: '/settings', icon: Settings, label: 'Stillingar' },
]

function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink to={to} end={to === '/'}
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
  )
}

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 h-screen sticky top-0 py-6 px-3"
           style={{ borderRight: '1px solid var(--border)', background: 'rgba(10,14,26,0.98)' }}>
      <div className="flex items-center gap-2 px-3 mb-6">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm"
             style={{ background: 'var(--accent)', color: '#000' }}>A</div>
        <span className="font-semibold text-lg" style={{ color: 'var(--text)' }}>Addi</span>
        <span className="text-xs ml-auto" style={{ color: 'var(--muted)' }}>v1</span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_PRIMARY.map(item => <NavItem key={item.to} {...item} />)}
      </nav>

      <div className="mt-4 mb-2 px-3">
        <div className="h-px" style={{ background: 'var(--border)' }} />
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_SECONDARY.map(item => <NavItem key={item.to} {...item} />)}
      </nav>

      <div className="mt-auto px-3 text-xs" style={{ color: 'var(--muted)' }}>
        Arnar · Reykjavík 🇮🇸
      </div>
    </aside>
  )
}
