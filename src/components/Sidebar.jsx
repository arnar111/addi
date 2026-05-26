import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Wallet, FileText, Timer, Settings, Trophy } from 'lucide-react'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Mælaborð' },
  { to: '/tasks', icon: CheckSquare, label: 'Verkefni' },
  { to: '/sports', icon: Trophy, label: 'Sport' },
  { to: '/finance', icon: Wallet, label: 'Fjármál' },
  { to: '/notes', icon: FileText, label: 'Minnisblöð' },
  { to: '/timer', icon: Timer, label: 'Tímari' },
  { to: '/settings', icon: Settings, label: 'Stillingar' },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 h-screen sticky top-0 py-6 px-3"
           style={{ borderRight: '1px solid var(--border)', background: 'rgba(8,12,24,0.98)' }}>
      <div className="flex items-center gap-2.5 px-3 mb-8">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-base"
             style={{ background: 'linear-gradient(135deg, var(--accent), #00b08e)', color: '#000' }}>A</div>
        <div>
          <div className="font-bold text-base leading-tight">Addi</div>
          <div className="text-[10px]" style={{ color: 'var(--muted)' }}>Reykjavík 🇮🇸</div>
        </div>
        <span className="text-[10px] ml-auto px-1.5 py-0.5 rounded-md font-mono"
          style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>v1</span>
      </div>

      <nav className="flex flex-col gap-0.5 flex-1">
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
                <Icon size={17} strokeWidth={isActive ? 2.3 : 1.8} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="text-xs font-medium" style={{ color: 'var(--text2)' }}>Arnar Kjartansson</div>
        <div className="text-[10px] mt-0.5" style={{ color: 'var(--muted)' }}>arnar1992@gmail.com</div>
      </div>
    </aside>
  )
}
