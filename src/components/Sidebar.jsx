import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Wallet, FileText, Timer, Settings, Home, Tv2, Rocket } from 'lucide-react'

const NAV_MAIN = [
  { to: '/', icon: LayoutDashboard, label: 'Mælaborð' },
  { to: '/lendo', icon: Home, label: 'Lendó', tag: 'Rekstur' },
  { to: '/thraukarinn', icon: Tv2, label: 'Þraukarinn', tag: 'S50' },
  { to: '/finance', icon: Wallet, label: 'Fjármál' },
  { to: '/tasks', icon: CheckSquare, label: 'Verkefni' },
  { to: '/notes', icon: FileText, label: 'Minnisblöð' },
]

const NAV_BOTTOM = [
  { to: '/projects', icon: Rocket, label: 'Verkefni mín' },
  { to: '/timer', icon: Timer, label: 'Tímari' },
  { to: '/settings', icon: Settings, label: 'Stillingar' },
]

function NavItem({ to, icon: Icon, label, tag }) {
  return (
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
          <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
          <span className="flex-1">{label}</span>
          {tag && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
              style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}>{tag}</span>
          )}
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
        <span className="text-xs ml-auto" style={{ color: 'var(--muted)' }}>v2</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV_MAIN.map((item) => <NavItem key={item.to} {...item} />)}

        <div className="mt-4 mb-1 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)', opacity: 0.5 }}>
          Meira
        </div>
        {NAV_BOTTOM.map((item) => <NavItem key={item.to} {...item} />)}
      </nav>

      <div className="px-3 text-xs" style={{ color: 'var(--muted)' }}>
        Arnar · Reykjavík
      </div>
    </aside>
  )
}
