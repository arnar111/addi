import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Wallet, FileText, Timer, Settings, Link2, MoreHorizontal } from 'lucide-react'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Mælaborð' },
  { to: '/football', emoji: '⚽', label: 'Fótbolti' },
  { to: '/finance', icon: Wallet, label: 'Fjármál' },
  { to: '/links', icon: Link2, label: 'Flýtileiðir' },
  { to: '/tasks', icon: CheckSquare, label: 'Verkefni' },
  { to: '/notes', icon: FileText, label: 'Minnisblöð' },
  { to: '/timer', icon: Timer, label: 'Tímari' },
  { to: '/settings', icon: Settings, label: 'Stillingar' },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 h-screen sticky top-0 py-6 px-3"
           style={{ borderRight: '1px solid var(--border)', background: 'rgba(10,14,26,0.98)' }}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 mb-8">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
             style={{ background: 'var(--accent)', color: '#000', fontSize: 18 }}>A</div>
        <div>
          <span className="font-bold text-lg" style={{ color: 'var(--text)' }}>Addi</span>
          <div className="text-xs" style={{ color: 'var(--muted)', lineHeight: 1 }}>Reykjavík 🇮🇸</div>
        </div>
        <span className="text-xs ml-auto px-1.5 py-0.5 rounded-md"
              style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>v1</span>
      </div>

      <nav className="flex flex-col gap-0.5 flex-1">
        {NAV.map(({ to, icon: Icon, emoji, label }) => (
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
                {emoji
                  ? <span style={{ fontSize: 16, width: 18, textAlign: 'center' }}>{emoji}</span>
                  : <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
                }
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-2 rounded-xl" style={{ background: 'var(--surface2)' }}>
        <div className="text-xs font-medium" style={{ color: 'var(--text)' }}>Arnar Kjartansson</div>
        <div className="text-xs" style={{ color: 'var(--muted)' }}>arnar1992@gmail.com</div>
      </div>
    </aside>
  )
}
